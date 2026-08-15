import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from 'aws-lambda';
import { LIMITS } from '../limits';
import { startDemo, startSchema } from './start';
import { RateLimitedError, assertWithinRateLimit } from './rate-limit';
import { UnknownSessionError, extractForSession } from './extract';
import { prospectsForSession } from './prospects';
import {
  book,
  bookSchema,
  cancel,
  cancelSchema,
  move,
  moveSchema,
  openSlots,
  view,
} from './schedule';

// JSON API for /demo/*. Routes fill in as the pipeline lands:
//   POST /demo/start     — lead capture + extraction kickoff (ANY-113/114)
//   POST /demo/prospects — ICP + Apollo leads (ANY-115)
//   GET  /schedule/slots — open call slots (ANY-66)
//   GET  /schedule/manage, POST /schedule/book|cancel|move — booking lifecycle (ANY-66)
export async function handler(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  const route = `${event.requestContext.http.method} ${event.rawPath}`;

  try {
    let res: APIGatewayProxyResultV2;
    if (route === 'GET /demo/health') res = json(200, { ok: true });
    else if (route === 'POST /demo/start') res = await handleStart(event);
    else if (route === 'POST /demo/extract') res = await handleExtract(event);
    else if (route === 'POST /demo/prospects') res = await handleProspects(event);
    else if (route === 'GET /schedule/slots') res = await handleSlots(event);
    else if (route === 'POST /schedule/book') res = await handleBook(event);
    else if (route === 'GET /schedule/manage') res = await handleManage(event);
    else if (route === 'POST /schedule/cancel') res = await handleCancel(event);
    else if (route === 'POST /schedule/move') res = await handleMove(event);
    else res = json(404, { error: 'not_found' });
    const status = typeof res === 'object' && 'statusCode' in res ? res.statusCode : 200;
    if (status !== 200) {
      console.log('request_rejected', {
        route,
        status,
        body: (event.body ?? '').slice(0, 300),
        ip: event.requestContext.http.sourceIp,
      });
    }
    return res;
  } catch (err) {
    console.error('unhandled', { route, error: err });
    return json(500, { error: 'internal' });
  }
}

async function handleStart(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  const parsed = startSchema.safeParse(parseBody(event));
  if (!parsed.success) {
    return json(422, { error: 'invalid_input', issues: parsed.error.issues });
  }
  const ip = event.requestContext.http.sourceIp ?? 'unknown';
  try {
    await assertWithinRateLimit(ip);
    const result = await startDemo(parsed.data, ip);
    return json(200, result);
  } catch (err) {
    if (err instanceof RateLimitedError) return json(429, { error: 'rate_limited' });
    const msg = (err as Error).message;
    if (msg === 'blocked_host' || msg === 'invalid_domain') {
      return json(422, { error: 'invalid_website' });
    }
    throw err;
  }
}

async function handleExtract(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  const body = parseBody(event) as { sessionId?: string };
  if (typeof body.sessionId !== 'string' || !body.sessionId) {
    return json(422, { error: 'invalid_input' });
  }
  try {
    const profile = await extractForSession(body.sessionId);
    return json(200, { profile });
  } catch (err) {
    if (err instanceof UnknownSessionError) return json(404, { error: 'unknown_session' });
    const msg = (err as Error).message;
    if (msg === 'crawl_empty' || msg.startsWith('firecrawl_')) {
      return json(422, { error: 'site_unreadable' });
    }
    throw err;
  }
}

async function handleProspects(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  const body = parseBody(event) as { sessionId?: string };
  if (typeof body.sessionId !== 'string' || !body.sessionId) {
    return json(422, { error: 'invalid_input' });
  }
  try {
    return json(200, await prospectsForSession(body.sessionId));
  } catch (err) {
    if (err instanceof UnknownSessionError) return json(404, { error: 'unknown_session' });
    const msg = (err as Error).message;
    if (msg === 'not_profiled') return json(409, { error: 'not_profiled' });
    if (msg.startsWith('apollo_')) return json(502, { error: 'lead_search_failed' });
    throw err;
  }
}

// Every scheduling route shares one cap, separate from demo-start's: /schedule/slots
// fires on every page load of the scheduling UI, and sharing demo-start's counter
// would let ordinary browsing drain a visitor's ability to submit the lead form.
function assertWithinScheduleRateLimit(ip: string): Promise<void> {
  return assertWithinRateLimit(ip, Date.now(), { bucket: 'schedule', cap: LIMITS.schedulePerIp });
}

async function handleSlots(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  const ip = event.requestContext.http.sourceIp ?? 'unknown';
  try {
    await assertWithinScheduleRateLimit(ip);
    return json(200, { slots: await openSlots(Date.now()) });
  } catch (err) {
    return scheduleError(err);
  }
}

// POST /schedule/book gets its own much smaller bucket, separate from the
// other four schedule routes' shared 300/day: emails are unverified, so a
// single IP with throwaway addresses could otherwise burn every slot in the
// ~224-slot calendar well under the general cap, firing a Resend send and a
// Slack ping for each one.
function assertWithinBookRateLimit(ip: string): Promise<void> {
  return assertWithinRateLimit(ip, Date.now(), { bucket: 'book', cap: LIMITS.bookPerIp });
}

async function handleBook(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  const parsed = bookSchema.safeParse(parseBody(event));
  if (!parsed.success) {
    return json(422, { error: 'invalid_input', issues: parsed.error.issues });
  }
  const ip = event.requestContext.http.sourceIp ?? 'unknown';
  try {
    await assertWithinBookRateLimit(ip);
    return json(200, await book(parsed.data, ip));
  } catch (err) {
    return scheduleError(err);
  }
}

async function handleManage(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  const { b, s } = event.queryStringParameters ?? {};
  if (!b || !s) return json(422, { error: 'invalid_input' });
  const ip = event.requestContext.http.sourceIp ?? 'unknown';
  try {
    await assertWithinScheduleRateLimit(ip);
    const booking = await view(b, s);
    // Never echo the IP or the note back to the browser.
    return json(200, {
      slotStartUtc: booking.slotStartUtc,
      name: booking.name,
      lang: booking.lang,
    });
  } catch (err) {
    return scheduleError(err);
  }
}

async function handleCancel(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  const parsed = cancelSchema.safeParse(parseBody(event));
  if (!parsed.success) {
    return json(422, { error: 'invalid_input', issues: parsed.error.issues });
  }
  const ip = event.requestContext.http.sourceIp ?? 'unknown';
  try {
    await assertWithinScheduleRateLimit(ip);
    await cancel(parsed.data.slotStartUtc, parsed.data.sig);
    return json(200, { ok: true });
  } catch (err) {
    return scheduleError(err);
  }
}

async function handleMove(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  const parsed = moveSchema.safeParse(parseBody(event));
  if (!parsed.success) {
    return json(422, { error: 'invalid_input', issues: parsed.error.issues });
  }
  const ip = event.requestContext.http.sourceIp ?? 'unknown';
  try {
    await assertWithinScheduleRateLimit(ip);
    return json(
      200,
      await move(parsed.data.slotStartUtc, parsed.data.sig, parsed.data.toSlotStartUtc),
    );
  } catch (err) {
    return scheduleError(err);
  }
}

// 409 means "pick another slot", 403 means "that link is not yours". Exported
// for a table-driven test over the full error-name -> status contract.
export function scheduleError(err: unknown): APIGatewayProxyResultV2 {
  const name = (err as Error).name;
  if (name === 'InvalidWebsiteError') return json(422, { error: 'invalid_website' });
  if (name === 'RateLimitedError') return json(429, { error: 'rate_limited' });
  if (name === 'SlotTakenError' || name === 'SlotUnavailableError') {
    return json(409, { error: 'slot_taken' });
  }
  if (name === 'AlreadyBookedError') return json(409, { error: 'already_booked' });
  if (name === 'InvalidSignatureError') return json(403, { error: 'invalid_link' });
  if (name === 'UnknownBookingError') return json(404, { error: 'unknown_booking' });
  // Anything else (a malformed stored row, a null deref, an AWS SDK error) is
  // a real defect, not caller input — let it reach the handler's catch-all
  // so it logs as `unhandled` and 500s, instead of masquerading as a 4xx.
  throw err;
}

function parseBody(event: APIGatewayProxyEventV2): unknown {
  if (!event.body) return {};
  try {
    const raw = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64').toString('utf8')
      : event.body;
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function json(statusCode: number, body: unknown): APIGatewayProxyResultV2 {
  return {
    statusCode,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  };
}
