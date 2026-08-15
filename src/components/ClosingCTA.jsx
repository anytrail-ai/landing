import CtaLink from './CtaLink'
import WhatsAppLink from './WhatsAppLink'
import './ClosingCTA.css'
import { useLanguage } from '../i18n/useLanguage'

function ClosingCTA() {
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
          <h2 className="closingcta__title">{c.title}</h2>
          <p className="closingcta__body">{c.body}</p>
          <CtaLink className="closingcta__cta" location="closing">
            {c.cta}
          </CtaLink>
          <WhatsAppLink location="closing" className="whatsapp-link--onDark" />
        </div>
      </div>
    </section>
  )
}

export default ClosingCTA
