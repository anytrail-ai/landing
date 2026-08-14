import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { TABLE_NAME, docClient, keys } from '../db';
import { LIMITS } from '../limits';

export class RateLimitedError extends Error {
  constructor() {
    super('rate_limited');
    this.name = 'RateLimitedError';
  }
}

/**
 * Fixed-window counter per IP, one DynamoDB item per window, TTL-cleaned.
 * Atomic: the conditional update both increments and enforces the cap.
 *
 * `opts.bucket` partitions the counter so unrelated call sites cannot drain
 * each other's quota (e.g. /schedule/slots firing on every page load must
 * not eat into a visitor's demo-start allowance). Omitted, both `bucket` and
 * `cap` default to today's behavior, so existing callers are untouched.
 */
export async function assertWithinRateLimit(
  ip: string,
  nowMs = Date.now(),
  opts?: { bucket?: string; cap?: number },
): Promise<void> {
  const windowStart =
    Math.floor(nowMs / 1000 / LIMITS.windowSeconds) * LIMITS.windowSeconds;
  const cap = opts?.cap ?? LIMITS.startPerIp;
  try {
    await docClient().send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: keys.rate(ip, windowStart, opts?.bucket),
        UpdateExpression: 'ADD #n :one SET expiresAt = :exp',
        ConditionExpression: 'attribute_not_exists(#n) OR #n < :cap',
        ExpressionAttributeNames: { '#n': 'n' },
        ExpressionAttributeValues: {
          ':one': 1,
          ':cap': cap,
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
