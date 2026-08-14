import { describe, expect, it } from 'vitest';
import { signSlot, verifySlot } from './token';

const SECRET = 'test-secret';
const SLOT = '2026-08-20T18:30:00.000Z';

describe('signSlot / verifySlot', () => {
  it('accepts its own signature', () => {
    expect(verifySlot(SLOT, signSlot(SLOT, SECRET), SECRET)).toBe(true);
  });

  it('rejects a tampered slot, a tampered signature, and a foreign secret', () => {
    const sig = signSlot(SLOT, SECRET);
    expect(verifySlot('2026-08-20T19:00:00.000Z', sig, SECRET)).toBe(false);
    expect(verifySlot(SLOT, `${sig.slice(0, -1)}0`, SECRET)).toBe(false);
    expect(verifySlot(SLOT, sig, 'other-secret')).toBe(false);
  });

  it('rejects a malformed signature without throwing', () => {
    expect(verifySlot(SLOT, '', SECRET)).toBe(false);
    expect(verifySlot(SLOT, 'not-hex!!', SECRET)).toBe(false);
  });
});
