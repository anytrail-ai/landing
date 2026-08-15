import { ROUTES } from '../i18n/copy'
import { track } from '../analytics'
import { useLanguage } from '../i18n/useLanguage'

// Every CTA on the site. `location` distinguishes which one converted, so we
// can tell whether people book from the navbar or only after reading the
// proof section.
//
// This used to open an outbound scheduler in a new tab; it now points at our
// own booking page and navigates in place, like every other internal link. The
// analytics flush rides on sendBeacon at pagehide, which survives unload.
//
// The event name stays `demo_cta_click` deliberately: renaming it would break
// the historical series. `dest` records where it goes now.
function CtaLink({ location, className, children }) {
  const { lang } = useLanguage()

  return (
    <a
      className={className}
      href={ROUTES[lang].schedule}
      onClick={() => track('demo_cta_click', { location, lang, dest: 'schedule' })}
    >
      {children}
    </a>
  )
}

export default CtaLink
