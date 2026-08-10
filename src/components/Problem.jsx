import Section from './Section'
import './Problem.css'
import { useLanguage } from '../i18n/useLanguage'

function Problem() {
  const { copy } = useLanguage()
  const c = copy.problem

  return (
    <Section label={c.label} title={c.title} className="problem" wide>
      <p>{c.intro}</p>
      {/* Two groups: demand that was never found, and demand that was answered
          too late. The split is the positioning — outbound and inbound are the
          same leak seen from two ends. */}
      {c.groups.map((group) => (
        <div key={group.label} className="problem__group">
          <h3 className="problem__group-label">{group.label}</h3>
          <ul className="problem__grid">
            {group.leaks.map((leak) => (
              <li key={leak.title} className="problem__card">
                <h4 className="problem__card-title">{leak.title}</h4>
                <p className="problem__card-body">{leak.body}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </Section>
  )
}

export default Problem
