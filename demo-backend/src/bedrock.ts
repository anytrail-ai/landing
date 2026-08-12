import {
  BedrockRuntimeClient,
  ConverseCommand,
  type Message,
} from '@aws-sdk/client-bedrock-runtime';

export const MODEL_ID =
  process.env.BEDROCK_MODEL_ID ?? 'us.anthropic.claude-sonnet-4-6';

let client: BedrockRuntimeClient | undefined;

export function bedrock(): BedrockRuntimeClient {
  client ??= new BedrockRuntimeClient({});
  return client;
}

export function setBedrockForTests(c: BedrockRuntimeClient | undefined): void {
  client = c;
}

// One-shot JSON completion: prompt in, schema-shaped object out. The schema is
// enforced by instruction + parse, not by the API — callers validate with zod.
// (Claude 4.6+ on Bedrock rejects assistant prefill, so parsing has to be
// tolerant instead: strip code fences, take first "{" to last "}".) One retry.
export function extractJson(text: string): unknown {
  const cleaned = text.replace(/```(?:json)?/g, '');
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end <= start) throw new Error('bedrock_no_json');
  return JSON.parse(cleaned.slice(start, end + 1));
}

export async function converseJson(
  system: string,
  user: string,
  maxTokens: number,
): Promise<unknown> {
  const messages: Message[] = [{ role: 'user', content: [{ text: user }] }];
  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await bedrock().send(
      new ConverseCommand({
        modelId: MODEL_ID,
        system: [{ text: system }],
        messages,
        inferenceConfig: { maxTokens },
      }),
    );
    const text =
      res.output?.message?.content?.find((b) => 'text' in b)?.text ?? '';
    try {
      return extractJson(text);
    } catch (err) {
      lastError = err;
      console.warn('converse_json_retry', {
        attempt,
        stopReason: res.stopReason,
        head: text.slice(0, 200),
      });
    }
  }
  throw lastError instanceof Error ? lastError : new Error('bedrock_no_json');
}
