import { ArrowRight } from 'lucide-react'
import { useLanguage } from '../i18n/useLanguage'
import { ROUTES, PRODUCT_PAGES } from '../i18n/copy'
import { track } from '../analytics'
import './Chooser.css'

// Order on the page. Each entry is a whole-card link to that product's home.
const PRODUCTS = ['crm', 'ar']

// The site root. Anytrail sells two products to the same buyers, so instead of
// guessing which one a visitor came for, the root asks.
function Chooser() {
  const { lang, copy } = useLanguage()
  const c = copy.chooser

  return (
    <section className="chooser">
      <div className="chooser__inner">
        <p className="chooser__label">{c.label}</p>
        <h1 className="chooser__title">{c.title}</h1>
        <p className="chooser__intro">{c.intro}</p>

        <ul className="chooser__grid">
          {PRODUCTS.map((id, i) => {
            const p = c.products[id]
            return (
              <li key={id} className="chooser__item">
                <a
                  className={`chooser__card chooser__card--${id}`}
                  href={ROUTES[lang][PRODUCT_PAGES[id].home]}
                  onClick={() => track('product_choice', { product: id, lang })}
                >
                  <span className="chooser__num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="chooser__card-label">{p.label}</span>
                  <h2 className="chooser__card-title">{p.title}</h2>
                  <p className="chooser__card-body">{p.body}</p>
                  <span className="chooser__cta">
                    {p.cta}
                    <ArrowRight className="chooser__cta-icon" size={18} aria-hidden="true" />
                  </span>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export default Chooser
