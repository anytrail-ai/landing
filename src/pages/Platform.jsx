import PlatformHero from '../components/platform/PlatformHero'
import { Modules } from '../components/platform/PlatformSections'
import Layers from '../components/platform/Layers'
import { useReveal } from '../hooks/useReveal'

// The site root: the hero with the app, the platform's modules, then how
// the platform is put together. The CRM
// (/crm) and AP + AR (/ar) sites sit behind it.
function Platform() {
  useReveal()

  return (
    <>
      <PlatformHero />
      <Modules />
      <Layers />
    </>
  )
}

export default Platform
