import { describe, expect, it } from 'vitest';
import { fallbackDraft, parseExtracted } from './quote';
import type { Catalog, QuoteLine } from './types';

describe('parseExtracted', () => {
  it('clamps qty to 1..999 integers, trims and caps queries, drops empties', () => {
    const out = parseExtracted({
      items: [
        { query: '  hidrolavadora 2500 ', qty: 2 },
        { query: 'manguera', qty: 0 },
        { query: 'boquilla', qty: 5000 },
        { query: 'lanza', qty: 2.7 },
        { query: '', qty: 1 },
        { query: 'x'.repeat(300), qty: 1 },
        { qty: 3 },
      ],
    });
    expect(out.map((e) => e.qty)).toEqual([2, 1, 999, 3, 1]);
    expect(out[0].query).toBe('hidrolavadora 2500');
    expect(out[4].query).toHaveLength(200);
  });
  it('returns [] for garbage and caps at 20 items', () => {
    expect(parseExtracted('nope')).toEqual([]);
    const many = { items: Array.from({ length: 30 }, (_, i) => ({ query: `p${i}`, qty: 1 })) };
    expect(parseExtracted(many)).toHaveLength(20);
  });
});

describe('fallbackDraft', () => {
  it('lists every missing line with qty and SKU', () => {
    const catalog: Catalog = { catalogId: 'c', supplier: 'Acme', supplierEmail: null, currency: 'MXN', items: [] };
    const lines: QuoteLine[] = [
      { itemId: 'i1', query: 'a', name: 'Bomba A', sku: 'BA', qty: 2, unitCents: 100, status: 'priced' },
      { itemId: 'i2', query: 'b', name: 'Bomba B', sku: 'BB', qty: 1, unitCents: null, status: 'unpriced' },
      { itemId: null, query: 'compresor', name: 'compresor', sku: null, qty: 3, unitCents: null, status: 'no_match' },
    ];
    const d = fallbackDraft(catalog, lines);
    expect(d.subject).toContain('Acme');
    expect(d.body).toContain('Bomba B (BB): 1');
    expect(d.body).toContain('compresor: 3');
    expect(d.body).not.toContain('Bomba A');
  });
});
