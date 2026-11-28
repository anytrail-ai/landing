import { useState } from 'react'

// Background of the platform home's hero. `DEFAULT_TONE` is what ships.
// Under `vite dev` the others can be previewed with ?hero=<tone>, so the
// choice can be made by looking; the production build ignores the parameter.
export const HERO_TONES = ['soft', 'moss', 'tint', 'cream']
export const DEFAULT_TONE = 'cream'

// Tones dark enough that the navbar over them has to be set light.
const DARK_TONES = ['moss']

export function useHeroTone() {
  // Read once, at mount. Dev has no prerendered HTML to mismatch, and in
  // production this is always the default.
  const [tone] = useState(() => {
    if (!import.meta.env.DEV || typeof window === 'undefined') return DEFAULT_TONE
    const asked = new URLSearchParams(window.location.search).get('hero')
    return HERO_TONES.includes(asked) ? asked : DEFAULT_TONE
  })
  return { tone, dark: DARK_TONES.includes(tone) }
}

// The navbar on the platform home, same arrangement: `DEFAULT_NAV` ships,
// ?nav=<variant> previews the others under `vite dev`.
//   plain  the site's ruled cream bar, as on every other page
//   links  the same bar with links to the page's sections
//   moss   a solid moss bar
//   both   a moss bar with the section links
//   pill   a rounded bar floating inset from the top edge
export const NAV_VARIANTS = ['plain', 'links', 'moss', 'both', 'pill']
export const DEFAULT_NAV = 'links'

export function useNavVariant() {
  const [variant] = useState(() => {
    if (!import.meta.env.DEV || typeof window === 'undefined') return DEFAULT_NAV
    const asked = new URLSearchParams(window.location.search).get('nav')
    return NAV_VARIANTS.includes(asked) ? asked : DEFAULT_NAV
  })
  return {
    variant,
    links: variant === 'links' || variant === 'both',
    moss: variant === 'moss' || variant === 'both',
    pill: variant === 'pill',
  }
}
