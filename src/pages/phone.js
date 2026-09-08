// Client-side sanity check for the /demo phone field. The backend
// (demo-backend/src/api/lead.ts) normalises and re-validates; this only
// keeps obviously unusable input from making a round trip.
const MIN_DIGITS = 8
// E.164 caps a number at 15 digits.
const MAX_DIGITS = 15

/**
 * @param {string} raw
 * @returns {string} only the digits of the input
 */
export function phoneDigits(raw) {
  return raw.replace(/[^0-9]/g, '')
}

/**
 * @param {string} raw
 * @returns {boolean}
 */
export function phoneLooksValid(raw) {
  const digits = phoneDigits(raw)
  return digits.length >= MIN_DIGITS && digits.length <= MAX_DIGITS
}

/**
 * @param {string} template copy string with `{name}`-style slots
 * @param {Record<string, string>} vars
 * @returns {string}
 */
export function fill(template, vars) {
  return template.replace(/\{(\w+)\}/g, (match, key) => (key in vars ? vars[key] : match))
}
