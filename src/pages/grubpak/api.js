// Client for /es/grubpak_demo. Every call streams SSE from the same Function
// URL as the other demos. The server owns the session, the cart and the
// follow-up sequences; the page owns only the simulated clock, which it sends
// as simNow on every call.
import { streamRequest } from '../demoApi'

export function grubpakTurn({ sessionId, text, channel, simNow }, handlers) {
  return streamRequest({ action: 'grubpak_chat', ...(sessionId ? { sessionId } : {}), text, channel, simNow }, handlers)
}

export function grubpakFollowUp({ sessionId, sequenceId, stepId, simNow }, handlers) {
  return streamRequest({ action: 'grubpak_followup', sessionId, sequenceId, stepId, simNow }, handlers)
}

/** event: checkout_started | checkout_abandoned | purchased */
export function grubpakShop({ sessionId, event, source, simNow }, handlers) {
  return streamRequest({ action: 'grubpak_shop', sessionId, event, source, simNow }, handlers)
}

export const mxn = (n) =>
  `$${Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
