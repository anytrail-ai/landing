import { useEffect, useReducer, useRef, useState } from 'react'
import { Brain, Calculator, Check, FileText, Mail, RotateCcw, Send, TriangleAlert, UserRound, X } from 'lucide-react'
import { celdasTurn, pdfUrl, usd } from './celdas/api'
import { bubbles, initialState, reducer } from './celdas/state'
import './CeldasDemo.css'

// Load-cell quoting agent demo (Utilcell 350N). The visitor plays the
// customer on the WhatsApp side; the right side shows what the agent is
// thinking, which tools it calls and the handoff a salesperson receives. The
// quote PDF arrives in the chat and by email. Backend: demo-backend
// src/celdas (action 'celdas_chat' on the streaming Function URL).

const COMPANY = 'IPPSA'

const STARTERS = [
  { label: 'Báscula nueva', text: 'Hola, necesito celdas para una báscula de piso nueva de 5,000 lb que vamos a armar en planta.' },
  { label: 'Reemplazo', text: 'Buenas, se me dañó una celda Revere 5123 en una báscula de plataforma de 4 celdas. ¿Tienen reemplazo?' },
  { label: 'Área de lavado', text: 'Necesito cotizar 4 celdas de 2,000 lb para una báscula en el área de lavado de una planta de alimentos.' },
]

const TOOL_NAMES = {
  dimensionar_celdas: 'Dimensionar celdas',
  generar_cotizacion: 'Generar cotización PDF',
  enviar_cotizacion_por_correo: 'Enviar por correo',
  entregar_a_vendedor: 'Entregar a vendedor',
}
const TOOL_ICONS = { dimensionar_celdas: Calculator, generar_cotizacion: FileText, enviar_cotizacion_por_correo: Mail, entregar_a_vendedor: UserRound }

const ERRORS = {
  rate_limited: 'Se alcanzó el límite de mensajes de la demo por hoy.',
  session_full: 'Esta conversación llegó a su límite. Reiníciela para empezar otra.',
  unknown_session: 'La sesión expiró. Reinicie la conversación.',
}

function time() {
  return new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
}

function toolSummary(name, input) {
  if (!input || typeof input !== 'object') return null
  if (name === 'dimensionar_celdas') {
    const u = input.unidad ?? 'lb'
    return `${input.capacidad_maxima} ${u} + ${input.peso_muerto} ${u} de peso muerto · ${input.num_celdas} celdas · ${input.impacto ? 'con impacto' : 'sin impacto'}`
  }
  if (name === 'generar_cotizacion') {
    const lines = (input.partidas ?? []).map((p) => `${p.cantidad} × ${p.numero_parte}`).join(', ')
    return [lines, input.cliente?.email].filter(Boolean).join(' · ')
  }
  if (name === 'enviar_cotizacion_por_correo') return input.folio
  if (name === 'entregar_a_vendedor') return [input.decision, input.producto_referido].filter(Boolean).join(' → ')
  return null
}

function Chat({ state, onSend, error }) {
  const [draft, setDraft] = useState('')
  const [preview, setPreview] = useState(null)
  const body = useRef(null)
  const input = useRef(null)

  useEffect(() => {
    // Instant, not smooth: streamed deltas re-fire this faster than a smooth
    // scroll finishes, and each new one cancels the last short of the bottom.
    if (body.current) body.current.scrollTop = body.current.scrollHeight
  }, [state.chat, state.busy])

  useEffect(() => {
    if (!state.busy) input.current?.focus()
  }, [state.busy])

  function submit(e) {
    e.preventDefault()
    const text = draft.trim()
    if (!text || state.busy) return
    setDraft('')
    onSend(text).then((ok) => ok || setDraft(text))
  }

  const last = state.chat[state.chat.length - 1]
  const waiting = state.busy && last?.kind !== 'agent'

  return (
    <section className="cd-phone" aria-label="Conversación de WhatsApp">
      <header className="cd-wa-head">
        <div className="cd-avatar" aria-hidden="true">{COMPANY.slice(0, 1)}</div>
        <div>
          <div className="cd-wa-name">Ventas · {COMPANY}</div>
          <div className="cd-wa-status">{state.busy ? 'escribiendo…' : 'en línea'}</div>
        </div>
      </header>

      <div className="cd-wa-body" ref={body}>
        {state.chat.length === 0 && (
          <div className="cd-empty">
            <p>Usted es el cliente. Escriba como le escribiría a su proveedor, o empiece con uno de estos casos:</p>
            {STARTERS.map((s) => (
              <button key={s.label} type="button" className="cd-starter" onClick={() => { setDraft(s.text); input.current?.focus() }}>
                <strong>{s.label}</strong>
                <span>{s.text}</span>
              </button>
            ))}
          </div>
        )}

        {state.chat.map((m, i) => {
          if (m.kind === 'user')
            return (
              <div key={i} className="cd-bubble cd-out">
                {m.text}
                <span className="cd-time">{m.time}</span>
              </div>
            )
          if (m.kind === 'agent')
            return bubbles(m.text).map((part, j) => (
              <div key={`${i}-${j}`} className="cd-bubble cd-in">
                {part}
              </div>
            ))
          if (m.kind === 'pdf')
            return (
              <div key={i} className="cd-bubble cd-in cd-doc">
                <button type="button" className="cd-doc-card" onClick={() => setPreview(m)}>
                  <span className="cd-doc-icon" aria-hidden="true">PDF</span>
                  <span className="cd-doc-meta">
                    <strong>{m.filename}</strong>
                    <span>1 página · {usd(m.totalUsd)}</span>
                  </span>
                </button>
                <div className="cd-doc-actions">
                  <button type="button" onClick={() => setPreview(m)}>Ver</button>
                  <a href={m.url} download={m.filename}>Descargar</a>
                </div>
              </div>
            )
          if (m.kind === 'email')
            return (
              <div key={i} className="cd-system">
                <Mail size={14} aria-hidden="true" /> Cotización {m.folio} enviada a {m.to}
              </div>
            )
          return null
        })}

        {waiting && (
          <div className="cd-bubble cd-in cd-dots" aria-label="El agente está escribiendo">
            <i />
            <i />
            <i />
          </div>
        )}
        {error && <p className="cd-error">{error}</p>}
      </div>

      <form className="cd-wa-input" onSubmit={submit}>
        <textarea
          ref={input}
          rows={1}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) submit(e)
          }}
          placeholder="Escriba un mensaje"
          aria-label="Mensaje"
          disabled={state.busy}
        />
        <button type="submit" className="cd-send" disabled={state.busy || !draft.trim()} aria-label="Enviar">
          <Send size={18} />
        </button>
      </form>

      {preview && (
        <div className="cd-modal" role="dialog" aria-label={`Cotización ${preview.folio}`} onClick={() => setPreview(null)}>
          <div className="cd-modal-box" onClick={(e) => e.stopPropagation()}>
            <header>
              <strong>{preview.filename}</strong>
              <a href={preview.url} download={preview.filename}>Descargar</a>
              <button type="button" onClick={() => setPreview(null)} aria-label="Cerrar">
                <X size={18} />
              </button>
            </header>
            <object data={preview.url} type="application/pdf" aria-label="Vista previa del PDF">
              <p className="cd-modal-fallback">
                Su navegador no muestra PDF aquí. <a href={preview.url} download={preview.filename}>Descárguelo</a>.
              </p>
            </object>
          </div>
        </div>
      )}
    </section>
  )
}

function Step({ step, live }) {
  if (step.kind === 'thinking')
    return (
      <div className={`cd-step cd-think${step.done ? '' : ' is-live'}`}>
        <Brain size={15} aria-hidden="true" />
        <p>{step.text || '…'}</p>
      </div>
    )
  const Icon = TOOL_ICONS[step.name] ?? Check
  const summary = toolSummary(step.name, step.input)
  const state = step.ok === null ? 'running' : step.ok ? 'ok' : 'error'
  return (
    <div className={`cd-step cd-tool is-${state}`}>
      <div className="cd-tool-head">
        <Icon size={15} aria-hidden="true" />
        <strong>{TOOL_NAMES[step.name] ?? step.name}</strong>
        <span className="cd-tool-state">
          {state === 'running' ? (live ? 'ejecutando…' : '—') : state === 'ok' ? step.label : `Rechazado: ${step.label}`}
        </span>
      </div>
      {summary && <div className="cd-tool-input">{summary}</div>}
      {step.calc && <pre className="cd-calc">{step.calc}</pre>}
      {state === 'error' && step.result?.error && <div className="cd-tool-err">{String(step.result.error)}</div>}
    </div>
  )
}

function Handoff({ handoff, quote }) {
  const tone = handoff.decision === 'Cotizar 350N' ? 'quote' : handoff.decision === 'Escalar a humano' ? 'escalate' : 'refer'
  return (
    <section className={`cd-handoff is-${tone}`} aria-label="Entrega al vendedor">
      <div className="cd-handoff-top">
        <span className="cd-kicker">Entrega al vendedor</span>
        <span className="cd-decision">{handoff.decision}</span>
      </div>
      <dl>
        <dt>Aplicación</dt>
        <dd>{handoff.summary.application}</dd>
        <dt>Ambiente</dt>
        <dd>{handoff.summary.environment}</dd>
        <dt>Reemplazo o nuevo</dt>
        <dd>{handoff.summary.replacementOrNew}</dd>
        {handoff.referral && (
          <>
            <dt>Referir a</dt>
            <dd>{handoff.referral}</dd>
          </>
        )}
        {quote && handoff.quoteFolio === quote.folio && (
          <>
            <dt>Cotización</dt>
            <dd>
              {quote.lines.map((l) => (
                <div key={l.partNumber}>
                  {l.qty} × {l.partNumber} a {usd(l.unitUsd)} = {usd(l.totalUsd)}
                </div>
              ))}
              <strong>Total {usd(quote.totalUsd)}</strong> · folio {quote.folio}
              {quote.extras.length > 0 && <div className="cd-muted">Adicionales: {quote.extras.join(', ')}</div>}
            </dd>
          </>
        )}
      </dl>
      {handoff.pending.length > 0 && (
        <div className="cd-list">
          <span className="cd-kicker">Pendientes</span>
          <ul>
            {handoff.pending.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      )}
      {handoff.alerts.length > 0 && (
        <div className="cd-list cd-alerts">
          <span className="cd-kicker">
            <TriangleAlert size={13} aria-hidden="true" /> Alertas
          </span>
          <ul>
            {handoff.alerts.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

function Reasoning({ state }) {
  const scroller = useRef(null)
  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight
  }, [state.trace, state.handoff])

  return (
    <section className="cd-mind" aria-label="Razonamiento del agente">
      <header className="cd-mind-head">
        <h2>Lo que piensa el agente</h2>
        <p>Su razonamiento, los cálculos que hace y lo que le entrega al vendedor. El cliente solo ve el chat.</p>
      </header>
      <div className="cd-trace" ref={scroller}>
        {state.trace.length === 0 && (
          <p className="cd-muted cd-trace-empty">
            Cuando el cliente escriba, aquí aparece cómo el agente aplica el árbol de decisión: qué pregunta falta, qué descarta y por qué.
          </p>
        )}
        {state.trace.map((turn, i) => {
          const live = state.busy && i === state.trace.length - 1
          return (
            <article key={i} className="cd-turn">
              <div className="cd-turn-user">
                <span>Cliente</span> {turn.userText}
              </div>
              {turn.steps.map((s, j) => (
                <Step key={j} step={s} live={live} />
              ))}
              {live && turn.steps.length === 0 && <div className="cd-step cd-think is-live"><Brain size={15} aria-hidden="true" /><p>…</p></div>}
            </article>
          )
        })}
        {/* The handoff closes the story, so it sits after the turn that produced it. */}
        {state.handoff && <Handoff handoff={state.handoff} quote={state.quote} />}
      </div>
    </section>
  )
}

export default function CeldasDemo() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [error, setError] = useState(null)
  const [tab, setTab] = useState('chat')

  async function send(text) {
    const snapshot = state
    setError(null)
    dispatch({ type: 'send', text, time: time() })
    try {
      await celdasTurn(
        { sessionId: snapshot.sessionId, text },
        {
          session: (d) => dispatch({ type: 'session', sessionId: d.sessionId }),
          thinking_start: () => dispatch({ type: 'thinking_start' }),
          thinking: (d) => dispatch({ type: 'thinking', text: d.text }),
          thinking_end: () => dispatch({ type: 'thinking_end' }),
          delta: (d) => dispatch({ type: 'delta', text: d.text }),
          tool: (d) => dispatch({ type: 'tool', ...d }),
          calc: (d) => dispatch({ type: 'calc', explanation: d.explanation }),
          tool_result: (d) => dispatch({ type: 'tool_result', ...d }),
          quote: (d) => dispatch({ type: 'quote', quote: d.quote, filename: d.filename, url: pdfUrl(d.pdfBase64) }),
          email: (d) => dispatch({ type: 'email', ...d }),
          handoff: (d) => dispatch({ type: 'handoff', handoff: d }),
        },
      )
      dispatch({ type: 'done' })
      return true
    } catch (err) {
      dispatch({ type: 'rollback', snapshot })
      setError(ERRORS[err?.message] ?? 'El agente no respondió. Intente de nuevo.')
      return false
    }
  }

  function reset() {
    for (const m of state.chat) if (m.kind === 'pdf') URL.revokeObjectURL(m.url)
    setError(null)
    dispatch({ type: 'reset' })
  }

  return (
    <div className="cd-app">
      <header className="cd-top">
        <a href="/es" className="cd-brand" aria-label="Anytrail">
          <img src="/anytrail-mark.png" alt="" width="24" height="24" />
          <span>Anytrail</span>
        </a>
        <div className="cd-title">
          <strong>Agente de cotización</strong>
          <span>Celdas de carga Utilcell 350N</span>
        </div>
        <button type="button" className="cd-reset" onClick={reset} disabled={state.busy}>
          <RotateCcw size={15} aria-hidden="true" /> Reiniciar
        </button>
      </header>

      <nav className="cd-tabs" aria-label="Vista">
        <button type="button" aria-pressed={tab === 'chat'} onClick={() => setTab('chat')}>Chat</button>
        <button type="button" aria-pressed={tab === 'mind'} onClick={() => setTab('mind')}>
          Razonamiento{state.busy && tab === 'chat' ? ' •' : ''}
        </button>
      </nav>

      <main className={`cd-main show-${tab}`}>
        <Chat state={state} onSend={send} error={error} />
        <Reasoning state={state} />
      </main>
    </div>
  )
}
