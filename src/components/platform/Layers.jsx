import { useEffect, useRef, useState } from 'react'
import { Check } from 'lucide-react'
import Band from '../Band'
import { useLanguage } from '../../i18n/useLanguage'
import { track } from '../../analytics'

const TIER_MS = 5000

// One plate of the stack: a flat diamond with a little thickness under it.
// Drawn around (0, 0); the caller moves it into place.
function Plate({ active }) {
  return (
    <g className={`lay__plate${active ? ' is-active' : ''}`}>
      <path className="lay__plate-side" d="M-96 0 L0 38 L96 0 L96 10 L0 48 L-96 10 Z" />
      <path className="lay__plate-top" d="M-96 0 L0 -38 L96 0 L0 38 Z" />
    </g>
  )
}

// "How it works": the three layers of the platform as a stack, top to
// bottom, and beside it what each layer looks like in the product. The
// layer names are the tabs. While the section is on screen it steps through
// the layers by itself; once someone picks one, it stays where they put it.
function Layers() {
  const { copy, lang } = useLanguage()
  const c = copy.platform.layers
  const [active, setActive] = useState(0)
  const [auto, setAuto] = useState(true)
  const [seen, setSeen] = useState(false)
  const ref = useRef(null)
  const tier = c.tiers[active]

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return undefined
    const io = new IntersectionObserver(([entry]) => setSeen(entry.isIntersecting), {
      threshold: 0.35,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!auto || !seen) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const id = setTimeout(() => setActive((i) => (i + 1) % c.tiers.length), TIER_MS)
    return () => clearTimeout(id)
  }, [auto, seen, active, c.tiers.length])

  const choose = (i) => {
    setAuto(false)
    setActive(i)
    track('platform_layer_view', { layer: c.tiers[i].id, lang })
  }

  return (
    <Band id="how" label={c.label} title={c.title} intro={c.intro} className="lay">
      <div className="lay__stage" ref={ref}>
        <div className="lay__diagram">
          <div className="lay__tabs" role="tablist" aria-orientation="vertical">
            {c.tiers.map((t, i) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                id={`lay-tab-${t.id}`}
                aria-selected={i === active}
                aria-controls="lay-panel"
                className={`lay__tab${i === active ? ' is-active' : ''}`}
                onClick={() => choose(i)}
              >
                {t.name}
              </button>
            ))}
          </div>

          {/* three plates, with the dashed lines that tie them together */}
          <svg className="lay__stack" viewBox="0 0 220 348" aria-hidden="true">
            {[-60, 0, 60].map((x) => (
              <line key={x} className="lay__thread" x1={110 + x} y1="58" x2={110 + x} y2="290" />
            ))}
            {c.tiers.map((t, i) => (
              <g key={t.id} transform={`translate(110 ${58 + i * 116})`}>
                <Plate active={i === active} />
                {/* a few marks on each plate: agents, a grid of records, systems */}
                {i === 0 &&
                  [-34, 0, 34].map((x) => (
                    <circle key={x} className="lay__mark" cx={x} cy={x === 0 ? -8 : 4} r="6" />
                  ))}
                {i === 1 &&
                  [
                    [-22, 0],
                    [0, -10],
                    [22, 0],
                    [0, 10],
                  ].map(([x, y]) => (
                    <path
                      key={`${x}${y}`}
                      className="lay__mark"
                      d={`M${x - 16} ${y} L${x} ${y - 7} L${x + 16} ${y} L${x} ${y + 7} Z`}
                    />
                  ))}
                {i === 2 &&
                  [-36, 0, 36].map((x) => (
                    <rect key={x} className="lay__mark" x={x - 9} y="-9" width="18" height="14" rx="3" />
                  ))}
              </g>
            ))}
          </svg>
        </div>

        <div
          className="lay__panel scn"
          id="lay-panel"
          role="tabpanel"
          aria-labelledby={`lay-tab-${tier.id}`}
        >
          {/* re-keyed per layer, so its rows arrive again */}
          <div key={tier.id} className="scn__card lay__card">
            <p className="scn__head">
              <span className="scn__head-main">
                <strong>{tier.title}</strong>
                <span>{tier.sub}</span>
              </span>
            </p>
            <ul className="scn__rows">
              {tier.rows.map((row, i) => (
                <li key={row.name} className="scn__row lay__row" style={{ '--i': i }}>
                  <span className="scn__line-main">
                    <strong>{row.name}</strong>
                    <span>{row.sub}</span>
                  </span>
                  {row.tag && (
                    <span className={`scn__tag scn__tag--${row.tone ?? 'plain'}`}>
                      {row.tone === 'good' && <Check size={11} />}
                      {row.tag}
                    </span>
                  )}
                  {row.value && <span className="scn__amount">{row.value}</span>}
                </li>
              ))}
            </ul>
            <p className="lay__caption">{tier.caption}</p>
          </div>
        </div>
      </div>
    </Band>
  )
}

export default Layers
