import { useLanguage } from '../i18n/useLanguage'
import './PrivacyCopilot.css'

/**
 * Privacy notice for the Anytrail Copilot Chrome extension. The Chrome Web
 * Store listing links to this exact URL, so the route must stay stable.
 *
 * Content is data in copy.js (heading + paragraphs), so the page has no prose
 * baked into the markup and stays a single map.
 */
function PrivacyCopilot() {
  const { copy } = useLanguage()
  const c = copy.privacyCopilot

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
      </div>
    </article>
  )
}

export default PrivacyCopilot
