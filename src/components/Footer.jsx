import './Footer.css'
import { useLanguage } from '../i18n/useLanguage'
import { ROUTES, CLUSTER_PAGES, productRoute } from '../i18n/copy'

function Footer() {
  const { lang, page, product, copy } = useLanguage()

  // The platform home closes on one line: who we are and the privacy policy.
  if (!product) {
    return (
      <footer className="footer footer--line">
        <div className="footer__inner">
          <p className="footer__tagline">{copy.platform.footerLine}</p>
          <a className="footer__privacy" href={ROUTES[lang].privacy}>
            {copy.platform.footerPrivacy}
          </a>
        </div>
      </footer>
    )
  }

  // The cluster pages are sales-agent reading, so they are linked from every
  // CRM page, including each other. A page reachable from
  // one place only is a page Google treats as an afterthought. AR pages keep
  // to their own funnel.
  const links = product === 'ar' ? [] : CLUSTER_PAGES.filter((p) => p !== page)

  return (
    <footer className="footer">
      <div className="footer__inner">
        <span className="footer__logo">anytrail</span>
        <p className="footer__tagline">{copy.footer.tagline}</p>
        {product === 'crm' && (
          <a className="footer__demo" href={ROUTES[lang].demo}>
            {copy.thanks.demoCta}
          </a>
        )}
        {product === 'ar' && (
          <a className="footer__demo" href={productRoute(lang, page, 'schedule')}>
            {copy.navbar.cta}
          </a>
        )}

        {links.length > 0 && (
          <nav className="footer__links" aria-label={copy.footer.linksLabel}>
            <h2 className="footer__links-label">{copy.footer.linksLabel}</h2>
            <ul className="footer__links-list">
              {links.map((p) => (
                <li key={p}>
                  <a href={ROUTES[lang][p]}>{copy[p].navLabel}</a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <a className="footer__privacy" href={ROUTES[lang].privacy}>
          {copy.footer.privacyLabel}
        </a>
      </div>
    </footer>
  )
}

export default Footer
