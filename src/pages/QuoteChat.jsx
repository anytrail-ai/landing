import { useEffect, useRef, useState } from 'react'
import { quoteChatTurn } from './quoteDemoApi'
import { SAMPLE_CONVERSATIONS } from './sampleConversations'
import { stripQuoteMarker } from './quoteDemoUtil'

function Ticks() {
  return (
    <svg className="qd-ticks" viewBox="0 0 16 11" width="16" height="11" aria-hidden="true">
      <path d="M11.1.6 4.6 7.1 2.1 4.6.9 5.8l3.7 3.7L12.3 1.8z M15.1.6 8.6 7.1l-.9-.9-1.2 1.2 2.1 2.1 7.7-7.7z" fill="currentColor" />
    </svg>
  )
}

export default function QuoteChat({ sessionId, supplier, messages, setMessages, onReady, disabled }) {
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [playing, setPlaying] = useState(false)
  const scroller = useRef(null)
  // Source of truth for the turn-by-turn history. Only sendTurn changes the
  // messages, so it is updated there, never during render (react-hooks/refs).
  const history = useRef(messages)

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  // One customer turn through the real agent. Returns true when the agent
  // asked for the quote (marker seen) or the session hit its cap.
  async function sendTurn(text) {
    const next = [...history.current, { role: 'user', text }]
    setMessages([...next, { role: 'assistant', text: '' }])
    setBusy(true)
    setError(null)
    let raw = ''
    try {
      const { ready, ended } = await quoteChatTurn(sessionId, next, (delta) => {
        raw += delta
        const shown = stripQuoteMarker(raw).text
        setMessages([...next, { role: 'assistant', text: shown }])
      })
      const final = [...next, { role: 'assistant', text: stripQuoteMarker(raw).text || '…' }]
      setMessages(final)
      history.current = final
      return ready || ended ? final : null
    } catch {
      setError('El agente no respondió. Intenta de nuevo.')
      setMessages(next)
      history.current = next
      return null
    } finally {
      setBusy(false)
    }
  }

  async function onSubmit(e) {
    e.preventDefault()
    const text = draft.trim()
    if (!text || busy) return
    setDraft('')
    const final = await sendTurn(text)
    if (final) onReady(final)
  }

  async function playSample(sample) {
    setPlaying(true)
    try {
      for (const line of sample.lines) {
        const final = await sendTurn(line)
        if (final) return onReady(final)
      }
      onReady(history.current)
    } finally {
      setPlaying(false)
    }
  }

  const locked = busy || playing || disabled

  return (
    <div className="qd-phone">
      <header className="qd-wa-head">
        <div className="qd-avatar" aria-hidden="true">{supplier.slice(0, 1).toUpperCase()}</div>
        <div>
          <div className="qd-wa-name">Ventas · {supplier}</div>
          <div className="qd-wa-status">{busy ? 'escribiendo…' : 'en línea'}</div>
        </div>
      </header>

      <div className="qd-wa-body" ref={scroller}>
        {messages.length === 0 && (
          <div className="qd-samples">
            <p className="qd-hint">Escribe como si fueras el cliente, o reproduce una conversación de ejemplo:</p>
            {SAMPLE_CONVERSATIONS.map((s) => (
              <button key={s.id} type="button" className="qd-sample" onClick={() => playSample(s)} disabled={locked}>
                <strong>{s.label}</strong>
                <span>{s.hint}</span>
              </button>
            ))}
          </div>
        )}
        {messages.map((m, i) =>
          m.text.split(/\n\s*\n/).map((part, j) => (
            <div key={`${i}-${j}`} className={`qd-bubble ${m.role === 'user' ? 'qd-out' : 'qd-in'}`}>
              {part || <span className="qd-typing">…</span>}
              {m.role === 'user' && <Ticks />}
            </div>
          )),
        )}
        {error && <p className="qd-error">{error}</p>}
      </div>

      <form className="qd-wa-input" onSubmit={onSubmit}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Escribe un mensaje"
          disabled={locked}
          aria-label="Mensaje"
        />
        <button type="submit" className="qd-send" disabled={locked || !draft.trim()} aria-label="Enviar">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M2 21 23 12 2 3v7l15 2-15 2z" fill="currentColor" />
          </svg>
        </button>
      </form>
    </div>
  )
}
