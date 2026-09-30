// Pure state for /es/celdas_demo: every SSE event from the agent is one
// action, so the page is a replay of the stream and a failed turn can roll
// back to the snapshot taken before it.
//
// chat:  what the customer sees in WhatsApp, in order
//   { kind: 'user' | 'agent', text } | { kind: 'pdf', folio, filename, url, totalUsd } | { kind: 'email', to, folio }
// trace: what the reasoning panel shows, one entry per customer turn
//   { userText, steps: [{ kind: 'thinking', text, done } | { kind: 'tool', id, name, input, calc, ok, label, result }] }

export const initialState = { sessionId: null, chat: [], trace: [], handoff: null, quote: null, busy: false }

const lastTurn = (trace) => trace[trace.length - 1]

function updateTurn(state, fn) {
  const trace = state.trace.slice()
  const turn = lastTurn(trace)
  if (!turn) return state
  trace[trace.length - 1] = fn({ ...turn, steps: turn.steps.slice() })
  return { ...state, trace }
}

function updateTool(state, id, patch) {
  return updateTurn(state, (turn) => {
    const i = turn.steps.findIndex((s) => s.kind === 'tool' && s.id === id)
    if (i !== -1) turn.steps[i] = { ...turn.steps[i], ...patch }
    return turn
  })
}

export function reducer(state, action) {
  switch (action.type) {
    case 'send':
      return {
        ...state,
        busy: true,
        chat: [...state.chat, { kind: 'user', text: action.text, time: action.time }],
        trace: [...state.trace, { userText: action.text, steps: [] }],
      }
    case 'session':
      return { ...state, sessionId: action.sessionId }
    case 'thinking_start':
      return updateTurn(state, (turn) => {
        turn.steps.push({ kind: 'thinking', text: '', done: false })
        return turn
      })
    case 'thinking':
      return updateTurn(state, (turn) => {
        const last = turn.steps[turn.steps.length - 1]
        if (last?.kind === 'thinking' && !last.done) turn.steps[turn.steps.length - 1] = { ...last, text: last.text + action.text }
        else turn.steps.push({ kind: 'thinking', text: action.text, done: false })
        return turn
      })
    case 'thinking_end':
      return updateTurn(state, (turn) => {
        turn.steps = turn.steps.map((s) => (s.kind === 'thinking' ? { ...s, done: true } : s))
        return turn
      })
    case 'delta': {
      const chat = state.chat.slice()
      const last = chat[chat.length - 1]
      if (last?.kind === 'agent') chat[chat.length - 1] = { ...last, text: last.text + action.text }
      else chat.push({ kind: 'agent', text: action.text })
      return { ...state, chat }
    }
    case 'tool':
      return updateTurn(state, (turn) => {
        turn.steps.push({ kind: 'tool', id: action.id, name: action.name, input: action.input, calc: null, ok: null, label: null })
        return turn
      })
    case 'calc': {
      const turn = lastTurn(state.trace)
      const tool = turn && [...turn.steps].reverse().find((s) => s.kind === 'tool' && s.ok === null)
      return tool ? updateTool(state, tool.id, { calc: action.explanation }) : state
    }
    case 'tool_result':
      return updateTool(state, action.id, { ok: action.ok, label: action.label, result: action.result })
    case 'quote':
      return {
        ...state,
        quote: action.quote,
        chat: [...state.chat, { kind: 'pdf', folio: action.quote.folio, filename: action.filename, url: action.url, totalUsd: action.quote.totalUsd }],
      }
    case 'email':
      return { ...state, chat: [...state.chat, { kind: 'email', to: action.to, folio: action.folio }] }
    case 'handoff':
      return { ...state, handoff: action.handoff }
    case 'done':
      return { ...state, busy: false }
    case 'rollback':
      return { ...action.snapshot, busy: false }
    case 'reset':
      return initialState
    default:
      return state
  }
}

/** Splits an agent message into WhatsApp bubbles on blank lines. */
export function bubbles(text) {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}
