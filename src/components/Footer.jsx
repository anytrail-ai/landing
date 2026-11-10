import './Footer.css'
import { useLanguage } from '../i18n/useLanguage'
import { ROUTES, CLUSTER_PAGES, productRoute } from '../i18n/copy'

function Footer() {
  const { lang, page, product, copy } = useLanguage()

  // The cluster pages are sales-agent reading, so they are linked from the
  // chooser and every CRM page, including each other. A page reachable from
  // one place only is a page Google treats as an afterthought. AR pages keep
  // to their own funnel.
  const links = product === 'ar' ? [] : CLUSTER_PAGES.filter((p) => p !== page)
  const tagline = product ? copy.footer.tagline : copy.chooser.footerTagline

  return (
    <footer className="footer">
      <div className="footer__inner">
        <span className="footer__logo">anytrail</span>
        <p className="footer__tagline">{tagline}</p>
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
