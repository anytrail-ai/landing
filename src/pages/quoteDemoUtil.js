export const QUOTE_MARKER = '[[COTIZAR]]'

// The agent ends the turn where the customer accepts a quote with the marker.
// It streams in pieces, so a trailing prefix of it ('[', '[[COT') is hidden too:
// the visitor must never see it flash on screen.
export function stripQuoteMarker(text) {
  const ready = text.includes(QUOTE_MARKER)
  let out = text.split(QUOTE_MARKER).join('')
  for (let n = QUOTE_MARKER.length - 1; n > 0; n--) {
    if (out.endsWith(QUOTE_MARKER.slice(0, n))) {
      out = out.slice(0, -n)
      break
    }
  }
  return { text: out.trimEnd(), ready }
}

export function money(cents, currency) {
  const n = (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return `$${n} ${currency}`
}

export function parsePriceInput(s) {
  const cleaned = String(s ?? '').replace(/[$,\s]/g, '')
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null
  return Math.round(Number(cleaned) * 100)
}

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '')
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}
