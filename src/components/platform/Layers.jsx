import { useEffect, useRef, useState } from 'react'
import { Check } from 'lucide-react'
import Band from '../Band'
import { useLanguage } from '../../i18n/useLanguage'
import { track } from '../../analytics'

const TIER_MS = 5000

// The drawing, in its own coordinates. Three plates stacked top to bottom,
// and three dashed lines running through them. Each line starts at one of
// the systems on the bottom plate, passes through the record in the middle
// and ends at one of the agents on the top plate, so the picture reads as
// data going from a system to an agent.
const PLATE_Y = [58, 174, 290]

// One line per column. `node` is the agent's circle on the top plate and
// `sys` the top of the system's icon on the bottom plate. The other numbers
// are where the line meets each plate: a line is hidden while it is behind
// a plate, so it is drawn in pieces.
const LINES = [
  { x: 76, node: 62, topUnder: 92.5, midTop: 149.5, midUnder: 208.5, botEdge: 265.5, sys: 281 },
  { x: 110, node: 50, topUnder: 106, midTop: 136, midUnder: 222, botEdge: 252, sys: 271 },
  { x: 144, node: 62, topUnder: 92.5, midTop: 149.5, midUnder: 208.5, botEdge: 265.5, sys: 281 },
]

// The dots that travel the lines: where each starts (`y`), how far it goes
// (`dy`, negative is upwards) and when (`d`, seconds into the loop). On the
// outer lines data goes up, from a system to the record and from the record
// to an agent. On the middle line what the agent does comes back down.
const NODE_R = 6
const DOTS = LINES.flatMap((line, k) =>
  k === 1
    ? [
        { x: line.x, y: line.node + NODE_R, dy: line.midTop - line.node - NODE_R, d: 0.4 },
        { x: line.x, y: line.midUnder, dy: line.sys - line.midUnder, d: 1.6 },
      ]
    : [
        { x: line.x, y: line.sys, dy: line.midUnder - line.sys, d: k * 0.4 },
        { x: line.x, y: line.midTop, dy: line.node + NODE_R - line.midTop, d: 1.2 + k * 0.4 },
      ],
)

// A database: a short cylinder with one band. Drawn around (0, 0).
function Database() {
  return (
    <g className="lay__mark">
      <path d="M-9 -6 v12 a9 3.5 0 0 0 18 0 v-12" />
      <ellipse cx="0" cy="-6" rx="9" ry="3.5" />
      <path d="M-9 0 a9 3.5 0 0 0 18 0" />
    </g>
  )
}

// A server: two stacked units, each with a status light.
function Server() {
  return (
    <g className="lay__mark">
      <rect x="-11" y="-10" width="22" height="9" rx="2" />
      <rect x="-11" y="1" width="22" height="9" rx="2" />
      <circle className="lay__led" cx="-6" cy="-5.5" r="1.2" />
      <circle className="lay__led" cx="-6" cy="5.5" r="1.2" />
      <path d="M-1 -5.5 h8 M-1 5.5 h8" />
    </g>
  )
}

// One plate of the stack: a flat diamond with a little thickness under it.
// Drawn around (0, 0); the caller moves it into place.
function Plate() {
  return (
    <g className="lay__plate">
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
            {/* the parts of each line that show between the plates */}
            {LINES.map((l) => (
              <g key={l.x} className="lay__thread">
                <line x1={l.x} y1={l.topUnder} x2={l.x} y2={l.midTop} />
                <line x1={l.x} y1={l.midUnder} x2={l.x} y2={l.botEdge} />
              </g>
            ))}

            {c.tiers.map((t, i) => (
              <g
                key={t.id}
                className={`lay__layer${i === active ? ' is-active' : ''}`}
                transform={`translate(110 ${PLATE_Y[i]})`}
              >
                <Plate />
                {/* the record in the middle: a grid of tiles */}
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
                {/* your systems: a database, a server, a database */}
                {i === 2 && (
                  <>
                    <g transform="translate(-34 2)">
                      <Database />
                    </g>
                    <g transform="translate(0 -8)">
                      <Server />
                    </g>
                    <g transform="translate(34 2)">
                      <Database />
                    </g>
                  </>
                )}
              </g>
            ))}

            {/* the ends of each line, drawn over the plates they land on: up
                to its agent on the top plate, down to its system on the
                bottom one */}
            {LINES.map((l) => (
              <g key={l.x}>
                <line
                  className={`lay__thread lay__thread--on${active === 0 ? ' is-active' : ''}`}
                  x1={l.x}
                  y1={l.node + NODE_R}
                  x2={l.x}
                  y2={l.topUnder}
                />
                <line
                  className={`lay__thread lay__thread--on${active === 2 ? ' is-active' : ''}`}
                  x1={l.x}
                  y1={l.botEdge}
                  x2={l.x}
                  y2={l.sys}
                />
              </g>
            ))}

            {/* the agents: one circle at the top of each line. Each pulses as
                its line's dot arrives. */}
            {LINES.map((l, k) => (
              <g
                key={l.x}
                className={`lay__node${active === 0 ? ' is-active' : ''}`}
                style={{ '--d': `${k === 1 ? 0.4 : 1.2 + k * 0.4}s` }}
              >
                <circle className="lay__node-ring" cx={l.x} cy={l.node} r={NODE_R} />
                <circle className="lay__node-core" cx={l.x} cy={l.node} r="2" />
              </g>
            ))}

            {DOTS.map((dot) => (
              <circle
                key={`${dot.x}-${dot.y}`}
                className="lay__dot"
                cx={dot.x}
                cy={dot.y}
                r="2.5"
                style={{ '--dy': `${dot.dy}px`, '--d': `${dot.d}s` }}
              />
            ))}

            {/* each name is tied to its plate; the selected plate is also tied
                to the card beside it, with a dot running along the line. The
                line runs on under the card, which covers its far end. */}
            {PLATE_Y.map((y) => (
              <line key={y} className="lay__tie" x1="-14" y1={y} x2="10" y2={y} />
            ))}
            <g key={active} className="lay__link">
              <line x1="208" y1={PLATE_Y[active]} x2="560" y2={PLATE_Y[active]} />
              <circle cx="208" cy={PLATE_Y[active]} r="3" />
              <circle className="lay__link-dot" cx="208" cy={PLATE_Y[active]} r="2.5" />
            </g>
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

      {/* the two ways to put it to work: ask, or let it run */}
      <div className="lay__more">
        <h3 className="lay__more-title">{c.more.title}</h3>
        <ul className="lay__duo">
          {c.more.items.map((item) => (
            <li key={item.name} className="lay__duo-card" data-reveal>
              <h4>{item.name}</h4>
              <p>
                <strong>{item.lead}</strong> {item.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Band>
  )
}

export default Layers
