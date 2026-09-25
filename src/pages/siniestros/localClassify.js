// Fallback classifier for when the demo backend is unreachable (offline
// meeting room, local dev without AWS). Pattern matching on the caption, the
// file name and the chat, nowhere near what the model reads out of a PDF or a
// photo, but it keeps the demo moving instead of stalling on an error.

export const INSURERS = ['Qualitas', 'GNP', 'AXA', 'HDI', 'Chubb', 'Mapfre', 'Zurich', 'Banorte', 'Inbursa', 'AIG', 'Afirme', 'Ana Seguros']

const NUMERO_RE = /siniestro\s*(?:no\.?|n[úu]m(?:ero)?\.?|#)?\s*(?:[a-z]+\s+)?[:-]?\s*([0-9][0-9A-Z-]{5,})/i
const POLIZA_RE = /p[óo]liza\s*(?:no\.?|n[úu]m(?:ero)?\.?|#)?\s*[:-]?\s*([A-Z0-9][A-Z0-9-]{4,})/i
const PLACAS_RE = /\b([A-Z]{3}-?\d{2,3}-?[A-Z0-9]{1,2})\b/
const CLAIM_WORDS = /choque|chocaron|siniestro|foto|p[óo]liza|golpe|da[ñn]o|gr[úu]a|taller|cotizaci[óo]n|reporte|ajustador|placas|robo|granizo|volcadura|colisi[óo]n/i

function kindOf(attachment, text) {
  if (!attachment) return 'mensaje'
  if (attachment.mime?.startsWith('image/')) return 'foto'
  const hay = `${attachment.name} ${text ?? ''}`.toLowerCase()
  if (/p[óo]liza|poliza/.test(hay)) return 'poliza'
  if (/reporte|declaraci/.test(hay)) return 'reporte'
  if (/cotiz|presupuesto|cot-/.test(hay)) return 'cotizacion'
  if (/\bine\b|identificaci|licencia/.test(hay)) return 'identificacion'
  return 'otro_documento'
}

export function localClassify({ text = '', attachment, context }) {
  const hay = `${text} ${attachment?.name ?? ''}`
  const numero = hay.match(NUMERO_RE)?.[1] ?? null
  const poliza = hay.match(POLIZA_RE)?.[1] ?? null
  const placas = hay.toUpperCase().match(PLACAS_RE)?.[1] ?? null
  const aseguradora = INSURERS.find((i) => new RegExp(`\\b${i}\\b`, 'i').test(hay)) ?? null
  const kind = kindOf(attachment, text)
  const relevant = Boolean(attachment || numero || poliza || placas || CLAIM_WORDS.test(text))

  const identifiers = { numero, poliza, placas }
  let matchId = null
  for (const key of ['numero', 'poliza', 'placas']) {
    const v = identifiers[key]?.replace(/[^A-Z0-9]/gi, '').toUpperCase()
    if (!v) continue
    const hit = context?.expedientes?.find((e) => e[key]?.replace(/[^A-Z0-9]/gi, '').toUpperCase() === v)
    if (hit) {
      matchId = hit.id
      break
    }
  }

  return {
    kind,
    identifiers,
    fields: { aseguradora, fecha: null, ubicacion: null, ajustador: null, asegurado: null, vehiculo: null, monto: null },
    matchId,
    confidence: matchId ? 'media' : 'baja',
    summary:
      kind === 'mensaje'
        ? text.slice(0, 140)
        : `${kind === 'foto' ? 'Foto' : 'Documento'} ${attachment?.name ?? ''}`.trim().slice(0, 140),
    relevant,
    source: 'local',
  }
}
