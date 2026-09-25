import { randomBytes } from 'node:crypto';
import { DeleteCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { z } from 'zod';
import { assertWithinRateLimit } from '../api/rate-limit';
import { TABLE_NAME, docClient, keys, ttlSeconds } from '../db';
import { LIMITS } from '../limits';
import { sendPriceRequestEmail } from './email';
import { getCatalog, getPriceRequest, getQuote, putCatalog, putPriceRequest, putQuote } from './store';
import type { CatalogItem, PriceRequest, QuoteLine } from './types';

class Named extends Error {
  constructor(code: string) {
    super(code);
    this.name = new.target.name;
  }
}
export class UnknownQuoteError extends Named {}
export class NothingToRequestError extends Named {}
export class AlreadyRequestedError extends Named {}
export class InvalidAnswerError extends Named {}
export class AlreadyAnsweredError extends Named {}
export class UnknownRequestError extends Named {}

export const sendSchema = z.object({
  quoteId: z.string().min(1).max(64),
  to: z.string().trim().email().max(200),
  subject: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(5000),
});

export const answerSchema = z.object({
  t: z.string().min(20).max(100),
  prices: z
    .array(z.object({ lineIndex: z.number().int().min(0), unitCents: z.number().int().min(0).max(10_000_000_000) }))
    .min(1)
    .max(50),
});

type Price = { lineIndex: number; unitCents: number };

export function publicState(req: PriceRequest | null) {
  if (!req) return null;
  return { status: req.status, remindersSent: req.remindersSent, maxReminders: LIMITS.priceReminderMax, to: req.to };
}

export async function sendPriceRequest(input: z.infer<typeof sendSchema>, ip: string) {
  const quote = await getQuote(input.quoteId);
  if (!quote) throw new UnknownQuoteError('unknown_quote');
  if (quote.priceRequestId) throw new AlreadyRequestedError('already_requested');
  const items = quote.lines
    .map((l, lineIndex) => ({ l, lineIndex }))
    .filter(({ l }) => l.status !== 'priced')
    .map(({ l, lineIndex }) => ({ lineIndex, name: l.name, sku: l.sku, qty: l.qty }));
  if (!items.length) throw new NothingToRequestError('nothing_to_request');
  const catalog = await getCatalog(quote.catalogId);

  await assertWithinRateLimit(ip, Date.now(), { bucket: 'qpr', cap: LIMITS.priceRequestPerIp });

  const now = Date.now();
  const req: PriceRequest = {
    token: randomBytes(32).toString('base64url'),
    quoteId: quote.quoteId,
    catalogId: quote.catalogId,
    supplier: catalog?.supplier ?? 'Proveedor',
    currency: quote.currency,
    to: input.to,
    subject: input.subject,
    body: input.body,
    items,
    status: 'pending',
    remindersSent: 0,
    nextReminderAt: now + LIMITS.priceReminderEveryMs,
    createdAt: new Date(now).toISOString(),
  };
  // Send first: a failed email must leave nothing behind that would be reminded.
  await sendPriceRequestEmail(req, 0);
  await putPriceRequest(req);
  await docClient().send(
    new PutCommand({ TableName: TABLE_NAME, Item: { ...keys.pendingPriceRequest(req.token), expiresAt: ttlSeconds() } }),
  );
  await putQuote({ ...quote, priceRequestId: req.token });
  console.log('price_request_sent', JSON.stringify({ quoteId: quote.quoteId, items: items.length, ip }));
  return publicState(req);
}

export async function getSupplierView(token: string) {
  const req = await getPriceRequest(token);
  if (!req) return null;
  return { supplier: req.supplier, currency: req.currency, status: req.status, items: req.items };
}

export function validateAnswer(req: PriceRequest, prices: Price[]): void {
  const wanted = new Set(req.items.map((i) => i.lineIndex));
  const given = new Set(prices.map((p) => p.lineIndex));
  if (given.size !== prices.length || given.size !== wanted.size || [...given].some((i) => !wanted.has(i))) {
    throw new InvalidAnswerError('invalid_answer');
  }
}

export function applyAnswerToLines(lines: QuoteLine[], prices: Price[]): QuoteLine[] {
  const byLine = new Map(prices.map((p) => [p.lineIndex, p.unitCents]));
  return lines.map((l, i) =>
    byLine.has(i) ? { ...l, unitCents: byLine.get(i)!, status: 'priced', fromSupplier: true } : l,
  );
}

export function applyAnswerToCatalog(items: CatalogItem[], lines: QuoteLine[], prices: Price[]): CatalogItem[] {
  const out = items.map((i) => ({ ...i }));
  for (const p of prices) {
    const line = lines[p.lineIndex];
    if (!line) continue;
    const existing = line.itemId ? out.find((i) => i.id === line.itemId) : undefined;
    if (existing) existing.priceCents = p.unitCents;
    else out.push({ id: `s${out.length + 1}`, sku: null, name: line.query, description: 'Precio confirmado por el proveedor', priceCents: p.unitCents });
  }
  return out;
}

export async function answerPriceRequest(input: z.infer<typeof answerSchema>): Promise<void> {
  const req = await getPriceRequest(input.t);
  if (!req) throw new UnknownRequestError('unknown_request');
  if (req.status !== 'pending') throw new AlreadyAnsweredError('already_answered');
  validateAnswer(req, input.prices);
  try {
    await docClient().send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: keys.priceRequest(req.token),
        UpdateExpression: 'SET #s = :answered, answeredAt = :at, prices = :p',
        ConditionExpression: '#s = :pending',
        ExpressionAttributeNames: { '#s': 'status' },
        ExpressionAttributeValues: { ':answered': 'answered', ':pending': 'pending', ':at': new Date().toISOString(), ':p': input.prices },
      }),
    );
  } catch (err) {
    if ((err as Error).name === 'ConditionalCheckFailedException') throw new AlreadyAnsweredError('already_answered');
    throw err;
  }
  await docClient().send(new DeleteCommand({ TableName: TABLE_NAME, Key: keys.pendingPriceRequest(req.token) }));
  const quote = await getQuote(req.quoteId);
  if (quote) {
    await putQuote({ ...quote, lines: applyAnswerToLines(quote.lines, input.prices) });
    const catalog = await getCatalog(req.catalogId);
    if (catalog) await putCatalog({ ...catalog, items: applyAnswerToCatalog(catalog.items, quote.lines, input.prices) });
  }
  console.log('price_request_answered', JSON.stringify({ quoteId: req.quoteId, lines: input.prices.length }));
}
