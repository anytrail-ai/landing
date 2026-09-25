import { DeleteCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { TABLE_NAME, docClient, keys } from '../db';
import { LIMITS } from '../limits';
import { sendPriceRequestEmail } from './email';
import { getPriceRequest } from './store';
import type { PriceRequest } from './types';

// Runs every minute (QuoteReminderSchedule in lib/api-stack.ts). Unlike the
// booking sweep there is no window arithmetic: a request is due once its
// absolute nextReminderAt has passed, so a late or skipped sweep only delays.
//
// Claim before send (the house pattern in ../reminders/handler.ts): two
// overlapping sweeps — the 1-minute rule re-firing while a prior run is
// still in flight, or an async Lambda retry — can both read the same due
// row. Only one conditional UpdateCommand can win; the loser sees
// ConditionalCheckFailedException and sends nothing. A duplicate email to a
// real supplier is worse than a reminder lost to a rare crash between the
// claim and the send — the next one arrives 3 minutes later regardless.

export function dueQuoteReminders(rows: PriceRequest[], nowMs: number): PriceRequest[] {
  return rows.filter(
    (r) => r.status === 'pending' && r.remindersSent < LIMITS.priceReminderMax && nowMs >= r.nextReminderAt,
  );
}

export async function handler(): Promise<void> {
  const res = await docClient().send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: { ':pk': keys.pendingPriceRequest('').pk },
    }),
  );
  const tokens = (res.Items ?? []).map((i) => i.sk as string);
  const rows = (await Promise.all(tokens.map((t) => getPriceRequest(t)))).filter((r): r is PriceRequest => r !== null);
  const now = Date.now();

  for (const req of dueQuoteReminders(rows, now)) {
    const n = req.remindersSent + 1;
    try {
      // Claim first: the conditional update is what makes an overlapping
      // sweep or Lambda retry safe. Only the claim's winner ever sends.
      await docClient().send(
        new UpdateCommand({
          TableName: TABLE_NAME,
          Key: keys.priceRequest(req.token),
          UpdateExpression: 'SET remindersSent = :n, nextReminderAt = :next',
          ConditionExpression: 'remindersSent = :prev AND #s = :pending',
          ExpressionAttributeNames: { '#s': 'status' },
          ExpressionAttributeValues: {
            ':n': n,
            ':prev': req.remindersSent,
            ':pending': 'pending',
            ':next': now + LIMITS.priceReminderEveryMs,
          },
        }),
      );
    } catch (err) {
      if ((err as Error).name !== 'ConditionalCheckFailedException') {
        console.error('price_reminder_claim_failed', { quoteId: req.quoteId, n, err });
      }
      // Another sweep already owns this reminder (or the claim itself
      // failed): send nothing, retry naturally on the next sweep.
      continue;
    }

    if (n >= LIMITS.priceReminderMax) {
      // Reminders stop; the supplier link keeps working (status stays
      // pending). This runs regardless of whether the send below succeeds —
      // the claim, not the send, is what retired the cap.
      await docClient().send(new DeleteCommand({ TableName: TABLE_NAME, Key: keys.pendingPriceRequest(req.token) }));
    }

    try {
      await sendPriceRequestEmail(req, n);
      console.log('price_reminder_sent', JSON.stringify({ quoteId: req.quoteId, n }));
    } catch (err) {
      // The reminder is already spent (claimed above); a failed send here is
      // not retried until the next scheduled reminder, 3 minutes out.
      console.error('price_reminder_failed', { quoteId: req.quoteId, n, err });
    }
  }
  // Answered requests whose index row outlived a crash between the two writes
  // in answerPriceRequest: drop them so the sweep stays small.
  for (const r of rows.filter((r) => r.status !== 'pending')) {
    await docClient().send(new DeleteCommand({ TableName: TABLE_NAME, Key: keys.pendingPriceRequest(r.token) }));
  }
}
