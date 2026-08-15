import Section from './Section'
import ClosingCTA from './ClosingCTA'
import './ClusterPage.css'
import { useLanguage } from '../i18n/useLanguage'
import { ROUTES } from '../i18n/copy'

// One long-form content page, rendered entirely from a copy block. The three
// SEO cluster pages differ only in their prose, so the shape lives here and
// the argument lives in copy.js. Adding the next one is a copy block, a ROUTES
// entry, and a line in PAGES.
//
// `key` names the copy block, so <ClusterPage key="speedToLead" /> would clash
// with React's reserved prop. It is `copyKey`.
function ClusterPage({ copyKey }) {
  const { lang, copy } = useLanguage()
  const c = copy[copyKey]

  return (
    <>
      <header className="cluster__head">
        <div className="cluster__head-inner">
          <h1 className="cluster__title">{c.h1}</h1>
          {c.lede.map((p) => (
            <p key={p} className="cluster__lede">
              {p}
            </p>
          ))}
        </div>
      </header>

      {c.sections.map((section) => (
        <Section
          key={section.title}
          label={section.label}
          title={section.title}
          className="cluster__section"
          wide={Boolean(section.points)}
        >
          {section.paras.map((p) => (
            <p key={p}>{p}</p>
          ))}

          {section.points && (
            <div className="cluster__points">
              {section.pointsLabel && (
                <h3 className="cluster__points-label">{section.pointsLabel}</h3>
              )}
              <ul className="cluster__grid">
                {section.points.map((point) => (
                  <li key={point.title} className="cluster__card">
                    <h4 className="cluster__card-title">{point.title}</h4>
                    <p className="cluster__card-body">{point.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Section>
      ))}

      {/* Kept visually distinct from the argument above it. What we cannot
          claim is a section of its own, not a hedge buried in a paragraph. */}
      <Section className="cluster__section">
        <div className="cluster__limits">
          <h2 className="cluster__limits-title">{c.limits.title}</h2>
          <ul className="cluster__limits-list">
            {c.limits.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </Section>

      <Section className="cluster__section">
        <nav className="cluster__related" aria-label={c.relatedLabel}>
          <h2 className="cluster__related-label">{c.relatedLabel}</h2>
          <ul className="cluster__related-list">
            {c.related.map((link) => (
              <li key={link.page}>
                <a href={ROUTES[lang][link.page]}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </Section>

      <ClosingCTA
        title={c.closing.title}
        body={c.closing.body}
        cta={c.closing.cta}
        location={copyKey}
      />
    </>
  )
}

export default ClusterPage
