import './Navbar.css'

function Navbar() {
  return (
    <header className="navbar">
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

        <a className="navbar__cta" href="#waitlist">
          Join waitlist
        </a>
      </div>
    </header>
  )
}

export default Navbar
