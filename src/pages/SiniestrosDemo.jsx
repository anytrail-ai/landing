import { useCallback, useEffect, useMemo, useReducer, useRef, useState, useSyncExternalStore } from 'react'
import { Pause, Play, RotateCcw, SkipForward } from 'lucide-react'
import { emptyState, expTitle, reducer } from './siniestros/engine'
import { CHATS, HISTORY_STATUS, scenarioFor } from './siniestros/scenario'
import { classifyLive } from './siniestros/api'
import WhatsAppSim from './siniestros/WhatsAppSim'
import Platform from './siniestros/Platform'
import './SiniestrosDemo.css'

// Claims demo for Delpur: a simulated WhatsApp Business phone on the left
// stands in for their real number in coexistence, and the Siniestros
// platform on the right files every photo, document and message into its
// expediente. The scripted morning plays from seeded answers; anything the
// presenter types or uploads goes to the live classifier (demo-backend
// POST /demo/siniestros/classify), with a pattern fallback when offline.

const STEP_MS = 2200
// Consecutive photos from the same person arrive as a burst, like the app.
const BURST_MS = 700
const CLASSIFY_MS = 900

function initialState(scenario) {
  let s = reducer(emptyState(), { type: 'chats', chats: CHATS })
  for (const m of scenario.history) {
    const { cls, ...message } = m
    s = reducer(s, { type: 'receive', message, read: true })
    s = reducer(s, { type: 'classified', messageId: m.id, classification: cls })
  }
  for (const { numero, status } of HISTORY_STATUS) {
    const id = s.expedienteOrder.find((e) => s.expedientes[e].numero === numero)
    if (id) s = reducer(s, { type: 'status', expedienteId: id, status })
  }
  // History is on file already: no toasts or flashes for it.
  return { ...s, lastEvent: null, events: [] }
}

const KIND_LABELS = { foto: 'Foto', poliza: 'Póliza', reporte: 'Reporte', cotizacion: 'Cotización', identificacion: 'Identificación', otro_documento: 'Documento', mensaje: 'Mensaje' }
const HOW = { identificador: 'por identificador', contexto: 'por contexto', manual: 'asignado a mano', nuevo: 'nuevo' }

function nowIso() {
  const d = new Date()
  const off = -d.getTimezoneOffset()
  const pad = (n) => String(Math.floor(Math.abs(n))).padStart(2, '0')
  const local = new Date(d.getTime() + off * 60000).toISOString().slice(0, 19)
  return `${local}${off >= 0 ? '+' : '-'}${pad(off / 60)}:${pad(off % 60)}`
}

function Demo() {
  const [scenario] = useState(() => scenarioFor(new Date()))
  const [state, dispatch] = useReducer(reducer, scenario, initialState)
  const [cursor, setCursor] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [follow, setFollow] = useState(true)
  const [openChat, setOpenChat] = useState(null)
  const [openExp, setOpenExp] = useState(null)
  const [dismissed, setDismissed] = useState(() => new Set())
  const timers = useRef(new Set())

  const later = useCallback((fn, ms) => {
    const t = setTimeout(() => {
      timers.current.delete(t)
      fn()
    }, ms)
    timers.current.add(t)
  }, [])

  const live = scenario.live
  const done = cursor >= live.length
  const isPlaying = playing && !done

  const step = useCallback(() => {
    const m = live[cursor]
    if (!m) return
    const { cls, ...message } = m
    const viewing = follow || openChat === m.chatId
    if (follow) setOpenChat(m.chatId)
    dispatch({ type: 'receive', message, read: viewing })
    later(() => dispatch({ type: 'classified', messageId: m.id, classification: cls }), CLASSIFY_MS)
    setCursor((c) => c + 1)
  }, [cursor, follow, later, live, openChat])

  useEffect(() => {
    if (!isPlaying) return
    const prev = live[cursor - 1]
    const next = live[cursor]
    const burst = prev && prev.chatId === next.chatId && prev.sender === next.sender && next.attachment?.type === 'photo'
    const t = setTimeout(step, cursor === 0 ? 300 : burst ? BURST_MS : STEP_MS)
    return () => clearTimeout(t)
  }, [isPlaying, cursor, step, live])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  // Toasts and row flashes both come from the engine's event log.
  const toasts = useMemo(
    () =>
      state.events
        .filter((ev) => !dismissed.has(ev.seq))
        .slice(-4)
        .map((ev) => {
          const m = state.messages[ev.messageId]
          const exp = ev.expedienteId ? state.expedientes[ev.expedienteId] : null
          const kind = KIND_LABELS[m?.classification?.kind] ?? 'Mensaje'
          const text =
            ev.type === 'created'
              ? `Expediente nuevo: ${expTitle(exp)}${exp.aseguradora ? ` · ${exp.aseguradora}` : ''}`
              : ev.type === 'review'
                ? `${kind} de ${m.sender.split(' · ')[0]} sin datos suficientes → Por revisar`
                : `${kind} → ${expTitle(exp)} (${HOW[ev.how]})`
          return { seq: ev.seq, text, tone: ev.type, expedienteId: ev.expedienteId }
        }),
    [state.events, state.messages, state.expedientes, dismissed],
  )
  const flash = useMemo(() => {
    const f = {}
    for (const ev of state.events) if (ev.expedienteId) f[ev.expedienteId] = ev.seq
    return f
  }, [state.events])

  const lastSeq = state.events.at(-1)?.seq
  useEffect(() => {
    if (lastSeq == null) return
    later(() => setDismissed((d) => new Set(d).add(lastSeq)), 4200)
  }, [lastSeq, later])

  const reset = () => {
    timers.current.forEach(clearTimeout)
    timers.current.clear()
    setPlaying(false)
    setCursor(0)
    setOpenChat(null)
    setOpenExp(null)
    setDismissed(new Set())
    dispatch({ type: 'reset', state: initialState(scenario) })
  }

  const openChatAndRead = (id) => {
    setOpenChat(id)
    if (id) dispatch({ type: 'read', chatId: id })
  }

  const sendLive = async (chatId, { sender, text, file }) => {
    const id = `u-${Date.now()}`
    const attachment = file
      ? {
          type: file.type.startsWith('image/') ? 'photo' : 'doc',
          name: file.name,
          mime: file.type || 'application/octet-stream',
          blob: file,
          url: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        }
      : undefined
    const message = { id, chatId, sender, outgoing: sender === 'Tú', at: nowIso(), text, attachment }
    dispatch({ type: 'receive', message, read: true })
    const recent = state.messageOrder
      .map((mid) => state.messages[mid])
      .filter((m) => m.chatId === chatId)
      .slice(-8)
    const expedientes = state.expedienteOrder.map((eid) => state.expedientes[eid])
    const cls = await classifyLive({ chat: state.chats[chatId], message, recent, expedientes })
    dispatch({ type: 'classified', messageId: id, classification: cls })
  }

  const newChat = (name) => {
    const id = `c-${Date.now()}`
    dispatch({ type: 'chats', chats: [{ id, name, subtitle: 'Nuevo contacto' }] })
    setOpenChat(id)
  }

  return (
    <div className="sin-app">
      <header className="sin-bar">
        <div className="sin-brand">
          <img src="/anytrail-mark.png" alt="" width="26" height="26" />
          <strong>Siniestros</strong>
          <span className="sin-client">Delpur</span>
        </div>
        <div className="sin-player">
          <button className="sin-btn" onClick={() => setPlaying(!isPlaying)} disabled={done}>
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            {isPlaying ? 'Pausa' : done ? 'Fin del guion' : cursor === 0 ? 'Reproducir mañana' : 'Continuar'}
          </button>
          <button className="sin-btn sin-btn--ghost" onClick={step} disabled={done || isPlaying} aria-label="Siguiente mensaje">
            <SkipForward size={16} /> Siguiente
          </button>
          <button className="sin-btn sin-btn--ghost" onClick={reset} aria-label="Reiniciar">
            <RotateCcw size={16} />
          </button>
          <span className="sin-progress">
            <span style={{ width: `${(cursor / live.length) * 100}%` }} />
          </span>
          <span className="sin-progress-label">
            {cursor}/{live.length}
          </span>
          <label className="sin-follow">
            <input type="checkbox" checked={follow} onChange={(e) => setFollow(e.target.checked)} /> Seguir chat
          </label>
        </div>
      </header>

      <div className="sin-body">
        <aside className="sin-phone-col">
          <WhatsAppSim
            state={state}
            today={scenario.today}
            openChatId={openChat}
            onOpenChat={openChatAndRead}
            onSend={sendLive}
            onNewChat={newChat}
          />
          <p className="sin-phone-note">
            WhatsApp simulado para la demostración. En producción es su número actual conectado a la API oficial de Meta: el
            equipo sigue usando la app como hoy.
          </p>
        </aside>
        <main className="sin-main">
          <Platform state={state} dispatch={dispatch} flash={flash} openExpId={openExp} onOpenExp={setOpenExp} />
          <div className="sin-toasts" aria-live="polite">
            {toasts.map((t) => (
              <button
                key={t.seq}
                className={`sin-toast sin-toast--${t.tone}`}
                onClick={() => t.expedienteId && setOpenExp(t.expedienteId)}
              >
                {t.text}
              </button>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

// Client-only: the scenario is dated relative to today and the page reads
// files, canvas and object URLs, none of which exist in the prerender.
const noSubscribe = () => () => {}

export default function SiniestrosDemo() {
  const mounted = useSyncExternalStore(noSubscribe, () => true, () => false)
  return mounted ? <Demo /> : <div className="sin-app sin-app--loading" />
}
