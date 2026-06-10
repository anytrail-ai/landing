# Landing Page Content Expansion — Design Spec

**Date:** 2026-06-10
**Status:** Approved through brainstorming; pending user review of this written spec.

## Purpose

Expand the Anytrail landing page (currently a Navbar + Hero only) into a full single-page narrative that positions the product as a **sales companion for SMBs running online ad campaigns**. The page must tell the three-pillar story — recommendation models, outbound campaign agents, inbound sales agents — as one continuous loop, illustrated with product mockups in lieu of real customer proof.

## Audience

- **ICP:** SMBs up to ~$10M revenue, English-first, global. Sell products or services. Run ad campaigns on Meta and/or Google. Use WhatsApp, Email/SMS as customer-conversation channels.
- **Buyer persona:** founder/owner-operator OR sole/lean marketing manager. The page must work for both — leads with founder-style ROI framing, but stays specific enough that a marketer believes the craft.
- **What the buyer needs to leave the page believing:** "This product runs the recommendation-and-action loop big retailers have, on data I already have, on channels I already use."

## Positioning

**Headline:** "Big-company sales intelligence. Built for your business."

**Thesis:** Big companies sell more not because they have better products — because they close the loop between knowing and doing. The loop is **Learn → Act → Respond**. Most SMBs can't afford a data team + a marketing team + an ops team. Anytrail is all three, as agents.

**Three pillars (the loop):**

1. **Learn** — recommendation/sequence models trained on the customer's ERP or CRM. Finds patterns like "customers who buy X buy Y a week later." Also produces clustering segmentation.
2. **Act** — outbound campaign agents that turn patterns + segments into Meta Ads, Google Ads, WhatsApp promos, or emails. User approves; agents run.
3. **Respond** — inbound sales agent that handles replies on WhatsApp, Instagram DM, Email — knows products, prices, and customer history.

**Integrations in scope:**
- Sales history: SAP, Odoo, NetSuite, QuickBooks, HubSpot, Salesforce (illustrative — final list set when integrations ship)
- Ad channels: Meta, Google
- Conversations: WhatsApp, Instagram, Gmail, Outlook

**Not in scope for this page:** TikTok, pricing, FAQ, team/about, analytics, A/B test framework, i18n, CMS.

## Page architecture

Single-page React SPA. Top to bottom:

| # | Section | Component | Status |
|---|---------|-----------|--------|
| 1 | Navbar | `Navbar` | Edit — CTA text change only |
| 2 | Hero | `Hero` | Edit — copy + CTA |
| 3 | The gap | `TheGap` | New |
| 4 | Learn | `Learn` (uses `PatternsDashboard`) | New |
| 5 | Act | `Act` (uses `CampaignDraft`) | New |
| 6 | Respond | `Respond` (uses `WhatsAppConversation`) | New |
| 7 | Plugs into | `PlugsInto` | New |
| 8 | Closing CTA | `ClosingCTA` | New |
| 9 | Footer | `Footer` | New |

Two shared utility components support the above:
- `Section` — shared section wrapper (label + h2 title + body slot).
- `MockCard` — shared white-on-cream card chrome for the Patterns + Campaign mockups.

## Design system additions

The current tokens in `src/index.css` (`--page-bg`, `--text`, `--display`, `--sans`, button colors) stay unchanged. Added:

```css
/* Surfaces */
--surface:        #ffffff;
--surface-muted:  #f6f4ea;
--border:         #e7e2d1;
--border-strong:  #1f1f1f;

/* Text scale */
--text-strong:    #111827;   /* = existing --text */
--text-muted:     #6b7280;   /* promoted from inline use in Hero.css */
--text-faint:     #9ca3af;

/* Accent — single accent for "active signal" inside mockups */
--accent:         #2f6f4f;   /* deep moss */
--accent-soft:    #e8f0eb;

/* Spacing scale */
--space-1:  4px;
--space-2:  8px;
--space-3:  12px;
--space-4:  16px;
--space-6:  24px;
--space-8:  32px;
--space-12: 48px;
--space-16: 64px;
--space-24: 96px;
--space-32: 128px;

/* Section rhythm */
--section-pad-y:        96px;
--section-pad-y-mobile: 64px;
--content-max:          929px;   /* matches existing Hero width */
```

**Rationale highlights:**
- One accent (deep moss `#2f6f4f`) is enough to mark "this is the signal" in mockups; avoids brand-color fatigue.
- White surfaces on cream page are a tested premium pattern; mockups feel like real product without breaking warmth.
- Spacing tokens stay numeric for legibility while tuning.
- `--content-max: 929px` matches existing `Hero.css` width — keeps the single-column document feel.

**Unchanged:** type system (Funnel Display / Funnel Sans / Montserrat), Hero type scale (30/36 display, 15/22.5 body), black CTA buttons, cream `--page-bg`.

## Section copy and mockups

### Section 1 — Navbar (edit only)

CTA text: `Join waitlist` → `Book a demo`. CTA href reads from the new `DEMO_URL` constant. No layout change.

### Section 2 — Hero (edit only)

Copy:

> **Big-company sales intelligence.
> Built for your business.**
>
> Anytrail learns from your sales history, finds the patterns big competitors hire data teams to spot, and turns them into ads, emails, and replies — automatically.
>
> [Book a demo]

Keeps the existing `hero.jpg` (team over laptops) — human warmth precedes the data sections. CTA changes from `Join waitlist` to `Book a demo`, href from `#waitlist` to `DEMO_URL`. The inline `color: #6b7280` on `.hero__subtitle` in `Hero.css` is replaced with `var(--text-muted)` as part of token promotion.

### Section 3 — The gap

Copy-only section, no mockup. Uses `Section` wrapper with label `THE LOOP`.

> Big companies don't sell more because they have better products. They sell more because they close the loop between knowing and doing.
>
> Amazon, Mercado Libre, Sephora — every recommendation, every email, every ad you see from them is the output of one loop: learn what each customer wants, act on it across every channel, respond when they reply.
>
> The loop needs a data team to build the models, a marketing team to launch the campaigns, and an ops team to handle the replies. Most businesses can't afford all three. Anytrail is all three.

### Section 4 — Learn

Uses `Section` wrapper with label `LEARN`. Title: "We read your sales history and find the patterns hiding inside it." Body:

> Connect your ERP or CRM. Within minutes, Anytrail trains a model on every order you've ever fulfilled — who bought what, when, and what they bought next.

Then renders `<PatternsDashboard />`.

**Mockup — `PatternsDashboard`:** white `MockCard` showing a dashboard with three example patterns from an auto-repair shop's sales history:

1. **Brake service → Tires** (active/highlighted with moss accent dot): avg. 87 days · 412 customers match · 31% confidence
2. Oil change → Brake inspection: avg. 142 days · 1,108 customers match · 24%
3. Battery swap → Alternator check: avg. 31 days · 96 customers match · 19%

Each row has a horizontal confidence bar (CSS div, width %). Footer of card: "This pattern can become an ad campaign, a WhatsApp promo, or an email flow. → Use it". Header of card: "Patterns ▾  17 active   ⋯".

In-code annotation `{/* example mockup data — not real customers */}` at top of mockup component file.

### Section 5 — Act

Uses `Section` wrapper with label `ACT`. Title: "Then it ships the campaign for you." Body:

> Anytrail's agents segment your customers, write the ads, and launch the campaigns — on Meta, Google, WhatsApp, or email. You approve. They run.

Then renders `<CampaignDraft />`.

**Mockup — `CampaignDraft`:** white `MockCard` showing a draft campaign created from the "Brake → Tires" pattern:

- Header: "New campaign · from pattern: Brake → Tires"
- Audience: "412 customers · brake service in last 60–90 days" + "Similar lookalikes on Meta: ~38,000"
- Channels: checkboxes — Meta Ads ✓, Google Ads ✓, WhatsApp ✓, Email □
- Creative — Meta ad: a short ad copy block with "drafted by Anytrail" tag — *"Brakes done? Tires wear evenly when they match. Book a check."*
- Estimated spend: $480/wk · Est. reach: 41k
- Footer: `[Edit] [Approve & launch]` buttons (non-functional, visual only).

### Section 6 — Respond

Uses `Section` wrapper with label `RESPOND`. Title: "And answers every customer who replies." Body:

> The same agent that runs the campaign handles the replies — on WhatsApp, Instagram DM, or email. It knows your products, your prices, and what each customer bought before. It books, recommends, or hands off — your call.

Then renders `<WhatsAppConversation />`.

**Mockup — `WhatsAppConversation`:** phone-shaped narrow card (max-width ~360px, centered) showing a WhatsApp conversation with "Maria L." continuing the auto-repair scenario:

- Customer: "Got your text. Are the tires any good or just promo stuff?"
- Anytrail (marked with subtle "ANYTRAIL" divider): "Yeah, they're the same Michelins we put on the Carrera last time you came in. Want me to book you for Saturday morning? 10:30 still your usual slot?"
- Customer: "Yes please"
- Anytrail: "Booked. Confirmation by email. Bringing the same car?"

Same `example mockup data` annotation as the other two mockups.

### Section 7 — Plugs into

Uses `Section` wrapper with label `PLUGS INTO WHAT YOU ALREADY USE`. No h2 title — body directly:

> Anytrail reads from your ERP or CRM, runs campaigns through your ad accounts, and replies through your existing inbox. No new tools to learn, no data migration, no rip-and-replace.

Then three rows, each: small label on left, grayscale logo wordmarks on right, hairline divider between rows.

- Sales history — SAP · Odoo · NetSuite · QuickBooks · HubSpot · Salesforce
- Ad channels — Meta · Google
- Conversations — WhatsApp · Instagram · Gmail · Outlook

Logos render as text wordmarks for now (no real logo assets). Replace with real wordmarks/SVG when integrations ship.

### Section 8 — Closing CTA

Centered. No `Section` wrapper (centered alignment is unique to this section).

> **The same loop. Built for the size you are.**
>
> 30-minute demo. We'll show you the patterns hiding in your own sales data — using your data, not a fake account.
>
> [Book a demo]

CTA reads from `DEMO_URL`.

### Section 9 — Footer

Minimal — one line:

> anytrail
> Big-company sales intelligence, for any SMB. © 2026 Anytrail

No navigation menu. Logo is Montserrat 300 matching the navbar. Tagline is `--text-faint`.

## Implementation principles

- **No animation library, no icon library.** Unicode characters for the few glyphs (`▾ ⋯ ●`). CSS transitions only.
- **No SVG charts.** Confidence bars are `<div>`s with `width: %`. Themeable via tokens.
- **No new images.** Three dashboard mockups are pure DOM.
- **No new fonts, no new deps.**
- **No router, no state, no data fetching.** SPA but single-page. Page has no state.

## CTAs

A single `DEMO_URL` constant in `src/config.js` is the source of truth for the three demo-booking CTAs (Navbar, Hero, ClosingCTA). Initial value is a placeholder (`https://cal.com/anytrail/demo`); user replaces with real URL post-implementation.

## Responsive behavior

- Existing breakpoint `@media (max-width: 700px)` stays as the mobile threshold.
- Section padding scales: desktop `--section-pad-y` (96px), mobile `--section-pad-y-mobile` (64px).
- `PatternsDashboard` and `CampaignDraft` reduce internal type ~2px and horizontal padding to 12px on mobile.
- `WhatsAppConversation` stays the same width on mobile (already narrow at ~360px).

## Accessibility

- **Headings:** Hero `<h1>` (existing). Each new section's title is `<h2>`. No `<h3>`.
- **Mockups:** wrapped in `<figure role="group" aria-label="…">` with a single short summary label. Screen readers don't have to parse the dashboard chrome.
- **CTAs:** real `<a>` tags with descriptive visible labels (no `Click here`).
- **Color contrast:** moss-green `#2f6f4f` accent on `#fefdf6` background meets WCAG AA at body sizes. Not used below 12px.

## Risks

1. **Scenario dependence.** The auto-repair scenario carries the whole page. If you don't have auto-repair pilots, the page reads as fictional. Mitigated with `example` annotations, the `aria-label` summary, and the "demo using your data" closer. Swap as soon as you have a real customer.
2. **More visual product than the current page sets up.** Three dashboard mockups is a meaningful shift toward product-page feel. Order of cuts if you change your mind: Campaign mockup first (most product-y), then Patterns (most central — keep), then WhatsApp (cheapest to ship).
3. **CTAs are 4× `Book a demo`.** No alternative conversion path. Intentional but worth watching post-launch — if demo bookings are low, a lower-friction "watch demo" link is the natural next experiment.

## Explicitly out of scope (YAGNI)

- Analytics integration (Plausible / Posthog / etc.)
- A/B testing framework
- CMS for marketing copy edits
- Internationalization
- Internal nav scroll anchors
- SEO sitemap beyond what `vercel.json` already provides
- Pricing section
- FAQ
- Team / about
- Hero animation
- Social proof carousels

## Definition of done

- All 9 sections render at the existing dev URL (`npm run dev`, port 5173).
- All three CTAs (Navbar, Hero, ClosingCTA) link to `DEMO_URL` from `config.js`.
- `npm run lint` passes with no new warnings.
- `npm run build` succeeds.
- Page renders correctly at both desktop and mobile (≤700px) viewports.
- All mockups carry the `example mockup data — not real customers` annotation.
- All mockups have a `<figure role="group" aria-label="…">` wrapper.
- README's "Project structure" section updated to list the new components.
