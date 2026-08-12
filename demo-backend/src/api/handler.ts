import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from 'aws-lambda';
import { startDemo, startSchema } from './start';
import { RateLimitedError, assertWithinRateLimit } from './rate-limit';
import { UnknownSessionError, extractForSession } from './extract';
import { prospectsForSession } from './prospects';

// JSON API for /demo/*. Routes fill in as the pipeline lands:
//   POST /demo/start     — lead capture + extraction kickoff (ANY-113/114)
//   POST /demo/prospects — ICP + Apollo leads (ANY-115)
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
