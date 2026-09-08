import { randomUUID } from 'node:crypto';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { z } from 'zod';
import { TABLE_NAME, docClient, keys } from '../db';
import { postSlackMessage } from '../notify';

// The /demo page: a visitor leaves a name and phone number, then continues
// on WhatsApp with the live agent. This is the record-keeping half — the row
// in DynamoDB is the ledger, the Slack ping is how the team sees it land, and
// the CloudWatch line is the fallback if either of those is down.

export const leadSchema = z.object({
  name: z.string().trim().min(1).max(200),
  phone: z.string().trim().min(1).max(40),
  // Language of the page the form was on (/demo → en, /es/demo → es).
  lang: z.enum(['en', 'es']).default('en'),
});

export type LeadInput = z.infer<typeof leadSchema>;

export class InvalidPhoneError extends Error {
  constructor() {
    super('invalid_phone');
    this.name = 'InvalidPhoneError';
  }
}

// E.164 allows at most 15 digits; 8 is a lenient floor for a local number.
const MIN_DIGITS = 8;
const MAX_DIGITS = 15;

// "+52 1 81 2764 8080" → "+5218127648080"; "(81) 2764-8080" → "8127648080".
// Keeps the leading plus (it carries the country-code intent) and nothing else
// that is not a digit. Returns null when the result cannot be a phone number.
export function normalizePhone(raw: string): string | null {
  const trimmed = raw.trim();
  const digits = trimmed.replace(/[^0-9]/g, '');
  if (digits.length < MIN_DIGITS || digits.length > MAX_DIGITS) return null;
  return trimmed.startsWith('+') ? `+${digits}` : digits;
}

export interface LeadResult {
  id: string;
}

export async function captureLead(input: LeadInput, ip: string): Promise<LeadResult> {
  const phone = normalizePhone(input.phone);
  if (!phone) throw new InvalidPhoneError();

  const id = randomUUID();
  const createdAt = new Date().toISOString();
  await docClient().send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        ...keys.whatsappLead(id),
        id,
        name: input.name,
        phone,
        phoneRaw: input.phone,
        lang: input.lang,
        ip,
        source: 'demo',
        createdAt,
      },
    }),
  );

  // Filter CloudWatch on "demo_lead" to list every capture.
  console.log('demo_lead', JSON.stringify({ id, name: input.name, phone, lang: input.lang, createdAt }));

  // Awaited (Lambda freezes after the response) but never throws.
  await postSlackMessage(
    `📱 Demo lead → WhatsApp: ${input.name} — ${phone} (${input.lang})`,
  );

  return { id };
}
