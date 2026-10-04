import { useEffect } from 'react'

// Marks every [data-reveal] element with `is-in` the first time it scrolls
// into view. Classes are set on the DOM directly, not through state, so the
// prerendered HTML is the finished page: without JS, or before hydration,
// nothing is hidden. `js-reveal` on <html> is what arms the hidden state.
export function useReveal() {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined
    const root = document.documentElement
    root.classList.add('js-reveal')

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-in')
          io.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    )
    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el))

    return () => {
      io.disconnect()
      root.classList.remove('js-reveal')
    }
  }, [])
}
