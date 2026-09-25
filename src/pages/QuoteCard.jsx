import { useEffect, useState } from 'react'
import { getQuote } from './quoteDemoApi'
import { money } from './quoteDemoUtil'
import PriceRequestDialog from './PriceRequestDialog'

const STATUS = { priced: null, unpriced: 'Sin precio en catálogo', no_match: 'No está en el catálogo' }

export default function QuoteCard({ result }) {
  const [quote, setQuote] = useState(result.quote)
  const [total, setTotal] = useState(result.totalCents)
  const [request, setRequest] = useState(null)
  const missing = quote.lines.filter((l) => l.status !== 'priced').length
  // The pop-up opens by itself the first time a quote comes back incomplete.
  const [dialogOpen, setDialogOpen] = useState(missing > 0)

  // Poll while a supplier request is pending: the answer lands here by itself.
  useEffect(() => {
    if (!request || request.status !== 'pending') return undefined
    const id = setInterval(async () => {
      try {
        const data = await getQuote(quote.quoteId)
        setQuote(data.quote)
        setTotal(data.totalCents)
        if (data.request) setRequest(data.request)
      } catch {
        // Transient; the next tick retries.
      }
    }, 5000)
    return () => clearInterval(id)
  }, [request, quote.quoteId])

  return (
    <section className="qd-card qd-quote" aria-live="polite">
      <header className="qd-quote-head">
        <h2>Cotización</h2>
        <span className="qd-meta">#{quote.quoteId.slice(0, 8)}</span>
      </header>
      {quote.lines.length === 0 ? (
        <p className="qd-hint">No encontramos productos en la conversación. Pide algo concreto y vuelve a generar.</p>
      ) : (
        <div className="qd-table-wrap">
          <table className="qd-table">
            <thead>
              <tr>
                <th scope="col">Producto</th>
                <th scope="col">Cant.</th>
                <th scope="col">Precio unit.</th>
                <th scope="col">Importe</th>
              </tr>
            </thead>
            <tbody>
              {quote.lines.map((l, i) => (
                <tr key={i} className={l.status === 'priced' ? '' : 'qd-row-missing'}>
                  <td>
                    {l.name}
                    {l.sku && <span className="qd-meta"> {l.sku}</span>}
                    {STATUS[l.status] && <span className="qd-badge qd-badge-warn">{STATUS[l.status]}</span>}
                    {l.fromSupplier && <span className="qd-badge qd-badge-ok">Precio recibido del proveedor</span>}
                  </td>
                  <td>{l.qty}</td>
                  <td>{l.unitCents === null ? '—' : money(l.unitCents, quote.currency)}</td>
                  <td>{l.unitCents === null ? '—' : money(l.unitCents * l.qty, quote.currency)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3}>{missing > 0 ? 'Total parcial' : 'Total'}</td>
                <td>{money(total, quote.currency)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {missing > 0 && !request && (
        <button type="button" className="qd-btn" onClick={() => setDialogOpen(true)}>
          Pedir precio al proveedor ({missing})
        </button>
      )}
      {request && (
        <p className={`qd-request ${request.status === 'answered' ? 'qd-request-ok' : ''}`}>
          {request.status === 'answered'
            ? `El proveedor (${request.to}) capturó los precios.`
            : `Correo enviado a ${request.to}. Recordatorios enviados: ${request.remindersSent} de ${request.maxReminders}. Esperando precios…`}
        </p>
      )}

      <PriceRequestDialog
        open={dialogOpen && !request}
        quoteId={quote.quoteId}
        draft={result.draft}
        missing={missing}
        onClose={() => setDialogOpen(false)}
        onSent={(r) => {
          setRequest(r)
          setDialogOpen(false)
        }}
      />
    </section>
  )
}
