import type { Tool, ToolInputSchema } from '@aws-sdk/client-bedrock-runtime';
import { z } from 'zod';
import { RateLimitedError, assertWithinRateLimit } from '../api/rate-limit';
import { LIMITS } from '../limits';
import { UnknownPartError, priceLines, sizeCells } from './catalog';
import { quoteFilename, sendQuoteEmail } from './email';
import { renderQuotePdf } from './pdf';
import { COMPANY } from './prompt';
import { newFolio } from './store';
import type { CeldasQuote, CeldasSession, Decision, Handoff } from './types';

const KG_TO_LB = 2.20462;

const summary = z.object({
  aplicacion: z.string().min(1).max(300),
  ambiente: z.string().min(1).max(300),
  reemplazo_o_nuevo: z.string().min(1).max(300),
});
const list = z.array(z.string().min(1).max(400)).max(12).default([]);

const sizingInput = z.object({
  capacidad_maxima: z.number().positive().max(1_000_000),
  peso_muerto: z.number().min(0).max(1_000_000),
  unidad: z.enum(['lb', 'kg']).default('lb'),
  num_celdas: z.number().int().min(1).max(32),
  impacto: z.boolean(),
});

const quoteInput = z.object({
  cliente: z.object({
    nombre: z.string().min(1).max(120),
    empresa: z.string().max(160).optional(),
    email: z.string().email().max(254),
  }),
  partidas: z.array(z.object({ numero_parte: z.string().min(1).max(40), cantidad: z.number().int().min(1).max(999) })).min(1).max(10),
  resumen: summary,
  adicionales_sugeridos: list,
  notas_para_cliente: list,
  pendientes: list,
  alertas: list,
});

const handoffInput = z.object({
  decision: z.enum(['Referir a otro producto', 'Escalar a humano']),
  resumen: summary,
  producto_referido: z.string().max(300).optional(),
  pendientes: list,
  alertas: list,
});

const acceptInput = z.object({
  detalle: z.string().min(1).max(400),
  siguiente_paso: z.string().min(1).max(400),
});

const schema = (properties: Record<string, unknown>, required: string[]): ToolInputSchema => ({
  json: { type: 'object', properties, required, additionalProperties: false } as never,
});
const strList = (description: string) => ({ type: 'array', items: { type: 'string' }, description });
const summarySchema = {
  type: 'object',
  description: 'RESUMEN del formato de salida al vendedor.',
  properties: {
    aplicacion: { type: 'string', description: 'Aplicación / tipo de báscula.' },
    ambiente: { type: 'string' },
    reemplazo_o_nuevo: { type: 'string', description: 'Reemplazo (marca/modelo de la celda dañada) o equipo nuevo.' },
  },
  required: ['aplicacion', 'ambiente', 'reemplazo_o_nuevo'],
  additionalProperties: false,
};

export const TOOLS: Tool[] = [
  {
    toolSpec: {
      name: 'dimensionar_celdas',
      description:
        'Calcula la capacidad por celda para equipo nuevo o adaptación con la regla del árbol de decisión ((capacidad máxima + peso muerto) ÷ celdas × 1.25, o × 1.5 con impacto) y devuelve el 350NUS que corresponde, incluyendo el comparativo cuando el cálculo pasa de 5 klb. Úsala siempre en lugar de calcular tú.',
      inputSchema: schema(
        {
          capacidad_maxima: { type: 'number', description: 'Capacidad máxima de la báscula.' },
          peso_muerto: { type: 'number', description: 'Peso muerto de plataforma/tanque. 0 si el cliente confirma que no hay.' },
          unidad: { type: 'string', enum: ['lb', 'kg'] },
          num_celdas: { type: 'integer' },
          impacto: { type: 'boolean', description: 'Cargas de impacto o laterales (montacargas, cargas que caen).' },
        },
        ['capacidad_maxima', 'peso_muerto', 'unidad', 'num_celdas', 'impacto'],
      ),
    },
  },
  {
    toolSpec: {
      name: 'generar_cotizacion',
      description:
        'Genera la cotización en PDF con precios del catálogo (los pone el sistema, no tú) y la muestra al cliente en el chat. Solo con capacidad confirmada, decisión "Cotizar 350N", y nombre y correo del cliente. Incluye el resumen para el vendedor.',
      inputSchema: schema(
        {
          cliente: {
            type: 'object',
            properties: { nombre: { type: 'string' }, empresa: { type: 'string' }, email: { type: 'string' } },
            required: ['nombre', 'email'],
            additionalProperties: false,
          },
          partidas: {
            type: 'array',
            items: {
              type: 'object',
              properties: { numero_parte: { type: 'string', description: 'Exacto del catálogo, p. ej. 350NUS002.' }, cantidad: { type: 'integer' } },
              required: ['numero_parte', 'cantidad'],
              additionalProperties: false,
            },
          },
          resumen: summarySchema,
          adicionales_sugeridos: strList('Monturas, cable, calibración, juego completo: se listan en el PDF como adicionales a cotizar aparte.'),
          notas_para_cliente: strList('Notas cortas que sí debe ver el cliente en el PDF (p. ej. por qué juego completo).'),
          pendientes: strList('PENDIENTES: datos que faltan y qué pedirle al cliente. Solo para el vendedor.'),
          alertas: strList('ALERTAS: legal para comercio, sufijo -SE, mezcla de celdas, cálculo cerca de 5 klb, báscula parada. Solo para el vendedor.'),
        },
        ['cliente', 'partidas', 'resumen', 'adicionales_sugeridos', 'notas_para_cliente', 'pendientes', 'alertas'],
      ),
    },
  },
  {
    toolSpec: {
      name: 'enviar_cotizacion_por_correo',
      description: 'Envía por correo, con el PDF adjunto, la última cotización generada al correo que dio el cliente.',
      inputSchema: schema({ folio: { type: 'string' } }, ['folio']),
    },
  },
  {
    toolSpec: {
      name: 'entregar_a_vendedor',
      description:
        'Cuando la decisión NO es cotizar 350N (referir a otro producto o escalar a humano): entrega al vendedor el resumen, el producto al que se refiere, pendientes y alertas.',
      inputSchema: schema(
        {
          decision: { type: 'string', enum: ['Referir a otro producto', 'Escalar a humano'] },
          resumen: summarySchema,
          producto_referido: { type: 'string', description: 'p. ej. celda inoxidable IP68, single-point, viga de doble apoyo.' },
          pendientes: strList('Datos que faltan.'),
          alertas: strList('Alertas para el vendedor.'),
        },
        ['decision', 'resumen', 'pendientes', 'alertas'],
      ),
    },
  },
  {
    toolSpec: {
      name: 'registrar_aceptacion',
      description:
        'Cuando el cliente acepta comprar lo cotizado (dice que sí, pide que se levante el pedido, pregunta cómo pagar o manda orden de compra). Avisa al vendedor para cerrar y detiene los seguimientos. No la uses si solo agradece o dice que lo va a revisar.',
      inputSchema: schema(
        {
          detalle: { type: 'string', description: 'Qué aceptó el cliente, con folio, partidas y condiciones que mencionó.' },
          siguiente_paso: { type: 'string', description: 'Qué debe hacer el vendedor ahora (p. ej. enviar datos de pago, confirmar entrega urgente).' },
        },
        ['detalle', 'siguiente_paso'],
      ),
    },
  },
];

/** What a tool run produces: the JSON the model reads back, and the events
 * the page renders (tool card, PDF bubble, email receipt, handoff card). */
export interface ToolOutcome {
  ok: boolean;
  result: Record<string, unknown>;
  /** One line for the reasoning panel. */
  label: string;
  events: { event: string; data: unknown }[];
}

const fail = (label: string, error: string): ToolOutcome => ({ ok: false, result: { error }, label, events: [] });

function handoff(decision: Decision, s: z.infer<typeof summary>, extra: Partial<Handoff>): Handoff {
  return {
    decision,
    summary: { application: s.aplicacion, environment: s.ambiente, replacementOrNew: s.reemplazo_o_nuevo },
    referral: null,
    quoteFolio: null,
    pending: [],
    alerts: [],
    accepted: null,
    ...extra,
  };
}

export async function runTool(name: string, raw: unknown, session: CeldasSession, ip: string): Promise<ToolOutcome> {
  if (name === 'dimensionar_celdas') {
    const p = sizingInput.safeParse(raw);
    if (!p.success) return fail('Dimensionamiento: datos incompletos', `invalid_input: ${p.error.issues.map((i) => i.path.join('.')).join(', ')}`);
    const k = p.data.unidad === 'kg' ? KG_TO_LB : 1;
    const r = sizeCells({
      capacityLb: Math.round(p.data.capacidad_maxima * k),
      deadLoadLb: Math.round(p.data.peso_muerto * k),
      cells: p.data.num_celdas,
      impact: p.data.impacto,
    });
    const rec = r.recommended;
    return {
      ok: true,
      result: {
        calculo: r.explanation,
        recomendado: rec.part ? { numero_parte: rec.part.partNumber, cantidad: rec.cells, total_usd: rec.totalUsd } : null,
        comparativo: r.alternative?.part
          ? { numero_parte: r.alternative.part.partNumber, cantidad: r.alternative.cells, total_usd: r.alternative.totalUsd }
          : null,
      },
      label: rec.part ? `${rec.cells} × ${rec.part.partNumber}` : 'Sin 350N que aplique',
      events: [{ event: 'calc', data: { explanation: r.explanation } }],
    };
  }

  if (name === 'generar_cotizacion') {
    const p = quoteInput.safeParse(raw);
    if (!p.success) return fail('Cotización: faltan datos', `invalid_input: ${p.error.issues.map((i) => `${i.path.join('.')} ${i.message}`).join('; ')}`);
    let priced: ReturnType<typeof priceLines>;
    try {
      priced = priceLines(p.data.partidas.map((l) => ({ partNumber: l.numero_parte, qty: l.cantidad })));
    } catch (err) {
      if (err instanceof UnknownPartError) return fail('Número de parte inválido', `Números de parte que no existen en el catálogo: ${err.partNumbers.join(', ')}`);
      throw err;
    }
    const d = p.data;
    const quote: CeldasQuote = {
      folio: newFolio(),
      date: new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Mexico_City' }),
      company: COMPANY,
      customer: { name: d.cliente.nombre, company: d.cliente.empresa?.trim() || null, email: d.cliente.email.trim() },
      summary: { application: d.resumen.aplicacion, environment: d.resumen.ambiente, replacementOrNew: d.resumen.reemplazo_o_nuevo },
      lines: priced.lines,
      totalUsd: priced.totalUsd,
      extras: d.adicionales_sugeridos,
      notes: [...priced.alerts, ...d.notas_para_cliente],
    };
    const pdf = await renderQuotePdf(quote);
    session.quote = quote;
    // A new or revised quote restarts the follow-up sequence.
    session.followUps = 0;
    const alerts = [...new Set([...priced.alerts, ...d.alertas])];
    session.handoff = handoff('Cotizar 350N', d.resumen, { quoteFolio: quote.folio, pending: d.pendientes, alerts });
    return {
      ok: true,
      result: { folio: quote.folio, total_usd: quote.totalUsd, partidas: priced.lines.map((l) => `${l.qty} × ${l.partNumber} = $${l.totalUsd}`), mostrado_al_cliente: true },
      label: `Folio ${quote.folio} · $${quote.totalUsd.toLocaleString('en-US')} USD`,
      events: [
        { event: 'quote', data: { quote, pdfBase64: Buffer.from(pdf).toString('base64'), filename: quoteFilename(quote) } },
        { event: 'handoff', data: session.handoff },
      ],
    };
  }

  if (name === 'enviar_cotizacion_por_correo') {
    const q = session.quote;
    if (!q) return fail('Correo: no hay cotización', 'Primero genera la cotización con generar_cotizacion.');
    if (session.emailedTo.includes(`${q.folio}:${q.customer.email}`)) {
      return { ok: true, result: { enviado: true, a: q.customer.email, nota: 'ya se había enviado' }, label: `Ya enviada a ${q.customer.email}`, events: [] };
    }
    try {
      await assertWithinRateLimit(ip, Date.now(), { bucket: 'celdas_email', cap: LIMITS.celdasEmailPerIp });
      await assertWithinRateLimit('GLOBAL', Date.now(), { bucket: 'celdas_email', cap: LIMITS.celdasEmailGlobal });
      await sendQuoteEmail(q, await renderQuotePdf(q));
    } catch (err) {
      const why = err instanceof RateLimitedError ? 'límite de correos de la demo alcanzado' : 'el servicio de correo falló';
      console.error('celdas_email_tool_failed', err);
      return fail('Correo no enviado', `No se pudo enviar: ${why}. Dile al cliente que ya tiene el PDF en el chat y que el vendedor se lo reenvía.`);
    }
    session.emailedTo.push(`${q.folio}:${q.customer.email}`);
    return {
      ok: true,
      result: { enviado: true, a: q.customer.email, folio: q.folio },
      label: `Enviada a ${q.customer.email}`,
      events: [{ event: 'email', data: { to: q.customer.email, folio: q.folio } }],
    };
  }

  if (name === 'entregar_a_vendedor') {
    const p = handoffInput.safeParse(raw);
    if (!p.success) return fail('Entrega: datos incompletos', `invalid_input: ${p.error.issues.map((i) => i.path.join('.')).join(', ')}`);
    const h = handoff(p.data.decision, p.data.resumen, {
      referral: p.data.producto_referido ?? null,
      pending: p.data.pendientes,
      alerts: p.data.alertas,
    });
    session.handoff = h;
    return { ok: true, result: { entregado: true }, label: p.data.decision, events: [{ event: 'handoff', data: h }] };
  }

  if (name === 'registrar_aceptacion') {
    const p = acceptInput.safeParse(raw);
    if (!p.success) return fail('Aceptación: datos incompletos', 'invalid_input: detalle y siguiente_paso son obligatorios');
    if (!session.quote) return fail('Aceptación sin cotización', 'Todavía no hay cotización generada: primero cotiza.');
    session.closed = true;
    const accepted = { detail: p.data.detalle, nextStep: p.data.siguiente_paso };
    const base = session.handoff ?? handoff('Cotizar 350N', { aplicacion: session.quote.summary.application, ambiente: session.quote.summary.environment, reemplazo_o_nuevo: session.quote.summary.replacementOrNew }, { quoteFolio: session.quote.folio });
    session.handoff = { ...base, accepted };
    return {
      ok: true,
      result: { registrado: true, seguimientos_detenidos: true },
      label: 'Cliente aceptó · seguimiento detenido',
      events: [{ event: 'handoff', data: session.handoff }],
    };
  }

  return fail(`Herramienta desconocida: ${name}`, 'unknown_tool');
}
