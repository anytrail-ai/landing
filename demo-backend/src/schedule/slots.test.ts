import { describe, expect, it } from 'vitest';
import { SCHEDULE } from './config';
import { dayKeyFor, generateSlots, slotKeyFor, zonedToUtc } from './slots';

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
