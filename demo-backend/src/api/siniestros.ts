import type { ContentBlock } from '@aws-sdk/client-bedrock-runtime';
import { z } from 'zod';
import { converseJsonContent } from '../bedrock';
import { LIMITS } from '../limits';

// Delpur claims demo (POST /demo/siniestros/classify). A simulated WhatsApp in
// the browser posts every incoming message — text, a photo, a PDF — and Claude
// decides which claim ("siniestro") it belongs to and pulls out the fields an
// adjuster would type by hand. Stateless: the browser owns the expedientes and
// sends them back as context on every call, so nothing here touches DynamoDB
// beyond the rate-limit counter.

const ATTACHMENT_MIMES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
] as const;

const nullableId = z.string().trim().max(120).nullable();

export const classifySchema = z
  .object({
    chat: z.object({
      name: z.string().trim().min(1).max(80),
      isGroup: z.boolean(),
    }),
    sender: z.string().trim().min(1).max(80),
    text: z.string().trim().max(2000).optional(),
    attachment: z
      .object({
        name: z.string().trim().min(1).max(120),
        mime: z.enum(ATTACHMENT_MIMES),
        // Accepts a bare base64 string or a data: URL (FileReader.readAsDataURL
        // output); the prefix and any whitespace are stripped before checking.
        data: z
          .string()
          .transform((s) => s.replace(/^data:[^,]*;base64,/, '').replace(/\s+/g, ''))
          .refine((s) => s.length > 0 && /^[A-Za-z0-9+/]+={0,2}$/.test(s), {
            message: 'not base64',
          }),
      })
      .optional(),
    context: z.object({
      recent: z
        .array(z.object({ sender: z.string().max(80), text: z.string().max(2000) }))
        .max(8)
        .default([]),
      expedientes: z
        .array(
          z.object({
            id: z.string().trim().min(1).max(80),
            numero: nullableId,
            poliza: nullableId,
            placas: nullableId,
            aseguradora: nullableId,
            asegurado: z.string().trim().max(200).nullable(),
            vehiculo: z.string().trim().max(200).nullable(),
          }),
        )
        .max(40)
        .default([]),
    }),
  })
  .refine((v) => Boolean(v.text) || Boolean(v.attachment), {
    message: 'text or attachment required',
    path: ['text'],
  });

export type ClassifyInput = z.infer<typeof classifySchema>;

export type ParsedClassify =
  | { ok: true; data: ClassifyInput }
  | { ok: false; status: 413; error: 'too_large' }
  | { ok: false; status: 422; error: 'invalid_input'; issues: z.ZodIssue[] };

// Size is checked on the raw body before zod so an oversize upload answers 413
// even when something else in the request is also wrong.
export function parseClassifyRequest(body: unknown): ParsedClassify {
  const data = (body as { attachment?: { data?: unknown } } | null)?.attachment?.data;
  if (typeof data === 'string' && data.length > LIMITS.siniestrosMaxAttachmentChars) {
    return { ok: false, status: 413, error: 'too_large' };
  }
  const parsed = classifySchema.safeParse(body);
  if (!parsed.success) {
    return { ok: false, status: 422, error: 'invalid_input', issues: parsed.error.issues };
  }
  return { ok: true, data: parsed.data };
}

// Bedrock's DocumentBlock name allows only alphanumerics, single whitespace,
// hyphens, parentheses and square brackets — anything else is a
// ValidationException. Accents are folded first ("Póliza_Qualitas.pdf" →
// "Poliza Qualitas pdf"); the name is only a label for the model.
export function sanitizeDocumentName(name: string): string {
  const cleaned = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9\s\-()[\]]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 100)
    .trim();
  return cleaned || 'documento';
}

const IMAGE_FORMAT = {
  'image/jpeg': 'jpeg',
  'image/png': 'png',
  'image/webp': 'webp',
} as const;

// Attachment first (Claude reads images/documents best before the question),
// then one text block carrying the message and the chat context as JSON.
export function buildContent(input: ClassifyInput): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const att = input.attachment;
  if (att) {
    const bytes = Buffer.from(att.data, 'base64');
    if (att.mime === 'application/pdf') {
      blocks.push({
        document: { format: 'pdf', name: sanitizeDocumentName(att.name), source: { bytes } },
      });
    } else {
      blocks.push({ image: { format: IMAGE_FORMAT[att.mime], source: { bytes } } });
    }
  }
  const payload = {
    chat: input.chat,
    sender: input.sender,
    text: input.text ?? null,
    attachment: att ? { name: att.name, mime: att.mime } : null,
    recent: input.context.recent,
    expedientes: input.context.expedientes,
  };
  blocks.push({
    text:
      'Clasifica este mensaje entrante de WhatsApp. Datos (JSON):\n' +
      JSON.stringify(payload, null, 2),
  });
  return blocks;
}

export const SYSTEM_PROMPT = `You classify incoming WhatsApp messages for a Mexican insurance claims adjusting firm (auto and property claims, "siniestros"). Each message may contain text, a photo, or a PDF, sent in a chat with an adjuster, an insurer, a workshop or an insured person. Decide what the message/file is, which existing claim file ("expediente") it belongs to, and extract fields.

Identifiers you will see:
- Siniestro (claim) number: insurer-issued, often digits with dashes or letters (e.g. "04-123456-7", "SIN-2024-00123", "Siniestro 123456789").
- Póliza (policy) number: e.g. "0123456789", "AB-12345678".
- Mexican license plates (placas): e.g. "ABC-123-D", "ABC-12-34", "123-ABC", "AB-1234-C". Normalize to uppercase with dashes as shown on the plate.

Matching against the provided expedientes (by their "id"), in priority order:
1. Same siniestro number → matchId, confidence "alta".
2. Same póliza number → matchId, confidence "alta".
3. Same placas → matchId, confidence "alta" or "media".
4. Same asegurado (insured name) or vehiculo (make/model/year) → matchId, confidence "media" or "baja".
5. No identifiers in the message itself (typical for damage photos): use the chat's recent messages. If an earlier message says which claim is coming (e.g. "van las fotos del Versa", "te mando lo del siniestro 123456") and it clearly points to one expediente, match it with confidence "media". If it is still ambiguous, matchId null and confidence "baja".
If the message clearly starts a new claim not in the list, matchId null. Only ever return an id from the provided expedientes list.

kind:
- "foto": a photo of damage, a vehicle, a scene, a plate, an odometer, etc.
- "poliza": an insurance policy or policy cover page.
- "reporte": an accident/claim report, adjuster report, declaration, police report.
- "cotizacion": a repair/parts quote or budget (presupuesto, cotización, valuación).
- "identificacion": INE, driver's license, tarjeta de circulación, or similar ID.
- "otro_documento": any other document or file (invoice, receipt, letter).
- "mensaje": a plain text message with no file.

Rules:
- Never invent identifiers or fields. Only report values visible in the text, the file, or the chat context; otherwise null.
- fecha: the date of the loss/event (or the document's main date), normalized to YYYY-MM-DD. Mexican dates are day-first (03/04/2024 = 2024-04-03).
- monto: an amount of money as written, with currency (e.g. "$45,300.00 MXN").
- aseguradora: the insurer (e.g. Qualitas, GNP, AXA, HDI, Chubb, Mapfre, Zurich, BBVA Seguros, Banorte).
- ubicacion: where the loss happened. ajustador: the adjuster's name. asegurado: the insured person or company. vehiculo: make, model and year (e.g. "Nissan Versa 2021").
- summary: Spanish, at most 140 characters, saying what this message or file is (e.g. "Póliza Qualitas de Nissan Versa 2021, vigente" or "Foto del golpe en la puerta trasera del Versa").
- relevant: false only for chit-chat unrelated to any claim ("buenos días", "gracias", stickers); true for anything that carries claim information or files.

Return ONLY a JSON object, no prose, no code fences, with exactly this shape:
{"kind":"foto|poliza|reporte|cotizacion|identificacion|otro_documento|mensaje","identifiers":{"numero":string|null,"poliza":string|null,"placas":string|null},"fields":{"aseguradora":string|null,"fecha":string|null,"ubicacion":string|null,"ajustador":string|null,"asegurado":string|null,"vehiculo":string|null,"monto":string|null},"matchId":string|null,"confidence":"alta|media|baja","summary":string,"relevant":boolean}`;

// Missing, null, non-string and blank values all become null — the model
// sometimes omits keys or answers "" / "N/A" instead of null.
const loose = z
  .unknown()
  .transform((v) => {
    if (typeof v !== 'string') return null;
    const t = v.trim();
    return t && !/^(n\/?a|null|ninguno|desconocido)$/i.test(t) ? t : null;
  });

const modelOutputSchema = z.object({
  kind: z.enum([
    'foto',
    'poliza',
    'reporte',
    'cotizacion',
    'identificacion',
    'otro_documento',
    'mensaje',
  ]),
  identifiers: z
    .object({ numero: loose, poliza: loose, placas: loose })
    .nullish()
    .transform((v) => v ?? { numero: null, poliza: null, placas: null }),
  fields: z
    .object({
      aseguradora: loose,
      fecha: loose,
      ubicacion: loose,
      ajustador: loose,
      asegurado: loose,
      vehiculo: loose,
      monto: loose,
    })
    .nullish()
    .transform(
      (v) =>
        v ?? {
          aseguradora: null,
          fecha: null,
          ubicacion: null,
          ajustador: null,
          asegurado: null,
          vehiculo: null,
          monto: null,
        },
    ),
  matchId: loose,
  confidence: z.enum(['alta', 'media', 'baja']),
  summary: z.string().catch(''),
  relevant: z.boolean().catch(true),
});

export type ClassifyResult = z.output<typeof modelOutputSchema>;

export const SUMMARY_MAX = 140;

// Validates the model's JSON (throws on a wrong shape, which buys the one
// retry) and applies the guarantees the browser relies on: matchId is always
// one of the ids it sent, fecha is YYYY-MM-DD or null, summary fits a chip.
export function normalizeModelOutput(raw: unknown, expedienteIds: string[]): ClassifyResult {
  const out = modelOutputSchema.parse(raw);
  const matchId = out.matchId && expedienteIds.includes(out.matchId) ? out.matchId : null;
  const fecha =
    out.fields.fecha && /^\d{4}-\d{2}-\d{2}$/.test(out.fields.fecha) ? out.fields.fecha : null;
  const summary = out.summary.trim();
  return {
    ...out,
    fields: { ...out.fields, fecha },
    matchId,
    summary:
      summary.length > SUMMARY_MAX ? `${summary.slice(0, SUMMARY_MAX - 1).trimEnd()}…` : summary,
  };
}

export class ClassifyFailedError extends Error {
  constructor(cause?: unknown) {
    super('classify_failed');
    this.name = 'ClassifyFailedError';
    this.cause = cause;
  }
}

export async function classifyMessage(input: ClassifyInput): Promise<ClassifyResult> {
  const ids = input.context.expedientes.map((e) => e.id);
  try {
    return await converseJsonContent(
      SYSTEM_PROMPT,
      buildContent(input),
      LIMITS.siniestrosMaxTokens,
      (raw) => normalizeModelOutput(raw, ids),
    );
  } catch (err) {
    // Unparseable or wrong-shaped output twice. Bedrock/SDK errors (throttling,
    // a rejected image) propagate as-is for the handler to map.
    if (err instanceof z.ZodError || err instanceof SyntaxError) {
      throw new ClassifyFailedError(err);
    }
    const message = (err as Error).message;
    if (message === 'bedrock_no_json' || message === 'bedrock_truncated') throw new ClassifyFailedError(err);
    throw err;
  }
}
