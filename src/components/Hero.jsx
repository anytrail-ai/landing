import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import './Hero.css'
import CtaLink from './CtaLink'
import WhatsAppLink from './WhatsAppLink'
import AuditReport from './mockups/AuditReport'
import { useLanguage } from '../i18n/useLanguage'

function formatElapsed(total) {
  const m = Math.floor(total / 60)
  const s = String(total % 60).padStart(2, '0')
  return `${m}:${s}`
}

// Counts the visitor's own time on the page against the HBR 42-hour average
// reply. A real, sourced number made personal, instead of an invented
// "dollars lost" ticker. Starts at 0:00 in the prerender and ticks on the client.
function ReplyClock({ c }) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const started = Date.now()
    const id = setInterval(
      () => setElapsed(Math.floor((Date.now() - started) / 1000)),
      1000,
    )
    return () => clearInterval(id)
  }, [])

  return (
    <p className="hero__clock">
      <span className="hero__clock-lead">{c.clockLead}</span>{' '}
      <span className="hero__clock-time">
        <time dateTime={`PT${elapsed}S`}>{formatElapsed(elapsed)}</time>
      </span>
      <span className="hero__clock-tail">
        {c.clockTail} <span className="hero__clock-source">{c.clockSource}</span>
      </span>
    </p>
  )
}

function Hero() {
  const { copy } = useLanguage()
  const c = copy.hero

  return (
    <section className="hero">
      <div className="hero__inner">
        <h1 className="hero__title">{c.title}</h1>

        <div className="hero__grid">
          <div className="hero__copy">
            <p className="hero__subtitle">{c.subtitle}</p>
            <div className="hero__actions">
              <CtaLink className="hero__cta" location="hero">
                {c.cta}
                <ArrowRight className="hero__cta-icon" size={18} aria-hidden="true" />
              </CtaLink>
              <WhatsAppLink location="hero" />
            </div>
            <p className="hero__cta-note">{c.ctaNote}</p>
            <ReplyClock c={c} />
          </div>

          <div className="hero__media">
            <AuditReport />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
