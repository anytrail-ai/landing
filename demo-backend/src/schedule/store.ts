import {
  GetCommand,
  QueryCommand,
  TransactWriteCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { TABLE_NAME, docClient, keys } from '../db';
import { SCHEDULE } from './config';
import { dayKeyFor, horizonDayKeys, slotKeyFor } from './slots';

export class SlotTakenError extends Error {
  constructor() {
    super('slot_taken');
    this.name = 'SlotTakenError';
  }
}

export class AlreadyBookedError extends Error {
  constructor() {
    super('already_booked');
    this.name = 'AlreadyBookedError';
  }
}

export interface Booking {
  slotStartUtc: string;
  name: string;
  email: string;
  website: string;
  note: string;
  lang: 'en' | 'es';
  remindedT24: boolean;
  remindedT1: boolean;
  createdAt: string;
  ip: string;
  sequence?: number;
}

function keyFor(slotStartUtc: string) {
  const at = new Date(slotStartUtc);
  return keys.bookingDay(dayKeyFor(at, SCHEDULE.timezone), slotKeyFor(at, SCHEDULE.timezone));
}

/**
 * The slot row and the email guard go in together or not at all. Without the
 * transaction a crash between the two writes leaves either a booking nobody
 * can find, or a guard blocking a booking that does not exist.
 *
 * The guard's condition is time-aware: a guard row left behind by a *past*
 * booking (the call already happened) does not block a new one, since the
 * spec is one *active* booking per address, not one ever. `expiresAt` is
 * only housekeeping on top of that — DynamoDB TTL deletion can lag up to 48
 * hours, so the OR-clause carries the real semantics.
 */
export async function createBooking(b: Booking): Promise<void> {
  try {
    await docClient().send(
      new TransactWriteCommand({
        TransactItems: [
          {
            Put: {
              TableName: TABLE_NAME,
              Item: { ...keyFor(b.slotStartUtc), ...b },
              ConditionExpression: 'attribute_not_exists(pk)',
            },
          },
          {
            Put: {
              TableName: TABLE_NAME,
              Item: {
                ...keys.emailGuard(b.email),
                slotStartUtc: b.slotStartUtc,
                expiresAt: Math.floor(new Date(b.slotStartUtc).getTime() / 1000) + 86400,
              },
              ConditionExpression: 'attribute_not_exists(pk) OR slotStartUtc < :now',
              ExpressionAttributeValues: { ':now': new Date().toISOString() },
            },
          },
        ],
      }),
    );
  } catch (err) {
    const e = err as { name?: string; CancellationReasons?: { Code?: string }[] };
    if (e.name === 'TransactionCanceledException') {
      const [slot, guard] = e.CancellationReasons ?? [];
      if (slot?.Code === 'ConditionalCheckFailed') throw new SlotTakenError();
      if (guard?.Code === 'ConditionalCheckFailed') throw new AlreadyBookedError();
    }
    throw err;
  }
}

export async function getBooking(slotStartUtc: string): Promise<Booking | null> {
  const res = await docClient().send(
    new GetCommand({ TableName: TABLE_NAME, Key: keyFor(slotStartUtc) }),
  );
  return (res.Item as Booking | undefined) ?? null;
}

/** Frees the slot and releases the email guard. */
export async function deleteBooking(b: Booking): Promise<void> {
  await docClient().send(
    new TransactWriteCommand({
      TransactItems: [
        { Delete: { TableName: TABLE_NAME, Key: keyFor(b.slotStartUtc) } },
        { Delete: { TableName: TABLE_NAME, Key: keys.emailGuard(b.email) } },
      ],
    }),
  );
}

export async function listBookingsForDay(dayKey: string): Promise<Booking[]> {
  const res = await docClient().send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: { ':pk': `BOOKINGDAY#${dayKey}` },
    }),
  );
  return (res.Items ?? []) as Booking[];
}

/**
 * Day-partitioned, so this is `days + 1` queries and never a table scan.
 * Day keys come from `horizonDayKeys`'s calendar arithmetic, not fixed
 * 86400_000ms steps — a DST spring-forward would otherwise skip a day.
 */
export async function listBookedInstants(fromMs: number, days: number): Promise<string[]> {
  const out: string[] = [];
  for (const dayKey of horizonDayKeys(fromMs, days, SCHEDULE.timezone)) {
    for (const item of await listBookingsForDay(dayKey)) out.push(item.slotStartUtc);
  }
  return out;
}

/**
 * Sets a reminder flag, returning false if it was already set. The condition
 * is the entire reason a Lambda retry cannot send a second reminder.
 */
export async function markReminded(
  b: Booking,
  which: 'remindedT24' | 'remindedT1',
): Promise<boolean> {
  try {
    await docClient().send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: keyFor(b.slotStartUtc),
        UpdateExpression: 'SET #f = :true',
        ConditionExpression: 'attribute_exists(pk) AND #f = :false',
        ExpressionAttributeNames: { '#f': which },
        ExpressionAttributeValues: { ':true': true, ':false': false },
      }),
    );
    return true;
  } catch (err) {
    if ((err as Error).name === 'ConditionalCheckFailedException') return false;
    throw err;
  }
}
