import './Footer.css'
import { useLanguage } from '../i18n/useLanguage'
import { ROUTES, CLUSTER_PAGES } from '../i18n/copy'

function Footer() {
  const { lang, page, copy } = useLanguage()

  // Content pages are linked from every page on the site, including each
  // other. A page reachable from one place only is a page Google treats as an
  // afterthought.
  const links = CLUSTER_PAGES.filter((p) => p !== page)

  return (
    <footer className="footer">
      <div className="footer__inner">
        <span className="footer__logo">anytrail</span>
        <p className="footer__tagline">{copy.footer.tagline}</p>
        <a className="footer__demo" href={ROUTES[lang].demo}>
          {copy.thanks.demoCta}
        </a>

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
      </div>
    </footer>
  )
}

export default Footer
