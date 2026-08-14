import { describe, expect, it } from 'vitest';
import { esc } from './html';

describe('esc', () => {
  it('escapes all four HTML-significant characters', () => {
    expect(esc('&')).toBe('&amp;');
    expect(esc('<')).toBe('&lt;');
    expect(esc('>')).toBe('&gt;');
    expect(esc('"')).toBe('&quot;');
  });

  it('escapes a double quote, closing an attribute-breakout vector', () => {
    // esc() is the sole escaping chokepoint for every outbound email in the
    // service and is used inside href="..." attributes. Losing this rule
    // silently (e.g. a future "simplification") would reopen an
    // attribute-breakout bug with a green suite unless this is asserted.
    expect(esc('a"b')).toBe('a&quot;b');
  });

  it('escapes ampersand first, so an already-escaped entity is not double-escaped', () => {
    // If `<` were escaped before `&`, esc('<') would become '&amp;lt;'
    // instead of '&lt;'.
    expect(esc('<')).toBe('&lt;');
    expect(esc('<')).not.toBe('&amp;lt;');
  });

  it('leaves ordinary text untouched', () => {
    expect(esc('Ana Torres')).toBe('Ana Torres');
  });
});
