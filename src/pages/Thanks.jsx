import { useLanguage } from '../i18n/useLanguage'
import { LANG_PATH } from '../i18n/copy'
import './Thanks.css'

function Thanks() {
  const { lang, copy } = useLanguage()
  const c = copy.thanks

  return (
    <section className="thanks">
      <div className="thanks__inner">
        <h1 className="thanks__title">{c.title}</h1>
        <p className="thanks__body">{c.body}</p>
        <a className="thanks__back" href={LANG_PATH[lang]}>
          {c.back}
        </a>
      </div>
    </section>
  )
}

export default Thanks
