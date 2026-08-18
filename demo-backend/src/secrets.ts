import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';

const client = new SecretsManagerClient({});
const cache = new Map<string, string>();

// Warm-container cached secret fetch. Secrets are plain strings (the API key).
export async function getSecret(
  envVar:
    | 'FIRECRAWL_SECRET_ARN'
    | 'APOLLO_SECRET_ARN'
    | 'RESEND_SECRET_ARN'
    | 'SLACK_WEBHOOK_SECRET_ARN'
    | 'SLACK_BOT_SECRET_ARN'
    | 'SCHEDULE_SECRET_ARN',
): Promise<string> {
  const arn = process.env[envVar];
  if (!arn) throw new Error(`${envVar} not set`);
  const hit = cache.get(arn);
  if (hit) return hit;
  const res = await client.send(new GetSecretValueCommand({ SecretId: arn }));
  const value = res.SecretString ?? '';
  if (!value) throw new Error(`secret ${envVar} is empty`);
  cache.set(arn, value);
  return value;
}
