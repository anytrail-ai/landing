import { getSecret } from '../secrets';
import type { Booking } from './store';
import { signBooking } from './token';

const SITE = 'https://www.anytrail.ai';

/**
 * The signature commits to the slot AND the booker's address, so a stale link
 * from a cancelled booking cannot control whoever books that slot next. The
 * email is never in the URL — it comes from the stored row at verify time.
 *
 * Single implementation shared by the booking API and the reminder sweep: a
 * second copy is how the route path or the signature shape drift apart, and
 * both have already changed once during this build.
 */
export async function manageUrlFor(
  b: Pick<Booking, 'slotStartUtc' | 'email' | 'lang'>,
): Promise<string> {
  const secret = await getSecret('SCHEDULE_SECRET_ARN');
  const path = b.lang === 'es' ? '/es/agenda' : '/schedule';
  const sig = signBooking(b.slotStartUtc, b.email, secret);
  return `${SITE}${path}?b=${encodeURIComponent(b.slotStartUtc)}&s=${sig}`;
}
