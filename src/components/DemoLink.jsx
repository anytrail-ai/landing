import { DEMO_URL } from '../config'
import { track } from '../analytics'
import { useLanguage } from '../i18n/useLanguage'

// Every booking CTA on the site. `location` distinguishes which one converted,
// so we can tell whether people book from the navbar or only after reading the
// proof section.
//
// target="_blank" is deliberate: an outbound link normally starts navigation
// immediately and the browser can drop the in-flight analytics request. Opening
// a new tab keeps this page alive so the event lands, and the visitor does not
// lose the page they were reading.
function DemoLink({ location, className, children }) {
  const { lang } = useLanguage()

  return (
    <a
      className={className}
      href={DEMO_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track('demo_cta_click', { location, lang })}
    >
      {children}
    </a>
  )
}

export default DemoLink
