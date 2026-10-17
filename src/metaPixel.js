// Meta Pixel. Loads only when VITE_META_PIXEL_ID is set, so a build without it
// ships no Meta script at all (same contract as TELEMETRY_URL in analytics.js).
//
// Why a module instead of the snippet Meta hands out: the stub below is that
// snippet, minus the inline <script> in index.html, so the id is configuration
// rather than markup and the prerender never bakes it into static HTML.
import { META_PIXEL_ID } from './config'

const on = () => typeof window !== 'undefined' && Boolean(META_PIXEL_ID)

export function initMetaPixel() {
  if (!on() || window.fbq) return
  const fbq = function (...args) {
    if (fbq.callMethod) fbq.callMethod(...args)
    else fbq.queue.push(args)
  }
  fbq.queue = []
  fbq.loaded = true
  fbq.version = '2.0'
  fbq.push = fbq
  window.fbq = fbq
  if (!window._fbq) window._fbq = fbq

  const script = document.createElement('script')
  script.async = true
  script.src = 'https://connect.facebook.net/en_US/fbevents.js'
  document.head.appendChild(script)

  window.fbq('init', META_PIXEL_ID)
  window.fbq('track', 'PageView')
}

// Standard events only (Lead, Contact, ...). No-ops when the pixel is off.
export function metaTrack(event, params) {
  if (!on() || !window.fbq) return
  try {
    window.fbq('track', event, params)
  } catch {
    /* the pixel must never break the page */
  }
}
