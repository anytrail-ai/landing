# Anytrail — Landing

Marketing landing page for **Anytrail**, which builds AI sales agents for businesses. Our first agent replies to customers 24/7 and becomes an expert in a business in one click — answering questions and recommending the right next step, day or night.

Built with **React** + **Vite**, deployed on **Vercel**.

## Tech stack

- [React 19](https://react.dev/)
- [Vite](https://vite.dev/) (build tooling + dev server with HMR)
- Plain CSS with CSS custom properties (no UI framework)
- Fonts: Funnel Display / Funnel Sans (headings & body), Montserrat (logo wordmark)

## Getting started

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build → dist/
npm run preview  # preview the production build locally
npm run lint     # run ESLint
```

## Project structure

```
public/                 Static assets served as-is
  anytrail-mark.png     Logo "A" mark (also the favicon)
  hero.jpg              Hero image (optimized)
  robots.txt
src/
  components/
    Navbar.jsx / .css   Fixed top navbar: logo + "Join waitlist" CTA
    Hero.jsx   / .css   Hero: title → image → description + CTA
  App.jsx               Page composition
  index.css             Global styles + design tokens (CSS variables)
  main.jsx              React entry point
index.html              HTML shell, fonts, SEO/social meta, LCP preload
vercel.json             Vercel config: SPA rewrite, cache & security headers
```

## Design tokens

Theme values live as CSS custom properties in [`src/index.css`](src/index.css):

- `--page-bg` — page background (`#fefdf6`)
- `--display` / `--sans` — font stacks
- `--btn-bg` / `--btn-text` — button colors (black on light)
- `--text`, `--nav-text` — text colors

## Deployment

Hosted on Vercel. The repo is auto-detected as a Vite app; [`vercel.json`](vercel.json) adds:

- SPA fallback rewrite to `index.html`
- Long-lived immutable caching for hashed `/assets/*`, shorter `stale-while-revalidate` for images/fonts
- Baseline security headers

Deploy via the Vercel Git integration (push to `main`) or the CLI:

```bash
vercel          # preview deployment
vercel --prod   # production deployment
```

> **Note:** After the production domain is live, update the `og:image` / `twitter:image`
> paths in [`index.html`](index.html) from `/hero.jpg` to the absolute URL
> (`https://<your-domain>/hero.jpg`) so social link previews render correctly.
