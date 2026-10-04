import Section from './Section'
import './Proof.css'
import { useLanguage } from '../i18n/useLanguage'

function Proof() {
  const { copy } = useLanguage()
  const c = copy.proof
  const quotes = c.testimonials.filter((t) => t.quote)

  return (
    <Section label={c.label} title={c.title} className="proof">
      <p className="proof__stat">
        <strong className="proof__stat-value">{c.stat}</strong>
        <span className="proof__stat-label">{c.statLabel}</span>
      </p>
      <p>{c.p2}</p>

      {quotes.map((t) => (
        <figure key={t.company} className="proof__quote">
          <blockquote>{t.quote}</blockquote>
          <figcaption>
            {[t.name, t.role, t.company].filter(Boolean).join(' · ')}
          </figcaption>
        </figure>
      ))}

      <div className="proof__row">
        <p className="proof__row-label">{c.customersLabel}</p>
        <ul className="proof__names">
          {c.testimonials.map((t) => (
            <li key={t.company}>{t.company}</li>
          ))}
        </ul>
      </div>
      <div className="proof__row">
        <p className="proof__row-label">{c.integrationsLabel}</p>
        <ul className="proof__names proof__names--small">
          {c.integrations.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </div>
    </Section>
  )
}

export default Proof
