import { useState } from 'react'
import {
  ArrowRight,
  Bot,
  CheckCheck,
  Flame,
  Mail,
  Paperclip,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  Trophy,
} from 'lucide-react'
import { useLanguage } from '../../i18n/useLanguage'
import { track } from '../../analytics'
import CtaLink from '../CtaLink'
import { MODULE_ICONS } from './moduleIcons'

// The hero's product demonstration: the Anytrail app, redrawn from
// lead-crm/web with the app's own tokens and the card and bubble anatomy of
// PipelineCard, ConversationRow, MessageThread and BotRecommendationCard.
//
// The sidebar is ours, not the app's: it lists the platform's modules. CRM
// is the one drawn, with its two screens under it. Any other module opens a
// floater over the screen that asks for the call. Sidebar items and the
// floater are real controls; everything inside a screen is a picture.

const initials = (name) =>
  name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')

function Pipeline({ c }) {
  let i = 0
  return (
    <div className="app__page">
      <div className="app__head">
        <div>
          <p className="app__h1">{c.title}</p>
          <p className="app__sub">{c.subtitle}</p>
        </div>
        <span className="app__btn app__btn--outline">
          <RefreshCw size={12} />
        </span>
      </div>

      <div className="app__tabs">
        {c.tabs.map((tab, n) => (
          <span key={tab} className={n === 0 ? 'is-active' : undefined}>
            {tab}
          </span>
        ))}
      </div>

      <div className="app__chips">
        <span className="app__chip app__chip--won">
          <Trophy size={12} />
          {c.won}
        </span>
        {c.chips.map((chip) => (
          <span key={chip} className="app__chip">
            {chip}
          </span>
        ))}
        <span className="app__health">{c.health}</span>
      </div>

      <div className="app__board">
        {c.columns.map((col) => (
          <div key={col.name} className="app__col">
            <p className="app__col-head">
              {col.name} <span>{col.count}</span>
            </p>
            {col.cards.map((card) => (
              <div key={card.name} className="app__card" style={{ '--i': i++ }}>
                <p className="app__card-name">{card.name}</p>
                <p className="app__card-meta">{card.meta}</p>
                <span className={`app__owed app__owed--${card.tone}`}>
                  {card.tone === 'muted' && <Bot size={12} />}
                  {card.chip}
                </span>
                <p className="app__card-line">{card.line}</p>
                {card.note && <p className="app__card-note">{card.note}</p>}
                <span className="app__btn">{card.action}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function Inbox({ c, company }) {
  const t = c.thread
  const p = c.panel
  return (
    <div className="app__inbox">
      <div className="app__list">
        <div className="app__list-head">
          <span className="app__avatar app__avatar--sm">{initials(company)}</span>
          <span className="app__row-name">{company}</span>
        </div>
        <div className="app__search">
          <span>
            <Search size={14} />
            {c.search}
          </span>
        </div>
        {c.rows.map((row) => (
          <div key={row.name} className={`app__row${row.active ? ' is-active' : ''}`}>
            <span className="app__avatar">{initials(row.name)}</span>
            <div className="app__row-main">
              <p className="app__row-name">
                {row.mail && <Mail size={14} />}
                <span>{row.name}</span>
                {row.intent && (
                  <span className="app__intent">
                    <Flame size={10} />
                    {row.intent}
                  </span>
                )}
              </p>
              <p className={`app__row-preview${row.unread ? ' is-unread' : ''}`}>
                {row.preview}
              </p>
            </div>
            {row.unread && <span className="app__unread">{row.unread}</span>}
          </div>
        ))}
      </div>

      <div className="app__thread">
        <div className="app__thread-head">
          <span className="app__avatar">{initials(t.name)}</span>
          <div>
            <p className="app__row-name">{t.name}</p>
            <p className="app__sub">{t.phone}</p>
          </div>
        </div>

        <div className="app__messages">
          <p className="app__day">
            <span>{t.day}</span>
          </p>
          {t.messages.map((m, i) => (
            <div
              key={m.text}
              className={`app__msg app__msg--${m.from}`}
              style={{ '--i': i }}
            >
              <p className="app__bubble">{m.text}</p>
              <p className="app__msg-meta">
                {m.by && (
                  <>
                    <Bot size={11} /> {m.by} ·{' '}
                  </>
                )}
                {m.time}
                {m.from === 'out' && <CheckCheck size={12} className="app__read" />}
              </p>
            </div>
          ))}

          <div className="app__rec" style={{ '--i': t.messages.length }}>
            <p className="app__rec-title">
              <Sparkles size={14} />
              {t.recommendation}
            </p>
            <p className="app__sub">{t.recommendationHint}</p>
            <p className="app__draft-label">{t.draftLabel}</p>
            <p className="app__bubble app__bubble--draft">{t.draft}</p>
            <div className="app__rec-actions">
              <span className="app__btn">{t.approve}</span>
              <span className="app__btn app__btn--outline">{t.regenerate}</span>
              <span className="app__btn app__btn--outline">{t.quote}</span>
            </div>
          </div>
        </div>

        <div className="app__composer">
          <Paperclip size={16} />
          <span className="app__composer-input" />
          <span className="app__send">
            <Send size={14} />
          </span>
        </div>
      </div>

      <div className="app__panel">
        <span className="app__avatar app__avatar--lg">{initials(t.name)}</span>
        <p className="app__panel-name">{t.name}</p>
        <p className="app__sub">{t.phone}</p>

        <p className="app__panel-label">{p.intent}</p>
        <ul className="app__signals">
          {p.signals.map((signal) => (
            <li key={signal}>{signal}</li>
          ))}
        </ul>

        <p className="app__panel-label">{p.status}</p>
        <p className="app__select">{p.statusValue}</p>

        <p className="app__panel-label">{p.quotes}</p>
        <p className="app__quote">
          <span>{p.quoteRow}</span>
          <span>{p.quoteTotal}</span>
        </p>
      </div>
    </div>
  )
}

function WorkspaceMockup() {
  const { copy, lang } = useLanguage()
  const c = copy.platform.mockup
  const modules = copy.platform.modules.items
  const [view, setView] = useState('pipeline')
  // id of the module whose floater is open, if any
  const [gate, setGate] = useState(null)
  const gated = modules.find((m) => m.id === gate)

  const openScreen = (id) => {
    setGate(null)
    setView(id)
    track('platform_mockup_view', { view: id, lang })
  }

  const openModule = (id) => {
    if (id === 'crm') {
      setGate(null)
      return
    }
    setGate(id)
    track('platform_mockup_module', { module: id, lang })
  }

  return (
    <figure className="appfig" aria-label={c.ariaLabel}>
      <div className="app">
        <nav className="app__side" aria-label={c.modulesLabel}>
          <img
            className="app__logo"
            src="/anytrail-logo.png"
            alt="Anytrail"
            width="673"
            height="166"
          />
          <ul className="app__mods">
            {modules.map((m) => {
              const Icon = MODULE_ICONS[m.id]
              const current = m.id === (gate ?? 'crm')
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    className={`app__mod${current ? ' is-active' : ''}`}
                    aria-current={current ? 'true' : undefined}
                    onClick={() => openModule(m.id)}
                  >
                    <Icon size={16} aria-hidden="true" />
                    <span>{m.name}</span>
                  </button>
                  {m.id === 'crm' && (
                    <ul className="app__screens">
                      {['pipeline', 'inbox'].map((id) => (
                        <li key={id}>
                          <button
                            type="button"
                            className={`app__screen-link${
                              !gate && view === id ? ' is-active' : ''
                            }`}
                            aria-current={!gate && view === id ? 'true' : undefined}
                            onClick={() => openScreen(id)}
                          >
                            {c.nav[id]}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
          <p className="app__me" aria-hidden="true">
            <img src="/mockup-avatar.jpg" alt="" width="192" height="192" loading="lazy" />
            <span>{c.userName}</span>
          </p>
        </nav>

        <div className="app__main">
          {/* A picture of the app, not controls: hidden from assistive tech,
              which gets the figure's label instead. Re-keyed per screen so
              its cards and messages arrive again. */}
          <div
            key={view}
            aria-hidden="true"
            className={`app__screen${gated ? ' is-behind' : ''}`}
          >
            {view === 'pipeline' ? (
              <Pipeline c={c.pipeline} />
            ) : (
              <Inbox c={c.inbox} company={c.company} />
            )}
          </div>

          {gated && (
            <div className="app__gate" role="status">
              <div className="app__gate-card">
                <p className="app__gate-title">
                  {c.gate.title.replace('{module}', gated.name)}
                </p>
                <p className="app__gate-body">{gated.title}</p>
                <p className="app__gate-body">{c.gate.body}</p>
                <div className="app__gate-actions">
                  <CtaLink className="app__gate-cta" location={`mockup_${gated.id}`}>
                    {c.gate.cta}
                    <ArrowRight size={16} aria-hidden="true" />
                  </CtaLink>
                  <button
                    type="button"
                    className="app__gate-back"
                    onClick={() => setGate(null)}
                  >
                    {c.gate.back}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </figure>
  )
}

export default WorkspaceMockup
