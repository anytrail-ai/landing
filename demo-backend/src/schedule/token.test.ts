import { describe, expect, it } from 'vitest';
import { signBooking, verifyBooking } from './token';

const SECRET = 'test-secret';
const SLOT = '2026-08-20T18:30:00.000Z';
const EMAIL_ALICE = 'alice@acme.com';
const EMAIL_BOB = 'bob@acme.com';

describe('signBooking / verifyBooking', () => {
  it('accepts its own signature', () => {
    expect(verifyBooking(SLOT, EMAIL_ALICE, signBooking(SLOT, EMAIL_ALICE, SECRET), SECRET)).toBe(
      true,
    );
  });

  it('rejects a tampered slot, a tampered signature, and a foreign secret', () => {
    const sig = signBooking(SLOT, EMAIL_ALICE, SECRET);
    expect(verifyBooking('2026-08-20T19:00:00.000Z', EMAIL_ALICE, sig, SECRET)).toBe(false);
    expect(verifyBooking(SLOT, EMAIL_ALICE, `${sig.slice(0, -1)}0`, SECRET)).toBe(false);
    expect(verifyBooking(SLOT, EMAIL_ALICE, sig, 'other-secret')).toBe(false);
  });

  it('rejects a malformed signature without throwing', () => {
    expect(verifyBooking(SLOT, EMAIL_ALICE, '', SECRET)).toBe(false);
    expect(verifyBooking(SLOT, EMAIL_ALICE, 'not-hex!!', SECRET)).toBe(false);
  });

  it('rejects a signature from a different email address', () => {
    const sig = signBooking(SLOT, EMAIL_ALICE, SECRET);
    expect(verifyBooking(SLOT, EMAIL_BOB, sig, SECRET)).toBe(false);
  });
});
