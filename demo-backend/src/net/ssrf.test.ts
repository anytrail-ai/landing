import { describe, expect, it } from 'vitest';
import { assertPublicUrl, isBlockedIp } from './ssrf';

describe('isBlockedIp', () => {
  it.each([
    '127.0.0.1',
    '10.1.2.3',
    '172.16.0.1',
    '172.31.255.255',
    '192.168.1.1',
    '169.254.169.254',
    '0.0.0.0',
    '::1',
    'fe80::1',
    'fd00::2',
    '::ffff:127.0.0.1',
  ])('blocks %s', (ip) => {
    expect(isBlockedIp(ip)).toBe(true);
  });

  it.each(['8.8.8.8', '172.32.0.1', '2600::1'])('allows %s', (ip) => {
    expect(isBlockedIp(ip)).toBe(false);
  });
});

describe('assertPublicUrl', () => {
  const resolveTo = (address: string) => async () => [{ address, family: 4 }];

  it('rejects non-http protocols', async () => {
    await expect(assertPublicUrl('file:///etc/passwd')).rejects.toThrow('blocked_host');
  });

  it('rejects literal internal IPs without a lookup', async () => {
    await expect(assertPublicUrl('http://169.254.169.254/latest')).rejects.toThrow(
      'blocked_host',
    );
  });

  it('rejects hosts resolving to internal space', async () => {
    await expect(
      assertPublicUrl('https://evil.example', resolveTo('10.0.0.5')),
    ).rejects.toThrow('blocked_host');
  });

  it('allows public hosts', async () => {
    await expect(
      assertPublicUrl('https://ok.example', resolveTo('93.184.216.34')),
    ).resolves.toBeUndefined();
  });
});
