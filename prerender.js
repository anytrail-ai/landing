// Static prerender: turns the client-rendered SPA into real HTML that crawlers
// (including AI crawlers, which mostly do not execute JavaScript) can read.
//
// Runs after `vite build` and `vite build --ssr`. For each language it renders
// the app to markup, injects per-language <head> metadata, and writes a static
// page. Also emits sitemap.xml so robots.txt has something to point at.
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.join(ROOT, 'dist')

// Canonical host. The apex 308-redirects to www, so www is the real origin —
// pointing canonical/hreflang/sitemap at the apex would aim every signal at a
// redirect. Verify with `curl -sI https://anytrail.ai/` before changing this.
const SITE = 'https://www.anytrail.ai'
const OG_IMAGE = `${SITE}/hero.jpg`
const OG_IMAGE_W = 1535
const OG_IMAGE_H = 1024

// Markup comes from the SSR bundle; metadata comes straight from the copy
// module, which is plain JS and needs no build step.
const { render } = await import(path.join(ROOT, 'dist-ssr', 'entry-server.js'))
const { COPY, LANGS, LANG_PATH } = await import('./src/i18n/copy.js')
const { DEMO_URL } = await import('./src/config.js')

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const urlFor = (lang) =>
  lang === 'en' ? `${SITE}/` : `${SITE}${LANG_PATH[lang]}`

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

function head(lang) {
  const { title, description, ogLocale } = COPY[lang].meta
  const canonical = urlFor(lang)

  const alternates = [
    ...LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${urlFor(l)}" />`),
    `<link rel="alternate" hreflang="x-default" href="${urlFor('en')}" />`,
  ].join('\n    ')

  return `<title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <link rel="canonical" href="${canonical}" />
    ${alternates}

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
  const html = template
    // Drop the dev-only placeholder title so only the generated one survives.
    .replace(/\s*<title>[\s\S]*?<\/title>/, '')
    .replace('<html lang="en"', `<html lang="${lang}"`)
    .replace('<!--app-head-->', head(lang))
    .replace('<!--app-html-->', render(lang))

  const outDir = lang === 'en' ? DIST : path.join(DIST, LANG_PATH[lang])
  await fs.mkdir(outDir, { recursive: true })
  await fs.writeFile(path.join(outDir, 'index.html'), html)
  console.log(`prerendered ${urlFor(lang)}`)
}

const lastmod = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${LANGS.map(
  (lang) => `  <url>
    <loc>${urlFor(lang)}</loc>
    <lastmod>${lastmod}</lastmod>
${LANGS.map(
  (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${urlFor(l)}" />`,
).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${urlFor('en')}" />
  </url>`,
).join('\n')}
</urlset>
`
await fs.writeFile(path.join(DIST, 'sitemap.xml'), sitemap)
console.log('wrote sitemap.xml')

// robots.txt and llms.txt are generated rather than kept in public/ so the
// absolute URLs inside them can never drift from SITE.
await fs.writeFile(
  path.join(DIST, 'robots.txt'),
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
manufacturers, and distributors. It detects buying signals, answers inbound
inquiries, diagnoses the application, collects the technical details needed to
quote, follows up, and hands qualified opportunities to the sales team.

## Pages

${LANGS.map(
  (l) => `- [${l === 'en' ? 'Home (English)' : 'Inicio (Español)'}](${urlFor(l)}): ${COPY[l].meta.description}`,
).join('\n')}

## Contact

- Book a demo: ${DEMO_URL}
`
await fs.writeFile(path.join(DIST, 'llms.txt'), llms)
console.log('wrote llms.txt')
