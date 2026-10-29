import { ArrowRight } from 'lucide-react'
import CtaLink from './CtaLink'
import WhatsAppLink from './WhatsAppLink'
import './ClosingCTA.css'
import { useLanguage } from '../i18n/useLanguage'

// Defaults to the site-wide closing copy. Content pages pass their own, so the
// page can close on the argument the reader just finished rather than on the
// generic pitch. `location` keeps the CTA analytics distinguishable per page.
// `variant="band"` is the homepage's full-bleed ink close; content pages keep
// the photo card.
function ClosingCTA({ title, body, cta, location = 'closing', variant = 'card' }) {
  const { copy } = useLanguage()
  const c = copy.closing

  if (variant === 'band') {
    return (
      <section className="closingband">
        <div className="closingband__inner">
          <h2 className="closingband__title">{title ?? c.title}</h2>
          <div className="closingband__foot">
            <p className="closingband__body">{body ?? c.body}</p>
            <div className="closingband__actions">
              <CtaLink className="closingband__cta" location={location}>
                {cta ?? c.cta}
                <ArrowRight size={18} aria-hidden="true" />
              </CtaLink>
              <WhatsAppLink location={location} className="whatsapp-link--onDark" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="closingcta">
      <div className="closingcta__card">
        <img
          className="closingcta__image"
          src="/hero.jpg"
          alt=""
          width="1535"
          height="1024"
          loading="lazy"
          decoding="async"
        />
        <div className="closingcta__overlay" aria-hidden="true" />
        <div className="closingcta__inner">
          <h2 className="closingcta__title">{title ?? c.title}</h2>
          <p className="closingcta__body">{body ?? c.body}</p>
          <CtaLink className="closingcta__cta" location={location}>
            {cta ?? c.cta}
          </CtaLink>
          <WhatsAppLink location={location} className="whatsapp-link--onDark" />
        </div>
      </div>
    </section>
  )
}

export default ClosingCTA
