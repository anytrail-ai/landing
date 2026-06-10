import Section from './Section'
import CampaignDraft from './mockups/CampaignDraft'
import './Act.css'

function Act() {
  return (
    <Section
      label="ACT"
      title="Then it ships the campaign for you."
      className="act"
    >
      <p>
        Anytrail's agents segment your customers, write the ads, and launch the
        campaigns — on Meta, Google, WhatsApp, or email. You approve. They
        run.
      </p>
      <CampaignDraft />
    </Section>
  )
}

export default Act
