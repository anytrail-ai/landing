import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { z } from 'zod';
import { TABLE_NAME, docClient, keys } from '../db';
import { getSecret } from '../secrets';
import { UnknownSessionError } from './extract';

// WhatsApp Cloud API wiring for the booth demo. Flow: the visitor scans a QR
// (wa.me link whose prefilled text carries a short session code), their inbound
// message hits /demo/wa/webhook, we bind their wa_id to the demo session, and
// the follow-up they "schedule" in the board UI becomes a real free-form send —
// legal because their own message opened the 24h customer-service window.

const waConfigSchema = z.object({
  /** Cloud API permanent access token (system user). */
  token: z.string().min(1),
  /** The phone-number id the sends go out from. */
  phoneNumberId: z.string().min(1),
  /** Display number in wa.me digits form, e.g. "5215512345678". */
  waNumber: z.string().regex(/^\d{8,15}$/),
  /** Webhook verification token (any string, echoed at Meta app setup). */
  verifyToken: z.string().min(1),
  /** Meta app secret for X-Hub-Signature-256; empty string skips verification. */
  appSecret: z.string().default(''),
});

export type WaConfig = z.infer<typeof waConfigSchema>;

export async function waConfig(): Promise<WaConfig> {
  return waConfigSchema.parse(JSON.parse(await getSecret('WHATSAPP_SECRET_ARN')));
}

// No 0/O/1/I/L: the code is read off a booth screen and typed by a model regex,
// not a human, but ambiguity still costs retries when someone edits the
// prefilled text down to just the code.
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

export function newCode(): string {
  const bytes = randomBytes(6);
  let out = '';
  for (const b of bytes) out += CODE_ALPHABET[b % CODE_ALPHABET.length];
  return out;
}

/** Every code-shaped token in an inbound message. Ordinary 6-letter words
 *  ("BUENAS") match the shape too, so the caller must treat these as
 *  CANDIDATES and let the WACODE lookup decide — taking only the first match
 *  would let a greeting word shadow the real code later in the sentence. */
export function extractCodes(text: string): string[] {
  return text.toUpperCase().match(/\b[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{6}\b/g) ?? [];
}

export async function createWaLink(
  sessionId: string,
): Promise<{ number: string; code: string }> {
  const lead = await docClient().send(
    new GetCommand({ TableName: TABLE_NAME, Key: keys.lead(sessionId) }),
  );
  if (!lead.Item) throw new UnknownSessionError();
  // Reuse an unexpired code so re-renders of the QR panel don't mint orphans.
  const existing = lead.Item.waCode as string | undefined;
  const cfg = await waConfig();
  if (existing) return { number: cfg.waNumber, code: existing };

  const code = newCode();
  await docClient().send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        ...keys.waCode(code),
        sessionId,
        createdAt: new Date().toISOString(),
        expiresAt: Math.floor(Date.now() / 1000) + 86400,
      },
    }),
  );
  await docClient().send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: keys.lead(sessionId),
      UpdateExpression: 'SET waCode = :c',
      ExpressionAttributeValues: { ':c': code },
    }),
  );
  return { number: cfg.waNumber, code };
}

export interface WaStatus {
  connected: boolean;
  waName?: string;
  waText?: string;
}

export async function waStatus(sessionId: string): Promise<WaStatus> {
  const lead = await docClient().send(
    new GetCommand({ TableName: TABLE_NAME, Key: keys.lead(sessionId) }),
  );
  if (!lead.Item) throw new UnknownSessionError();
  if (!lead.Item.waId) return { connected: false };
  return {
    connected: true,
    waName: (lead.Item.waName as string) ?? undefined,
    waText: (lead.Item.waText as string) ?? undefined,
  };
}

export class WaNotConnectedError extends Error {
  constructor() {
    super('wa_not_connected');
    this.name = 'WaNotConnectedError';
  }
}

export class WaSendFailedError extends Error {
  constructor(detail: string) {
    super('wa_send_failed');
    this.name = 'WaSendFailedError';
    this.detail = detail;
  }
  detail: string;
}

export async function waSend(
  sessionId: string,
  text: string,
): Promise<{ messageId: string }> {
  const lead = await docClient().send(
    new GetCommand({ TableName: TABLE_NAME, Key: keys.lead(sessionId) }),
  );
  if (!lead.Item) throw new UnknownSessionError();
  const waId = lead.Item.waId as string | undefined;
  if (!waId) throw new WaNotConnectedError();

  const cfg = await waConfig();
  const res = await fetch(
    `https://graph.facebook.com/v21.0/${cfg.phoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        authorization: `Bearer ${cfg.token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: waId,
        type: 'text',
        text: { body: text },
      }),
    },
  );
  const data = (await res.json().catch(() => ({}))) as {
    messages?: { id: string }[];
    error?: { message?: string };
  };
  if (!res.ok || !data.messages?.[0]?.id) {
    console.error('wa_send_failed', { status: res.status, body: data });
    throw new WaSendFailedError(data.error?.message ?? `http_${res.status}`);
  }
  console.log('wa_sent', { sessionId, to: waId, messageId: data.messages[0].id });
  return { messageId: data.messages[0].id };
}

/** GET webhook verification: echo hub.challenge iff the verify token matches. */
export function verifyWebhook(
  qs: Record<string, string | undefined>,
  cfg: WaConfig,
): string | null {
  if (qs['hub.mode'] === 'subscribe' && qs['hub.verify_token'] === cfg.verifyToken) {
    return qs['hub.challenge'] ?? '';
  }
  return null;
}

export function signatureValid(rawBody: string, header: string | undefined, appSecret: string): boolean {
  if (!appSecret) return true; // verification disabled by config
  if (!header?.startsWith('sha256=')) return false;
  const expected = createHmac('sha256', appSecret).update(rawBody, 'utf8').digest('hex');
  const got = header.slice('sha256='.length);
  if (got.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(got, 'utf8'), Buffer.from(expected, 'utf8'));
}

// The slice of Meta's webhook payload the demo cares about.
const inboundSchema = z.object({
  entry: z
    .array(
      z.object({
        changes: z
          .array(
            z.object({
              value: z.object({
                contacts: z
                  .array(
                    z.object({
                      wa_id: z.string(),
                      profile: z.object({ name: z.string().nullish() }).nullish(),
                    }),
                  )
                  .nullish(),
                messages: z
                  .array(
                    z.object({
                      from: z.string(),
                      type: z.string(),
                      text: z.object({ body: z.string() }).nullish(),
                    }),
                  )
                  .nullish(),
              }),
            }),
          )
          .nullish(),
      }),
    )
    .nullish(),
});

/**
 * Inbound webhook: find text messages carrying a session code, bind the
 * sender's wa_id to that session. Everything else (statuses, media, unknown
 * codes) is acknowledged and dropped — Meta retries on non-200, so this must
 * never throw for content it merely doesn't want.
 */
export async function handleInbound(rawBody: string): Promise<void> {
  let parsed: z.infer<typeof inboundSchema>;
  try {
    parsed = inboundSchema.parse(JSON.parse(rawBody));
  } catch {
    console.warn('wa_webhook_unparsed', { head: rawBody.slice(0, 300) });
    return;
  }
  for (const entry of parsed.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const { contacts, messages } = change.value;
      for (const msg of messages ?? []) {
        if (msg.type !== 'text' || !msg.text?.body) continue;
        const candidates = extractCodes(msg.text.body);
        if (!candidates.length) {
          console.log('wa_inbound_no_code', { from: msg.from, text: msg.text.body.slice(0, 120) });
          continue;
        }
        let sessionId: string | undefined;
        let code: string | undefined;
        for (const candidate of candidates) {
          const codeRow = await docClient().send(
            new GetCommand({ TableName: TABLE_NAME, Key: keys.waCode(candidate) }),
          );
          sessionId = codeRow.Item?.sessionId as string | undefined;
          if (sessionId) {
            code = candidate;
            break;
          }
        }
        if (!sessionId) {
          console.log('wa_inbound_unknown_code', { candidates, from: msg.from });
          continue;
        }
        const profileName = contacts?.find((c) => c.wa_id === msg.from)?.profile?.name;
        await docClient().send(
          new UpdateCommand({
            TableName: TABLE_NAME,
            Key: keys.lead(sessionId),
            UpdateExpression:
              'SET waId = :id, waName = :n, waText = :t, waConnectedAt = :at',
            ExpressionAttributeValues: {
              ':id': msg.from,
              ':n': profileName ?? null,
              ':t': msg.text.body,
              ':at': new Date().toISOString(),
            },
          }),
        );
        console.log('wa_connected', { sessionId, code, from: msg.from });
      }
    }
  }
}
