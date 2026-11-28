import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import Band from '../Band'
import { useLanguage } from '../../i18n/useLanguage'
import { ROUTES } from '../../i18n/copy'
import { track } from '../../analytics'
import ModuleScene from './ModuleScene'
import Phrases from './Phrases'
import { MODULE_ICONS } from './moduleIcons'

// Modules on the left, the selected one's demo on the right. The left column
// is a vertical tab list; every module's description stays in the markup
// (hidden by CSS unless selected), so the prerendered page carries all nine.
// The scene is keyed by module, so choosing one mounts it and it plays from
// its first step. On narrow screens the right column goes away and
// the demo sits under the selected module instead.
export function Modules() {
  const { copy, lang } = useLanguage()
  const c = copy.platform.modules
  const [active, setActive] = useState(c.items[0].id)
  const current = c.items.find((m) => m.id === active)

  const choose = (id) => {
    if (id === active) return
    setActive(id)
    track('platform_module_view', { module: id, lang })
  }

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
      <div className="mods__split" id="modules">
        <div className="mods__list" role="tablist" aria-orientation="vertical">
          {c.items.map((m) => {
            const Icon = MODULE_ICONS[m.id]
            const on = m.id === active
            return (
              <div key={m.id} className={`mods__item${on ? ' is-active' : ''}`}>
                <button
                  type="button"
                  role="tab"
                  id={`mods-tab-${m.id}`}
                  aria-selected={on}
                  aria-controls="mods-stage"
                  className="mods__tab"
                  onClick={() => choose(m.id)}
                >
                  <span className="mods__name">
                    <Icon size={16} aria-hidden="true" />
                    {m.name}
                    {m.early && <span className="mods__early">{c.early}</span>}
                  </span>
                  <span className="mods__title">{m.title}</span>
                </button>
                <div className="mods__more">
                  <p className="mods__body">{m.body}</p>
                  {m.page && (
                    <a className="mods__link" href={ROUTES[lang][m.page]}>
                      {c.explore} {m.name}
                      <ArrowRight size={14} aria-hidden="true" />
                    </a>
                  )}
                  {/* narrow screens only: the demo under its module */}
                  {on && (
                    <div className="mods__inline">
                      <ModuleScene key={m.id} id={m.id} scene={m.scene} stepsLabel={c.stepsLabel} />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div
          className="mods__stage"
          id="mods-stage"
          role="tabpanel"
          aria-labelledby={`mods-tab-${current.id}`}
        >
          <ModuleScene
            key={current.id}
            id={current.id}
            scene={current.scene}
            stepsLabel={c.stepsLabel}
          />
        </div>
      </div>
    </Band>
  )
}
