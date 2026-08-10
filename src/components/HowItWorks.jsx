import Section from './Section'
import './HowItWorks.css'
import { useLanguage } from '../i18n/useLanguage'

function HowItWorks() {
  const { copy } = useLanguage()
  const c = copy.how

  return (
    <Section label={c.label} title={c.title} className="how" wide>
      <p>{c.intro}</p>
      {/* Two entry points, then one shared path. The entries are alternatives,
          not a sequence, so they are an unnumbered ul; only the shared path is
          ordered. */}
      <h3 className="how__group-label">{c.entriesLabel}</h3>
      <ul className="how__entries">
        {c.entries.map((entry) => (
          <li key={entry.title} className="how__entry">
            <h4 className="how__step-title">{entry.title}</h4>
            <p className="how__step-body">{entry.body}</p>
          </li>
        ))}
      </ul>
      <h3 className="how__group-label">{c.sharedLabel}</h3>
      <ol className="how__steps">
        {c.steps.map((step, i) => (
          <li key={step.title} className="how__step">
            <span className="how__num" aria-hidden="true">
              {i + 1}
            </span>
            <div className="how__step-text">
              <h4 className="how__step-title">{step.title}</h4>
              <p className="how__step-body">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}

export default HowItWorks
