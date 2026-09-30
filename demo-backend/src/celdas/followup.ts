import { LIMITS } from '../limits';
import type { CeldasSession } from './types';

/** Marker for platform events in the conversation. Customers never get to
 * send it: stripCustomerText removes it from what they type. */
export const EVENT_TAG = '[EVENTO DEL SISTEMA]';

export function stripCustomerText(text: string): string {
  return text.split(EVENT_TAG).join('').trim();
}

export type FollowUpGate = { ok: true; number: number } | { ok: false; reason: 'no_quote' | 'closed' | 'max_reached' | 'too_soon' };

/** Whether an automatic follow-up may run now. The cadence itself is the
 * page's timer (so a presenter can skip it); this enforces the rules. */
export function followUpGate(s: CeldasSession, nowMs: number): FollowUpGate {
  if (!s.quote) return { ok: false, reason: 'no_quote' };
  if (s.closed) return { ok: false, reason: 'closed' };
  const sent = s.followUps ?? 0;
  if (sent >= LIMITS.celdasFollowUpMax) return { ok: false, reason: 'max_reached' };
  const last = s.lastActivityAt ? Date.parse(s.lastActivityAt) : 0;
  if (nowMs - last < LIMITS.celdasFollowUpMinGapMs) return { ok: false, reason: 'too_soon' };
  return { ok: true, number: sent + 1 };
}

/** When the next follow-up is due if nobody writes, or null if none will be. */
export function nextFollowUpAt(s: CeldasSession): string | null {
  if (!s.quote || s.closed || (s.followUps ?? 0) >= LIMITS.celdasFollowUpMax || !s.lastActivityAt) return null;
  const wait = (s.followUps ?? 0) === 0 ? LIMITS.celdasFollowUpFirstMs : LIMITS.celdasFollowUpEveryMs;
  return new Date(Date.parse(s.lastActivityAt) + wait).toISOString();
}

export function followUpState(s: CeldasSession) {
  return {
    count: s.followUps ?? 0,
    max: LIMITS.celdasFollowUpMax,
    closed: Boolean(s.closed),
    dueAt: nextFollowUpAt(s),
  };
}

const STAGE = [
  'Primer seguimiento: pregunta si pudo revisar la cotización y pide, en una línea, el dato pendiente más importante para cerrarla.',
  'Segundo seguimiento: más directo. Da una razón concreta para decidir ahora, tomada de la conversación (por ejemplo, que la báscula está parada, o que con el dato pendiente se completa el pedido) y pregunta si procede.',
  'Último seguimiento: ofrece que un vendedor le llame para resolver dudas y cerrar, y deja la puerta abierta sin presionar. Di que es el último mensaje de seguimiento.',
];

export function followUpEvent(number: number, s: CeldasSession, nowMs: number): string {
  const since = s.lastActivityAt ? Math.max(1, Math.round((nowMs - Date.parse(s.lastActivityAt)) / 60000)) : 0;
  return [
    `${EVENT_TAG} Seguimiento automático ${number} de ${LIMITS.celdasFollowUpMax}. El cliente no ha respondido desde hace ${since} min después de tu último mensaje (cotización ${s.quote?.folio}).`,
    STAGE[Math.min(number, STAGE.length) - 1],
    'Escríbele al cliente un solo mensaje corto (máximo tres líneas). No repitas la cotización completa ni vuelvas a generarla o enviarla. No menciones que es automático. No prometas tiempos de entrega, existencias, descuentos ni condiciones de pago: eso lo confirma el vendedor.',
  ].join('\n');
}
