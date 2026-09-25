import { useEffect, useRef, useState } from 'react'
import { sendPriceRequest } from './quoteDemoApi'

const ERRORS = {
  invalid_input: 'Revisa el correo del proveedor, el asunto y el mensaje.',
  rate_limited: 'Llegaste al límite de correos de la demo por hoy.',
  email_failed: 'No se pudo enviar el correo. Intenta de nuevo.',
  already_requested: 'Ya se pidió precio para esta cotización.',
}

// Initial state only: QuoteCard is keyed by quoteId, so a new quote remounts
// this dialog with its own draft. No draft→state effect (set-state-in-effect).
export default function PriceRequestDialog({ open, quoteId, draft, missing, onClose, onSent }) {
  const ref = useRef(null)
  const [to, setTo] = useState(draft?.to ?? '')
  const [subject, setSubject] = useState(draft?.subject ?? '')
  const [body, setBody] = useState(draft?.body ?? '')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  async function onSubmit(e) {
    e.preventDefault()
    setSending(true)
    setError(null)
    try {
      const { request } = await sendPriceRequest({ quoteId, to, subject, body })
      onSent(request)
    } catch (err) {
      setError(ERRORS[err.message] ?? 'Algo salió mal. Intenta de nuevo.')
    } finally {
      setSending(false)
    }
  }

  return (
    <dialog ref={ref} className="qd-dialog" onClose={onClose} aria-labelledby="qd-dialog-title">
      <form onSubmit={onSubmit}>
        <h2 id="qd-dialog-title">Pedir precio al proveedor</h2>
        <p className="qd-hint">
          {missing} producto{missing === 1 ? '' : 's'} sin precio. El agente redactó este correo; edítalo si quieres.
          Se enviará un recordatorio cada 3 minutos hasta que el proveedor capture los precios.
        </p>
        <label>
          Para
          <input type="email" required value={to} onChange={(e) => setTo(e.target.value)} placeholder="proveedor@empresa.com" />
        </label>
        <label>
          Asunto
          <input required maxLength={200} value={subject} onChange={(e) => setSubject(e.target.value)} />
        </label>
        <label>
          Mensaje
          <textarea required rows={9} maxLength={5000} value={body} onChange={(e) => setBody(e.target.value)} />
        </label>
        <p className="qd-hint">Al final del correo se agrega un enlace para capturar los precios.</p>
        {error && <p className="qd-error">{error}</p>}
        <div className="qd-dialog-actions">
          <button type="button" className="qd-btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" className="qd-btn" disabled={sending}>{sending ? 'Enviando…' : 'Enviar'}</button>
        </div>
      </form>
    </dialog>
  )
}
