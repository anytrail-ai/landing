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
    <div className="inbound-intent-email" role="alert" aria-label="High buying intent detected">
      <div className="inbound-intent-head">
        <img className="inbound-intent-avatar" src="/anytrail-mark.png" alt="" width="20" height="21" />
        <span className="inbound-intent-sender">Anytrail</span>
        <span className="inbound-intent-to">to sales team</span>
        <span className="inbound-intent-time">{time}</span>
        <button
          type="button"
          className="inbound-intent-dismiss"
          aria-label="Dismiss notification"
          onClick={onDismiss}
        >
          ×
        </button>
      </div>
      <p className="inbound-intent-subject">
        🔥 High buying intent detected
        <span className="inbound-intent-score">{score}/100</span>
      </p>
      <p className="inbound-intent-preview">
        {leadName} — a lead talking to the {companyName} agent — has crossed your buying-intent
        threshold and may be ready for sales follow-up.
      </p>
      {chips.length > 0 && (
        <p className="inbound-intent-chips">
          {chips.map((label) => (
            <span key={label} className="inbound-intent-chip">
              {label}
            </span>
          ))}
        </p>
      )}
    </div>
  )
}
