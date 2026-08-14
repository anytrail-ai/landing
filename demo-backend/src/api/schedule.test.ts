import { describe, expect, it } from 'vitest';
import { bookSchema } from './schedule';

describe('bookSchema', () => {
  it('accepts a complete booking and defaults the optional note', () => {
    const parsed = bookSchema.parse({
      slotStartUtc: '2026-08-20T18:30:00.000Z',
      name: 'Ana',
      email: 'ana@acme.com',
      website: 'acme.com',
      lang: 'en',
    });
    expect(parsed.note).toBe('');
  });

  it('rejects a bad email, a bad instant, an unknown language, and an oversized note', () => {
    const base = {
      slotStartUtc: '2026-08-20T18:30:00.000Z',
      name: 'Ana',
      email: 'ana@acme.com',
      website: 'acme.com',
      lang: 'en',
    };
    expect(bookSchema.safeParse({ ...base, email: 'nope' }).success).toBe(false);
    expect(bookSchema.safeParse({ ...base, slotStartUtc: 'tomorrow' }).success).toBe(false);
    expect(bookSchema.safeParse({ ...base, lang: 'fr' }).success).toBe(false);
    expect(bookSchema.safeParse({ ...base, note: 'x'.repeat(2001) }).success).toBe(false);
  });
});
