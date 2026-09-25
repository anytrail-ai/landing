// Pure state for the siniestros demo: every WhatsApp message that arrives is
// classified (by the backend model, or by the seeded answer for scripted
// messages) and this module decides which expediente it lands in. No DOM, no
// fetch: the page owns timing and I/O, this owns the rules, so the rules are
// testable.

export const REQUIRED_FIELDS = [
  ['numero', 'Número de siniestro'],
  ['poliza', 'Número de póliza'],
  ['aseguradora', 'Aseguradora'],
  ['fecha', 'Fecha del siniestro'],
  ['ubicacion', 'Ubicación'],
  ['ajustador', 'Ajustador'],
]

// Documents an expediente needs before it can go to the insurer.
export const REQUIRED_DOCS = [
  ['poliza', 'Póliza'],
  ['reporte', 'Reporte del ajustador'],
  ['cotizacion', 'Cotización del taller'],
]

export const MIN_PHOTOS = 4

export const FIELD_LABELS = {
  numero: 'Número de siniestro',
  poliza: 'Póliza',
  placas: 'Placas',
  aseguradora: 'Aseguradora',
  fecha: 'Fecha',
  ubicacion: 'Ubicación',
  ajustador: 'Ajustador',
  asegurado: 'Asegurado',
  vehiculo: 'Vehículo',
  monto: 'Monto cotizado',
}

export const DOC_KIND_LABELS = {
  poliza: 'Póliza',
  reporte: 'Reporte',
  cotizacion: 'Cotización',
  identificacion: 'Identificación',
  otro_documento: 'Documento',
}

// Manual states an operator can set. Everything else is derived from what is
// still missing, so the list never lies about completeness.
export const MANUAL_STATUSES = {
  enviado: 'Enviado a aseguradora',
  cerrado: 'Cerrado',
}

// In a group several cases are discussed at once, so an unlabelled photo only
// inherits the group's last case if it follows closely. A private chat is
// usually one person on one case, so it keeps its case much longer.
const CONTEXT_WINDOW_MS = { group: 15 * 60 * 1000, private: 6 * 60 * 60 * 1000 }

// Items waiting in "Por revisar" are pulled into a case created from the same
// chat shortly after (the asegurado writes first, sends the póliza second).
const ORPHAN_ADOPT_MS = 2 * 60 * 60 * 1000

export const emptyState = () => ({
  chats: {},
  chatOrder: [],
  messages: {},
  messageOrder: [],
  expedientes: {},
  expedienteOrder: [],
  nextExpediente: 1,
  // chatId -> { expedienteId, at } of the last message placed in a case.
  chatContext: {},
  // Last filing decision, plus a short log of them (with a sequence number)
  // the UI turns into toasts and row flashes without effects of its own.
  lastEvent: null,
  events: [],
  eventSeq: 0,
})

export const expTitle = (exp) => exp.numero ?? (exp.poliza ? `Póliza ${exp.poliza}` : 'Sin número')

export const norm = (v) =>
  String(v ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')

const words = (v) =>
  String(v ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 1)

// "Nissan Versa" matches "Nissan Versa 2021"; "Versa" alone matches too.
// Every word of the shorter side must appear in the longer side.
function looseMatch(a, b) {
  const wa = words(a)
  const wb = words(b)
  if (!wa.length || !wb.length) return false
  const [short, long] = wa.length <= wb.length ? [wa, wb] : [wb, wa]
  return short.every((w) => long.includes(w))
}

const ms = (iso) => new Date(iso).getTime()

// Strong identifiers first; asegurado and vehículo only when they point at
// exactly one case, since two open claims can share a car model.
export function findExpediente(state, cls) {
  const exps = state.expedienteOrder.map((id) => state.expedientes[id])
  const ids = cls.identifiers ?? {}
  for (const key of ['numero', 'poliza', 'placas']) {
    const v = norm(ids[key])
    if (!v) continue
    const hit = exps.find((e) => norm(e[key]) === v)
    if (hit) return hit.id
  }
  const f = cls.fields ?? {}
  for (const key of ['asegurado', 'vehiculo']) {
    if (!f[key]) continue
    const hits = exps.filter((e) => e[key] && looseMatch(e[key], f[key]))
    if (hits.length === 1) return hits[0].id
  }
  return null
}

const hasIdentifier = (cls) =>
  Boolean(cls.identifiers?.numero || cls.identifiers?.poliza || cls.identifiers?.placas)

const compatible = (exp, cls) =>
  ['numero', 'poliza', 'placas'].every((k) => !cls.identifiers?.[k] || !exp[k] || norm(exp[k]) === norm(cls.identifiers[k]))

function contextFor(state, message) {
  const ctx = state.chatContext[message.chatId]
  if (!ctx) return null
  const chat = state.chats[message.chatId]
  const window = chat?.isGroup ? CONTEXT_WINDOW_MS.group : CONTEXT_WINDOW_MS.private
  return ms(message.at) - ms(ctx.at) <= window ? ctx.expedienteId : null
}

function newExpediente(state, at) {
  const id = `exp-${state.nextExpediente}`
  const exp = {
    id,
    numero: null,
    poliza: null,
    placas: null,
    aseguradora: null,
    fecha: null,
    ubicacion: null,
    ajustador: null,
    asegurado: null,
    vehiculo: null,
    monto: null,
    manualStatus: null,
    createdAt: at,
    updatedAt: at,
    items: [],
    // field -> messageId that filled it, shown as "de: <archivo>, <quién>".
    sources: {},
  }
  return {
    ...state,
    nextExpediente: state.nextExpediente + 1,
    expedientes: { ...state.expedientes, [id]: exp },
    expedienteOrder: [id, ...state.expedienteOrder],
  }
}

// Fills only empty fields: the first document that states a value wins, and a
// later chat message never silently overwrites what the póliza said.
function mergeInto(exp, cls, messageId) {
  const next = { ...exp, sources: { ...exp.sources } }
  const values = { ...(cls.fields ?? {}), ...(cls.identifiers ?? {}) }
  for (const [key, value] of Object.entries(values)) {
    if (!(key in FIELD_LABELS) || value == null || value === '') continue
    if (next[key] == null || next[key] === '') {
      next[key] = value
      next.sources[key] = messageId
    }
  }
  return next
}

function place(state, messageId, expedienteId, assignment) {
  const message = state.messages[messageId]
  const exp = state.expedientes[expedienteId]
  const items = exp.items.includes(messageId) ? exp.items : [...exp.items, messageId]
  const merged = mergeInto({ ...exp, items, updatedAt: message.at }, message.classification ?? {}, messageId)
  return {
    ...state,
    messages: {
      ...state.messages,
      [messageId]: { ...message, expedienteId, assignment },
    },
    expedientes: { ...state.expedientes, [expedienteId]: merged },
    chatContext: {
      ...state.chatContext,
      [message.chatId]: { expedienteId, at: message.at },
    },
  }
}

function adoptOrphans(state, expedienteId, fromMessage) {
  let next = state
  for (const id of state.messageOrder) {
    const m = state.messages[id]
    if (
      m.assignment === 'revisar' &&
      m.chatId === fromMessage.chatId &&
      m.id !== fromMessage.id &&
      ms(fromMessage.at) - ms(m.at) <= ORPHAN_ADOPT_MS &&
      ms(fromMessage.at) >= ms(m.at)
    ) {
      next = place(next, id, expedienteId, 'contexto')
    }
  }
  // Adoption must not move the chat's context back to an older message.
  return {
    ...next,
    chatContext: {
      ...next.chatContext,
      [fromMessage.chatId]: { expedienteId, at: fromMessage.at },
    },
  }
}

export function classify(state, messageId, cls) {
  const message = state.messages[messageId]
  if (!message) return state
  let next = {
    ...state,
    messages: {
      ...state.messages,
      [messageId]: { ...message, status: 'done', classification: cls },
    },
  }
  if (!cls.relevant) {
    next.messages[messageId] = { ...next.messages[messageId], assignment: 'irrelevante' }
    return { ...next, lastEvent: { type: 'ignored', messageId } }
  }

  const known = cls.matchId && next.expedientes[cls.matchId] ? cls.matchId : null
  const matched = known ?? findExpediente(next, cls)
  if (matched) {
    next = place(next, messageId, matched, 'identificador')
    return { ...next, lastEvent: { type: 'placed', messageId, expedienteId: matched, how: 'identificador' } }
  }
  // New identifiers in a chat already working a case (the asegurado opens
  // with the siniestro number, then sends the póliza) belong to that case,
  // unless they contradict it: a different number means a different claim.
  const ctx = contextFor(next, message)
  if (ctx && next.expedientes[ctx] && hasIdentifier(cls) && compatible(next.expedientes[ctx], cls)) {
    next = place(next, messageId, ctx, 'contexto')
    return { ...next, lastEvent: { type: 'placed', messageId, expedienteId: ctx, how: 'contexto' } }
  }
  if (hasIdentifier(cls)) {
    next = newExpediente(next, message.at)
    const id = next.expedienteOrder[0]
    next = place(next, messageId, id, 'nuevo')
    next = adoptOrphans(next, id, message)
    return { ...next, lastEvent: { type: 'created', messageId, expedienteId: id, how: 'nuevo' } }
  }
  if (ctx && next.expedientes[ctx]) {
    next = place(next, messageId, ctx, 'contexto')
    return { ...next, lastEvent: { type: 'placed', messageId, expedienteId: ctx, how: 'contexto' } }
  }
  next.messages[messageId] = { ...next.messages[messageId], assignment: 'revisar', expedienteId: null }
  return { ...next, lastEvent: { type: 'review', messageId } }
}

const EVENT_LOG = 12

export function reducer(state, action) {
  const next = step(state, action)
  if (next.lastEvent === state.lastEvent || !next.lastEvent || next.lastEvent.type === 'ignored') return next
  const seq = state.eventSeq + 1
  return { ...next, eventSeq: seq, events: [...state.events, { ...next.lastEvent, seq }].slice(-EVENT_LOG) }
}

function step(state, action) {
  switch (action.type) {
    case 'reset':
      return action.state ?? emptyState()
    case 'chats': {
      const chats = { ...state.chats }
      const chatOrder = [...state.chatOrder]
      for (const c of action.chats) {
        chats[c.id] = { unread: 0, ...c }
        if (!chatOrder.includes(c.id)) chatOrder.push(c.id)
      }
      return { ...state, chats, chatOrder }
    }
    case 'receive': {
      const m = { status: 'processing', expedienteId: null, assignment: null, classification: null, ...action.message }
      const chat = state.chats[m.chatId]
      return {
        ...state,
        messages: { ...state.messages, [m.id]: m },
        messageOrder: [...state.messageOrder, m.id],
        chats: {
          ...state.chats,
          [m.chatId]: {
            ...chat,
            lastAt: m.at,
            unread: action.read || m.outgoing ? chat.unread : chat.unread + 1,
          },
        },
        // Most recent conversation on top, like the app.
        chatOrder: [m.chatId, ...state.chatOrder.filter((c) => c !== m.chatId)],
      }
    }
    case 'classified':
      return classify(state, action.messageId, action.classification)
    case 'read': {
      const chat = state.chats[action.chatId]
      if (!chat || chat.unread === 0) return state
      return { ...state, chats: { ...state.chats, [action.chatId]: { ...chat, unread: 0 } } }
    }
    case 'assign': {
      const m = state.messages[action.messageId]
      if (!m) return state
      let next = state
      let target = action.expedienteId
      if (target === 'new') {
        next = newExpediente(next, m.at)
        target = next.expedienteOrder[0]
      }
      // Moving between cases: take it out of the old one first.
      if (m.expedienteId && m.expedienteId !== target) {
        const old = next.expedientes[m.expedienteId]
        next = {
          ...next,
          expedientes: {
            ...next.expedientes,
            [old.id]: { ...old, items: old.items.filter((i) => i !== m.id) },
          },
        }
      }
      next = place(next, m.id, target, 'manual')
      return { ...next, lastEvent: { type: 'placed', messageId: m.id, expedienteId: target, how: 'manual' } }
    }
    case 'discard': {
      const m = state.messages[action.messageId]
      if (!m) return state
      return {
        ...state,
        messages: { ...state.messages, [m.id]: { ...m, assignment: 'irrelevante' } },
      }
    }
    case 'status': {
      const exp = state.expedientes[action.expedienteId]
      if (!exp) return state
      return {
        ...state,
        expedientes: {
          ...state.expedientes,
          [exp.id]: { ...exp, manualStatus: action.status || null },
        },
      }
    }
    default:
      return state
  }
}

// ---- selectors -------------------------------------------------------------

export function itemsOf(state, exp) {
  const msgs = exp.items.map((id) => state.messages[id]).filter(Boolean)
  msgs.sort((a, b) => ms(a.at) - ms(b.at))
  return {
    all: msgs,
    photos: msgs.filter((m) => m.attachment?.type === 'photo'),
    docs: msgs.filter((m) => m.attachment?.type === 'doc'),
  }
}

export function pendientes(state, exp) {
  const out = []
  for (const [key, label] of REQUIRED_FIELDS) {
    if (!exp[key]) out.push({ key, label, type: 'field' })
  }
  const { photos, docs } = itemsOf(state, exp)
  for (const [kind, label] of REQUIRED_DOCS) {
    if (!docs.some((d) => d.classification?.kind === kind)) out.push({ key: `doc:${kind}`, label, type: 'doc' })
  }
  if (photos.length < MIN_PHOTOS) {
    const missing = MIN_PHOTOS - photos.length
    out.push({
      key: 'photos',
      label: `${missing} ${missing === 1 ? 'foto más' : 'fotos más'} (mínimo ${MIN_PHOTOS})`,
      type: 'photos',
    })
  }
  return out
}

export const STATUS_LABELS = {
  nuevo: 'Nuevo',
  integracion: 'En integración',
  completo: 'Completo',
  ...MANUAL_STATUSES,
}

export function statusOf(state, exp) {
  if (exp.manualStatus) return exp.manualStatus
  const missing = pendientes(state, exp).length
  if (missing === 0) return 'completo'
  return exp.items.length <= 1 ? 'nuevo' : 'integracion'
}

export const reviewQueue = (state) =>
  state.messageOrder
    .map((id) => state.messages[id])
    .filter((m) => m.assignment === 'revisar')

export function searchExpedientes(state, { q = '', aseguradora = '', estatus = '', desde = '', hasta = '' } = {}) {
  const needle = norm(q)
  return state.expedienteOrder
    .map((id) => state.expedientes[id])
    .filter((e) => {
      if (aseguradora && e.aseguradora !== aseguradora) return false
      if (estatus && statusOf(state, e) !== estatus) return false
      if (desde && (!e.fecha || e.fecha < desde)) return false
      if (hasta && (!e.fecha || e.fecha > hasta)) return false
      if (!needle) return true
      return ['numero', 'poliza', 'placas', 'asegurado', 'vehiculo', 'aseguradora', 'ajustador', 'ubicacion'].some((k) =>
        norm(e[k]).includes(needle),
      )
    })
}
