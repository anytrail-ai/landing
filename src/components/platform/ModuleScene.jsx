import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { Check } from 'lucide-react'
import { SCENE_BEATS } from './sceneBeats'
import { ArScene, CrmScene, InventoryScene, SourcingScene } from './SceneViews'

const VIEWS = { crm: CrmScene, sourcing: SourcingScene, inventory: InventoryScene, ar: ArScene }

// A module's demo: one small product screen that changes in beats, with
// three step pills underneath saying where in the story it is. This is the
// frame around a scene: it owns the beat, advances it while the scene is on
// screen, loops, and lets a pill jump to its step. The screen itself is
// drawn by the module's view in SceneViews.jsx from the beat alone.
//
// With reduced motion nothing advances by itself: each pill shows its
// step's finished state.
const REDUCED = '(prefers-reduced-motion: reduce)'
const subscribeReduced = (notify) => {
  const mq = window.matchMedia(REDUCED)
  mq.addEventListener('change', notify)
  return () => mq.removeEventListener('change', notify)
}
const readReduced = () => window.matchMedia(REDUCED).matches

function ModuleScene({ id, scene, stepsLabel }) {
  const { beats, steps } = SCENE_BEATS[id]
  const View = VIEWS[id]
  const last = beats.length - 1
  // false while prerendering and hydrating, then the visitor's setting
  const still = useSyncExternalStore(subscribeReduced, readReduced, () => false)
  const [playBeat, setPlayBeat] = useState(0)
  // with reduced motion: the beat a pill last asked for, else the finished scene
  const [stillBeat, setStillBeat] = useState(null)
  const [playing, setPlaying] = useState(false)
  const ref = useRef(null)
  const beat = still ? (stillBeat ?? last) : playBeat

  useEffect(() => {
    const el = ref.current
    if (!el || still || typeof IntersectionObserver === 'undefined') return undefined
    const io = new IntersectionObserver(
      ([entry]) => {
        // start from the top each time it comes back into view
        if (entry.isIntersecting) setPlayBeat(0)
        setPlaying(entry.isIntersecting)
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [still])

  // One timer per beat, restarted whenever the beat changes, so a jump gets
  // its beat's full time.
  useEffect(() => {
    if (!playing || still) return undefined
    const timer = setTimeout(
      () => setPlayBeat((b) => (b === last ? 0 : b + 1)),
      beats[playBeat],
    )
    return () => clearTimeout(timer)
  }, [playing, still, playBeat, beats, last])

  // the step a beat belongs to: the last one that has started
  const step = steps.reduce((found, start, i) => (beat >= start ? i : found), 0)
  // where a step ends, for the reduced-motion jump
  const endOf = (i) => (i === steps.length - 1 ? last : steps[i + 1] - 1)

  return (
    <figure className="scene" ref={ref} aria-label={scene.ariaLabel}>
      <div className="scene__screen" aria-hidden="true">
        <View beat={beat} t={scene.t} />
      </div>

      <ol className="scene__steps" aria-label={stepsLabel}>
        {scene.steps.map((label, i) => (
          <li key={label}>
            <button
              type="button"
              className={`scene__step${i === step ? ' is-active' : ''}${i < step ? ' is-done' : ''}`}
              aria-current={i === step ? 'step' : undefined}
              onClick={() => (still ? setStillBeat(endOf(i)) : setPlayBeat(steps[i]))}
            >
              <span className="scene__step-num">{i < step ? <Check size={12} /> : i + 1}</span>
              {label}
            </button>
          </li>
        ))}
      </ol>
    </figure>
  )
}

export default ModuleScene
