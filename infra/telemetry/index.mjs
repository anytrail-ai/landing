// Telemetry collector. Fronted by a Lambda Function URL (no API Gateway --
// fewer moving parts, native CORS, no extra cost) and writes to DynamoDB.
//
// Deliberately stores no cookies, no IP address and no raw user agent string.
// Everything here is first-party and anonymous, which is what keeps the site
// free of a consent banner.
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}))
const TABLE = process.env.TABLE_NAME
const RETENTION_DAYS = Number(process.env.RETENTION_DAYS ?? 180)

const ALLOWED_ORIGINS = new Set([
  'https://www.anytrail.ai',
  'https://anytrail.ai',
  'http://127.0.0.1:4322',
  'http://localhost:5173',
])

// Only these event names are accepted, so a stray script cannot fill the table
// with arbitrary keys.
const EVENTS = new Set([
  'pageview',
  'demo_cta_click',
  'whatsapp_cta_click',
  'scroll_depth',
  'click',
])

const str = (v, max = 200) =>
  typeof v === 'string' ? v.slice(0, max) : undefined
const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : undefined)

function cors(origin) {
  const allowed = ALLOWED_ORIGINS.has(origin) ? origin : 'https://www.anytrail.ai'
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'content-type',
    'Access-Control-Max-Age': '86400',
  }
}

export const handler = async (event) => {
  const origin = event?.headers?.origin ?? ''
  const headers = cors(origin)

  if (event?.requestContext?.http?.method === 'OPTIONS') {
    return { statusCode: 204, headers }
  }

  if (!ALLOWED_ORIGINS.has(origin)) {
    return { statusCode: 403, headers, body: 'forbidden origin' }
  }

  let payload
  try {
    const raw = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64').toString('utf8')
      : event.body
    payload = JSON.parse(raw || '{}')
  } catch {
    return { statusCode: 400, headers, body: 'bad json' }
  }

  // sendBeacon can only send one blob, so the client batches events.
  const batch = Array.isArray(payload.events) ? payload.events.slice(0, 50) : []
  const now = Date.now()
  const expires = Math.floor(now / 1000) + RETENTION_DAYS * 86400

  const writes = batch
    .filter((e) => EVENTS.has(e?.event))
    .map((e, i) => {
      const page = str(e.page, 60) ?? 'unknown'
      const iso = new Date(now).toISOString()
      return ddb.send(
        new PutCommand({
          TableName: TABLE,
          Item: {
            pk: `evt#${page}`,
            sk: `${iso}#${i}#${Math.random().toString(36).slice(2, 8)}`,
            day: iso.slice(0, 10),
            event: e.event,
            page,
            lang: str(e.lang, 5),
            session: str(e.session, 40),
            // Click position as a fraction of the full document, so a heatmap
            // renders consistently across viewport sizes.
            x: num(e.x),
            y: num(e.y),
            vw: num(e.vw),
            vh: num(e.vh),
            depth: num(e.depth),
            location: str(e.location, 40),
            ref: str(e.ref, 200),
            utm: str(e.utm, 200),
            expires,
          },
        }),
      )
    })

  try {
    await Promise.all(writes)
  } catch (err) {
    console.error('write failed', err)
    return { statusCode: 500, headers, body: 'write failed' }
  }

  return { statusCode: 204, headers }
}
