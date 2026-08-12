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
export const keys = {
  lead: (sessionId: string) => ({ pk: `LEAD#${sessionId}`, sk: 'META' }),
  profile: (domain: string) => ({ pk: `DOMAIN#${domain}`, sk: 'PROFILE' }),
  rate: (ip: string, windowStart: number) => ({
    pk: `IP#${ip}`,
    sk: `RATE#${windowStart}`,
  }),
} as const;
