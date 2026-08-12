import {
  ConverseStreamCommand,
  type Message,
} from '@aws-sdk/client-bedrock-runtime';
import { MODEL_ID, bedrock } from '../bedrock';
import { LIMITS } from '../limits';
import { renderProfile, type CompanyProfile } from '../pipeline/profile';

// Simplified port of sales-agent-playground's buildSystemText: base salesman
// prompt + persona derived from the profile + the profile block behind its
// injection boundary.
export function buildSystemText(profile: CompanyProfile, visitorName: string): string {
  return [
    `You are the top salesperson for ${profile.companyName}. You are chatting with ${visitorName}, a potential customer, on the company website. Sell the company's products and services: answer questions accurately from the company data below, surface relevant products, handle objections, and move toward a next step. If asked something the data does not cover, say you'll check and steer back to what you know. Never invent products or prices.`,
    `This is a live demo of an AI sales agent, so the sale cannot actually complete: never collect contact details (location, phone, email) and never promise follow-ups, callbacks, or dealer handoffs. The moment the visitor agrees to a next step (a quote, a call, a purchase, "sure", "yes let's do it"), the demo has succeeded — end the roleplay: congratulate them briefly, then say in their language: "${CTA_TEXT}"`,
    `Respond in English by default. If the visitor writes in another language, switch to and stay in that language. (The company's website is in: ${profile.language}.)`,
    // Register + cadence ported from sales-agent-playground's proven
    // 'direct-closer' tone (src/config/tone.ts) — tested in production there.
    `Qualify before you recommend: a real salesperson diagnoses first. Ask one qualifying question at a time — use case, volume, constraints — and only name a specific product once the answers point to it.${profile.qualifyingQuestions?.length ? ` Qualifying questions for this company: ${profile.qualifyingQuestions.join(' | ')}` : ''}`,
    'Talk like a working salesperson, not a support bot. Lead with the answer. Do not open with filler ("con gusto", "claro que sí", "espero que estés bien"), do not restate the customer\'s question back to them, and do not summarize what you just said. Address the customer informally. Every message either gives a concrete fact or price, or asks one question that moves toward the sale. End every turn with one clear next step.',
    'Send 1-2 short messages, at most two sentences each. Only send a third if you are sending a link plus its context. Separate each message with a blank line. No greeting or sign-off.',
    `Match this tone: ${profile.toneHints}.`,
    renderProfile(profile),
    'When you recommend or discuss a specific product, refer to it by its exact name as written in the company data (including any model code) — the interface shows the visitor a product card with its photo when you do. Do not use emojis.',
  ].join('\n\n');
}

export const CTA_TEXT =
  'This whole conversation was handled by an AI sales agent built on your website in under a minute — imagine it working your real leads 24/7. Book a call with Anytrail: https://anytrail.ai';

export function buildClosingInstruction(): string {
  return `The demo conversation is ending. In the visitor's language: wrap up warmly in one or two sentences, then deliver this message: "${CTA_TEXT}"`;
}

export interface ChatTurnInput {
  profile: CompanyProfile;
  visitorName: string;
  // Prior conversation, client-held; the Lambda is stateless per turn.
  messages: Array<{ role: 'user' | 'assistant'; text: string }>;
  // Number of user messages including this turn; at the cap the CTA fires.
  closing: boolean;
}

// Streams assistant text deltas via onDelta; returns the full reply.
export async function runChatTurn(
  input: ChatTurnInput,
  onDelta: (text: string) => void,
): Promise<string> {
  const system = input.closing
    ? `${buildSystemText(input.profile, input.visitorName)}\n\n${buildClosingInstruction()}`
    : buildSystemText(input.profile, input.visitorName);

  const messages: Message[] = input.messages.map((m) => ({
    role: m.role,
    content: [{ text: m.text }],
  }));

  const res = await bedrock().send(
    new ConverseStreamCommand({
      modelId: MODEL_ID,
      system: [{ text: system }],
      messages,
      inferenceConfig: { maxTokens: LIMITS.chatMaxTokens },
    }),
  );

  let full = '';
  for await (const event of res.stream ?? []) {
    const delta = event.contentBlockDelta?.delta;
    if (delta && 'text' in delta && delta.text) {
      full += delta.text;
      onDelta(delta.text);
    }
  }
  return full;
}
