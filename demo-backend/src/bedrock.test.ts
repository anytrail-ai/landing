import type { BedrockRuntimeClient } from '@aws-sdk/client-bedrock-runtime';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { converseJsonContent, setBedrockForTests } from './bedrock';

function fakeClient(send: (cmd: unknown) => Promise<unknown>): BedrockRuntimeClient {
  return { send } as unknown as BedrockRuntimeClient;
}

afterEach(() => {
  setBedrockForTests(undefined);
});

describe('converseJsonContent', () => {
  it('parses well-formed JSON in one call', async () => {
    const send = vi.fn().mockResolvedValue({
      stopReason: 'end_turn',
      output: { message: { content: [{ text: '{"ok":true}' }] } },
    });
    setBedrockForTests(fakeClient(send));
    await expect(converseJsonContent('sys', [{ text: 'hi' }], 100)).resolves.toEqual({ ok: true });
    expect(send).toHaveBeenCalledTimes(1);
  });

  it('retries once on malformed JSON, then succeeds', async () => {
    const send = vi
      .fn()
      .mockResolvedValueOnce({ stopReason: 'end_turn', output: { message: { content: [{ text: 'not json' }] } } })
      .mockResolvedValueOnce({ stopReason: 'end_turn', output: { message: { content: [{ text: '{"ok":true}' }] } } });
    setBedrockForTests(fakeClient(send));
    await expect(converseJsonContent('sys', [{ text: 'hi' }], 100)).resolves.toEqual({ ok: true });
    expect(send).toHaveBeenCalledTimes(2);
  });

  it('does NOT retry a max_tokens (truncated) response — a retry of a truncated call is doomed (F3)', async () => {
    const send = vi.fn().mockResolvedValue({
      stopReason: 'max_tokens',
      output: { message: { content: [{ text: '{"items": [truncated...' }] } },
    });
    setBedrockForTests(fakeClient(send));
    await expect(converseJsonContent('sys', [{ text: 'hi' }], 100)).rejects.toThrow('bedrock_truncated');
    expect(send).toHaveBeenCalledTimes(1);
  });
});
