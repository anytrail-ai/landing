import { describe, expect, it } from 'vitest';
import type { CatalogItem } from './types';
import { buildLines, parsePicks, shortlist, tokens, totalCents } from './match';

const item = (id: string, name: string, priceCents: number | null, sku: string | null = null): CatalogItem => ({
  id, sku, name, description: null, priceCents,
});

const hp = item('i2', 'Hidrolavadora eléctrica 2500 PSI 220V', 1850000, 'HP-2500E');
const hc = item('i5', 'Hidrolavadora de agua caliente 3000 PSI con quemador diésel', null, 'HC-3000D');
const hose = item('i12', 'Manguera de alta presión 3/8 pulgada 15 m', 125000, 'MAP-15');
const catalog = [hp, hc, hose];

describe('tokens', () => {
  it('lowercases, strips accents and drops stopwords', () => {
    expect(tokens('Hidrolavadora ELÉCTRICA de 2500 PSI')).toEqual(['hidrolavadora', 'electrica', '2500', 'psi']);
  });
});

describe('shortlist', () => {
  it('ranks by overlap and excludes zero-score items', () => {
    expect(shortlist('hidrolavadora electrica 2500', catalog).map((i) => i.id)).toEqual(['i2', 'i5']);
    expect(shortlist('compresor de aire 50 litros', catalog)).toEqual([]);
  });
  it('an exact SKU wins', () => {
    expect(shortlist('HC-3000D', catalog)[0].id).toBe('i5');
  });
  it('caps at max', () => {
    expect(shortlist('hidrolavadora', catalog, 1)).toHaveLength(1);
  });
});

describe('parsePicks', () => {
  const lists = [[hp, hc], [hose]];
  it('accepts in-range integer picks', () => {
    expect(parsePicks({ picks: [{ q: 0, c: 1 }, { q: 1, c: 0 }] }, lists)).toEqual(new Map([[0, 1], [1, 0]]));
  });
  it('discards out-of-range, negative, non-integer, string and unknown-query picks', () => {
    const raw = { picks: [{ q: 0, c: 2 }, { q: 1, c: -1 }, { q: 0, c: 0.5 }, { q: 1, c: '0' }, { q: 7, c: 0 }, { q: 0, c: null }] };
    expect(parsePicks(raw, lists)).toEqual(new Map());
  });
  it('tolerates garbage', () => {
    expect(parsePicks('nope', lists)).toEqual(new Map());
    expect(parsePicks({ picks: 'x' }, lists)).toEqual(new Map());
  });
});

describe('buildLines', () => {
  it('splits priced / unpriced / no_match and never invents a price', () => {
    const extracted = [
      { query: 'hidrolavadora 2500', qty: 2 },
      { query: 'hidrolavadora agua caliente', qty: 1 },
      { query: 'compresor 50 litros', qty: 1 },
    ];
    const lists = [[hp], [hc], []];
    const lines = buildLines(extracted, lists, new Map([[0, 0], [1, 0]]));
    expect(lines).toEqual([
      { itemId: 'i2', query: 'hidrolavadora 2500', name: hp.name, sku: 'HP-2500E', qty: 2, unitCents: 1850000, status: 'priced' },
      { itemId: 'i5', query: 'hidrolavadora agua caliente', name: hc.name, sku: 'HC-3000D', qty: 1, unitCents: null, status: 'unpriced' },
      { itemId: null, query: 'compresor 50 litros', name: 'compresor 50 litros', sku: null, qty: 1, unitCents: null, status: 'no_match' },
    ]);
    expect(totalCents(lines)).toBe(3700000);
  });
});
