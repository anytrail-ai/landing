import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { TABLE_NAME, docClient, keys } from '../db';
import { LIMITS } from '../limits';

export class RateLimitedError extends Error {
  constructor() {
    super('rate_limited');
    this.name = 'RateLimitedError';
  }
}

// Fixed-window counter per IP, one DynamoDB item per window, TTL-cleaned.
// Atomic: the conditional update both increments and enforces the cap.
export async function assertWithinRateLimit(
  ip: string,
  nowMs = Date.now(),
): Promise<void> {
  const windowStart =
    Math.floor(nowMs / 1000 / LIMITS.windowSeconds) * LIMITS.windowSeconds;
  try {
    await docClient().send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: keys.rate(ip, windowStart),
        UpdateExpression: 'ADD #n :one SET expiresAt = :exp',
        ConditionExpression: 'attribute_not_exists(#n) OR #n < :cap',
        ExpressionAttributeNames: { '#n': 'n' },
        ExpressionAttributeValues: {
          ':one': 1,
          ':cap': LIMITS.startPerIp,
          ':exp': windowStart + LIMITS.windowSeconds * 2,
        },
      }),
    );
  } catch (err) {
    if ((err as Error).name === 'ConditionalCheckFailedException') {
      throw new RateLimitedError();
    }
    throw err;
  }
}
