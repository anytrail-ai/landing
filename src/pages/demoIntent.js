// Buying-intent scoring for the demo, ported from lead-crm
// (server/src/services/intent-signals.ts). Same signal keys, weights,
// half-life decay, and threshold. lead-crm detects the language signals with
// an LLM pass over inbound messages; the demo has no extra model call per
// turn, so those signals are detected with keyword rules instead.
import { useCallback, useEffect, useRef, useState } from 'react'

export const SIGNAL_WEIGHTS = {
  quote_request: 30,
  payment: 25,
  haggling: 25,
  warranty: 20,
  urgency: 20,
  logistics: 10,
  // Negative on purpose (same as lead-crm): without it a chatty tyre-kicker who
  // asks about warranty AND delivery AND price outscores a serious buyer.
  browsing: -25,
  engagement_depth: 10,
}

export const SIGNAL_LABELS = {
  quote_request: 'Asked for pricing',
  payment: 'Ready to pay',
  haggling: 'Negotiating price',
  warranty: 'Asked about guarantees',
  urgency: 'In a hurry',
  logistics: 'Asked about delivery',
  browsing: 'Just browsing',
  engagement_depth: 'Deep in conversation',
}

// Alert fires at this score — lead-crm's default `intent_threshold` (60, range 1..100).
export const INTENT_THRESHOLD = 60

const HALF_LIFE_HOURS = 72
const MS_PER_HOUR = 3_600_000
const DEPTH_CAP = 5

const LANGUAGE_RULES = [
  { key: 'quote_request', pattern: /\b(quote|quotation|pricing|price[sd]?|cost|how much|cu[aá]nto|precio|cotizaci[oó]n)\b/i },
  { key: 'payment', pattern: /\b(pay|payment|invoice|checkout|buy|purchase|order|card|transfer|deposit)\b/i },
  { key: 'haggling', pattern: /\b(discount|cheaper|best price|negotiate|price match|lower the|any deals?)\b/i },
  { key: 'warranty', pattern: /\b(warranty|guarantee[sd]?|refund|return policy|money.?back)\b/i },
  { key: 'urgency', pattern: /\b(asap|urgent(ly)?|today|right away|immediately|this week|how soon|deadline|by (mon|tues|wednes|thurs|fri|satur|sun)day)\b/i },
  { key: 'logistics', pattern: /\b(ship(ping)?|deliver(y|ed)?|pick.?up|install(ation)?|lead time|in stock|availab(le|ility))\b/i },
  { key: 'browsing', pattern: /\b(just (looking|browsing|curious)|not interested|maybe later|no thanks|window shopping)\b/i },
]

// Keyword substitute for lead-crm's LLM language pass over one inbound message.
export function detectMessageSignals(text, now) {
  const firedAt = now.toISOString()
  return LANGUAGE_RULES.filter((r) => r.pattern.test(text)).map((r) => ({
    key: r.key,
    strength: 1,
    firedAt,
  }))
}

// One signal per key. A re-firing replaces the stored one, which restarts its
// decay clock — same merge semantics as lead-crm's mergeSignals.
export function mergeSignals(existing, incoming) {
  const byKey = new Map()
  for (const s of existing) byKey.set(s.key, s)
  for (const s of incoming) byKey.set(s.key, s)
  return [...byKey.values()]
}

// Verbatim port of lead-crm's computeScore (weight × strength × half-life decay, clamped 0..100).
export function computeScore(signals, now) {
  let raw = 0
  for (const s of signals) {
    const weight = SIGNAL_WEIGHTS[s.key]
    if (weight === undefined) continue
    const ageHours = Math.max(0, (now.getTime() - Date.parse(s.firedAt)) / MS_PER_HOUR)
    raw += weight * s.strength * Math.pow(0.5, ageHours / HALF_LIFE_HOURS)
  }
  return Math.max(0, Math.min(100, Math.round(raw)))
}

// Score the whole demo conversation from the visitor's messages. Mirrors
// lead-crm's per-inbound-message scoring run: language signals per message
// (later firings replace earlier ones) plus the engagement_depth rule signal
// (message count against lead-crm's DEPTH_CAP of 5).
export function scoreConversation(userTexts, now) {
  let signals = []
  for (const text of userTexts) {
    signals = mergeSignals(signals, detectMessageSignals(text, now))
  }
  if (userTexts.length > 0) {
    signals = mergeSignals(signals, [
      { key: 'engagement_depth', strength: Math.min(1, userTexts.length / DEPTH_CAP), firedAt: now.toISOString() },
    ])
  }
  return { score: computeScore(signals, now), signals }
}

// Fires the high-intent alert exactly once per demo session, using lead-crm's
// crossing rule: previous score strictly below the threshold, new score at or
// above it. Duplicate prevention is a ref (survives rerenders and StrictMode's
// double effect run); a new sessionId re-arms it, so restarting the demo can
// fire the alert again.
export function useIntentAlert(messages, sessionId) {
  const [alert, setAlert] = useState(null)
  const firedRef = useRef(false)
  const prevScoreRef = useRef(0)
  const sessionRef = useRef(sessionId)

  useEffect(() => {
    if (sessionRef.current !== sessionId) {
      sessionRef.current = sessionId
      firedRef.current = false
      prevScoreRef.current = 0
      setAlert(null)
    }
    const userTexts = messages.filter((m) => m.role === 'user').map((m) => m.text)
    const { score, signals } = scoreConversation(userTexts, new Date())
    const previous = prevScoreRef.current
    prevScoreRef.current = score
    if (firedRef.current) return
    if (previous < INTENT_THRESHOLD && score >= INTENT_THRESHOLD) {
      firedRef.current = true
      setAlert({ score, signals, firedAt: new Date() })
    }
  }, [messages, sessionId])

  const dismiss = useCallback(() => setAlert(null), [])

  return { alert, dismiss }
}
