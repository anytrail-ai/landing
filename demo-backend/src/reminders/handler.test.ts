import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { DynamoDBDocumentClient, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { setDocClientForTests } from '../db';
import { SCHEDULE } from '../schedule/config';
import { horizonDayKeys } from '../schedule/slots';
import type { Booking } from '../schedule/store';
import { signBooking } from '../schedule/token';

// Hoisted so the mock factory below can reference it — vi.mock is hoisted
// above these imports (including the `dueReminders`/`handler` import below)
// at transform time, so the sweep always sees the mocked send.
const mocks = vi.hoisted(() => ({
  sendReminderEmail: vi.fn(
    async (_b: Booking, _manageUrl: string, _which: 'T24' | 'T1'): Promise<void> => {},
  ),
}));
vi.mock('../schedule/email', () => ({
  sendReminderEmail: mocks.sendReminderEmail,
}));

import { dueReminders, handler } from './handler';

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

describe('handler', () => {
  const ddb = mockClient(DynamoDBDocumentClient);
  const secretsManager = mockClient(SecretsManagerClient);
  setDocClientForTests(ddb as unknown as DynamoDBDocumentClient);

  const SECRET = 'test-schedule-secret';
  // Both New York calendar days the sweep must query for `now`.
  const [todayKey, tomorrowKey] = horizonDayKeys(now, 1, SCHEDULE.timezone);
  const pkFor = (dayKey: string) => `BOOKINGDAY#${dayKey}`;

  beforeEach(() => {
    ddb.reset();
    secretsManager.reset();
    mocks.sendReminderEmail.mockReset();
    mocks.sendReminderEmail.mockResolvedValue(undefined);
    process.env.SCHEDULE_SECRET_ARN = 'arn:aws:secretsmanager:test:schedule';
    secretsManager.on(GetSecretValueCommand).resolves({ SecretString: SECRET });
    vi.useFakeTimers();
    vi.setSystemTime(now);
    // Default: nothing due on either day, overridden per test.
    ddb.on(QueryCommand, { ExpressionAttributeValues: { ':pk': pkFor(todayKey) } }).resolves({
      Items: [],
    });
    ddb.on(QueryCommand, { ExpressionAttributeValues: { ':pk': pkFor(tomorrowKey) } }).resolves({
      Items: [],
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('queries both New York calendar days and no others', async () => {
    await handler();
    const pks = ddb
      .commandCalls(QueryCommand)
      .map((c) => c.args[0].input.ExpressionAttributeValues?.[':pk']);
    expect(pks.sort()).toEqual([pkFor(todayKey), pkFor(tomorrowKey)].sort());
  });

  it('claims and sends a due booking, with a manage URL carrying the right slot and signature', async () => {
    // 23.9h out lands inside the T-24 sweep window, which (for `now` local to
    // New York) falls under tomorrow's day partition.
    const booking = at(23.9 * H);
    ddb.on(QueryCommand, { ExpressionAttributeValues: { ':pk': pkFor(tomorrowKey) } }).resolves({
      Items: [booking],
    });
    ddb.on(UpdateCommand).resolves({});

    await handler();

    const claim = ddb.commandCalls(UpdateCommand)[0].args[0].input;
    expect(claim.ExpressionAttributeNames).toEqual({ '#f': 'remindedT24' });

    expect(mocks.sendReminderEmail).toHaveBeenCalledTimes(1);
    const [sentBooking, manageUrl, which] = mocks.sendReminderEmail.mock.calls[0];
    expect(sentBooking).toEqual(booking);
    expect(which).toBe('T24');
    const parsed = new URL(manageUrl);
    expect(parsed.searchParams.get('b')).toBe(booking.slotStartUtc);
    expect(parsed.searchParams.get('s')).toBe(
      signBooking(booking.slotStartUtc, booking.email, SECRET),
    );
  });

  it('skips a booking whose claim is lost to a concurrent sweep, and sends no email for it', async () => {
    const booking = at(23.9 * H);
    ddb.on(QueryCommand, { ExpressionAttributeValues: { ':pk': pkFor(tomorrowKey) } }).resolves({
      Items: [booking],
    });
    // Someone else's Lambda invocation already claimed this flag.
    ddb.on(UpdateCommand).rejects(
      Object.assign(new Error('failed'), { name: 'ConditionalCheckFailedException' }),
    );

    await handler();

    expect(mocks.sendReminderEmail).not.toHaveBeenCalled();
  });

  it("one booking's send failure does not stop the next booking in the same pass", async () => {
    const failing = at(23.9 * H, { email: 'fails@acme.com' });
    const okay = at(0.9 * H, { email: 'ok@acme.com' });
    ddb.on(QueryCommand, { ExpressionAttributeValues: { ':pk': pkFor(tomorrowKey) } }).resolves({
      Items: [failing],
    });
    ddb.on(QueryCommand, { ExpressionAttributeValues: { ':pk': pkFor(todayKey) } }).resolves({
      Items: [okay],
    });
    ddb.on(UpdateCommand).resolves({});
    mocks.sendReminderEmail.mockImplementation(async (b) => {
      if (b.email === 'fails@acme.com') throw new Error('boom');
    });

    await expect(handler()).resolves.toBeUndefined();

    expect(mocks.sendReminderEmail).toHaveBeenCalledTimes(2);
    // Both claims still happened: the failure was in the send, after the claim.
    expect(ddb.commandCalls(UpdateCommand)).toHaveLength(2);
  });

  it('claims nothing and sends nothing when no booking is due', async () => {
    await handler();
    expect(ddb.commandCalls(UpdateCommand)).toHaveLength(0);
    expect(mocks.sendReminderEmail).not.toHaveBeenCalled();
  });
});
