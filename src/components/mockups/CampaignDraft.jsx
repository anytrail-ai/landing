import MockCard from '../MockCard'
import './CampaignDraft.css'

/* example mockup data — not real customers. Update when first pilots ship. */
const CHANNELS = [
  { label: 'Meta Ads', checked: true },
  { label: 'Google Ads', checked: true },
  { label: 'WhatsApp', checked: true },
  { label: 'Email', checked: false },
]

function CampaignDraft() {
  return (
    <MockCard ariaLabel="Example: Anytrail's Campaign draft view, built from the Brake-to-Tires pattern, with audience size, channel selection, and ad creative pre-drafted.">
      <div className="mockcard__header">
        <span className="mockcard__header-title">New campaign</span>
        <span className="mockcard__header-meta">
          · from pattern: Brake → Tires
        </span>
        <span className="mockcard__header-meta" aria-hidden="true">⋯</span>
      </div>

      <div className="mockcard__body campaign__body">
        <div className="campaign__field">
          <div className="campaign__field-label">Audience</div>
          <div className="campaign__field-value">
            412 customers · brake service in last 60–90 days
          </div>
          <div className="campaign__field-sub">
            Similar lookalikes on Meta: ~38,000
          </div>
        </div>

        <div className="campaign__field">
          <div className="campaign__field-label">Channels</div>
          <div className="campaign__channels">
            {CHANNELS.map((c) => (
              <span
                key={c.label}
                className={`campaign__channel ${c.checked ? 'campaign__channel--on' : ''}`.trim()}
              >
                <span className="campaign__channel-box" aria-hidden="true">
                  {c.checked ? '✓' : ''}
                </span>
                {c.label}
              </span>
            ))}
          </div>
        </div>

        <div className="campaign__field">
          <div className="campaign__field-label">Creative — Meta ad</div>
          <div className="campaign__ad">
            <p className="campaign__ad-copy">
              "Brakes done? Tires wear evenly when they match. Book a check."
            </p>
            <span className="campaign__ad-tag">drafted by Anytrail</span>
          </div>
        </div>

        <div className="campaign__estimate">
          Estimated spend: <strong>$480/wk</strong> · Est. reach:{' '}
          <strong>41k</strong>
        </div>
      </div>

      <div className="mockcard__footer campaign__footer">
        <span className="campaign__btn">Edit</span>
        <span className="campaign__btn campaign__btn--primary">
          Approve & launch
        </span>
      </div>
    </MockCard>
  )
}

export default CampaignDraft
