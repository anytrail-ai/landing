import { z } from 'zod';
import { RateLimitedError, assertWithinRateLimit } from '../api/rate-limit';
import { LIMITS } from '../limits';
import { QUOTE_MARKER, runQuoteChatTurn } from './agent';
import { CatalogEmptyError, loadSampleCatalog, parseCatalog } from './catalog';
import { UnknownSessionError, generateQuote } from './quote';
import { createSession, getCatalog, getSession, saveCatalog } from './store';

const message = z.object({ role: z.enum(['user', 'assistant']), text: z.string().min(1).max(4000) });

// zod 3's discriminatedUnion only accepts plain objects, so the catalogue
// source rule is a superRefine on the whole union, not a .refine on its member.
export const quoteBodySchema = z
  .discriminatedUnion('action', [
    z.object({
      action: z.literal('catalog'),
      sample: z.boolean().optional(),
      text: z.string().max(LIMITS.catalogTextMaxChars).optional(),
      // base64 of ≤ 4 MB is ≤ ~5.6 MB of text.
      pdfBase64: z.string().max(Math.ceil((LIMITS.catalogPdfMaxBytes * 4) / 3) + 8).optional(),
    }),
    z.object({ action: z.literal('quote_chat'), sessionId: z.string().min(1).max(64), messages: z.array(message).min(1).max(60) }),
    z.object({ action: z.literal('quote'), sessionId: z.string().min(1).max(64), messages: z.array(message).min(1).max(60) }),
  ])
  .superRefine((b, ctx) => {
    if (b.action !== 'catalog') return;
    const sources = [b.sample === true, Boolean(b.text?.trim()), Boolean(b.pdfBase64)].filter(Boolean).length;
    if (sources !== 1) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'exactly one of sample, text, pdfBase64' });
  });
export type QuoteBody = z.infer<typeof quoteBodySchema>;

type Emit = (event: string, data: unknown) => void;

export async function handleQuoteAction(body: QuoteBody, ip: string, emit: Emit): Promise<void> {
  try {
    if (body.action === 'catalog') {
      if (!body.sample) await assertWithinRateLimit(ip, Date.now(), { bucket: 'qcat', cap: LIMITS.catalogPerIp });
      emit('step', { step: body.sample ? 'Cargando catálogo de ejemplo…' : 'Leyendo el catálogo…' });
      const parsed = body.sample
        ? loadSampleCatalog()
        : await parseCatalog({ pdfBase64: body.pdfBase64, text: body.text });
      const catalog = await saveCatalog(parsed);
      const sessionId = await createSession(catalog.catalogId);
      const { catalogId: _id, ...view } = catalog;
      emit('catalog', { sessionId, catalog: view });
      emit('done', {});
      return;
    }

    if (body.action === 'quote_chat') {
      const session = await getSession(body.sessionId);
      const catalog = session ? await getCatalog(session.catalogId) : null;
      if (!catalog) return emit('error', { error: 'unknown_session' });
      const userCount = body.messages.filter((m) => m.role === 'user').length;
      if (userCount > LIMITS.quoteChatMessages) {
        emit('delta', { text: 'Con esto tengo lo necesario. Te preparo la cotización.' });
        return emit('done', { ready: true, ended: true });
      }
      const reply = await runQuoteChatTurn(catalog, body.messages, (text) => emit('delta', { text }));
      console.log('quote_chat_turn', JSON.stringify({ sessionId: body.sessionId, turn: userCount, reply: reply.slice(0, 1000) }));
      return emit('done', { ready: reply.includes(QUOTE_MARKER), ended: false });
    }

    await assertWithinRateLimit(ip, Date.now(), { bucket: 'quote', cap: LIMITS.quotePerIp });
    const result = await generateQuote(body.sessionId, body.messages, (step) => emit('step', { step }));
    emit('quote', result);
    emit('done', {});
  } catch (err) {
    emit('error', { error: errorCode(body.action, err) });
  }
}

function errorCode(action: QuoteBody['action'], err: unknown): string {
  if (err instanceof RateLimitedError) return 'rate_limited';
  if (err instanceof UnknownSessionError) return 'unknown_session';
  if (err instanceof CatalogEmptyError) return 'catalog_unreadable';
  const msg = (err as Error)?.message ?? '';
  if (msg === 'catalog_too_large') return 'catalog_too_large';
  console.error('quote_action_failed', action, err);
  if (action === 'catalog') return 'catalog_unreadable';
  return action === 'quote' ? 'quote_failed' : 'chat_failed';
}
