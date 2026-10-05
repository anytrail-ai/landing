import type { Tool, ToolInputSchema } from '@aws-sdk/client-bedrock-runtime';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { PRODUCT_KEYS, buildCart, cartPermalink, mxn, scoreLead, type ProductKey } from './catalog';
import { cancelSequences, publicSequences, startSequence } from './sequences';
import type { GrubpakSession } from './types';

const productKey = z.enum(PRODUCT_KEYS as [ProductKey, ...ProductKey[]]);

const qualifyInput = z.object({
  tipo_negocio: z.string().min(1).max(120),
  pedidos_por_dia: z.number().positive().max(100_000),
  que_sirve: z.array(z.string().min(1).max(80)).max(10).default([]),
  empaque_actual: z.string().min(1).max(120),
  urgencia: z.enum(['esta_semana', 'este_mes', 'cotizando']),
  nombre: z.string().min(1).max(120),
  negocio: z.string().min(1).max(160),
  whatsapp: z.string().min(6).max(40),
});

const cartInput = z.object({
  productos: z.array(productKey).min(1).max(5),
  dias_inventario: z.number().int().min(3).max(90).default(14),
  paquetes: z.array(z.object({ producto: productKey, cantidad: z.number().int().min(0).max(999) })).max(5).optional(),
});

const escalateInput = z.object({ motivo: z.string().min(1).max(400) });

const schema = (properties: Record<string, unknown>, required: string[]): ToolInputSchema => ({
  json: { type: 'object', properties, required, additionalProperties: false } as never,
});

export const TOOLS: Tool[] = [
  {
    toolSpec: {
      name: 'registrar_calificacion',
      description: 'Registra las respuestas de calificación en el CRM y devuelve el score del lead. Llámala cuando tengas todas las respuestas, incluidos nombre, negocio y WhatsApp.',
      inputSchema: schema(
        {
          tipo_negocio: { type: 'string' },
          pedidos_por_dia: { type: 'number', description: 'Pedidos para llevar por día. Si da un rango, usa el punto medio.' },
          que_sirve: { type: 'array', items: { type: 'string' } },
          empaque_actual: { type: 'string' },
          urgencia: { type: 'string', enum: ['esta_semana', 'este_mes', 'cotizando'] },
          nombre: { type: 'string' },
          negocio: { type: 'string' },
          whatsapp: { type: 'string' },
        },
        ['tipo_negocio', 'pedidos_por_dia', 'que_sirve', 'empaque_actual', 'urgencia', 'nombre', 'negocio', 'whatsapp'],
      ),
    },
  },
  {
    toolSpec: {
      name: 'armar_paquete',
      description: 'Arma el carrito: reparte los pedidos diarios entre los productos, redondea a paquetes completos y aplica el descuento "Arma tu paquete". Requiere registrar_calificacion antes. Usa "paquetes" solo si el cliente pide cantidades específicas.',
      inputSchema: schema(
        {
          productos: { type: 'array', items: { type: 'string', enum: PRODUCT_KEYS } },
          dias_inventario: { type: 'integer', description: 'Días que debe durar el pedido. 14 por defecto.' },
          paquetes: {
            type: 'array',
            items: { type: 'object', properties: { producto: { type: 'string', enum: PRODUCT_KEYS }, cantidad: { type: 'integer' } }, required: ['producto', 'cantidad'], additionalProperties: false },
          },
        },
        ['productos'],
      ),
    },
  },
  {
    toolSpec: {
      name: 'crear_link_checkout',
      description: 'Crea el link de la tienda Shopify con el carrito ya cargado y se lo muestra al cliente como botón. Arranca el seguimiento si no entra a la tienda.',
      inputSchema: schema({}, []),
    },
  },
  {
    toolSpec: {
      name: 'escalar_a_ejecutivo',
      description: 'Asigna el lead a un ejecutivo humano de mayoreo (300+ pedidos al día, crédito, factura, empaque personalizado o algo que no puedes resolver).',
      inputSchema: schema({ motivo: { type: 'string' } }, ['motivo']),
    },
  },
];

export interface ToolOutcome {
  ok: boolean;
  result: Record<string, unknown>;
  label: string;
  events: { event: string; data: unknown }[];
}

const fail = (label: string, error: string): ToolOutcome => ({ ok: false, result: { error }, label, events: [] });
const issues = (e: z.ZodError) => e.issues.map((i) => `${i.path.join('.')} ${i.message}`).join('; ');

export function runTool(name: string, raw: unknown, s: GrubpakSession, simNow: string): ToolOutcome {
  if (name === 'registrar_calificacion') {
    const p = qualifyInput.safeParse(raw);
    if (!p.success) return fail('Calificación incompleta', `invalid_input: ${issues(p.error)}`);
    const d = p.data;
    const sc = scoreLead({ ordersPerDay: d.pedidos_por_dia, urgency: d.urgencia, currentPackaging: d.empaque_actual });
    s.lead = {
      id: s.lead?.id ?? `ld_${randomUUID().slice(0, 6)}`,
      name: d.nombre,
      business: d.negocio,
      businessType: d.tipo_negocio,
      whatsapp: d.whatsapp,
      ordersPerDay: d.pedidos_por_dia,
      serves: d.que_sirve,
      currentPackaging: d.empaque_actual,
      urgency: d.urgencia,
      ...sc,
    };
    return {
      ok: true,
      result: { lead_id: s.lead.id, score: sc.score, nivel: sc.tier, mayoreo: sc.wholesale },
      label: `Score ${sc.score} · ${sc.tier}${sc.wholesale ? ' · mayoreo' : ''}`,
      events: [{ event: 'lead', data: s.lead }],
    };
  }

  if (name === 'armar_paquete') {
    if (!s.lead) return fail('Falta calificar', 'Primero llama registrar_calificacion.');
    const p = cartInput.safeParse(raw);
    if (!p.success) return fail('Paquete inválido', `invalid_input: ${issues(p.error)}`);
    const overrides = Object.fromEntries((p.data.paquetes ?? []).map((x) => [x.producto, x.cantidad]));
    const products = [...new Set([...p.data.productos, ...(p.data.paquetes ?? []).map((x) => x.producto)])];
    const cart = buildCart({ ordersPerDay: s.lead.ordersPerDay, products, days: p.data.dias_inventario, overrides });
    if (!cart.lines.length) return fail('Carrito vacío', 'El carrito quedó sin productos.');
    s.cart = cart;
    return {
      ok: true,
      result: {
        partidas: cart.lines.map((l) => `${l.packs} × ${l.name} (${l.pieces} piezas) = ${mxn(l.totalMxn)}`),
        subtotal: mxn(cart.subtotalMxn),
        descuento: cart.discountRate ? `${cart.discountRate * 100}% = -${mxn(cart.discountMxn)}` : 'sin descuento (menos de 3 productos)',
        total: mxn(cart.totalMxn),
        le_dura_dias: cart.supplyDays,
      },
      label: `${cart.lines.length} productos · ${mxn(cart.totalMxn)}`,
      events: [{ event: 'cart', data: cart }],
    };
  }

  if (name === 'crear_link_checkout') {
    if (!s.lead || !s.cart) return fail('Falta el carrito', 'Primero llama registrar_calificacion y armar_paquete.');
    s.checkoutUrl = cartPermalink(s.cart, s.lead.id);
    // A new link replaces the previous one's "didn't click" reminders.
    cancelSequences(s, ['sin_clic'], 'nuevo link');
    startSequence(s, 'sin_clic', simNow);
    return {
      ok: true,
      result: { link_mostrado_como_boton: true, total: mxn(s.cart.totalMxn) },
      label: 'Link de Shopify enviado',
      events: [
        { event: 'checkout_link', data: { url: s.checkoutUrl, totalMxn: s.cart.totalMxn } },
        { event: 'sequences', data: publicSequences(s) },
      ],
    };
  }

  if (name === 'escalar_a_ejecutivo') {
    const p = escalateInput.safeParse(raw);
    if (!p.success) return fail('Escalamiento sin motivo', 'invalid_input: motivo');
    return { ok: true, result: { asignado: true }, label: 'Asignado a ejecutivo de mayoreo', events: [{ event: 'handoff', data: { reason: p.data.motivo } }] };
  }

  return fail(`Herramienta desconocida: ${name}`, 'unknown_tool');
}
