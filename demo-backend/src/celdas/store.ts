import { randomUUID } from 'node:crypto';
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { TABLE_NAME, docClient, keys, ttlSeconds } from '../db';
import type { CeldasSession } from './types';

export function newSession(): CeldasSession {
  return {
    sessionId: randomUUID(),
    messages: [],
    userTurns: 0,
    quote: null,
    emailedTo: [],
    createdAt: new Date().toISOString(),
  };
}

export async function getCeldasSession(id: string): Promise<CeldasSession | null> {
  const res = await docClient().send(new GetCommand({ TableName: TABLE_NAME, Key: keys.celdasSession(id) }));
  return (res.Item as CeldasSession | undefined) ?? null;
}

export async function putCeldasSession(s: CeldasSession): Promise<void> {
  await docClient().send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: { ...keys.celdasSession(s.sessionId), ...s, expiresAt: ttlSeconds() },
    }),
  );
}

/** Short, human-readable folio: CEL-<yymmdd>-<4 hex>. */
export function newFolio(now = new Date()): string {
  const d = now.toISOString().slice(2, 10).replace(/-/g, '');
  return `CEL-${d}-${randomUUID().slice(0, 4).toUpperCase()}`;
}
