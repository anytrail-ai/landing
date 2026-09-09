import { createHmac } from 'node:crypto';
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { setDocClientForTests } from '../db';
import { extractCodes, handleInbound, newCode, signatureValid, verifyWebhook } from './wa';

const ddb = mockClient(DynamoDBDocumentClient);

beforeEach(() => {
  ddb.reset();
  setDocClientForTests(ddb as unknown as DynamoDBDocumentClient);
});
afterEach(() => setDocClientForTests(undefined));

const cfg = {
  token: 't',
  phoneNumberId: '123',
  waNumber: '5215512345678',
  verifyToken: 'vt',
  appSecret: '',
};

describe('newCode / extractCodes', () => {
  it('round-trips through a prefilled message', () => {
    const code = newCode();
    expect(code).toHaveLength(6);
    expect(extractCodes(`Hola! Quiero ver mi demo 🚀 (${code})`)).toContain(code);
  });

  it('collects every code-shaped token, lowercased included', () => {
    // "BUENAS" is code-shaped — the DB lookup is what disambiguates, so both
    // candidates must surface, in order.
    expect(extractCodes('buenas tardes, demo abc245 please')).toEqual([
      'BUENAS',
      'TARDES',
      'ABC245',
    ]);
    // 0/1 are not in the alphabet, so an id-looking token is not a code.
    expect(extractCodes('order 100001')).toEqual([]);
  });
});

describe('verifyWebhook', () => {
  it('echoes the challenge only on a matching verify token', () => {
    expect(
      verifyWebhook(
        { 'hub.mode': 'subscribe', 'hub.verify_token': 'vt', 'hub.challenge': 'ch' },
        cfg,
      ),
    ).toBe('ch');
    expect(
      verifyWebhook(
        { 'hub.mode': 'subscribe', 'hub.verify_token': 'wrong', 'hub.challenge': 'ch' },
        cfg,
      ),
    ).toBeNull();
  });
});

describe('signatureValid', () => {
  it('accepts anything when no appSecret is configured', () => {
    expect(signatureValid('body', undefined, '')).toBe(true);
  });

  it('checks the sha256 HMAC when configured', () => {
    const sig = 'sha256=' + createHmac('sha256', 's3cret').update('body').digest('hex');
    expect(signatureValid('body', sig, 's3cret')).toBe(true);
    expect(signatureValid('tampered', sig, 's3cret')).toBe(false);
    expect(signatureValid('body', undefined, 's3cret')).toBe(false);
  });
});

describe('handleInbound', () => {
  const inbound = (text: string) =>
    JSON.stringify({
      entry: [
        {
          changes: [
            {
              value: {
                contacts: [{ wa_id: '52155999', profile: { name: 'Ana' } }],
                messages: [{ from: '52155999', type: 'text', text: { body: text } }],
              },
            },
          ],
        },
      ],
    });

  it('binds the sender to the session named by the code', async () => {
    ddb.on(GetCommand).resolves({ Item: { sessionId: 'sess-1' } });
    ddb.on(UpdateCommand).resolves({});
    await handleInbound(inbound('Hola! (ABC234)'));
    const update = ddb.commandCalls(UpdateCommand)[0]!.args[0].input;
    expect(update.Key).toEqual({ pk: 'LEAD#sess-1', sk: 'META' });
    expect(update.ExpressionAttributeValues![':id']).toBe('52155999');
    expect(update.ExpressionAttributeValues![':n']).toBe('Ana');
  });

  it('drops unknown codes, codeless texts, and unparseable bodies', async () => {
    ddb.on(GetCommand).resolves({ Item: undefined });
    await handleInbound(inbound('Hola! (ZZZZ99)'));
    await handleInbound(inbound('hola'));
    await handleInbound('not json');
    await handleInbound(JSON.stringify({ entry: [{ changes: [{ value: {} }] }] }));
    expect(ddb.commandCalls(UpdateCommand)).toHaveLength(0);
  });
});
