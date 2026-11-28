import { useEffect, useRef, useState } from 'react'
import { Check, Sparkles } from 'lucide-react'

const STEP_MS = 4200

// A module's demo: one small product screen moving through three states.
// Each step swaps the whole screen (re-keyed, so its rows arrive again), and
// the pills underneath say where in the story it is. Steps advance on their
// own while the scene is on screen and loop; a pill jumps to its step. With
// reduced motion nothing advances by itself and the pills do all the moving.
function ModuleScene({ scene, stepsLabel }) {
  const [step, setStep] = useState(0)
  // bumped when the scene scrolls into view, so step one plays then
  const [seen, setSeen] = useState(0)
  const [playing, setPlaying] = useState(false)
  const ref = useRef(null)
  const count = scene.steps.length
  const current = scene.steps[step]

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return undefined
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setSeen((n) => n + 1)
        setPlaying(entry.isIntersecting && !still)
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // One timer per step: restarting it on every change is what makes a
  // clicked pill get its full time.
  useEffect(() => {
    if (!playing) return undefined
    const id = setTimeout(() => setStep((s) => (s + 1) % count), STEP_MS)
    return () => clearTimeout(id)
  }, [playing, step, count])

  return (
    <figure className="scene" ref={ref} aria-label={scene.ariaLabel}>
      <div className="scene__screen" key={`${step}-${seen > 1 ? 1 : seen}`} aria-hidden="true">
        {current.source && (
          <p className="scene__source" style={{ '--i': 0 }}>
            <span className="scene__dot" />
            {current.source}
          </p>
        )}
        <div className="scene__panel" style={{ '--i': 1 }}>
          <p className="scene__head">
            {current.photo && (
              <img className="scene__thumb" src={current.photo} alt="" width="240" height="240" />
            )}
            <span>{current.title}</span>
            <span>{current.meta}</span>
          </p>

          {current.levels && (
            <div className="scene__bars">
              {current.levels.map((level, j) => (
                <span
                  key={j}
                  className={level < 30 ? 'is-low' : undefined}
                  style={{ '--h': `${level}%`, '--j': j }}
                />
              ))}
            </div>
          )}

          {current.rows && (
            <ul className="scene__rows">
              {current.rows.map((row, i) => (
                <li key={row.name} className="scene__row" style={{ '--i': i + 2 }}>
                  {row.img && (
                    <img className="scene__thumb" src={row.img} alt="" width="240" height="240" />
                  )}
                  <span className="scene__row-main">
                    <span className="scene__row-name">{row.name}</span>
                    {row.sub && <span className="scene__row-sub">{row.sub}</span>}
                  </span>
                  {row.tag && (
                    <span className={`scene__tag scene__tag--${row.tone ?? 'plain'}`}>
                      {row.tag}
                    </span>
                  )}
                  {row.value && <span className="scene__value">{row.value}</span>}
                </li>
              ))}
            </ul>
          )}

          {current.note && (
            <p className="scene__note" style={{ '--i': (current.rows?.length ?? 1) + 2 }}>
              <Sparkles size={14} />
              {current.note}
            </p>
          )}
          {current.stamp && (
            <p className="scene__stamp" style={{ '--i': (current.rows?.length ?? 1) + 3 }}>
              <Check size={12} />
              {current.stamp}
            </p>
          )}
        </div>
      </div>

      <ol className="scene__steps" aria-label={stepsLabel}>
        {scene.steps.map((s, i) => (
          <li key={s.label}>
            <button
              type="button"
              className={`scene__step${i === step ? ' is-active' : ''}${
                i === step && playing ? ' is-timed' : ''
              }`}
              aria-current={i === step ? 'step' : undefined}
              onClick={() => setStep(i)}
            >
              <span className="scene__step-num">{i + 1}</span>
              {s.label}
            </button>
          </li>
        ))}
      </ol>
    </figure>
  )
}

export default ModuleScene
