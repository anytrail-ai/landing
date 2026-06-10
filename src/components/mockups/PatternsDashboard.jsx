import MockCard from '../MockCard'
import './PatternsDashboard.css'

/* example mockup data — not real customers. Update when first pilots ship. */
const PATTERNS = [
  {
    id: 'brake-tires',
    from: 'Brake service',
    to: 'Tires',
    avgDays: 87,
    customers: 412,
    confidence: 31,
    active: true,
  },
  {
    id: 'oil-brake',
    from: 'Oil change',
    to: 'Brake inspection',
    avgDays: 142,
    customers: 1108,
    confidence: 24,
    active: false,
  },
  {
    id: 'battery-alt',
    from: 'Battery swap',
    to: 'Alternator check',
    avgDays: 31,
    customers: 96,
    confidence: 19,
    active: false,
  },
]

function PatternsDashboard() {
  return (
    <MockCard ariaLabel="Example: Anytrail's Patterns dashboard showing three recommendation patterns from an auto-repair shop's sales history.">
      <div className="mockcard__header">
        <span className="mockcard__header-title">Patterns ▾</span>
        <span className="mockcard__header-meta">17 active</span>
        <span className="mockcard__header-meta" aria-hidden="true">⋯</span>
      </div>

      <div className="mockcard__body patterns__body">
        {PATTERNS.map((p) => (
          <div
            key={p.id}
            className={`pattern ${p.active ? 'pattern--active' : ''}`.trim()}
          >
            <div className="pattern__row">
              <span
                className="pattern__dot"
                aria-hidden="true"
                data-active={p.active}
              />
              <span className="pattern__name">
                {p.from} <span className="pattern__arrow">→</span> {p.to}
              </span>
            </div>
            <div className="pattern__meta">
              avg. {p.avgDays} days · {p.customers.toLocaleString()} customers
              match · {p.confidence}% confidence
            </div>
            <div
              className="pattern__bar"
              role="presentation"
            >
              <div
                className="pattern__bar-fill"
                style={{ width: `${p.confidence * 3}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mockcard__footer patterns__footer">
        <span>
          ⊕ This pattern can become an ad campaign, a WhatsApp promo, or an
          email flow.
        </span>
        <span className="patterns__cta">Use it →</span>
      </div>
    </MockCard>
  )
}

export default PatternsDashboard
