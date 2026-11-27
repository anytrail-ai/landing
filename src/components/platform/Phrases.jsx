import { useEffect, useState } from 'react'

const PHRASE_MS = 2600

// The changing half of a headline: a few phrases taking turns. Every phrase
// is in the markup, stacked in one grid cell, so the headline is always as
// tall as its longest phrase and never jolts the page, and the prerendered
// heading carries all of them. With reduced motion the first phrase stays.
function Phrases({ phrases }) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const id = setInterval(() => setActive((i) => (i + 1) % phrases.length), PHRASE_MS)
    return () => clearInterval(id)
  }, [phrases.length])

  return (
    <span className="rot">
      {phrases.map((phrase, i) => (
        <span
          key={phrase}
          className={`rot__phrase${i === active ? ' rot__phrase--active' : ''}`}
          aria-hidden={i === active ? undefined : 'true'}
        >
          {phrase}
        </span>
      ))}
    </span>
  )
}

export default Phrases
