import { z } from 'zod';
import { RateLimitedError, assertWithinRateLimit } from '../api/rate-limit';
import { EVENT_TAG, stripCustomerText } from '../celdas/followup';
import { LIMITS } from '../limits';
import { runGrubpakTurn } from './agent';
import { mxn } from './catalog';
import { cancelSequences, followUpText, hasPending, publicSequences, startSequence, stepGate } from './sequences';
import { getGrubpakSession, newSession, putGrubpakSession } from './store';
import type { GrubpakSession } from './types';

const simNow = z.string().datetime();

export const grubpakBodySchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('grubpak_chat'),
    sessionId: z.string().uuid().optional(),
    text: z.string().trim().min(1).max(2000),
    /** Site chat widget, or a WhatsApp reply to a follow-up. */
    channel: z.enum(['web', 'wa']).default('web'),
    simNow,
  }),
  /** A follow-up step fell due on the page's simulated clock. */
  z.object({ action: z.literal('grubpak_followup'), sessionId: z.string().uuid(), sequenceId: z.string().max(60), stepId: z.string().max(60), simNow }),
  /** What the customer did in the mocked Shopify checkout (stands in for the
   * checkouts/create and orders/create webhooks). No model call. */
  z.object({
    action: z.literal('grubpak_shop'),
    sessionId: z.string().uuid(),
    event: z.enum(['checkout_started', 'checkout_abandoned', 'purchased']),
    source: z.enum(['chat', 'cart', 'resume', 'reorder']).default('chat'),
    simNow,
  }),
]);
export type GrubpakBody = z.infer<typeof grubpakBodySchema>;

type Emit = (event: string, data: unknown) => void;

const SOURCE_LABEL = { chat: 'desde el chat', cart: 'desde un recordatorio', resume: 'retomó su carrito', reorder: 'recompra' } as const;

function shopEvent(s: GrubpakSession, body: Extract<GrubpakBody, { action: 'grubpak_shop' }>, emit: Emit): string | null {
  if (!s.lead || !s.cart || !s.checkoutUrl) return 'no_checkout';
  const total = mxn(s.cart.totalMxn);
  if (body.event === 'checkout_started') {
    cancelSequences(s, ['sin_clic'], 'entró al checkout');
    if (!hasPending(s, 'carrito_abandonado')) startSequence(s, 'carrito_abandonado', body.simNow);
    s.notes.push(`${EVENT_TAG} Shopify: el cliente abrió el checkout (${SOURCE_LABEL[body.source]}), total ${total}.`);
    emit('shop', { topic: 'checkouts/create', detail: `${SOURCE_LABEL[body.source]} · ${total}` });
  } else if (body.event === 'checkout_abandoned') {
    s.notes.push(`${EVENT_TAG} Shopify: el cliente cerró el checkout sin pagar.`);
    emit('shop', { topic: 'checkouts/abandoned', detail: 'Cerró sin pagar' });
  } else {
    const order = { number: `#GP${1041 + s.orders.length}`, totalMxn: s.cart.totalMxn, at: body.simNow };
    s.orders.push(order);
    cancelSequences(s, ['sin_clic', 'carrito_abandonado'], 'compró');
    cancelSequences(s, ['post_compra'], 'nuevo pedido');
    startSequence(s, 'post_compra', body.simNow);
    s.notes.push(`${EVENT_TAG} Shopify: el cliente pagó el pedido ${order.number} por ${total}.`);
    emit('shop', { topic: 'orders/create', detail: `${order.number} · ${total}` });
    emit('order', order);
  }
  return null;
}

export async function handleGrubpakAction(body: GrubpakBody, ip: string, emit: Emit): Promise<void> {
  try {
    const session = body.action === 'grubpak_chat' && !body.sessionId ? newSession() : await getGrubpakSession(body.sessionId!);
    if (!session) return emit('error', { error: 'unknown_session' });

    if (body.action === 'grubpak_shop') {
      const err = shopEvent(session, body, emit);
      if (err) return emit('error', { error: err });
      await putGrubpakSession(session);
      emit('sequences', publicSequences(session));
      return emit('done', {});
    }

    let text: string;
    if (body.action === 'grubpak_followup') {
      const gate = stepGate(session, body.sequenceId, body.stepId, body.simNow);
      if (!gate.ok) {
        emit('sequences', publicSequences(session));
        return emit('error', { error: `followup_${gate.reason}` });
      }
      const last = session.lastFollowUpAt ? Date.parse(session.lastFollowUpAt) : 0;
      if (Date.now() - last < LIMITS.grubpakFollowUpMinGapMs) return emit('error', { error: 'followup_too_soon' });
      const step = gate.seq.steps[gate.index];
      step.status = 'sent';
      session.lastFollowUpAt = new Date().toISOString();
      text = followUpText(gate.seq, gate.index, session.notes);
      emit('followup', { sequenceId: gate.seq.id, stepId: step.id, title: step.title, channel: step.channel, subject: step.subject, action: step.action });
      emit('sequences', publicSequences(session));
    } else {
      if (session.userTurns >= LIMITS.grubpakMessagesPerSession) return emit('error', { error: 'session_full' });
      const customer = stripCustomerText(body.text);
      if (!customer) return emit('error', { error: 'invalid_input' });
      session.userTurns += 1;
      // A reply pauses the sales reminders; the agent takes it from here.
      if (body.channel === 'wa' && cancelSequences(session, ['sin_clic', 'carrito_abandonado'], 'el cliente respondió'))
        emit('sequences', publicSequences(session));
      text = session.notes.length || body.channel === 'wa'
        ? [...session.notes, `Mensaje del cliente${body.channel === 'wa' ? ' por WhatsApp' : ''}: ${customer}`].join('\n')
        : customer;
    }
    session.notes = [];
    await assertWithinRateLimit(ip, Date.now(), { bucket: 'grubpak', cap: LIMITS.grubpakTurnsPerIp });
    emit('session', { sessionId: session.sessionId });

    // Persist only a completed turn, as in celdas: a turn that dies mid-loop
    // could leave a tool call without its result.
    await runGrubpakTurn(session, text, body.simNow, emit);
    await putGrubpakSession(session);
    console.log(
      'grubpak_turn',
      JSON.stringify({ sessionId: session.sessionId, action: body.action, turn: session.userTurns, lead: session.lead?.id ?? null, orders: session.orders.length }),
    );
    emit('sequences', publicSequences(session));
    emit('done', {});
  } catch (err) {
    if (err instanceof RateLimitedError) return emit('error', { error: 'rate_limited' });
    console.error('grubpak_turn_failed', err);
    emit('error', { error: 'chat_failed' });
  }
}
