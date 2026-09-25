import { API_URL } from '../demoApi'
import { localClassify } from './localClassify'
import { buildPdf } from './files'
import { carPhotoSvg } from './photos'

// Photos go to the model downscaled (faster, and under the ~3.4 MB the Lambda
// payload allows); the original file is what the expediente keeps and serves.
const MAX_SIDE = 1600
const MAX_PDF_BYTES = 3_300_000
// The gateway gives up at 30 s; stop a little earlier and fall back.
const TIMEOUT_MS = 28_000

const toBase64 = (buf) => {
  const bytes = new Uint8Array(buf)
  let s = ''
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return btoa(s)
}

async function downscale(blob) {
  const bitmap = await createImageBitmap(blob)
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  const out = await new Promise((r) => canvas.toBlob(r, 'image/jpeg', 0.85))
  return out
}

async function attachmentPayload(att) {
  if (!att?.blob) return undefined
  if (att.type === 'photo') {
    const small = await downscale(att.blob)
    return { name: att.name, mime: 'image/jpeg', data: toBase64(await small.arrayBuffer()) }
  }
  if (att.mime === 'application/pdf' && att.blob.size <= MAX_PDF_BYTES) {
    return { name: att.name, mime: 'application/pdf', data: toBase64(await att.blob.arrayBuffer()) }
  }
  return undefined
}

// Returns a classification in the backend's shape plus `source`: 'ia' when the
// model answered, 'local' when the pattern fallback did (and `error` says why).
export async function classifyLive({ chat, message, recent, expedientes }) {
  const context = {
    recent: recent.slice(-8).map((m) => ({ sender: m.sender, text: m.text || m.attachment?.name || '' })),
    expedientes: expedientes.slice(0, 40).map((e) => ({
      id: e.id,
      numero: e.numero,
      poliza: e.poliza,
      placas: e.placas,
      aseguradora: e.aseguradora,
      asegurado: e.asegurado,
      vehiculo: e.vehiculo,
    })),
  }
  const fallback = (error) => ({ ...localClassify({ text: message.text, attachment: message.attachment, context }), error })
  try {
    const attachment = await attachmentPayload(message.attachment)
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
    const res = await fetch(`${API_URL}/demo/siniestros/classify`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        chat: { name: chat.name, isGroup: Boolean(chat.isGroup) },
        sender: message.sender,
        ...(message.text ? { text: message.text } : {}),
        ...(attachment ? { attachment } : {}),
        context,
      }),
      signal: controller.signal,
    }).finally(() => clearTimeout(timer))
    const data = await res.json().catch(() => ({}))
    if (!res.ok) return fallback(data.error ?? `http_${res.status}`)
    return { ...data, source: 'ia' }
  } catch (err) {
    return fallback(err.name === 'AbortError' ? 'timeout' : 'network')
  }
}

// ---- file materialisation ---------------------------------------------------

const cache = new Map()

// Seeded photos are SVG; rendered to a real JPEG on demand so a download is
// the kind of file an adjuster would actually get from WhatsApp.
async function svgToJpeg(svg) {
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
  try {
    const img = new Image()
    img.src = url
    await img.decode()
    const canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth || 1200
    canvas.height = img.naturalHeight || 900
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
    return await new Promise((r) => canvas.toBlob(r, 'image/jpeg', 0.92))
  } finally {
    URL.revokeObjectURL(url)
  }
}

export async function blobOf(att) {
  if (att.blob) return att.blob
  const key = att.name
  if (cache.has(key)) return cache.get(key)
  const blob = att.photo
    ? await svgToJpeg(carPhotoSvg(att.photo))
    : new Blob([buildPdf(att.pdf)], { type: 'application/pdf' })
  cache.set(key, blob)
  return blob
}

export function saveBlob(blob, name) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}

export async function openDoc(att) {
  const blob = await blobOf(att)
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank', 'noopener')
  setTimeout(() => URL.revokeObjectURL(url), 60_000)
}
