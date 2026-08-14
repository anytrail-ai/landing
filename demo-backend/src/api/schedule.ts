import { z } from 'zod';
import { getSecret } from '../secrets';
import { SCHEDULE } from '../schedule/config';
import { sendBookingEmails } from '../schedule/email';
import { manageUrlFor } from '../schedule/links';
import { generateSlots } from '../schedule/slots';
import {
  type Booking,
  createBooking,
  deleteBooking,
  getBooking,
  listBookedInstants,
  moveBooking,
  UnknownBookingError,
} from '../schedule/store';
import { verifyBooking } from '../schedule/token';
import { normalizeWebsite } from './start';

// Re-exported from the store: moveBooking's atomic transaction can throw it
// too (the row a caller was authorized against is gone by the time the
// transaction runs), so it is a store-level fact, not just a signature one.
export { UnknownBookingError };

export class InvalidSignatureError extends Error {
  constructor() {
    super('invalid_signature');
    this.name = 'InvalidSignatureError';
  }
}
export class SlotUnavailableError extends Error {
  constructor() {
    super('slot_unavailable');
    this.name = 'SlotUnavailableError';
  }
}
/** normalizeWebsite's junk-domain Error and the URL constructor's TypeError
 * on unparseable input are both the caller's fault; wrapping them here keeps
 * "malformed website" from masquerading as any other TypeError a genuine
 * defect (a null deref, a bad stored row) might raise in the other routes. */
export class InvalidWebsiteError extends Error {
  constructor() {
    super('invalid_website');
    this.name = 'InvalidWebsiteError';
  }
}

export const bookSchema = z.object({
  slotStartUtc: z.string().datetime(),
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  website: z.string().trim().min(4).max(2048),
  note: z.string().trim().max(2000).default(''),
  lang: z.enum(['en', 'es']),
});

export type BookInput = z.infer<typeof bookSchema>;

/** Generated slots minus the booked ones. */
export async function openSlots(nowMs: number): Promise<string[]> {
  const generated = generateSlots(nowMs);
  const booked = new Set(await listBookedInstants(nowMs, SCHEDULE.horizonDays));
  return generated.filter((iso) => !booked.has(iso));
}

export async function book(
  input: BookInput,
  ip: string,
): Promise<{ slotStartUtc: string; manageUrl: string }> {
  // Never trust the client's idea of what is bookable: re-derive it here.
  const open = await openSlots(Date.now());
  if (!open.includes(input.slotStartUtc)) throw new SlotUnavailableError();

  let url: string;
  try {
    ({ url } = normalizeWebsite(input.website));
  } catch {
    throw new InvalidWebsiteError();
  }
  const startsSoon =
    new Date(input.slotStartUtc).getTime() - Date.now() < 24 * 60 * 60 * 1000;

  const booking: Booking = {
    slotStartUtc: input.slotStartUtc,
    name: input.name,
    email: input.email,
    website: url,
    note: input.note,
    lang: input.lang,
    // Booked inside 24h: mark the T-24 reminder as already sent so nobody gets
    // a "reminder" seconds after their confirmation.
    remindedT24: startsSoon,
    remindedT1: false,
    sequence: 0,
    createdAt: new Date().toISOString(),
    ip,
  };

  await createBooking(booking);
  const manageUrl = await manageUrlFor(booking);
  await sendBookingEmails(booking, manageUrl);
  return { slotStartUtc: booking.slotStartUtc, manageUrl };
}

/**
 * Load first, verify second: the signature is checked against the address on
 * the booking that exists NOW, so a link signed for a since-cancelled booking
 * fails against its replacement. Revealing "no booking here" before the
 * signature check leaks nothing — slot availability is already public.
 */
async function authorize(slotStartUtc: string, sig: string): Promise<Booking> {
  const booking = await getBooking(slotStartUtc);
  if (!booking) throw new UnknownBookingError();
  const secret = await getSecret('SCHEDULE_SECRET_ARN');
  if (!verifyBooking(slotStartUtc, booking.email, sig, secret)) {
    throw new InvalidSignatureError();
  }
  return booking;
}

export async function view(slotStartUtc: string, sig: string): Promise<Booking> {
  return authorize(slotStartUtc, sig);
}

export async function cancel(slotStartUtc: string, sig: string): Promise<void> {
  await deleteBooking(await authorize(slotStartUtc, sig));
}

/**
 * The move is one DynamoDB transaction (`moveBooking`): delete the old slot,
 * put the new one, re-point the email guard. All three writes apply or none
 * do, so a crash or timeout between them cannot happen — a move can never
 * leave a booking half-moved. If someone else takes the target slot first,
 * the new-slot Put's condition fails and `moveBooking` throws
 * `SlotTakenError` with the original booking still fully intact; nothing is
 * ever silently lost.
 */
export async function move(
  slotStartUtc: string,
  sig: string,
  toSlotStartUtc: string,
): Promise<{ slotStartUtc: string; manageUrl: string }> {
  // A single transaction cannot Delete and Put the same item, so a move to
  // the slot it already occupies is a hard validation error, not a race —
  // reject it before touching the store at all.
  if (toSlotStartUtc === slotStartUtc) throw new SlotUnavailableError();

  const existing = await authorize(slotStartUtc, sig);
  const open = await openSlots(Date.now());
  if (!open.includes(toSlotStartUtc)) throw new SlotUnavailableError();

  const moved: Booking = {
    ...existing,
    slotStartUtc: toSlotStartUtc,
    remindedT24: new Date(toSlotStartUtc).getTime() - Date.now() < 24 * 60 * 60 * 1000,
    remindedT1: false,
    // Same uid (createdAt is preserved by the spread), higher sequence: this is
    // what makes a calendar client move the event rather than duplicate it.
    sequence: (existing.sequence ?? 0) + 1,
  };
  await moveBooking(existing, moved);
  const manageUrl = await manageUrlFor(moved);
  await sendBookingEmails(moved, manageUrl);
  return { slotStartUtc: toSlotStartUtc, manageUrl };
}
