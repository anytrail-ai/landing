import { afterEach, describe, expect, it } from 'vitest';
import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { captureLead, normalizePhone } from './lead';
import { setDocClientForTests } from '../db';
import { handler } from './handler';

const ddb = mockClient(DynamoDBDocumentClient);
setDocClientForTests(ddb as unknown as DynamoDBDocumentClient);

afterEach(() => ddb.reset());

describe('normalizePhone', () => {
  it('keeps digits and a leading plus, drops spaces and punctuation', () => {
    expect(normalizePhone('+52 1 81 2764 8080')).toBe('+5218127648080');
    expect(normalizePhone('(81) 2764-8080')).toBe('8127648080');
    expect(normalizePhone('  +1 (415) 555-0100 ')).toBe('+14155550100');
  });

  it('rejects numbers outside 8-15 digits or with no digits', () => {
    expect(normalizePhone('12345')).toBeNull();
    expect(normalizePhone('1234567890123456')).toBeNull();
    expect(normalizePhone('call me')).toBeNull();
  });
});

describe('captureLead', () => {
  it('stores name, normalised phone and language, and returns an id', async () => {
    ddb.on(PutCommand).resolves({});
    const res = await captureLead(
      { name: 'Ana', phone: '+52 81 2764 8080', lang: 'es' },
      '1.2.3.4',
    );
    expect(res.id).toMatch(/[0-9a-f-]{36}/);
    const put = ddb.commandCalls(PutCommand)[0].args[0].input;
    expect(put.Item).toMatchObject({
      pk: `WALEAD#${res.id}`,
      sk: 'META',
      name: 'Ana',
      phone: '+528127648080',
      phoneRaw: '+52 81 2764 8080',
      lang: 'es',
      ip: '1.2.3.4',
      source: 'demo',
    });
    expect(typeof put.Item?.createdAt).toBe('string');
  });

  it('rejects an unusable phone before writing anything', async () => {
    await expect(
      captureLead({ name: 'Ana', phone: 'no', lang: 'en' }, '1.2.3.4'),
    ).rejects.toThrow('invalid_phone');
    expect(ddb.commandCalls(PutCommand)).toHaveLength(0);
  });
});

describe('POST /demo/lead (handler)', () => {
  const event = (body: unknown) =>
    ({
      rawPath: '/demo/lead',
      body: JSON.stringify(body),
      requestContext: { http: { method: 'POST', sourceIp: '1.2.3.4' } },
    }) as never;

  it('422s on missing fields', async () => {
    ddb.on(UpdateCommand).resolves({});
    const res = await handler(event({ name: '', phone: '' }));
    expect(res).toMatchObject({ statusCode: 422 });
    expect(JSON.parse((res as { body: string }).body).error).toBe('invalid_input');
  });

  it('422s on a phone that cannot be dialled', async () => {
    ddb.on(UpdateCommand).resolves({});
    const res = await handler(event({ name: 'Ana', phone: '12', lang: 'es' }));
    expect(res).toMatchObject({ statusCode: 422 });
    expect(JSON.parse((res as { body: string }).body)).toEqual({ error: 'invalid_phone' });
  });

  it('stores the lead and answers 200 with its id', async () => {
    ddb.on(UpdateCommand).resolves({});
    ddb.on(PutCommand).resolves({});
    const res = await handler(event({ name: 'Ana', phone: '+52 81 2764 8080', lang: 'es' }));
    expect(res).toMatchObject({ statusCode: 200 });
    expect(JSON.parse((res as { body: string }).body)).toMatchObject({ ok: true });
    expect(ddb.commandCalls(PutCommand)).toHaveLength(1);
  });

  it('429s when the lead bucket is full', async () => {
    const err = new Error('cap');
    err.name = 'ConditionalCheckFailedException';
    ddb.on(UpdateCommand).rejects(err);
    const res = await handler(event({ name: 'Ana', phone: '+52 81 2764 8080', lang: 'es' }));
    expect(res).toMatchObject({ statusCode: 429 });
  });
});
