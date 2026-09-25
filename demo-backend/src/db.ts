import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export const TABLE_NAME = process.env.TABLE_NAME ?? '';

// Warm-container singleton, injectable in tests.
let client: DynamoDBDocumentClient | undefined;

export function docClient(): DynamoDBDocumentClient {
  client ??= DynamoDBDocumentClient.from(new DynamoDBClient({}), {
    marshallOptions: { removeUndefinedValues: true },
  });
  return client;
}

export function setDocClientForTests(c: DynamoDBDocumentClient | undefined): void {
  client = c;
}

// Single-table key shapes:
//   LEAD#<sessionId>       / META      — a captured lead + its session state
//   WALEAD#<id>            / META      — a /demo name+phone lead handed to WhatsApp
//   DOMAIN#<domain>        / PROFILE   — cached CompanyProfile (expiresAt TTL)
//   IP#<ip>                / RATE#<window> — rate-limit bucket (expiresAt TTL)
//   BOOKINGDAY#<yyyy-mm-dd>/ SLOT#<hh:mm>  — a booked call (day = New York date)
//   EMAIL#<lowercased>     / ACTIVE    — guard: one active booking per address
//   QCAT#<catalogId>       / META      — quote demo: parsed supplier catalogue
//   QSESS#<sessionId>      / META      — quote demo: chat session → catalogue
//   QUOTE#<quoteId>        / META      — quote demo: generated quote
//   QPR#<token>            / META      — quote demo: supplier price request
//   QPR_PENDING            / <token>   — index: requests still being reminded
export const keys = {
  lead: (sessionId: string) => ({ pk: `LEAD#${sessionId}`, sk: 'META' }),
  whatsappLead: (id: string) => ({ pk: `WALEAD#${id}`, sk: 'META' }),
  profile: (domain: string) => ({ pk: `DOMAIN#${domain}`, sk: 'PROFILE' }),
  // `bucket` is omitted for the original demo-start caller so its key shape
  // (and therefore its already-running counters) never changes; a named
  // bucket (e.g. 'schedule') gets its own partition so it cannot share quota
  // with the unnamed one.
  rate: (ip: string, windowStart: number, bucket?: string) => ({
    pk: bucket ? `IP#${ip}#${bucket}` : `IP#${ip}`,
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
  quoteCatalog: (id: string) => ({ pk: `QCAT#${id}`, sk: 'META' }),
  quoteSession: (id: string) => ({ pk: `QSESS#${id}`, sk: 'META' }),
  quote: (id: string) => ({ pk: `QUOTE#${id}`, sk: 'META' }),
  priceRequest: (token: string) => ({ pk: `QPR#${token}`, sk: 'META' }),
  pendingPriceRequest: (token: string) => ({ pk: 'QPR_PENDING', sk: token }),
} as const;

/** Quote-demo rows live a week: long enough for a slow supplier, short enough
 * that uploaded catalogues do not pile up. */
export function ttlSeconds(nowMs = Date.now()): number {
  return Math.floor(nowMs / 1000) + 7 * 86400;
}
