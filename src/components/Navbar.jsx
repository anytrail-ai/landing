import { useEffect, useState } from 'react'
import './Navbar.css'
import { DEMO_URL } from '../config'
import { useLanguage } from '../i18n/useLanguage'

const LANGS = ['en', 'es']

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { lang, setLang, copy } = useLanguage()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <a className="navbar__logo" href="/" aria-label="Anytrail home">
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
          <div
            className="navbar__lang"
            role="group"
            aria-label="Language / Idioma"
          >
            {LANGS.map((l) => (
              <button
                key={l}
                type="button"
                className={`navbar__lang-btn${
                  lang === l ? ' navbar__lang-btn--active' : ''
                }`}
                aria-pressed={lang === l}
                onClick={() => setLang(l)}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          <a className="navbar__cta" href={DEMO_URL}>
            {copy.navbar.cta}
          </a>
        </div>
      </div>
    </header>
  )
}

export default Navbar
