import Band from './Band'
import './Different.css'
import { useLanguage } from '../i18n/useLanguage'

// The alternatives as rows of one table, with Anytrail as the last row, set
// apart in ink: the comparison reads top to bottom and lands on the answer.
function Different() {
  const { copy } = useLanguage()
  const c = copy.different

  return (
    <Band label={c.label} title={c.title} className="different">
      <table className="compare">
        <tbody>
          {c.comparisons.map((item) => (
            <tr key={item.label} className="compare__row" data-reveal>
              <th scope="row" className="compare__label">
                {item.label}
              </th>
              <td className="compare__body">{item.body}</td>
            </tr>
          ))}
          <tr className="compare__row compare__row--us" data-reveal>
            <th scope="row" className="compare__label">
              {c.usLabel}
            </th>
            <td className="compare__body">{c.intro}</td>
          </tr>
        </tbody>
      </table>
    </Band>
  )
}

export default Different
