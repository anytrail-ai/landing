// Every abuse/cost cap in one place (ANY-113). Change here, not inline.
export const LIMITS = {
  /** POST /demo/start requests allowed per IP per window.
   * Temporarily raised for founder testing — drop back to ~20 before real launch. */
  startPerIp: 200,
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
} as const;
