import { describe, expect, it } from 'vitest';
import { SCHEDULE } from './config';
import { dayKeyFor, generateSlots, horizonDayKeys, slotKeyFor, zonedToUtc } from './slots';

const TZ = 'America/New_York';

describe('zonedToUtc', () => {
  it('maps 09:00 New York to 14:00Z in winter and 13:00Z in summer', () => {
    // EST is UTC-5, EDT is UTC-4. A fixed offset would be wrong half the year.
    expect(zonedToUtc('2026-01-15', '09:00', TZ).toISOString()).toBe('2026-01-15T14:00:00.000Z');
    expect(zonedToUtc('2026-07-15', '09:00', TZ).toISOString()).toBe('2026-07-15T13:00:00.000Z');
  });

  it('is exact on both sides of the 2026 DST transitions', () => {
    // US springs forward 2026-03-08, falls back 2026-11-01.
    expect(zonedToUtc('2026-03-07', '09:00', TZ).toISOString()).toBe('2026-03-07T14:00:00.000Z');
    expect(zonedToUtc('2026-03-09', '09:00', TZ).toISOString()).toBe('2026-03-09T13:00:00.000Z');
    expect(zonedToUtc('2026-10-31', '09:00', TZ).toISOString()).toBe('2026-10-31T13:00:00.000Z');
    expect(zonedToUtc('2026-11-02', '09:00', TZ).toISOString()).toBe('2026-11-02T14:00:00.000Z');
  });
});

describe('dayKeyFor / slotKeyFor', () => {
  it('round-trips an instant back to its New York day and slot', () => {
    const at = zonedToUtc('2026-08-20', '14:30', TZ);
    expect(dayKeyFor(at, TZ)).toBe('2026-08-20');
    expect(slotKeyFor(at, TZ)).toBe('14:30');
  });

  it('uses the New York day, not the UTC day', () => {
    // 21:00 EDT on the 20th is 01:00Z on the 21st.
    const at = zonedToUtc('2026-08-20', '21:00', TZ);
    expect(at.toISOString()).toBe('2026-08-21T01:00:00.000Z');
    expect(dayKeyFor(at, TZ)).toBe('2026-08-20');
  });
});

describe('generateSlots', () => {
  // Thursday 2026-08-20, 08:00 New York (12:00Z).
  const now = Date.parse('2026-08-20T12:00:00.000Z');

  it('respects the lead time', () => {
    const slots = generateSlots(now);
    // 09:00 and 09:30 NY are inside the 2h lead time; 10:00 is the first open one.
    expect(slots[0]).toBe(zonedToUtc('2026-08-20', '10:00', TZ).toISOString());
  });

  it('excludes weekends', () => {
    const days = new Set(generateSlots(now).map((iso) => dayKeyFor(new Date(iso), TZ)));
    expect(days.has('2026-08-22')).toBe(false); // Saturday
    expect(days.has('2026-08-23')).toBe(false); // Sunday
    expect(days.has('2026-08-24')).toBe(true); // Monday
  });

  it('stops at the horizon and never offers a slot outside working hours', () => {
    const slots = generateSlots(now);
    const last = new Date(slots[slots.length - 1]);
    expect(last.getTime() - now).toBeLessThanOrEqual(SCHEDULE.horizonDays * 86400_000);
    for (const iso of slots) {
      const [h, m] = slotKeyFor(new Date(iso), TZ).split(':').map(Number);
      expect(h).toBeGreaterThanOrEqual(SCHEDULE.startHour);
      expect(h * 60 + m).toBeLessThan(SCHEDULE.endHour * 60);
    }
  });

});

describe('horizonDayKeys', () => {
  const TZ = 'America/New_York';

  it('enumerates all days including the spring-forward transition day (2026-03-08)', () => {
    // Saturday 2026-03-07T23:59 EST (2026-03-08T04:59 UTC) — near local midnight before transition.
    // The old millisecond-stepping bug would skip 2026-03-08 entirely.
    const nowNearTransition = Date.parse('2026-03-08T04:59:00.000Z');
    const days = horizonDayKeys(nowNearTransition, 3, TZ);

    // Must include the spring-forward day (2026-03-08) and the next day (2026-03-09).
    // Starting Saturday 2026-03-07, should see: 2026-03-07, 2026-03-08, 2026-03-09, 2026-03-10.
    expect(days).toContain('2026-03-07');
    expect(days).toContain('2026-03-08');
    expect(days).toContain('2026-03-09');
    expect(days).toContain('2026-03-10');
  });

  it('does not duplicate the fall-back transition day (2026-11-01)', () => {
    // Sunday 2026-11-01T00:15 EDT (2026-11-01T04:15 UTC) — very early on the fall-back day.
    // The old millisecond-stepping bug would produce 2026-11-01 twice because the 25-hour day
    // spans two iterations: the local calendar day is 25 hours, so adding 24 hours stays within it.
    const nowNearTransition = Date.parse('2026-11-01T04:15:00.000Z');
    const days = horizonDayKeys(nowNearTransition, 3, TZ);

    // Each day key should appear exactly once.
    const counts: Record<string, number> = {};
    for (const day of days) {
      counts[day] = (counts[day] ?? 0) + 1;
    }
    for (const count of Object.values(counts)) {
      expect(count).toBe(1);
    }

    // Also verify the expected days are present: 2026-11-01 through 2026-11-04.
    expect(days).toContain('2026-11-01');
    expect(days).toContain('2026-11-02');
    expect(days).toContain('2026-11-03');
    expect(days).toContain('2026-11-04');
  });
});
