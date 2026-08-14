import { SCHEDULE } from './config';

// Wall-clock parts of `at` as seen in `tz`.
function partsIn(at: Date, tz: string): Record<string, number> {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const out: Record<string, number> = {};
  for (const p of dtf.formatToParts(at)) {
    if (p.type !== 'literal') out[p.type] = Number(p.value);
  }
  // 'en-US' hour12:false renders midnight as 24; normalise it.
  if (out.hour === 24) out.hour = 0;
  return out;
}

/** How far `tz` is from UTC at this instant, in ms. Positive east of UTC. */
export function tzOffsetMs(at: Date, tz: string): number {
  const p = partsIn(at, tz);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return asUtc - at.getTime();
}

/**
 * Wall-clock time in `tz` -> the UTC instant.
 *
 * Two passes: the first offset is looked up at a guessed instant, which can be
 * on the wrong side of a DST transition; re-looking it up at the corrected
 * instant fixes that. This is why hours are declared in a zone rather than as
 * a fixed offset — the US and Mexico no longer change clocks on the same dates.
 */
export function zonedToUtc(dayKey: string, slotKey: string, tz: string): Date {
  const guess = new Date(`${dayKey}T${slotKey}:00Z`);
  const firstPass = new Date(guess.getTime() - tzOffsetMs(guess, tz));
  return new Date(guess.getTime() - tzOffsetMs(firstPass, tz));
}

/** "2026-08-20" — the calendar day in `tz`, not in UTC. */
export function dayKeyFor(at: Date, tz: string): string {
  const p = partsIn(at, tz);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${p.year}-${pad(p.month)}-${pad(p.day)}`;
}

/** "14:30" — wall-clock start in `tz`. */
export function slotKeyFor(at: Date, tz: string): string {
  const p = partsIn(at, tz);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(p.hour)}:${pad(p.minute)}`;
}

/** Day of week 0-6 for the calendar day in `tz`. */
function weekdayIn(dayKey: string): number {
  return new Date(`${dayKey}T12:00:00Z`).getUTCDay();
}

/**
 * All calendar day keys from now's local day through the horizon, in order.
 * Uses true calendar arithmetic (Y-M-D increment) to handle DST correctly.
 * No day is skipped or duplicated, regardless of DST transitions.
 */
export function horizonDayKeys(nowMs: number, horizonDays: number, tz: string): string[] {
  const pad = (n: number) => String(n).padStart(2, '0');
  const startParts = partsIn(new Date(nowMs), tz);
  let year = startParts.year;
  let month = startParts.month;
  let day = startParts.day;

  const out: string[] = [];

  for (let d = 0; d <= horizonDays; d++) {
    out.push(`${year}-${pad(month)}-${pad(day)}`);

    // Increment to next calendar day using Date.UTC to handle month/year wraparound.
    // Construct a UTC noon (12:00) of the numeric next day, which is guaranteed to be
    // on the next local calendar day in all time zones (UTC-12 to UTC+12).
    const nextUtcAtNoon = new Date(Date.UTC(year, month - 1, day + 1, 12, 0, 0));
    const nextParts = partsIn(nextUtcAtNoon, tz);
    year = nextParts.year;
    month = nextParts.month;
    day = nextParts.day;
  }

  return out;
}

/**
 * Every slot that is open by the clock alone: inside working hours, on a
 * weekday, past the lead time, inside the horizon. Bookings are subtracted by
 * the caller — this function does no I/O so it stays trivially testable.
 */
export function generateSlots(nowMs: number): string[] {
  const { timezone: tz, startHour, endHour, slotMinutes, leadTimeMs, horizonDays } = SCHEDULE;
  const earliest = nowMs + leadTimeMs;
  const latest = nowMs + horizonDays * 86400_000;
  const out: string[] = [];

  // Get all calendar days in the horizon, handling DST correctly.
  const dayKeys = horizonDayKeys(nowMs, horizonDays, tz);

  for (const dayKey of dayKeys) {
    const weekday = weekdayIn(dayKey);
    if (weekday !== 0 && weekday !== 6) {
      for (let mins = startHour * 60; mins < endHour * 60; mins += slotMinutes) {
        const slotKey = `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;
        const at = zonedToUtc(dayKey, slotKey, tz);
        const t = at.getTime();
        if (t >= earliest && t <= latest) out.push(at.toISOString());
      }
    }
  }
  return out.sort();
}
