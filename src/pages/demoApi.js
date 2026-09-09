// Client for the demo backend (repo: anytrail-ai/public-demo, AWS).
// The heavy stages (extract, prospects, chat) stream SSE from a Lambda
// Function URL; only lead capture goes through the JSON API.
// Exported so scheduleApi.js (and anything else on the same API) shares this
// one place instead of duplicating the host — the spec dropped DEMO_URL from
// config.js for the same reason: no third place for a URL to drift.
export const API_URL = 'https://3cyy3hfm3a.execute-api.us-east-1.amazonaws.com'
const CHAT_URL = 'https://hf7g2sqkicab2s6bc3sci7t5gm0aretu.lambda-url.us-east-1.on.aws/'

async function post(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? `http_${res.status}`)
  return data
}

export const startDemo = (input) => post('/demo/start', input)

async function streamRequest(body, handlers) {
  const res = await fetch(CHAT_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok || !res.body) throw new Error(`http_${res.status}`)
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const events = buffer.split('\n\n')
    buffer = events.pop() ?? ''
    for (const raw of events) {
      const eventLine = raw.match(/^event: (.*)$/m)?.[1]
      const dataLine = raw.match(/^data: (.*)$/m)?.[1]
      if (!eventLine || !dataLine) continue
      const data = JSON.parse(dataLine)
      if (eventLine === 'error') throw new Error(data.error ?? 'internal')
      handlers[eventLine]?.(data)
    }
  }
}

export async function extract(sessionId, onStep) {
  let result = null
  await streamRequest(
    { action: 'extract', sessionId },
    { step: (d) => onStep(d.step), profile: (d) => (result = d) },
  )
  if (!result) throw new Error('internal')
  return result
}

export async function prospects(sessionId, onStep = () => {}) {
  let result = null
  await streamRequest(
    { action: 'prospects', sessionId },
    { step: (d) => onStep(d.step), prospects: (d) => (result = d) },
  )
  if (!result) throw new Error('internal')
  return result
}

// Simulated rep board over the crawled profile. Cached per domain server-side,
// so a booth re-run on the same prospect returns instantly.
export async function board(sessionId, onStep = () => {}) {
  let result = null
  await streamRequest(
    { action: 'board', sessionId },
    { step: (d) => onStep(d.step), board: (d) => (result = d.board) },
  )
  if (!result) throw new Error('internal')
  return result
}

// WhatsApp booth wiring: QR link (session code), connection status poll, and
// the one real Cloud API send behind the "schedule follow-up" moment.
export const waLink = (sessionId) => post('/demo/wa/link', { sessionId })

export async function waStatus(sessionId) {
  const res = await fetch(`${API_URL}/demo/wa/status?sessionId=${encodeURIComponent(sessionId)}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? `http_${res.status}`)
  return data
}

export const waSend = (sessionId, text) => post('/demo/wa/send', { sessionId, text })

export async function chatTurn(sessionId, messages, onDelta) {
  let ended = false
  await streamRequest(
    { sessionId, messages },
    {
      delta: (d) => d.text && onDelta(d.text),
      done: (d) => (ended = Boolean(d.ended)),
    },
  )
  return { ended }
}

// Records a /demo visitor (name + phone + email + page language) before the WhatsApp
// handoff. Rejects with the backend's error code ('invalid_phone',
// 'invalid_input', …) so the page can pick the matching copy.
export const captureLead = (input) => post('/demo/lead', input)
