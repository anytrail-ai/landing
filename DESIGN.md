---
name: Anytrail
description: A warm-paper document system for industrial sales software - cream stock, hairline rules, ink-black actions, and one green stamp for what the agent has confirmed.
colors:
  bond-cream: "#fefdf6"
  card-white: "#ffffff"
  paper-tint: "#f6f4ea"
  hairline-warm: "#e7e2d1"
  ink: "#000000"
  ink-soft: "#1f1f1f"
  ink-text: "#111827"
  graphite: "#6b7280"
  ash: "#9ca3af"
  signal-moss: "#2f6f4f"
  moss-soft: "#e8f0eb"
typography:
  display:
    fontFamily: "Funnel Display, Funnel Sans, system-ui, sans-serif"
    fontSize: "38px"
    fontWeight: 400
    lineHeight: "44px"
    letterSpacing: "-0.8px"
  headline:
    fontFamily: "Funnel Display, Funnel Sans, system-ui, sans-serif"
    fontSize: "34px"
    fontWeight: 400
    lineHeight: "40px"
    letterSpacing: "-0.6px"
  title:
    fontFamily: "Funnel Display, Funnel Sans, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: "30px"
    letterSpacing: "-0.4px"
  body:
    fontFamily: "Funnel Sans, system-ui, Segoe UI, Roboto, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: "22.5px"
    letterSpacing: "normal"
  body-sm:
    fontFamily: "Funnel Sans, system-ui, Segoe UI, Roboto, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "21px"
    letterSpacing: "normal"
  caption:
    fontFamily: "Funnel Sans, system-ui, Segoe UI, Roboto, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: "18px"
    letterSpacing: "normal"
  label:
    fontFamily: "Funnel Sans, system-ui, Segoe UI, Roboto, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "16px"
    letterSpacing: "0.08em"
  wordmark:
    fontFamily: "Montserrat, Funnel Sans, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 300
    lineHeight: 1
    letterSpacing: "0.01em"
  wordmark-sm:
    fontFamily: "Montserrat, Funnel Sans, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 300
    lineHeight: 1
    letterSpacing: "0.01em"
rounded:
  sm: "6px"
  md: "12px"
  lg: "16px"
  pill: "999px"
  full: "50%"
spacing:
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  6: "24px"
  8: "32px"
  12: "48px"
  16: "64px"
components:
  button-page:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.card-white}"
    rounded: "{rounded.sm}"
    padding: "10px 16px"
    typography: "{typography.body-sm}"
  button-page-hover:
    backgroundColor: "{colors.ink-soft}"
  button-chrome:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.card-white}"
    rounded: "{rounded.pill}"
    padding: "9px 16px"
    typography: "{typography.body}"
  button-chrome-hover:
    backgroundColor: "{colors.ink-soft}"
  button-on-dark:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.ink-text}"
    rounded: "{rounded.sm}"
    padding: "10px 16px"
    typography: "{typography.body-sm}"
  button-on-dark-hover:
    backgroundColor: "{colors.paper-tint}"
  card:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.ink-text}"
    rounded: "{rounded.md}"
    padding: "16px 24px"
  status-chip:
    backgroundColor: "{colors.moss-soft}"
    textColor: "{colors.signal-moss}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
    typography: "{typography.label}"
  step-number:
    backgroundColor: "{colors.moss-soft}"
    textColor: "{colors.signal-moss}"
    rounded: "{rounded.full}"
    height: "28px"
    width: "28px"
  lang-toggle-active:
    backgroundColor: "rgba(17, 24, 39, 0.06)"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "7px 8px"
---

# Design System: Anytrail

## Overview

**Creative North Star: "The Quote Sheet"**

Anytrail sells to people who spend their day inside documents: quotations, spec sheets, purchase orders, WhatsApp threads with a plant. The interface borrows that world rather than the world of software. The page is warm paper stock, not a white app canvas. Content sits in ruled fields separated by hairlines, not in floating panels. Actions are ink. And one green stamp marks what the agent has confirmed, the way a receiving clerk marks a line item as checked.

The register is quiet, exact, and unhurried. Restraint is not modesty here; it is the argument. A buyer evaluating whether to trust an AI agent with their inbound line is reading for competence, and competence in this market looks like precision and plainness, not enthusiasm. Type stays modest (the largest heading on the site is 38px, and the hero opens at 34px). Color is almost entirely absent. Nothing moves unless something actually arrived. The page earns attention by being obviously made by someone who has done the job, not by performing excitement about the technology.

The confirmed anti-reference is the SaaS startup landing page: gradient meshes, glowing violet, floating 3D geometry, oversized display type, animated blobs, dark-mode-by-default. None of it belongs. If a treatment would look at home on a Series A launch page, it is wrong here regardless of how well it is executed.

**Key Characteristics:**
- Warm cream field (`#fefdf6`), never pure white as the page background
- Hairline separation (1px `#e7e2d1`) doing the work shadows usually do
- One accent, moss green, restricted to confirmed-state signal
- Ink-black actions against warm paper: the system's only high-contrast moment
- Modest display type, tight negative tracking, no oversized hero
- Flat by default; exactly one element is permitted to float
- Bilingual EN/ES with identical structure, so no layout may depend on English string length

## Colors

A near-monochrome warm-paper palette with a single green reserved for signal, so that the one moment of color always means something.

### Primary

- **Ink** (`#000000`): Pure black, reserved exclusively for action surfaces (button fills). It is the strongest contrast in the system and it appears only where the visitor is meant to click. Never used for body text.
- **Ink Soft** (`#1f1f1f`): The hover state under Ink. A settle, not a jump.

### Secondary

- **Signal Moss** (`#2f6f4f`): The stamp. Marks state the agent has established: completed qualification steps, the live-channel dot, numbered process markers, and the agent's own voice in the conversation mockup. Its scarcity is the entire reason it reads as meaningful.
- **Moss Soft** (`#e8f0eb`): The tint that carries Signal Moss at small sizes: chip fills, step-number discs, agent message bubbles. Always paired with Signal Moss as its foreground.

### Neutral

- **Bond Cream** (`#fefdf6`): The page field. Warm, slightly yellow, and the reason the interface reads as paper rather than as an app. Also the `theme-color` for browser chrome.
- **Card White** (`#ffffff`): Pure white, used only for raised content: cards, mockup shells, customer message bubbles. The contrast against Bond Cream is what defines a surface, since shadows do not.
- **Paper Tint** (`#f6f4ea`): The recessed tone. Conversation backgrounds and the hover state of buttons that sit on dark imagery.
- **Hairline Warm** (`#e7e2d1`): Every border, divider, connector line, and rule in the system. Warm rather than grey so it reads as printed rule, not as a UI stroke.
- **Ink Text** (`#111827`): All primary text. Near-black with a blue cast, softer than Ink and never confused with it.
- **Graphite** (`#6b7280`): Secondary text: body copy under headings, card bodies, descriptions. The default reading colour for anything that is not a heading.
- **Ash** (`#9ca3af`): Tertiary text: section labels, timestamps, footnotes, the CTA note, footer tagline, inactive language toggle. The quietest legible step.

### Named Rules

**The Stamp Rule.** Signal Moss appears only where the agent has confirmed or is doing something: a completed qualification step, a live channel, a numbered stage, the agent's own message. It is never decoration, never a brand flourish, never a heading colour, and never a link colour. If a green element cannot answer "what did the agent confirm here?", it should be neutral.

**The Two Blacks Rule.** Pure `#000000` is for buttons. Text is `#111827`. They are never swapped. Text that reaches pure black reads as a mistake in this system, and a button that softens to `#111827` loses the one hard edge the page has.

**The Warm Line Rule.** Borders are `#e7e2d1`, never a grey. A cool-grey hairline on cream instantly reads as a generic component library and breaks the paper illusion.

## Typography

**Display Font:** Funnel Display (falls back to Funnel Sans, then system-ui)
**Body Font:** Funnel Sans (falls back to system-ui, Segoe UI, Roboto)
**Wordmark Font:** Montserrat Light (300), used only for the "Anytrail" wordmark in the navbar and footer

**Character:** Funnel Display is a low-contrast geometric with generous apertures; at weight 400 with negative tracking it reads composed rather than promotional. The pairing is deliberately close, Display and Sans being siblings, so hierarchy comes from size and colour rather than from a font clash. Montserrat's Light weight in the wordmark is the one place the system permits a different voice, and it is doing identity work, not typographic work.

### Hierarchy

- **Display** (400, 38px/44px, -0.8px): Standalone page titles where there is no competing content. Currently only the confirmation page. Drops to 30px/36px below 640px.
- **Headline** (400, 34px/40px, -0.6px): The hero H1, the page's opening statement. Drops to 28px/34px below 820px. The closing CTA title is this role rendered on dark imagery at 30px/36px.
- **Title** (400, 24px/30px, -0.4px): Section H2s. Deliberately modest. Sections are separated by whitespace and labels, not by large type.
- **Body** (400, 15px/22.5px, Graphite): Section intros, hero subtitle, closing CTA body. The default prose size.
- **Body Small** (400, 14px/21px, Graphite): Card bodies, step descriptions, comparison bodies, message text. The dense reading size inside components.
- **Caption** (400, 13px/18px, Ash): CTA notes, footer tagline, mockup headers.
- **Label** (400, 12px/16px, 0.08em, uppercase, Ash): Section labels ("THE PROBLEM", "HOW IT WORKS"), group labels, status headings. The system's structural signage.
- **Card Title** (600, 15px/22px, Ink Text): The one place weight rather than size creates hierarchy. Used for card and step titles.
- **Wordmark** (Montserrat 300, 19px, 0.01em): The navbar lockup. Identity, not hierarchy, which is why it sits outside the Display/Sans ramp.
- **Wordmark Small** (Montserrat 300, 16px, 0.01em): The same lockup in the footer. The footer is a sign-off rather than a landing, so the wordmark steps down instead of repeating the navbar at full size.

### Named Rules

**The 620 Rule.** Section titles and body copy cap at 620px regardless of container width. Grids and mockups may span the full 929px column, but nothing anyone has to read line-by-line ever does. The hero subtitle caps tighter still, at 460px.

**The Modest Display Rule.** No type on this site exceeds 38px. If a layout seems to need a larger heading, the layout is wrong, not the scale. Emphasis comes from whitespace, label, and position.

**The Two-Language Rule.** Spanish runs 15-25% longer than English. Headings, buttons, labels, and chips must hold their layout at that length without reflowing into a different composition. Never set type at a size that only works because the English string happens to be short.

## Layout

A single centered column, 929px maximum (`--content-max`), with a 16px gutter at every breakpoint. The hero shares that width but splits into an asymmetric two-up grid: fluid copy on the left, a fixed 400px maximum media column on the right.

Vertical rhythm is carried by one value: sections pad 96px top and bottom (`--section-pad-y`), tightening to 64px below 700px (`--section-pad-y-mobile`). Inside a section, the label, title, and body stack at 24px. The confirmation page is the one deliberate exception, padding to 1.5x section rhythm to leave a short message alone on the screen.

Spacing uses a numeric scale of 4, 8, 12, 16, 24, 32, 48, 64px. Steps are chosen by role, not by eye: 8px binds a label to its content, 16px separates cards in a grid, 24px separates blocks inside a section, 48-64px separates major regions.

The navbar sits outside this system: a fixed floating inset pinned 0.75rem from the top, centered on a narrower 672px column, and never closer than 0.75rem to the viewport edge.

**Breakpoints** (the observed set, ad hoc by intent, each tied to a specific composition failing):
- **820px**: hero collapses to a single column; the five-step grid goes 3-up to 2-up
- **700px**: section padding tightens; all two- and three-up card grids collapse to single column
- **640px**: confirmation page type steps down
- **540px**: the step grid goes single-column and steps flip to a horizontal number-beside-text layout

Grids are `repeat(N, minmax(0, 1fr))` throughout, so long unbroken Spanish words cannot force horizontal overflow.

## Elevation & Depth

The system is flat. Depth comes from tonal layering (Card White lifting off Bond Cream, Paper Tint recessing below it) and from 1px warm hairlines. There is no shadow vocabulary for content, and there should not be one: on a paper field, a drop shadow is the fastest way to make the page look like a template.

Exactly one element is permitted to float, and it earns it functionally: the navbar, once scrolled, becomes a translucent liquid-glass pill so content can pass beneath it without collision. Its treatment is elaborate on purpose, a 12px backdrop blur over 70% cream, a warm translucent border, and a four-layer shadow whose top three layers are white light rather than dark shade, producing a rim-lit edge instead of a cast shadow.

### Shadow Vocabulary

- **Mockup lift** (`box-shadow: 0 1px 2px rgba(17, 24, 39, 0.04)`): A single, nearly invisible hairline of shade under the conversation mockup. It separates a white card from a white-adjacent field. This is the maximum shadow any content element may carry.
- **Chrome glass** (`box-shadow: rgba(255,255,255,0.12) 0 -0.66px 3.3px -0.17px, rgba(255,255,255,0.23) 0 -2.5px 12.6px -0.33px, rgba(255,255,255,0.72) 0 -11px 55px -0.5px, rgba(17,24,39,0.06) 0 2px 12px`): The scrolled navbar only. Not a reusable token.

### Named Rules

**The Float Rule.** A shadow is permission to float, and only chrome may float. Cards, mockups, sections, and images sit flat on the page and are separated by hairlines and tone. If a new component wants a shadow, it either belongs in the fixed chrome layer or it does not need one.

## Shapes

Corners scale with the size and altitude of the element. Small in-content actions take 6px, cards and message bubbles take 12px, large containers (the mockup shell, the closing CTA card) take 16px, and anything circular (step numbers, the live-channel dot) is a true 50%.

Borders are always exactly 1px `#e7e2d1`, with two deliberate exceptions: the comparison list uses a 2px left rule as a hanging indent instead of a box, and the WhatsApp link underlines itself with a 1px `currentColor` bottom border so it reads as a typographic link rather than a button.

Two recurring geometries define the system. The **hairline connector**: a 1px rule running between step numbers across a row, drawn with `::after` and suppressed at row ends and on the final step, turning a grid into a diagram. The **hanging rule**: a 2px left border with 16px of padding, used where cards would over-contain the content.

### Named Rules

**The Altitude Rule.** If it floats above the page, it is a pill (999px). If it sits in the content column, it is a soft rect (6px). The navbar CTA and the confirmation-page button are pills because they belong to chrome; the hero and closing CTAs are rects because they belong to the page. This is the rule, not drift, and mixing the two breaks the signal that chrome and content are different layers.

**The Full-Round Rule.** 999px is reserved for chrome buttons, status chips, and the language toggle: elements that are either floating or are labels-as-objects. Content containers never round past 16px.

## Components

### Buttons

- **Shape:** Two shapes governed by The Altitude Rule. Soft rect (6px) in content, full pill (999px) in chrome.
- **Page primary** (hero, closing CTA): Ink fill, Card White text, 14px/1, 10px 16px padding, `inline-flex` with `align-self: flex-start` so it hugs its label rather than stretching.
- **Chrome primary** (navbar): Ink fill, Card White text, 15px/1, 9px 16px padding, pill. The confirmation-page variant is the same pill at 12px 20px.
- **On-dark** (closing CTA over imagery): Card White fill, Ink Text label, hovering to Paper Tint. The inverse of the page primary, used only over the dark image overlay.
- **Hover:** Background only, `background-color 0.2s ease-out`. Ink to Ink Soft. No lift, no scale, no shadow, no colour change on the label.
- **Focus:** `2px solid` Signal Moss at 2px offset, the one place the accent serves a non-signal purpose. On dark imagery the ring switches to white at the same weight.

### Cards

- **Corner Style:** 12px
- **Background:** Card White on the Bond Cream field
- **Shadow Strategy:** None. Separation is the 1px Hairline Warm border plus the tonal step off cream. See The Float Rule.
- **Border:** 1px Hairline Warm
- **Internal Padding:** 16px vertical, 24px horizontal, an asymmetry that keeps short titles from looking stranded
- **Content:** A 600-weight 15px title over a 14px Graphite body, gapped 8px

### Chips

- **Style:** Moss Soft fill, Signal Moss text, 999px, 4px 10px, 12px/16px at weight 500, with a 12px inline check SVG
- **State:** Present-only. A chip exists because a step is complete; there is no unselected or pending variant. Under The Stamp Rule, a chip is a claim that something was confirmed.

### Navigation

- **Style:** Fixed floating inset, 52px tall, transparent and borderless at rest, transitioning over 0.4s `cubic-bezier(0.16, 1, 0.3, 1)` into the liquid-glass pill on scroll. The easing is a decelerating settle, not a linear fade.
- **Contents:** Logo mark (28px) plus Montserrat Light wordmark on the left, then a language toggle and the CTA pushed right by `margin-right: auto` on the logo.
- **Language toggle:** Two 12px 500-weight buttons at 0.04em tracking. Inactive is Ash; active takes Ink and a `rgba(17,24,39,0.06)` pill wash. This is the only translucent-black surface in the system.
- **Interaction:** The container is `pointer-events: none` with `pointer-events: auto` restored on the inner pill, so the inset gutter never intercepts clicks meant for the page.

### Text Link

- **Style:** 14px Ash with a 1px `currentColor` bottom border and 2px of padding beneath it, hovering to Ink Text. Deliberately not a button, so a secondary channel never competes with the primary CTA.
- **On dark:** `rgba(255,255,255,0.85)`, hovering to pure white.

### Conversation Mockup (signature component)

The product's central demonstration and the only place the system shows motion.

- **Shell:** 400px max, Card White, 16px radius, 1px Hairline Warm, `overflow: hidden`, carrying the single sanctioned mockup lift shadow.
- **Three bands:** a 13px header with an 8px Signal Moss dot for the live channel; a Paper Tint conversation body; a status footer, each divided by a hairline.
- **Message bubbles:** 12px radius, 88% max width, 14px/20px. The customer is Card White with a hairline border, aligned right. The agent is Moss Soft, borderless, aligned left. The agent is the only voice that carries colour.
- **Motion:** Rows and status chips fade up 6px over 0.45s `ease-out`, staggered 0.35s per index via a `--i` custom property. The stagger is the point: it reads as a conversation arriving, not as a page animating in.
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` removes the animation entirely rather than shortening it.
- **Accessibility:** The whole figure carries a descriptive `aria-label` narrating what the agent accomplished, because the mockup is an argument and not decoration.

## Do's and Don'ts

### Do:

- **Do** put every new colour through The Stamp Rule first. If it is not Bond Cream, Card White, Paper Tint, Hairline Warm, one of the three text steps, Ink, or the moss pair, it needs a reason that survives the question "what did the agent confirm here?"
- **Do** separate surfaces with a 1px `#e7e2d1` hairline and a tonal step. That is the system's entire depth vocabulary for content.
- **Do** cap anything readable at 620px, and the hero subtitle at 460px.
- **Do** use `repeat(N, minmax(0, 1fr))` for every grid, so long Spanish compounds cannot overflow.
- **Do** design and check both languages at once. A component is not done until the Spanish string holds the layout.
- **Do** follow The Altitude Rule for any new button: pill if it floats, 6px rect if it lives in the content column.
- **Do** keep hover feedback to a background-colour change over 0.2s `ease-out`.
- **Do** give focus a 2px Signal Moss ring at 2px offset (white on dark imagery).
- **Do** gate any new animation behind `prefers-reduced-motion` and remove it entirely, not merely shorten it.
- **Do** describe meaningful mockups with an `aria-label` that states what happened, not what is shown.

### Don't:

- **Don't** add a shadow to content. Only chrome floats.
- **Don't** set body text in pure black or fill a button with `#111827`. The two blacks have separate jobs.
- **Don't** use grey borders. Warm `#e7e2d1` is what makes the page read as paper.
- **Don't** exceed 38px on any heading, or reach for a large hero display size to create emphasis.
- **Don't** use Signal Moss for links, headings, brand accents, or hover states. Its scarcity is its function.
- **Don't** introduce a second accent hue, a gradient background, a dark mode, or a glow. The confirmed anti-reference is the SaaS startup landing page.
- **Don't** animate anything that is not literally arriving. Motion in this system means a message came in.
- **Don't** stretch buttons to full width. They hug their label via `align-self: flex-start`.
- **Don't** revive `--border-strong`, `--nav-text`, `--space-24`, or `--space-32`. They are declared in `src/index.css` but unused; they are residue, not system.
- **Don't** let a layout depend on English string length, and don't ship a component in one language only.
