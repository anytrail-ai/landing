import { useEffect, useState } from 'react'
import './Navbar.css'
import CtaLink from './CtaLink'
import { useLanguage } from '../i18n/useLanguage'
import { LANGS, LANG_PATH, ROUTES } from '../i18n/copy'

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { lang, page, copy } = useLanguage()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
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

        <div className="navbar__actions">
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

          <CtaLink className="navbar__cta" location="navbar">
            {copy.navbar.cta}
          </CtaLink>
        </div>
      </div>
    </header>
  )
}

export default Navbar
