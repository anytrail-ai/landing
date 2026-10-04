import './AuditReport.css'
import { useLanguage } from '../../i18n/useLanguage'

/* Illustrative revenue review: the deliverable the hero CTA offers, drawn as a
   paper document. Figures are a sample, not a customer's, and the copy says so. */
function AuditReport() {
  const { copy } = useLanguage()
  const c = copy.audit

  return (
    <figure className="audit" role="group" aria-label={c.ariaLabel}>
      <div className="audit__header">
        <span className="audit__header-title">{c.headerTitle}</span>
        <span className="audit__sample">{c.sample}</span>
      </div>

      <div className="audit__meta">
        <span>{c.company}</span>
        <span>{c.period}</span>
      </div>

      <table className="audit__table">
        <thead>
          <tr>
            <th scope="col">{c.colFinding}</th>
            <th scope="col" className="audit__num">
              {c.colValue}
            </th>
          </tr>
        </thead>
        <tbody>
          {c.lines.map((line, i) => (
            <tr key={line.text} className="audit__line" style={{ '--i': i }}>
              <td>
                <span className="audit__text">{line.text}</span>
                {line.recovered && (
                  <span className="audit__stamp">
                    <svg
                      className="audit__check"
                      viewBox="0 0 12 12"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        d="M2.5 6.2 5 8.7l4.5-5.4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {line.recovered}
                  </span>
                )}
              </td>
              <td className="audit__num">{line.value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <figcaption
        className="audit__total"
        style={{ '--i': c.lines.length }}
      >
        <span className="audit__total-label">{c.totalLabel}</span>
        <span className="audit__total-value">{c.total}</span>
      </figcaption>
    </figure>
  )
}

export default AuditReport
