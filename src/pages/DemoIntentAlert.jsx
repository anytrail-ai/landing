import { SIGNAL_LABELS } from './demoIntent'

// Email-style rendering of lead-crm's high-intent alert. Copy mirrors the
// lead-crm notification ("Buying intent N/100") and the banner's signal chips;
// the dismiss control matches its dismiss action. Shown in static flow above
// the chat thread, like lead-crm's IntentAlertBanner.
export default function DemoIntentAlert({ leadName, companyName, score, signals, firedAt, onDismiss }) {
  // Same filter as lead-crm: only signals with a human label are shown.
  const chips = signals
    .filter((s) => s.strength > 0)
    .map((s) => SIGNAL_LABELS[s.key])
    .filter(Boolean)
  const time = firedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="demo-intent-email" role="alert" aria-label="High buying intent detected">
      <div className="demo-intent-head">
        <img className="demo-intent-avatar" src="/anytrail-mark.png" alt="" width="20" height="21" />
        <span className="demo-intent-sender">Anytrail</span>
        <span className="demo-intent-to">to sales team</span>
        <span className="demo-intent-time">{time}</span>
        <button
          type="button"
          className="demo-intent-dismiss"
          aria-label="Dismiss notification"
          onClick={onDismiss}
        >
          ×
        </button>
      </div>
      <p className="demo-intent-subject">
        🔥 High buying intent detected
        <span className="demo-intent-score">{score}/100</span>
      </p>
      <p className="demo-intent-preview">
        {leadName} — a lead talking to the {companyName} agent — has crossed your buying-intent
        threshold and may be ready for sales follow-up.
      </p>
      {chips.length > 0 && (
        <p className="demo-intent-chips">
          {chips.map((label) => (
            <span key={label} className="demo-intent-chip">
              {label}
            </span>
          ))}
        </p>
      )}
    </div>
  )
}
