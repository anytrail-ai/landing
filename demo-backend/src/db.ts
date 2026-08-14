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
//   DOMAIN#<domain>        / PROFILE   — cached CompanyProfile (expiresAt TTL)
//   IP#<ip>                / RATE#<window> — rate-limit bucket (expiresAt TTL)
//   BOOKINGDAY#<yyyy-mm-dd>/ SLOT#<hh:mm>  — a booked call (day = New York date)
//   EMAIL#<lowercased>     / ACTIVE    — guard: one active booking per address
export const keys = {
  lead: (sessionId: string) => ({ pk: `LEAD#${sessionId}`, sk: 'META' }),
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
} as const;
