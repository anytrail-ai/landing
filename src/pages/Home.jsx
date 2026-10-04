import Hero from '../components/Hero'
import Benefits from '../components/Benefits'
import Problem from '../components/Problem'
import HowItWorks from '../components/HowItWorks'
import Different from '../components/Different'
import Proof from '../components/Proof'
import ClosingCTA from '../components/ClosingCTA'

function Home() {
  return (
    <>
      <Hero />
      {/* Proof right under the hero: buyers want evidence before the pitch. */}
      <Proof />
      <Benefits />
      <Problem />
      <HowItWorks />
      <Different />
      <ClosingCTA />
    </>
  )
}

export default Home
