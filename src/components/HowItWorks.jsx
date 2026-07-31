import Section from './Section'
import './HowItWorks.css'
import { useLanguage } from '../i18n/useLanguage'

function HowItWorks() {
  const { copy } = useLanguage()
  const c = copy.how

  return (
    <Section label={c.label} title={c.title} className="how" wide>
      <p>{c.intro}</p>
      <ol className="how__steps">
        {c.steps.map((step, i) => (
          <li key={step.title} className="how__step">
            <span className="how__num" aria-hidden="true">
              {i + 1}
            </span>
            <div className="how__step-text">
              <h3 className="how__step-title">{step.title}</h3>
              <p className="how__step-body">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}

export default HowItWorks
