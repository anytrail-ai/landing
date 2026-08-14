import { getSecret } from '../secrets';
import { SCHEDULE } from '../schedule/config';
import { sendReminderEmail } from '../schedule/email';
import { manageUrlFor } from '../schedule/links';
import { horizonDayKeys } from '../schedule/slots';
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
 *
 * Calendar-correct day stepping: `horizonDayKeys(now, 1, tz)` (the same
 * function `listBookedInstants` uses) walks Y-M-D arithmetic rather than
 * adding a fixed 86400_000ms, so a DST transition cannot skip the day in
 * between — a plain `+86400_000ms` can land on the wrong calendar day near a
 * spring-forward and silently drop that day's bookings from the sweep.
 */
export async function handler(): Promise<void> {
  const now = Date.now();
  const days = horizonDayKeys(now, 1, SCHEDULE.timezone);

  const bookings: Booking[] = [];
  for (const day of days) bookings.push(...(await listBookingsForDay(day)));

  const due = dueReminders(bookings, now);
  if (due.length === 0) return;

  // Warmed once, outside the loop: a Secrets Manager failure here aborts
  // before anything is claimed, instead of surfacing mid-pass after some
  // bookings are already durably marked reminded (and so permanently
  // unreachable to a later retry, since `dueReminders` filters on the flag).
  // The per-booking `manageUrlFor` calls below hit the module-level cache in
  // `secrets.ts` and cannot themselves trigger a network fetch.
  await getSecret('SCHEDULE_SECRET_ARN');

  let sent = 0;
  for (const { booking, which } of due) {
    try {
      // Claim first: the conditional update is what makes a Lambda retry safe.
      const claimed = await markReminded(booking, which === 'T24' ? 'remindedT24' : 'remindedT1');
      if (!claimed) continue;
      const manageUrl = await manageUrlFor(booking);
      await sendReminderEmail(booking, manageUrl, which);
      sent++;
    } catch (err) {
      // One booking's failure must not take the rest of the pass down with
      // it. If the throw happened after the claim (e.g. manageUrlFor), the
      // flag is already set and no future sweep will retry this one — log it
      // instead of losing it silently. If markReminded itself threw, nothing
      // was claimed and the next sweep retries it normally.
      console.error('reminder_send_failed', booking.slotStartUtc, which, err);
    }
  }
  console.log('reminders_sent', { count: sent });
}
