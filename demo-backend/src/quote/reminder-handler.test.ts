import { DeleteCommand, DynamoDBDocumentClient, GetCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { keys, setDocClientForTests } from '../db';
import { LIMITS } from '../limits';
import type { PriceRequest } from './types';

// Hoisted so the mock factory below can reference it — vi.mock is hoisted
// above these imports (including the `dueQuoteReminders`/`handler` import
// below) at transform time, so the sweep always sees the mocked send.
const mocks = vi.hoisted(() => ({
  sendPriceRequestEmail: vi.fn(async (_req: PriceRequest, _n: number): Promise<void> => {}),
}));
vi.mock('./email', () => ({
  sendPriceRequestEmail: mocks.sendPriceRequestEmail,
}));

import { dueQuoteReminders, handler } from './reminder-handler';

const base: PriceRequest = {
  token: 't', quoteId: 'q', catalogId: 'c', supplier: 'S', currency: 'MXN', to: 'a@b.co', subject: 's', body: 'b',
  items: [], status: 'pending', remindersSent: 0, nextReminderAt: 1000, createdAt: '',
};

describe('dueQuoteReminders', () => {
  it('is due at or after nextReminderAt while pending and under the cap', () => {
    expect(dueQuoteReminders([base], 999)).toEqual([]);
    expect(dueQuoteReminders([base], 1000)).toEqual([base]);
  });
  it('skips answered requests and requests at the cap', () => {
    expect(dueQuoteReminders([{ ...base, status: 'answered' }], 5000)).toEqual([]);
    expect(dueQuoteReminders([{ ...base, remindersSent: 5 }], 5000)).toEqual([]);
    expect(dueQuoteReminders([{ ...base, remindersSent: 4 }], 5000)).toHaveLength(1);
  });
});

describe('handler', () => {
  const ddb = mockClient(DynamoDBDocumentClient);
  setDocClientForTests(ddb as unknown as DynamoDBDocumentClient);

  const now = Date.parse('2026-09-24T12:00:00.000Z');

  const row = (token: string, over: Partial<PriceRequest> = {}): PriceRequest => ({
    ...base,
    ...over,
    token,
    nextReminderAt: now - 1, // due
  });

  /** Registers the pending index + each token's GetCommand row. */
  function seed(rows: PriceRequest[]): void {
    ddb.on(QueryCommand, { ExpressionAttributeValues: { ':pk': 'QPR_PENDING' } }).resolves({
      Items: rows.map((r) => ({ pk: 'QPR_PENDING', sk: r.token })),
    });
    for (const r of rows) {
      ddb.on(GetCommand, { Key: keys.priceRequest(r.token) }).resolves({ Item: r });
    }
  }

  beforeEach(() => {
    ddb.reset();
    mocks.sendPriceRequestEmail.mockReset();
    mocks.sendPriceRequestEmail.mockResolvedValue(undefined);
    vi.useFakeTimers();
    vi.setSystemTime(now);
    ddb.on(UpdateCommand).resolves({});
    ddb.on(DeleteCommand).resolves({});
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('claims a due row before sending: UpdateCommand carries the old count, then exactly one send with the new number', async () => {
    seed([row('t1')]);

    await handler();

    const calls = ddb.commandCalls(UpdateCommand);
    expect(calls).toHaveLength(1);
    expect(calls[0].args[0].input.ExpressionAttributeValues).toEqual({
      ':n': 1,
      ':prev': 0,
      ':pending': 'pending',
      ':next': now + LIMITS.priceReminderEveryMs,
    });
    expect(mocks.sendPriceRequestEmail).toHaveBeenCalledTimes(1);
    expect(mocks.sendPriceRequestEmail).toHaveBeenCalledWith(expect.objectContaining({ token: 't1' }), 1);
  });

  it('sends nothing when the claim is lost to a concurrent sweep', async () => {
    seed([row('t1')]);
    ddb.on(UpdateCommand).rejects(Object.assign(new Error('failed'), { name: 'ConditionalCheckFailedException' }));

    await handler();

    expect(mocks.sendPriceRequestEmail).not.toHaveBeenCalled();
  });

  it("one row's send failure does not stop the next row in the same pass", async () => {
    seed([row('t1'), row('t2')]);
    mocks.sendPriceRequestEmail.mockImplementation(async (req) => {
      if (req.token === 't1') throw new Error('boom');
    });

    await expect(handler()).resolves.toBeUndefined();

    // Both were still claimed: the failure was in the send, after the claim.
    expect(ddb.commandCalls(UpdateCommand)).toHaveLength(2);
    expect(mocks.sendPriceRequestEmail).toHaveBeenCalledTimes(2);
  });

  it('deletes the pending index row once the cap is reached', async () => {
    seed([row('t1', { remindersSent: LIMITS.priceReminderMax - 1 })]);

    await handler();

    const deletes = ddb.commandCalls(DeleteCommand);
    expect(deletes).toHaveLength(1);
    expect(deletes[0].args[0].input.Key).toEqual(keys.pendingPriceRequest('t1'));
  });

  it('sweeps a stray index row for an already-answered request without sending or claiming', async () => {
    seed([row('t1', { status: 'answered' })]);

    await handler();

    expect(mocks.sendPriceRequestEmail).not.toHaveBeenCalled();
    expect(ddb.commandCalls(UpdateCommand)).toHaveLength(0);
    const deletes = ddb.commandCalls(DeleteCommand);
    expect(deletes).toHaveLength(1);
    expect(deletes[0].args[0].input.Key).toEqual(keys.pendingPriceRequest('t1'));
  });
});
