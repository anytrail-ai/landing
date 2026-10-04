import Band from './Band'
import './Proof.css'
import { useLanguage } from '../i18n/useLanguage'

function Proof() {
  const { copy } = useLanguage()
  const c = copy.proof
  const quotes = c.testimonials.filter((t) => t.quote)

  return (
    <Band tone="ink" label={c.label} title={c.title} className="proof">
      <div className="proof__lead" data-reveal>
        <p className="proof__stat">
          <strong className="proof__stat-value">{c.stat}</strong>
          <span className="proof__stat-label">{c.statLabel}</span>
        </p>
        <p className="proof__body">{c.p2}</p>
      </div>

      {quotes.map((t) => (
        <figure key={t.company} className="proof__quote" data-reveal>
          <blockquote>{t.quote}</blockquote>
          <figcaption>
            {[t.name, t.role, t.company].filter(Boolean).join(' · ')}
          </figcaption>
        </figure>
      ))}

      <div className="proof__rows">
        <div className="proof__row">
          <p className="proof__row-label">{c.customersLabel}</p>
          {/* A customer shows as its logo once `logo` (a /public path) is set,
              and as a set wordmark until then. */}
          <ul className="proof__logos">
            {c.testimonials.map((t) => (
              <li key={t.company} className="proof__logo">
                {t.logo ? (
                  <img src={t.logo} alt={t.company} height="28" loading="lazy" />
                ) : (
                  t.company
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="proof__row">
          <p className="proof__row-label">{c.integrationsLabel}</p>
          <ul className="proof__names">
            {c.integrations.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      </div>
    </Band>
  )
}

export default Proof
