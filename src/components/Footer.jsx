import './Footer.css'
import { useLanguage } from '../i18n/useLanguage'
import { ROUTES, CLUSTER_PAGES, productRoute } from '../i18n/copy'

function Footer() {
  const { lang, page, product, copy } = useLanguage()

  // The cluster pages are sales-agent reading, so they are linked from the
  // platform home and every CRM page, including each other. A page reachable from
  // one place only is a page Google treats as an afterthought. AR pages keep
  // to their own funnel.
  const links = product === 'ar' ? [] : CLUSTER_PAGES.filter((p) => p !== page)
  const tagline = product ? copy.footer.tagline : copy.platform.footerTagline

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
          <nav id="resources" className="footer__links" aria-label={copy.footer.linksLabel}>
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

        {/* The home navbar has no language toggle, so the switch lives here.
            A real link: each language is its own indexable URL. */}
        {!product && (
          <a
            className="footer__privacy"
            href={ROUTES[lang === 'en' ? 'es' : 'en'][page]}
            hrefLang={lang === 'en' ? 'es' : 'en'}
          >
            {copy.platform.otherLanguage}
          </a>
        )}

        <a className="footer__privacy" href={ROUTES[lang].privacy}>
          {copy.footer.privacyLabel}
        </a>
      </div>
    </footer>
  )
}

export default Footer
