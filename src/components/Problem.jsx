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
      <ul className="problem__stats">
        {c.stats.map((stat) => (
          <li key={stat.value} className="problem__stat" data-reveal>
            <span className="problem__stat-value">{stat.value}</span>
            <span className="problem__stat-body">{stat.body}</span>
            <a
              className="problem__stat-source"
              href={stat.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {stat.source}
            </a>
          </li>
        ))}
      </ul>

      {/* The leaks as a ledger. Each line is struck through in moss as it
          scrolls in: the leak, then Anytrail closing it. The two groups are the
          positioning: outbound and inbound are the same leak seen from two
          ends. Line numbers run across both groups like one book. */}
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
                        <span className="ledger__strike">{leak.title}</span>
                      </h4>
                      <p className="ledger__body">{leak.body}</p>
                    </div>
                    <span className="ledger__stamp">
                      <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false">
                        <path
                          d="M2.5 6.2 5 8.7l4.5-5.4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {c.caught}
                    </span>
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
