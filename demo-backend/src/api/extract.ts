import { GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { TABLE_NAME, docClient, keys } from '../db';
import { getSecret } from '../secrets';
import { crawlSite } from '../pipeline/firecrawl';
import {
  type CompanyProfile,
  cacheProfile,
  distillProfile,
  getCachedProfile,
} from '../pipeline/profile';

export class UnknownSessionError extends Error {
  constructor() {
    super('unknown_session');
    this.name = 'UnknownSessionError';
  }
}

// Called by the SPA right after /demo/start (via the streaming Function URL —
// crawls can exceed API Gateway's hard 30s cap). Cache hit skips Firecrawl and
// Bedrock entirely (one crawl per domain).
export async function extractForSession(
  sessionId: string,
  onStep: (step: string) => void = () => {},
): Promise<CompanyProfile> {
  const lead = await docClient().send(
    new GetCommand({ TableName: TABLE_NAME, Key: keys.lead(sessionId) }),
  );
  if (!lead.Item) throw new UnknownSessionError();
  const { domain, websiteUrl } = lead.Item as { domain: string; websiteUrl: string };

  let profile = await getCachedProfile(domain);
  if (profile) {
    onStep('We already know this site — loading your profile.');
  } else {
    onStep('Reading your website…');
    const apiKey = await getSecret('FIRECRAWL_SECRET_ARN');
    const pages = await crawlSite(websiteUrl, apiKey);
    onStep(`Read ${pages.length} page${pages.length === 1 ? '' : 's'} — learning your products…`);
    profile = await distillProfile(pages);
    await cacheProfile(domain, profile);
    onStep(`Found ${profile.products.length} product${profile.products.length === 1 ? '' : 's'} / services.`);
  }

  await docClient().send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: keys.lead(sessionId),
      UpdateExpression: 'SET #s = :s',
      ExpressionAttributeNames: { '#s': 'status' },
      ExpressionAttributeValues: { ':s': 'profiled' },
    }),
  );
  return profile;
}
