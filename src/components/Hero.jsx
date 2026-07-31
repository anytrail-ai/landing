import './Hero.css'
import { DEMO_URL } from '../config'
import InboundConversation from './mockups/InboundConversation'
import { useLanguage } from '../i18n/useLanguage'

function Hero() {
  const { copy } = useLanguage()
  const c = copy.hero

  return (
    <section className="hero">
      <div className="hero__copy">
        <h1 className="hero__title">{c.title}</h1>
        <p className="hero__subtitle">{c.subtitle}</p>
        <div className="hero__actions">
          <a className="hero__cta" href={DEMO_URL}>
            {c.cta}
          </a>
          <p className="hero__cta-note">{c.ctaNote}</p>
        </div>
      </div>

      <div className="hero__media">
        <InboundConversation />
      </div>
    </section>
  )
}

export default Hero
