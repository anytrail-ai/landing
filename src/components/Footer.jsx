import './Footer.css'
import { useLanguage } from '../i18n/useLanguage'
import { ROUTES } from '../i18n/copy'

function Footer() {
  const { lang, copy } = useLanguage()

  return (
    <footer className="footer">
      <div className="footer__inner">
        <span className="footer__logo">anytrail</span>
        <p className="footer__tagline">{copy.footer.tagline}</p>
        <a className="footer__demo" href={ROUTES[lang].demo}>
          {copy.thanks.demoCta}
        </a>
      </div>
    </footer>
  )
}

export default Footer
