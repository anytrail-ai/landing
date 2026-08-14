import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { beforeEach, describe, expect, it } from 'vitest';
import { setDocClientForTests } from '../db';
import { RateLimitedError, assertWithinRateLimit } from './rate-limit';

const ddb = mockClient(DynamoDBDocumentClient);

beforeEach(() => {
  ddb.reset();
  setDocClientForTests(ddb as unknown as DynamoDBDocumentClient);
});

describe('assertWithinRateLimit', () => {
  it('defaults to the unnamed bucket and the startPerIp cap, unchanged from before bucket support existed', async () => {
    ddb.on(UpdateCommand).resolves({});
    await assertWithinRateLimit('1.2.3.4', 0);

    const call = ddb.commandCalls(UpdateCommand)[0].args[0].input;
    expect(call.Key).toEqual({ pk: 'IP#1.2.3.4', sk: 'RATE#0' });
    expect(call.ExpressionAttributeValues![':cap']).toBe(200);
  });

  it('partitions a named bucket into its own key, with its own cap', async () => {
    ddb.on(UpdateCommand).resolves({});
    await assertWithinRateLimit('1.2.3.4', 0, { bucket: 'schedule', cap: 300 });

    const call = ddb.commandCalls(UpdateCommand)[0].args[0].input;
    expect(call.Key).toEqual({ pk: 'IP#1.2.3.4#schedule', sk: 'RATE#0' });
    expect(call.ExpressionAttributeValues![':cap']).toBe(300);
  });

  it('does not let a full demo-start bucket block a scheduling request in its own bucket', async () => {
    // Two distinct DynamoDB keys, stubbed independently: the unnamed
    // (demo-start) bucket is already at cap, the 'schedule' bucket is not.
    ddb
      .on(UpdateCommand, { Key: { pk: 'IP#1.2.3.4', sk: 'RATE#0' } })
      .rejects(Object.assign(new Error('cap'), { name: 'ConditionalCheckFailedException' }));
    ddb
      .on(UpdateCommand, { Key: { pk: 'IP#1.2.3.4#schedule', sk: 'RATE#0' } })
      .resolves({});

    await expect(assertWithinRateLimit('1.2.3.4', 0)).rejects.toBeInstanceOf(RateLimitedError);
    await expect(
      assertWithinRateLimit('1.2.3.4', 0, { bucket: 'schedule', cap: 300 }),
    ).resolves.toBeUndefined();
  });
});
