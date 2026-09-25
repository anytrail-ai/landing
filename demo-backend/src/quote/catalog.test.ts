import { describe, expect, it } from 'vitest';
import { CatalogEmptyError, loadSampleCatalog, sanitizeCatalog } from './catalog';

describe('sanitizeCatalog', () => {
  it('converts major-unit prices to integer cents and assigns ids', () => {
    const c = sanitizeCatalog({
      supplier: 'Acme',
      supplierEmail: 'ventas@acme.mx',
      currency: 'mxn',
      items: [{ sku: 'A1', name: 'Bomba', description: null, price: 1234.5 }],
    });
    expect(c).toEqual({
      supplier: 'Acme',
      supplierEmail: 'ventas@acme.mx',
      currency: 'MXN',
      items: [{ id: 'i1', sku: 'A1', name: 'Bomba', description: null, priceCents: 123450 }],
    });
  });

  it('keeps a missing, negative, NaN or non-numeric price as null, never 0', () => {
    const c = sanitizeCatalog({
      items: [
        { name: 'a', price: null },
        { name: 'b' },
        { name: 'c', price: -5 },
        { name: 'd', price: 'mil' },
        { name: 'e', price: Number.NaN },
      ],
    });
    expect(c.items.map((i) => i.priceCents)).toEqual([null, null, null, null, null]);
  });

  it('keeps a stated zero price as 0', () => {
    expect(sanitizeCatalog({ items: [{ name: 'gratis', price: 0 }] }).items[0].priceCents).toBe(0);
  });

  it('defaults supplier/currency and drops an invalid supplier email', () => {
    const c = sanitizeCatalog({ supplierEmail: 'not-an-email', items: [{ name: 'x', price: 1 }] });
    expect(c.supplier).toBe('Proveedor');
    expect(c.currency).toBe('MXN');
    expect(c.supplierEmail).toBeNull();
  });

  it('drops nameless items and caps the list at 120', () => {
    const items = Array.from({ length: 200 }, (_, i) => ({ name: i === 0 ? '  ' : `p${i}`, price: 1 }));
    const c = sanitizeCatalog({ items });
    expect(c.items).toHaveLength(120);
    expect(c.items[0].name).toBe('p1');
  });

  it('throws CatalogEmptyError when nothing usable is left', () => {
    expect(() => sanitizeCatalog({ items: [] })).toThrow(CatalogEmptyError);
    expect(() => sanitizeCatalog('garbage')).toThrow(CatalogEmptyError);
  });
});

describe('loadSampleCatalog', () => {
  it('is a valid catalogue with some unpriced items to exercise the email path', () => {
    const c = loadSampleCatalog();
    expect(c.items.length).toBeGreaterThanOrEqual(30);
    expect(c.items.filter((i) => i.priceCents === null).length).toBeGreaterThanOrEqual(3);
    expect(new Set(c.items.map((i) => i.id)).size).toBe(c.items.length);
  });
});
