import { afterEach, describe, expect, it } from 'vitest';
import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { normalizeWebsite, startDemo } from './start';
import { setDocClientForTests } from '../db';
import { handler } from './handler';

const ddb = mockClient(DynamoDBDocumentClient);
setDocClientForTests(ddb as unknown as DynamoDBDocumentClient);

afterEach(() => ddb.reset());

const publicLookup = async () => [{ address: '93.184.216.34', family: 4 }];

describe('normalizeWebsite', () => {
  it('adds https and strips www', () => {
    expect(normalizeWebsite('www.acme.com')).toEqual({
      url: 'https://www.acme.com',
      domain: 'acme.com',
    });
  });

  it('keeps paths, drops bare slash', () => {
    expect(normalizeWebsite('https://acme.com/products').url).toBe(
      'https://acme.com/products',
    );
    expect(normalizeWebsite('acme.com/').url).toBe('https://acme.com');
  });

  it('rejects single-label hosts', () => {
    expect(() => normalizeWebsite('localhost')).toThrow('invalid_domain');
  });
});

describe('startDemo', () => {
  it('stores the lead and returns a sessionId', async () => {
    ddb.on(PutCommand).resolves({});
    const res = await startDemo(
      { name: 'Ana', email: 'ana@acme.com', websiteUrl: 'acme.com', wantsProspects: true },
      '1.2.3.4',
      publicLookup,
    );
    expect(res.domain).toBe('acme.com');
    expect(res.sessionId).toMatch(/[0-9a-f-]{36}/);
    const put = ddb.commandCalls(PutCommand)[0].args[0].input;
    expect(put.Item).toMatchObject({
      pk: `LEAD#${res.sessionId}`,
      email: 'ana@acme.com',
      wantsProspects: true,
      status: 'captured',
    });
  });
});

describe('POST /demo/start (handler)', () => {
  const event = (body: unknown, ip = '1.2.3.4') =>
    ({
      rawPath: '/demo/start',
      body: JSON.stringify(body),
      requestContext: { http: { method: 'POST', sourceIp: ip } },
    }) as never;

  it('422s on invalid input', async () => {
    ddb.on(UpdateCommand).resolves({});
    const res = await handler(event({ name: '', email: 'nope', websiteUrl: 'x' }));
    expect(res).toMatchObject({ statusCode: 422 });
  });

  it('429s when the rate bucket is full', async () => {
    const err = new Error('cap');
    err.name = 'ConditionalCheckFailedException';
    ddb.on(UpdateCommand).rejects(err);
    const res = await handler(
      event({ name: 'A', email: 'a@b.co', websiteUrl: 'acme.com' }),
    );
    expect(res).toMatchObject({ statusCode: 429 });
  });
});
