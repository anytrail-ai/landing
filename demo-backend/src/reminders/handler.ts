import { SCHEDULE } from '../schedule/config';
import { sendReminderEmail } from '../schedule/email';
import { manageUrlFor } from '../schedule/links';
import { dayKeyFor } from '../schedule/slots';
import { type Booking, listBookingsForDay, markReminded } from '../schedule/store';

/** The EventBridge rate. A reminder is due if its mark falls in this window. */
const SWEEP_MS = 15 * 60 * 1000;
const H = 60 * 60 * 1000;

export interface DueReminder {
  booking: Booking;
  which: 'T24' | 'T1';
}

/**
 * Pure, so the window arithmetic is testable without DynamoDB. A booking is due
 * when its lead time falls inside the sweep window and its flag is unset. Past
 * calls are never reminded.
 */
export function dueReminders(bookings: Booking[], nowMs: number): DueReminder[] {
  const out: DueReminder[] = [];
  for (const booking of bookings) {
    const until = new Date(booking.slotStartUtc).getTime() - nowMs;
    if (until <= 0) continue;
    if (!booking.remindedT24 && until <= 24 * H && until > 24 * H - SWEEP_MS) {
      out.push({ booking, which: 'T24' });
    } else if (!booking.remindedT1 && until <= 1 * H && until > 1 * H - SWEEP_MS) {
      out.push({ booking, which: 'T1' });
    }
  }
  return out;
}

/**
 * One rule for the whole system rather than a schedule per booking: nothing to
 * clean up when someone cancels. Today plus tomorrow covers every 24h lead.
 */
export async function handler(): Promise<void> {
  const now = Date.now();
  const tz = SCHEDULE.timezone;
  const days = [dayKeyFor(new Date(now), tz), dayKeyFor(new Date(now + 86400_000), tz)];

  const bookings: Booking[] = [];
  for (const day of days) bookings.push(...(await listBookingsForDay(day)));

  const due = dueReminders(bookings, now);
  if (due.length === 0) return;

  for (const { booking, which } of due) {
    // Claim first: the conditional update is what makes a Lambda retry safe.
    const claimed = await markReminded(booking, which === 'T24' ? 'remindedT24' : 'remindedT1');
    if (!claimed) continue;
    const manageUrl = await manageUrlFor(booking);
    await sendReminderEmail(booking, manageUrl, which);
  }
  console.log('reminders_sent', { count: due.length });
}
