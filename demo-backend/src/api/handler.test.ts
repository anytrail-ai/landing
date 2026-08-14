import { DynamoDBDocumentClient, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { beforeEach, describe, expect, it } from 'vitest';
import { setDocClientForTests } from '../db';
import { handler, scheduleError } from './handler';

function event(method: string, path: string, opts: { sourceIp?: string } = {}) {
  return {
    rawPath: path,
    requestContext: { http: { method, path, sourceIp: opts.sourceIp } },
  } as never;
}

describe('api handler', () => {
  it('answers the health check', async () => {
    const res = await handler(event('GET', '/demo/health'));
    expect(res).toMatchObject({ statusCode: 200 });
  });

  it('404s unknown routes', async () => {
    const res = await handler(event('GET', '/demo/nope'));
    expect(res).toMatchObject({ statusCode: 404 });
  });
});

describe('scheduleError', () => {
  const err = (name: string) => Object.assign(new Error(name), { name });

  it.each([
    ['RateLimitedError', 429, 'rate_limited'],
    ['SlotTakenError', 409, 'slot_taken'],
    ['SlotUnavailableError', 409, 'slot_taken'],
    ['AlreadyBookedError', 409, 'already_booked'],
    ['InvalidSignatureError', 403, 'invalid_link'],
    ['UnknownBookingError', 404, 'unknown_booking'],
    ['InvalidWebsiteError', 422, 'invalid_website'],
  ] as const)('maps %s to %i (%s)', (name, status, code) => {
    const res = scheduleError(err(name)) as { statusCode: number; body: string };
    expect(res.statusCode).toBe(status);
    expect(JSON.parse(res.body)).toEqual({ error: code });
  });

  it('rethrows anything else instead of masking a real defect as a 4xx', () => {
    // A TypeError here (a null deref, a malformed stored row) must reach the
    // handler's catch-all and 500, not be mistaken for book()'s InvalidWebsiteError.
    expect(() => scheduleError(err('TypeError'))).toThrow();
  });
});

describe('scheduling rate limit', () => {
  const ddb = mockClient(DynamoDBDocumentClient);

  beforeEach(() => {
    ddb.reset();
    setDocClientForTests(ddb as unknown as DynamoDBDocumentClient);
  });

  it('/schedule/slots writes to its own bucket, not the demo-start one', async () => {
    ddb.on(UpdateCommand).resolves({});
    ddb.on(QueryCommand).resolves({ Items: [] });
    await handler(event('GET', '/schedule/slots', { sourceIp: '9.9.9.9' }));

    const call = ddb.commandCalls(UpdateCommand)[0].args[0].input;
    expect(call.Key!.pk).toBe('IP#9.9.9.9#schedule');
  });
});
