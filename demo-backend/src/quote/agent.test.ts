import { describe, expect, it } from 'vitest';
import { QUOTE_MARKER, buildQuoteSystemText, mergeConsecutiveSameRole } from './agent';
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

describe('mergeConsecutiveSameRole', () => {
  it('leaves alternating roles untouched', () => {
    const msgs = [
      { role: 'user' as const, text: 'hola' },
      { role: 'assistant' as const, text: 'hola, en que ayudo' },
      { role: 'user' as const, text: 'quiero una hidrolavadora' },
    ];
    expect(mergeConsecutiveSameRole(msgs)).toEqual(msgs);
  });

  it('joins consecutive same-role messages with a blank line, in order', () => {
    const msgs = [
      { role: 'user' as const, text: 'hola' },
      { role: 'user' as const, text: 'busco una hidrolavadora' },
      { role: 'assistant' as const, text: 'claro, cual es el uso' },
    ];
    expect(mergeConsecutiveSameRole(msgs)).toEqual([
      { role: 'user', text: 'hola\n\nbusco una hidrolavadora' },
      { role: 'assistant', text: 'claro, cual es el uso' },
    ]);
  });

  it('merges more than two in a row and does not mutate the input', () => {
    const msgs = [
      { role: 'user' as const, text: 'a' },
      { role: 'user' as const, text: 'b' },
      { role: 'user' as const, text: 'c' },
    ];
    expect(mergeConsecutiveSameRole(msgs)).toEqual([{ role: 'user', text: 'a\n\nb\n\nc' }]);
    expect(msgs).toEqual([
      { role: 'user', text: 'a' },
      { role: 'user', text: 'b' },
      { role: 'user', text: 'c' },
    ]);
  });

  it('handles empty input', () => {
    expect(mergeConsecutiveSameRole([])).toEqual([]);
  });
});
