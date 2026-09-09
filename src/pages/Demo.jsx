import { useState } from 'react'
import { captureLead } from './demoApi'
import { fill, phoneLooksValid } from './phone'
import { useLanguage } from '../i18n/useLanguage'
import { track } from '../analytics'
import { DEMO_WHATSAPP_MESSAGE, DEMO_WHATSAPP_NUMBER } from '../config'
import './Demo.css'

// Live demo: the visitor leaves a name, phone number and email, the backend
// records them (DynamoDB row + Slack ping + CloudWatch line, see
// demo-backend/src/api/lead.ts), and the page hands them to the WhatsApp
// agent with a prefilled opener. Copy comes from copy.js, so /demo and
// /es/demo are the same component in two languages.
const WHATSAPP_HREF = `https://wa.me/${DEMO_WHATSAPP_NUMBER}?text=${encodeURIComponent(
  DEMO_WHATSAPP_MESSAGE,
)}`

// Deliberately loose: one "@" with something on both sides and a dot in the
// domain. The backend's zod schema is the real gate; this only catches typos
// before a round trip.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Demo() {
  const { lang, copy } = useLanguage()
  const c = copy.demo
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  // 'form' → 'saving' → 'done'; errors drop back to 'form'.
  const [stage, setStage] = useState('form')
  const [error, setError] = useState(null)

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    const cleanName = name.trim()
    const cleanPhone = phone.trim()
    const cleanEmail = email.trim()
    if (!cleanName || !cleanPhone || !cleanEmail) {
      setError(c.errors.invalid_input)
      return
    }
    if (!phoneLooksValid(cleanPhone)) {
      setError(c.errors.invalid_phone)
      return
    }
    if (!EMAIL_RE.test(cleanEmail)) {
      setError(c.errors.invalid_email)
      return
    }
    setStage('saving')
    try {
      await captureLead({ name: cleanName, phone: cleanPhone, email: cleanEmail, lang })
      track('demo_lead_saved', { lang })
      setStage('done')
    } catch (err) {
      setStage('form')
      setError(c.errors[err.message] ?? c.errors.generic)
    }
  }

  const saving = stage === 'saving'

  return (
    <div className="demo-page">
      <section className="demo-hero">
        {stage === 'done' ? (
          <div className="demo-card demo-done">
            <h1>{fill(c.done.title, { name: name.trim() })}</h1>
            <p className="demo-sub">{c.done.body}</p>
            <a
              className="demo-btn demo-btn-whatsapp"
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('demo_whatsapp_click', { lang })}
            >
              {c.done.cta}
            </a>
            <p className="demo-message">
              <span className="demo-message-label">{c.done.messageLabel}</span>
              <q>{DEMO_WHATSAPP_MESSAGE}</q>
            </p>
          </div>
        ) : (
          <>
            <h1>{c.hero.title}</h1>
            <p className="demo-sub">{c.hero.sub}</p>
            <form className="demo-card demo-form" onSubmit={onSubmit}>
              <label>
                {c.form.name}
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={200}
                  autoComplete="name"
                  placeholder={c.form.namePlaceholder}
                  disabled={saving}
                />
              </label>
              <label>
                {c.form.phone}
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  maxLength={40}
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder={c.form.phonePlaceholder}
                  disabled={saving}
                />
                <span className="demo-hint">{c.form.phoneHint}</span>
              </label>
              <label>
                {c.form.email}
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  maxLength={320}
                  autoComplete="email"
                  inputMode="email"
                  placeholder={c.form.emailPlaceholder}
                  disabled={saving}
                />
              </label>
              {error && <p className="demo-error">{error}</p>}
              <button className="demo-btn" type="submit" disabled={saving}>
                {saving ? c.form.saving : c.form.submit}
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  )
}
