import { randomUUID } from 'node:crypto';
import { PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { z } from 'zod';
import { TABLE_NAME, docClient, keys } from '../db';
import { assertPublicUrl, type LookupLike } from '../net/ssrf';
import { notifySignup } from '../notify';

export const startSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  websiteUrl: z.string().trim().min(4).max(2048),
  wantsProspects: z.boolean().default(false),
});

export type StartInput = z.infer<typeof startSchema>;

// "acme.com", "www.acme.com/products", "https://acme.com" → https URL + bare domain.
export function normalizeWebsite(raw: string): { url: string; domain: string } {
  const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`;
  const parsed = new URL(withScheme);
  const domain = parsed.hostname.toLowerCase().replace(/^www\./, '');
  if (!domain.includes('.')) throw new Error('invalid_domain');
  return { url: `https://${parsed.hostname}${parsed.pathname === '/' ? '' : parsed.pathname}`, domain };
}

export interface StartResult {
  sessionId: string;
  domain: string;
}

export async function startDemo(
  input: StartInput,
  ip: string,
  lookupImpl?: LookupLike,
): Promise<StartResult> {
  const { url, domain } = normalizeWebsite(input.websiteUrl);
  await assertPublicUrl(url, lookupImpl);

  const sessionId = randomUUID();
  await docClient().send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        ...keys.lead(sessionId),
        sessionId,
        name: input.name,
        email: input.email,
        websiteUrl: url,
        domain,
        wantsProspects: input.wantsProspects,
        ip,
        createdAt: new Date().toISOString(),
        // Extraction status; the pipeline (ANY-114) flips this as it runs.
        status: 'captured',
      },
    }),
  );
  // Awaited (Lambda freezes after the response) but failure-proof inside.
  const slackTs = await notifySignup({
    name: input.name,
    email: input.email,
    domain,
    wantsProspects: input.wantsProspects,
    ip,
  });
  // Remember the signup ping's Slack ts so chat turns can thread under it.
  if (slackTs) {
    await docClient().send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: keys.lead(sessionId),
        UpdateExpression: 'SET slackTs = :ts',
        ExpressionAttributeValues: { ':ts': slackTs },
      }),
    );
  }
  return { sessionId, domain };
}
