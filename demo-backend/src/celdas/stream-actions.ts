import { z } from 'zod';
import { RateLimitedError, assertWithinRateLimit } from '../api/rate-limit';
import { LIMITS } from '../limits';
import { runCeldasTurn } from './agent';
import { followUpEvent, followUpGate, followUpState, stripCustomerText } from './followup';
import { getCeldasSession, newSession, putCeldasSession } from './store';

export const celdasBodySchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('celdas_chat'),
    /** Omitted on the first message: the server opens the session. */
    sessionId: z.string().uuid().optional(),
    text: z.string().trim().min(1).max(2000),
  }),
  /** The page's follow-up timer fired (or the presenter pressed "Enviar
   * ahora"); followUpGate decides whether one is actually allowed. */
  z.object({ action: z.literal('celdas_followup'), sessionId: z.string().uuid() }),
]);
export type CeldasBody = z.infer<typeof celdasBodySchema>;

type Emit = (event: string, data: unknown) => void;

export async function handleCeldasAction(body: CeldasBody, ip: string, emit: Emit, nowMs = Date.now()): Promise<void> {
  try {
    const session = body.action === 'celdas_chat' && !body.sessionId ? newSession() : await getCeldasSession(body.sessionId!);
    if (!session) return emit('error', { error: 'unknown_session' });

    let text: string;
    if (body.action === 'celdas_followup') {
      const gate = followUpGate(session, nowMs);
      if (!gate.ok) {
        emit('followup_state', followUpState(session));
        return emit('error', { error: `followup_${gate.reason}` });
      }
      session.followUps = gate.number;
      text = followUpEvent(gate.number, session, nowMs);
      emit('followup', { number: gate.number, max: LIMITS.celdasFollowUpMax });
    } else {
      if (session.userTurns >= LIMITS.celdasMessagesPerSession) return emit('error', { error: 'session_full' });
      text = stripCustomerText(body.text);
      if (!text) return emit('error', { error: 'invalid_input' });
      session.userTurns += 1;
    }
    await assertWithinRateLimit(ip, nowMs, { bucket: 'celdas', cap: LIMITS.celdasTurnsPerIp });
    emit('session', { sessionId: session.sessionId });

    // Persist only a completed turn: a turn that dies mid-loop could leave a
    // tool call without its result, which Converse rejects on every later
    // call. The page rolls its copy back on 'error' the same way.
    await runCeldasTurn(session, text, ip, emit);
    // Silence counts from the end of the agent's reply, not the request.
    session.lastActivityAt = new Date().toISOString();
    await putCeldasSession(session);
    console.log(
      'celdas_turn',
      JSON.stringify({ sessionId: session.sessionId, action: body.action, turn: session.userTurns, folio: session.quote?.folio ?? null, followUps: session.followUps ?? 0, closed: Boolean(session.closed) }),
    );
    emit('followup_state', followUpState(session));
    emit('done', {});
  } catch (err) {
    if (err instanceof RateLimitedError) return emit('error', { error: 'rate_limited' });
    console.error('celdas_turn_failed', err);
    emit('error', { error: 'chat_failed' });
  }
}
