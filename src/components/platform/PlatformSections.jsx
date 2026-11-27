import { ArrowRight, Plus } from 'lucide-react'
import Band from '../Band'
import { useLanguage } from '../../i18n/useLanguage'
import { ROUTES } from '../../i18n/copy'
import ModuleDemo from './ModuleDemo'
import Phrases from './Phrases'
import { MODULE_ICONS } from './moduleIcons'

export function Modules() {
  const { copy, lang } = useLanguage()
  const c = copy.platform.modules

  return (
    <Band
      label={c.label}
      title={
        <>
          {c.titleLead} <Phrases phrases={c.titlePhrases} />
        </>
      }
      intro={c.intro}
      className="mods"
    >
      {/* An accordion: native <details> sharing a name, so opening one closes
          the others and every module's text is in the prerendered HTML. */}
      <div className="mods__list" id="modules" data-reveal>
        {c.items.map((m, i) => {
          const Icon = MODULE_ICONS[m.id]
          return (
            <details key={m.id} name="platform-modules" className="mods__item" open={i === 0}>
              <summary
                className="mods__summary"
                // One is always open: the open one does not close on click.
                onClick={(e) => {
                  if (e.currentTarget.parentElement.open) e.preventDefault()
                }}
              >
                <span className="mods__name">
                  <Icon size={16} aria-hidden="true" />
                  {m.name}
                  {m.early && <span className="mods__early">{c.early}</span>}
                </span>
                <span className="mods__title">{m.title}</span>
                <Plus className="mods__toggle" size={20} aria-hidden="true" />
              </summary>
              <div className="mods__panel">
                <div className="mods__text">
                  <p className="mods__body">{m.body}</p>
                  {m.page && (
                    <a className="mods__link" href={ROUTES[lang][m.page]}>
                      {c.explore} {m.name}
                      <ArrowRight size={14} aria-hidden="true" />
                    </a>
                  )}
                </div>
                <ModuleDemo demo={m.demo} replayLabel={c.replayDemo} />
              </div>
            </details>
          )
        })}
      </div>
    </Band>
  )
}
