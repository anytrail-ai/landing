import './WhatsAppConversation.css'

/* example mockup data — not real customers. Update when first pilots ship. */
const MESSAGES = [
  {
    from: 'customer',
    text: 'Got your text. Are the tires any good or just promo stuff?',
    time: '13:42',
  },
  {
    from: 'anytrail',
    text:
      "Yeah, they're the same Michelins we put on the Carrera last time you came in. Want me to book you for Saturday morning? 10:30 still your usual slot?",
    time: '13:43',
  },
  {
    from: 'customer',
    text: 'Yes please',
    time: '13:44',
  },
  {
    from: 'anytrail',
    text: 'Booked. Confirmation by email. Bringing the same car?',
    time: '13:44',
  },
]

function WhatsAppConversation() {
  return (
    <figure
      className="whatsapp"
      role="group"
      aria-label="Example: A WhatsApp conversation where Anytrail answers an auto-repair customer's question about tires and books them an appointment."
    >
      <div className="whatsapp__header">
        <span className="whatsapp__header-title">WhatsApp · Maria L.</span>
        <span className="whatsapp__header-meta" aria-hidden="true">⋯</span>
      </div>

      <div className="whatsapp__body">
        {MESSAGES.map((m, i) => {
          const showDivider =
            m.from === 'anytrail' &&
            (i === 0 || MESSAGES[i - 1].from !== 'anytrail')
          return (
            <div key={i}>
              {showDivider && (
                <div className="whatsapp__divider" aria-hidden="true">
                  <span>ANYTRAIL</span>
                </div>
              )}
              <div
                className={`whatsapp__msg whatsapp__msg--${m.from}`}
              >
                <p className="whatsapp__text">{m.text}</p>
                <span className="whatsapp__time">{m.time}</span>
              </div>
            </div>
          )
        })}
      </div>
    </figure>
  )
}

export default WhatsAppConversation
