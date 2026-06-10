import Section from './Section'
import PatternsDashboard from './mockups/PatternsDashboard'
import './Learn.css'

function Learn() {
  return (
    <Section
      label="LEARN"
      title="We read your sales history and find the patterns hiding inside it."
      className="learn"
    >
      <p>
        Connect your ERP or CRM. Within minutes, Anytrail trains a model on
        every order you've ever fulfilled — who bought what, when, and what
        they bought next.
      </p>
      <PatternsDashboard />
    </Section>
  )
}

export default Learn
