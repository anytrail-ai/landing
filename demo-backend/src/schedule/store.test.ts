import { DynamoDBDocumentClient, QueryCommand, TransactWriteCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { beforeEach, describe, expect, it } from 'vitest';
import { setDocClientForTests } from '../db';
import {
  AlreadyBookedError,
  SlotTakenError,
  UnknownBookingError,
  createBooking,
  deleteBooking,
  listBookedInstants,
  markReminded,
  moveBooking,
} from './store';

const ddb = mockClient(DynamoDBDocumentClient);

const booking = {
  slotStartUtc: '2026-08-20T18:30:00.000Z',
  name: 'Ana',
  email: 'Ana@Acme.com',
  website: 'https://acme.com',
  note: '',
  lang: 'en' as const,
  remindedT24: false,
  remindedT1: false,
  createdAt: '2026-08-19T12:00:00.000Z',
  ip: '1.2.3.4',
};

beforeEach(() => {
  ddb.reset();
  setDocClientForTests(ddb as unknown as DynamoDBDocumentClient);
  process.env.TABLE_NAME = 'test-table';
});

describe('createBooking', () => {
  it('writes the booking and the email guard in one transaction', async () => {
    ddb.on(TransactWriteCommand).resolves({});
    await createBooking(booking);

    const call = ddb.commandCalls(TransactWriteCommand)[0].args[0].input;
    expect(call.TransactItems).toHaveLength(2);
    const [slot, guard] = call.TransactItems!;
    expect(slot.Put!.Item!.pk).toBe('BOOKINGDAY#2026-08-20');
    expect(slot.Put!.Item!.sk).toBe('SLOT#14:30');
    expect(slot.Put!.ConditionExpression).toContain('attribute_not_exists');
    // Guard is lowercased so Ana@Acme.com cannot book twice as ana@acme.com.
    expect(guard.Put!.Item!.pk).toBe('EMAIL#ana@acme.com');
    expect(guard.Put!.ConditionExpression).toContain('attribute_not_exists');
  });

  it('reports a taken slot distinctly from a repeat booker', async () => {
    const err = Object.assign(new Error('cancelled'), {
      name: 'TransactionCanceledException',
      CancellationReasons: [{ Code: 'ConditionalCheckFailed' }, { Code: 'None' }],
    });
    ddb.on(TransactWriteCommand).rejects(err);
    await expect(createBooking(booking)).rejects.toBeInstanceOf(SlotTakenError);

    const err2 = Object.assign(new Error('cancelled'), {
      name: 'TransactionCanceledException',
      CancellationReasons: [{ Code: 'None' }, { Code: 'ConditionalCheckFailed' }],
    });
    ddb.on(TransactWriteCommand).rejects(err2);
    await expect(createBooking(booking)).rejects.toBeInstanceOf(AlreadyBookedError);
  });

  it('lets a new booking through when the existing guard points at a past booking', async () => {
    ddb.on(TransactWriteCommand).resolves({});
    await createBooking(booking);

    const call = ddb.commandCalls(TransactWriteCommand)[0].args[0].input;
    const guard = call.TransactItems![1];
    // The OR clause is what lets DynamoDB accept the write when the existing
    // guard row's slotStartUtc is in the past — only an *active* booking
    // should block. expiresAt is housekeeping on top of that (TTL deletion
    // can lag up to 48h, so it is not the real enforcement mechanism).
    expect(guard.Put!.ConditionExpression).toBe('attribute_not_exists(pk) OR slotStartUtc < :now');
    expect(guard.Put!.ExpressionAttributeValues).toHaveProperty(':now');
    expect(guard.Put!.Item!.expiresAt).toBe(
      Math.floor(new Date(booking.slotStartUtc).getTime() / 1000) + 86400,
    );
  });
});

describe('deleteBooking', () => {
  it('deletes the slot row and the email guard in one transaction', async () => {
    ddb.on(TransactWriteCommand).resolves({});
    await deleteBooking(booking);

    const call = ddb.commandCalls(TransactWriteCommand)[0].args[0].input;
    expect(call.TransactItems).toHaveLength(2);
    const [slot, guard] = call.TransactItems!;
    expect(slot.Delete!.Key).toEqual({ pk: 'BOOKINGDAY#2026-08-20', sk: 'SLOT#14:30' });
    expect(guard.Delete!.Key).toEqual({ pk: 'EMAIL#ana@acme.com', sk: 'ACTIVE' });
  });
});

describe('moveBooking', () => {
  const moved = { ...booking, slotStartUtc: '2026-08-21T15:00:00.000Z' };

  it('deletes the old slot, puts the new one, and re-points the guard in one transaction', async () => {
    ddb.on(TransactWriteCommand).resolves({});
    await moveBooking(booking, moved);

    const call = ddb.commandCalls(TransactWriteCommand)[0].args[0].input;
    expect(call.TransactItems).toHaveLength(3);
    const [del, put, guard] = call.TransactItems!;

    expect(del.Delete!.Key).toEqual({ pk: 'BOOKINGDAY#2026-08-20', sk: 'SLOT#14:30' });
    // Bound to the authorized booking's createdAt: closes the TOCTOU window
    // where the row was cancelled and re-booked by someone else between
    // authorize() loading it and this transaction running.
    expect(del.Delete!.ConditionExpression).toBe('createdAt = :c');
    expect(del.Delete!.ExpressionAttributeValues).toEqual({ ':c': booking.createdAt });

    expect(put.Put!.Item!.pk).toBe('BOOKINGDAY#2026-08-21');
    expect(put.Put!.Item!.sk).toBe('SLOT#11:00');
    expect(put.Put!.Item!.slotStartUtc).toBe(moved.slotStartUtc);
    expect(put.Put!.ConditionExpression).toBe('attribute_not_exists(pk)');

    expect(guard.Put!.Item!.pk).toBe('EMAIL#ana@acme.com');
    expect(guard.Put!.Item!.sk).toBe('ACTIVE');
    expect(guard.Put!.Item!.slotStartUtc).toBe(moved.slotStartUtc);
    expect(guard.Put!.Item!.expiresAt).toBe(
      Math.floor(new Date(moved.slotStartUtc).getTime() / 1000) + 86400,
    );
    // No condition on the guard write: the caller is already authenticated
    // by the HMAC on the booking being moved, so this is just following the
    // same owner to their new slot, not gatekeeping a second identity.
    expect(guard.Put!.ConditionExpression).toBeUndefined();
  });

  it('reports the authorized row having changed underneath it as UnknownBookingError', async () => {
    const err = Object.assign(new Error('cancelled'), {
      name: 'TransactionCanceledException',
      CancellationReasons: [{ Code: 'ConditionalCheckFailed' }, { Code: 'None' }, { Code: 'None' }],
    });
    ddb.on(TransactWriteCommand).rejects(err);
    await expect(moveBooking(booking, moved)).rejects.toBeInstanceOf(UnknownBookingError);
  });

  it('reports a slot taken by someone else as SlotTakenError', async () => {
    const err = Object.assign(new Error('cancelled'), {
      name: 'TransactionCanceledException',
      CancellationReasons: [{ Code: 'None' }, { Code: 'ConditionalCheckFailed' }, { Code: 'None' }],
    });
    ddb.on(TransactWriteCommand).rejects(err);
    await expect(moveBooking(booking, moved)).rejects.toBeInstanceOf(SlotTakenError);
  });

  it('rethrows anything that is not the new-slot condition failing', async () => {
    const err = Object.assign(new Error('cancelled'), {
      name: 'TransactionCanceledException',
      CancellationReasons: [{ Code: 'None' }, { Code: 'None' }, { Code: 'ConditionalCheckFailed' }],
    });
    ddb.on(TransactWriteCommand).rejects(err);
    await expect(moveBooking(booking, moved)).rejects.not.toBeInstanceOf(SlotTakenError);
  });
});

describe('listBookedInstants', () => {
  it('queries each day in range and returns the booked instants', async () => {
    ddb.on(QueryCommand).resolves({ Items: [{ slotStartUtc: booking.slotStartUtc }] });
    const booked = await listBookedInstants(Date.parse('2026-08-20T12:00:00.000Z'), 1);
    expect(booked).toContain(booking.slotStartUtc);
    expect(ddb.commandCalls(QueryCommand).length).toBe(2); // today + 1
  });

  it('does not skip a calendar day across a DST spring-forward', async () => {
    ddb.on(QueryCommand).resolves({ Items: [] });
    // 2027-03-13T04:00:00Z is 23:00 EST on Mar 12 in New York.
    await listBookedInstants(Date.parse('2027-03-13T04:00:00.000Z'), 2);

    const dayKeys = ddb
      .commandCalls(QueryCommand)
      .map((c) => c.args[0].input.ExpressionAttributeValues![':pk']);
    expect(dayKeys).toEqual([
      'BOOKINGDAY#2027-03-12',
      'BOOKINGDAY#2027-03-13',
      'BOOKINGDAY#2027-03-14',
    ]);
  });
});

describe('markReminded', () => {
  it('sets the flag and returns true the first time', async () => {
    ddb.on(UpdateCommand).resolves({});
    const result = await markReminded(booking, 'remindedT24');
    expect(result).toBe(true);

    const call = ddb.commandCalls(UpdateCommand)[0].args[0].input;
    expect(call.UpdateExpression).toBe('SET #f = :true');
    expect(call.ExpressionAttributeNames).toEqual({ '#f': 'remindedT24' });
    expect(call.ConditionExpression).toContain('#f = :false');
  });

  it('returns false when the flag was already set, so a retry cannot double-send', async () => {
    ddb.on(UpdateCommand).rejects(
      Object.assign(new Error('failed'), { name: 'ConditionalCheckFailedException' }),
    );
    expect(await markReminded(booking, 'remindedT24')).toBe(false);

    const call = ddb.commandCalls(UpdateCommand)[0].args[0].input;
    expect(call.ConditionExpression).toContain('#f = :false');
    expect(call.ExpressionAttributeNames).toEqual({ '#f': 'remindedT24' });
  });
});
