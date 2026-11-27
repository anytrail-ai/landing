import { useEffect, useState } from 'react'
import './Navbar.css'
import CtaLink from './CtaLink'
import { useLanguage } from '../i18n/useLanguage'
import { LANGS, LANG_PATH, ROUTES } from '../i18n/copy'
import { useHeroTone, useNavVariant } from './platform/heroTone'

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { lang, page, product, copy } = useLanguage()
  const { dark: heroDark } = useHeroTone()
  const nav = useNavVariant()
  const home = page === 'home'
  // Light contents: over a dark hero until the bar turns solid, and always
  // on the moss bar.
  const onDark = home && (nav.moss || (heroDark && !scrolled))

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={[
        'navbar',
        scrolled && 'navbar--scrolled',
        onDark && 'navbar--onDark',
        home && nav.moss && 'navbar--moss',
        home && nav.pill && 'navbar--pill',
        home && nav.links && 'navbar--links',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="navbar__inner">
        <a
          className="navbar__logo"
          href={LANG_PATH[lang]}
          aria-label="Anytrail home"
        >
          <img
            className="navbar__logo-mark"
            src="/anytrail-mark.png"
            alt=""
            width="157"
            height="166"
          />
          <span className="navbar__logo-text">anytrail</span>
        </a>

        {home && nav.links && (
          <nav className="navbar__links" aria-label={copy.platform.navLinksLabel}>
            {copy.platform.navLinks.map((link) => (
              <a key={link.href} className="navbar__link" href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        )}

        <div className="navbar__actions">
          {/* The home page's bar carries section links instead; its language
              switch is in the footer. */}
          {!home && (
            <>
            {/* Real links, not state: each language is its own indexable URL. */}
            <nav className="navbar__lang" aria-label="Language / Idioma">
              {LANGS.map((l) => (
                <a
                  key={l}
                  className={`navbar__lang-btn${
                    lang === l ? ' navbar__lang-btn--active' : ''
                  }`}
                  // Same page in the other language. Falls back to that
                  // language's home only if the page has no counterpart.
                  href={ROUTES[l][page] ?? LANG_PATH[l]}
                  hrefLang={l}
                  aria-current={lang === l ? 'true' : undefined}
                >
                  {l.toUpperCase()}
                </a>
              ))}
            </nav>
            </>
          )}

          {/* The platform home has no product of its own, so it brings its
              own label. */}
          <CtaLink className="navbar__cta" location="navbar">
            {product ? copy.navbar.cta : copy.platform.navCta}
          </CtaLink>
        </div>
      </div>
    </header>
  )
}

export default Navbar
