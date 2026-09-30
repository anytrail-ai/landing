// Client for /es/celdas_demo. One customer message per call; the agent's
// reasoning, tool calls, PDF and email receipt all stream back as SSE events
// from the same Function URL as the other demos. The session (history with
// the agent's reasoning signatures) lives server-side; we only keep its id.
import { streamRequest } from '../demoApi'

export function celdasTurn({ sessionId, text }, handlers) {
  return streamRequest({ action: 'celdas_chat', ...(sessionId ? { sessionId } : {}), text }, handlers)
}

export function celdasFollowUp(sessionId, handlers) {
  return streamRequest({ action: 'celdas_followup', sessionId }, handlers)
}

export function pdfUrl(base64) {
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
  return URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }))
}

export const usd = (n) =>
  `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`
