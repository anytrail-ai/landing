// Client for /quote_demo. Long Bedrock work (catalogue parse, chat, quote)
// streams from the same Function URL as /inbound_demo; the rest is JSON.
import { get, post, streamRequest } from './demoApi'

export async function loadCatalog(source, onStep = () => {}) {
  let result = null
  await streamRequest(
    { action: 'catalog', ...source },
    { step: (d) => onStep(d.step), catalog: (d) => (result = d) },
  )
  if (!result) throw new Error('internal')
  return result
}

export async function quoteChatTurn(sessionId, messages, onDelta) {
  let done = { ready: false, ended: false }
  await streamRequest(
    { action: 'quote_chat', sessionId, messages },
    { delta: (d) => d.text && onDelta(d.text), done: (d) => (done = { ready: Boolean(d.ready), ended: Boolean(d.ended) }) },
  )
  return done
}

export async function generateQuote(sessionId, messages, onStep = () => {}) {
  let result = null
  await streamRequest(
    { action: 'quote', sessionId, messages },
    { step: (d) => onStep(d.step), quote: (d) => (result = d) },
  )
  if (!result) throw new Error('internal')
  return result
}

export const getQuote = (id) => get(`/demo/quote?id=${encodeURIComponent(id)}`)
export const sendPriceRequest = (input) => post('/demo/quote/price-request/send', input)
export const getPriceRequest = (t) => get(`/demo/quote/price-request?t=${encodeURIComponent(t)}`)
export const answerPriceRequest = (input) => post('/demo/quote/price-request/answer', input)
