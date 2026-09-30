import { z } from 'zod';
import { RateLimitedError, assertWithinRateLimit } from '../api/rate-limit';
import { LIMITS } from '../limits';
import { runCeldasTurn } from './agent';
import { getCeldasSession, newSession, putCeldasSession } from './store';

export const celdasBodySchema = z.object({
  action: z.literal('celdas_chat'),
  /** Omitted on the first message: the server opens the session. */
  sessionId: z.string().uuid().optional(),
  text: z.string().trim().min(1).max(2000),
});
export type CeldasBody = z.infer<typeof celdasBodySchema>;

type Emit = (event: string, data: unknown) => void;

export async function handleCeldasAction(body: CeldasBody, ip: string, emit: Emit): Promise<void> {
  try {
    const session = body.sessionId ? await getCeldasSession(body.sessionId) : newSession();
    if (!session) return emit('error', { error: 'unknown_session' });
    if (session.userTurns >= LIMITS.celdasMessagesPerSession) return emit('error', { error: 'session_full' });
    await assertWithinRateLimit(ip, Date.now(), { bucket: 'celdas', cap: LIMITS.celdasTurnsPerIp });
    emit('session', { sessionId: session.sessionId });

    // Persist only a completed turn: a turn that dies mid-loop could leave a
    // tool call without its result, which Converse rejects on every later
    // call. The page rolls its copy back on 'error' the same way.
    await runCeldasTurn(session, body.text, ip, emit);
    await putCeldasSession(session);
    console.log('celdas_turn', JSON.stringify({ sessionId: session.sessionId, turn: session.userTurns, folio: session.quote?.folio ?? null }));
    emit('done', {});
  } catch (err) {
    if (err instanceof RateLimitedError) return emit('error', { error: 'rate_limited' });
    console.error('celdas_turn_failed', err);
    emit('error', { error: 'chat_failed' });
  }
}
