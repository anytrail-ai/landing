import { ConverseStreamCommand, type ContentBlock, type Message } from '@aws-sdk/client-bedrock-runtime';
import { MODEL_ID, bedrock } from '../bedrock';
import { LIMITS } from '../limits';
import { SYSTEM_PROMPT } from './prompt';
import { TOOLS, runTool } from './tools';
import type { CeldasSession } from './types';

type Emit = (event: string, data: unknown) => void;

/** Accumulates one streamed assistant message back into Converse content
 * blocks, so the turn can be replayed exactly (reasoning text + signature,
 * redacted reasoning, text, tool calls) on the next call. */
export class MessageBuilder {
  private blocks = new Map<number, { kind: 'reasoning' | 'redacted' | 'text' | 'tool'; text: string; signature?: string; redacted?: Uint8Array; toolUseId?: string; name?: string }>();

  start(index: number, start: { toolUse?: { toolUseId?: string; name?: string } } | undefined): void {
    if (start?.toolUse) this.blocks.set(index, { kind: 'tool', text: '', toolUseId: start.toolUse.toolUseId, name: start.toolUse.name });
  }

  delta(
    index: number,
    delta: { text?: string; toolUse?: { input?: string }; reasoningContent?: { text?: string; signature?: string; redactedContent?: Uint8Array } },
  ): void {
    if (delta.text !== undefined) {
      const b = this.blocks.get(index) ?? { kind: 'text' as const, text: '' };
      b.text += delta.text;
      this.blocks.set(index, b);
    } else if (delta.toolUse) {
      const b = this.blocks.get(index);
      if (b) b.text += delta.toolUse.input ?? '';
    } else if (delta.reasoningContent) {
      const r = delta.reasoningContent;
      const b = this.blocks.get(index) ?? { kind: r.redactedContent ? ('redacted' as const) : ('reasoning' as const), text: '' };
      if (r.text) b.text += r.text;
      if (r.signature) b.signature = (b.signature ?? '') + r.signature;
      if (r.redactedContent) b.redacted = r.redactedContent;
      this.blocks.set(index, b);
    }
  }

  /** Content blocks in stream order. A tool input that is not valid JSON
   * (truncated at max_tokens) becomes {} and is rejected by the tool's zod
   * schema, which the model then sees as an error and retries. */
  content(): ContentBlock[] {
    return [...this.blocks.entries()]
      .sort(([a], [b]) => a - b)
      .map(([, b]): ContentBlock | null => {
        if (b.kind === 'reasoning') return { reasoningContent: { reasoningText: { text: b.text, signature: b.signature } } };
        if (b.kind === 'redacted') return { reasoningContent: { redactedContent: b.redacted! } };
        if (b.kind === 'tool') {
          let input: unknown = {};
          try {
            input = b.text ? JSON.parse(b.text) : {};
          } catch {
            input = {};
          }
          return { toolUse: { toolUseId: b.toolUseId, name: b.name, input: input as never } };
        }
        return b.text ? { text: b.text } : null;
      })
      .filter((b): b is ContentBlock => b !== null);
  }
}

/** Runs one turn (a customer message or a follow-up event): appends it, loops model ↔ tools until
 * the model ends its turn, streaming reasoning, text and tool events. The
 * caller persists `session` afterwards; it is mutated in place. */
export async function runCeldasTurn(session: CeldasSession, text: string, ip: string, emit: Emit): Promise<void> {
  session.messages.push({ role: 'user', content: [{ text }] });
  let wroteText = false;
  let textKey = '';

  for (let call = 0; call < LIMITS.celdasModelCallsPerTurn; call++) {
    const res = await bedrock().send(
      new ConverseStreamCommand({
        modelId: MODEL_ID,
        system: [{ text: SYSTEM_PROMPT }, { cachePoint: { type: 'default' } }],
        messages: session.messages,
        toolConfig: { tools: TOOLS },
        inferenceConfig: { maxTokens: LIMITS.celdasMaxTokens },
        // Sonnet 4.6: adaptive thinking, interleaved between tool calls,
        // returned summarized so the page can show it.
        additionalModelRequestFields: { thinking: { type: 'adaptive' }, output_config: { effort: 'medium' } },
      }),
    );

    const builder = new MessageBuilder();
    let stopReason: string | undefined;
    let thinkingOpen = false;
    for await (const ev of res.stream ?? []) {
      if (ev.contentBlockStart) {
        builder.start(ev.contentBlockStart.contentBlockIndex ?? 0, ev.contentBlockStart.start);
      } else if (ev.contentBlockDelta) {
        const idx = ev.contentBlockDelta.contentBlockIndex ?? 0;
        const d = (ev.contentBlockDelta.delta ?? {}) as { text?: string; reasoningContent?: { text?: string } };
        builder.delta(idx, d as never);
        if (d.reasoningContent?.text) {
          if (!thinkingOpen) emit('thinking_start', {});
          thinkingOpen = true;
          emit('thinking', { text: d.reasoningContent.text });
        } else if (d.text) {
          if (thinkingOpen) emit('thinking_end', {});
          thinkingOpen = false;
          // A new text block after a tool call is a new WhatsApp bubble.
          if (wroteText && textKey !== `${call}:${idx}`) emit('delta', { text: '\n\n' });
          textKey = `${call}:${idx}`;
          wroteText = true;
          emit('delta', { text: d.text });
        }
      } else if (ev.contentBlockStop) {
        if (thinkingOpen) emit('thinking_end', {});
        thinkingOpen = false;
      } else if (ev.messageStop) {
        stopReason = ev.messageStop.stopReason;
      }
    }

    const content = builder.content();
    const assistant: Message = { role: 'assistant', content };
    session.messages.push(assistant);

    const toolUses = content.filter((b) => b.toolUse).map((b) => b.toolUse!);
    if (stopReason !== 'tool_use' || !toolUses.length) return;

    const results: ContentBlock[] = [];
    for (const t of toolUses) {
      emit('tool', { id: t.toolUseId, name: t.name, input: t.input });
      const out = await runTool(t.name ?? '', t.input, session, ip);
      for (const e of out.events) emit(e.event, e.data);
      emit('tool_result', { id: t.toolUseId, name: t.name, ok: out.ok, label: out.label, result: out.result });
      results.push({
        toolResult: { toolUseId: t.toolUseId, content: [{ json: out.result as never }], status: out.ok ? 'success' : 'error' },
      });
    }
    session.messages.push({ role: 'user', content: results });
  }
  // Out of calls with tools still pending: close politely so the history
  // stays valid (it already ends on the tool results, a user message).
  emit('delta', { text: `${wroteText ? '\n\n' : ''}Déjeme revisarlo con un vendedor y le confirmamos en breve.` });
  session.messages.push({ role: 'assistant', content: [{ text: 'Déjeme revisarlo con un vendedor y le confirmamos en breve.' }] });
}
