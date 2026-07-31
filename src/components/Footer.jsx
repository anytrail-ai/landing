import './Footer.css'
import { useLanguage } from '../i18n/useLanguage'

function Footer() {
  const { copy } = useLanguage()

  return (
    <footer className="footer">
      <div className="footer__inner">
        <span className="footer__logo">anytrail</span>
        <p className="footer__tagline">{copy.footer.tagline}</p>
      </div>
    </footer>
  )
}

export default Footer
