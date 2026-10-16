import { useLanguage } from '../i18n/useLanguage'
import './WhatsappGuide.css'

/**
 * Customer-facing how-to: connecting a WhatsApp Business number to the CRM in
 * coexistence mode (the number stays on the phone). Spanish only; the same
 * content ships as a PDF under public/guias/, which the page links to.
 *
 * Prose lives in copy.js like the other content pages. Inline emphasis uses
 * `**double asterisks**` in the copy strings and is rendered by `rich()` so
 * the copy block stays plain data rather than JSX.
 */
const ASSETS = '/guias/whatsapp-coexistencia'

// "Toque **Conectar**." -> ['Toque ', <strong>Conectar</strong>, '.']
function rich(text) {
  const parts = String(text).split(/\*\*(.+?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part,
  )
}

function Note({ note }) {
  if (!note) return null
  return (
    <aside className={`wag__note wag__note--${note.kind}`}>
      <p className="wag__note-title">{note.title}</p>
      <p className="wag__note-body">{rich(note.body)}</p>
    </aside>
  )
}

function Figures({ figures }) {
  if (!figures?.length) return null
  return (
    <div className={`wag__figures wag__figures--${figures.length}`}>
      {figures.map((f) => (
        <figure key={f.src} className="wag__figure">
          <img
            src={`${ASSETS}/${f.src}`}
            alt={f.alt}
            loading="lazy"
            decoding="async"
          />
          <figcaption>{rich(f.caption)}</figcaption>
        </figure>
      ))}
    </div>
  )
}

function PhoneCard({ card }) {
  if (!card) return null
  return (
    <div className="wag__phone">
      <p className="wag__phone-title">{card.title}</p>
      <ul className="wag__phone-list">
        {card.items.map((item) => (
          <li key={item}>{rich(item)}</li>
        ))}
      </ul>
    </div>
  )
}

function Step({ step }) {
  return (
    <section className="wag__step" id={`paso-${step.number}`}>
      <header className="wag__step-head">
        <span className="wag__badge" aria-hidden="true">
          {step.number}
        </span>
        <div>
          <h2 className="wag__step-title">
            <span className="wag__sr">Paso {step.number}: </span>
            {step.title}
          </h2>
          <p className="wag__step-where">{step.where}</p>
        </div>
      </header>

      {step.paras?.map((p) => (
        <p key={p} className="wag__body">
          {rich(p)}
        </p>
      ))}

      {step.list && (
        <ol className="wag__list">
          {step.list.map((item) => (
            <li key={item}>{rich(item)}</li>
          ))}
        </ol>
      )}

      <Figures figures={step.figures} />
      <PhoneCard card={step.phone} />

      {step.parasAfter?.map((p) => (
        <p key={p} className="wag__body">
          {rich(p)}
        </p>
      ))}

      <Figures figures={step.figuresAfter} />
      <Note note={step.note} />
    </section>
  )
}

function WhatsappGuide() {
  const { copy } = useLanguage()
  const c = copy.whatsappGuide

  return (
    <article className="wag">
      <header className="wag__head">
        <div className="wag__inner">
          <p className="wag__eyebrow">{c.eyebrow}</p>
          <h1 className="wag__title">{c.title}</h1>
          {c.lede.map((p) => (
            <p key={p} className="wag__lede">
              {rich(p)}
            </p>
          ))}
          <p className="wag__pdf">
            <a className="wag__pdf-link" href={`${ASSETS}/${c.pdf.file}`} download>
              {c.pdf.label}
            </a>
            <span className="wag__pdf-note">{c.pdf.note}</span>
          </p>
        </div>
      </header>

      <div className="wag__inner">
        <section className="wag__before">
          <h2 className="wag__h2">{c.before.title}</h2>
          <ul className="wag__bullets">
            {c.before.items.map((item) => (
              <li key={item}>{rich(item)}</li>
            ))}
          </ul>
          <Note note={c.before.note} />
        </section>

        {c.steps.map((step) => (
          <Step key={step.number} step={step} />
        ))}

        <section className="wag__after">
          <h2 className="wag__h2">{c.after.title}</h2>
          <div className="wag__after-row">
            <Note note={c.after.note} />
            <Figures figures={[c.after.figure]} />
          </div>
        </section>

        <section className="wag__trouble">
          <h2 className="wag__h2">{c.trouble.title}</h2>
          <table className="wag__table">
            <thead>
              <tr>
                <th scope="col">{c.trouble.colMessage}</th>
                <th scope="col">{c.trouble.colAction}</th>
              </tr>
            </thead>
            <tbody>
              {c.trouble.rows.map((row) => (
                <tr key={row.message}>
                  <td data-label={c.trouble.colMessage}>{rich(row.message)}</td>
                  <td data-label={c.trouble.colAction}>{rich(row.action)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <p className="wag__source">
          {c.source.text}{' '}
          <a href={c.source.href} rel="noopener noreferrer" target="_blank">
            {c.source.label}
          </a>
        </p>
      </div>
    </article>
  )
}

export default WhatsappGuide
