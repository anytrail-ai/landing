// Response-streaming Function URL handler: POST {sessionId, messages} → SSE.
// Session state (profile, message count) lives in DynamoDB; the message list
// itself is client-held and sent each turn, like sales-agent-playground.
import { GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { z } from 'zod';
import { TABLE_NAME, docClient, keys } from '../db';
import { LIMITS } from '../limits';
import { companyProfileSchema, getCachedProfile } from '../pipeline/profile';
import { CTA_TEXT, runChatTurn } from './agent';
import { UnknownSessionError, extractForSession } from '../api/extract';
import { prospectsForSession } from '../api/prospects';

function pipelineError(err: unknown): string {
  if (err instanceof UnknownSessionError) return 'unknown_session';
  const msg = (err as Error).message ?? '';
  if (msg === 'crawl_empty' || msg.startsWith('firecrawl_')) return 'site_unreadable';
  if (msg === 'not_profiled') return 'not_profiled';
  if (msg.startsWith('apollo_')) return 'lead_search_failed';
  console.error('pipeline_failed', err);
  return 'internal';
}

declare const awslambda: {
  streamifyResponse: (
    fn: (event: { body?: string; isBase64Encoded?: boolean }, responseStream: NodeJS.WritableStream) => Promise<void>,
  ) => unknown;
  HttpResponseStream: {
    from: (
      stream: NodeJS.WritableStream,
      metadata: { statusCode: number; headers: Record<string, string> },
    ) => NodeJS.WritableStream;
  };
};

const bodySchema = z.object({
  // 'chat' (default) streams a model turn; 'extract' and 'prospects' run the
  // long pipeline stages here because API Gateway hard-caps requests at 30s.
  action: z.enum(['chat', 'extract', 'prospects']).default('chat'),
  sessionId: z.string().min(1),
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        text: z.string().min(1).max(4000),
      }),
    )
    .max(40)
    .default([]),
});

function sse(stream: NodeJS.WritableStream, event: string, data: unknown): void {
  stream.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

export const handler = awslambda.streamifyResponse(async (event, responseStream) => {
  const stream = awslambda.HttpResponseStream.from(responseStream, {
    statusCode: 200,
    headers: { 'content-type': 'text/event-stream', 'cache-control': 'no-cache' },
  });

  try {
    const raw = event.isBase64Encoded
      ? Buffer.from(event.body ?? '', 'base64').toString('utf8')
      : (event.body ?? '');
    const parsed = bodySchema.safeParse(JSON.parse(raw || '{}'));
    if (!parsed.success) {
      sse(stream, 'error', { error: 'invalid_input' });
      return;
    }
    const { action, sessionId, messages } = parsed.data;

    if (action === 'extract') {
      try {
        const profile = await extractForSession(sessionId, (step) =>
          sse(stream, 'step', { step }),
        );
        sse(stream, 'profile', { profile });
        sse(stream, 'done', {});
      } catch (err) {
        sse(stream, 'error', { error: pipelineError(err) });
      }
      return;
    }

    if (action === 'prospects') {
      try {
        sse(stream, 'step', { step: 'Deriving your ideal customer profile…' });
        const result = await prospectsForSession(sessionId, (step) =>
          sse(stream, 'step', { step }),
        );
        sse(stream, 'prospects', result);
        sse(stream, 'done', {});
      } catch (err) {
        sse(stream, 'error', { error: pipelineError(err) });
      }
      return;
    }

    if (!messages.length) {
      sse(stream, 'error', { error: 'invalid_input' });
      return;
    }

    const lead = await docClient().send(
      new GetCommand({ TableName: TABLE_NAME, Key: keys.lead(sessionId) }),
    );
    if (!lead.Item) {
      sse(stream, 'error', { error: 'unknown_session' });
      return;
    }
    const visitorName = (lead.Item.name as string) ?? 'there';
    const profile =
      companyProfileSchema.safeParse(lead.Item.profile).data ??
      (await getCachedProfile(lead.Item.domain as string));
    if (!profile) {
      sse(stream, 'error', { error: 'not_profiled' });
      return;
    }

    const userCount = messages.filter((m) => m.role === 'user').length;
    if (userCount > LIMITS.messagesPerSession) {
      // Past the cap: no model call, just the CTA.
      sse(stream, 'delta', { text: CTA_TEXT });
      sse(stream, 'done', { ended: true });
      return;
    }

    const reply = await runChatTurn(
      {
        profile,
        visitorName,
        messages,
        closing: userCount === LIMITS.messagesPerSession,
      },
      (text) => sse(stream, 'delta', { text }),
    );

    // Transcript log: one structured line per turn so the team can read what
    // visitors say to the agent. Filter CloudWatch on "chat_turn" (or a
    // sessionId) to reconstruct a conversation. Reply is truncated to keep
    // log lines bounded; the visitor message is already capped at 4000 by
    // the input schema.
    console.log(
      'chat_turn',
      JSON.stringify({
        sessionId,
        domain: lead.Item.domain,
        visitor: visitorName,
        turn: userCount,
        user: messages.filter((m) => m.role === 'user').at(-1)?.text ?? '',
        reply: reply.slice(0, 2000),
      }),
    );

    await docClient().send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: keys.lead(sessionId),
        UpdateExpression: 'SET lastChatAt = :t, userMessages = :n',
        ExpressionAttributeValues: {
          ':t': new Date().toISOString(),
          ':n': userCount,
        },
      }),
    );
    // Ended = hit the cap, or the agent closed naturally (it only ever drops
    // the anytrail.ai link when delivering the CTA).
    const ended =
      userCount >= LIMITS.messagesPerSession || /anytrail\.ai/i.test(reply);
    sse(stream, 'done', { length: reply.length, ended });
  } catch (err) {
    console.error('chat_failed', err);
    sse(stream, 'error', { error: 'chat_failed' });
  } finally {
    stream.end();
  }
});
