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

/**
 * Lives here (not in the API layer) because `moveBooking` throws it too: the
 * booking `authorize()` loaded no longer matches the row on disk by the time
 * the transaction runs, which is a store-level fact, not a signature failure.
 */
export class UnknownBookingError extends Error {
  constructor() {
    super('unknown_booking');
    this.name = 'UnknownBookingError';
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

/**
 * Atomically replaces `from`'s slot with `to`'s, in one transaction: delete
 * the old slot row (conditioned on it still being the exact booking that was
 * authorized), put the new one (conditioned on it still being free), and
 * overwrite the email guard to point at the new slot. A crash or timeout
 * between writes cannot happen — DynamoDB applies all three or none — so a
 * move can never destroy a confirmed booking; it either succeeds outright or
 * fails with the original booking still fully intact.
 *
 * The Delete's `createdAt = :c` condition closes a TOCTOU window: without it,
 * a caller authorized against the row at t1 could still have its Delete
 * apply at t4 after that row was cancelled at t2 and re-booked by someone
 * else at t3 — silently deleting the new booker's slot and orphaning their
 * email guard (a DynamoDB Delete on a missing item succeeds, so a plain
 * unconditioned Delete cannot tell "still mine" from "gone, then replaced").
 * `createdAt` is stable for a given active booking (move() preserves it) and
 * changes on every new booking of that slot, so it is exactly the "is this
 * still the row I authorized" check.
 *
 * The guard Put carries no condition. This is not an oversight: the caller
 * is already authenticated by the HMAC signature on the booking being moved,
 * so the guard here is just following that same owner to their new slot, not
 * gatekeeping a second identity. The new-slot Put's `attribute_not_exists`
 * condition is what actually protects against a race (someone else taking
 * that slot first) — conditioning the guard write too would add a failure
 * mode without protecting anything the slot condition doesn't already cover.
 * Do not add a condition here.
 */
export async function moveBooking(from: Booking, to: Booking): Promise<void> {
  try {
    await docClient().send(
      new TransactWriteCommand({
        TransactItems: [
          {
            Delete: {
              TableName: TABLE_NAME,
              Key: keyFor(from.slotStartUtc),
              ConditionExpression: 'createdAt = :c',
              ExpressionAttributeValues: { ':c': from.createdAt },
            },
          },
          {
            Put: {
              TableName: TABLE_NAME,
              Item: { ...keyFor(to.slotStartUtc), ...to },
              ConditionExpression: 'attribute_not_exists(pk)',
            },
          },
          {
            Put: {
              TableName: TABLE_NAME,
              Item: {
                ...keys.emailGuard(to.email),
                slotStartUtc: to.slotStartUtc,
                expiresAt: Math.floor(new Date(to.slotStartUtc).getTime() / 1000) + 86400,
              },
            },
          },
        ],
      }),
    );
  } catch (err) {
    const e = err as { name?: string; CancellationReasons?: { Code?: string }[] };
    if (e.name === 'TransactionCanceledException') {
      const [del, slot] = e.CancellationReasons ?? [];
      if (del?.Code === 'ConditionalCheckFailed') throw new UnknownBookingError();
      if (slot?.Code === 'ConditionalCheckFailed') throw new SlotTakenError();
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
