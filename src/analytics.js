// First-party telemetry. Posts to our own AWS collector; no third-party
// script, no cookies, no cross-site identifiers.
//
// Everything no-ops when TELEMETRY_URL is unset or during the static
// prerender, so the site behaves identically with telemetry disabled.
import { TELEMETRY_URL } from './config'

const on = () => typeof window !== 'undefined' && Boolean(TELEMETRY_URL)

let queue = []
let ctx = { page: 'unknown', lang: 'en' }

// Session id lives in sessionStorage, so it dies with the tab and is never a
// cross-visit identifier. Enough to group one visit's events, nothing more.
function sessionId() {
  try {
    const k = 'at_s'
    let v = sessionStorage.getItem(k)
    if (!v) {
      v = Math.random().toString(36).slice(2) + Date.now().toString(36)
      sessionStorage.setItem(k, v)
    }
    return v
  } catch {
    return 'nostore'
  }
}

function flush() {
  if (!on() || queue.length === 0) return
  const body = JSON.stringify({ events: queue })
  queue = []
  try {
    // sendBeacon survives page unload, which a normal fetch does not.
    if (navigator.sendBeacon) {
      navigator.sendBeacon(TELEMETRY_URL, new Blob([body], { type: 'application/json' }))
    } else {
      fetch(TELEMETRY_URL, { method: 'POST', body, keepalive: true })
    }
  } catch {
    /* telemetry must never break the page */
  }
}

export function track(event, properties = {}) {
  if (!on()) return
  queue.push({ event, ...ctx, session: sessionId(), ...properties })
  if (queue.length >= 20) flush()
}

export function initAnalytics({ page, lang }) {
  if (!on()) return
  ctx = { page: `${page}-${lang}`, lang }

  const params = new URLSearchParams(window.location.search)
  const utm = ['utm_source', 'utm_medium', 'utm_campaign']
    .map((k) => params.get(k))
    .filter(Boolean)
    .join('|')

  track('pageview', {
    ref: document.referrer || undefined,
    utm: utm || undefined,
    vw: window.innerWidth,
    vh: window.innerHeight,
  })

  // Click coordinates as a fraction of the full document, so the heatmap
  // overlays correctly regardless of the visitor's screen size.
  window.addEventListener(
    'click',
    (e) => {
      const doc = document.documentElement
      const w = doc.scrollWidth || 1
      const h = doc.scrollHeight || 1
      track('click', {
        x: Number((e.pageX / w).toFixed(4)),
        y: Number((e.pageY / h).toFixed(4)),
        vw: window.innerWidth,
        vh: window.innerHeight,
      })
    },
    { passive: true, capture: true },
  )

  // Scroll depth, reported once per milestone rather than continuously.
  const seen = new Set()
  const onScroll = () => {
    const doc = document.documentElement
    const max = doc.scrollHeight - window.innerHeight
    const pct = max > 0 ? (window.scrollY / max) * 100 : 100
    for (const m of [25, 50, 75, 100]) {
      if (pct >= m && !seen.has(m)) {
        seen.add(m)
        track('scroll_depth', { depth: m })
      }
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  // pagehide is more reliable than unload on mobile Safari.
  window.addEventListener('pagehide', flush)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush()
  })
  setInterval(flush, 15000)
}
