import Band from './Band'
import './Problem.css'
import { useLanguage } from '../i18n/useLanguage'

function Problem() {
  const { copy } = useLanguage()
  const c = copy.problem
  // where each group's line numbering starts, so numbers run across groups
  const starts = c.groups.map((_, g) =>
    c.groups.slice(0, g).reduce((n, group) => n + group.leaks.length, 0),
  )

  return (
    <Band label={c.label} title={c.title} intro={c.intro} className="problem">
      <div className="ledger">
        {c.groups.map((group, g) => (
          <div key={group.label} className="ledger__group">
            <h3 className="ledger__group-label">{group.label}</h3>
            <ol className="ledger__rows">
              {group.leaks.map((leak, i) => {
                const line = starts[g] + i + 1
                return (
                  <li key={leak.title} className="ledger__row" data-reveal>
                    <span className="ledger__no" aria-hidden="true">
                      {c.linePrefix}
                      {String(line).padStart(2, '0')}
                    </span>
                    <div className="ledger__text">
                      <h4 className="ledger__title">
                        {leak.title}
                      </h4>
                      <p className="ledger__body">{leak.body}</p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        ))}
      </div>
    </Band>
  )
}

export default Problem
