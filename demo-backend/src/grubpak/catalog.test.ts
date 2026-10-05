import { describe, expect, it } from 'vitest';
import { bundleRate, buildCart, cartPermalink, scoreLead } from './catalog';

describe('buildCart', () => {
  it('splits two weeks of orders across products and rounds up to whole packs', () => {
    // 180/day × 14 = 2,520 pieces, 1,260 each → lunch 3 packs of 450, recipiente 13 of 100
    const c = buildCart({ ordersPerDay: 180, products: ['lunch', 'recipiente'], days: 14 });
    expect(c.lines.map((l) => [l.key, l.packs])).toEqual([['lunch', 3], ['recipiente', 13]]);
    expect(c.discountRate).toBe(0);
    expect(c.totalMxn).toBe(3 * 1849 + 13 * 929);
  });

  it('applies the bundle discount at 3 and 4 products', () => {
    expect(bundleRate(2)).toBe(0);
    expect(bundleRate(3)).toBe(0.1);
    expect(bundleRate(5)).toBe(0.15);
    const c = buildCart({ ordersPerDay: 20, products: ['bowl', 'noodle', 'charola'], days: 14 });
    expect(c.lines.every((l) => l.packs === 1)).toBe(true);
    expect(c.subtotalMxn).toBe(899 + 589 + 469);
    expect(c.discountMxn).toBe(195.7);
    expect(c.totalMxn).toBe(1761.3);
  });

  it('honours explicit pack counts and drops zeroed lines', () => {
    const c = buildCart({ ordersPerDay: 60, products: ['bowl', 'charola'], days: 14, overrides: { bowl: 5, charola: 0 } });
    expect(c.lines).toHaveLength(1);
    expect(c.lines[0]).toMatchObject({ key: 'bowl', packs: 5, pieces: 500 });
  });

  it('supply days is when the first product runs out', () => {
    // 60/day over 2 products = 30/day each; 1 charola pack = 200 pieces, 1 bowl = 100 → bowl first: 3 days
    const c = buildCart({ ordersPerDay: 60, products: ['bowl', 'charola'], days: 14, overrides: { bowl: 1, charola: 1 } });
    expect(c.supplyDays).toBe(3);
  });
});

describe('scoreLead', () => {
  it('scores volume, urgency and readiness to switch', () => {
    expect(scoreLead({ ordersPerDay: 180, urgency: 'esta_semana', currentPackaging: 'Unicel' })).toEqual({ score: 85, tier: 'caliente', wholesale: false });
    expect(scoreLead({ ordersPerDay: 20, urgency: 'cotizando', currentPackaging: 'nada' })).toEqual({ score: 25, tier: 'frio', wholesale: false });
    expect(scoreLead({ ordersPerDay: 400, urgency: 'este_mes', currentPackaging: 'biodegradable de otra marca' }).wholesale).toBe(true);
  });
});

it('cartPermalink carries variants, quantities and the lead id', () => {
  const c = buildCart({ ordersPerDay: 20, products: ['bowl'], days: 14 });
  expect(cartPermalink(c, 'ld_1')).toBe('https://grubpak.com/cart/44120001:3?attributes[lead_id]=ld_1&utm_source=agente&utm_medium=chat');
});
