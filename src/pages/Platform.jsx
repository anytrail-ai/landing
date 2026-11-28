import PlatformHero from '../components/platform/PlatformHero'
import { Modules } from '../components/platform/PlatformSections'
import { useReveal } from '../hooks/useReveal'

// The site root: the hero with the app, then the platform's modules. The CRM
// (/crm) and AP + AR (/ar) sites sit behind it.
function Platform() {
  useReveal()

  return (
    <>
      <PlatformHero />
      <Modules />
    </>
  )
}

export default Platform
