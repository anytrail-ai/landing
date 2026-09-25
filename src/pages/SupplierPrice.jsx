import { useEffect, useRef, useState } from 'react'
import { answerPriceRequest, getPriceRequest } from './quoteDemoApi'
import { money, parsePriceInput } from './quoteDemoUtil'
import './QuoteDemo.css'

export default function SupplierPrice() {
  const token = useRef('')
  const [view, setView] = useState(null)
  const [state, setState] = useState('loading') // loading | form | done | answered | missing
  const [prices, setPrices] = useState({})
  const [error, setError] = useState(null)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    // Read in an effect, not during render: this page is prerendered. Every
    // setState here is async (react-hooks/set-state-in-effect); a missing
    // token just 404s into the 'missing' state.
    token.current = new URLSearchParams(window.location.search).get('t') ?? ''
    getPriceRequest(token.current)
      .then((v) => {
        setView(v)
        setState(v.status === 'answered' ? 'answered' : 'form')
      })
      .catch(() => setState('missing'))
  }, [])

  async function onSubmit(e) {
    e.preventDefault()
    const parsed = view.items.map((it) => ({ lineIndex: it.lineIndex, unitCents: parsePriceInput(prices[it.lineIndex]) }))
    if (parsed.some((p) => p.unitCents === null)) return setError('Captura un precio válido para cada producto.')
    setSending(true)
    setError(null)
    try {
      await answerPriceRequest({ t: token.current, prices: parsed })
      setView({ ...view, answered: parsed })
      setState('done')
    } catch (err) {
      if (err.message === 'already_answered') setState('answered')
      else setError('No se pudieron guardar los precios. Intenta de nuevo.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="qd-page">
      <section className="qd-hero">
        {state === 'loading' && <p className="qd-step" role="status">Cargando…</p>}
        {state === 'missing' && <p className="qd-error">Este enlace no es válido o ya expiró.</p>}
        {state === 'answered' && <h1>Estos precios ya fueron capturados. Gracias.</h1>}
        {state === 'done' && (
          <>
            <h1>Precios recibidos. Gracias.</h1>
            <ul className="qd-card qd-catalog-list">
              {view.items.map((it) => {
                const p = view.answered.find((a) => a.lineIndex === it.lineIndex)
                return <li key={it.lineIndex}>{it.name}: {money(p.unitCents, view.currency)}</li>
              })}
            </ul>
          </>
        )}
        {state === 'form' && (
          <>
            <h1>Captura de precios</h1>
            <p className="qd-sub">
              Un cliente espera cotización. Captura el precio unitario ({view.currency}, sin IVA) de cada producto.
            </p>
            <form className="qd-card qd-upload" onSubmit={onSubmit}>
              {view.items.map((it) => (
                <label key={it.lineIndex} className="qd-price-row">
                  <span>
                    {it.name}
                    {it.sku && <span className="qd-meta"> {it.sku}</span>}
                    <span className="qd-meta"> · {it.qty} pza.</span>
                  </span>
                  <input
                    inputMode="decimal"
                    required
                    placeholder="0.00"
                    value={prices[it.lineIndex] ?? ''}
                    onChange={(e) => setPrices({ ...prices, [it.lineIndex]: e.target.value })}
                  />
                </label>
              ))}
              {error && <p className="qd-error">{error}</p>}
              <button type="submit" className="qd-btn" disabled={sending}>{sending ? 'Guardando…' : 'Enviar precios'}</button>
            </form>
          </>
        )}
      </section>
    </div>
  )
}
