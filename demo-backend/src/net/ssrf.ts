// Ported from lead-crm server/src/services/scrape-description.ts. Blocks
// requests that would resolve to non-public address space (SSRF: loopback,
// RFC1918, link-local/cloud metadata, IPv6 ULA).
import { lookup } from 'node:dns/promises';
import net from 'node:net';

export function isBlockedIp(ip: string): boolean {
  const v4 = ip.startsWith('::ffff:') ? ip.slice(7) : ip;
  if (net.isIPv4(v4)) {
    const [a, b] = v4.split('.').map(Number);
    if (a === 127) return true; // loopback
    if (a === 10) return true; // private
    if (a === 172 && b >= 16 && b <= 31) return true; // private
    if (a === 192 && b === 168) return true; // private
    if (a === 169 && b === 254) return true; // link-local + cloud metadata
    if (a === 0) return true; // unspecified
    return false;
  }
  const lower = ip.toLowerCase();
  if (lower === '::1' || lower === '::') return true; // loopback / unspecified
  if (lower.startsWith('fe80')) return true; // link-local
  if (lower.startsWith('fc') || lower.startsWith('fd')) return true; // ULA fc00::/7
  return false;
}

export type LookupLike = (
  host: string,
  opts: { all: true },
) => Promise<Array<{ address: string; family: number }>>;

export async function assertPublicUrl(
  url: string,
  lookupImpl: LookupLike = lookup as unknown as LookupLike,
): Promise<void> {
  const parsed = new URL(url);
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('blocked_host');
  }
  const host = parsed.hostname;
  if (net.isIP(host)) {
    if (isBlockedIp(host)) throw new Error('blocked_host');
    return;
  }
  const results = await lookupImpl(host, { all: true });
  if (!results.length || results.some((r) => isBlockedIp(r.address))) {
    throw new Error('blocked_host');
  }
}
