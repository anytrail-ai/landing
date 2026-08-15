import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { mockClient } from 'aws-sdk-client-mock';
import { beforeEach, describe, expect, it } from 'vitest';
import { manageUrlFor } from './links';
import { signBooking } from './token';

const secretsManager = mockClient(SecretsManagerClient);
const SECRET = 'test-schedule-secret';

const booking = {
  slotStartUtc: '2026-08-20T18:30:00.000Z',
  email: 'ana@acme.com',
  lang: 'en' as const,
};

beforeEach(() => {
  secretsManager.reset();
  process.env.SCHEDULE_SECRET_ARN = 'arn:aws:secretsmanager:test:schedule';
  secretsManager.on(GetSecretValueCommand).resolves({ SecretString: SECRET });
});

describe('manageUrlFor', () => {
  it('builds the English path with the slot and signature as query params', async () => {
    const url = await manageUrlFor(booking);
    const parsed = new URL(url);
    expect(parsed.origin + parsed.pathname).toBe('https://www.anytrail.ai/schedule');
    expect(parsed.searchParams.get('b')).toBe(booking.slotStartUtc);
    expect(parsed.searchParams.get('s')).toBe(signBooking(booking.slotStartUtc, booking.email, SECRET));
  });

  it('builds the Spanish path at /es/agenda', async () => {
    const url = await manageUrlFor({ ...booking, lang: 'es' });
    const parsed = new URL(url);
    expect(parsed.origin + parsed.pathname).toBe('https://www.anytrail.ai/es/agenda');
  });

  // The signature is what stops a stale link from controlling someone else's
  // booking of the same slot, or the same person's booking of a different one.
  it('commits the signature to both the slot and the email', async () => {
    const url = await manageUrlFor(booking);
    const sig = new URL(url).searchParams.get('s');

    const differentSlot = await manageUrlFor({ ...booking, slotStartUtc: '2026-08-21T18:30:00.000Z' });
    expect(new URL(differentSlot).searchParams.get('s')).not.toBe(sig);

    const differentEmail = await manageUrlFor({ ...booking, email: 'other@acme.com' });
    expect(new URL(differentEmail).searchParams.get('s')).not.toBe(sig);
  });
});
