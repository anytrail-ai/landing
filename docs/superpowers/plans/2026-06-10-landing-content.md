# Landing Page Content Expansion — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the Anytrail landing page from a Navbar + Hero into a full 9-section single-page narrative with three product mockups, per `docs/superpowers/specs/2026-06-10-landing-content-design.md`.

**Architecture:** React 19 SPA with plain CSS using custom-property design tokens. Two shared helpers (`Section`, `MockCard`) own the chrome that repeats across new sections; section components compose copy + mockups. App.jsx grows incrementally — every task that adds a section ends by wiring it into App.jsx, so the dev server reflects progress task-by-task.

**Tech Stack:** React 19, Vite 8, plain CSS with custom properties, ESLint. No new dependencies introduced.

## Verification harness

There is no test framework in this project, and the work is presentation-only — no state, no events, no business logic worth unit-testing. Verification per task uses three layers:

1. **`npm run lint`** — must pass with no new warnings.
2. **`npm run dev`** (run once at the start, leave it running) — visually verify the new section appears, copy reads correctly, layout is right at desktop (≥1024px) and mobile (≤700px) widths in the browser's responsive view.
3. **`npm run build`** — at the very end, must succeed.

Each task ends with a commit. Frequent small commits keep diffs reviewable.

## Files touched

| Status | Path | Purpose |
|--------|------|---------|
| Edit | `src/index.css` | Add new design tokens |
| New | `src/config.js` | `DEMO_URL` constant |
| Edit | `src/App.jsx` | Compose new sections (grows across tasks) |
| Edit | `src/components/Navbar.jsx` | CTA text + href |
| Edit | `src/components/Hero.jsx`, `Hero.css` | Copy, CTA, token promotion |
| New | `src/components/Section.jsx`, `.css` | Shared section wrapper |
| New | `src/components/MockCard.jsx`, `.css` | Shared white-card chrome |
| New | `src/components/TheGap.jsx`, `.css` | "The gap" section |
| New | `src/components/Learn.jsx`, `.css` | "Learn" section |
| New | `src/components/Act.jsx`, `.css` | "Act" section |
| New | `src/components/Respond.jsx`, `.css` | "Respond" section |
| New | `src/components/PlugsInto.jsx`, `.css` | Integrations section |
| New | `src/components/ClosingCTA.jsx`, `.css` | Final CTA |
| New | `src/components/Footer.jsx`, `.css` | Footer |
| New | `src/components/mockups/PatternsDashboard.jsx`, `.css` | Patterns dashboard mockup |
| New | `src/components/mockups/CampaignDraft.jsx`, `.css` | Campaign mockup |
| New | `src/components/mockups/WhatsAppConversation.jsx`, `.css` | WhatsApp mockup |
| Edit | `index.html` | SEO title + meta description |
| Edit | `README.md` | Project structure section |

---

## Task 1: Add design tokens to `src/index.css`

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Replace the entire contents of `src/index.css` with the expanded token set.**

The existing tokens are preserved; new ones are added. Old `--text` is kept as an alias of `--text-strong`.

```css
:root {
  --sans: 'Funnel Sans', system-ui, 'Segoe UI', Roboto, sans-serif;
  --display: 'Funnel Display', 'Funnel Sans', system-ui, sans-serif;

  /* Palette — page */
  --page-bg: #fefdf6;

  /* Surfaces */
  --surface: #ffffff;
  --surface-muted: #f6f4ea;
  --border: #e7e2d1;
  --border-strong: #1f1f1f;

  /* Text scale */
  --text: #111827;
  --text-strong: #111827;
  --text-muted: #6b7280;
  --text-faint: #9ca3af;

  /* Navbar */
  --nav-text: #111827;
  --nav-text-hover: #000000;
  --btn-bg: #000000;
  --btn-bg-hover: #1f1f1f;
  --btn-text: #ffffff;

  /* Accent — single accent for "active signal" inside mockups */
  --accent: #2f6f4f;
  --accent-soft: #e8f0eb;

  /* Spacing scale */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  --space-24: 96px;
  --space-32: 128px;

  /* Section rhythm */
  --section-pad-y: 96px;
  --section-pad-y-mobile: 64px;
  --content-max: 929px;

  font: 16px/1.5 var(--sans);
  color: var(--text);
  background: var(--page-bg);
  color-scheme: light;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  background: var(--page-bg);
}

#root {
  min-height: 100vh;
}
```

- [ ] **Step 2: Run lint and verify the page still renders.**

```bash
npm run lint
npm run dev
```

Open http://localhost:5173 and confirm the existing Navbar + Hero still look identical (nothing visual changed yet — only tokens added).

- [ ] **Step 3: Commit.**

```bash
git add src/index.css
git commit -m "$(cat <<'EOF'
feat(tokens): add surface, text-scale, accent, and spacing tokens

Extends the design system in preparation for the new sections. No
existing visual changes; --text is kept as an alias of --text-strong
so all existing references continue to resolve.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Create `src/config.js` with `DEMO_URL`

**Files:**
- Create: `src/config.js`

- [ ] **Step 1: Write the file.**

```js
// Single source of truth for the demo-booking CTA destination.
// Replace with the real scheduling URL when ready.
export const DEMO_URL = 'https://cal.com/anytrail/demo'
```

- [ ] **Step 2: Run lint.**

```bash
npm run lint
```

- [ ] **Step 3: Commit.**

```bash
git add src/config.js
git commit -m "$(cat <<'EOF'
feat(config): add DEMO_URL constant for demo-booking CTAs

Single source of truth for the three CTAs (Navbar, Hero, ClosingCTA)
so the real scheduling URL only needs to land in one place.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Create `Section` shared wrapper

**Files:**
- Create: `src/components/Section.jsx`
- Create: `src/components/Section.css`

- [ ] **Step 1: Write `Section.jsx`.**

```jsx
import './Section.css'

function Section({ label, title, children, className = '' }) {
  return (
    <section className={`section ${className}`.trim()}>
      <div className="section__inner">
        {label && <p className="section__label">{label}</p>}
        {title && <h2 className="section__title">{title}</h2>}
        <div className="section__body">{children}</div>
      </div>
    </section>
  )
}

export default Section
```

- [ ] **Step 2: Write `Section.css`.**

```css
.section {
  padding: var(--section-pad-y) 16px;
}

.section__inner {
  max-width: var(--content-max);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.section__label {
  margin: 0;
  font-family: var(--sans);
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-faint);
}

.section__title {
  margin: 0;
  max-width: 620px;
  font-family: var(--display);
  font-weight: 400;
  font-size: 24px;
  line-height: 30px;
  letter-spacing: -0.4px;
  color: var(--text-strong);
}

.section__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  font-family: var(--sans);
  font-size: 15px;
  line-height: 22.5px;
  color: var(--text-muted);
  max-width: 620px;
}

.section__body p {
  margin: 0;
}

@media (max-width: 700px) {
  .section {
    padding: var(--section-pad-y-mobile) 16px;
  }
}
```

- [ ] **Step 3: Run lint.**

```bash
npm run lint
```

- [ ] **Step 4: Commit.**

```bash
git add src/components/Section.jsx src/components/Section.css
git commit -m "$(cat <<'EOF'
feat(section): add shared Section wrapper for new content sections

Owns the small-caps label, h2 title, body slot, max-width, and section
vertical rhythm so the five sections that use it stay consistent.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Create `MockCard` shared wrapper

**Files:**
- Create: `src/components/MockCard.jsx`
- Create: `src/components/MockCard.css`

- [ ] **Step 1: Write `MockCard.jsx`.**

```jsx
import './MockCard.css'

function MockCard({ children, ariaLabel }) {
  return (
    <figure className="mockcard" role="group" aria-label={ariaLabel}>
      {children}
    </figure>
  )
}

export default MockCard
```

- [ ] **Step 2: Write `MockCard.css`.**

Consumers use the `mockcard__header`, `mockcard__body`, `mockcard__footer` class names to structure their internal layout.

```css
.mockcard {
  margin: 0;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  font-family: var(--sans);
}

.mockcard__header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--border);
  font-size: 13px;
  line-height: 1;
  color: var(--text-strong);
}

.mockcard__header-title {
  margin-right: auto;
  font-weight: 500;
}

.mockcard__header-meta {
  color: var(--text-faint);
}

.mockcard__body {
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.mockcard__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--border);
  background: var(--surface-muted);
  font-size: 13px;
  color: var(--text-muted);
}

@media (max-width: 700px) {
  .mockcard__header,
  .mockcard__body,
  .mockcard__footer {
    padding-left: var(--space-3);
    padding-right: var(--space-3);
  }
}
```

- [ ] **Step 3: Run lint.**

```bash
npm run lint
```

- [ ] **Step 4: Commit.**

```bash
git add src/components/MockCard.jsx src/components/MockCard.css
git commit -m "$(cat <<'EOF'
feat(mockcard): add shared white-card chrome for product mockups

White-on-cream card with hairline border, used by PatternsDashboard
and CampaignDraft. WhatsAppConversation has its own phone-shaped
chrome and does not consume this.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Update Navbar CTA

**Files:**
- Modify: `src/components/Navbar.jsx`

- [ ] **Step 1: Replace the Navbar with the updated version.**

Adds the `DEMO_URL` import and changes the CTA text + href.

```jsx
import './Navbar.css'
import { DEMO_URL } from '../config'

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <a className="navbar__logo" href="/" aria-label="Anytrail home">
          <img
            className="navbar__logo-mark"
            src="/anytrail-mark.png"
            alt=""
            width="157"
            height="166"
          />
          <span className="navbar__logo-text">anytrail</span>
        </a>

        <a className="navbar__cta" href={DEMO_URL}>
          Book a demo
        </a>
      </div>
    </header>
  )
}

export default Navbar
```

- [ ] **Step 2: Verify in browser.**

Reload http://localhost:5173. The navbar CTA should now read "Book a demo" and link to the placeholder cal.com URL.

- [ ] **Step 3: Run lint.**

```bash
npm run lint
```

- [ ] **Step 4: Commit.**

```bash
git add src/components/Navbar.jsx
git commit -m "$(cat <<'EOF'
feat(navbar): switch CTA from Join waitlist to Book a demo

Reads destination from the shared DEMO_URL constant.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Update Hero copy, CTA, and token promotion

**Files:**
- Modify: `src/components/Hero.jsx`
- Modify: `src/components/Hero.css`

- [ ] **Step 1: Replace `Hero.jsx` with the new copy + CTA.**

```jsx
import './Hero.css'
import { DEMO_URL } from '../config'

function Hero() {
  return (
    <section className="hero">
      <h1 className="hero__title">
        Big-company sales intelligence.
        <br />
        Built for your business.
      </h1>

      <div className="hero__media">
        <img
          className="hero__image"
          src="/hero.jpg"
          alt="A team working together over laptops, notebooks and documents"
          width="1535"
          height="1024"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      </div>

      <div className="hero__content">
        <p className="hero__subtitle">
          Anytrail learns from your sales history, finds the patterns big
          competitors hire data teams to spot, and turns them into ads, emails,
          and replies — automatically.
        </p>
        <div className="hero__actions">
          <a className="hero__cta" href={DEMO_URL}>
            Book a demo
          </a>
        </div>
      </div>
    </section>
  )
}

export default Hero
```

- [ ] **Step 2: Update `Hero.css` to swap the inline color hex for the new token.**

Find the line:

```css
  color: #6b7280;
```

inside `.hero__subtitle` and replace with:

```css
  color: var(--text-muted);
```

The rest of the file is unchanged.

- [ ] **Step 3: Verify in browser.**

Reload http://localhost:5173. The hero should now show the new headline (two lines) and the new subtitle, with the CTA reading "Book a demo".

- [ ] **Step 4: Run lint.**

```bash
npm run lint
```

- [ ] **Step 5: Commit.**

```bash
git add src/components/Hero.jsx src/components/Hero.css
git commit -m "$(cat <<'EOF'
feat(hero): rewrite copy around the three-pillar positioning

Headline becomes "Big-company sales intelligence. Built for your
business." Subtitle names the three pillars (ads / emails / replies).
CTA changes to "Book a demo" and reads DEMO_URL. Inline subtitle
color is promoted to the --text-muted token.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Add Footer (small, build it first so App.jsx wiring is simpler later)

**Files:**
- Create: `src/components/Footer.jsx`
- Create: `src/components/Footer.css`
- Modify: `src/App.jsx`

- [ ] **Step 1: Write `Footer.jsx`.**

```jsx
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <span className="footer__logo">anytrail</span>
        <p className="footer__tagline">
          Big-company sales intelligence, for any SMB. © 2026 Anytrail
        </p>
      </div>
    </footer>
  )
}

export default Footer
```

- [ ] **Step 2: Write `Footer.css`.**

```css
.footer {
  padding: var(--space-12) 16px;
  border-top: 1px solid var(--border);
}

.footer__inner {
  max-width: var(--content-max);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.footer__logo {
  font-family: 'Montserrat', var(--sans);
  font-weight: 300;
  font-size: 16px;
  letter-spacing: 0.01em;
  color: var(--text-strong);
}

.footer__tagline {
  margin: 0;
  font-family: var(--sans);
  font-size: 13px;
  line-height: 18px;
  color: var(--text-faint);
}
```

- [ ] **Step 3: Wire into `App.jsx`.**

Replace the entire `App.jsx`:

```jsx
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
      </main>
      <Footer />
    </>
  )
}

export default App
```

- [ ] **Step 4: Verify in browser.**

Scroll to the bottom of the page. Footer should show "anytrail" and the tagline + copyright line.

- [ ] **Step 5: Run lint.**

```bash
npm run lint
```

- [ ] **Step 6: Commit.**

```bash
git add src/components/Footer.jsx src/components/Footer.css src/App.jsx
git commit -m "$(cat <<'EOF'
feat(footer): add minimal footer with wordmark and tagline

No nav menu — page is short enough not to need one.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Add "The gap" section

**Files:**
- Create: `src/components/TheGap.jsx`
- Create: `src/components/TheGap.css`
- Modify: `src/App.jsx`

- [ ] **Step 1: Write `TheGap.jsx`.**

```jsx
import Section from './Section'
import './TheGap.css'

function TheGap() {
  return (
    <Section
      label="THE LOOP"
      title="Big companies don't sell more because they have better products. They sell more because they close the loop between knowing and doing."
      className="thegap"
    >
      <p>
        Amazon, Mercado Libre, Sephora — every recommendation, every email,
        every ad you see from them is the output of one loop: learn what each
        customer wants, act on it across every channel, respond when they
        reply.
      </p>
      <p>
        The loop needs a data team to build the models, a marketing team to
        launch the campaigns, and an ops team to handle the replies. Most
        businesses can't afford all three. Anytrail is all three.
      </p>
    </Section>
  )
}

export default TheGap
```

- [ ] **Step 2: Write `TheGap.css`.**

The section uses the shared `Section` chrome; this file is for any section-specific overrides. For now, no overrides needed — keep the file present so the component import has a place to extend later.

```css
/* TheGap currently uses the shared Section chrome without overrides. */
```

- [ ] **Step 3: Wire into `App.jsx`.**

Replace `App.jsx`:

```jsx
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import TheGap from './components/TheGap'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TheGap />
      </main>
      <Footer />
    </>
  )
}

export default App
```

- [ ] **Step 4: Verify in browser.**

Below the hero, you should see:
- A small-caps "THE LOOP" label
- The h2 title about closing the loop
- Two body paragraphs

- [ ] **Step 5: Run lint.**

```bash
npm run lint
```

- [ ] **Step 6: Commit.**

```bash
git add src/components/TheGap.jsx src/components/TheGap.css src/App.jsx
git commit -m "$(cat <<'EOF'
feat(thegap): add The Gap section explaining the loop thesis

Copy-only section between the human hero and the first product
mockup. Frames the page's central argument: big companies close
the loop between knowing and doing.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: Build the `PatternsDashboard` mockup

**Files:**
- Create: `src/components/mockups/PatternsDashboard.jsx`
- Create: `src/components/mockups/PatternsDashboard.css`

- [ ] **Step 1: Write `PatternsDashboard.jsx`.**

```jsx
import MockCard from '../MockCard'
import './PatternsDashboard.css'

/* example mockup data — not real customers. Update when first pilots ship. */
const PATTERNS = [
  {
    id: 'brake-tires',
    from: 'Brake service',
    to: 'Tires',
    avgDays: 87,
    customers: 412,
    confidence: 31,
    active: true,
  },
  {
    id: 'oil-brake',
    from: 'Oil change',
    to: 'Brake inspection',
    avgDays: 142,
    customers: 1108,
    confidence: 24,
    active: false,
  },
  {
    id: 'battery-alt',
    from: 'Battery swap',
    to: 'Alternator check',
    avgDays: 31,
    customers: 96,
    confidence: 19,
    active: false,
  },
]

function PatternsDashboard() {
  return (
    <MockCard ariaLabel="Example: Anytrail's Patterns dashboard showing three recommendation patterns from an auto-repair shop's sales history.">
      <div className="mockcard__header">
        <span className="mockcard__header-title">Patterns ▾</span>
        <span className="mockcard__header-meta">17 active</span>
        <span className="mockcard__header-meta" aria-hidden="true">⋯</span>
      </div>

      <div className="mockcard__body patterns__body">
        {PATTERNS.map((p) => (
          <div
            key={p.id}
            className={`pattern ${p.active ? 'pattern--active' : ''}`.trim()}
          >
            <div className="pattern__row">
              <span
                className="pattern__dot"
                aria-hidden="true"
                data-active={p.active}
              />
              <span className="pattern__name">
                {p.from} <span className="pattern__arrow">→</span> {p.to}
              </span>
            </div>
            <div className="pattern__meta">
              avg. {p.avgDays} days · {p.customers.toLocaleString()} customers
              match · {p.confidence}% confidence
            </div>
            <div
              className="pattern__bar"
              role="presentation"
            >
              <div
                className="pattern__bar-fill"
                style={{ width: `${p.confidence * 3}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mockcard__footer patterns__footer">
        <span>
          ⊕ This pattern can become an ad campaign, a WhatsApp promo, or an
          email flow.
        </span>
        <span className="patterns__cta">Use it →</span>
      </div>
    </MockCard>
  )
}

export default PatternsDashboard
```

- [ ] **Step 2: Write `PatternsDashboard.css`.**

```css
.patterns__body {
  gap: var(--space-6);
}

.pattern {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.pattern__row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.pattern__dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--border);
  flex: 0 0 8px;
}

.pattern__dot[data-active='true'] {
  background: var(--accent);
}

.pattern__name {
  font-size: 14px;
  line-height: 20px;
  color: var(--text-strong);
  font-weight: 500;
}

.pattern--active .pattern__name {
  color: var(--text-strong);
}

.pattern__arrow {
  color: var(--text-faint);
}

.pattern__meta {
  font-size: 13px;
  line-height: 18px;
  color: var(--text-faint);
  padding-left: 20px;
}

.pattern__bar {
  position: relative;
  height: 4px;
  background: var(--surface-muted);
  border-radius: 2px;
  overflow: hidden;
  margin-left: 20px;
}

.pattern__bar-fill {
  position: absolute;
  inset: 0 auto 0 0;
  background: var(--text-faint);
  border-radius: 2px;
}

.pattern--active .pattern__bar-fill {
  background: var(--accent);
}

.patterns__footer {
  gap: var(--space-4);
}

.patterns__cta {
  color: var(--text-strong);
  font-weight: 500;
  white-space: nowrap;
}
```

- [ ] **Step 3: Run lint.**

```bash
npm run lint
```

- [ ] **Step 4: Commit.**

The component isn't wired into App.jsx yet; that happens in the next task.

```bash
git add src/components/mockups/PatternsDashboard.jsx src/components/mockups/PatternsDashboard.css
git commit -m "$(cat <<'EOF'
feat(mockup): add PatternsDashboard with auto-repair example data

Uses the shared MockCard chrome. Three patterns rendered with
confidence bars; the first is marked active with the moss accent.
Data is illustrative — replace when first pilots ship.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: Add "Learn" section and wire into App.jsx

**Files:**
- Create: `src/components/Learn.jsx`
- Create: `src/components/Learn.css`
- Modify: `src/App.jsx`

- [ ] **Step 1: Write `Learn.jsx`.**

```jsx
import Section from './Section'
import PatternsDashboard from './mockups/PatternsDashboard'
import './Learn.css'

function Learn() {
  return (
    <Section
      label="LEARN"
      title="We read your sales history and find the patterns hiding inside it."
      className="learn"
    >
      <p>
        Connect your ERP or CRM. Within minutes, Anytrail trains a model on
        every order you've ever fulfilled — who bought what, when, and what
        they bought next.
      </p>
      <PatternsDashboard />
    </Section>
  )
}

export default Learn
```

- [ ] **Step 2: Write `Learn.css`.**

The mockup needs to escape the 620px body-text max-width and span the full content width.

```css
.learn .section__body {
  max-width: none;
}

.learn .section__body p {
  max-width: 620px;
}
```

- [ ] **Step 3: Wire into `App.jsx`.**

```jsx
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import TheGap from './components/TheGap'
import Learn from './components/Learn'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TheGap />
        <Learn />
      </main>
      <Footer />
    </>
  )
}

export default App
```

- [ ] **Step 4: Verify in browser.**

Below "The gap," you should see the LEARN label, the title, the body paragraph, and the Patterns dashboard with three rows. The first pattern's dot and confidence bar are moss-green. Resize to ≤700px and check the card padding shrinks correctly.

- [ ] **Step 5: Run lint.**

```bash
npm run lint
```

- [ ] **Step 6: Commit.**

```bash
git add src/components/Learn.jsx src/components/Learn.css src/App.jsx
git commit -m "$(cat <<'EOF'
feat(learn): add Learn section with Patterns dashboard mockup

First pillar of the loop — explains the recommendation/sequence
model with a visible auto-repair example dashboard.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 11: Build the `CampaignDraft` mockup

**Files:**
- Create: `src/components/mockups/CampaignDraft.jsx`
- Create: `src/components/mockups/CampaignDraft.css`

- [ ] **Step 1: Write `CampaignDraft.jsx`.**

```jsx
import MockCard from '../MockCard'
import './CampaignDraft.css'

/* example mockup data — not real customers. Update when first pilots ship. */
const CHANNELS = [
  { label: 'Meta Ads', checked: true },
  { label: 'Google Ads', checked: true },
  { label: 'WhatsApp', checked: true },
  { label: 'Email', checked: false },
]

function CampaignDraft() {
  return (
    <MockCard ariaLabel="Example: Anytrail's Campaign draft view, built from the Brake-to-Tires pattern, with audience size, channel selection, and ad creative pre-drafted.">
      <div className="mockcard__header">
        <span className="mockcard__header-title">New campaign</span>
        <span className="mockcard__header-meta">
          · from pattern: Brake → Tires
        </span>
        <span className="mockcard__header-meta" aria-hidden="true">⋯</span>
      </div>

      <div className="mockcard__body campaign__body">
        <div className="campaign__field">
          <div className="campaign__field-label">Audience</div>
          <div className="campaign__field-value">
            412 customers · brake service in last 60–90 days
          </div>
          <div className="campaign__field-sub">
            Similar lookalikes on Meta: ~38,000
          </div>
        </div>

        <div className="campaign__field">
          <div className="campaign__field-label">Channels</div>
          <div className="campaign__channels">
            {CHANNELS.map((c) => (
              <span
                key={c.label}
                className={`campaign__channel ${c.checked ? 'campaign__channel--on' : ''}`.trim()}
              >
                <span className="campaign__channel-box" aria-hidden="true">
                  {c.checked ? '✓' : ''}
                </span>
                {c.label}
              </span>
            ))}
          </div>
        </div>

        <div className="campaign__field">
          <div className="campaign__field-label">Creative — Meta ad</div>
          <div className="campaign__ad">
            <p className="campaign__ad-copy">
              "Brakes done? Tires wear evenly when they match. Book a check."
            </p>
            <span className="campaign__ad-tag">drafted by Anytrail</span>
          </div>
        </div>

        <div className="campaign__estimate">
          Estimated spend: <strong>$480/wk</strong> · Est. reach:{' '}
          <strong>41k</strong>
        </div>
      </div>

      <div className="mockcard__footer campaign__footer">
        <span className="campaign__btn">Edit</span>
        <span className="campaign__btn campaign__btn--primary">
          Approve & launch
        </span>
      </div>
    </MockCard>
  )
}

export default CampaignDraft
```

- [ ] **Step 2: Write `CampaignDraft.css`.**

```css
.campaign__body {
  gap: var(--space-6);
}

.campaign__field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.campaign__field-label {
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-faint);
}

.campaign__field-value {
  font-size: 14px;
  line-height: 20px;
  color: var(--text-strong);
}

.campaign__field-sub {
  font-size: 13px;
  line-height: 18px;
  color: var(--text-muted);
}

.campaign__channels {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-1);
}

.campaign__channel {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 13px;
  line-height: 18px;
  color: var(--text-muted);
}

.campaign__channel--on {
  color: var(--text-strong);
}

.campaign__channel-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border-radius: 3px;
  border: 1px solid var(--border);
  background: var(--surface);
  font-size: 10px;
  color: var(--text-strong);
}

.campaign__channel--on .campaign__channel-box {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--btn-text);
}

.campaign__ad {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-4);
  background: var(--surface-muted);
  border: 1px solid var(--border);
  border-radius: 6px;
  max-width: 360px;
}

.campaign__ad-copy {
  margin: 0;
  font-family: var(--sans);
  font-size: 14px;
  line-height: 20px;
  color: var(--text-strong);
}

.campaign__ad-tag {
  font-size: 11px;
  line-height: 14px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-faint);
}

.campaign__estimate {
  font-size: 13px;
  line-height: 18px;
  color: var(--text-muted);
  padding-top: var(--space-3);
  border-top: 1px dashed var(--border);
}

.campaign__estimate strong {
  color: var(--text-strong);
  font-weight: 500;
}

.campaign__footer {
  justify-content: flex-end;
}

.campaign__btn {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  font-size: 13px;
  line-height: 1;
  border-radius: 6px;
  color: var(--text-strong);
  background: var(--surface);
  border: 1px solid var(--border);
}

.campaign__btn--primary {
  color: var(--btn-text);
  background: var(--btn-bg);
  border-color: var(--btn-bg);
}
```

- [ ] **Step 3: Run lint.**

```bash
npm run lint
```

- [ ] **Step 4: Commit.**

```bash
git add src/components/mockups/CampaignDraft.jsx src/components/mockups/CampaignDraft.css
git commit -m "$(cat <<'EOF'
feat(mockup): add CampaignDraft mockup using the Brake-to-Tires pattern

Continues the auto-repair scenario from PatternsDashboard. Shows
audience, channels (Meta + Google + WhatsApp + Email), an
agent-drafted Meta ad, and estimate. Data is illustrative.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 12: Add "Act" section and wire into App.jsx

**Files:**
- Create: `src/components/Act.jsx`
- Create: `src/components/Act.css`
- Modify: `src/App.jsx`

- [ ] **Step 1: Write `Act.jsx`.**

```jsx
import Section from './Section'
import CampaignDraft from './mockups/CampaignDraft'
import './Act.css'

function Act() {
  return (
    <Section
      label="ACT"
      title="Then it ships the campaign for you."
      className="act"
    >
      <p>
        Anytrail's agents segment your customers, write the ads, and launch the
        campaigns — on Meta, Google, WhatsApp, or email. You approve. They
        run.
      </p>
      <CampaignDraft />
    </Section>
  )
}

export default Act
```

- [ ] **Step 2: Write `Act.css`.**

```css
.act .section__body {
  max-width: none;
}

.act .section__body p {
  max-width: 620px;
}
```

- [ ] **Step 3: Wire into `App.jsx`.**

```jsx
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import TheGap from './components/TheGap'
import Learn from './components/Learn'
import Act from './components/Act'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TheGap />
        <Learn />
        <Act />
      </main>
      <Footer />
    </>
  )
}

export default App
```

- [ ] **Step 4: Verify in browser.**

Below "Learn," the Act section should show with the CampaignDraft mockup. Confirm the channel checkboxes display correctly (Meta/Google/WhatsApp checked, Email unchecked), and the "Approve & launch" button is the black-on-cream primary style.

- [ ] **Step 5: Run lint.**

```bash
npm run lint
```

- [ ] **Step 6: Commit.**

```bash
git add src/components/Act.jsx src/components/Act.css src/App.jsx
git commit -m "$(cat <<'EOF'
feat(act): add Act section with CampaignDraft mockup

Second pillar — outbound campaigns built from learned patterns,
running across Meta, Google, WhatsApp, and Email.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 13: Build the `WhatsAppConversation` mockup

**Files:**
- Create: `src/components/mockups/WhatsAppConversation.jsx`
- Create: `src/components/mockups/WhatsAppConversation.css`

- [ ] **Step 1: Write `WhatsAppConversation.jsx`.**

```jsx
import './WhatsAppConversation.css'

/* example mockup data — not real customers. Update when first pilots ship. */
const MESSAGES = [
  {
    from: 'customer',
    text: 'Got your text. Are the tires any good or just promo stuff?',
    time: '13:42',
  },
  {
    from: 'anytrail',
    text:
      "Yeah, they're the same Michelins we put on the Carrera last time you came in. Want me to book you for Saturday morning? 10:30 still your usual slot?",
    time: '13:43',
  },
  {
    from: 'customer',
    text: 'Yes please',
    time: '13:44',
  },
  {
    from: 'anytrail',
    text: 'Booked. Confirmation by email. Bringing the same car?',
    time: '13:44',
  },
]

function WhatsAppConversation() {
  return (
    <figure
      className="whatsapp"
      role="group"
      aria-label="Example: A WhatsApp conversation where Anytrail answers an auto-repair customer's question about tires and books them an appointment."
    >
      <div className="whatsapp__header">
        <span className="whatsapp__header-title">WhatsApp · Maria L.</span>
        <span className="whatsapp__header-meta" aria-hidden="true">⋯</span>
      </div>

      <div className="whatsapp__body">
        {MESSAGES.map((m, i) => {
          const showDivider =
            m.from === 'anytrail' &&
            (i === 0 || MESSAGES[i - 1].from !== 'anytrail')
          return (
            <div key={i}>
              {showDivider && (
                <div className="whatsapp__divider" aria-hidden="true">
                  <span>ANYTRAIL</span>
                </div>
              )}
              <div
                className={`whatsapp__msg whatsapp__msg--${m.from}`}
              >
                <p className="whatsapp__text">{m.text}</p>
                <span className="whatsapp__time">{m.time}</span>
              </div>
            </div>
          )
        })}
      </div>
    </figure>
  )
}

export default WhatsAppConversation
```

- [ ] **Step 2: Write `WhatsAppConversation.css`.**

```css
.whatsapp {
  margin: 0 auto;
  width: 100%;
  max-width: 360px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  font-family: var(--sans);
}

.whatsapp__header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border);
  font-size: 13px;
  line-height: 1;
  color: var(--text-strong);
}

.whatsapp__header-title {
  margin-right: auto;
  font-weight: 500;
}

.whatsapp__header-meta {
  color: var(--text-faint);
}

.whatsapp__body {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  background: var(--surface-muted);
}

.whatsapp__divider {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin: var(--space-2) 0;
  font-size: 11px;
  letter-spacing: 0.08em;
  color: var(--text-faint);
}

.whatsapp__divider::before,
.whatsapp__divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
}

.whatsapp__msg {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  max-width: 85%;
  padding: var(--space-3) var(--space-4);
  border-radius: 12px;
  font-size: 14px;
  line-height: 20px;
}

.whatsapp__msg--customer {
  align-self: flex-end;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text-strong);
}

.whatsapp__msg--anytrail {
  align-self: flex-start;
  background: var(--accent-soft);
  border: 1px solid var(--accent-soft);
  color: var(--text-strong);
}

.whatsapp__text {
  margin: 0;
}

.whatsapp__time {
  align-self: flex-end;
  font-size: 11px;
  color: var(--text-faint);
}
```

- [ ] **Step 3: Run lint.**

```bash
npm run lint
```

- [ ] **Step 4: Commit.**

```bash
git add src/components/mockups/WhatsAppConversation.jsx src/components/mockups/WhatsAppConversation.css
git commit -m "$(cat <<'EOF'
feat(mockup): add WhatsAppConversation continuing the auto-repair thread

Phone-shaped narrow card, max-width 360px, centered. Customer
bubbles right-aligned in white, Anytrail bubbles left-aligned in
the accent-soft tint with an ANYTRAIL divider. Data illustrative.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 14: Add "Respond" section and wire into App.jsx

**Files:**
- Create: `src/components/Respond.jsx`
- Create: `src/components/Respond.css`
- Modify: `src/App.jsx`

- [ ] **Step 1: Write `Respond.jsx`.**

```jsx
import Section from './Section'
import WhatsAppConversation from './mockups/WhatsAppConversation'
import './Respond.css'

function Respond() {
  return (
    <Section
      label="RESPOND"
      title="And answers every customer who replies."
      className="respond"
    >
      <p>
        The same agent that runs the campaign handles the replies — on
        WhatsApp, Instagram DM, or email. It knows your products, your prices,
        and what each customer bought before. It books, recommends, or hands
        off — your call.
      </p>
      <WhatsAppConversation />
    </Section>
  )
}

export default Respond
```

- [ ] **Step 2: Write `Respond.css`.**

```css
.respond .section__body {
  max-width: none;
}

.respond .section__body p {
  max-width: 620px;
}
```

- [ ] **Step 3: Wire into `App.jsx`.**

```jsx
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import TheGap from './components/TheGap'
import Learn from './components/Learn'
import Act from './components/Act'
import Respond from './components/Respond'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TheGap />
        <Learn />
        <Act />
        <Respond />
      </main>
      <Footer />
    </>
  )
}

export default App
```

- [ ] **Step 4: Verify in browser.**

Respond section appears below Act with the WhatsApp mockup centered. Check that the bubble colors look right — accent-soft tint for Anytrail bubbles, white for customer.

- [ ] **Step 5: Run lint.**

```bash
npm run lint
```

- [ ] **Step 6: Commit.**

```bash
git add src/components/Respond.jsx src/components/Respond.css src/App.jsx
git commit -m "$(cat <<'EOF'
feat(respond): add Respond section with WhatsApp conversation mockup

Third pillar — the inbound agent. Continues the same auto-repair
character thread for narrative continuity across all three mockups.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 15: Add "Plugs into" section and wire into App.jsx

**Files:**
- Create: `src/components/PlugsInto.jsx`
- Create: `src/components/PlugsInto.css`
- Modify: `src/App.jsx`

- [ ] **Step 1: Write `PlugsInto.jsx`.**

The Section has no title (just label + body), so we pass `title=""`.

```jsx
import Section from './Section'
import './PlugsInto.css'

const ROWS = [
  {
    label: 'Sales history',
    items: ['SAP', 'Odoo', 'NetSuite', 'QuickBooks', 'HubSpot', 'Salesforce'],
  },
  {
    label: 'Ad channels',
    items: ['Meta', 'Google'],
  },
  {
    label: 'Conversations',
    items: ['WhatsApp', 'Instagram', 'Gmail', 'Outlook'],
  },
]

function PlugsInto() {
  return (
    <Section
      label="PLUGS INTO WHAT YOU ALREADY USE"
      className="plugsinto"
    >
      <p>
        Anytrail reads from your ERP or CRM, runs campaigns through your ad
        accounts, and replies through your existing inbox. No new tools to
        learn, no data migration, no rip-and-replace.
      </p>

      <div className="plugsinto__rows">
        {ROWS.map((row) => (
          <div key={row.label} className="plugsinto__row">
            <div className="plugsinto__row-label">{row.label}</div>
            <div className="plugsinto__row-items">
              {row.items.map((item, i) => (
                <span key={item}>
                  {item}
                  {i < row.items.length - 1 && (
                    <span className="plugsinto__sep" aria-hidden="true">
                      ·
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

export default PlugsInto
```

- [ ] **Step 2: Write `PlugsInto.css`.**

```css
.plugsinto .section__body {
  max-width: none;
}

.plugsinto .section__body p {
  max-width: 620px;
}

.plugsinto__rows {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-top: var(--space-4);
  border-top: 1px solid var(--border);
}

.plugsinto__row {
  display: grid;
  grid-template-columns: 180px 1fr;
  align-items: baseline;
  gap: var(--space-6);
  padding: var(--space-6) 0;
  border-bottom: 1px solid var(--border);
}

.plugsinto__row-label {
  font-size: 13px;
  line-height: 18px;
  color: var(--text-strong);
  font-weight: 500;
}

.plugsinto__row-items {
  font-size: 14px;
  line-height: 22px;
  color: var(--text-faint);
}

.plugsinto__sep {
  margin: 0 var(--space-2);
}

@media (max-width: 700px) {
  .plugsinto__row {
    grid-template-columns: 1fr;
    gap: var(--space-2);
    padding: var(--space-4) 0;
  }
}
```

- [ ] **Step 3: Wire into `App.jsx`.**

```jsx
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import TheGap from './components/TheGap'
import Learn from './components/Learn'
import Act from './components/Act'
import Respond from './components/Respond'
import PlugsInto from './components/PlugsInto'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TheGap />
        <Learn />
        <Act />
        <Respond />
        <PlugsInto />
      </main>
      <Footer />
    </>
  )
}

export default App
```

- [ ] **Step 4: Verify in browser.**

Below Respond, three rows should appear with the integration wordmarks in grayscale.

- [ ] **Step 5: Run lint.**

```bash
npm run lint
```

- [ ] **Step 6: Commit.**

```bash
git add src/components/PlugsInto.jsx src/components/PlugsInto.css src/App.jsx
git commit -m "$(cat <<'EOF'
feat(plugsinto): add integration row section (ERP/CRM, ads, conversations)

Three rows mirror the three pillars (Learn / Act / Respond) and
quietly answer the integration question. Logos render as text
wordmarks until real assets land.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 16: Add `ClosingCTA` section and wire into App.jsx

**Files:**
- Create: `src/components/ClosingCTA.jsx`
- Create: `src/components/ClosingCTA.css`
- Modify: `src/App.jsx`

ClosingCTA does not use the `Section` wrapper because it needs centered alignment and a different type scale.

- [ ] **Step 1: Write `ClosingCTA.jsx`.**

```jsx
import { DEMO_URL } from '../config'
import './ClosingCTA.css'

function ClosingCTA() {
  return (
    <section className="closingcta">
      <div className="closingcta__inner">
        <h2 className="closingcta__title">
          The same loop. Built for the size you are.
        </h2>
        <p className="closingcta__body">
          30-minute demo. We'll show you the patterns hiding in your own sales
          data — using your data, not a fake account.
        </p>
        <a className="closingcta__cta" href={DEMO_URL}>
          Book a demo
        </a>
      </div>
    </section>
  )
}

export default ClosingCTA
```

- [ ] **Step 2: Write `ClosingCTA.css`.**

```css
.closingcta {
  padding: var(--section-pad-y) 16px;
  text-align: center;
}

.closingcta__inner {
  max-width: 620px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

.closingcta__title {
  margin: 0;
  font-family: var(--display);
  font-weight: 400;
  font-size: 30px;
  line-height: 36px;
  letter-spacing: -0.6px;
  color: var(--text-strong);
}

.closingcta__body {
  margin: 0;
  font-family: var(--sans);
  font-size: 15px;
  line-height: 22.5px;
  color: var(--text-muted);
}

.closingcta__cta {
  display: inline-flex;
  align-items: center;
  margin-top: var(--space-2);
  font-size: 13px;
  line-height: 1;
  color: var(--btn-text);
  background-color: var(--btn-bg);
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 6px;
  transition: background-color 0.2s ease-out;
}

.closingcta__cta:hover {
  background-color: var(--btn-bg-hover);
}

@media (max-width: 700px) {
  .closingcta {
    padding: var(--section-pad-y-mobile) 16px;
  }
}
```

- [ ] **Step 3: Wire into `App.jsx`.**

```jsx
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import TheGap from './components/TheGap'
import Learn from './components/Learn'
import Act from './components/Act'
import Respond from './components/Respond'
import PlugsInto from './components/PlugsInto'
import ClosingCTA from './components/ClosingCTA'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TheGap />
        <Learn />
        <Act />
        <Respond />
        <PlugsInto />
        <ClosingCTA />
      </main>
      <Footer />
    </>
  )
}

export default App
```

- [ ] **Step 4: Verify in browser.**

Closing CTA appears between PlugsInto and Footer, centered, with the headline + body + black "Book a demo" button.

- [ ] **Step 5: Run lint.**

```bash
npm run lint
```

- [ ] **Step 6: Commit.**

```bash
git add src/components/ClosingCTA.jsx src/components/ClosingCTA.css src/App.jsx
git commit -m "$(cat <<'EOF'
feat(closing): add centered closing CTA section

Final conversion beat: 30-minute demo with your own data, single
black CTA reading DEMO_URL.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 17: Update `index.html` SEO meta

The existing title/meta describes only the inbound agent. Update to reflect the broader three-pillar positioning.

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Update the relevant lines in `index.html`.**

Replace this block:

```html
    <title>Anytrail — AI sales agents for your business</title>
    <meta
      name="description"
      content="Anytrail builds AI sales agents that reply to your customers 24/7 and become experts in your business in one click — answering questions and recommending the right next step."
    />

    <!-- Open Graph / social. Set OG_URL to your production domain after first deploy. -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Anytrail — AI sales agents for your business" />
    <meta
      property="og:description"
      content="AI sales agents that reply 24/7 and become experts in your business in one click."
    />
    <meta property="og:image" content="/hero.jpg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Anytrail — AI sales agents for your business" />
    <meta
      name="twitter:description"
      content="AI sales agents that reply 24/7 and become experts in your business in one click."
    />
    <meta name="twitter:image" content="/hero.jpg" />
```

With:

```html
    <title>Anytrail — Big-company sales intelligence for any SMB</title>
    <meta
      name="description"
      content="Anytrail learns from your sales history, finds the patterns big competitors hire data teams to spot, and turns them into ads, emails, and replies — automatically."
    />

    <!-- Open Graph / social. Set OG_URL to your production domain after first deploy. -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Anytrail — Big-company sales intelligence for any SMB" />
    <meta
      property="og:description"
      content="Recommendation models, campaign agents, and inbound sales agents — the sales loop big retailers run, sized for businesses up to $10M."
    />
    <meta property="og:image" content="/hero.jpg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Anytrail — Big-company sales intelligence for any SMB" />
    <meta
      name="twitter:description"
      content="Recommendation models, campaign agents, and inbound sales agents — the sales loop big retailers run, sized for businesses up to $10M."
    />
    <meta name="twitter:image" content="/hero.jpg" />
```

- [ ] **Step 2: Verify in browser.**

Open dev tools → Elements → check the `<title>` element shows the new title. Reload the tab; the browser tab text should update.

- [ ] **Step 3: Run lint.**

```bash
npm run lint
```

- [ ] **Step 4: Commit.**

```bash
git add index.html
git commit -m "$(cat <<'EOF'
chore(seo): align title and meta with three-pillar positioning

Old copy described only the inbound agent; the page now tells the
full Learn/Act/Respond story, so the title and social-share meta
should too.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 18: Update README, run final build, verify

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Update the "Project structure" block in `README.md`.**

Find this block:

```
src/
  components/
    Navbar.jsx / .css   Fixed top navbar: logo + "Join waitlist" CTA
    Hero.jsx   / .css   Hero: title → image → description + CTA
  App.jsx               Page composition
  index.css             Global styles + design tokens (CSS variables)
  main.jsx              React entry point
```

Replace with:

```
src/
  components/
    Navbar.jsx / .css      Fixed top navbar: logo + "Book a demo" CTA
    Hero.jsx   / .css      Hero: title → image → description + CTA
    Section.jsx / .css     Shared section wrapper (label + h2 + body)
    MockCard.jsx / .css    Shared white-card chrome for product mockups
    TheGap.jsx / .css      "The loop" copy section
    Learn.jsx  / .css      Learn pillar — uses PatternsDashboard
    Act.jsx    / .css      Act pillar — uses CampaignDraft
    Respond.jsx / .css     Respond pillar — uses WhatsAppConversation
    PlugsInto.jsx / .css   Integrations rows
    ClosingCTA.jsx / .css  Centered final CTA
    Footer.jsx / .css      Minimal footer
    mockups/
      PatternsDashboard.jsx / .css     Patterns dashboard mockup
      CampaignDraft.jsx / .css         Campaign draft mockup
      WhatsAppConversation.jsx / .css  WhatsApp conversation mockup
  config.js               DEMO_URL constant (single source of truth for the demo CTA)
  App.jsx                 Page composition
  index.css               Global styles + design tokens (CSS variables)
  main.jsx                React entry point
```

- [ ] **Step 2: Also update the "Design tokens" block in `README.md`.**

Find:

```
- `--page-bg` — page background (`#fefdf6`)
- `--display` / `--sans` — font stacks
- `--btn-bg` / `--btn-text` — button colors (black on light)
- `--text`, `--nav-text` — text colors
```

Replace with:

```
- `--page-bg` — page background (`#fefdf6`)
- `--surface`, `--surface-muted`, `--border` — white card chrome on cream
- `--display` / `--sans` — font stacks
- `--btn-bg` / `--btn-text` — button colors (black on light)
- `--text-strong`, `--text-muted`, `--text-faint` — three-step text scale
- `--accent`, `--accent-soft` — single moss-green accent for "active signal" inside mockups
- `--space-1` … `--space-32` — numeric spacing scale
- `--section-pad-y`, `--section-pad-y-mobile`, `--content-max` — section rhythm
```

- [ ] **Step 3: Run the full verification pass.**

```bash
npm run lint
npm run build
```

`lint` must pass with no new warnings. `build` must succeed and output to `dist/`. Open http://localhost:5173 once more and scroll the full page:

- Navbar with "Book a demo" CTA
- Hero with new two-line headline + new subtitle + "Book a demo" CTA
- The gap section with copy
- Learn section with Patterns dashboard
- Act section with Campaign draft
- Respond section with WhatsApp conversation
- Plugs into section with three integration rows
- Closing CTA centered with black button
- Footer

Resize to ≤700px and confirm:
- All sections respect the mobile padding
- Patterns and Campaign mockups reduce internal padding
- Plugs-into rows stack vertically (label above items, not beside)
- WhatsApp mockup stays at 360px max-width

- [ ] **Step 4: Commit.**

```bash
git add README.md
git commit -m "$(cat <<'EOF'
docs(readme): update project structure and tokens for new sections

Lists all new components and the expanded design-token surface
introduced by the landing content expansion.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Definition of done

- All 9 page sections render at http://localhost:5173.
- All three CTAs (Navbar, Hero, ClosingCTA) point to `DEMO_URL` from `src/config.js`.
- All three product mockups carry the `example mockup data — not real customers` annotation.
- All three product mockups have a `<figure role="group" aria-label="…">` wrapper.
- `npm run lint` passes with no new warnings.
- `npm run build` succeeds.
- Page renders correctly at desktop and ≤700px mobile viewports.
- `README.md` lists the new components and token surface.
- `index.html` title and meta describe the three-pillar positioning.
