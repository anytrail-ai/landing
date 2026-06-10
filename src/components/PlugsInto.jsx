import Section from './Section'
import './PlugsInto.css'

const ROWS = [
  {
    label: 'Sales history',
    items: ['SAP', 'Odoo', 'NetSuite', 'QuickBooks', 'HubSpot', 'Salesforce'],
  },
  {
    label: 'Ad channels',
    items: ['Meta', 'Google'],
  },
  {
    label: 'Conversations',
    items: ['WhatsApp', 'Instagram', 'Gmail', 'Outlook'],
  },
]

function PlugsInto() {
  return (
    <Section
      label="PLUGS INTO WHAT YOU ALREADY USE"
      className="plugsinto"
      wide
    >
      <p>
        Anytrail reads from your ERP or CRM, runs campaigns through your ad
        accounts, and replies through your existing inbox. No new tools to
        learn, no data migration, no rip-and-replace.
      </p>

      <div className="plugsinto__rows">
        {ROWS.map((row) => (
          <div key={row.label} className="plugsinto__row">
            <div className="plugsinto__row-label">{row.label}</div>
            <div className="plugsinto__row-items">
              {row.items.map((item, i) => (
                <span key={item}>
                  {item}
                  {i < row.items.length - 1 && (
                    <span className="plugsinto__sep" aria-hidden="true">
                      ·
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

export default PlugsInto
