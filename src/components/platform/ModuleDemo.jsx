import { useState } from 'react'
import { Check, RotateCcw } from 'lucide-react'

// One module's story in four or five lines: something arrives, the problem
// shows, the agent acts, the result is stamped. The lines are plain content
// in the prerendered HTML; they only animate once the module's cell has
// scrolled into view (see `.is-in` in platform.css), and again when the
// figure is clicked, which re-keys the list.
function ModuleDemo({ demo, replayLabel }) {
  const [run, setRun] = useState(0)

  return (
    <figure className="mdemo" aria-label={demo.ariaLabel}>
      <ol key={run} className="mdemo__lines">
        {demo.lines.map((line, i) => (
          <li
            key={i}
            className={`mdemo__line mdemo__line--${line.kind}`}
            style={{ '--i': i }}
          >
            {line.kind === 'stamp' && <Check size={12} aria-hidden="true" />}
            <span className="mdemo__text">{line.text}</span>
            {line.value && <span className="mdemo__value">{line.value}</span>}
            {line.levels && (
              <span className="mdemo__bars" aria-hidden="true">
                {line.levels.map((level, j) => (
                  <span
                    key={j}
                    className={level < 30 ? 'is-low' : undefined}
                    style={{ '--h': `${level}%`, '--j': j }}
                  />
                ))}
              </span>
            )}
          </li>
        ))}
      </ol>
      <button
        type="button"
        className="mdemo__replay"
        onClick={() => setRun((n) => n + 1)}
      >
        <RotateCcw size={12} aria-hidden="true" />
        {replayLabel}
      </button>
    </figure>
  )
}

export default ModuleDemo
