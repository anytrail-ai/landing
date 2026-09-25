import { useRef, useState } from 'react'
import QuoteCard from './QuoteCard'
import QuoteChat from './QuoteChat'
import { generateQuote, loadCatalog } from './quoteDemoApi'
import { fileToBase64, money } from './quoteDemoUtil'
import { extractPdfText } from './pdfText'
import './QuoteDemo.css'

// PDFs up to this size go to Bedrock whole (its document limit is 4.5 MB, and
// base64 must also fit the Function URL's 6 MB request cap). Bigger ones,
// usually a catalogue full of product photos, are read in the browser and
// only their text is sent.
const MAX_PDF_WHOLE = 4 * 1024 * 1024
const MAX_PDF_FILE = 50 * 1024 * 1024
const MAX_TEXT = 200_000
// Less text than this from a big PDF means it has no text layer (a scan).
const MIN_PDF_TEXT = 200
const CATALOG_ERRORS = {
  catalog_unreadable: 'No pudimos leer el catálogo. Prueba con otro archivo o usa el de ejemplo.',
  catalog_too_large: 'El catálogo es muy grande (máximo 50 MB en PDF o 200 KB en texto).',
  catalog_scanned: 'Este PDF no tiene texto seleccionable (parece escaneado). Pega la lista de precios como texto.',
  rate_limited: 'Llegaste al límite de catálogos de la demo por hoy. Usa el de ejemplo.',
}

export default function QuoteDemo() {
  const [session, setSession] = useState(null) // { sessionId, catalog }
  const [step, setStep] = useState(null)
  const [error, setError] = useState(null)
  const [text, setText] = useState('')
  const [messages, setMessages] = useState([])
  const [quoting, setQuoting] = useState(null) // step text while generating
  const [result, setResult] = useState(null)
  // Synchronous single-flight guard: onReady/playSample capture quote() at the
  // start of a chat turn, so the `quoting` state from that stale render can
  // still read null when the button is also clicked mid-turn. A ref is read
  // and written only inside the handler, never during render.
  const quotingRef = useRef(false)

  async function start(source) {
    setError(null)
    setStep('Preparando…')
    try {
      setSession(await loadCatalog(source, setStep))
    } catch (err) {
      setError(CATALOG_ERRORS[err.message] ?? 'Algo salió mal. Intenta de nuevo.')
    } finally {
      setStep(null)
    }
  }

  async function onFile(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      if (file.size > MAX_PDF_FILE) return setError(CATALOG_ERRORS.catalog_too_large)
      if (file.size <= MAX_PDF_WHOLE) return start({ pdfBase64: await fileToBase64(file) })
      return startFromBigPdf(file)
    }
    if (file.size > MAX_TEXT) return setError(CATALOG_ERRORS.catalog_too_large)
    return start({ text: await file.text() })
  }

  async function startFromBigPdf(file) {
    setError(null)
    setStep('Leyendo el PDF en tu navegador…')
    let extracted
    try {
      extracted = await extractPdfText(file, {
        maxChars: MAX_TEXT,
        onProgress: (n, total) => setStep(`Leyendo el PDF en tu navegador… página ${n} de ${total}`),
      })
    } catch (err) {
      console.error('pdf_text_extract_failed', err)
      setStep(null)
      return setError(CATALOG_ERRORS.catalog_unreadable)
    }
    if (extracted.text.length < MIN_PDF_TEXT) {
      setStep(null)
      return setError(CATALOG_ERRORS.catalog_scanned)
    }
    // A catalogue longer than MAX_TEXT is cut there; the backend keeps the
    // first 80 products anyway, so the tail would not be used.
    return start({ text: extracted.text })
  }

  function onPastedText() {
    if (text.length > MAX_TEXT) return setError(CATALOG_ERRORS.catalog_too_large)
    return start({ text })
  }

  async function quote(history) {
    if (quotingRef.current) return
    setError(null)
    quotingRef.current = true
    setResult(null)
    setQuoting('Generando cotización…')
    try {
      // Drop the streaming placeholder (empty/whitespace text) a mid-turn
      // click can capture; if nothing from the customer is left, there is
      // nothing to quote.
      const cleaned = history.filter((m) => m.text.trim())
      if (!cleaned.some((m) => m.role === 'user')) return
      setResult(await generateQuote(session.sessionId, cleaned, setQuoting))
    } catch {
      setError('No se pudo generar la cotización. Intenta de nuevo.')
    } finally {
      quotingRef.current = false
      setQuoting(null)
    }
  }

  if (!session) {
    return (
      <div className="qd-page">
        <section className="qd-hero">
          <h1>Del catálogo a la cotización, sin esperar a nadie</h1>
          <p className="qd-sub">
            Sube el catálogo de tu proveedor. Un agente de IA atiende al cliente por WhatsApp, genera la cotización con
            tus precios y, si falta alguno, se lo pide al proveedor por correo hasta obtenerlo.
          </p>
          <div className="qd-card qd-upload">
            <label className="qd-drop">
              <input type="file" accept=".pdf,.txt,.csv,.md,application/pdf,text/plain,text/csv" onChange={onFile} disabled={Boolean(step)} />
              <strong>Subir catálogo (PDF o texto)</strong>
              <span>PDF hasta 50 MB, texto hasta 200 KB</span>
            </label>
            <textarea
              rows={5}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="…o pega aquí la lista de precios"
              disabled={Boolean(step)}
            />
            <div className="qd-upload-actions">
              <button type="button" className="qd-btn" disabled={Boolean(step) || !text.trim()} onClick={onPastedText}>
                Usar texto pegado
              </button>
              <button type="button" className="qd-btn-ghost" disabled={Boolean(step)} onClick={() => start({ sample: true })}>
                Usar catálogo de ejemplo
              </button>
            </div>
            {step && <p className="qd-step" role="status">{step}</p>}
            {error && <p className="qd-error">{error}</p>}
          </div>
        </section>
      </div>
    )
  }

  const { catalog } = session
  const unpriced = catalog.items.filter((i) => i.priceCents === null).length

  return (
    <div className="qd-page qd-workspace">
      <QuoteChat
        sessionId={session.sessionId}
        supplier={catalog.supplier}
        messages={messages}
        setMessages={setMessages}
        onReady={quote}
        disabled={Boolean(quoting)}
      />
      <div className="qd-side">
        <div className="qd-actions">
          <button type="button" className="qd-btn" disabled={Boolean(quoting) || !messages.length} onClick={() => quote(messages)}>
            Generar cotización
          </button>
          {quoting && <span className="qd-step" role="status">{quoting}</span>}
          {error && <span className="qd-error">{error}</span>}
        </div>
        {result && <QuoteCard key={result.quote.quoteId} result={result} />}
        <details className="qd-card qd-catalog" open={!result}>
          <summary>
            Catálogo · {catalog.supplier} · {catalog.items.length} productos{unpriced ? ` · ${unpriced} sin precio` : ''}
          </summary>
          <ul>
            {catalog.items.map((i) => (
              <li key={i.id}>
                <span>{i.name}{i.sku && <span className="qd-meta"> {i.sku}</span>}</span>
                <span className={i.priceCents === null ? 'qd-meta' : ''}>
                  {i.priceCents === null ? 'sin precio' : money(i.priceCents, catalog.currency)}
                </span>
              </li>
            ))}
          </ul>
        </details>
      </div>
    </div>
  )
}
