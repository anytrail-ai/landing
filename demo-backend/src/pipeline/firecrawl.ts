import { outboundFetch } from '../net/outbound-fetch';
import { LIMITS } from '../limits';

const API = 'https://api.firecrawl.dev/v2';

export interface CrawledPage {
  url: string;
  markdown: string;
}

interface FirecrawlDeps {
  fetchImpl?: typeof fetch;
}

// Paths that usually carry product/service content, in priority order.
const PRIORITY = [
  /product/i,
  /service/i,
  /shop|store|catalog|collection/i,
  /pricing|plans|precios/i,
  /solution/i,
  /about|nosotros/i,
];

export function pickUrls(all: string[], homepage: string, cap: number = LIMITS.crawlPageCap): string[] {
  const scored = all
    .filter((u) => u !== homepage)
    .map((u) => {
      const idx = PRIORITY.findIndex((re) => re.test(new URL(u).pathname));
      return { u, score: idx === -1 ? PRIORITY.length : idx };
    })
    .sort((a, b) => a.score - b.score || a.u.length - b.u.length);
  return [homepage, ...scored.map((s) => s.u)].slice(0, cap);
}

// map → pick product-ish pages → scrape each as markdown.
export async function crawlSite(
  siteUrl: string,
  apiKey: string,
  deps: FirecrawlDeps = {},
): Promise<CrawledPage[]> {
  const fetchImpl = deps.fetchImpl ?? outboundFetch;
  const headers = {
    authorization: `Bearer ${apiKey}`,
    'content-type': 'application/json',
  };

  const mapRes = await fetchImpl(`${API}/map`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ url: siteUrl, limit: 100 }),
  });
  if (!mapRes.ok) throw new Error(`firecrawl_map_${mapRes.status}`);
  const mapBody = (await mapRes.json()) as { links?: Array<string | { url: string }> };
  const links = (mapBody.links ?? []).map((l) => (typeof l === 'string' ? l : l.url));
  const urls = pickUrls(links.length ? links : [siteUrl], siteUrl);

  const pages = await Promise.all(
    urls.map(async (url): Promise<CrawledPage | null> => {
      const res = await fetchImpl(`${API}/scrape`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ url, formats: ['markdown'], onlyMainContent: true }),
      });
      if (!res.ok) return null;
      const body = (await res.json()) as { data?: { markdown?: string } };
      const markdown = body.data?.markdown?.trim();
      return markdown ? { url, markdown } : null;
    }),
  );

  const ok = pages.filter((p): p is CrawledPage => p !== null);
  if (!ok.length) throw new Error('crawl_empty');
  return ok;
}
