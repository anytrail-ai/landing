import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { assertWithinRateLimit } from '../api/rate-limit';
import { TABLE_NAME, setDocClientForTests } from '../db';
import { LIMITS } from '../limits';
import { sendPriceRequestEmail } from './email';
import {
  AlreadyAnsweredError, InvalidAnswerError, answerPriceRequest, applyAnswerToCatalog,
  applyAnswerToLines, sendPriceRequest, validateAnswer,
} from './price-request';
import type { Catalog, CatalogItem, PriceRequest, Quote, QuoteLine } from './types';

// Finding 2: mock the two side effects of sendPriceRequest — the outbound
// email and the IP cap — so the test can pin (a) send order and (b) that a
// failed send leaves no DynamoDB write behind. Neither mock affects
// answerPriceRequest below: it never imports these two functions.
vi.mock('./email', () => ({ sendPriceRequestEmail: vi.fn() }));
vi.mock('../api/rate-limit', () => ({ assertWithinRateLimit: vi.fn() }));

const req = (over: Partial<PriceRequest> = {}): PriceRequest => ({
  token: 't'.repeat(43), quoteId: 'q', catalogId: 'c', supplier: 'S', currency: 'MXN', to: 'a@b.co',
  subject: 's', body: 'b', items: [{ lineIndex: 1, name: 'B', sku: 'B1', qty: 1 }, { lineIndex: 2, name: 'compresor', sku: null, qty: 3 }],
  status: 'pending', remindersSent: 0, nextReminderAt: 0, createdAt: '', ...over,
});

const lines: QuoteLine[] = [
  { itemId: 'i1', query: 'a', name: 'A', sku: 'A1', qty: 2, unitCents: 100, status: 'priced' },
  { itemId: 'i2', query: 'b', name: 'B', sku: 'B1', qty: 1, unitCents: null, status: 'unpriced' },
  { itemId: null, query: 'compresor', name: 'compresor', sku: null, qty: 3, unitCents: null, status: 'no_match' },
];

describe('validateAnswer', () => {
  it('requires exactly the requested lines, once each', () => {
    expect(() => validateAnswer(req(), [{ lineIndex: 1, unitCents: 5 }, { lineIndex: 2, unitCents: 0 }])).not.toThrow();
    expect(() => validateAnswer(req(), [{ lineIndex: 1, unitCents: 5 }])).toThrow(InvalidAnswerError);
    expect(() => validateAnswer(req(), [{ lineIndex: 1, unitCents: 5 }, { lineIndex: 1, unitCents: 6 }])).toThrow(InvalidAnswerError);
    expect(() => validateAnswer(req(), [{ lineIndex: 0, unitCents: 5 }, { lineIndex: 2, unitCents: 6 }])).toThrow(InvalidAnswerError);
  });
});

describe('applyAnswer', () => {
  const prices = [{ lineIndex: 1, unitCents: 500 }, { lineIndex: 2, unitCents: 900 }];
  it('prices the lines and marks them as from the supplier', () => {
    const out = applyAnswerToLines(lines, prices);
    expect(out[0]).toEqual(lines[0]);
    expect(out[1]).toMatchObject({ unitCents: 500, status: 'priced', fromSupplier: true });
    expect(out[2]).toMatchObject({ unitCents: 900, status: 'priced', fromSupplier: true });
  });
  it('writes an unpriced item price back and appends a no_match product', () => {
    const items: CatalogItem[] = [
      { id: 'i1', sku: 'A1', name: 'A', description: null, priceCents: 100 },
      { id: 'i2', sku: 'B1', name: 'B', description: null, priceCents: null },
    ];
    const out = applyAnswerToCatalog(items, lines, prices);
    expect(out[1].priceCents).toBe(500);
    expect(out).toHaveLength(3);
    expect(out[2]).toMatchObject({ name: 'compresor', priceCents: 900 });
  });
});

describe('answerPriceRequest', () => {
  const ddb = mockClient(DynamoDBDocumentClient);
  beforeEach(() => {
    ddb.reset();
    setDocClientForTests(ddb as unknown as DynamoDBDocumentClient);
  });
  afterEach(() => setDocClientForTests(undefined));

  it('a second answer gets AlreadyAnsweredError and writes nothing else', async () => {
    ddb.on(GetCommand).resolves({ Item: req({ status: 'answered' }) });
    const conditional = Object.assign(new Error('cond'), { name: 'ConditionalCheckFailedException' });
    ddb.on(UpdateCommand).rejects(conditional);
    await expect(
      answerPriceRequest({ t: 't'.repeat(43), prices: [{ lineIndex: 1, unitCents: 1 }, { lineIndex: 2, unitCents: 1 }] }),
    ).rejects.toBeInstanceOf(AlreadyAnsweredError);
    expect(ddb.commandCalls(UpdateCommand)).toHaveLength(0); // rejected before the conditional write
  });
});

describe('sendPriceRequest', () => {
  const ddb = mockClient(DynamoDBDocumentClient);
  beforeEach(() => {
    ddb.reset();
    setDocClientForTests(ddb as unknown as DynamoDBDocumentClient);
    vi.mocked(assertWithinRateLimit).mockReset().mockResolvedValue(undefined);
    vi.mocked(sendPriceRequestEmail).mockReset().mockRejectedValue(new Error('email_failed'));
  });
  afterEach(() => setDocClientForTests(undefined));

  it('checks the IP cap before sending, and a failed send writes nothing', async () => {
    const quote: Quote = {
      quoteId: 'q1',
      sessionId: 's1',
      catalogId: 'c1',
      currency: 'MXN',
      lines: [{ itemId: 'i1', query: 'a', name: 'A', sku: null, qty: 1, unitCents: null, status: 'unpriced' }],
      priceRequestId: null,
      createdAt: '2026-09-24T00:00:00Z',
    };
    const catalog: Catalog = {
      catalogId: 'c1',
      supplier: 'Acme',
      supplierEmail: null,
      currency: 'MXN',
      items: [{ id: 'i1', sku: null, name: 'A', description: null, priceCents: null }],
    };
    ddb
      .on(GetCommand, { TableName: TABLE_NAME, Key: { pk: 'QUOTE#q1', sk: 'META' } })
      .resolves({ Item: quote })
      .on(GetCommand, { TableName: TABLE_NAME, Key: { pk: 'QCAT#c1', sk: 'META' } })
      .resolves({ Item: catalog });

    await expect(
      sendPriceRequest({ quoteId: 'q1', to: 'p@acme.mx', subject: 's', body: 'b' }, '1.2.3.4'),
    ).rejects.toThrow('email_failed');

    // IP cap AND the global relay cap (F4) are both checked before the send.
    expect(assertWithinRateLimit).toHaveBeenCalledWith(
      '1.2.3.4',
      expect.any(Number),
      { bucket: 'qpr', cap: LIMITS.priceRequestPerIp },
    );
    expect(assertWithinRateLimit).toHaveBeenCalledWith(
      'GLOBAL',
      expect.any(Number),
      { bucket: 'qpr', cap: LIMITS.priceRequestGlobal },
    );
    expect(assertWithinRateLimit).toHaveBeenCalledTimes(2);
    const [ipOrder, globalOrder] = vi.mocked(assertWithinRateLimit).mock.invocationCallOrder;
    const emailOrder = vi.mocked(sendPriceRequestEmail).mock.invocationCallOrder[0];
    expect(ipOrder).toBeLessThan(globalOrder);
    expect(globalOrder).toBeLessThan(emailOrder);

    // A failed send must leave nothing behind that would later be reminded.
    expect(ddb.commandCalls(PutCommand)).toHaveLength(0);
    expect(ddb.commandCalls(UpdateCommand)).toHaveLength(0);
  });
});
