import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mockClient } from 'aws-sdk-client-mock';
import { BedrockRuntimeClient, ConverseCommand } from '@aws-sdk/client-bedrock-runtime';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { setBedrockForTests } from '../bedrock';
import { setDocClientForTests } from '../db';
import { LIMITS } from '../limits';
import { handler } from './handler';
import {
  SUMMARY_MAX,
  buildContent,
  normalizeModelOutput,
  parseClassifyRequest,
  sanitizeDocumentName,
  type ClassifyInput,
} from './siniestros';

const ddb = mockClient(DynamoDBDocumentClient);
const br = mockClient(BedrockRuntimeClient);

beforeEach(() => {
  setDocClientForTests(ddb as unknown as DynamoDBDocumentClient);
  setBedrockForTests(br as unknown as BedrockRuntimeClient);
});

afterEach(() => {
  ddb.reset();
  br.reset();
});

const PNG_B64 = Buffer.from('fake-png-bytes').toString('base64');

const versa = {
  id: 'exp-1',
  numero: '04-123456-7',
  poliza: '0123456789',
  placas: 'ABC-123-D',
  aseguradora: 'Qualitas',
  asegurado: 'Juan Pérez',
  vehiculo: 'Nissan Versa 2021',
};

const base = {
  chat: { name: 'Ajustadores Norte', isGroup: true },
  sender: 'Luis',
  context: { recent: [{ sender: 'Luis', text: 'van las fotos del Versa' }], expedientes: [versa] },
};

function parsed(body: unknown): ClassifyInput {
  const r = parseClassifyRequest(body);
  if (!r.ok) throw new Error(`expected valid input, got ${r.error}`);
  return r.data;
}

describe('parseClassifyRequest', () => {
  it('accepts text alone and attachment alone', () => {
    expect(parseClassifyRequest({ ...base, text: 'hola' }).ok).toBe(true);
    expect(
      parseClassifyRequest({
        ...base,
        attachment: { name: 'a.png', mime: 'image/png', data: PNG_B64 },
      }).ok,
    ).toBe(true);
  });

  it('rejects a message with neither text nor attachment as invalid_input', () => {
    const r = parseClassifyRequest({ ...base, text: '   ' });
    expect(r).toMatchObject({ ok: false, status: 422, error: 'invalid_input' });
  });

  it('rejects an unsupported mime and non-base64 data', () => {
    expect(
      parseClassifyRequest({ ...base, attachment: { name: 'a.gif', mime: 'image/gif', data: PNG_B64 } }),
    ).toMatchObject({ ok: false, status: 422 });
    expect(
      parseClassifyRequest({ ...base, attachment: { name: 'a.png', mime: 'image/png', data: 'no base64!' } }),
    ).toMatchObject({ ok: false, status: 422 });
  });

  it('answers too_large for an oversize attachment, before any other validation', () => {
    const big = 'A'.repeat(LIMITS.siniestrosMaxAttachmentChars + 1);
    expect(
      parseClassifyRequest({ sender: '', attachment: { name: 'x', mime: 'image/png', data: big } }),
    ).toEqual({ ok: false, status: 413, error: 'too_large' });
  });

  it('strips a data: URL prefix from the attachment', () => {
    const data = parsed({
      ...base,
      attachment: { name: 'a.png', mime: 'image/png', data: `data:image/png;base64,${PNG_B64}` },
    });
    expect(data.attachment?.data).toBe(PNG_B64);
  });

  it('caps the context lists', () => {
    const recent = Array.from({ length: 9 }, () => ({ sender: 'a', text: 'b' }));
    expect(
      parseClassifyRequest({ ...base, text: 'x', context: { ...base.context, recent } }).ok,
    ).toBe(false);
  });
});

describe('sanitizeDocumentName', () => {
  it.each([
    ['Póliza_Qualitas.pdf', 'Poliza Qualitas pdf'],
    ['  reporte   (final) [v2]--ok.pdf ', 'reporte (final) [v2]--ok pdf'],
    ['***.pdf', 'pdf'],
    ['***', 'documento'],
    ['', 'documento'],
  ])('%j → %j', (input, expected) => {
    expect(sanitizeDocumentName(input)).toBe(expected);
  });
});

describe('buildContent', () => {
  it('sends an image block then the context text for a photo', () => {
    const blocks = buildContent(
      parsed({ ...base, attachment: { name: 'golpe.jpg', mime: 'image/jpeg', data: PNG_B64 } }),
    );
    expect(blocks).toHaveLength(2);
    const img = blocks[0].image!;
    expect(img.format).toBe('jpeg');
    expect(Buffer.from(img.source!.bytes as Uint8Array).toString()).toBe('fake-png-bytes');
    const text = blocks[1].text!;
    expect(text).toContain('van las fotos del Versa');
    expect(text).toContain('exp-1');
    // Attachment metadata travels in the text, never the base64 itself.
    expect(text).toContain('golpe.jpg');
    expect(text).not.toContain(PNG_B64);
  });

  it('sends a document block with a sanitized name for a PDF', () => {
    const blocks = buildContent(
      parsed({ ...base, attachment: { name: 'Póliza #1.pdf', mime: 'application/pdf', data: PNG_B64 } }),
    );
    expect(blocks[0].document).toMatchObject({ format: 'pdf', name: 'Poliza 1 pdf' });
    expect(blocks[0].image).toBeUndefined();
  });

  it('sends only the text block for a text message', () => {
    const blocks = buildContent(parsed({ ...base, text: 'Siniestro 04-123456-7' }));
    expect(blocks).toHaveLength(1);
    expect(blocks[0].text).toContain('Siniestro 04-123456-7');
  });
});

describe('normalizeModelOutput', () => {
  const minimal = { kind: 'foto', confidence: 'media' };

  it('fills every missing field with null', () => {
    expect(normalizeModelOutput(minimal, ['exp-1'])).toEqual({
      kind: 'foto',
      identifiers: { numero: null, poliza: null, placas: null },
      fields: {
        aseguradora: null,
        fecha: null,
        ubicacion: null,
        ajustador: null,
        asegurado: null,
        vehiculo: null,
        monto: null,
      },
      matchId: null,
      confidence: 'media',
      summary: '',
      relevant: true,
    });
  });

  it('keeps a known matchId and drops an unknown one', () => {
    expect(normalizeModelOutput({ ...minimal, matchId: 'exp-1' }, ['exp-1']).matchId).toBe('exp-1');
    expect(normalizeModelOutput({ ...minimal, matchId: 'exp-9' }, ['exp-1']).matchId).toBeNull();
  });

  it('clamps the summary to 140 chars', () => {
    const out = normalizeModelOutput({ ...minimal, summary: 'x'.repeat(300) }, []);
    expect(out.summary.length).toBe(SUMMARY_MAX);
    expect(out.summary.endsWith('…')).toBe(true);
  });

  it('nulls blank / N/A strings and a fecha that is not YYYY-MM-DD', () => {
    const out = normalizeModelOutput(
      {
        ...minimal,
        identifiers: { numero: '', poliza: 'N/A', placas: ' ABC-123-D ' },
        fields: { fecha: '03/04/2024', monto: '$45,300.00 MXN' },
      },
      [],
    );
    expect(out.identifiers).toEqual({ numero: null, poliza: null, placas: 'ABC-123-D' });
    expect(out.fields.fecha).toBeNull();
    expect(out.fields.monto).toBe('$45,300.00 MXN');
  });

  it('throws on an unknown kind or confidence (so the call retries)', () => {
    expect(() => normalizeModelOutput({ kind: 'selfie', confidence: 'alta' }, [])).toThrow();
    expect(() => normalizeModelOutput({ kind: 'foto', confidence: 'total' }, [])).toThrow();
  });
});

describe('POST /demo/siniestros/classify (handler)', () => {
  const event = (body: unknown) =>
    ({
      rawPath: '/demo/siniestros/classify',
      body: JSON.stringify(body),
      requestContext: { http: { method: 'POST', sourceIp: '1.2.3.4' } },
    }) as never;

  const reply = (text: string) => ({
    output: { message: { role: 'assistant' as const, content: [{ text }] } },
    stopReason: 'end_turn' as const,
  });

  const body = { ...base, attachment: { name: 'golpe.png', mime: 'image/png', data: PNG_B64 } };

  it('classifies a photo against the chat context and rate-limits in its own bucket', async () => {
    ddb.on(UpdateCommand).resolves({});
    br.on(ConverseCommand).resolves(
      reply(
        '```json\n' +
          JSON.stringify({
            kind: 'foto',
            identifiers: { numero: null, poliza: null, placas: null },
            fields: { vehiculo: 'Nissan Versa 2021' },
            matchId: 'exp-1',
            confidence: 'media',
            summary: 'Foto del golpe en la puerta trasera del Versa',
            relevant: true,
          }) +
          '\n```',
      ),
    );

    const res = await handler(event(body));
    expect(res).toMatchObject({ statusCode: 200 });
    const out = JSON.parse((res as { body: string }).body);
    expect(out).toMatchObject({ kind: 'foto', matchId: 'exp-1', confidence: 'media', relevant: true });
    expect(out.fields).toMatchObject({ vehiculo: 'Nissan Versa 2021', fecha: null });

    expect(ddb.commandCalls(UpdateCommand)[0].args[0].input.Key!.pk).toBe('IP#1.2.3.4#siniestros');
    const sent = br.commandCalls(ConverseCommand)[0].args[0].input;
    expect(sent.inferenceConfig?.maxTokens).toBe(LIMITS.siniestrosMaxTokens);
    expect(sent.messages![0].content![0].image?.format).toBe('png');
  });

  it('retries once on bad output, then 502s classify_failed', async () => {
    ddb.on(UpdateCommand).resolves({});
    br.on(ConverseCommand)
      .resolvesOnce(reply('lo siento, no puedo'))
      .resolvesOnce(reply('{"kind":"selfie","confidence":"alta"}'));
    const res = await handler(event(body));
    expect(res).toMatchObject({ statusCode: 502 });
    expect(JSON.parse((res as { body: string }).body)).toEqual({ error: 'classify_failed' });
    expect(br.commandCalls(ConverseCommand)).toHaveLength(2);
  });

  it('succeeds on the retry when the first answer is malformed', async () => {
    ddb.on(UpdateCommand).resolves({});
    br.on(ConverseCommand)
      .resolvesOnce(reply('{"kind": "foto",'))
      .resolvesOnce(reply('{"kind":"mensaje","confidence":"baja","relevant":false,"summary":"Saludo"}'));
    const res = await handler(event({ ...base, text: 'buenos días' }));
    expect(res).toMatchObject({ statusCode: 200 });
    expect(JSON.parse((res as { body: string }).body)).toMatchObject({ kind: 'mensaje', relevant: false });
  });

  it('422s without calling Bedrock when there is no text or attachment', async () => {
    ddb.on(UpdateCommand).resolves({});
    const res = await handler(event(base));
    expect(res).toMatchObject({ statusCode: 422 });
    expect(JSON.parse((res as { body: string }).body).error).toBe('invalid_input');
    expect(br.commandCalls(ConverseCommand)).toHaveLength(0);
  });

  it('413s an oversize attachment', async () => {
    const big = 'A'.repeat(LIMITS.siniestrosMaxAttachmentChars + 4);
    const res = await handler(event({ ...base, attachment: { name: 'x.png', mime: 'image/png', data: big } }));
    expect(res).toMatchObject({ statusCode: 413 });
    expect(JSON.parse((res as { body: string }).body)).toEqual({ error: 'too_large' });
  });

  it('429s when the per-IP cap is spent, without calling Bedrock', async () => {
    const err = Object.assign(new Error('cap'), { name: 'ConditionalCheckFailedException' });
    ddb.on(UpdateCommand).rejects(err);
    const res = await handler(event(body));
    expect(res).toMatchObject({ statusCode: 429 });
    expect(br.commandCalls(ConverseCommand)).toHaveLength(0);
  });

  it('422s invalid_attachment when Bedrock rejects the file', async () => {
    ddb.on(UpdateCommand).resolves({});
    br.on(ConverseCommand).rejects(
      Object.assign(new Error('Could not process image'), { name: 'ValidationException' }),
    );
    const res = await handler(event(body));
    expect(res).toMatchObject({ statusCode: 422 });
    expect(JSON.parse((res as { body: string }).body)).toEqual({ error: 'invalid_attachment' });
  });
});
