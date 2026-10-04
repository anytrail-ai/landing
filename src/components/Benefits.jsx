import Section from './Section'
import './Benefits.css'
import { useLanguage } from '../i18n/useLanguage'

function Benefits() {
  const { copy } = useLanguage()
  const c = copy.benefits

  return (
    <Section label={c.label} title={c.title} className="benefits" wide>
      <ul className="benefits__grid">
        {c.items.map((item) => (
          <li key={item.title} className="benefits__card">
            <h3 className="benefits__card-title">{item.title}</h3>
            <p className="benefits__card-body">{item.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}

export default Benefits
