import { DynamoDBDocumentClient, QueryCommand, TransactWriteCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { beforeEach, describe, expect, it } from 'vitest';
import { setDocClientForTests } from '../db';
import { AlreadyBookedError, SlotTakenError, createBooking, listBookedInstants, markReminded } from './store';

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
});

describe('listBookedInstants', () => {
  it('queries each day in range and returns the booked instants', async () => {
    ddb.on(QueryCommand).resolves({ Items: [{ slotStartUtc: booking.slotStartUtc }] });
    const booked = await listBookedInstants(Date.parse('2026-08-20T12:00:00.000Z'), 1);
    expect(booked).toContain(booking.slotStartUtc);
    expect(ddb.commandCalls(QueryCommand).length).toBe(2); // today + 1
  });
});

describe('markReminded', () => {
  it('returns false when the flag was already set, so a retry cannot double-send', async () => {
    ddb.on(UpdateCommand).rejects(
      Object.assign(new Error('failed'), { name: 'ConditionalCheckFailedException' }),
    );
    expect(await markReminded(booking, 'remindedT24')).toBe(false);
  });
});
