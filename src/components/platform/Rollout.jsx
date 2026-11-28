import Band from '../Band'
import { Check } from 'lucide-react'
import { useLanguage } from '../../i18n/useLanguage'

// "ERP and rollout": two paragraphs, then three cards, each with a small
// drawing above its text. The drawings loop quietly on their own (CSS only)
// and hold still with reduced motion.

// Several ERPs flowing into one point.
function ErpDiagram({ names }) {
  const rowH = 30
  const height = names.length * rowH
  const mid = height / 2
  return (
    <svg className="roll__erp" viewBox={`0 0 300 ${height}`} aria-hidden="true">
      {names.map((name, i) => {
        const y = i * rowH + rowH / 2
        return (
          <g key={name}>
            <path
              className="roll__wire"
              d={`M96 ${y} C 170 ${y}, 180 ${mid}, 246 ${mid}`}
              style={{ '--d': `${i * 0.35}s` }}
            />
            <rect className="roll__chip" x="1" y={y - 11} width="95" height="22" rx="6" />
            <text className="roll__chip-text" x="48.5" y={y + 4} textAnchor="middle">
              {name}
            </text>
          </g>
        )
      })}
      <circle className="roll__hub" cx="260" cy={mid} r="14" />
      <circle className="roll__hub-core" cx="260" cy={mid} r="4.5" />
    </svg>
  )
}

// What each agent may do alone. The last row's switch flips back and forth,
// as if someone were deciding.
function PermissionsDiagram({ c }) {
  return (
    <div className="roll__perms">
      <p className="roll__perms-title">{c.title}</p>
      {c.rows.map((row, i) => (
        <p key={row.name} className={`roll__perm${i === c.rows.length - 1 ? ' is-flipping' : ''}`}>
          <span>{row.name}</span>
          <span className="roll__switch" data-on={row.alone ? 'alone' : 'ask'}>
            <span className="roll__opt roll__opt--alone">{c.alone}</span>
            <span className="roll__opt roll__opt--ask">{c.ask}</span>
          </span>
        </p>
      ))}
    </div>
  )
}

// Three stops, reached one after another.
function StepsDiagram({ steps }) {
  return (
    <ol className="roll__steps">
      {steps.map((step, i) => (
        <li key={step} style={{ '--i': i }}>
          <span className="roll__stop">{i === steps.length - 1 && <Check size={11} />}</span>
          {step}
        </li>
      ))}
    </ol>
  )
}

function Rollout() {
  const { copy } = useLanguage()
  const c = copy.platform.rollout
  const [erp, perms, live] = c.cards

  return (
    <Band id="rollout" label={c.label} title={c.title} className="roll">
      <div className="roll__intro">
        {c.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      <ul className="roll__cards">
        <li className="roll__card" data-reveal>
          <div className="roll__art">
            <ErpDiagram names={c.erps} />
          </div>
          <h3>{erp.title}</h3>
          <p>{erp.body}</p>
        </li>
        <li className="roll__card" data-reveal>
          <div className="roll__art">
            <PermissionsDiagram c={c.permissions} />
          </div>
          <h3>{perms.title}</h3>
          <p>{perms.body}</p>
        </li>
        <li className="roll__card" data-reveal>
          <div className="roll__art">
            <StepsDiagram steps={c.steps} />
          </div>
          <h3>{live.title}</h3>
          <p>{live.body}</p>
        </li>
      </ul>
    </Band>
  )
}

export default Rollout
