// Follow-up sequences. The server owns them: which one runs depends on what
// the customer did in the (mocked) Shopify store, and buying cancels the
// abandoned-cart reminders. The page only owns the simulated clock and asks
// for a step when it falls due.
import { EVENT_TAG } from '../celdas/followup';
import { mxn } from './catalog';
import type { Channel, GrubpakSession, Sequence, SequenceName, StepAction } from './types';

const H = 60;
const D = 24 * H;

interface StepDef {
  id: string;
  afterMin: number;
  title: string;
  channel: Channel;
  subject?: string;
  action: StepAction;
  instruction: string;
}

export const SEQUENCE_LABEL: Record<SequenceName, string> = {
  sin_clic: 'No entró a la tienda',
  carrito_abandonado: 'Carrito abandonado',
  post_compra: 'Post-compra y recompra',
};

function defs(name: SequenceName, s: GrubpakSession): StepDef[] {
  const biz = s.lead?.business ?? 'tu negocio';
  if (name === 'sin_clic')
    return [
      { id: 'recordatorio', afterMin: 30, title: 'Recordatorio del paquete', channel: 'wa', action: 'cart', instruction: 'El cliente recibió su link de compra hace 30 minutos y no ha entrado a la tienda. Escríbele un recordatorio corto: su paquete sigue armado, envío gratis sin mínimos, y el descuento por paquete si aplica. Invítalo a tocar el botón.' },
      { id: 'cotizacion', afterMin: D, title: 'Cotización por correo', channel: 'email', subject: `Tu paquete Grubpak para ${biz}`, action: 'cart', instruction: 'Pasó un día y no ha entrado a la tienda. Escribe el cuerpo de un correo breve (4 a 6 líneas): saludo, el paquete (productos y total), cuántos días le dura con su volumen, y la invitación a comprar. Firma como "Ventas Grubpak".' },
    ];
  if (name === 'carrito_abandonado')
    return [
      { id: 'duda', afterMin: H, title: 'Pregunta por dudas', channel: 'wa', action: 'resume', instruction: 'Entró al checkout de Shopify hace una hora y no pagó. Pregúntale con naturalidad si le quedó alguna duda (medidas, entrega, forma de pago). Sin presionar.' },
      { id: 'incentivo', afterMin: D, title: 'Incentivo VUELVE5', channel: 'email', subject: 'Tu carrito sigue apartado', action: 'resume', instruction: 'Pasó un día desde que abandonó el checkout. Escribe el cuerpo de un correo breve: su carrito sigue listo y puede usar el código VUELVE5 para 5% adicional durante 48 horas. Firma como "Ventas Grubpak".' },
      { id: 'muestras', afterMin: 3 * D, title: 'Muestras o asesor', channel: 'wa', action: 'resume', instruction: 'Pasaron 3 días y no ha comprado. Ofrécele mandarle muestras sin costo para probar, o que un asesor le llame. Pídele que responda MUESTRAS o ASESOR.' },
      { id: 'ultimo', afterMin: 7 * D, title: 'Último recordatorio', channel: 'email', subject: '¿Cerramos tu pedido?', action: 'resume', instruction: 'Pasó una semana. Escribe el cuerpo de un último correo, corto y sin presión: pregúntale qué le faltó para decidirse y dile que es el último recordatorio. Firma como "Ventas Grubpak".' },
    ];
  const order = s.orders[s.orders.length - 1];
  const days = s.cart?.supplyDays ?? 14;
  const reorderAt = Math.max(6, days - 3) * D;
  return [
    { id: 'confirmacion', afterMin: 1, title: 'Confirmación de pedido', channel: 'wa', action: null, instruction: `El cliente acaba de pagar el pedido ${order?.number} por ${mxn(order?.totalMxn ?? 0)}. Agradécele y confirma el pedido en dos líneas. Dile que le avisas por aquí cuando salga a ruta.` },
    { id: 'en_camino', afterMin: 2 * D, title: 'Pedido en camino', channel: 'wa', action: null, instruction: `Avísale que su pedido ${order?.number} ya va en camino. No prometas una hora exacta de entrega.` },
    { id: 'satisfaccion', afterMin: 5 * D, title: 'Cómo le fue', channel: 'wa', action: null, instruction: 'Ya tiene sus empaques desde hace unos días. Pregúntale cómo le funcionaron con sus clientes y pídele que te cuente si algo no le gustó.' },
    { id: 'recompra', afterMin: reorderAt, title: 'Recompra: se acaba el inventario', channel: 'wa', action: 'reorder', instruction: `Su pedido le alcanzaba para unos ${days} días con su volumen, así que le quedan unos 3 días de empaque. Ofrécele repetir el mismo pedido en un clic para que no se quede sin empaques.` },
    { id: 'recompra_2', afterMin: Math.max(reorderAt + 2 * D, (days + 2) * D), title: 'Recompra: segundo aviso', channel: 'email', subject: 'Que no te falten empaques', action: 'reorder', instruction: 'No ha repetido su pedido y ya debería estar por acabarse. Escribe el cuerpo de un correo breve recordándole que puede repetir su pedido en un clic con el mismo descuento por paquete. Firma como "Ventas Grubpak".' },
  ];
}

export function startSequence(s: GrubpakSession, name: SequenceName, simNow: string): Sequence {
  const t0 = Date.parse(simNow);
  const seq: Sequence = {
    id: `${name}-${s.sequences.length + 1}`,
    name,
    label: SEQUENCE_LABEL[name],
    startedAt: simNow,
    steps: defs(name, s).map((d) => ({
      id: d.id,
      title: d.title,
      channel: d.channel,
      subject: d.subject ?? null,
      action: d.action,
      instruction: d.instruction,
      at: new Date(t0 + d.afterMin * 60_000).toISOString(),
      status: 'pending',
    })),
  };
  s.sequences.push(seq);
  return seq;
}

/** Cancels every pending step of the named sequences. Returns how many. */
export function cancelSequences(s: GrubpakSession, names: SequenceName[], reason: string): number {
  let n = 0;
  for (const seq of s.sequences)
    if (names.includes(seq.name))
      for (const step of seq.steps)
        if (step.status === 'pending') {
          step.status = 'cancelled';
          step.reason = reason;
          n++;
        }
  return n;
}

export const hasPending = (s: GrubpakSession, name: SequenceName) =>
  s.sequences.some((q) => q.name === name && q.steps.some((st) => st.status === 'pending'));

export type StepGate =
  | { ok: true; seq: Sequence; index: number }
  | { ok: false; reason: 'unknown_step' | 'not_pending' | 'not_due' };

export function stepGate(s: GrubpakSession, sequenceId: string, stepId: string, simNow: string): StepGate {
  const seq = s.sequences.find((q) => q.id === sequenceId);
  const index = seq?.steps.findIndex((st) => st.id === stepId) ?? -1;
  if (!seq || index === -1) return { ok: false, reason: 'unknown_step' };
  const step = seq.steps[index];
  if (step.status !== 'pending') return { ok: false, reason: 'not_pending' };
  if (Date.parse(step.at) > Date.parse(simNow)) return { ok: false, reason: 'not_due' };
  return { ok: true, seq, index };
}

const CHANNEL_RULE: Record<Channel, string> = {
  wa: 'Canal: WhatsApp. Un solo mensaje corto, máximo tres líneas, texto plano.',
  email: 'Canal: correo. Escribe solo el cuerpo del correo (el asunto ya está puesto), en párrafos cortos, texto plano, sin markdown.',
};

export function followUpText(seq: Sequence, index: number, notes: string[]): string {
  const step = seq.steps[index];
  return [
    `${EVENT_TAG} Seguimiento automático: secuencia "${seq.label}", paso ${index + 1} de ${seq.steps.length} (${step.title}).`,
    ...notes,
    step.instruction,
    CHANNEL_RULE[step.channel],
    step.action ? 'El sistema agrega debajo de tu mensaje un botón con el link a la tienda: no escribas URLs ni llames crear_link_checkout.' : 'No incluyas links.',
    'No menciones que es un mensaje automático. No prometas existencias, fechas exactas ni descuentos distintos a los indicados.',
  ].join('\n');
}

/** What the page needs to draw the timeline (instructions stay server-side). */
export function publicSequences(s: GrubpakSession) {
  return s.sequences.map((q) => ({
    id: q.id,
    name: q.name,
    label: q.label,
    startedAt: q.startedAt,
    steps: q.steps.map(({ instruction: _omit, ...rest }) => rest),
  }));
}
