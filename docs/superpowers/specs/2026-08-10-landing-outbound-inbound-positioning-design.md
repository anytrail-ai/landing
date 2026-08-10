# Landing repositioning — outbound + inbound, one agent

**Date:** 2026-08-10
**Scope:** `src/i18n/copy.js` (EN + ES), `src/components/Problem.jsx` + `.css`, `src/components/HowItWorks.jsx` + `.css`

## Why

Anytrail now runs both GTM motions in production: outbound (sources net-new accounts, scores the existing base, writes and sends on WhatsApp / email / LinkedIn, and hands a prepared queue to reps) and inbound (answers inquiries from WhatsApp, ads, and the website). The landing page still reads as an inbound product — outbound survives only in subordinate clauses ("or a buying signal points at an account").

The page is being repositioned so outbound is a named, equal half, without splitting the story into two products.

## Positioning spine

> Demand leaks in two places: the accounts you never found, and the inquiries you answered too late. Anytrail closes both — with one agent that knows your catalog.

Catalog knowledge is the hinge and the explicit reason-to-believe. The thing that lets the agent diagnose an incoming inquiry is the same thing that lets it write a cold message worth answering, and the same thing that lets it survive the technical reply. Generic GTM platforms have data and agents but no idea what the customer sells.

## Decisions taken

| Decision | Choice |
|---|---|
| Vertical | Stays. Industrial equipment manufacturers and distributors. |
| Vocabulary | Steal the structure of agentic-GTM messaging, not the vocabulary. No "agentic", "go-to-market", "vibe GTM". The buyer is a plant manager or distributor owner, often reading Spanish. |
| Architecture | Keep the six sections. Promote outbound inside each, rather than adding an outbound section. |
| Hero headline | Unchanged. The subtitle carries both motions. |
| Proof | Stays inbound-only. Outbound is described in How It Works but never claimed as proven. The dollar figure gets explicitly attributed to inbound conversations. |
| Thank-you page | Mystery-shop promise kept verbatim. Only the "inbound process" wording becomes "commercial process". |
| Second mockup | Out of scope. The existing inbound WhatsApp thread stays as the only conversation visual. |

Related fix folded in: EN CTA says "Review my inbound process" while ES says "Revisa mi proceso de ventas". Both become "commercial process" / "proceso comercial".

## Component changes

### `Problem.jsx` — grouped leaks

`copy.problem.leaks` (flat array) becomes `copy.problem.groups`:

```js
groups: [ { label: string, leaks: [{ title, body }] } ]
```

Render each group as a labelled block: a `<h3 className="problem__group-label">` followed by the existing `ul.problem__grid` of cards. Card titles demote from `h3` to `h4` to keep heading order legal. `Problem.css` gains `.problem__group` (block spacing) and `.problem__group-label` (small caps treatment, matching the existing `Section` label styling).

### `HowItWorks.jsx` — two entries, one shared path

`copy.how.steps` (flat array of 6) splits into three fields:

```js
entriesLabel: string
entries: [{ title, body }]   // 2 items — unnumbered, parallel
sharedLabel: string
steps:   [{ title, body }]   // 5 items — numbered 1–5
```

Render `entriesLabel`, then `entries` as a two-up `ul.how__entries` of unnumbered cards (they are alternatives, not sequence), then `sharedLabel`, then the existing numbered `ol.how__steps` over the 5 shared steps. The visual convergence — two parallel cards feeding one numbered column — is the positioning rendered, and is the reason this change is in scope rather than a copy-only edit.

`HowItWorks.css` gains `.how__entries`, `.how__entry`, and a shared `.how__group-label`. Two-up collapses to stacked at the existing mobile breakpoint.

No change to `prerender.js` — it consumes `meta` only, which keeps its shape.

## Final copy

### EN

**meta.description**
> Anytrail works demand in both directions for manufacturers and industrial distributors — surfacing the accounts that are about to buy, reaching out on WhatsApp, email, and LinkedIn, and answering every inbound inquiry with AI sales agents trained on your product catalog: diagnosing the application, preparing quotes, and following up.

**hero.title** — unchanged: *AI sales agents trained on what your industrial company actually sells.*

**hero.subtitle**
> Anytrail works demand in both directions — finding the accounts that are about to buy and answering every inquiry the moment it lands. Same agent, same catalog knowledge: it diagnoses the application, collects what's needed to quote, and follows up until your sales team steps in.

**hero.cta** → `Review my commercial process`

**hero.ctaNote**
> For manufacturers, distributors, and industrial equipment companies. Outbound on WhatsApp, email, and LinkedIn. Inbound from WhatsApp, ads, and your website. Both handled the way your best salesperson would.

**problem.title / problem.intro** — unchanged.

**problem.groups**

*Demand you never found*
- **No view of who is in market** — Every account looks the same in the CRM, so the team works whoever shouted loudest instead of who is actually ready to buy.
- **Your own customer base goes cold** — Plants that bought two years ago, lines that expanded, equipment due for replacement — nobody ever went back to ask.

*Demand you answered too late*
- **Slow first response** — An interested buyer writes in, waits, and buys from whoever answers first.
- **Incomplete information** — Quotes stall because nobody collected the application details, power supply, or usage before pricing.
- **Forgotten follow-up** — A lead goes quiet, the salesperson moves on, and the opportunity dies without a decision.

**how.title**
> Two ways an opportunity starts. One way it gets worked.

**how.intro**
> Anytrail runs your commercial process, step by step, whether the opportunity came to you or you went and found it. Your team keeps control of pricing, technical recommendations, quotes, and the final sale.

**how.entriesLabel** → `How the opportunity starts`

**how.entries**
- **Anytrail finds it** — It surfaces accounts that match what you sell — net-new companies in your market and customers already in your base worth going back to — then opens the conversation on WhatsApp, email, or LinkedIn.
- **The opportunity finds you** — An inquiry lands from WhatsApp, an ad, or your website. Anytrail answers immediately, at any hour, instead of leaving it until Monday.

**how.sharedLabel** → `Then the same path, every time`

**how.steps** — the five existing steps, bodies unchanged: Diagnosis, Recommendation, Quote preparation, Follow-up, Sales team handoff.

**different.title**
> Not a chatbot. Not a database. Not a sequence tool. Part of your sales operation.

**different.intro**
> Anytrail learns what you sell, asks your team's qualification questions, and works each opportunity through a real sales process — in both directions. It knows when to keep the conversation going and when your salespeople should take over.

**different.comparisons** — the three existing entries, plus, inserted third:
- **An outbound or sequence tool** — Sends the message and stops there. Anyone can send the message — almost nobody can answer the reply when a plant manager asks which model handles their duty cycle.

**proof.p1** — one word added for honest attribution:
> Anytrail was built and runs inside the sales process of an industrial equipment company — from the first contact through diagnosis, product recommendation, quotation, and follow-up. Last month alone, **inbound** conversations handled by the agent contributed to more than $20,000 USD in equipment sold.

**closing.title / closing.body** — unchanged (the body already says "finds and responds"). **closing.cta** → `Review my commercial process`

**whatsapp.prefill**
> Hi, I'd like to see how Anytrail could work our opportunities — inbound and outbound.

**thanks.meta.description** → `Your commercial process review is booked.` Body and title unchanged.

**footer.tagline** — unchanged.

### ES

**meta.description**
> Anytrail trabaja la demanda en ambas direcciones para fabricantes y distribuidores industriales — detecta las cuentas que están por comprar, las contacta por WhatsApp, correo y LinkedIn, y responde cada consulta entrante con agentes de IA entrenados en tu catálogo: diagnostica la aplicación, prepara cotizaciones y da seguimiento.

**hero.title** — unchanged.

**hero.subtitle**
> Anytrail trabaja la demanda en ambas direcciones — encuentra las cuentas que están por comprar y responde cada consulta en el momento en que llega. El mismo agente, el mismo conocimiento de tu catálogo: diagnostica la aplicación, reúne los datos para cotizar y da seguimiento hasta que tu equipo de ventas entra.

**hero.cta** → `Revisa mi proceso comercial`

**hero.ctaNote**
> Para fabricantes, distribuidores y empresas de equipo industrial. Prospección por WhatsApp, correo y LinkedIn. Consultas entrantes de WhatsApp, anuncios y tu sitio web. Ambas atendidas como lo haría tu mejor vendedor.

**problem.groups**

*Demanda que nunca encontraste*
- **Sin visibilidad de quién está en mercado** — body unchanged.
- **Tu propia cartera se enfría** — Plantas que compraron hace dos años, líneas que crecieron, equipo que ya toca reemplazar — nadie volvió a preguntar.

*Demanda que respondiste demasiado tarde*
- **Respuesta lenta**, **Información incompleta**, **Seguimiento olvidado** — bodies unchanged.

**how.title**
> Dos formas de que empiece una oportunidad. Una sola forma de trabajarla.

**how.intro**
> Anytrail lleva tu proceso comercial, paso a paso, ya sea que la oportunidad haya llegado sola o que la hayas salido a buscar. Tu equipo mantiene el control de precios, recomendaciones técnicas, cotizaciones y la venta final.

**how.entriesLabel** → `Cómo empieza la oportunidad`

**how.entries**
- **Anytrail la encuentra** — Detecta cuentas que embonan con lo que vendes — empresas nuevas en tu mercado y clientes que ya están en tu cartera y vale la pena retomar — y abre la conversación por WhatsApp, correo o LinkedIn.
- **La oportunidad te encuentra** — Llega una consulta por WhatsApp, un anuncio o tu sitio web. Anytrail responde de inmediato, a cualquier hora, en lugar de dejarla para el lunes.

**how.sharedLabel** → `Después, el mismo camino, siempre`

**how.steps** — the five existing steps, bodies unchanged.

**different.title**
> No es un chatbot. No es una base de datos. No es una herramienta de secuencias. Es parte de tu operación de ventas.

**different.intro**
> Anytrail aprende lo que vendes, hace las preguntas de calificación de tu equipo y trabaja cada oportunidad dentro de un proceso de ventas real — en ambas direcciones. Sabe cuándo seguir la conversación y cuándo deben entrar tus vendedores.

**different.comparisons** — plus, inserted third:
- **Una herramienta de prospección o secuencias** — Manda el mensaje y ahí se queda. Cualquiera puede mandar el mensaje — casi nadie puede contestar la respuesta cuando un jefe de planta pregunta qué modelo aguanta su ciclo de trabajo.

**proof.p1** — `las conversaciones entrantes atendidas por el agente contribuyeron a más de $400,000 MXN en equipo vendido.`

**closing.cta** → `Revisa mi proceso comercial`

**whatsapp.prefill**
> Hola, quiero ver cómo Anytrail podría trabajar nuestras oportunidades — entrantes y de prospección.

**thanks.meta.description** → `Tu revisión del proceso comercial está agendada.`

## Verification

- `npm run build` succeeds and `npm run lint` is clean.
- Both locales render at `/`, `/es`, `/thanks`, `/es/gracias` with no missing-key crashes — every renamed field (`leaks`→`groups`, `steps`→`entries`+`steps`) is updated in both locales and both components.
- Prerendered HTML in `dist/` contains the new meta descriptions for both locales.
- Problem and How It Works render correctly at mobile width with groups stacked.
- Heading order stays legal in both restructured sections (no `h2` → `h4` jumps).

## Out of scope

- A second WhatsApp mockup showing an outbound-initiated conversation. Worth revisiting once outbound has proof numbers.
- Outbound metrics in Proof. Add when they exist.
- Any change to the vertical, the visual design system, or the routing/i18n machinery.
