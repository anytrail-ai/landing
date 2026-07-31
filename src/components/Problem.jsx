import Section from './Section'
import './Problem.css'
import { useLanguage } from '../i18n/useLanguage'

function Problem() {
  const { copy } = useLanguage()
  const c = copy.problem

  return (
    <Section label={c.label} title={c.title} className="problem" wide>
      <p>{c.intro}</p>
      <ul className="problem__grid">
        {c.leaks.map((leak) => (
          <li key={leak.title} className="problem__card">
            <h3 className="problem__card-title">{leak.title}</h3>
            <p className="problem__card-body">{leak.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}

export default Problem
