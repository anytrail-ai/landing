import Section from './Section'
import WhatsAppConversation from './mockups/WhatsAppConversation'
import './Respond.css'

function Respond() {
  return (
    <Section
      label="RESPOND"
      title="And answers every customer who replies."
      className="respond"
      wide
    >
      <p>
        The same agent that runs the campaign handles the replies — on
        WhatsApp, Instagram DM, or email. It knows your products, your prices,
        and what each customer bought before. It books, recommends, or hands
        off — your call.
      </p>
      <WhatsAppConversation />
    </Section>
  )
}

export default Respond
