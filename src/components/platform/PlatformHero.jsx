import { ArrowRight } from 'lucide-react'
import '../Hero.css'
import './platform.css'
import CtaLink from '../CtaLink'
import WorkspaceMockup from './WorkspaceMockup'
import Phrases from './Phrases'
import { useLanguage } from '../../i18n/useLanguage'
import { useHeroTone } from './heroTone'

function PlatformHero() {
  const { copy } = useLanguage()
  const c = copy.platform.hero
  const { tone } = useHeroTone()

  return (
    <section className={`hero phero phero--${tone}`}>
      <div className="hero__inner">
        <div className="phero__top">
          <h1 className="hero__title">
            {c.lead} <Phrases phrases={c.phrases} />
          </h1>
          <p className="hero__subtitle">{c.subtitle}</p>
          <div className="hero__actions">
            <CtaLink className="hero__cta" location="hero">
              {c.cta}
              <ArrowRight className="hero__cta-icon" size={18} aria-hidden="true" />
            </CtaLink>
            <a className="phero__secondary" href="#modules">
              {c.secondary}
            </a>
          </div>
        </div>

        <WorkspaceMockup />
      </div>
    </section>
  )
}

export default PlatformHero
