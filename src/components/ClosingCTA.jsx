import CtaLink from './CtaLink'
import WhatsAppLink from './WhatsAppLink'
import './ClosingCTA.css'
import { useLanguage } from '../i18n/useLanguage'

// Defaults to the site-wide closing copy. Content pages pass their own, so the
// page can close on the argument the reader just finished rather than on the
// generic pitch. `location` keeps the CTA analytics distinguishable per page.
function ClosingCTA({ title, body, cta, location = 'closing' }) {
  const { copy } = useLanguage()
  const c = copy.closing

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
