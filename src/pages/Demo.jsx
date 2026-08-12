import { useRef, useState } from 'react'
import { startDemo, extract, prospects, chatTurn } from './demoApi'
import './Demo.css'

// Live demo: visitor's site gets crawled, a sales agent chats over their own
// products, optional ICP + 5 Apollo leads. Backend lives in anytrail-ai/
// public-demo; this page is only the frontend, wrapped by the landing's
// Navbar/Footer via App.jsx.
// Products the agent mentions get their card (with photo) attached under the
// bubble. Match on the full name or on distinctive model-code tokens (mixed
// letters+digits, length >= 4) so "the S2EM1500A" still matches.
function matchProducts(text, products) {
  if (!text) return []
  const lower = text.toLowerCase()
  return products.filter((p) => {
    if (lower.includes(p.name.toLowerCase())) return true
    return p.name
      .split(/[\s,()/-]+/)
      .some(
        (tok) =>
          tok.length >= 4 &&
          /\d/.test(tok) &&
          /[a-z]/i.test(tok) &&
          lower.includes(tok.toLowerCase()),
      )
  })
}

const ERRORS = {
  invalid_website: "We couldn't use that website address — check the URL and try again.",
  site_unreadable: "We couldn't read that site. Try another URL (maybe the www version).",
  rate_limited:
    "Straight up: each demo run costs us real AI credits, so we cap runs per network per day — and this network just hit it. Come back tomorrow, or book a call and we'll run it live with you.",
  invalid_input: 'Please fill every field with valid values.',
}

export default function Demo() {
  const [stage, setStage] = useState('form')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [wantsProspects, setWantsProspects] = useState(true)
  const [error, setError] = useState(null)
  const [steps, setSteps] = useState([])

  const [sessionId, setSessionId] = useState('')
  const [profile, setProfile] = useState(null)
  const [icp, setIcp] = useState(null)
  const [leads, setLeads] = useState(null)
  const [leadsPending, setLeadsPending] = useState(false)

  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [ended, setEnded] = useState(false)
  const [showEndScreen, setShowEndScreen] = useState(false)
  const [reviewing, setReviewing] = useState(false)
  const chatEndRef = useRef(null)

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    setStage('working')
    setSteps(['Saving your details…'])
    try {
      const { sessionId: sid } = await startDemo({ name, email, websiteUrl, wantsProspects })
      setSessionId(sid)
      const { profile: p } = await extract(sid, (step) => setSteps((s) => [...s, step]))
      setProfile(p)
      setSteps((s) => [...s, 'Your sales agent is ready.'])
      setStage('chat')
      if (wantsProspects) {
        setLeadsPending(true)
        prospects(sid)
          .then((r) => {
            setIcp(r.icp)
            setLeads(r.leads)
          })
          .catch(() => setLeads([]))
          .finally(() => setLeadsPending(false))
      }
    } catch (err) {
      setStage('form')
      setError(ERRORS[err.message] ?? 'Something went wrong — please try again.')
    }
  }

  async function onSend(e) {
    e.preventDefault()
    const text = draft.trim()
    if (!text || busy || ended) return
    setDraft('')
    setBusy(true)
    const history = [...messages, { role: 'user', text }]
    setMessages([...history, { role: 'assistant', text: '' }])
    try {
      const { ended: nowEnded } = await chatTurn(sessionId, history, (delta) => {
        setMessages((m) => {
          const copy = [...m]
          const last = copy[copy.length - 1]
          copy[copy.length - 1] = { ...last, text: last.text + delta }
          return copy
        })
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      })
      if (nowEnded) {
        setTimeout(() => {
          setEnded(true)
          setTimeout(() => setShowEndScreen(true), 900)
        }, 1800)
      }
    } catch {
      setMessages((m) => [
        ...m.slice(0, -1),
        { role: 'assistant', text: 'Sorry — something glitched. Try that again.' },
      ])
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="demo-page">
      {stage === 'form' && (
        <section className="demo-hero">
          <h1>See your own AI sales agent. Live, in one minute.</h1>
          <p className="demo-sub">
            We read your website, learn your products, and put an AI salesman in front of you
            — selling <em>your</em> stuff. Judge it yourself.
          </p>
          <form className="demo-card demo-form" onSubmit={onSubmit}>
            <label>
              Your name
              <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={200} placeholder="Ana García" />
            </label>
            <label>
              Work email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="ana@yourcompany.com" />
            </label>
            <label>
              Company website
              <input value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} required placeholder="yourcompany.com" />
            </label>
            <label className="demo-check">
              <input
                type="checkbox"
                checked={wantsProspects}
                onChange={(e) => setWantsProspects(e.target.checked)}
              />
              Also build my ideal customer profile + 5 matching leads
            </label>
            {error && <p className="demo-error">{error}</p>}
            <button className="demo-btn" type="submit">
              Build my sales agent
            </button>
          </form>
        </section>
      )}

      {stage === 'working' && (
        <section className="demo-hero">
          <div className="demo-card demo-steps">
            {steps.map((s, i) => (
              <p key={i} className={i === steps.length - 1 ? 'demo-step demo-step-active' : 'demo-step'}>
                {i === steps.length - 1 ? '● ' : '✓ '}
                {s}
              </p>
            ))}
          </div>
        </section>
      )}

      {stage === 'chat' && profile && profile.products.length > 0 && (
        <section className="demo-catalog">
          <h2>What the agent learned from your site</h2>
          <div className="demo-catalog-row">
            {profile.products.slice(0, 6).map((p, i) => (
              <div key={i} className="demo-product">
                {p.imageUrl && (
                  <img src={p.imageUrl} alt={p.name} loading="lazy" onError={(e) => (e.target.style.display = 'none')} />
                )}
                <strong>{p.name}</strong>
                {p.price && <span className="demo-price">{p.price}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {stage === 'chat' && profile && (
        <section className="demo-stage">
          <div className="demo-chat demo-card">
            <header className="demo-chat-head">
              <strong>{profile.companyName}</strong> — AI sales agent
            </header>
            <div className={`demo-chat-log${ended && !reviewing ? ' demo-chat-log-fade' : ''}`}>
              {messages.length === 0 && (
                <p className="demo-hint">
                  Ask anything a customer would — products, prices, use cases. It answers from
                  your site.
                </p>
              )}
              {messages.flatMap((m, i) => {
                const parts = m.text ? m.text.split(/\n{2,}/).filter(Boolean) : ['']
                return parts.flatMap((part, j) => {
                  const bubble = (
                    <div key={`${i}-${j}`} className={`demo-bubble demo-bubble-${m.role}`}>
                      {part || <span className="demo-typing">…</span>}
                    </div>
                  )
                  const matched =
                    m.role === 'assistant' && !busy
                      ? matchProducts(part, profile.products).filter((p) => p.imageUrl)
                      : []
                  if (!matched.length) return [bubble]
                  return [
                    bubble,
                    <div key={`${i}-${j}-cards`} className="demo-inline-cards">
                      {matched.slice(0, 2).map((p, k) => (
                        <div key={k} className="demo-product demo-product-inline">
                          <img src={p.imageUrl} alt={p.name} loading="lazy" onError={(e) => (e.target.style.display = 'none')} />
                          <strong>{p.name}</strong>
                          {p.price && <span className="demo-price">{p.price}</span>}
                        </div>
                      ))}
                    </div>,
                  ]
                })
              })}
              <div ref={chatEndRef} />
            </div>
            {showEndScreen && !reviewing && (
              <div className="demo-end-screen">
                <p>
                  This whole conversation was handled by an AI sales agent built on your
                  website in under a minute — imagine it working your real leads 24/7.
                </p>
                <a className="demo-btn" href="https://anytrail.ai">
                  Book a call with Anytrail
                </a>
                <button className="demo-link-btn" type="button" onClick={() => setReviewing(true)}>
                  Review the conversation
                </button>
              </div>
            )}
            {reviewing && (
              <div className="demo-review-bar">
                <span>Demo complete. This conversation is read-only.</span>
                <button className="demo-link-btn" type="button" onClick={() => setReviewing(false)}>
                  Back
                </button>
              </div>
            )}
            {!ended && (
              <form className="demo-chat-input" onSubmit={onSend}>
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type like a customer would…"
                  disabled={busy}
                  maxLength={4000}
                />
                <button className="demo-btn" disabled={busy || !draft.trim()}>
                  Send
                </button>
              </form>
            )}
          </div>

          {wantsProspects && (
            <aside className="demo-card demo-leads">
              <h2>Your ICP + 5 leads</h2>
              {leadsPending && (
                <div className="demo-skeleton" aria-label="Finding your leads…">
                  <div className="demo-skel demo-skel-icp" />
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="demo-skel-lead">
                      <div className="demo-skel demo-skel-title" />
                      <div className="demo-skel demo-skel-meta" />
                      <div className="demo-skel demo-skel-body" />
                    </div>
                  ))}
                </div>
              )}
              {icp && <p className="demo-icp">{icp.icp_summary}</p>}
              {leads && leads.length === 0 && !leadsPending && (
                <p className="demo-hint">Lead search came up empty this time.</p>
              )}
              {leads?.map((l, i) => (
                <div key={i} className="demo-lead">
                  <strong>
                    {l.website ? (
                      <a href={l.website} target="_blank" rel="noreferrer">
                        {l.company}
                      </a>
                    ) : (
                      l.company
                    )}
                  </strong>
                  <span className="demo-meta">
                    {[l.industry, l.location, l.employees ? `~${l.employees} employees` : null]
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
                  {l.contact && (
                    <span className="demo-meta">
                      {l.contact.linkedinUrl ? (
                        <a href={l.contact.linkedinUrl} target="_blank" rel="noreferrer">
                          {l.contact.name}
                        </a>
                      ) : (
                        l.contact.name
                      )}
                      {l.contact.title ? ` — ${l.contact.title}` : ''}
                      {l.contact.email && (
                        <>
                          {' · '}
                          <a href={`mailto:${l.contact.email}`}>{l.contact.email}</a>
                        </>
                      )}
                    </span>
                  )}
                  <p>{l.whyFit}</p>
                </div>
              ))}
            </aside>
          )}
        </section>
      )}
    </div>
  )
}
