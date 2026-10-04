import Band from './Band'
import './Benefits.css'
import { useLanguage } from '../i18n/useLanguage'

function Benefits() {
  const { copy } = useLanguage()
  const c = copy.benefits

  return (
    <Band label={c.label} title={c.title} className="benefits">
      <ol className="benefits__list">
        {c.items.map((item, i) => (
          <li key={item.title} className="benefits__row" data-reveal>
            <span className="benefits__num" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="benefits__title">{item.title}</h3>
            <p className="benefits__body">{item.body}</p>
          </li>
        ))}
      </ol>
    </Band>
  )
}

export default Benefits
