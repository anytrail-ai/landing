import { ArrowRight } from 'lucide-react'
import './Hero.css'
import CtaLink from './CtaLink'
import AuditReport from './mockups/AuditReport'
import { useLanguage } from '../i18n/useLanguage'

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
            </div>
            <p className="hero__cta-note">{c.ctaNote}</p>
            <p className="hero__scope">{c.scope}</p>
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
