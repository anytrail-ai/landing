import { createHmac, timingSafeEqual } from 'node:crypto';

/** Hex HMAC-SHA256 over the slot instant. The link carries both. */
export function signSlot(slotStartUtc: string, secret: string): string {
  return createHmac('sha256', secret).update(slotStartUtc).digest('hex');
}

/**
 * Constant-time comparison: a byte-by-byte early return would leak how much of
 * a guessed signature was right. Length mismatch and non-hex input are rejected
 * before Buffer.from can produce a short buffer.
 */
export function verifySlot(slotStartUtc: string, sig: string, secret: string): boolean {
  if (!/^[0-9a-f]{64}$/.test(sig)) return false;
  const expected = Buffer.from(signSlot(slotStartUtc, secret), 'hex');
  const given = Buffer.from(sig, 'hex');
  return expected.length === given.length && timingSafeEqual(expected, given);
}
