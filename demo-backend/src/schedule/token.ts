import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Hex HMAC-SHA256 over the slot instant and booking email. Binding the signature
 * to the email prevents a cancelled booking's link from controlling a new booking
 * at the same time slot by a different person.
 */
export function signBooking(slotStartUtc: string, email: string, secret: string): string {
  const input = `${slotStartUtc}|${email.trim().toLowerCase()}`;
  return createHmac('sha256', secret).update(input).digest('hex');
}

/**
 * Constant-time comparison: a byte-by-byte early return would leak how much of
 * a guessed signature was right. Length mismatch and non-hex input are rejected
 * before Buffer.from can produce a short buffer.
 */
export function verifyBooking(
  slotStartUtc: string,
  email: string,
  sig: string,
  secret: string,
): boolean {
  if (!/^[0-9a-f]{64}$/.test(sig)) return false;
  const expected = Buffer.from(signBooking(slotStartUtc, email, secret), 'hex');
  const given = Buffer.from(sig, 'hex');
  return expected.length === given.length && timingSafeEqual(expected, given);
}
