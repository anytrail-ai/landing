import { useLanguage } from '../i18n/useLanguage'
import './Privacy.css'

/**
 * Privacy notice page. One component, two copy blocks:
 *
 * - `privacy`: the site-wide policy. Linked from the footer, and the URL Meta
 *   lead forms point at, so /privacy must stay stable.
 * - `privacyCopilot`: the Anytrail Copilot Chrome extension notice. The Chrome
 *   Web Store listing links to /privacy/copilot, so that one must stay too.
 *
 * Content is data in copy.js (heading + paragraphs), so the page has no prose
 * baked into the markup and stays a single map.
 */
function Privacy({ copyKey = 'privacy' }) {
  const { copy } = useLanguage()
  const c = copy[copyKey]

  return (
    <article className="privacy">
      <div className="privacy__inner">
        <h1 className="privacy__title">{c.title}</h1>
        <p className="privacy__updated">{c.updated}</p>
        <p className="privacy__intro">{c.intro}</p>

        <h2 className="privacy__heading">{c.contactHeading}</h2>
        <p className="privacy__body">
          {c.contactBody} <a href={`mailto:${c.contactEmail}`}>{c.contactEmail}</a>
        </p>

        {c.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="privacy__heading">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p className="privacy__body" key={paragraph.slice(0, 40)}>
                {paragraph}
              </p>
            ))}
          </section>
        ))}

        {c.related && (
          <p className="privacy__body">
            {c.related.text} <a href={c.related.href}>{c.related.label}</a>
          </p>
        )}
      </div>
    </article>
  )
}

export default Privacy
