// The single outbound HTTP chokepoint (pattern from lead-crm
// server/src/net/outbound-fetch.ts). Everything that talks to a third party —
// Firecrawl, Apollo, anything scraped — goes through here. DEMO_OUTBOUND=disabled
// is the kill switch (ANY-119): it fails every outbound call closed without a
// redeploy, which takes the whole pipeline offline while the SPA stays up.
export class OutboundDisabledError extends Error {
  constructor(url: string, method: string) {
    super(`Outbound HTTP is disabled (DEMO_OUTBOUND), refusing ${method} ${url}.`);
    this.name = 'OutboundDisabledError';
  }
}

export const outboundFetch: typeof fetch = (input, init) => {
  if ((process.env.DEMO_OUTBOUND ?? 'enabled') !== 'disabled') {
    return fetch(input, init);
  }
  const url =
    typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
  const method = init?.method ?? 'GET';
  return Promise.reject(new OutboundDisabledError(url, method));
};
