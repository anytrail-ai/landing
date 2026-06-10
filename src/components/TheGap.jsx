import Section from './Section'
import './TheGap.css'

function TheGap() {
  return (
    <Section
      label="THE LOOP"
      title="Big companies don't sell more because they have better products. They sell more because they close the loop between knowing and doing."
      className="thegap"
    >
      <p>
        Amazon, Mercado Libre, Sephora — every recommendation, every email,
        every ad you see from them is the output of one loop: learn what each
        customer wants, act on it across every channel, respond when they
        reply.
      </p>
      <p>
        The loop needs a data team to build the models, a marketing team to
        launch the campaigns, and an ops team to handle the replies. Most
        businesses can't afford all three. Anytrail is all three.
      </p>
    </Section>
  )
}

export default TheGap
