import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { z } from 'zod';
import { TABLE_NAME, docClient, keys } from '../db';
import { LIMITS } from '../limits';
import { converseJson } from '../bedrock';
import { type CompanyProfile, renderProfile } from './profile';

// A simulated rep-workqueue card. Everything customer-facing is generated in
// the site's own language over the site's real products — the board is the
// demo's pitch ("the moat is the rep tools"), so plausibility is the product.
const boardCardSchema = z.object({
  customerName: z.string(),
  company: z.string().nullish(),
  lastMessage: z.string(),
  // Hours since the last customer message. Revive cards use big values
  // (months); the UI humanizes to "3h" / "2d" / "4mo".
  waitingHours: z.number().nonnegative(),
  severity: z.enum(['high', 'medium', 'low']).default('medium'),
  productName: z.string().nullish(),
  amount: z.string().nullish(),
  reason: z.string().nullish(),
  conversation: z
    .array(z.object({ from: z.enum(['customer', 'rep']), text: z.string() }))
    .default([]),
  suggestedReply: z.string().nullish(),
  quote: z
    .object({
      items: z.array(
        z.object({ name: z.string(), qty: z.number(), unitPrice: z.string() }),
      ),
      total: z.string(),
      note: z.string().nullish(),
    })
    .nullish(),
  delivery: z.object({ carrier: z.string(), eta: z.string() }).nullish(),
});

export const boardSchema = z.object({
  buckets: z.object({
    atRisk: z.array(boardCardSchema),
    intent: z.array(boardCardSchema),
    followUp: z.array(boardCardSchema),
    revive: z.array(boardCardSchema),
  }),
});

export type DemoBoard = z.infer<typeof boardSchema>;

const BOARD_SYSTEM = `You simulate the Monday-morning work queue of a WhatsApp-first CRM for the sales reps of ONE specific company. You are given that company's real profile (products, prices, tone, language). Invent realistic OPEN conversations with customers of that company and sort them into four buckets. Answer with a single JSON object matching:
{"buckets": {
  "atRisk":  BoardCard[]  (3 cards — deals that will die without action: promised quote never sent, competitor mentioned, customer went quiet after a price objection),
  "intent":  BoardCard[]  (3 cards — hot buying signals: asking for prices, quantities, delivery, "how do I pay"),
  "followUp":BoardCard[]  (2 cards — the rep owes a reply or promised to get back with info),
  "revive":  BoardCard[]  (2 cards — quotes that went cold 2-6 months ago, worth waking up)
}}
BoardCard = {"customerName": string (a realistic full person name for this market), "company": string|null (their business, plausible buyer for the profiled company), "lastMessage": string (their last WhatsApp message, casual, typos welcome), "waitingHours": number (atRisk 24-96, intent 1-8, followUp 12-48, revive 1500-4500), "severity": "high"|"medium"|"low", "productName": string|null (a REAL product from the profile), "amount": string|null (deal value with currency symbol, consistent with the profile's real prices), "reason": string (one short line: why this card is in this bucket), "conversation": [{"from":"customer"|"rep","text":string}] (4-6 messages, WhatsApp register, ending on the customer's lastMessage), "suggestedReply": string (the reply a great rep would send now), "quote": {"items":[{"name":string,"qty":number,"unitPrice":string}],"total":string,"note":string|null} | null (REQUIRED on at least 2 intent cards, built from real products/prices; null elsewhere), "delivery": {"carrier":string,"eta":string} | null (on 2-3 cards total: a plausible local carrier and an eta like "2-3 días hábiles", localized)}
Rules: every customer-facing string (messages, reasons, replies, notes, etas) MUST be in the site's language. Use the profile's real product names and prices; if the site shows no prices, invent consistent plausible ones. Vary severity and personalities. No commentary outside the JSON.`;

export async function generateBoard(profile: CompanyProfile): Promise<DemoBoard> {
  const raw = await converseJson(
    BOARD_SYSTEM,
    renderProfile(profile),
    LIMITS.boardMaxTokens,
  );
  return boardSchema.parse(raw);
}

// Same per-domain cache discipline as the profile (one generation per domain,
// TTL'd) — a booth re-run on the same prospect must not pay 30s twice.
export async function getCachedBoard(domain: string): Promise<DemoBoard | null> {
  const res = await docClient().send(
    new GetCommand({ TableName: TABLE_NAME, Key: keys.profile(domain + '#board#v1') }),
  );
  if (!res.Item?.board) return null;
  const parsed = boardSchema.safeParse(res.Item.board);
  return parsed.success ? parsed.data : null;
}

export async function cacheBoard(domain: string, board: DemoBoard): Promise<void> {
  await docClient().send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        ...keys.profile(domain + '#board#v1'),
        board,
        createdAt: new Date().toISOString(),
        expiresAt: Math.floor(Date.now() / 1000) + LIMITS.profileCacheDays * 86400,
      },
    }),
  );
}
