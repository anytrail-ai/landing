import { DEMO_URL } from '../config'
import './ClosingCTA.css'

function ClosingCTA() {
  return (
    <section className="closingcta">
      <div className="closingcta__inner">
        <h2 className="closingcta__title">
          The same loop. Built for the size you are.
        </h2>
        <p className="closingcta__body">
          30-minute demo. We'll show you the patterns hiding in your own sales
          data — using your data, not a fake account.
        </p>
        <a className="closingcta__cta" href={DEMO_URL}>
          Book a demo
        </a>
      </div>
    </section>
  )
}

export default ClosingCTA
