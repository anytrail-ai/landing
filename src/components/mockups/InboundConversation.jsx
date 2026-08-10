import './InboundConversation.css'
import { useLanguage } from '../../i18n/useLanguage'

/* Illustrative conversation: shows the diagnosis step, not a real customer. */
function InboundConversation() {
  const { copy } = useLanguage()
  const c = copy.conversation

  return (
    <figure className="inbound" role="group" aria-label={c.ariaLabel}>
      <div className="inbound__header">
        <span className="inbound__channel" aria-hidden="true" />
        <span className="inbound__header-title">{c.headerTitle}</span>
        <span className="inbound__header-meta" aria-hidden="true">⋯</span>
      </div>

      <div className="inbound__body">
        {c.messages.map((m, i) => {
          const showDivider =
            m.from === 'anytrail' &&
            (i === 0 || c.messages[i - 1].from !== 'anytrail')
          return (
            <div key={i} className="inbound__row" style={{ '--i': i }}>
              {showDivider && (
                <div className="inbound__divider" aria-hidden="true">
                  <span>ANYTRAIL</span>
                </div>
              )}
              <div className={`inbound__msg inbound__msg--${m.from}`}>
                <p className="inbound__text">{m.text}</p>
                <span className="inbound__time">{m.time}</span>
              </div>
            </div>
          )
        })}
      </div>

      <figcaption className="inbound__status">
        <span className="inbound__status-title">{c.statusTitle}</span>
        <ul className="inbound__status-list">
          {c.status.map((s, i) => (
            <li
              key={s}
              className="inbound__status-item"
              style={{ '--i': c.messages.length + i }}
            >
              <svg
                className="inbound__check"
                viewBox="0 0 12 12"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M2.5 6.2 5 8.7l4.5-5.4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {s}
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  )
}

export default InboundConversation
