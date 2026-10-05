// Pure state for /es/grubpak_demo. Every SSE event is one action, so a failed
// turn rolls back to the snapshot taken before it (same model as celdas).
//
// messages: everything the customer receives, tagged by channel
//   { kind: 'user' | 'agent', text, channel: 'web' | 'wa' | 'email', subject?, action?, time }
//   { kind: 'link', url, totalMxn, channel }
// trace:    the agent panel, one entry per turn
//   { who: 'cliente' | 'seguimiento', text, steps: [{ kind: 'thinking', text, done } | { kind: 'tool', id, name, input, ok, label }] }
// sequences: the server's follow-up schedule (simulated-clock ISO times)
// log:      Shopify webhook stand-ins and lead events, { at, topic, detail }
// checkout: null | { status: 'open', source } | { status: 'paid', order }

export const initialState = {
  sessionId: null,
  busy: false,
  channel: 'web',
  simNow: null,
  messages: [],
  trace: [],
  lead: null,
  cart: null,
  handoff: null,
  orders: [],
  sequences: [],
  log: [],
  checkout: null,
}

const lastTurn = (trace) => trace[trace.length - 1]

function updateTurn(state, fn) {
  const trace = state.trace.slice()
  const turn = lastTurn(trace)
  if (!turn) return state
  trace[trace.length - 1] = fn({ ...turn, steps: turn.steps.slice() })
  return { ...state, trace }
}

const log = (state, topic, detail) => [...state.log, { at: state.simNow, topic, detail }]

export function reducer(state, action) {
  switch (action.type) {
    case 'clock':
      return { ...state, simNow: action.simNow }
    case 'send':
      return {
        ...state,
        busy: true,
        channel: action.channel,
        messages: [...state.messages, { kind: 'user', text: action.text, channel: action.channel, time: state.simNow }],
        trace: [...state.trace, { who: 'cliente', text: action.text, steps: [] }],
      }
    case 'followup_start': {
      const s = action.step
      return {
        ...state,
        busy: true,
        channel: s.channel,
        // Empty until the deltas arrive; renders as nothing.
        messages: [...state.messages, { kind: 'agent', text: '', channel: s.channel, subject: s.subject, action: s.action, time: state.simNow }],
        trace: [...state.trace, { who: 'seguimiento', text: `${action.label}: ${s.title}`, steps: [] }],
        log: log(state, 'followup.due', `${action.label} · ${s.title}`),
      }
    }
    case 'session':
      return { ...state, sessionId: action.sessionId }
    case 'thinking_start':
      return updateTurn(state, (t) => {
        t.steps.push({ kind: 'thinking', text: '', done: false })
        return t
      })
    case 'thinking':
      return updateTurn(state, (t) => {
        const last = t.steps[t.steps.length - 1]
        if (last?.kind === 'thinking' && !last.done) t.steps[t.steps.length - 1] = { ...last, text: last.text + action.text }
        else t.steps.push({ kind: 'thinking', text: action.text, done: false })
        return t
      })
    case 'thinking_end':
      return updateTurn(state, (t) => {
        t.steps = t.steps.map((s) => (s.kind === 'thinking' ? { ...s, done: true } : s))
        return t
      })
    case 'delta': {
      const messages = state.messages.slice()
      const last = messages[messages.length - 1]
      if (last?.kind === 'agent' && last.channel === state.channel) messages[messages.length - 1] = { ...last, text: last.text + action.text }
      else messages.push({ kind: 'agent', text: action.text.replace(/^\s+/, ''), channel: state.channel, time: state.simNow })
      return { ...state, messages }
    }
    case 'tool':
      return updateTurn(state, (t) => {
        t.steps.push({ kind: 'tool', id: action.id, name: action.name, input: action.input, ok: null, label: null })
        return t
      })
    case 'tool_result':
      return updateTurn(state, (t) => {
        const i = t.steps.findIndex((s) => s.kind === 'tool' && s.id === action.id)
        if (i !== -1) t.steps[i] = { ...t.steps[i], ok: action.ok, label: action.label }
        return t
      })
    case 'lead':
      return { ...state, lead: action.lead, log: log(state, 'lead.qualified', `${action.lead.name} · score ${action.lead.score}`) }
    case 'cart':
      return { ...state, cart: action.cart }
    case 'checkout_link':
      return {
        ...state,
        messages: [...state.messages, { kind: 'link', url: action.url, totalMxn: action.totalMxn, channel: state.channel }],
        log: log(state, 'checkout.link', 'Link de carrito enviado'),
      }
    case 'handoff':
      return { ...state, handoff: action.handoff, log: log(state, 'lead.routed', 'Asignado a ejecutivo de mayoreo') }
    case 'sequences':
      return { ...state, sequences: action.sequences }
    case 'shop':
      return { ...state, log: log(state, action.topic, action.detail) }
    case 'order':
      return { ...state, orders: [...state.orders, action.order], checkout: { status: 'paid', order: action.order } }
    case 'checkout_open':
      return { ...state, checkout: { status: 'open', source: action.source } }
    case 'checkout_close':
      return { ...state, checkout: null }
    case 'busy':
      return { ...state, busy: true }
    case 'done':
      return { ...state, busy: false }
    case 'rollback':
      // Keep the clock where the presenter put it.
      return { ...action.snapshot, simNow: state.simNow, busy: false }
    case 'reset':
      return { ...initialState, simNow: action.simNow }
    default:
      return state
  }
}

/** Earliest step still pending, due or not. */
export function nextPending(sequences) {
  let best = null
  for (const seq of sequences)
    for (const step of seq.steps)
      if (step.status === 'pending' && (!best || Date.parse(step.at) < Date.parse(best.step.at))) best = { seq, step }
  return best
}

/** Splits an agent message into chat bubbles on blank lines. */
export function bubbles(text) {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}

/** Lead stage for the console's pipeline strip. */
export function stage(state) {
  if (state.orders.length > 1) return 'recurrente'
  if (state.orders.length === 1) return 'compro'
  if (state.log.some((e) => e.topic === 'checkouts/create')) return 'checkout'
  if (state.messages.some((m) => m.kind === 'link')) return 'link'
  if (state.lead) return 'calificado'
  return 'nuevo'
}
