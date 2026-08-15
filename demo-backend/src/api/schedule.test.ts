import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import {
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
  TransactWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { setDocClientForTests } from '../db';
import { signBooking } from '../schedule/token';

// Hoisted so the mock factory below can reference it — vi.mock is hoisted
// above these imports at transform time, so cancel() always sees the mock.
const mocks = vi.hoisted(() => ({
  postSlack: vi.fn(async (_text: string): Promise<void> => {}),
  // sendBookingEmails (book/move) also imports notifyBooking from '../notify';
  // stubbed here too so mocking this module for the cancel tests below
  // doesn't turn book/move's already-caught Slack ping into console noise.
  notifyBooking: vi.fn(async (): Promise<void> => {}),
}));
vi.mock('../notify', () => ({
  postSlack: mocks.postSlack,
  notifyBooking: mocks.notifyBooking,
}));

import { book, bookSchema, cancel, cancelSchema, move, moveSchema, view } from './schedule';

describe('cancelSchema', () => {
  it('accepts a well-formed cancel body', () => {
    const parsed = cancelSchema.safeParse({
      slotStartUtc: '2026-08-20T18:30:00.000Z',
      sig: 'abc123',
    });
    expect(parsed.success).toBe(true);
  });

  // The finding's exact repro: an object where a string is expected must be
  // a 422 (schema rejection), not reach keyFor() -> new Date({}) -> an
  // Intl.DateTimeFormat RangeError -> an unhandled 500.
  it('rejects an object slotStartUtc, a missing sig, and an empty sig', () => {
    expect(cancelSchema.safeParse({ slotStartUtc: {}, sig: 'x' }).success).toBe(false);
    expect(cancelSchema.safeParse({ slotStartUtc: '2026-08-20T18:30:00.000Z' }).success).toBe(
      false,
    );
    expect(
      cancelSchema.safeParse({ slotStartUtc: '2026-08-20T18:30:00.000Z', sig: '' }).success,
    ).toBe(false);
  });
});

describe('moveSchema', () => {
  it('accepts a well-formed move body', () => {
    const parsed = moveSchema.safeParse({
      slotStartUtc: '2026-08-20T18:30:00.000Z',
      sig: 'abc123',
      toSlotStartUtc: '2026-08-21T18:30:00.000Z',
    });
    expect(parsed.success).toBe(true);
  });

  it('rejects an object toSlotStartUtc and a missing sig', () => {
    expect(
      moveSchema.safeParse({
        slotStartUtc: '2026-08-20T18:30:00.000Z',
        sig: 'x',
        toSlotStartUtc: {},
      }).success,
    ).toBe(false);
    expect(
      moveSchema.safeParse({
        slotStartUtc: '2026-08-20T18:30:00.000Z',
        toSlotStartUtc: '2026-08-21T18:30:00.000Z',
      }).success,
    ).toBe(false);
  });
});

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

const ddb = mockClient(DynamoDBDocumentClient);
const secretsManager = mockClient(SecretsManagerClient);
setDocClientForTests(ddb as unknown as DynamoDBDocumentClient);

const SECRET = 'test-schedule-secret';

const existing = {
  slotStartUtc: '2026-08-20T18:30:00.000Z',
  name: 'Ana',
  email: 'ana@acme.com',
  website: 'https://acme.com',
  note: '',
  lang: 'en' as const,
  remindedT24: false,
  remindedT1: false,
  createdAt: '2026-08-19T12:00:00.000Z',
  ip: '1.2.3.4',
  sequence: 0,
};

describe('view (authorize)', () => {
  beforeEach(() => {
    ddb.reset();
    secretsManager.reset();
    process.env.SCHEDULE_SECRET_ARN = 'arn:aws:secretsmanager:test:schedule';
    secretsManager.on(GetSecretValueCommand).resolves({ SecretString: SECRET });
  });

  // Regression guard for the earlier verify-before-load bug: a link signed
  // for the address that booked this slot before must not still work once
  // the row belongs to someone else (a cancel + a different person's book).
  it('rejects a signature that was valid for the previous booker once the row changes hands', async () => {
    const staleSig = signBooking(existing.slotStartUtc, 'previous-booker@acme.com', SECRET);
    ddb.on(GetCommand).resolves({ Item: { ...existing, email: 'new-booker@acme.com' } });

    await expect(view(existing.slotStartUtc, staleSig)).rejects.toMatchObject({
      name: 'InvalidSignatureError',
    });
  });

  it('accepts a signature bound to the row currently on file', async () => {
    ddb.on(GetCommand).resolves({ Item: existing });
    const sig = signBooking(existing.slotStartUtc, existing.email, SECRET);

    await expect(view(existing.slotStartUtc, sig)).resolves.toMatchObject({
      email: existing.email,
    });
  });
});

describe('book', () => {
  beforeEach(() => {
    ddb.reset();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-17T12:00:00.000Z')); // a Monday
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('rejects an instant openSlots does not produce, without ever calling createBooking', async () => {
    ddb.on(QueryCommand).resolves({ Items: [] });
    const input = bookSchema.parse({
      // 23:00 America/New_York the day before: outside business hours no
      // matter when the suite runs.
      slotStartUtc: '2026-08-20T03:00:00.000Z',
      name: 'Ana',
      email: 'ana@acme.com',
      website: 'acme.com',
      lang: 'en',
    });

    await expect(book(input, '1.2.3.4')).rejects.toMatchObject({
      name: 'SlotUnavailableError',
    });
    expect(ddb.commandCalls(TransactWriteCommand)).toHaveLength(0);
  });
});

describe('move', () => {
  beforeEach(() => {
    ddb.reset();
    secretsManager.reset();
    process.env.SCHEDULE_SECRET_ARN = 'arn:aws:secretsmanager:test:schedule';
    secretsManager.on(GetSecretValueCommand).resolves({ SecretString: SECRET });
    // Pinned so the target slot's business-hours/lead-time/horizon check in
    // openSlots is deterministic regardless of when the suite actually runs.
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-17T12:00:00.000Z')); // a Monday
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('rejects a move to the same slot without ever reaching the store', async () => {
    await expect(
      move(existing.slotStartUtc, 'irrelevant-sig', existing.slotStartUtc),
    ).rejects.toMatchObject({ name: 'SlotUnavailableError' });
    expect(ddb.commandCalls(GetCommand)).toHaveLength(0);
  });

  it('keeps the original createdAt and bumps sequence one higher', async () => {
    ddb.on(GetCommand).resolves({ Item: existing });
    ddb.on(QueryCommand).resolves({ Items: [] });
    ddb.on(TransactWriteCommand).resolves({});

    const to = '2026-08-21T15:00:00.000Z'; // Friday, 11:00 America/New_York
    const sig = signBooking(existing.slotStartUtc, existing.email, SECRET);
    const res = await move(existing.slotStartUtc, sig, to);

    expect(res.slotStartUtc).toBe(to);
    const call = ddb.commandCalls(TransactWriteCommand)[0].args[0].input;
    const put = call.TransactItems![1].Put!.Item as { createdAt: string; sequence: number };
    expect(put.createdAt).toBe(existing.createdAt);
    expect(put.sequence).toBe(1);
  });
});

describe('cancel', () => {
  beforeEach(() => {
    ddb.reset();
    secretsManager.reset();
    mocks.postSlack.mockClear();
    mocks.postSlack.mockResolvedValue(undefined);
    process.env.SCHEDULE_SECRET_ARN = 'arn:aws:secretsmanager:test:schedule';
    secretsManager.on(GetSecretValueCommand).resolves({ SecretString: SECRET });
    ddb.on(GetCommand).resolves({ Item: existing });
    ddb.on(TransactWriteCommand).resolves({});
  });

  // Book and move both ping Slack; without this a cancelled call leaves the
  // founder with a stale calendar entry and no signal it is dead.
  it('posts a Slack ping with the name, email and formatted slot', async () => {
    const sig = signBooking(existing.slotStartUtc, existing.email, SECRET);
    await cancel(existing.slotStartUtc, sig);

    expect(mocks.postSlack).toHaveBeenCalledTimes(1);
    const [text] = mocks.postSlack.mock.calls[0] as [string];
    expect(text).toContain(existing.name);
    expect(text).toContain(existing.email);
    // Thursday, August 20, 2026 at ~2:30 PM New York time.
    expect(text).toMatch(/Aug(ust)?\s+20,?\s+2026/);
  });

  // A Slack outage must never turn the cancel the visitor already made into
  // a 500 — same fire-and-forget contract as sendBookingEmails.
  it('still resolves, and still deletes the booking, when Slack is down', async () => {
    mocks.postSlack.mockRejectedValueOnce(new Error('slack is down'));
    const sig = signBooking(existing.slotStartUtc, existing.email, SECRET);

    await expect(cancel(existing.slotStartUtc, sig)).resolves.toBeUndefined();
    expect(ddb.commandCalls(TransactWriteCommand)).toHaveLength(1);
  });
});
