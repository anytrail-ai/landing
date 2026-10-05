import { ConverseStreamCommand, type ContentBlock, type Message } from '@aws-sdk/client-bedrock-runtime';
import { MODEL_ID, bedrock } from '../bedrock';
import { MessageBuilder } from '../celdas/agent';
import { LIMITS } from '../limits';
import { SYSTEM_PROMPT } from './prompt';
import { TOOLS, runTool } from './tools';
import type { GrubpakSession } from './types';

type Emit = (event: string, data: unknown) => void;

const FALLBACK = 'Déjame revisarlo con un asesor y te confirmo en un momento.';

/** One turn (a customer message or a follow-up event): model ↔ tools until
 * the model ends its turn, streaming reasoning, text and tool events. Same
 * loop as the celdas agent; `session` is mutated and persisted by the caller. */
export async function runGrubpakTurn(session: GrubpakSession, text: string, simNow: string, emit: Emit): Promise<void> {
  session.messages.push({ role: 'user', content: [{ text }] });
  let wroteText = false;
  let textKey = '';

  for (let call = 0; call < LIMITS.grubpakModelCallsPerTurn; call++) {
    const res = await bedrock().send(
      new ConverseStreamCommand({
        modelId: MODEL_ID,
        system: [{ text: SYSTEM_PROMPT }, { cachePoint: { type: 'default' } }],
        messages: session.messages,
        toolConfig: { tools: TOOLS },
        inferenceConfig: { maxTokens: LIMITS.grubpakMaxTokens },
        // Low effort: a sales chat should answer fast; the tools do the math.
        additionalModelRequestFields: { thinking: { type: 'adaptive' }, output_config: { effort: 'low' } },
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
      const out = runTool(t.name ?? '', t.input, session, simNow);
      for (const e of out.events) emit(e.event, e.data);
      emit('tool_result', { id: t.toolUseId, name: t.name, ok: out.ok, label: out.label, result: out.result });
      results.push({
        toolResult: { toolUseId: t.toolUseId, content: [{ json: out.result as never }], status: out.ok ? 'success' : 'error' },
      });
    }
    session.messages.push({ role: 'user', content: results });
  }
  emit('delta', { text: `${wroteText ? '\n\n' : ''}${FALLBACK}` });
  session.messages.push({ role: 'assistant', content: [{ text: FALLBACK }] });
}
