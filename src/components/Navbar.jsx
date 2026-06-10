import { useEffect, useState } from 'react'
import './Navbar.css'
import { DEMO_URL } from '../config'

function Navbar() {
  const [scrolled, setScrolled] = useState(false)

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

        <a className="navbar__cta" href={DEMO_URL}>
          Book a demo
        </a>
      </div>
    </header>
  )
}

export default Navbar
