import { randomUUID } from 'node:crypto';
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { TABLE_NAME, docClient, keys, ttlSeconds } from '../db';
import type { GrubpakSession } from './types';

export function newSession(): GrubpakSession {
  return {
    sessionId: randomUUID(),
    messages: [],
    userTurns: 0,
    lead: null,
    cart: null,
    checkoutUrl: null,
    orders: [],
    sequences: [],
    notes: [],
    createdAt: new Date().toISOString(),
  };
}

export async function getGrubpakSession(id: string): Promise<GrubpakSession | null> {
  const res = await docClient().send(new GetCommand({ TableName: TABLE_NAME, Key: keys.grubpakSession(id) }));
  return (res.Item as GrubpakSession | undefined) ?? null;
}

export async function putGrubpakSession(s: GrubpakSession): Promise<void> {
  await docClient().send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: { ...keys.grubpakSession(s.sessionId), ...s, expiresAt: ttlSeconds() },
    }),
  );
}
