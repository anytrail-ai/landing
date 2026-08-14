import { useLanguage } from '../i18n/useLanguage'
import { LANG_PATH, ROUTES } from '../i18n/copy'
import { track } from '../analytics'
import './Thanks.css'

function Thanks() {
  const { lang, copy } = useLanguage()
  const c = copy.thanks

  return (
    <section className="thanks">
      <div className="thanks__inner">
        <h1 className="thanks__title">{c.title}</h1>
        <p className="thanks__body">{c.body}</p>
        <p className="thanks__demo-lead">{c.demoLead}</p>
        <a
          className="thanks__demo"
          href={ROUTES[lang].demo}
          onClick={() => track('demo_cta_click', { location: 'thanks', lang, dest: 'demo' })}
        >
          {c.demoCta}
        </a>
        <a className="thanks__back" href={LANG_PATH[lang]}>
          {c.back}
        </a>
      </div>
    </section>
  )
}

export default Thanks
