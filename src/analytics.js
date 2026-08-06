// Thin analytics wrapper. Every function is a no-op when POSTHOG_KEY is unset
// or when running during the static prerender, so the site works identically
// with analytics disabled.
import posthog from 'posthog-js'
import { POSTHOG_KEY, POSTHOG_HOST } from './config'

const enabled = () => typeof window !== 'undefined' && Boolean(POSTHOG_KEY)

export function initAnalytics() {
  if (!enabled()) return
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    // Pageviews are captured manually so the prerendered first paint is not
    // double-counted during hydration.
    capture_pageview: false,
    persistence: 'localStorage',
  })
  posthog.capture('$pageview')
}

export function track(event, properties) {
  if (!enabled()) return
  posthog.capture(event, properties)
}
