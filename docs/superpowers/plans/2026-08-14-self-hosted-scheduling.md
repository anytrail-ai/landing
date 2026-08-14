# Self-Hosted Scheduling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the third-party scheduler with a self-hosted booking flow: the landing CTA books a call, the confirmation offers the demo, and reminders fire automatically.

**Architecture:** Slots are computed from fixed New York working hours, never stored; only bookings are rows in the existing single DynamoDB table, keyed by day so double-booking is prevented by a conditional write and the reminder sweep is a query rather than a scan. Four routes join the existing HTTP API in `demo-backend`; one EventBridge rule drives a 15-minute reminder sweep. The landing SPA gains a `/schedule` + `/es/agenda` route pair that renders server-computed instants and does no date math of its own.

**Tech Stack:** Node 20 TypeScript Lambdas, AWS CDK v2, DynamoDB (single table), Resend, vitest + aws-sdk-client-mock, React 18 + Vite (landing SPA, prerendered).

**Spec:** `docs/superpowers/specs/2026-08-14-scheduling-design.md`

## Global Constraints

- **Timezone:** `America/New_York`. Hours Mon–Fri 09:00–17:00, 30-minute slots, 2-hour lead time, 14-day horizon.
- **Meeting URL:** `https://meet.google.com/kzk-tpgh-sbm`, injected as `MEET_URL`, never hardcoded in `src/`.
- **All date math is server-side.** The landing repo has no test runner; the page renders instants it is given and never generates, validates, or adjusts a slot.
- **Every source file gets a sibling `.test.ts`** (existing `demo-backend` convention).
- **Notifications are fire-and-forget.** A Slack or email failure must never fail a booking.
- **No em dashes in any visitor-facing copy** (existing repo rule, `324be83`).
- **Copy ships in both EN and ES.** Every `COPY.en` addition needs its `COPY.es` twin.
- **Backend commands run from `demo-backend/`; frontend commands from the repo root.**

---

## File Structure

**Backend — `demo-backend/`**

| File | Responsibility |
|---|---|
| `src/schedule/config.ts` | The one place hours, timezone, slot length, lead time, horizon live |
| `src/schedule/slots.ts` | Pure timezone + slot generation. No AWS, no I/O |
| `src/schedule/store.ts` | Every DynamoDB read/write for bookings |
| `src/schedule/token.ts` | HMAC sign/verify for the manage link |
| `src/schedule/ics.ts` | VCALENDAR builder |
| `src/schedule/email.ts` | Confirmation + reminder templates and sends |
| `src/api/schedule.ts` | Route handlers, zod schemas, HTTP status mapping |
| `src/reminders/handler.ts` | The 15-minute sweep Lambda |
| `src/html.ts` | `esc()`, extracted so both email modules share one copy |
| `src/db.ts` | +2 key builders |
| `src/api/handler.ts` | +4 routes |
| `lib/api-stack.ts` | `MEET_URL`, HMAC secret, reminder Lambda, EventBridge rule |

**Frontend — repo root**

| File | Responsibility |
|---|---|
| `src/pages/Schedule.jsx` + `.css` | Day picker, slot grid, booking form |
| `src/pages/scheduleApi.js` | Fetch wrapper for the four routes |
| `src/components/CtaLink.jsx` | Replaces `DemoLink.jsx`, points at `/schedule` |
| `src/i18n/copy.js` | `ROUTES` entry + schedule copy + thanks CTA |
| `src/pages/Thanks.jsx` | Post-booking demo CTA |
| `src/components/Footer.jsx` | Quiet `/demo` link (de-orphans the page) |
| `src/config.js`, `prerender.js` | `DEMO_URL` removed; URLs derive from `ROUTES` |

---

### Task 1: Slot generation

Pure functions, no AWS. Everything downstream depends on these being right, so they are built and tested first.

**Files:**
- Create: `demo-backend/src/schedule/config.ts`
- Create: `demo-backend/src/schedule/slots.ts`
- Test: `demo-backend/src/schedule/slots.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `SCHEDULE: { timezone: string; startHour: number; endHour: number; slotMinutes: number; leadTimeMs: number; horizonDays: number }`
  - `tzOffsetMs(at: Date, tz: string): number`
  - `zonedToUtc(dayKey: string, slotKey: string, tz: string): Date` — `("2026-08-20", "14:30")` → the UTC instant
  - `dayKeyFor(at: Date, tz: string): string` — → `"2026-08-20"`
  - `slotKeyFor(at: Date, tz: string): string` — → `"14:30"`
  - `generateSlots(nowMs: number): string[]` — open-by-the-clock slot instants as UTC ISO strings, weekends excluded, lead time and horizon applied

- [ ] **Step 1: Write the failing test**

```ts
// demo-backend/src/schedule/slots.test.ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd demo-backend && npx vitest run src/schedule/slots.test.ts`
Expected: FAIL — `Cannot find module './config'`

- [ ] **Step 3: Write the config**

```ts
// demo-backend/src/schedule/config.ts
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
```

- [ ] **Step 4: Write the slot generator**

```ts
// demo-backend/src/schedule/slots.ts
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
 * Every slot that is open by the clock alone: inside working hours, on a
 * weekday, past the lead time, inside the horizon. Bookings are subtracted by
 * the caller — this function does no I/O so it stays trivially testable.
 */
export function generateSlots(nowMs: number): string[] {
  const { timezone: tz, startHour, endHour, slotMinutes, leadTimeMs, horizonDays } = SCHEDULE;
  const earliest = nowMs + leadTimeMs;
  const latest = nowMs + horizonDays * 86400_000;
  const out: string[] = [];

  for (let d = 0; d <= horizonDays; d++) {
    const dayKey = dayKeyFor(new Date(nowMs + d * 86400_000), tz);
    const weekday = weekdayIn(dayKey);
    if (weekday === 0 || weekday === 6) continue;

    for (let mins = startHour * 60; mins < endHour * 60; mins += slotMinutes) {
      const slotKey = `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;
      const at = zonedToUtc(dayKey, slotKey, tz);
      const t = at.getTime();
      if (t >= earliest && t <= latest) out.push(at.toISOString());
    }
  }
  return out.sort();
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `cd demo-backend && npx vitest run src/schedule/slots.test.ts`
Expected: PASS, 6 tests

- [ ] **Step 6: Commit**

```bash
git add demo-backend/src/schedule/config.ts demo-backend/src/schedule/slots.ts demo-backend/src/schedule/slots.test.ts
git commit -m "feat(schedule): timezone-correct slot generation"
```

---

### Task 2: Booking store

The transaction that makes double-booking impossible.

**Files:**
- Modify: `demo-backend/src/db.ts` (add two key builders to `keys`)
- Create: `demo-backend/src/schedule/store.ts`
- Test: `demo-backend/src/schedule/store.test.ts`

**Interfaces:**
- Consumes: `dayKeyFor`, `slotKeyFor`, `horizonDayKeys` (Task 1); `TABLE_NAME`, `docClient`, `keys` (`src/db.ts`).
- Produces:
  - `keys.bookingDay(dayKey, slotKey)`, `keys.emailGuard(email)`
  - `interface Booking { slotStartUtc, name, email, website, note, lang, remindedT24, remindedT1, createdAt, ip }`
  - `createBooking(b: Booking): Promise<void>` — throws `SlotTakenError` or `AlreadyBookedError`
  - `getBooking(slotStartUtc: string): Promise<Booking | null>`
  - `deleteBooking(b: Booking): Promise<void>`
  - `listBookedInstants(fromMs: number, days: number): Promise<string[]>`
  - `listBookingsForDay(dayKey: string): Promise<Booking[]>`
  - `markReminded(b: Booking, which: 'remindedT24' | 'remindedT1'): Promise<boolean>` — false if already marked

- [ ] **Step 1: Write the failing test**

```ts
// demo-backend/src/schedule/store.test.ts
import { DynamoDBDocumentClient, QueryCommand, TransactWriteCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { beforeEach, describe, expect, it } from 'vitest';
import { setDocClientForTests } from '../db';
import { AlreadyBookedError, SlotTakenError, createBooking, listBookedInstants, markReminded } from './store';

const ddb = mockClient(DynamoDBDocumentClient);

const booking = {
  slotStartUtc: '2026-08-20T18:30:00.000Z',
  name: 'Ana',
  email: 'Ana@Acme.com',
  website: 'https://acme.com',
  note: '',
  lang: 'en' as const,
  remindedT24: false,
  remindedT1: false,
  createdAt: '2026-08-19T12:00:00.000Z',
  ip: '1.2.3.4',
};

beforeEach(() => {
  ddb.reset();
  setDocClientForTests(ddb as unknown as DynamoDBDocumentClient);
  process.env.TABLE_NAME = 'test-table';
});

describe('createBooking', () => {
  it('writes the booking and the email guard in one transaction', async () => {
    ddb.on(TransactWriteCommand).resolves({});
    await createBooking(booking);

    const call = ddb.commandCalls(TransactWriteCommand)[0].args[0].input;
    expect(call.TransactItems).toHaveLength(2);
    const [slot, guard] = call.TransactItems!;
    expect(slot.Put!.Item!.pk).toBe('BOOKINGDAY#2026-08-20');
    expect(slot.Put!.Item!.sk).toBe('SLOT#14:30');
    expect(slot.Put!.ConditionExpression).toContain('attribute_not_exists');
    // Guard is lowercased so Ana@Acme.com cannot book twice as ana@acme.com.
    expect(guard.Put!.Item!.pk).toBe('EMAIL#ana@acme.com');
    expect(guard.Put!.ConditionExpression).toContain('attribute_not_exists');
  });

  it('reports a taken slot distinctly from a repeat booker', async () => {
    const err = Object.assign(new Error('cancelled'), {
      name: 'TransactionCanceledException',
      CancellationReasons: [{ Code: 'ConditionalCheckFailed' }, { Code: 'None' }],
    });
    ddb.on(TransactWriteCommand).rejects(err);
    await expect(createBooking(booking)).rejects.toBeInstanceOf(SlotTakenError);

    const err2 = Object.assign(new Error('cancelled'), {
      name: 'TransactionCanceledException',
      CancellationReasons: [{ Code: 'None' }, { Code: 'ConditionalCheckFailed' }],
    });
    ddb.on(TransactWriteCommand).rejects(err2);
    await expect(createBooking(booking)).rejects.toBeInstanceOf(AlreadyBookedError);
  });
});

describe('listBookedInstants', () => {
  it('queries each day in range and returns the booked instants', async () => {
    ddb.on(QueryCommand).resolves({ Items: [{ slotStartUtc: booking.slotStartUtc }] });
    const booked = await listBookedInstants(Date.parse('2026-08-20T12:00:00.000Z'), 1);
    expect(booked).toContain(booking.slotStartUtc);
    expect(ddb.commandCalls(QueryCommand).length).toBe(2); // today + 1
  });
});

describe('markReminded', () => {
  it('returns false when the flag was already set, so a retry cannot double-send', async () => {
    ddb.on(UpdateCommand).rejects(
      Object.assign(new Error('failed'), { name: 'ConditionalCheckFailedException' }),
    );
    expect(await markReminded(booking, 'remindedT24')).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd demo-backend && npx vitest run src/schedule/store.test.ts`
Expected: FAIL — `Cannot find module './store'`

- [ ] **Step 3: Add the key builders**

In `demo-backend/src/db.ts`, extend the `keys` object and its comment block:

```ts
// Single-table key shapes:
//   LEAD#<sessionId>       / META      — a captured lead + its session state
//   DOMAIN#<domain>        / PROFILE   — cached CompanyProfile (expiresAt TTL)
//   IP#<ip>                / RATE#<window> — rate-limit bucket (expiresAt TTL)
//   BOOKINGDAY#<yyyy-mm-dd>/ SLOT#<hh:mm>  — a booked call (day = New York date)
//   EMAIL#<lowercased>     / ACTIVE    — guard: one active booking per address
export const keys = {
  lead: (sessionId: string) => ({ pk: `LEAD#${sessionId}`, sk: 'META' }),
  profile: (domain: string) => ({ pk: `DOMAIN#${domain}`, sk: 'PROFILE' }),
  rate: (ip: string, windowStart: number) => ({
    pk: `IP#${ip}`,
    sk: `RATE#${windowStart}`,
  }),
  bookingDay: (dayKey: string, slotKey: string) => ({
    pk: `BOOKINGDAY#${dayKey}`,
    sk: `SLOT#${slotKey}`,
  }),
  emailGuard: (email: string) => ({
    pk: `EMAIL#${email.trim().toLowerCase()}`,
    sk: 'ACTIVE',
  }),
} as const;
```

- [ ] **Step 4: Write the store**

```ts
// demo-backend/src/schedule/store.ts
import {
  DeleteCommand,
  GetCommand,
  QueryCommand,
  TransactWriteCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { TABLE_NAME, docClient, keys } from '../db';
import { SCHEDULE } from './config';
import { dayKeyFor, slotKeyFor } from './slots';

export class SlotTakenError extends Error {
  constructor() {
    super('slot_taken');
    this.name = 'SlotTakenError';
  }
}

export class AlreadyBookedError extends Error {
  constructor() {
    super('already_booked');
    this.name = 'AlreadyBookedError';
  }
}

export interface Booking {
  slotStartUtc: string;
  name: string;
  email: string;
  website: string;
  note: string;
  lang: 'en' | 'es';
  remindedT24: boolean;
  remindedT1: boolean;
  createdAt: string;
  ip: string;
}

function keyFor(slotStartUtc: string) {
  const at = new Date(slotStartUtc);
  return keys.bookingDay(dayKeyFor(at, SCHEDULE.timezone), slotKeyFor(at, SCHEDULE.timezone));
}

/**
 * The slot row and the email guard go in together or not at all. Without the
 * transaction a crash between the two writes leaves either a booking nobody
 * can find, or a guard blocking a booking that does not exist.
 */
export async function createBooking(b: Booking): Promise<void> {
  try {
    await docClient().send(
      new TransactWriteCommand({
        TransactItems: [
          {
            Put: {
              TableName: TABLE_NAME,
              Item: { ...keyFor(b.slotStartUtc), ...b },
              ConditionExpression: 'attribute_not_exists(pk)',
            },
          },
          {
            Put: {
              TableName: TABLE_NAME,
              Item: { ...keys.emailGuard(b.email), slotStartUtc: b.slotStartUtc },
              ConditionExpression: 'attribute_not_exists(pk)',
            },
          },
        ],
      }),
    );
  } catch (err) {
    const e = err as { name?: string; CancellationReasons?: { Code?: string }[] };
    if (e.name === 'TransactionCanceledException') {
      const [slot, guard] = e.CancellationReasons ?? [];
      if (slot?.Code === 'ConditionalCheckFailed') throw new SlotTakenError();
      if (guard?.Code === 'ConditionalCheckFailed') throw new AlreadyBookedError();
    }
    throw err;
  }
}

export async function getBooking(slotStartUtc: string): Promise<Booking | null> {
  const res = await docClient().send(
    new GetCommand({ TableName: TABLE_NAME, Key: keyFor(slotStartUtc) }),
  );
  return (res.Item as Booking | undefined) ?? null;
}

/** Frees the slot and releases the email guard. */
export async function deleteBooking(b: Booking): Promise<void> {
  await docClient().send(
    new TransactWriteCommand({
      TransactItems: [
        { Delete: { TableName: TABLE_NAME, Key: keyFor(b.slotStartUtc) } },
        { Delete: { TableName: TABLE_NAME, Key: keys.emailGuard(b.email) } },
      ],
    }),
  );
}

export async function listBookingsForDay(dayKey: string): Promise<Booking[]> {
  const res = await docClient().send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: { ':pk': `BOOKINGDAY#${dayKey}` },
    }),
  );
  return (res.Items ?? []) as Booking[];
}

/** Day-partitioned, so this is `days + 1` queries and never a table scan. */
export async function listBookedInstants(fromMs: number, days: number): Promise<string[]> {
  const out: string[] = [];
  for (let d = 0; d <= days; d++) {
    const dayKey = dayKeyFor(new Date(fromMs + d * 86400_000), SCHEDULE.timezone);
    for (const item of await listBookingsForDay(dayKey)) out.push(item.slotStartUtc);
  }
  return out;
}

/**
 * Sets a reminder flag, returning false if it was already set. The condition
 * is the entire reason a Lambda retry cannot send a second reminder.
 */
export async function markReminded(
  b: Booking,
  which: 'remindedT24' | 'remindedT1',
): Promise<boolean> {
  try {
    await docClient().send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: keyFor(b.slotStartUtc),
        UpdateExpression: 'SET #f = :true',
        ConditionExpression: 'attribute_exists(pk) AND #f = :false',
        ExpressionAttributeNames: { '#f': which },
        ExpressionAttributeValues: { ':true': true, ':false': false },
      }),
    );
    return true;
  } catch (err) {
    if ((err as Error).name === 'ConditionalCheckFailedException') return false;
    throw err;
  }
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `cd demo-backend && npx vitest run src/schedule/store.test.ts`
Expected: PASS, 4 tests

- [ ] **Step 6: Commit**

```bash
git add demo-backend/src/db.ts demo-backend/src/schedule/store.ts demo-backend/src/schedule/store.test.ts
git commit -m "feat(schedule): booking store with transactional slot + email guard"
```

---

### Task 3: Manage-link token

Possession of the link is the only proof of ownership, so this is the security boundary.

**Files:**
- Create: `demo-backend/src/schedule/token.ts`
- Test: `demo-backend/src/schedule/token.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `signBooking(slotStartUtc: string, email: string, secret: string): string`, `verifyBooking(slotStartUtc: string, email: string, sig: string, secret: string): boolean`

> **Revised during execution (commit 391886d).** As first written this task signed only
> `slotStartUtc`, which commits the signature to a *time* rather than to a *booking*: after
> a cancel and rebook of the same slot, the original booker's link still verified and could
> cancel or move the new booker's call. The HMAC now covers `${slotStartUtc}|${email.trim().toLowerCase()}`,
> normalised exactly as `keys.emailGuard` normalises it in `src/db.ts`, and the email is read
> from the stored booking at verify time rather than carried in the URL. The code and tests
> below show the original single-argument form; the shipped version takes the email too.

- [ ] **Step 1: Write the failing test**

```ts
// demo-backend/src/schedule/token.test.ts
import { describe, expect, it } from 'vitest';
import { signSlot, verifySlot } from './token';

const SECRET = 'test-secret';
const SLOT = '2026-08-20T18:30:00.000Z';

describe('signSlot / verifySlot', () => {
  it('accepts its own signature', () => {
    expect(verifySlot(SLOT, signSlot(SLOT, SECRET), SECRET)).toBe(true);
  });

  it('rejects a tampered slot, a tampered signature, and a foreign secret', () => {
    const sig = signSlot(SLOT, SECRET);
    expect(verifySlot('2026-08-20T19:00:00.000Z', sig, SECRET)).toBe(false);
    expect(verifySlot(SLOT, `${sig.slice(0, -1)}0`, SECRET)).toBe(false);
    expect(verifySlot(SLOT, sig, 'other-secret')).toBe(false);
  });

  it('rejects a malformed signature without throwing', () => {
    expect(verifySlot(SLOT, '', SECRET)).toBe(false);
    expect(verifySlot(SLOT, 'not-hex!!', SECRET)).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd demo-backend && npx vitest run src/schedule/token.test.ts`
Expected: FAIL — `Cannot find module './token'`

- [ ] **Step 3: Write the token module**

```ts
// demo-backend/src/schedule/token.ts
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd demo-backend && npx vitest run src/schedule/token.test.ts`
Expected: PASS, 3 tests

- [ ] **Step 5: Commit**

```bash
git add demo-backend/src/schedule/token.ts demo-backend/src/schedule/token.test.ts
git commit -m "feat(schedule): HMAC-signed manage links"
```

---

### Task 4: Calendar invite

**Files:**
- Create: `demo-backend/src/schedule/ics.ts`
- Test: `demo-backend/src/schedule/ics.test.ts`

**Interfaces:**
- Consumes: `SCHEDULE` (Task 1).
- Produces: `buildIcs(input: { slotStartUtc: string; attendeeEmail: string; attendeeName: string; organizerEmail: string; meetUrl: string; summary: string; description: string }): string`

- [ ] **Step 1: Write the failing test**

```ts
// demo-backend/src/schedule/ics.test.ts
import { describe, expect, it } from 'vitest';
import { buildIcs } from './ics';

const input = {
  slotStartUtc: '2026-08-20T18:30:00.000Z',
  attendeeEmail: 'ana@acme.com',
  attendeeName: 'Ana',
  organizerEmail: 'agent@demo.anytrail.ai',
  meetUrl: 'https://meet.google.com/kzk-tpgh-sbm',
  summary: 'Anytrail: commercial process review',
  description: 'A 30 minute call.',
};

describe('buildIcs', () => {
  it('emits a REQUEST with UTC stamps 30 minutes apart', () => {
    const ics = buildIcs(input);
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('METHOD:REQUEST');
    expect(ics).toContain('DTSTART:20260820T183000Z');
    expect(ics).toContain('DTEND:20260820T190000Z');
    expect(ics).toContain('LOCATION:https://meet.google.com/kzk-tpgh-sbm');
    expect(ics).toContain('END:VCALENDAR');
  });

  it('escapes commas and newlines, which would otherwise break parsing', () => {
    const ics = buildIcs({ ...input, description: 'Line one\nLine, two' });
    expect(ics).toContain('Line one\\nLine\\, two');
  });

  it('uses CRLF line endings, which strict parsers require', () => {
    expect(buildIcs(input).includes('\r\n')).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd demo-backend && npx vitest run src/schedule/ics.test.ts`
Expected: FAIL — `Cannot find module './ics'`

- [ ] **Step 3: Write the builder**

```ts
// demo-backend/src/schedule/ics.ts
import { SCHEDULE } from './config';

// RFC 5545: backslash, semicolon, comma and newline are the escapes that matter.
function escText(s: string): string {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/** 2026-08-20T18:30:00.000Z -> 20260820T183000Z */
function stamp(at: Date): string {
  return `${at.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`;
}

export interface IcsInput {
  slotStartUtc: string;
  attendeeEmail: string;
  attendeeName: string;
  organizerEmail: string;
  meetUrl: string;
  summary: string;
  description: string;
}

export function buildIcs(input: IcsInput): string {
  const start = new Date(input.slotStartUtc);
  const end = new Date(start.getTime() + SCHEDULE.slotMinutes * 60_000);
  // Deterministic from the slot: a reschedule mail for the same slot updates
  // the same calendar entry instead of creating a duplicate.
  const uid = `anytrail-${stamp(start)}@anytrail.ai`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Anytrail//Scheduling//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${escText(input.summary)}`,
    `DESCRIPTION:${escText(input.description)}`,
    `LOCATION:${escText(input.meetUrl)}`,
    `ORGANIZER;CN=Anytrail:mailto:${input.organizerEmail}`,
    `ATTENDEE;CN=${escText(input.attendeeName)};RSVP=TRUE:mailto:${input.attendeeEmail}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd demo-backend && npx vitest run src/schedule/ics.test.ts`
Expected: PASS, 3 tests

- [ ] **Step 5: Commit**

```bash
git add demo-backend/src/schedule/ics.ts demo-backend/src/schedule/ics.test.ts
git commit -m "feat(schedule): ics calendar invite builder"
```

---

### Task 5: Confirmation and reminder emails

Starts by extracting `esc()` so two email modules cannot drift apart.

**Files:**
- Create: `demo-backend/src/html.ts`
- Modify: `demo-backend/src/email.ts` (import `esc` instead of defining it)
- Modify: `demo-backend/src/notify.ts` (extract `postSlack`, add `notifyBooking`)
- Create: `demo-backend/src/schedule/email.ts`
- Test: `demo-backend/src/schedule/email.test.ts`

**Interfaces:**
- Consumes: `getSecret` (`src/secrets.ts`), `outboundFetch` (`src/net/outbound-fetch.ts`), `buildIcs` (Task 4), `Booking` (Task 2), `signBooking` (Task 3).
- Produces:
  - `esc(s: string): string` from `src/html.ts`
  - `postSlack(text: string): Promise<void>` and `notifyBooking(b: Booking): Promise<void>` from `src/notify.ts`
  - `renderConfirmation(b: Booking, manageUrl: string, meetUrl: string): { subject: string; html: string; text: string }`
  - `renderReminder(b: Booking, manageUrl: string, meetUrl: string, which: 'T24' | 'T1'): { subject: string; html: string; text: string }`
  - `sendBookingEmails(b: Booking, manageUrl: string): Promise<void>`
  - `sendReminderEmail(b: Booking, manageUrl: string, which: 'T24' | 'T1'): Promise<void>`

- [ ] **Step 1: Write the failing test**

```ts
// demo-backend/src/schedule/email.test.ts
import { describe, expect, it } from 'vitest';
import { renderConfirmation, renderReminder } from './email';

const booking = {
  slotStartUtc: '2026-08-20T18:30:00.000Z',
  name: 'Ana <script>',
  email: 'ana@acme.com',
  website: 'https://acme.com',
  note: '',
  lang: 'en' as const,
  remindedT24: false,
  remindedT1: false,
  createdAt: '2026-08-19T12:00:00.000Z',
  ip: '1.2.3.4',
};

const MANAGE = 'https://www.anytrail.ai/schedule?b=2026-08-20T18%3A30%3A00.000Z&s=abc';
const MEET = 'https://meet.google.com/kzk-tpgh-sbm';

describe('renderConfirmation', () => {
  it('escapes HTML, carries the brand, the meet link, the manage link and the demo CTA', () => {
    const { html, text, subject } = renderConfirmation(booking, MANAGE, MEET);
    expect(html).toContain('Ana &lt;script&gt;');
    expect(html).not.toContain('<script>');
    expect(html).toContain('#2f6f4f');
    expect(html).toContain(MEET);
    expect(html).toContain(MANAGE);
    expect(html).toContain('/demo');
    expect(text).toContain(MEET);
    expect(subject).toContain('2:30 PM');
  });

  it('renders the Spanish version when lang is es', () => {
    const { html } = renderConfirmation({ ...booking, lang: 'es' }, MANAGE, MEET);
    expect(html).toContain('Tu llamada');
    expect(html).not.toContain('Your call');
  });

  it('never uses an em dash', () => {
    const { html, text } = renderConfirmation(booking, MANAGE, MEET);
    expect(html).not.toContain('—');
    expect(text).not.toContain('—');
  });
});

describe('renderReminder', () => {
  it('says tomorrow at T-24 and shortly at T-1', () => {
    expect(renderReminder(booking, MANAGE, MEET, 'T24').subject.toLowerCase()).toContain('tomorrow');
    expect(renderReminder(booking, MANAGE, MEET, 'T1').subject.toLowerCase()).toContain('hour');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd demo-backend && npx vitest run src/schedule/email.test.ts`
Expected: FAIL — `Cannot find module './email'`

- [ ] **Step 3: Extract `esc` into a shared module**

Create `demo-backend/src/html.ts`:

```ts
// demo-backend/src/html.ts
/** HTML-escape untrusted text before it goes into an email template. */
export function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
```

In `demo-backend/src/email.ts`, delete the local `function esc(...)` (line 25) and add to the imports at the top:

```ts
import { esc } from './html';
```

- [ ] **Step 4: Verify the extraction broke nothing**

Run: `cd demo-backend && npx vitest run src/email.test.ts`
Expected: PASS — the existing prospects-email test still green

- [ ] **Step 5: Extract the Slack poster and add the booking ping**

The spec requires a Slack ping on every booking, and `notify.ts` already owns that webhook. Extract it rather than opening a second copy.

In `demo-backend/src/notify.ts`, replace the inline Slack block inside `notifySignup` with a call to a new exported function, and add the booking notifier:

```ts
/** Slack-incoming-webhook compatible POST. Never throws: a Slack outage must
 *  never fail the visitor action that triggered it. */
export async function postSlack(text: string): Promise<void> {
  if (!process.env.SLACK_WEBHOOK_SECRET_ARN) return;
  try {
    const url = await getSecret('SLACK_WEBHOOK_SECRET_ARN');
    const res = await outboundFetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) console.error('notify_slack_failed', res.status);
  } catch (err) {
    console.error('notify_slack_failed', err);
  }
}

/** Booking ping (ANY-66). Fire-and-forget, like every other notification. */
export async function notifyBooking(info: {
  name: string;
  email: string;
  website: string;
  when: string;
  note: string;
}): Promise<void> {
  await postSlack(
    `📅 Call booked: ${info.name} <${info.email}> — ${info.website}\n${info.when}${info.note ? `\nNote: ${info.note}` : ''}`,
  );
}
```

Then, inside `notifySignup`, the existing Slack task becomes `tasks.push(postSlack(line));`.

- [ ] **Step 6: Verify the extraction broke nothing**

Run: `cd demo-backend && npm test`
Expected: PASS — the existing suites are still green

- [ ] **Step 7: Write the schedule email module**

```ts
// demo-backend/src/schedule/email.ts
import { esc } from '../html';
import { outboundFetch } from '../net/outbound-fetch';
import { notifyBooking } from '../notify';
import { getSecret } from '../secrets';
import { MEET_URL, SCHEDULE } from './config';
import { buildIcs } from './ics';
import type { Booking } from './store';

const SENDER = process.env.EMAIL_SENDER ?? 'Anytrail <agent@demo.anytrail.ai>';
const TEAM = process.env.EMAIL_TEAM_COPY ?? '';
const SITE = 'https://www.anytrail.ai';

// Landing palette, same values as src/email.ts.
const C = {
  pageBg: '#fefdf6',
  surface: '#ffffff',
  border: '#e7e2d1',
  text: '#111827',
  muted: '#6b7280',
  faint: '#9ca3af',
  accent: '#2f6f4f',
  accentSoft: '#e8f0eb',
};

/** "Thursday, August 20, 2026 at 2:30 PM EDT" in the visitor's language. */
export function formatSlot(slotStartUtc: string, lang: 'en' | 'es'): string {
  return new Intl.DateTimeFormat(lang === 'es' ? 'es-MX' : 'en-US', {
    timeZone: SCHEDULE.timezone,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(new Date(slotStartUtc));
}

const T = {
  en: {
    subject: (when: string) => `Your Anytrail call is booked: ${when}`,
    heading: 'Your call is booked.',
    join: 'Join the call',
    manage: 'Need to change it? Cancel or move your call',
    demoLead: 'While you wait, run the agent on your own catalog:',
    demoCta: 'Try the live demo',
    minutes: `${SCHEDULE.slotMinutes} minutes, by video.`,
    remind24: (when: string) => `Reminder: your Anytrail call is tomorrow, ${when}`,
    remind1: (when: string) => `Starting in an hour: your Anytrail call at ${when}`,
  },
  es: {
    subject: (when: string) => `Tu llamada con Anytrail está agendada: ${when}`,
    heading: 'Tu llamada está agendada.',
    join: 'Entrar a la llamada',
    manage: '¿Necesitas cambiarla? Cancela o mueve tu llamada',
    demoLead: 'Mientras tanto, prueba el agente con tu propio catálogo:',
    demoCta: 'Probar la demo',
    minutes: `${SCHEDULE.slotMinutes} minutos, por video.`,
    remind24: (when: string) => `Recordatorio: tu llamada con Anytrail es mañana, ${when}`,
    remind1: (when: string) => `Comienza en una hora: tu llamada con Anytrail a las ${when}`,
  },
} as const;

function shell(inner: string): string {
  return `<div style="background:${C.pageBg};padding:32px 0;font-family:-apple-system,Segoe UI,Roboto,sans-serif">
  <div style="max-width:560px;margin:0 auto;background:${C.surface};border:1px solid ${C.border};border-radius:12px;padding:32px">
    <div style="font-weight:700;font-size:18px;color:${C.text};margin-bottom:24px">anytrail</div>
    ${inner}
    <div style="margin-top:28px;border-top:1px solid ${C.border};padding-top:16px;font-size:12px;color:${C.faint}">
      Anytrail · <a href="${SITE}" style="color:${C.accent}">anytrail.ai</a>
    </div>
  </div>
</div>`;
}

export function renderConfirmation(
  b: Booking,
  manageUrl: string,
  meetUrl: string,
): { subject: string; html: string; text: string } {
  const t = T[b.lang];
  const when = formatSlot(b.slotStartUtc, b.lang);
  const demoUrl = `${SITE}${b.lang === 'es' ? '/es/demo' : '/demo'}`;

  const html = shell(`
    <h1 style="font-size:22px;color:${C.text};margin:0 0 8px">${t.heading}</h1>
    <p style="color:${C.text};font-size:16px;margin:0 0 4px"><strong>${esc(when)}</strong></p>
    <p style="color:${C.muted};font-size:14px;margin:0 0 24px">${t.minutes}</p>
    <a href="${meetUrl}" style="display:inline-block;background:#000;color:#fff;padding:13px 26px;border-radius:8px;font-weight:600;text-decoration:none">${t.join}</a>
    <p style="margin:24px 0 0;font-size:14px"><a href="${manageUrl}" style="color:${C.muted}">${t.manage}</a></p>
    <div style="margin-top:28px;background:${C.accentSoft};border-radius:8px;padding:16px">
      <p style="margin:0 0 8px;font-size:14px;color:${C.text}">${esc(b.name)}, ${t.demoLead}</p>
      <a href="${demoUrl}" style="color:${C.accent};font-weight:600">${t.demoCta}</a>
    </div>`);

  const text = [
    t.heading,
    when,
    t.minutes,
    `${t.join}: ${meetUrl}`,
    `${t.manage}: ${manageUrl}`,
    `${t.demoCta}: ${demoUrl}`,
  ].join('\n\n');

  return { subject: t.subject(when), html, text };
}

export function renderReminder(
  b: Booking,
  manageUrl: string,
  meetUrl: string,
  which: 'T24' | 'T1',
): { subject: string; html: string; text: string } {
  const t = T[b.lang];
  const when = formatSlot(b.slotStartUtc, b.lang);
  const subject = which === 'T24' ? t.remind24(when) : t.remind1(when);

  const html = shell(`
    <h1 style="font-size:20px;color:${C.text};margin:0 0 8px">${esc(subject)}</h1>
    <p style="color:${C.text};font-size:16px;margin:0 0 24px"><strong>${esc(when)}</strong></p>
    <a href="${meetUrl}" style="display:inline-block;background:#000;color:#fff;padding:13px 26px;border-radius:8px;font-weight:600;text-decoration:none">${t.join}</a>
    <p style="margin:24px 0 0;font-size:14px"><a href="${manageUrl}" style="color:${C.muted}">${t.manage}</a></p>`);

  return { subject, html, text: [subject, when, `${t.join}: ${meetUrl}`, manageUrl].join('\n\n') };
}

async function send(payload: Record<string, unknown>): Promise<void> {
  const apiKey = await getSecret('RESEND_SECRET_ARN');
  const res = await outboundFetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from: SENDER, ...payload }),
  });
  if (!res.ok) console.error('schedule_email_failed', res.status, await res.text());
}

/**
 * Visitor confirmation plus a team copy, both carrying the .ics. Best-effort:
 * a mail failure logs and never fails the booking the visitor already made.
 */
export async function sendBookingEmails(b: Booking, manageUrl: string): Promise<void> {
  const { subject, html, text } = renderConfirmation(b, manageUrl, MEET_URL);
  const ics = buildIcs({
    slotStartUtc: b.slotStartUtc,
    attendeeEmail: b.email,
    attendeeName: b.name,
    organizerEmail: (SENDER.match(/<(.+)>/) ?? [, SENDER])[1] as string,
    meetUrl: MEET_URL,
    summary: 'Anytrail: commercial process review',
    description: `${SCHEDULE.slotMinutes} minutes by video. Join: ${MEET_URL}`,
  });
  const attachments = [
    { filename: 'anytrail-call.ics', content: Buffer.from(ics).toString('base64') },
  ];

  try {
    await send({ to: [b.email], subject, html, text, attachments });
    if (TEAM) {
      await send({
        to: [TEAM],
        subject: `New booking: ${b.name} (${b.website}) ${formatSlot(b.slotStartUtc, 'en')}`,
        text: `${b.name} <${b.email}>\n${b.website}\n${b.note}\n\n${formatSlot(b.slotStartUtc, 'en')}`,
        attachments,
      });
    }
  } catch (err) {
    console.error('send_booking_emails_failed', err);
  }

  // Slack ping is separate from the mail: one failing must not skip the other.
  await notifyBooking({
    name: b.name,
    email: b.email,
    website: b.website,
    when: formatSlot(b.slotStartUtc, 'en'),
    note: b.note,
  });
}

export async function sendReminderEmail(
  b: Booking,
  manageUrl: string,
  which: 'T24' | 'T1',
): Promise<void> {
  const { subject, html, text } = renderReminder(b, manageUrl, MEET_URL, which);
  try {
    await send({ to: [b.email], subject, html, text });
  } catch (err) {
    console.error('send_reminder_failed', err);
  }
}
```

- [ ] **Step 8: Run tests to verify they pass**

Run: `cd demo-backend && npx vitest run src/schedule/email.test.ts src/email.test.ts`
Expected: PASS, 5 tests

- [ ] **Step 9: Commit**

```bash
git add demo-backend/src/html.ts demo-backend/src/email.ts demo-backend/src/notify.ts demo-backend/src/schedule/email.ts demo-backend/src/schedule/email.test.ts
git commit -m "feat(schedule): bilingual confirmation and reminder emails, Slack ping"
```

---

### Task 6: API routes

**Files:**
- Create: `demo-backend/src/api/schedule.ts`
- Modify: `demo-backend/src/api/handler.ts` (route table + four handlers)
- Test: `demo-backend/src/api/schedule.test.ts`

**Interfaces:**
- Consumes: everything from Tasks 1–5, plus `assertWithinRateLimit` (`src/api/rate-limit.ts`) and `getSecret`.
- Produces:
  - `bookSchema` (zod), `openSlots(nowMs: number): Promise<string[]>`
  - `book(input, ip): Promise<{ slotStartUtc: string; manageUrl: string }>`
  - `view(slotStartUtc, sig): Promise<Booking>`
  - `cancel(slotStartUtc, sig): Promise<void>`, `move(slotStartUtc, sig, toSlotStartUtc): Promise<{ slotStartUtc: string; manageUrl: string }>`
  - `InvalidSignatureError`, `UnknownBookingError`, `SlotUnavailableError`

- [ ] **Step 1: Write the failing test**

```ts
// demo-backend/src/api/schedule.test.ts
import { describe, expect, it } from 'vitest';
import { bookSchema } from './schedule';

describe('bookSchema', () => {
  it('accepts a complete booking and defaults the optional note', () => {
    const parsed = bookSchema.parse({
      slotStartUtc: '2026-08-20T18:30:00.000Z',
      name: 'Ana',
      email: 'ana@acme.com',
      website: 'acme.com',
      lang: 'en',
    });
    expect(parsed.note).toBe('');
  });

  it('rejects a bad email, a bad instant, an unknown language, and an oversized note', () => {
    const base = {
      slotStartUtc: '2026-08-20T18:30:00.000Z',
      name: 'Ana',
      email: 'ana@acme.com',
      website: 'acme.com',
      lang: 'en',
    };
    expect(bookSchema.safeParse({ ...base, email: 'nope' }).success).toBe(false);
    expect(bookSchema.safeParse({ ...base, slotStartUtc: 'tomorrow' }).success).toBe(false);
    expect(bookSchema.safeParse({ ...base, lang: 'fr' }).success).toBe(false);
    expect(bookSchema.safeParse({ ...base, note: 'x'.repeat(2001) }).success).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd demo-backend && npx vitest run src/api/schedule.test.ts`
Expected: FAIL — `Cannot find module './schedule'`

- [ ] **Step 3: Write the route module**

```ts
// demo-backend/src/api/schedule.ts
import { z } from 'zod';
import { getSecret } from '../secrets';
import { SCHEDULE } from '../schedule/config';
import { sendBookingEmails } from '../schedule/email';
import { generateSlots } from '../schedule/slots';
import {
  type Booking,
  createBooking,
  deleteBooking,
  getBooking,
  listBookedInstants,
} from '../schedule/store';
import { signBooking, verifyBooking } from '../schedule/token';
import { normalizeWebsite } from './start';

const SITE = 'https://www.anytrail.ai';

export class InvalidSignatureError extends Error {
  constructor() {
    super('invalid_signature');
    this.name = 'InvalidSignatureError';
  }
}
export class UnknownBookingError extends Error {
  constructor() {
    super('unknown_booking');
    this.name = 'UnknownBookingError';
  }
}
export class SlotUnavailableError extends Error {
  constructor() {
    super('slot_unavailable');
    this.name = 'SlotUnavailableError';
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

/**
 * The signature commits to the slot AND the booker's address, so a stale link
 * from a cancelled booking cannot control whoever books that slot next. The
 * email is never in the URL — it comes from the stored row at verify time.
 */
async function manageUrlFor(b: Pick<Booking, 'slotStartUtc' | 'email' | 'lang'>): Promise<string> {
  const secret = await getSecret('SCHEDULE_SECRET_ARN');
  const path = b.lang === 'es' ? '/es/agenda' : '/schedule';
  const sig = signBooking(b.slotStartUtc, b.email, secret);
  return `${SITE}${path}?b=${encodeURIComponent(b.slotStartUtc)}&s=${sig}`;
}

export async function book(
  input: BookInput,
  ip: string,
): Promise<{ slotStartUtc: string; manageUrl: string }> {
  // Never trust the client's idea of what is bookable: re-derive it here.
  const open = await openSlots(Date.now());
  if (!open.includes(input.slotStartUtc)) throw new SlotUnavailableError();

  const { url } = normalizeWebsite(input.website);
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
 * New slot goes in first, old one comes out after. A race can lose the move,
 * never the booking.
 */
export async function move(
  slotStartUtc: string,
  sig: string,
  toSlotStartUtc: string,
): Promise<{ slotStartUtc: string; manageUrl: string }> {
  const existing = await authorize(slotStartUtc, sig);
  const open = await openSlots(Date.now());
  if (!open.includes(toSlotStartUtc)) throw new SlotUnavailableError();

  await deleteBooking(existing);
  const moved: Booking = {
    ...existing,
    slotStartUtc: toSlotStartUtc,
    remindedT24: new Date(toSlotStartUtc).getTime() - Date.now() < 24 * 60 * 60 * 1000,
    remindedT1: false,
  };
  await createBooking(moved);
  const manageUrl = await manageUrlFor(moved);
  await sendBookingEmails(moved, manageUrl);
  return { slotStartUtc: toSlotStartUtc, manageUrl };
}
```

- [ ] **Step 4: Wire the routes**

In `demo-backend/src/api/handler.ts`, extend the route comment and the `if` chain:

```ts
//   POST /demo/start     — lead capture + extraction kickoff (ANY-113/114)
//   POST /demo/prospects — ICP + Apollo leads (ANY-115)
//   GET  /schedule/slots — open call slots (ANY-66)
//   POST /schedule/book|cancel|move — booking lifecycle (ANY-66)
```

```ts
    else if (route === 'GET /schedule/slots') res = await handleSlots();
    else if (route === 'POST /schedule/book') res = await handleBook(event);
    else if (route === 'GET /schedule/manage') res = await handleManage(event);
    else if (route === 'POST /schedule/cancel') res = await handleCancel(event);
    else if (route === 'POST /schedule/move') res = await handleMove(event);
```

Add the handlers below the existing ones:

```ts
async function handleSlots(): Promise<APIGatewayProxyResultV2> {
  return json(200, { slots: await openSlots(Date.now()) });
}

async function handleBook(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  const parsed = bookSchema.safeParse(parseBody(event));
  if (!parsed.success) {
    return json(422, { error: 'invalid_input', issues: parsed.error.issues });
  }
  const ip = event.requestContext.http.sourceIp ?? 'unknown';
  try {
    await assertWithinRateLimit(ip);
    return json(200, await book(parsed.data, ip));
  } catch (err) {
    return scheduleError(err);
  }
}

async function handleManage(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  const { b, s } = event.queryStringParameters ?? {};
  if (!b || !s) return json(422, { error: 'invalid_input' });
  try {
    const booking = await view(b, s);
    // Never echo the IP or the note back to the browser.
    return json(200, {
      slotStartUtc: booking.slotStartUtc,
      name: booking.name,
      lang: booking.lang,
    });
  } catch (err) {
    return scheduleError(err);
  }
}

async function handleCancel(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  const body = parseBody(event) as { slotStartUtc?: string; sig?: string };
  if (!body.slotStartUtc || !body.sig) return json(422, { error: 'invalid_input' });
  try {
    await cancel(body.slotStartUtc, body.sig);
    return json(200, { ok: true });
  } catch (err) {
    return scheduleError(err);
  }
}

async function handleMove(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  const body = parseBody(event) as {
    slotStartUtc?: string;
    sig?: string;
    toSlotStartUtc?: string;
  };
  if (!body.slotStartUtc || !body.sig || !body.toSlotStartUtc) {
    return json(422, { error: 'invalid_input' });
  }
  try {
    return json(200, await move(body.slotStartUtc, body.sig, body.toSlotStartUtc));
  } catch (err) {
    return scheduleError(err);
  }
}

// 409 means "pick another slot", 403 means "that link is not yours".
function scheduleError(err: unknown): APIGatewayProxyResultV2 {
  const name = (err as Error).name;
  const msg = (err as Error).message;
  // normalizeWebsite rejects junk domains, and the URL constructor throws a
  // TypeError on unparseable input. Both are the caller's fault, not ours.
  if (msg === 'invalid_domain' || name === 'TypeError') {
    return json(422, { error: 'invalid_website' });
  }
  if (name === 'RateLimitedError') return json(429, { error: 'rate_limited' });
  if (name === 'SlotTakenError' || name === 'SlotUnavailableError') {
    return json(409, { error: 'slot_taken' });
  }
  if (name === 'AlreadyBookedError') return json(409, { error: 'already_booked' });
  if (name === 'InvalidSignatureError') return json(403, { error: 'invalid_link' });
  if (name === 'UnknownBookingError') return json(404, { error: 'unknown_booking' });
  throw err;
}
```

Add to the imports at the top of `handler.ts`:

```ts
import { book, bookSchema, cancel, move, openSlots, view } from './schedule';
```

- [ ] **Step 5: Run the full backend suite**

Run: `cd demo-backend && npm test`
Expected: PASS — all suites including the new schema tests

- [ ] **Step 6: Commit**

```bash
git add demo-backend/src/api/schedule.ts demo-backend/src/api/schedule.test.ts demo-backend/src/api/handler.ts
git commit -m "feat(schedule): slots, book, manage, cancel and move routes"
```

---

### Task 7: Reminder sweep

**Files:**
- Create: `demo-backend/src/reminders/handler.ts`
- Test: `demo-backend/src/reminders/handler.test.ts`

**Interfaces:**
- Consumes: `listBookingsForDay`, `markReminded`, `Booking` (Task 2); `dayKeyFor` (Task 1); `sendReminderEmail` (Task 5); `signBooking` (Task 3).
- Produces: `dueReminders(bookings: Booking[], nowMs: number): { booking: Booking; which: 'T24' | 'T1' }[]`, `handler(): Promise<void>`

- [ ] **Step 1: Write the failing test**

```ts
// demo-backend/src/reminders/handler.test.ts
import { describe, expect, it } from 'vitest';
import type { Booking } from '../schedule/store';
import { dueReminders } from './handler';

const base: Booking = {
  slotStartUtc: '',
  name: 'Ana',
  email: 'ana@acme.com',
  website: 'https://acme.com',
  note: '',
  lang: 'en',
  remindedT24: false,
  remindedT1: false,
  createdAt: '2026-08-19T12:00:00.000Z',
  ip: '1.2.3.4',
};

const now = Date.parse('2026-08-20T12:00:00.000Z');
const at = (offsetMs: number, over: Partial<Booking> = {}): Booking => ({
  ...base,
  ...over,
  slotStartUtc: new Date(now + offsetMs).toISOString(),
});

const H = 60 * 60 * 1000;

describe('dueReminders', () => {
  it('sends T-24 inside the sweep window and not before it', () => {
    // Sweep runs every 15 minutes, so the window is [24h - 15m, 24h].
    expect(dueReminders([at(23.9 * H)], now)[0]?.which).toBe('T24');
    expect(dueReminders([at(30 * H)], now)).toEqual([]);
  });

  it('sends T-1 inside its window', () => {
    expect(dueReminders([at(0.9 * H)], now)[0]?.which).toBe('T1');
  });

  it('skips flags that are already set', () => {
    expect(dueReminders([at(23.9 * H, { remindedT24: true })], now)).toEqual([]);
    expect(dueReminders([at(0.9 * H, { remindedT1: true })], now)).toEqual([]);
  });

  it('never reminds about a call that already started', () => {
    expect(dueReminders([at(-1 * H)], now)).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd demo-backend && npx vitest run src/reminders/handler.test.ts`
Expected: FAIL — `Cannot find module './handler'`

- [ ] **Step 3: Write the sweep**

```ts
// demo-backend/src/reminders/handler.ts
import { SCHEDULE } from '../schedule/config';
import { sendReminderEmail } from '../schedule/email';
import { dayKeyFor } from '../schedule/slots';
import { type Booking, listBookingsForDay, markReminded } from '../schedule/store';
import { signBooking } from '../schedule/token';
import { getSecret } from '../secrets';

const SITE = 'https://www.anytrail.ai';
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

  const secret = await getSecret('SCHEDULE_SECRET_ARN');
  for (const { booking, which } of due) {
    // Claim first: the conditional update is what makes a Lambda retry safe.
    const claimed = await markReminded(booking, which === 'T24' ? 'remindedT24' : 'remindedT1');
    if (!claimed) continue;
    const path = booking.lang === 'es' ? '/es/agenda' : '/schedule';
    const manageUrl = `${SITE}${path}?b=${encodeURIComponent(booking.slotStartUtc)}&s=${signBooking(booking.slotStartUtc, booking.email, secret)}`;
    await sendReminderEmail(booking, manageUrl, which);
  }
  console.log('reminders_sent', { count: due.length });
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd demo-backend && npx vitest run src/reminders/handler.test.ts`
Expected: PASS, 4 tests

- [ ] **Step 5: Commit**

```bash
git add demo-backend/src/reminders/handler.ts demo-backend/src/reminders/handler.test.ts
git commit -m "feat(schedule): 15-minute reminder sweep with idempotent claims"
```

---

### Task 8: Infrastructure

**Files:**
- Modify: `demo-backend/lib/api-stack.ts`
- Modify: `demo-backend/src/secrets.ts` (widen the env-var union)

**Interfaces:**
- Consumes: `src/reminders/handler.ts` (Task 7).
- Produces: `MEET_URL` and `SCHEDULE_SECRET_ARN` on both API Lambdas; a `ReminderFn` on a 15-minute schedule.

- [ ] **Step 1: Widen the secrets union**

In `demo-backend/src/secrets.ts`, add `'SCHEDULE_SECRET_ARN'` to the `envVar` parameter type:

```ts
export async function getSecret(
  envVar:
    | 'FIRECRAWL_SECRET_ARN'
    | 'APOLLO_SECRET_ARN'
    | 'RESEND_SECRET_ARN'
    | 'SLACK_WEBHOOK_SECRET_ARN'
    | 'SCHEDULE_SECRET_ARN',
): Promise<string> {
```

- [ ] **Step 2: Add the secret, the env vars, and the reminder Lambda**

In `demo-backend/lib/api-stack.ts`, add the secret beside the existing four:

```ts
    const scheduleSecret = new secretsmanager.Secret(this, 'ScheduleSigningKey', {
      secretName: 'anytrail/demo/schedule-signing',
      description: 'HMAC key for scheduling manage links',
      generateSecretString: { passwordLength: 48, excludePunctuation: true },
    });
```

Add to the shared `environment` block:

```ts
        SCHEDULE_SECRET_ARN: scheduleSecret.secretArn,
        // The standing video room every booking is held in (ANY-66).
        MEET_URL: 'https://meet.google.com/kzk-tpgh-sbm',
```

Grant read in the existing loop:

```ts
    for (const fn of [apiFn, chatFn]) {
      ...
      scheduleSecret.grantRead(fn);
```

Then the reminder function and its rule, after the alarms block:

```ts
    // Reminders: one rule for the whole system, not a schedule per booking, so
    // a cancelled call leaves nothing behind to clean up.
    const reminderFn = new NodejsFunction(this, 'ReminderFn', {
      ...common,
      entry: path.join(__dirname, '../src/reminders/handler.ts'),
      timeout: cdk.Duration.minutes(2),
    });
    props.table.grantReadWriteData(reminderFn);
    resendSecret.grantRead(reminderFn);
    scheduleSecret.grantRead(reminderFn);

    new events.Rule(this, 'ReminderSchedule', {
      schedule: events.Schedule.rate(cdk.Duration.minutes(15)),
      targets: [new targets.LambdaFunction(reminderFn)],
    });
```

Add the imports at the top of the file:

```ts
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
```

- [ ] **Step 3: Verify the stack synthesizes**

Run: `cd demo-backend && npm run synth`
Expected: succeeds; the template contains `AWS::Events::Rule` and the `ReminderFn` resource

- [ ] **Step 4: Commit**

```bash
git add demo-backend/lib/api-stack.ts demo-backend/src/secrets.ts
git commit -m "feat(schedule): signing secret, meet URL and reminder schedule"
```

---

### Task 9: Routes and copy

Frontend from here. The landing repo has no test runner, so each task ends with a build plus a prerender check.

**Files:**
- Modify: `src/i18n/copy.js` (`ROUTES`, `schedule` copy EN + ES, `thanks` demo CTA)
- Modify: `src/App.jsx` (register the page)
- Create: `src/pages/Schedule.jsx` (placeholder, filled in Task 10)

**Interfaces:**
- Consumes: nothing.
- Produces: `ROUTES.en.schedule = '/schedule'`, `ROUTES.es.schedule = '/es/agenda'`, `COPY[lang].schedule`

- [ ] **Step 1: Add the routes**

In `src/i18n/copy.js`:

```js
export const ROUTES = {
  en: { home: '/', thanks: '/thanks', demo: '/demo', schedule: '/schedule' },
  es: { home: '/es', thanks: '/es/gracias', demo: '/es/demo', schedule: '/es/agenda' },
}
```

- [ ] **Step 2: Add the English copy**

In `COPY.en`, after the `demo` block:

```js
    schedule: {
      meta: {
        title: 'Book a commercial process review | Anytrail',
        description:
          'Book a 30 minute video call. We look at how your company finds and answers new opportunities today, and show you where sales are being lost.',
        ogLocale: 'en_US',
      },
      title: 'Review my commercial process',
      intro:
        'Thirty minutes, by video. We look at how opportunities reach you today, how fast they get answered, and what happens to the ones nobody follows up on.',
      bullets: [
        'Before the call we send an inquiry through your own channels and time the reply.',
        'You get the timings and the gaps, whether or not you buy anything.',
        'No slides. Bring the questions your sales team argues about.',
      ],
      pickDay: 'Pick a day',
      pickTime: 'Pick a time',
      yourZone: 'Times shown in your timezone',
      noSlots: 'No open times in that week. Try another day.',
      form: { name: 'Your name', email: 'Work email', website: 'Company website', note: 'Anything we should know? (optional)' },
      submit: 'Book the call',
      booking: 'Booking...',
      manageTitle: 'Your booking',
      cancel: 'Cancel this call',
      move: 'Move to another time',
      cancelled: 'Your call is cancelled. You can book another any time.',
      errors: {
        invalid_website: "We couldn't use that website address. Check the URL and try again.",
        slot_taken: 'Someone just took that time. Pick another one.',
        already_booked: 'You already have a call booked. Use the link in your confirmation email to change it.',
        rate_limited: 'Too many attempts. Try again later.',
        invalid_link: 'That link is not valid. Check the one in your confirmation email.',
        unknown_booking: 'We could not find that booking. It may already be cancelled.',
        generic: 'Something went wrong. Try again.',
      },
    },
```

- [ ] **Step 3: Add the Spanish copy**

In `COPY.es`, in the same position:

```js
    schedule: {
      meta: {
        title: 'Agenda una revisión de tu proceso comercial | Anytrail',
        description:
          'Agenda una videollamada de 30 minutos. Revisamos cómo tu empresa encuentra y responde nuevas oportunidades hoy, y dónde se están perdiendo ventas.',
        ogLocale: 'es_MX',
      },
      title: 'Revisa mi proceso comercial',
      intro:
        'Treinta minutos, por video. Revisamos cómo te llegan las oportunidades hoy, qué tan rápido se responden, y qué pasa con las que nadie sigue.',
      bullets: [
        'Antes de la llamada enviamos una consulta por tus propios canales y medimos cuánto tarda la respuesta.',
        'Te entregamos los tiempos y las fugas, compres algo o no.',
        'Sin presentaciones. Trae las preguntas que tu equipo comercial discute.',
      ],
      pickDay: 'Elige un día',
      pickTime: 'Elige una hora',
      yourZone: 'Horarios en tu zona horaria',
      noSlots: 'No hay horarios disponibles ese día. Prueba con otro.',
      form: { name: 'Tu nombre', email: 'Correo de trabajo', website: 'Sitio web de la empresa', note: '¿Algo que debamos saber? (opcional)' },
      submit: 'Agendar la llamada',
      booking: 'Agendando...',
      manageTitle: 'Tu cita',
      cancel: 'Cancelar esta llamada',
      move: 'Mover a otro horario',
      cancelled: 'Tu llamada fue cancelada. Puedes agendar otra cuando quieras.',
      errors: {
        invalid_website: 'No pudimos usar esa dirección web. Revisa la URL e inténtalo de nuevo.',
        slot_taken: 'Alguien acaba de tomar ese horario. Elige otro.',
        already_booked: 'Ya tienes una llamada agendada. Usa el enlace de tu correo de confirmación para cambiarla.',
        rate_limited: 'Demasiados intentos. Inténtalo más tarde.',
        invalid_link: 'Ese enlace no es válido. Revisa el de tu correo de confirmación.',
        unknown_booking: 'No encontramos esa cita. Puede que ya esté cancelada.',
        generic: 'Algo salió mal. Inténtalo de nuevo.',
      },
    },
```

- [ ] **Step 4: Add the demo CTA to both thanks blocks**

In `COPY.en.thanks`, add two keys:

```js
      demoLead: 'While you wait, run the agent on your own catalog.',
      demoCta: 'Try the live demo',
```

In `COPY.es.thanks`:

```js
      demoLead: 'Mientras tanto, prueba el agente con tu propio catálogo.',
      demoCta: 'Probar la demo',
```

- [ ] **Step 5: Register the page**

Create `src/pages/Schedule.jsx` as a placeholder so the build passes; Task 10 fills it in:

```jsx
import { useLanguage } from '../i18n/useLanguage'

function Schedule() {
  const { copy } = useLanguage()
  return <section className="schedule-page">{copy.schedule.title}</section>
}

export default Schedule
```

In `src/App.jsx`, add the import and the `PAGES` entry:

```jsx
import Schedule from './pages/Schedule'

const PAGES = { home: Home, thanks: Thanks, demo: Demo, schedule: Schedule }
```

- [ ] **Step 6: Verify all eight routes prerender**

Run: `npm run build`
Expected: the prerender log lists `/schedule` and `/es/agenda` alongside the existing six, and `sitemap.xml` is written

- [ ] **Step 7: Commit**

```bash
git add src/i18n/copy.js src/App.jsx src/pages/Schedule.jsx
git commit -m "feat(schedule): route pair and bilingual copy"
```

---

### Task 10: The scheduling page

**Files:**
- Create: `src/pages/scheduleApi.js`
- Modify: `src/pages/Schedule.jsx` (replace the placeholder)
- Create: `src/pages/Schedule.css`

**Interfaces:**
- Consumes: `COPY[lang].schedule` (Task 9), the four routes (Task 6).
- Produces: nothing other tasks depend on.

- [ ] **Step 1: Write the API client**

```js
// src/pages/scheduleApi.js
// Client for the scheduling routes on the demo backend. Mirrors demoApi.js.
const API_URL = 'https://3cyy3hfm3a.execute-api.us-east-1.amazonaws.com'

async function request(path, { method = 'POST', body } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: body ? { 'content-type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? `http_${res.status}`)
  return data
}

export const openSlots = () => request('/schedule/slots', { method: 'GET' })
export const bookSlot = (input) => request('/schedule/book', { body: input })
export const viewBooking = (b, s) =>
  request(`/schedule/manage?b=${encodeURIComponent(b)}&s=${encodeURIComponent(s)}`, {
    method: 'GET',
  })
export const cancelBooking = (slotStartUtc, sig) =>
  request('/schedule/cancel', { body: { slotStartUtc, sig } })
export const moveBooking = (slotStartUtc, sig, toSlotStartUtc) =>
  request('/schedule/move', { body: { slotStartUtc, sig, toSlotStartUtc } })
```

- [ ] **Step 2: Write the page**

Replace `src/pages/Schedule.jsx` entirely:

```jsx
import { useEffect, useMemo, useState } from 'react'
import { useLanguage } from '../i18n/useLanguage'
import { ROUTES } from '../i18n/copy'
import { bookSlot, cancelBooking, openSlots, viewBooking } from './scheduleApi'
import './Schedule.css'

// Booking page. Every instant comes from the server already computed; this
// page only formats them for display. No slot arithmetic lives here on
// purpose: the landing repo has no test runner, so the date logic stays in
// demo-backend where it is covered.
const dayLabel = (iso, locale) =>
  new Date(iso).toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric' })

const timeLabel = (iso, locale) =>
  new Date(iso).toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' })

const zoneLabel = () =>
  new Intl.DateTimeFormat(undefined, { timeZoneName: 'short' })
    .formatToParts(new Date())
    .find((p) => p.type === 'timeZoneName')?.value ?? ''

function Schedule() {
  const { lang, copy } = useLanguage()
  const c = copy.schedule
  const locale = lang === 'es' ? 'es-MX' : 'en-US'

  const [slots, setSlots] = useState([])
  const [day, setDay] = useState(null)
  const [picked, setPicked] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', website: '', note: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [managing, setManaging] = useState(null)
  const [cancelled, setCancelled] = useState(false)

  // A manage link (?b=&s=) turns this into the booking's own page.
  const manage = useMemo(() => {
    if (typeof window === 'undefined') return null
    const q = new URLSearchParams(window.location.search)
    const b = q.get('b')
    const s = q.get('s')
    return b && s ? { b, s } : null
  }, [])

  useEffect(() => {
    if (manage) {
      viewBooking(manage.b, manage.s)
        .then(setManaging)
        .catch((err) => setError(c.errors[err.message] ?? c.errors.generic))
      return
    }
    openSlots()
      .then((data) => {
        setSlots(data.slots)
        setDay(data.slots.length ? data.slots[0].slice(0, 10) : null)
      })
      .catch(() => setError(c.errors.generic))
  }, [manage, c.errors])

  const days = useMemo(() => [...new Set(slots.map((s) => s.slice(0, 10)))], [slots])
  const times = useMemo(() => slots.filter((s) => s.startsWith(day ?? '')), [slots, day])

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await bookSlot({ ...form, slotStartUtc: picked, lang })
      window.location.href = ROUTES[lang].thanks
    } catch (err) {
      setError(c.errors[err.message] ?? c.errors.generic)
      // A taken slot means the grid is stale: refresh it.
      if (err.message === 'slot_taken') {
        openSlots().then((data) => setSlots(data.slots)).catch(() => {})
        setPicked(null)
      }
      setBusy(false)
    }
  }

  async function doCancel() {
    setBusy(true)
    try {
      await cancelBooking(manage.b, manage.s)
      setCancelled(true)
    } catch (err) {
      setError(c.errors[err.message] ?? c.errors.generic)
    }
    setBusy(false)
  }

  if (manage) {
    return (
      <section className="schedule-page">
        <div className="schedule-inner schedule-narrow">
          <h1>{c.manageTitle}</h1>
          {cancelled && <p className="schedule-ok">{c.cancelled}</p>}
          {error && <p className="schedule-error">{error}</p>}
          {managing && !cancelled && (
            <>
              <p className="schedule-when">
                {dayLabel(managing.slotStartUtc, locale)}, {timeLabel(managing.slotStartUtc, locale)} {zoneLabel()}
              </p>
              <button className="schedule-btn schedule-btn-quiet" onClick={doCancel} disabled={busy}>
                {c.cancel}
              </button>
            </>
          )}
        </div>
      </section>
    )
  }

  return (
    <section className="schedule-page">
      <div className="schedule-inner">
        <div className="schedule-copy">
          <h1>{c.title}</h1>
          <p className="schedule-intro">{c.intro}</p>
          <ul className="schedule-bullets">
            {c.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>

        <div className="schedule-picker">
          {error && <p className="schedule-error">{error}</p>}

          <h2>{c.pickDay}</h2>
          <div className="schedule-days">
            {days.map((d) => (
              <button
                key={d}
                className={`schedule-day${d === day ? ' schedule-day-active' : ''}`}
                onClick={() => {
                  setDay(d)
                  setPicked(null)
                }}
              >
                {dayLabel(`${d}T12:00:00Z`, locale)}
              </button>
            ))}
          </div>

          <h2>{c.pickTime}</h2>
          <p className="schedule-hint">
            {c.yourZone} ({zoneLabel()})
          </p>
          {times.length === 0 && <p className="schedule-hint">{c.noSlots}</p>}
          <div className="schedule-times">
            {times.map((s) => (
              <button
                key={s}
                className={`schedule-time${s === picked ? ' schedule-time-active' : ''}`}
                onClick={() => setPicked(s)}
              >
                {timeLabel(s, locale)}
              </button>
            ))}
          </div>

          {picked && (
            <form className="schedule-form" onSubmit={submit}>
              <label>
                {c.form.name}
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </label>
              <label>
                {c.form.email}
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </label>
              <label>
                {c.form.website}
                <input
                  required
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                />
              </label>
              <label>
                {c.form.note}
                <textarea
                  rows="2"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                />
              </label>
              <button className="schedule-btn" disabled={busy}>
                {busy ? c.booking : c.submit}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

export default Schedule
```

- [ ] **Step 3: Write the styles**

```css
/* src/pages/Schedule.css
   All selectors scoped under .schedule-page so nothing leaks into the
   landing's own styles, the same containment Demo.css uses. */
.schedule-page {
  background: var(--page-bg);
  padding: 96px 24px 72px;
}

.schedule-inner {
  max-width: 1040px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
}

.schedule-narrow {
  grid-template-columns: 1fr;
  max-width: 560px;
}

.schedule-page h1 {
  font-family: 'Funnel Display', sans-serif;
  font-size: 2.25rem;
  line-height: 1.15;
  margin: 0 0 16px;
}

.schedule-page h2 {
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-muted, #6b7280);
  margin: 24px 0 12px;
}

.schedule-intro {
  font-size: 1.05rem;
  line-height: 1.6;
}

.schedule-bullets {
  margin-top: 24px;
  padding-left: 18px;
  line-height: 1.7;
}

.schedule-picker {
  background: var(--surface-muted, #f6f4ea);
  border: 1px solid var(--border, #e7e2d1);
  border-radius: 12px;
  padding: 24px;
}

.schedule-days,
.schedule-times {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.schedule-day,
.schedule-time {
  background: #fff;
  border: 1px solid var(--border, #e7e2d1);
  border-radius: 8px;
  padding: 10px 14px;
  font: inherit;
  cursor: pointer;
}

.schedule-day-active,
.schedule-time-active {
  background: #000;
  color: #fff;
  border-color: #000;
}

.schedule-hint {
  font-size: 0.85rem;
  color: var(--text-muted, #6b7280);
  margin: 0 0 12px;
}

.schedule-when {
  font-size: 1.1rem;
  font-weight: 600;
}

.schedule-form {
  display: grid;
  gap: 12px;
  margin-top: 24px;
}

.schedule-form label {
  display: grid;
  gap: 6px;
  font-size: 0.9rem;
}

.schedule-form input,
.schedule-form textarea {
  border: 1px solid var(--border, #e7e2d1);
  border-radius: 8px;
  padding: 10px 12px;
  font: inherit;
  background: #fff;
}

.schedule-btn {
  background: #000;
  color: #fff;
  border: 0;
  border-radius: 8px;
  padding: 13px 26px;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.schedule-btn:disabled {
  opacity: 0.55;
  cursor: default;
}

.schedule-btn-quiet {
  background: transparent;
  color: #b91c1c;
  border: 1px solid #e7e2d1;
}

.schedule-error {
  color: #b91c1c;
  font-size: 0.9rem;
}

.schedule-ok {
  color: var(--accent, #2f6f4f);
  font-size: 1rem;
}

@media (max-width: 860px) {
  .schedule-inner {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}
```

- [ ] **Step 4: Verify lint and build**

Run: `npm run lint && npm run build`
Expected: no new eslint errors (the two pre-existing ones in `Demo.jsx:294` remain), all eight routes prerender

- [ ] **Step 5: Commit**

```bash
git add src/pages/Schedule.jsx src/pages/Schedule.css src/pages/scheduleApi.js
git commit -m "feat(schedule): booking page with day, slot and manage views"
```

---

### Task 11: Rewire the site

The switchover. Every CTA changes destination in this task and nowhere else.

**Files:**
- Create: `src/components/CtaLink.jsx`
- Delete: `src/components/DemoLink.jsx`
- Modify: `src/components/Navbar.jsx`, `src/components/Hero.jsx`, `src/components/ClosingCTA.jsx` (imports)
- Modify: `src/pages/Thanks.jsx` (demo CTA), `src/components/Footer.jsx` (quiet demo link)
- Modify: `src/config.js` (drop `DEMO_URL`), `prerender.js` (derive URLs from `ROUTES`)

**Interfaces:**
- Consumes: `ROUTES` (Task 9).
- Produces: nothing.

- [ ] **Step 1: Write the CTA component**

```jsx
// src/components/CtaLink.jsx
import { ROUTES } from '../i18n/copy'
import { track } from '../analytics'
import { useLanguage } from '../i18n/useLanguage'

// Every CTA on the site. `location` distinguishes which one converted, so we
// can tell whether people book from the navbar or only after reading the proof
// section.
//
// This used to open an outbound scheduler in a new tab; it now points at our
// own booking page and navigates in place, like every other internal link. The
// analytics flush rides on sendBeacon at pagehide, which survives unload.
//
// The event name stays `demo_cta_click` deliberately: renaming it would break
// the historical series. `dest` records where it goes now.
function CtaLink({ location, className, children }) {
  const { lang } = useLanguage()

  return (
    <a
      className={className}
      href={ROUTES[lang].schedule}
      onClick={() => track('demo_cta_click', { location, lang, dest: 'schedule' })}
    >
      {children}
    </a>
  )
}

export default CtaLink
```

- [ ] **Step 2: Swap the three usages and delete the old component**

```bash
git rm src/components/DemoLink.jsx
```

In `src/components/Navbar.jsx`, `src/components/Hero.jsx` and `src/components/ClosingCTA.jsx`, change the import and the two tag names in each file:

```jsx
import CtaLink from './CtaLink'
```

```jsx
<CtaLink className="..." location="navbar">{copy.navbar.cta}</CtaLink>
```

Verify none remain:

Run: `grep -rn "DemoLink" src/`
Expected: no output

- [ ] **Step 3: Add the demo CTA to the thanks page**

Replace the body of `src/pages/Thanks.jsx`:

```jsx
import { useLanguage } from '../i18n/useLanguage'
import { LANG_PATH, ROUTES } from '../i18n/copy'
import { track } from '../analytics'
import './Thanks.css'

function Thanks() {
  const { lang, copy } = useLanguage()
  const c = copy.thanks

  return (
    <section className="thanks">
      <div className="thanks__inner">
        <h1 className="thanks__title">{c.title}</h1>
        <p className="thanks__body">{c.body}</p>
        <p className="thanks__demo-lead">{c.demoLead}</p>
        <a
          className="thanks__demo"
          href={ROUTES[lang].demo}
          onClick={() => track('demo_cta_click', { location: 'thanks', lang, dest: 'demo' })}
        >
          {c.demoCta}
        </a>
        <a className="thanks__back" href={LANG_PATH[lang]}>
          {c.back}
        </a>
      </div>
    </section>
  )
}

export default Thanks
```

Append to `src/pages/Thanks.css`:

```css
.thanks__demo-lead {
  margin-top: 32px;
  font-weight: 600;
}

.thanks__demo {
  display: inline-block;
  margin: 8px 0 24px;
  background: #000;
  color: #fff;
  border-radius: 8px;
  padding: 13px 26px;
  font-weight: 600;
  text-decoration: none;
}
```

- [ ] **Step 4: De-orphan the demo page**

In `src/components/Footer.jsx`, add a quiet link beside the tagline:

```jsx
<a className="footer__demo" href={ROUTES[lang].demo}>
  {copy.thanks.demoCta}
</a>
```

Add `import { ROUTES } from '../i18n/copy'` if it is not already imported, and take `lang` from `useLanguage()`. Append to `src/components/Footer.css`:

```css
.footer__demo {
  color: inherit;
  opacity: 0.7;
  text-decoration: underline;
}
```

- [ ] **Step 5: Remove the last hardcoded URL**

In `src/config.js`, delete the `DEMO_URL` export and its comment block. `THANKS_URL`, `WHATSAPP_NUMBER` and `TELEMETRY_URL` stay.

In `prerender.js`, drop `DEMO_URL` from the `config.js` import and change the llms.txt contact line to derive both URLs from routes:

```js
## Contact

- Book a commercial process review: ${urlFor('en', 'schedule')}
- Try the live demo: ${urlFor('en', 'demo')}
```

Verify nothing references it:

Run: `grep -rn "DEMO_URL" src/ prerender.js`
Expected: no output

- [ ] **Step 6: Verify the whole site**

Run: `npm run lint && npm run build`
Expected: no new eslint errors; all eight routes prerender; `sitemap.xml` and `llms.txt` written

Then confirm the CTA destination changed in the built output:

Run: `grep -o 'href="/schedule"' dist/index.html | head -3`
Expected: at least one match (navbar, hero and closing CTAs)

- [ ] **Step 7: Commit**

```bash
git add -A src/ prerender.js
git commit -m "feat(schedule): point every CTA at booking, offer the demo after"
```

---

## Deployment

Not a task: it changes production and needs a human at the keyboard.

1. `cd demo-backend && npm test && npm run synth` — everything green before anything ships.
2. `npm run deploy` — creates the `anytrail/demo/schedule-signing` secret (auto-generated), sets `MEET_URL`, and starts the 15-minute reminder rule.
3. Push the landing changes; Vercel builds and deploys the eight routes.
4. Smoke test in production: book a slot, confirm the email arrives with a working `.ics` and manage link, then cancel from that link and confirm the slot reopens in the grid.

**Note for whoever deploys:** the reminder rule starts firing immediately, but only acts on bookings inside its windows, so an empty table costs two DynamoDB queries every 15 minutes and nothing else.
