// Every abuse/cost cap in one place (ANY-113). Change here, not inline.
export const LIMITS = {
  /** POST /demo/start requests allowed per IP per window.
   * Temporarily raised for founder testing — drop back to ~20 before real launch. */
  startPerIp: 200,
  /** All five /schedule/* requests per IP per window, combined. Separate from
   * startPerIp: /schedule/slots fires on every page load of the scheduling
   * UI, and sharing the demo-start counter would let ordinary browsing drain
   * a visitor's ability to submit the lead form. */
  schedulePerIp: 300,
  /** POST /schedule/book only, its own much smaller bucket. Emails are
   * unverified, so without this a single IP with throwaway addresses could
   * burn through the ~224-slot calendar well inside the general 300 cap,
   * firing a Resend send and a Slack ping for each one. */
  bookPerIp: 5,
  // POST /demo/lead (the /demo name + phone form) has no cap on purpose: no AI
  // cost behind it, and a per-IP cap locked out visitors on shared networks.
  /** Rate-limit window in seconds (one day). */
  windowSeconds: 86400,
  /** User messages per chat session; hitting it triggers the closing CTA. */
  messagesPerSession: 8,
  /** Pages Firecrawl may fetch per domain. */
  crawlPageCap: 8,
  /** Days a crawled company profile stays cached per domain. */
  profileCacheDays: 7,
  /** Bedrock max output tokens per chat turn. */
  chatMaxTokens: 1024,
  /** Bedrock max output tokens for extraction / ICP / prospect calls. */
  pipelineMaxTokens: 4096,
  // ---- /quote_demo (catalogue → chat → quote → supplier price request) ----
  /** Catalogue parses (PDF/text → Bedrock) per IP per window. */
  catalogPerIp: 20,
  /** Quote generations per IP per window. */
  quotePerIp: 60,
  /** Supplier price-request emails per IP per window. The page emails any
   * address typed into it, so this is the spam-relay cap. */
  priceRequestPerIp: 10,
  /** User messages per quote-demo chat session. */
  quoteChatMessages: 20,
  /** Items kept from one parsed catalogue. Bounds Bedrock output time too. */
  catalogMaxItems: 120,
  /** Bedrock max output tokens for a catalogue parse. */
  catalogMaxTokens: 8000,
  /** Bedrock's document-block limit is 4.5 MB; stay under it. */
  catalogPdfMaxBytes: 4 * 1024 * 1024,
  catalogTextMaxChars: 200_000,
  /** Demo cadence: a reminder every 3 minutes, at most 5. */
  priceReminderEveryMs: 3 * 60 * 1000,
  priceReminderMax: 5,
} as const;
