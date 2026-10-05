import { describe, expect, it } from 'vitest';
import { buildCart } from './catalog';
import { cancelSequences, followUpText, publicSequences, startSequence, stepGate } from './sequences';
import { newSession } from './store';
import type { GrubpakSession } from './types';

const T0 = '2026-10-05T16:00:00.000Z';
const plus = (min: number) => new Date(Date.parse(T0) + min * 60_000).toISOString();

function session(): GrubpakSession {
  const s = newSession();
  s.cart = buildCart({ ordersPerDay: 60, products: ['bowl', 'charola', 'recipiente'], days: 14 });
  s.orders = [{ number: '#GP1041', totalMxn: s.cart.totalMxn, at: T0 }];
  return s;
}

describe('sequences', () => {
  it('schedules steps on the simulated clock and gates them until due', () => {
    const s = session();
    const seq = startSequence(s, 'carrito_abandonado', T0);
    expect(seq.steps.map((st) => st.at)).toEqual([plus(60), plus(1440), plus(3 * 1440), plus(7 * 1440)]);
    expect(stepGate(s, seq.id, 'duda', plus(59))).toEqual({ ok: false, reason: 'not_due' });
    expect(stepGate(s, seq.id, 'duda', plus(60))).toMatchObject({ ok: true, index: 0 });
    expect(stepGate(s, seq.id, 'nope', plus(60))).toEqual({ ok: false, reason: 'unknown_step' });
  });

  it('buying cancels the pending abandoned-cart steps', () => {
    const s = session();
    const seq = startSequence(s, 'carrito_abandonado', T0);
    seq.steps[0].status = 'sent';
    expect(cancelSequences(s, ['carrito_abandonado'], 'compró')).toBe(3);
    expect(seq.steps.map((st) => st.status)).toEqual(['sent', 'cancelled', 'cancelled', 'cancelled']);
    expect(stepGate(s, seq.id, 'incentivo', plus(2000))).toEqual({ ok: false, reason: 'not_pending' });
  });

  it('times the reorder reminder ~3 days before the order runs out, in order', () => {
    const s = session();
    const days = s.cart!.supplyDays;
    const seq = startSequence(s, 'post_compra', T0);
    const reorder = seq.steps.find((st) => st.id === 'recompra')!;
    expect(reorder.at).toBe(plus(Math.max(6, days - 3) * 1440));
    const times = seq.steps.map((st) => Date.parse(st.at));
    expect([...times].sort((a, b) => a - b)).toEqual(times);
  });

  it('keeps instructions server-side and tags follow-ups as system events', () => {
    const s = session();
    const seq = startSequence(s, 'sin_clic', T0);
    expect(JSON.stringify(publicSequences(s))).not.toContain('instruction');
    const text = followUpText(seq, 0, ['nota']);
    expect(text.startsWith('[EVENTO DEL SISTEMA]')).toBe(true);
    expect(text).toContain('nota');
  });
});
