import Section from './Section'
import './Different.css'
import { useLanguage } from '../i18n/useLanguage'

function Different() {
  const { copy } = useLanguage()
  const c = copy.different

  return (
    <Section label={c.label} title={c.title} className="different" wide>
      <p>{c.intro}</p>
      <div className="different__grid">
        {c.comparisons.map((item) => (
          <div key={item.label} className="different__card">
            <h3 className="different__card-label">{item.label}</h3>
            <p className="different__card-body">{item.body}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}

export default Different
