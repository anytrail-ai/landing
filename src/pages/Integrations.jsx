import { ArrowRight, Plus } from 'lucide-react'
import '../components/Hero.css'
import '../components/platform/platform.css'
import '../components/platform/integrations.css'
import Band from '../components/Band'
import CtaLink from '../components/CtaLink'
import { useReveal } from '../hooks/useReveal'
import { useLanguage } from '../i18n/useLanguage'
import { ROUTES } from '../i18n/copy'

// What Anytrail connects to, who controls what it does with the connection,
// and the questions people ask before connecting. Linked from the home
// page's "ERP and rollout" section. Every integration named here is listed
// in copyIntegrations.js, which says what may be added to it.
function Integrations() {
  useReveal()
  const { copy, lang } = useLanguage()
  const c = copy.integrations

  return (
    <>
      <section className="hero intg-hero">
        <div className="hero__inner">
          <p className="intg-hero__label">{c.hero.label}</p>
          <h1 className="hero__title">{c.hero.title}</h1>
          <p className="hero__subtitle">{c.hero.body}</p>
          <div className="hero__actions">
            <CtaLink className="hero__cta" location="integrations_hero">
              {c.hero.cta}
              <ArrowRight className="hero__cta-icon" size={18} aria-hidden="true" />
            </CtaLink>
            <a className="phero__secondary" href="#list">
              {c.hero.secondary}
            </a>
          </div>
        </div>
      </section>

      <Band id="list" label={c.list.label} title={c.list.title} className="intg">
        <ul className="intg__grid">
          {c.list.groups.map((group) => (
            <li key={group.name} className="intg__card" data-reveal>
              <h3>{group.name}</h3>
              <p>{group.body}</p>
              <ul className="intg__names">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
          <li className="intg__card intg__card--other" data-reveal>
            <h3>{c.list.other.title}</h3>
            <p>{c.list.other.body}</p>
            <CtaLink className="mods__link" location="integrations_other">
              {c.list.other.cta}
              <ArrowRight size={14} aria-hidden="true" />
            </CtaLink>
          </li>
        </ul>
      </Band>

      <Band
        tone="ink"
        label={c.control.label}
        title={c.control.title}
        intro={c.control.body}
        className="intg"
      >
        <ul className="intg__control">
          {c.control.items.map((item) => (
            <li key={item.title} data-reveal>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ul>
        <a className="mods__link" href={ROUTES[lang].privacy}>
          {c.control.link}
          <ArrowRight size={14} aria-hidden="true" />
        </a>
      </Band>

      <section className="band band--paper intg-faq">
        <div className="band__inner intg-faq__inner">
          <div className="intg-faq__side">
            <h2 className="band__title">{c.faq.title}</h2>
            <p>{c.faq.body}</p>
            <CtaLink className="hero__cta" location="integrations_faq">
              {c.faq.cta}
              <ArrowRight className="hero__cta-icon" size={18} aria-hidden="true" />
            </CtaLink>
          </div>
          {/* native <details>: every answer is in the prerendered HTML */}
          <div className="intg-faq__list">
            {c.faq.items.map((item, i) => (
              <details key={item.q} className="intg-faq__item" open={i === 0}>
                <summary>
                  {item.q}
                  <Plus className="intg-faq__icon" size={18} aria-hidden="true" />
                </summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Integrations
