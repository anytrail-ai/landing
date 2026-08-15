import { useSyncExternalStore } from 'react'
import { useLanguage } from '../i18n/useLanguage'
import { LANG_PATH, ROUTES } from '../i18n/copy'
import { track } from '../analytics'
import './Thanks.css'

// Written by Schedule.jsx right before the redirect here. Read via
// useSyncExternalStore, the same hydration-safe pattern zoneLabel/
// getServerZone use in Schedule.jsx: this page is prerendered, so the server
// (and the client's first, hydration-matching render) must always see null
// here, the same as if sessionStorage were simply empty; it never changes
// again after mount, so subscribe has nothing to listen for.
const subscribeNever = () => () => {}
const getServerManageUrl = () => null
function readManageUrl() {
  try {
    return window.sessionStorage.getItem('schedule:manageUrl')
  } catch {
    return null
  }
}

function Thanks() {
  const { lang, copy } = useLanguage()
  const c = copy.thanks
  const manageUrl = useSyncExternalStore(subscribeNever, readManageUrl, getServerManageUrl)

  return (
    <section className="thanks">
      <div className="thanks__inner">
        <h1 className="thanks__title">{c.title}</h1>
        <p className="thanks__body">{c.body}</p>
        {manageUrl && (
          <p className="thanks__manage">
            {c.manageSave} <a href={manageUrl}>{manageUrl}</a>
          </p>
        )}
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
