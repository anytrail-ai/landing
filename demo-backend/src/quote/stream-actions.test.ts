import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../api/rate-limit', () => ({
  RateLimitedError: class extends Error {},
  assertWithinRateLimit: vi.fn(async () => {}),
}));
vi.mock('./store', () => ({
  getSession: vi.fn(async () => ({ catalogId: 'c1' })),
  getCatalog: vi.fn(async () => ({ catalogId: 'c1', supplier: 'S', supplierEmail: null, currency: 'MXN', items: [] })),
  saveCatalog: vi.fn(),
  createSession: vi.fn(),
}));
vi.mock('./agent', () => ({ QUOTE_MARKER: '[[COTIZAR]]', runQuoteChatTurn: vi.fn(async () => 'ok [[COTIZAR]]') }));

import { RateLimitedError, assertWithinRateLimit } from '../api/rate-limit';
import { runQuoteChatTurn } from './agent';
import { handleQuoteAction, quoteBodySchema } from './stream-actions';

describe('quoteBodySchema', () => {
  it('requires exactly one catalogue source for catalog', () => {
    expect(quoteBodySchema.safeParse({ action: 'catalog' }).success).toBe(false);
    expect(quoteBodySchema.safeParse({ action: 'catalog', sample: true }).success).toBe(true);
    expect(quoteBodySchema.safeParse({ action: 'catalog', text: 'x', pdfBase64: 'eA==' }).success).toBe(false);
  });
});

describe('handleQuoteAction quote_chat', () => {
  const msgs = (n: number) =>
    Array.from({ length: n * 2 - 1 }, (_, i) => ({ role: i % 2 ? 'assistant' : 'user', text: `m${i}` }));

  beforeEach(() => {
    // Call history only — the mocks' default implementations (set in vi.mock
    // above) survive a clear, so this just isolates each test's assertions.
    vi.clearAllMocks();
  });

  it('reports ready when the reply carries the marker', async () => {
    const events: Array<[string, unknown]> = [];
    await handleQuoteAction(
      quoteBodySchema.parse({ action: 'quote_chat', sessionId: 's', messages: msgs(1) }),
      '1.1.1.1',
      (e, d) => events.push([e, d]),
    );
    expect(events.at(-1)).toEqual(['done', { ready: true, ended: false }]);
    expect(assertWithinRateLimit).toHaveBeenCalledWith(
      '1.1.1.1',
      expect.any(Number),
      expect.objectContaining({ bucket: 'qchat' }),
    );
  });

  it('stops calling the model past the per-session cap', async () => {
    const events: Array<[string, unknown]> = [];
    await handleQuoteAction(
      quoteBodySchema.parse({ action: 'quote_chat', sessionId: 's', messages: msgs(21) }),
      '1.1.1.1',
      (e, d) => events.push([e, d]),
    );
    expect(events.at(-1)).toEqual(['done', { ready: true, ended: true }]);
  });

  it('rejects with rate_limited when the per-IP quote_chat bucket is full, without calling the model', async () => {
    vi.mocked(assertWithinRateLimit).mockRejectedValueOnce(new RateLimitedError());
    const events: Array<[string, unknown]> = [];
    await handleQuoteAction(
      quoteBodySchema.parse({ action: 'quote_chat', sessionId: 's', messages: msgs(1) }),
      '1.1.1.1',
      (e, d) => events.push([e, d]),
    );
    expect(events.at(-1)).toEqual(['error', { error: 'rate_limited' }]);
    expect(runQuoteChatTurn).not.toHaveBeenCalled();
  });
});
