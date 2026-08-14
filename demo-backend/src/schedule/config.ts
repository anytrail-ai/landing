// Every scheduling knob in one place, the way limits.ts centralises caps.
// Changing working hours is a config edit plus a redeploy, never a code change.
export const SCHEDULE = {
  /** Hours below are wall-clock time in this zone. Visitors see their own. */
  timezone: 'America/New_York',
  /** 09:00, inclusive. */
  startHour: 9,
  /** 17:00, exclusive: the last slot starts at 16:30. */
  endHour: 17,
  slotMinutes: 30,
  /** Nobody books a call five minutes from now. */
  leadTimeMs: 2 * 60 * 60 * 1000,
  horizonDays: 14,
} as const;

/** The standing video room. Set on the Lambdas in lib/api-stack.ts. */
export const MEET_URL = process.env.MEET_URL ?? '';
