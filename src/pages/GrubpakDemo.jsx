import { useEffect, useReducer, useRef, useState } from 'react'
import { BellRing, Brain, Check, Clock, Link2, Mail, MessageCircle, RotateCcw, Send, ShoppingBag, ShoppingCart, UserRound, X } from 'lucide-react'
import { grubpakFollowUp, grubpakShop, grubpakTurn, mxn } from './grubpak/api'
import { bubbles, initialState, nextPending, reducer, stage } from './grubpak/state'
import './GrubpakDemo.css'

// Packaging sales agent demo for Grubpak (grubpak.com, a Shopify store). The
// visitor plays the customer: qualifying chat on the site, a mocked Shopify
// checkout, then WhatsApp and email follow-ups that depend on whether they
// bought. Time is simulated so a meeting can watch a week of follow-ups in a
// minute. Backend: demo-backend src/grubpak (actions 'grubpak_*').

// Same text as GREETING in demo-backend/src/grubpak/prompt.ts.
const GREETING = 'Hola, soy el vendedor de Grubpak. Te ayudo a armar el paquete de empaques ideal para tu negocio en un par de minutos. ¿Qué tipo de negocio tienes?'

const STARTERS = [
  { label: 'Fonda', text: 'Tengo una fonda, despachamos como 150 pedidos para llevar al día, sobre todo comida corrida y caldos.' },
  { label: 'Food truck', text: 'Hola, tengo un food truck de tacos y ramen, unos 60 pedidos diarios.' },
  { label: 'Solo cotizando', text: 'Buenas, solo quiero saber precios de sus contenedores.' },
]

const TOOL_NAMES = {
  registrar_calificacion: 'Registrar lead en CRM',
  armar_paquete: 'Armar paquete',
  crear_link_checkout: 'Crear link de Shopify',
  escalar_a_ejecutivo: 'Escalar a ejecutivo',
}
const TOOL_ICONS = { registrar_calificacion: UserRound, armar_paquete: ShoppingCart, crear_link_checkout: Link2, escalar_a_ejecutivo: BellRing }

const TIER = { caliente: 'Caliente', tibio: 'Tibio', frio: 'Frío' }
const URGENCY = { esta_semana: 'Esta semana', este_mes: 'Este mes', cotizando: 'Solo cotizando' }
const STAGES = [
  ['calificado', 'Calificado'],
  ['link', 'Link enviado'],
  ['checkout', 'En checkout'],
  ['compro', 'Compró'],
  ['recurrente', 'Recompra'],
]
const CTA = { cart: 'Ver mi paquete', resume: 'Retomar mi compra', reorder: 'Repetir pedido' }

const ERRORS = {
  rate_limited: 'Se alcanzó el límite de mensajes de la demo por hoy.',
  session_full: 'Esta conversación llegó a su límite. Reiníciala para empezar otra.',
  unknown_session: 'La sesión expiró. Reinicia la demo.',
}

const DAYS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']
const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
const pad = (n) => String(n).padStart(2, '0')
const hm = (iso) => (iso ? `${pad(new Date(iso).getHours())}:${pad(new Date(iso).getMinutes())}` : '')
const dayHm = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${hm(iso)}`
}
const clockLabel = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]} · ${hm(iso)}`
}
const addMin = (iso, min) => new Date(Date.parse(iso) + min * 60_000).toISOString()

function Composer({ busy, placeholder, onSend, draft, setDraft }) {
  const input = useRef(null)
  useEffect(() => {
    if (!busy) input.current?.focus({ preventScroll: true })
  }, [busy])
  function submit(e) {
    e.preventDefault()
    const text = draft.trim()
    if (!text || busy) return
    setDraft('')
    onSend(text).then((ok) => ok || setDraft(text))
  }
  return (
    <form className="gp-composer" onSubmit={submit}>
      <textarea
        ref={input}
        rows={1}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) submit(e)
        }}
        placeholder={placeholder}
        aria-label="Mensaje"
        disabled={busy}
      />
      <button type="submit" className="gp-send" disabled={busy || !draft.trim()} aria-label="Enviar">
        <Send size={18} />
      </button>
    </form>
  )
}

function useStickToBottom(dep) {
  const ref = useRef(null)
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight
  }, [dep])
  return ref
}

function WebChat({ state, onSend, onOpenLink, error }) {
  const [draft, setDraft] = useState('')
  const msgs = state.messages.filter((m) => m.channel === 'web')
  const body = useStickToBottom(state.messages)
  const last = msgs[msgs.length - 1]
  const waiting = state.busy && state.channel === 'web' && last?.kind !== 'agent'

  return (
    <div className="gp-pane gp-web">
      <div className="gp-site-bar">
        <span className="gp-dot" /> grubpak.com · chat de ventas
      </div>
      <div className="gp-scroll" ref={body}>
        <div className="gp-bubble gp-in">{GREETING}</div>
        {msgs.length === 0 && (
          <div className="gp-starters">
            <p>Tú eres el cliente. Responde como quieras o empieza con uno de estos:</p>
            {STARTERS.map((s) => (
              <button key={s.label} type="button" onClick={() => setDraft(s.text)}>
                <strong>{s.label}</strong>
                <span>{s.text}</span>
              </button>
            ))}
          </div>
        )}
        {msgs.map((m, i) => {
          if (m.kind === 'user') return <div key={i} className="gp-bubble gp-out">{m.text}</div>
          if (m.kind === 'link') return <LinkCard key={i} m={m} state={state} onOpen={() => onOpenLink('chat')} />
          return bubbles(m.text).map((p, j) => (
            <div key={`${i}-${j}`} className="gp-bubble gp-in">{p}</div>
          ))
        })}
        {waiting && <Dots />}
        {error && <p className="gp-error">{error}</p>}
      </div>
      <Composer busy={state.busy} placeholder="Escribe tu mensaje" onSend={(t) => onSend(t, 'web')} draft={draft} setDraft={setDraft} />
    </div>
  )
}

function Dots() {
  return (
    <div className="gp-bubble gp-in gp-dots" aria-label="El vendedor está escribiendo">
      <i />
      <i />
      <i />
    </div>
  )
}

function LinkCard({ m, state, onOpen }) {
  return (
    <div className="gp-linkcard">
      <div className="gp-linkcard-top">
        <ShoppingBag size={18} aria-hidden="true" />
        <div>
          <strong>Tu paquete en la tienda</strong>
          <span>{state.cart?.lines.length ?? 0} productos · envío gratis</span>
        </div>
        <b>{mxn(m.totalMxn)}</b>
      </div>
      <button type="button" className="gp-btn gp-primary" onClick={onOpen} disabled={state.busy}>
        Ir a pagar
      </button>
    </div>
  )
}

function Inbox({ state, onSend, onAction, error }) {
  const [draft, setDraft] = useState('')
  const msgs = state.messages.filter((m) => m.channel !== 'web')
  const body = useStickToBottom(state.messages)
  const last = msgs[msgs.length - 1]
  const waiting = state.busy && state.channel !== 'web' && !(last?.kind === 'agent' && last.text)

  return (
    <div className="gp-pane gp-phone">
      <div className="gp-phone-head">
        <div className="gp-avatar" aria-hidden="true">G</div>
        <div>
          <strong>Grubpak</strong>
          <span>{state.lead ? `WhatsApp y correo de ${state.lead.name}` : 'WhatsApp y correo del cliente'}</span>
        </div>
      </div>
      <div className="gp-scroll gp-phone-body" ref={body}>
        {msgs.length === 0 && (
          <div className="gp-empty">
            <strong>Sin mensajes todavía</strong>
            Aquí llegan los seguimientos por WhatsApp y correo. Termina la conversación en el chat y adelanta el reloj.
          </div>
        )}
        {msgs.map((m, i) => {
          if (m.kind === 'user')
            return (
              <div key={i} className="gp-bubble gp-out">
                {m.text}
                <span className="gp-time">{hm(m.time)}</span>
              </div>
            )
          if (m.kind === 'link') return <LinkCard key={i} m={m} state={state} onOpen={() => onAction('cart')} />
          if (!m.text) return null
          if (m.channel === 'email')
            return (
              <article key={i} className="gp-email">
                <header>
                  <Mail size={14} aria-hidden="true" /> <span>Correo · ventas@grubpak.com</span> <time>{dayHm(m.time)}</time>
                </header>
                {m.subject && <h3>{m.subject}</h3>}
                <p>{m.text}</p>
                {m.action && (
                  <button type="button" className="gp-btn gp-primary" onClick={() => onAction(m.action)} disabled={state.busy}>
                    {CTA[m.action]}
                  </button>
                )}
              </article>
            )
          return (
            <div key={i} className="gp-wa">
              {bubbles(m.text).map((p, j) => (
                <div key={j} className="gp-bubble gp-in">
                  {p}
                  {j === 0 && <span className="gp-time">{dayHm(m.time)}</span>}
                </div>
              ))}
              {m.action && (
                <button type="button" className="gp-wa-cta" onClick={() => onAction(m.action)} disabled={state.busy}>
                  <Link2 size={14} aria-hidden="true" /> {CTA[m.action]}
                </button>
              )}
            </div>
          )
        })}
        {waiting && <Dots />}
        {error && <p className="gp-error">{error}</p>}
      </div>
      <Composer busy={state.busy || !state.sessionId} placeholder="Responder por WhatsApp" onSend={(t) => onSend(t, 'wa')} draft={draft} setDraft={setDraft} />
    </div>
  )
}

function Shop({ state, onPay, onAbandon }) {
  const link = [...state.messages].reverse().find((m) => m.kind === 'link')
  if (state.checkout?.status === 'paid')
    return (
      <div className="gp-pane gp-shop">
        <div className="gp-addr">grubpak.com/checkouts/thank_you</div>
        <div className="gp-thanks">
          <Check size={28} aria-hidden="true" />
          <h3>Pedido {state.checkout.order.number} confirmado</h3>
          <p>Shopify mandó <code>orders/create</code>. El vendedor canceló los recordatorios de carrito y arrancó la secuencia post-compra.</p>
          <p className="gp-muted">Adelanta el reloj para ver la confirmación, el aviso de envío y el recordatorio de recompra.</p>
        </div>
      </div>
    )
  if (state.checkout?.status !== 'open' || !state.cart)
    return (
      <div className="gp-pane gp-shop">
        <div className="gp-empty">
          <strong>Aún no hay checkout</strong>
          Cuando el vendedor mande el link y toques "Ir a pagar", aquí se abre la tienda Shopify con el carrito ya cargado.
        </div>
      </div>
    )
  const c = state.cart
  return (
    <div className="gp-pane gp-shop">
      <div className="gp-addr" title="Permalink de carrito de Shopify">{link?.url}</div>
      <div className="gp-scroll gp-checkout">
        <div className="gp-co-grid">
          <section>
            <h3>Contacto y envío</h3>
            <label className="gp-field">Nombre<input id="gp-co-name" defaultValue={state.lead?.name} /></label>
            <label className="gp-field">WhatsApp<input id="gp-co-phone" defaultValue={state.lead?.whatsapp} /></label>
            <label className="gp-field">Dirección<input id="gp-co-addr" defaultValue="Av. Álvaro Obregón 120, Roma Nte., CDMX" /></label>
            <label className="gp-field">
              Pago
              <select id="gp-co-pay" defaultValue="card">
                <option value="card">Tarjeta de crédito o débito</option>
                <option value="mp">Mercado Pago</option>
                <option value="spei">Transferencia SPEI</option>
              </select>
            </label>
          </section>
          <section className="gp-summary">
            {c.lines.map((l) => (
              <div key={l.key} className="gp-row">
                <span>{l.packs} × {l.name}<small>{l.pieces.toLocaleString('es-MX')} piezas</small></span>
                <span>{mxn(l.totalMxn)}</span>
              </div>
            ))}
            {c.discountRate > 0 && (
              <div className="gp-row gp-disc">
                <span>Arma tu paquete (−{Math.round(c.discountRate * 100)}%)</span>
                <span>−{mxn(c.discountMxn)}</span>
              </div>
            )}
            <div className="gp-row"><span>Envío</span><span>Gratis</span></div>
            <div className="gp-row gp-total"><span>Total MXN</span><span>{mxn(c.totalMxn)}</span></div>
          </section>
        </div>
        <div className="gp-co-actions">
          <button type="button" className="gp-btn gp-primary" onClick={onPay} disabled={state.busy}>Pagar {mxn(c.totalMxn)}</button>
          <button type="button" className="gp-btn" onClick={onAbandon} disabled={state.busy}>Salir sin comprar</button>
        </div>
        <p className="gp-muted gp-note">Checkout simulado. En producción el vendedor arma el permalink de carrito de Shopify y escucha los webhooks <code>checkouts/create</code> y <code>orders/create</code>, con el <code>lead_id</code> en los atributos del carrito.</p>
      </div>
    </div>
  )
}

function LeadCard({ state }) {
  const L = state.lead
  const current = stage(state)
  const idx = STAGES.findIndex((s) => s[0] === current)
  const abandoned = current === 'checkout' && state.checkout?.status !== 'open'
  return (
    <section className="gp-card">
      <header className="gp-card-h">
        <span className="gp-kicker">Lead</span>
        {L ? <span className={`gp-tier is-${L.tier}`}>{TIER[L.tier]}{L.wholesale ? ' · mayoreo' : ''}</span> : <span className="gp-tier">Sin calificar</span>}
      </header>
      {L ? (
        <>
          <div className="gp-lead-name">
            <strong>{L.name}</strong>
            <span>{L.business} · {L.id}</span>
          </div>
          <div className="gp-score">
            <span>Score</span>
            <div className="gp-bar"><i style={{ transform: `scaleX(${L.score / 100})` }} /></div>
            <b>{L.score}</b>
          </div>
          <dl className="gp-kv">
            <dt>Negocio</dt><dd>{L.businessType}</dd>
            <dt>Pedidos/día</dt><dd>{L.ordersPerDay}</dd>
            <dt>Sirve</dt><dd>{L.serves.join(', ') || '—'}</dd>
            <dt>Empaque hoy</dt><dd>{L.currentPackaging}</dd>
            <dt>Urgencia</dt><dd>{URGENCY[L.urgency]}</dd>
            <dt>WhatsApp</dt><dd>{L.whatsapp}</dd>
          </dl>
        </>
      ) : (
        <p className="gp-muted">Cuando el vendedor termine de calificar, aquí aparece el lead con su score, tal como llegaría al CRM.</p>
      )}
      {state.handoff && <p className="gp-handoff"><BellRing size={14} aria-hidden="true" /> Ejecutivo asignado: {state.handoff.reason}</p>}
      <div className="gp-stages">
        {STAGES.map(([k, label], i) => (
          <span key={k} className={`gp-stage${idx >= 0 && i <= idx ? ' is-on' : ''}`}>{label}</span>
        ))}
        {abandoned && <span className="gp-stage is-lost">Abandonó checkout</span>}
      </div>
      {state.cart && (
        <div className="gp-mini-cart">
          {state.cart.lines.map((l) => (
            <div key={l.key}><span>{l.packs} × {l.name}</span><span>{mxn(l.totalMxn)}</span></div>
          ))}
          <div className="gp-total"><span>Total{state.cart.discountRate ? ` (−${Math.round(state.cart.discountRate * 100)}%)` : ''} · le dura ~{state.cart.supplyDays} días</span><span>{mxn(state.cart.totalMxn)}</span></div>
        </div>
      )}
    </section>
  )
}

function Sequences({ state }) {
  const rows = state.sequences
    .flatMap((q) => q.steps.map((s) => ({ ...s, label: q.label, key: `${q.id}/${s.id}` })))
    .sort((a, b) => Date.parse(a.at) - Date.parse(b.at))
  const pending = rows.filter((r) => r.status === 'pending').length
  return (
    <section className="gp-card">
      <header className="gp-card-h">
        <span className="gp-kicker">Seguimiento automático</span>
        {rows.length > 0 && <span className="gp-muted">{pending} programado{pending === 1 ? '' : 's'}</span>}
      </header>
      {rows.length === 0 ? (
        <p className="gp-muted">Nada programado. La secuencia arranca cuando el vendedor manda el link y cambia según lo que haga el cliente en Shopify.</p>
      ) : (
        <ol className="gp-seq">
          {rows.map((r) => (
            <li key={r.key} className={`is-${r.status}`}>
              <time>{dayHm(r.at)}</time>
              <div>
                <span className="gp-seq-tag">{r.label}</span>
                <strong>{r.title}</strong>
                <small>{r.channel === 'wa' ? 'WhatsApp' : 'Correo'}{r.reason ? ` · cancelado: ${r.reason}` : ''}</small>
              </div>
              <span className={`gp-st is-${r.status}`}>{{ pending: 'Programado', sent: 'Enviado', cancelled: 'Cancelado' }[r.status]}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

function toolSummary(name, input) {
  if (!input || typeof input !== 'object') return null
  if (name === 'registrar_calificacion') return [input.negocio, `${input.pedidos_por_dia} pedidos/día`, input.empaque_actual].filter(Boolean).join(' · ')
  if (name === 'armar_paquete') return (input.productos ?? []).join(', ')
  if (name === 'escalar_a_ejecutivo') return input.motivo
  return null
}

function Agent({ state }) {
  const scroller = useStickToBottom(state.trace)
  return (
    <section className="gp-card gp-agent">
      <header className="gp-card-h">
        <span className="gp-kicker">Lo que hace el vendedor</span>
      </header>
      <div className="gp-trace" ref={scroller}>
        {state.trace.length === 0 && <p className="gp-muted">Su razonamiento y las herramientas que usa aparecen aquí. El cliente solo ve el chat.</p>}
        {state.trace.map((t, i) => {
          const live = state.busy && i === state.trace.length - 1
          return (
            <article key={i} className="gp-turn">
              <div className={`gp-turn-who${t.who === 'seguimiento' ? ' is-auto' : ''}`}>
                {t.who === 'seguimiento' ? <BellRing size={13} aria-hidden="true" /> : <MessageCircle size={13} aria-hidden="true" />}
                <span>{t.text}</span>
              </div>
              {t.steps.map((s, j) => {
                if (s.kind === 'thinking')
                  return (
                    <details key={j} className="gp-think" open={!s.done}>
                      <summary><Brain size={13} aria-hidden="true" /> Razonamiento</summary>
                      <p>{s.text || '…'}</p>
                    </details>
                  )
                const Icon = TOOL_ICONS[s.name] ?? Check
                const st = s.ok === null ? 'running' : s.ok ? 'ok' : 'error'
                const sum = toolSummary(s.name, s.input)
                return (
                  <div key={j} className={`gp-tool is-${st}`}>
                    <Icon size={14} aria-hidden="true" />
                    <div>
                      <strong>{TOOL_NAMES[s.name] ?? s.name}</strong>
                      {sum && <span>{sum}</span>}
                    </div>
                    <em>{st === 'running' ? (live ? 'ejecutando…' : '—') : s.label}</em>
                  </div>
                )
              })}
            </article>
          )
        })}
      </div>
      {state.log.length > 0 && (
        <ul className="gp-log" aria-label="Eventos">
          {[...state.log].reverse().map((e, i) => (
            <li key={i}><time>{hm(e.at)}</time><code>{e.topic}</code><span>{e.detail}</span></li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default function GrubpakDemo() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [error, setError] = useState(null)
  const [stageTab, setStageTab] = useState('web')
  const [view, setView] = useState('customer')
  const [seenInbox, setSeenInbox] = useState(0)
  const failed = useRef(new Set())

  const inboxCount = state.messages.filter((m) => m.channel !== 'web' && m.kind === 'agent' && m.text).length
  // Leaving the inbox marks what was there as read.
  function selectTab(k) {
    if (stageTab === 'inbox') setSeenInbox(inboxCount)
    setStageTab(k)
  }

  // The simulated clock starts at the visitor's real time, set after mount so
  // the prerendered HTML does not depend on when it was built.
  useEffect(() => {
    const d = new Date()
    d.setSeconds(0, 0)
    dispatch({ type: 'clock', simNow: d.toISOString() })
  }, [])

  const handlers = {
    session: (d) => dispatch({ type: 'session', sessionId: d.sessionId }),
    thinking_start: () => dispatch({ type: 'thinking_start' }),
    thinking: (d) => dispatch({ type: 'thinking', text: d.text }),
    thinking_end: () => dispatch({ type: 'thinking_end' }),
    delta: (d) => dispatch({ type: 'delta', text: d.text }),
    tool: (d) => dispatch({ type: 'tool', ...d }),
    tool_result: (d) => dispatch({ type: 'tool_result', ...d }),
    lead: (d) => dispatch({ type: 'lead', lead: d }),
    cart: (d) => dispatch({ type: 'cart', cart: d }),
    checkout_link: (d) => dispatch({ type: 'checkout_link', ...d }),
    handoff: (d) => dispatch({ type: 'handoff', handoff: d }),
    sequences: (d) => dispatch({ type: 'sequences', sequences: d }),
    shop: (d) => dispatch({ type: 'shop', ...d }),
    order: (d) => dispatch({ type: 'order', order: d }),
  }

  async function send(text, channel) {
    const snapshot = state
    setError(null)
    dispatch({ type: 'send', text, channel })
    try {
      await grubpakTurn({ sessionId: state.sessionId, text, channel, simNow: state.simNow }, handlers)
      dispatch({ type: 'done' })
      return true
    } catch (err) {
      dispatch({ type: 'rollback', snapshot })
      setError(ERRORS[err?.message] ?? 'El vendedor no respondió. Intenta de nuevo.')
      return false
    }
  }

  async function shop(event, source, after) {
    if (state.busy || !state.sessionId) return
    const snapshot = state
    setError(null)
    dispatch({ type: 'busy' })
    if (after) after()
    try {
      await grubpakShop({ sessionId: state.sessionId, event, source, simNow: state.simNow }, handlers)
      dispatch({ type: 'done' })
    } catch {
      dispatch({ type: 'rollback', snapshot })
      setError('La tienda no respondió. Intenta de nuevo.')
    }
  }

  const openCheckout = (source) =>
    shop('checkout_started', source, () => {
      dispatch({ type: 'checkout_open', source })
      selectTab('shop')
      setView('customer')
    })
  const pay = () => shop('purchased', state.checkout?.source ?? 'chat', () => dispatch({ type: 'clock', simNow: addMin(state.simNow, 4) }))
  const abandon = () =>
    shop('checkout_abandoned', 'chat', () => {
      dispatch({ type: 'checkout_close' })
      dispatch({ type: 'clock', simNow: addMin(state.simNow, 6) })
    })

  async function fireFollowUp({ seq, step }) {
    const snapshot = state
    setError(null)
    dispatch({ type: 'followup_start', label: seq.label, step })
    let latest = null
    try {
      await grubpakFollowUp(
        { sessionId: state.sessionId, sequenceId: seq.id, stepId: step.id, simNow: state.simNow },
        { ...handlers, sequences: (d) => { latest = d; handlers.sequences(d) } },
      )
      dispatch({ type: 'done' })
    } catch (err) {
      // A refused step (already sent, cancelled because they bought) comes
      // with the server's schedule; anything else is skipped so the clock
      // does not retry it in a loop.
      dispatch({ type: 'rollback', snapshot: latest ? { ...snapshot, sequences: latest } : snapshot })
      failed.current.add(`${seq.id}/${step.id}`)
      if (!String(err?.message).startsWith('followup_')) setError('Un seguimiento no se pudo enviar.')
    }
  }

  // Fire whatever the simulated clock has made due, one at a time.
  useEffect(() => {
    if (state.busy || !state.sessionId || !state.simNow) return
    const due = state.sequences
      .flatMap((seq) => seq.steps.map((step) => ({ seq, step })))
      .filter(({ seq, step }) => step.status === 'pending' && Date.parse(step.at) <= Date.parse(state.simNow) && !failed.current.has(`${seq.id}/${step.id}`))
      .sort((a, b) => Date.parse(a.step.at) - Date.parse(b.step.at))[0]
    if (due) fireFollowUp(due)
    // fireFollowUp is recreated each render; the schedule is what matters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.busy, state.sessionId, state.sequences, state.simNow])

  const next = nextPending(state.sequences)
  const advance = (min) => dispatch({ type: 'clock', simNow: addMin(state.simNow, min) })
  const jumpNext = () => next && dispatch({ type: 'clock', simNow: new Date(Math.max(Date.parse(state.simNow), Date.parse(next.step.at))).toISOString() })

  const unread = stageTab === 'inbox' ? 0 : Math.max(0, inboxCount - seenInbox)

  function reset() {
    failed.current = new Set()
    setError(null)
    setStageTab('web')
    setSeenInbox(0)
    const d = new Date()
    d.setSeconds(0, 0)
    dispatch({ type: 'reset', simNow: d.toISOString() })
  }

  const TABS = [
    ['web', 'Chat en grubpak.com', MessageCircle, 0],
    ['shop', 'Tienda Shopify', ShoppingBag, state.checkout?.status === 'open' && stageTab !== 'shop' ? 1 : 0],
    ['inbox', 'WhatsApp y correo', Mail, unread],
  ]

  return (
    <div className="gp-app">
      <header className="gp-top">
        <a href="/es" className="gp-brand" aria-label="Anytrail">
          <img src="/anytrail-mark.png" alt="" width="24" height="24" />
          <span>Anytrail</span>
        </a>
        <div className="gp-title">
          <strong>Vendedor de Grubpak</strong>
          <span>Califica, manda a Shopify y da seguimiento según si compró</span>
        </div>
        <div className="gp-clock" aria-label="Reloj simulado">
          <Clock size={15} aria-hidden="true" />
          <span className="gp-clock-time">{clockLabel(state.simNow)}</span>
          <button type="button" onClick={() => advance(60)} disabled={!state.simNow}>+1 h</button>
          <button type="button" onClick={() => advance(24 * 60)} disabled={!state.simNow}>+1 día</button>
          <button type="button" className="gp-next" onClick={jumpNext} disabled={!next || state.busy}>
            Siguiente envío{next ? ` · ${dayHm(next.step.at)}` : ''}
          </button>
        </div>
        <button type="button" className="gp-reset" onClick={reset} disabled={state.busy}>
          <RotateCcw size={15} aria-hidden="true" /> Reiniciar
        </button>
      </header>

      <nav className="gp-views" aria-label="Vista">
        <button type="button" aria-pressed={view === 'customer'} onClick={() => setView('customer')}>Cliente</button>
        <button type="button" aria-pressed={view === 'agent'} onClick={() => setView('agent')}>Vendedor{state.busy && view === 'customer' ? ' •' : ''}</button>
      </nav>

      <main className={`gp-main show-${view}`}>
        <section className="gp-stage" aria-label="Lo que ve el cliente">
          <div className="gp-tabs" role="tablist">
            {TABS.map(([k, label, Icon, badge]) => (
              <button key={k} type="button" role="tab" aria-selected={stageTab === k} onClick={() => selectTab(k)}>
                <Icon size={15} aria-hidden="true" /> {label}
                {badge > 0 && <span className="gp-badge">{badge}</span>}
              </button>
            ))}
          </div>
          {stageTab === 'web' && <WebChat state={state} onSend={send} onOpenLink={openCheckout} error={error} />}
          {stageTab === 'shop' && <Shop state={state} onPay={pay} onAbandon={abandon} />}
          {stageTab === 'inbox' && <Inbox state={state} onSend={send} onAction={(a) => openCheckout(a)} error={error} />}
        </section>

        <aside className="gp-console" aria-label="Consola del vendedor">
          <LeadCard state={state} />
          <Sequences state={state} />
          <Agent state={state} />
        </aside>
      </main>
      {error && stageTab === 'shop' && (
        <p className="gp-toast" role="alert">
          {error} <button type="button" onClick={() => setError(null)} aria-label="Cerrar"><X size={14} /></button>
        </p>
      )}
    </div>
  )
}
