import { useEffect, useMemo, useRef, useState } from 'react'
import { waLink, waSend, waStatus } from './demoApi'
import './DemoBoard.css'

// The rep-tools stage of the live demo: the four-bucket work queue the real
// product gives sales reps, simulated over the visitor's own products by the
// backend's `board` action. Board CONTENT arrives already localized to the
// site's language; the chrome switches EN/ES on profile.language so a booth
// run in Mexico reads native end to end.
const COPY = {
  en: {
    title: (co) => `${co}'s reps, Monday 9:00 am`,
    subtitle:
      'Not a chatbot — a work queue. This is what Anytrail puts in front of your sales team, built from your real catalog.',
    atRisk: 'Deals at risk',
    intent: 'Buying intent',
    followUp: 'Needs follow-up',
    revive: 'Revive',
    waiting: (t) => `waiting ${t}`,
    quoteBtn: 'Generate quote',
    deliveryBtn: 'Delivery time',
    followUpBtn: 'Schedule follow-up',
    scheduled: 'Follow-up scheduled',
    sending: 'Sending to your WhatsApp…',
    sent: 'Sent — check your phone',
    sendFailed: 'Send failed — is this the phone that scanned the QR?',
    suggested: 'Suggested reply',
    inOneMin: 'In 1 minute',
    inOneHour: 'In 1 hour',
    tomorrow: 'Tomorrow 9:00',
    qrTitle: 'Become a lead',
    qrHint: (co) =>
      `Scan with your phone and send the message as-is. You'll appear on this board as a real ${co} lead — and the follow-up you schedule lands on YOUR WhatsApp.`,
    connected: (n) => `${n} is on the board`,
    youChip: 'YOU',
    youReason: 'Walked up to the booth 1 minute ago. Hottest lead in the room.',
    selfFollowUp: (n, co) =>
      `Hi ${n}! This is the follow-up you scheduled 60 seconds ago on the Anytrail board. Imagine your reps never forgetting one of these — for every ${co} deal. — Anytrail`,
    quoteTitle: 'Quote',
    total: 'Total',
    chatCta: 'Also try the AI sales agent →',
    closePeek: 'Back to board',
  },
  es: {
    title: (co) => `Los vendedores de ${co}, lunes 9:00 am`,
    subtitle:
      'No es un chatbot — es una cola de trabajo. Esto es lo que Anytrail le pone enfrente a tu equipo de ventas, construido con tu catálogo real.',
    atRisk: 'Ventas en riesgo',
    intent: 'Intención de compra',
    followUp: 'Requiere seguimiento',
    revive: 'Revivir',
    waiting: (t) => `esperando ${t}`,
    quoteBtn: 'Generar cotización',
    deliveryBtn: 'Tiempo de entrega',
    followUpBtn: 'Agendar seguimiento',
    scheduled: 'Seguimiento agendado',
    sending: 'Enviando a tu WhatsApp…',
    sent: 'Enviado — revisa tu teléfono',
    sendFailed: '¿Escaneaste el QR con este teléfono? No pudimos enviar.',
    suggested: 'Respuesta sugerida',
    inOneMin: 'En 1 minuto',
    inOneHour: 'En 1 hora',
    tomorrow: 'Mañana 9:00',
    qrTitle: 'Conviértete en lead',
    qrHint: (co) =>
      `Escanéalo con tu teléfono y manda el mensaje tal cual. Aparecerás en este tablero como un lead real de ${co} — y el seguimiento que agendes llegará a TU WhatsApp.`,
    connected: (n) => `${n} ya está en el tablero`,
    youChip: 'TÚ',
    youReason: 'Llegó al stand hace 1 minuto. El lead más caliente del salón.',
    selfFollowUp: (n, co) =>
      `¡Hola ${n}! Este es el seguimiento que agendaste hace 60 segundos en el tablero de Anytrail. Imagina a tus vendedores sin olvidar ni uno — en cada venta de ${co}. — Anytrail`,
    quoteTitle: 'Cotización',
    total: 'Total',
    chatCta: 'Prueba también el agente de ventas →',
    closePeek: 'Volver al tablero',
  },
}

const BUCKETS = ['atRisk', 'intent', 'followUp', 'revive']

function humanizeHours(h, lang) {
  if (h < 24) return `${Math.max(1, Math.round(h))} h`
  if (h < 720) return `${Math.round(h / 24)} d`
  const months = Math.round(h / 720)
  return lang === 'es' ? `${months} mes${months === 1 ? '' : 'es'}` : `${months} mo`
}

function initials(name) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

export default function DemoBoard({ board, profile, sessionId, visitorName, onOpenChat }) {
  const lang = (profile.language ?? 'en').toLowerCase().startsWith('es') ? 'es' : 'en'
  const t = COPY[lang]

  // Stable per-card ids so schedule/reveal state survives re-renders.
  const cards = useMemo(() => {
    const out = {}
    for (const b of BUCKETS) {
      out[b] = (board.buckets[b] ?? []).map((c, i) => ({ ...c, id: `${b}-${i}` }))
    }
    return out
  }, [board])

  const [peekId, setPeekId] = useState(null)
  // cardId -> { label } once a follow-up is scheduled; the self card's also
  // tracks the real send: 'pending' | 'sent' | 'failed'.
  const [scheduled, setScheduled] = useState({})
  const [revealed, setRevealed] = useState({}) // cardId -> {quote, delivery}

  // --- WhatsApp connection (QR → webhook → status poll) -------------------
  const [qrDataUrl, setQrDataUrl] = useState(null)
  const [conn, setConn] = useState({ connected: false })
  const timersRef = useRef([])

  const prefill =
    lang === 'es'
      ? (code) => `¡Hola! Quiero ver mi demo de Anytrail 🚀 (${code})`
      : (code) => `Hi! I want to see my Anytrail demo 🚀 (${code})`

  useEffect(() => {
    let cancelled = false
    waLink(sessionId)
      .then(async (link) => {
        if (cancelled) return
        const url = `https://wa.me/${link.number}?text=${encodeURIComponent(prefill(link.code))}`
        const QRCode = (await import('qrcode')).default
        const data = await QRCode.toDataURL(url, { margin: 1, width: 220 })
        if (!cancelled) setQrDataUrl(data)
      })
      .catch(() => {}) // QR panel simply stays hidden if the backend lacks WA config
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  useEffect(() => {
    if (conn.connected) return undefined
    const poll = setInterval(() => {
      waStatus(sessionId)
        .then((s) => {
          if (s.connected) setConn(s)
        })
        .catch(() => {})
    }, 3000)
    return () => clearInterval(poll)
  }, [sessionId, conn.connected])

  useEffect(() => () => timersRef.current.forEach(clearTimeout), [])

  // The visitor's own card, injected at the top of "needs follow-up" the
  // moment their QR message lands. This is the card whose follow-up is real.
  const selfCard = conn.connected
    ? {
        id: 'self',
        self: true,
        customerName: conn.waName || visitorName,
        company: null,
        lastMessage: conn.waText ?? '👋',
        waitingHours: 0,
        severity: 'high',
        productName: null,
        amount: null,
        reason: t.youReason,
        conversation: [{ from: 'customer', text: conn.waText ?? '👋' }],
        suggestedReply: t.selfFollowUp(conn.waName || visitorName, profile.companyName),
        quote: null,
        delivery: null,
      }
    : null

  const bucketCards = (b) =>
    b === 'followUp' && selfCard ? [selfCard, ...cards[b]] : cards[b]

  const allCards = selfCard
    ? [selfCard, ...BUCKETS.flatMap((b) => cards[b])]
    : BUCKETS.flatMap((b) => cards[b])
  const peek = allCards.find((c) => c.id === peekId) ?? null

  // Only a self-card schedule with a real in-session delay fires an actual
  // WhatsApp send; "tomorrow" (ms=null) is scheduled-state theater everywhere —
  // sending it after 60s while the UI says tomorrow would be a lie on stage.
  function scheduleFollowUp(card, delayLabel, delayMs, text) {
    if (card.self && delayMs != null) {
      setScheduled((s) => ({ ...s, [card.id]: { label: delayLabel, send: 'pending' } }))
      const timer = setTimeout(() => {
        waSend(sessionId, text)
          .then(() =>
            setScheduled((s) => ({ ...s, [card.id]: { label: delayLabel, send: 'sent' } })),
          )
          .catch(() =>
            setScheduled((s) => ({ ...s, [card.id]: { label: delayLabel, send: 'failed' } })),
          )
      }, delayMs)
      timersRef.current.push(timer)
    } else {
      setScheduled((s) => ({ ...s, [card.id]: { label: delayLabel } }))
    }
  }

  return (
    <section className="demo-board">
      <header className="demo-board-head">
        <div>
          <h1>{t.title(profile.companyName)}</h1>
          <p>{t.subtitle}</p>
        </div>
        {qrDataUrl && (
          <aside className={`demo-board-qr${conn.connected ? ' demo-board-qr-done' : ''}`}>
            {conn.connected ? (
              <p className="demo-board-qr-connected">
                ✓ {t.connected(conn.waName || visitorName)}
              </p>
            ) : (
              <>
                <img src={qrDataUrl} alt="WhatsApp QR" width={110} height={110} />
                <div>
                  <strong>{t.qrTitle}</strong>
                  <p>{t.qrHint(profile.companyName)}</p>
                </div>
              </>
            )}
          </aside>
        )}
      </header>

      <div className="demo-board-columns">
        {BUCKETS.map((b) => (
          <div key={b} className="demo-board-col">
            <h2 className={`demo-board-col-title demo-board-col-${b}`}>
              {t[b]}
              <span className="demo-board-count">{bucketCards(b).length}</span>
            </h2>
            {bucketCards(b).map((card) => (
              <button
                key={card.id}
                type="button"
                className={`demo-board-card${card.self ? ' demo-board-card-self' : ''}`}
                onClick={() => setPeekId(card.id)}
              >
                <span className="demo-board-card-top">
                  <span className={`demo-board-avatar demo-board-sev-${card.severity}`}>
                    {initials(card.customerName)}
                  </span>
                  <span className="demo-board-who">
                    <strong>{card.customerName}</strong>
                    {card.company && <em>{card.company}</em>}
                  </span>
                  {card.self ? (
                    <span className="demo-board-chip demo-board-chip-you">{t.youChip}</span>
                  ) : (
                    <span className="demo-board-chip">
                      {t.waiting(humanizeHours(card.waitingHours, lang))}
                    </span>
                  )}
                </span>
                <span className="demo-board-msg">“{card.lastMessage}”</span>
                {(card.productName || card.amount) && (
                  <span className="demo-board-deal">
                    {card.productName}
                    {card.productName && card.amount ? ' · ' : ''}
                    {card.amount}
                  </span>
                )}
                <span className="demo-board-reason">{card.reason}</span>
                {scheduled[card.id] && (
                  <span className="demo-board-scheduled">
                    ⏰ {t.scheduled} · {scheduled[card.id].label}
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}
      </div>

      <p className="demo-board-foot">
        <button className="demo-link-btn" type="button" onClick={onOpenChat}>
          {t.chatCta}
        </button>
      </p>

      {peek && (
        <CardPeek
          card={peek}
          t={t}
          lang={lang}
          scheduled={scheduled[peek.id]}
          revealed={revealed[peek.id] ?? {}}
          onReveal={(what) =>
            setRevealed((r) => ({ ...r, [peek.id]: { ...r[peek.id], [what]: true } }))
          }
          onSchedule={(label, ms, text) => scheduleFollowUp(peek, label, ms, text)}
          onClose={() => setPeekId(null)}
        />
      )}
    </section>
  )
}

function CardPeek({ card, t, scheduled, revealed, onReveal, onSchedule, onClose }) {
  const [reply, setReply] = useState(card.suggestedReply ?? '')
  const [picking, setPicking] = useState(false)

  const options = [
    { label: t.inOneMin, ms: 60_000 },
    { label: t.inOneHour, ms: 3_600_000 },
    { label: t.tomorrow, ms: null }, // theater only — no live send at the booth tomorrow
  ]

  return (
    <div className="demo-peek-backdrop" onClick={onClose}>
      <div className="demo-peek demo-card" onClick={(e) => e.stopPropagation()}>
        <header className="demo-peek-head">
          <strong>{card.customerName}</strong>
          {card.company && <span> · {card.company}</span>}
          <button className="demo-peek-close" type="button" onClick={onClose} aria-label={t.closePeek}>
            ✕
          </button>
        </header>

        <div className="demo-peek-chat">
          {card.conversation.map((m, i) => (
            <p key={i} className={`demo-peek-bubble demo-peek-${m.from}`}>
              {m.text}
            </p>
          ))}
        </div>

        {revealed.quote && card.quote && (
          <div className="demo-peek-quote">
            <strong>{t.quoteTitle}</strong>
            <table>
              <tbody>
                {card.quote.items.map((it, i) => (
                  <tr key={i}>
                    <td>{it.name}</td>
                    <td>×{it.qty}</td>
                    <td>{it.unitPrice}</td>
                  </tr>
                ))}
                <tr className="demo-peek-quote-total">
                  <td>{t.total}</td>
                  <td />
                  <td>{card.quote.total}</td>
                </tr>
              </tbody>
            </table>
            {card.quote.note && <p>{card.quote.note}</p>}
          </div>
        )}

        {revealed.delivery && card.delivery && (
          <p className="demo-peek-delivery">
            🚚 {card.delivery.carrier} · {card.delivery.eta}
          </p>
        )}

        <label className="demo-peek-reply">
          {t.suggested}
          <textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={3} />
        </label>

        {scheduled ? (
          <p className="demo-peek-status">
            {scheduled.send === 'pending' && `⏰ ${t.scheduled} · ${scheduled.label} — ${t.sending}`}
            {scheduled.send === 'sent' && `✅ ${t.sent}`}
            {scheduled.send === 'failed' && `⚠️ ${t.sendFailed}`}
            {!scheduled.send && `⏰ ${t.scheduled} · ${scheduled.label}`}
          </p>
        ) : (
          <div className="demo-peek-actions">
            {card.quote && !revealed.quote && (
              <button className="demo-btn demo-btn-ghost" type="button" onClick={() => onReveal('quote')}>
                📄 {t.quoteBtn}
              </button>
            )}
            {card.delivery && !revealed.delivery && (
              <button className="demo-btn demo-btn-ghost" type="button" onClick={() => onReveal('delivery')}>
                🚚 {t.deliveryBtn}
              </button>
            )}
            {!picking ? (
              <button className="demo-btn" type="button" onClick={() => setPicking(true)}>
                ⏰ {t.followUpBtn}
              </button>
            ) : (
              options.map((o) => (
                <button
                  key={o.label}
                  className="demo-btn demo-btn-ghost"
                  type="button"
                  onClick={() => {
                    onSchedule(o.label, o.ms, reply)
                    setPicking(false)
                  }}
                >
                  {o.label}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
