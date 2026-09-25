import { describe, expect, it } from 'vitest';
import { QUOTE_MARKER, buildQuoteSystemText } from './agent';
import { loadSampleCatalog } from './catalog';

describe('buildQuoteSystemText', () => {
  const text = buildQuoteSystemText({ catalogId: 'c', ...loadSampleCatalog() });
  it('lists catalogue items with prices and flags unpriced ones', () => {
    expect(text).toContain('HP-2500E');
    expect(text).toContain('$18,500.00 MXN');
    expect(text).toMatch(/HC-3000D.*precio por confirmar/);
  });
  it('tells the agent the marker and forbids invented prices', () => {
    expect(text).toContain(QUOTE_MARKER);
    expect(text).toMatch(/never state a price that is not in the catalogue/i);
  });
});
