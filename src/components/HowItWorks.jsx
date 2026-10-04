import { useEffect, useRef, useState } from 'react'
import Band from './Band'
import './HowItWorks.css'
import { useLanguage } from '../i18n/useLanguage'

function HowItWorks() {
  const { copy } = useLanguage()
  const c = copy.how
  const [active, setActive] = useState(0)
  const stepRefs = useRef([])

  // The step crossing the middle of the viewport is the active one. The pinned
  // panel beside the list follows it, so the reader walks one opportunity
  // through the whole path as they scroll.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number(entry.target.dataset.index))
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    )
    stepRefs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  const pad = (n) => String(n).padStart(2, '0')

  return (
    <Band tone="moss" label={c.label} title={c.title} intro={c.intro} className="how">
      {/* Two entry points, then one shared path. The entries are alternatives,
          not a sequence, so they are an unnumbered ul; only the shared path is
          ordered. */}
      <div className="how__block">
        <h3 className="how__group-label">{c.entriesLabel}</h3>
        <ul className="how__entries">
          {c.entries.map((entry, i) => (
            <li key={entry.title} className="how__entry" data-reveal>
              <span className="how__entry-key" aria-hidden="true">
                {String.fromCharCode(65 + i)}
              </span>
              <h4 className="how__entry-title">{entry.title}</h4>
              <p className="how__entry-body">{entry.body}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="how__block">
        <h3 className="how__group-label">{c.sharedLabel}</h3>
        <div className="how__walk">
          {/* Decorative mirror of the active step; the list carries the content. */}
          <div className="how__pin" aria-hidden="true">
            <span className="how__pin-step">
              {c.stepLabel} {pad(active + 1)} / {pad(c.steps.length)}
            </span>
            <span key={active} className="how__pin-num">
              {pad(active + 1)}
            </span>
            <span className="how__pin-title">{c.steps[active].title}</span>
            <span className="how__progress">
              {c.steps.map((s, i) => (
                <span
                  key={s.title}
                  className={`how__progress-seg${i <= active ? ' is-done' : ''}`}
                />
              ))}
            </span>
          </div>

          <ol className="how__steps">
            {c.steps.map((step, i) => (
              <li
                key={step.title}
                ref={(el) => {
                  stepRefs.current[i] = el
                }}
                data-index={i}
                className={`how__step${i === active ? ' is-active' : ''}`}
              >
                <span className="how__step-num" aria-hidden="true">
                  {pad(i + 1)}
                </span>
                <h4 className="how__step-title">{step.title}</h4>
                <p className="how__step-body">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Band>
  )
}

export default HowItWorks
