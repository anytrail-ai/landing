import Hero from '../components/Hero'
import Benefits from '../components/Benefits'
import Problem from '../components/Problem'
import HowItWorks from '../components/HowItWorks'
import Different from '../components/Different'
import Proof from '../components/Proof'
import ClosingCTA from '../components/ClosingCTA'
import { useReveal } from '../hooks/useReveal'
import { useLanguage } from '../i18n/useLanguage'

// Bands alternate paper, ink, and moss so the page changes gear as it scrolls.
function Home() {
  useReveal()
  const { product } = useLanguage()

  return (
    <>
      <Hero />
      {/* CRM: proof right under the hero, buyers want evidence before the pitch. */}
      {product === 'crm' && <Proof />}
      <Benefits />
      <Problem />
      <HowItWorks />
      <Different />
      <ClosingCTA variant="band" />
    </>
  )
}

export default Home
