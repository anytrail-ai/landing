// Static prerender: turns the client-rendered SPA into real HTML that crawlers
// (including AI crawlers, which mostly do not execute JavaScript) can read.
//
// Runs after `vite build` and `vite build --ssr`. For every route in ROUTES it
// renders the app to markup, injects per-page <head> metadata, and writes a
// static page. Also emits sitemap.xml, robots.txt and llms.txt.
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.join(ROOT, 'dist')

// Canonical host. The apex 308-redirects to www, so www is the real origin --
// pointing canonical/hreflang/sitemap at the apex would aim every signal at a
// redirect. Verify with `curl -sI https://anytrail.ai/` before changing this.
const SITE = 'https://www.anytrail.ai'
const OG_IMAGE = `${SITE}/hero.jpg`
const OG_IMAGE_W = 1535
const OG_IMAGE_H = 1024

// Markup comes from the SSR bundle; metadata comes straight from the copy
// module, which is plain JS and needs no build step.
const { render } = await import(path.join(ROOT, 'dist-ssr', 'entry-server.js'))
const { COPY, LANGS, ROUTES, NOINDEX_PAGES } = await import(
  './src/i18n/copy.js'
)
const { DEMO_URL } = await import('./src/config.js')

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const urlFor = (lang, page) => {
  const route = ROUTES[lang][page]
  return route === '/' ? `${SITE}/` : `${SITE}${route}`
}

// Home uses the top-level meta block; other pages carry their own.
const metaFor = (lang, page) =>
  page === 'home' ? COPY[lang].meta : COPY[lang][page].meta

function jsonLd(lang) {
  const { description } = COPY[lang].meta
  const graph = [
    {
      '@type': 'Organization',
      '@id': `${SITE}/#organization`,
      name: 'Anytrail',
      url: `${SITE}/`,
      logo: `${SITE}/anytrail-mark.png`,
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      url: `${SITE}/`,
      name: 'Anytrail',
      description,
      publisher: { '@id': `${SITE}/#organization` },
      inLanguage: LANGS,
    },
  ]
  // No SoftwareApplication node: Google requires one of offers,
  // aggregateRating, or review on that type, and we have no verified pricing
  // or ratings to cite. Semrush flagged the incomplete node as a markup error
  // (issue 45). Add it back only alongside real offer data.

  // Escape '<' so the payload can never terminate the surrounding <script>.
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })
    .replace(/</g, '\\u003c')
}

function head(lang, page) {
  const { title, description, ogLocale } = metaFor(lang, page)
  const canonical = urlFor(lang, page)
  const noindex = NOINDEX_PAGES.includes(page)

  // hreflang pairs the SAME page across languages, so /thanks points at
  // /es/gracias rather than at the Spanish home page.
  const alternates = [
    ...LANGS.map(
      (l) => `<link rel="alternate" hreflang="${l}" href="${urlFor(l, page)}" />`,
    ),
    `<link rel="alternate" hreflang="x-default" href="${urlFor('en', page)}" />`,
  ].join('\n    ')

  return `<title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <link rel="canonical" href="${canonical}" />
${noindex ? '    <meta name="robots" content="noindex, follow" />\n' : ''}    ${alternates}

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Anytrail" />
    <meta property="og:locale" content="${ogLocale}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${OG_IMAGE}" />
    <meta property="og:image:width" content="${OG_IMAGE_W}" />
    <meta property="og:image:height" content="${OG_IMAGE_H}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <meta name="twitter:image" content="${OG_IMAGE}" />

    <script type="application/ld+json">${jsonLd(lang)}</script>`
}

const template = await fs.readFile(path.join(DIST, 'index.html'), 'utf8')

for (const lang of LANGS) {
  for (const page of Object.keys(ROUTES[lang])) {
    const html = template
      // Drop the dev-only placeholder title so only the generated one survives.
      .replace(/\s*<title>[\s\S]*?<\/title>/, '')
      .replace('<html lang="en"', `<html lang="${lang}"`)
      .replace('<!--app-head-->', head(lang, page))
      .replace('<!--app-html-->', render(lang, page))

    const route = ROUTES[lang][page]
    const outDir = route === '/' ? DIST : path.join(DIST, route)
    await fs.mkdir(outDir, { recursive: true })
    await fs.writeFile(path.join(outDir, 'index.html'), html)
    console.log(`prerendered ${urlFor(lang, page)}`)
  }
}

// Only indexable pages belong in the sitemap. Listing a noindex page tells
// Google to crawl something it is then told to drop.
const indexable = Object.keys(ROUTES.en).filter(
  (p) => !NOINDEX_PAGES.includes(p),
)
const lastmod = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${indexable
  .flatMap((page) =>
    LANGS.map(
      (lang) => `  <url>
    <loc>${urlFor(lang, page)}</loc>
    <lastmod>${lastmod}</lastmod>
${LANGS.map(
  (l) =>
    `    <xhtml:link rel="alternate" hreflang="${l}" href="${urlFor(l, page)}" />`,
).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${urlFor('en', page)}" />
  </url>`,
    ),
  )
  .join('\n')}
</urlset>
`
await fs.writeFile(path.join(DIST, 'sitemap.xml'), sitemap)
console.log('wrote sitemap.xml')

// robots.txt and llms.txt are generated rather than kept in public/ so the
// absolute URLs inside them can never drift from SITE.
await fs.writeFile(
  path.join(DIST, 'robots.txt'),
  // Deliberately no Disallow for the thank-you pages. They carry a noindex
  // meta tag, and blocking them here would stop Google reading that tag -- a
  // blocked URL can still get indexed from external links.
  `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`,
)
console.log('wrote robots.txt')

// llms.txt: a plain-text summary for LLM crawlers, which mostly do not execute
// JavaScript. Semrush Site Audit flags its absence (issue 137).
const llms = `# Anytrail

> ${COPY.en.meta.description}

Anytrail is an AI sales agent platform for industrial equipment companies,
manufacturers, and distributors. It works demand in both directions: outbound,
where it surfaces accounts that match what the company sells and opens the
conversation on WhatsApp, email, or LinkedIn; and inbound, where it answers
every inquiry the moment it lands. Either way the same agent diagnoses the
application, collects the technical details needed to quote, follows up, and
hands qualified opportunities to the sales team.

## Pages

${LANGS.map(
  (l) =>
    `- [${l === 'en' ? 'Home (English)' : 'Inicio (Español)'}](${urlFor(l, 'home')}): ${COPY[l].meta.description}`,
).join('\n')}

## Contact

- Book a review: ${DEMO_URL}
`
await fs.writeFile(path.join(DIST, 'llms.txt'), llms)
console.log('wrote llms.txt')
