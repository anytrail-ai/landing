# Quote demo: catalogue → sales chat → auto-quote → supplier price requests

Date: 2026-09-24 · Status: approved design, pre-plan · Deadline: live for the 2026-09-25 demo

## Goal

A public, unlisted landing page (`/quote_demo`) that shows, end to end in a few minutes:

1. A visitor uploads a supplier catalogue (PDF or pasted text), or uses the sample one.
2. A WhatsApp-style chat where an AI salesperson, grounded ONLY in that catalogue, qualifies
   the visitor (who plays the customer) one question at a time.
3. A quote is auto-generated from the conversation: every line priced from the catalogue by
   code, never by the model.
4. Every line whose product has no price in the catalogue, or matches nothing in it, opens a
   pop-up with an auto-drafted email to the supplier asking for the price. Sending it emails
   the supplier for real, and a reminder is re-sent on a short cadence until the supplier
   answers via a link in the email. The answer lands in the quote on screen.

Success = the presenter can run all three paths (all priced / priced-missing / no-match) live
tomorrow and watch a supplier email + reminder arrive and the quote update after answering.

Out of scope: lead-crm (the CRM part of the demo uses what is already live), auth, real
tenants, persistence beyond a TTL, a PDF of the quote, multi-currency conversion.

## Assumptions (said, or chosen as defaults)

- Surface is landing + `demo-backend` only (user choice). No lead-crm change.
- Catalogue: visitor-supplied (PDF or text); otherwise one synthetic catalogue, generated ONCE
  and committed as seed JSON so every run is identical (user choice).
- Emails go to a real address typed in the pop-up, via the existing Resend sender (user choice).
- Supplier answers through a link in the email (user choice), not by replying.
- UI and generated emails are Spanish (Mexican industrial-supplier audience, same as the sample
  catalogue). Copy lives in one object so an English pass is cheap later.
- One pop-up / one email per quote covering ALL missing lines, not one email per line: the
  supplier fills every price on one page, and reminders stop when all are answered.

## Architecture

Everything reuses `demo-backend` patterns; no new AWS service.

```
browser /quote_demo ──POST (SSE)──▶ ChatFn Function URL   action: catalog | quote_chat | quote
                    ──JSON───────▶ ApiFn  /demo/quote/*    get quote, send price request,
                                                           supplier get/answer
EventBridge rate(1 min) ─────────▶ QuoteReminderFn         re-send due price-request reminders
browser /supplier_price?t=… ─JSON▶ ApiFn  /demo/quote/price-request (GET, POST)
```

Why the Function URL for catalogue parse, chat and quote: API Gateway hard-caps at 30 s and a
PDF extraction or two-call quote can exceed it. `stream-handler.ts` already dispatches on an
`action` enum with a 5-minute timeout; the new actions join it.

### Data (single DynamoDB table, all rows with `expiresAt` TTL = 7 days)

| Key | Holds |
|---|---|
| `QCAT#<catalogId>` / `META` | `{ supplier, supplierEmail?, currency, items: CatalogItem[] }` |
| `QSESS#<sessionId>` / `META` | `{ catalogId, userMessages }` |
| `QUOTE#<quoteId>` / `META` | `{ sessionId, catalogId, lines: QuoteLine[], priceRequestId? }` |
| `QPR#<token>` / `META` | price request: `{ quoteId, to, subject, body, items, status, remindersSent, nextReminderAt }` |
| `QPR_PENDING` / `<token>` | index row, present only while pending; the sweep Queries this one partition |

`CatalogItem = { id, sku?, name, description?, priceCents: number | null, currency }`.
`QuoteLine = { itemId | null, query, name, sku?, qty, unitCents | null, status: 'priced' | 'unpriced' | 'no_match' }`.

The token is 32 random bytes, base64url. It is both the key and the capability in the email
link: unguessable, so no separate HMAC is needed.

### Catalogue ingest (`action: 'catalog'`)

- Input: `{ pdfBase64 }` (≤ 4 MB decoded, Bedrock document-block limit) or `{ text }` (≤ 200 KB).
- PDF goes to Bedrock Converse as a `document` block; text as a text block. One prompt returns
  `{ supplier, supplierEmail, currency, items[] }`, zod-validated, capped at 200 items. A price
  the document does not state is `null`, never guessed. The prompt says so, and a code check
  drops any non-integer / negative cents to `null`.
- `{ sample: true }` loads `src/quote/sample-catalog.json` (committed, ~40 items, ~4 with
  `priceCents: null`) without calling Bedrock.
- Returns `{ catalogId, supplier, items }` for the side panel.

### Chat (`action: 'quote_chat'`)

Reuses `runChatTurn`'s shape with a new system prompt built from the catalogue (item names,
SKUs, descriptions; prices included so the agent can talk about them, but "never state a price
that is not in the catalogue; if a price is missing, say you will confirm it with the
supplier"). Qualifying cadence is ported from `buildSystemText`. When the customer agrees to a
quote the agent ends its turn with the literal marker `[[COTIZAR]]`; the client strips it and
auto-runs the quote. A "Generar cotización" button does the same at any time. Cap: 20 user
messages per session.

Sample conversations: three one-click scripts that prefill the customer's messages (all
match / one unpriced item / one product not in the catalogue), keyed to the sample catalogue.

### Quote (`action: 'quote'`)

Ports lead-crm's `quote-suggest` doctrine (decide in code, not in the prompt):

1. Extract: conversation → `[{ query, qty }]` (qty 1..999, query ≤ 200 chars).
2. Shortlist: per query, top 8 catalogue items by token overlap on name/SKU/description (pure
   function, no model).
3. Pick: model sees `query` + numbered candidates (name + SKU only, no prices) and returns a
   candidate index or null. Out-of-range indices are DISCARDED, never clamped.
4. Code attaches the price: `priced` if `priceCents != null`, `unpriced` if matched with null
   price, `no_match` if no pick.
5. If any line is not `priced`, one more call drafts the supplier email (subject + body,
   Spanish, lists each missing product + qty). Template fallback if the call fails, so the
   pop-up always opens.

Returns `{ quoteId, lines, totalCents, currency, draft? }` and stores the quote.

### Price request (`POST /demo/quote/price-request/send`)

Body `{ quoteId, to, subject, body }`. Validates the email, rate-limits (bucket `qpr`,
10 sends/IP/day), writes `QPR#` + `QPR_PENDING`, sends immediately via Resend with the answer
link `https://www.anytrail.ai/supplier_price?t=<token>` appended, plus a team BCC. Sets
`nextReminderAt = now + 3 min`.

### Reminders (`QuoteReminderFn`, EventBridge `rate(1 minute)`)

Queries `QPR_PENDING`; for each due row (`now ≥ nextReminderAt`, `remindersSent < 5`) sends
"Recordatorio: …" with the same link, increments, sets the next time. At 5 it stops and marks
`status: 'expired'`. Pure `dueQuoteReminders(rows, now)` for tests. Cadence and cap live in
`LIMITS`. Separate rule from the booking reminders, whose 15-minute rate is load-bearing.

### Supplier page (`/supplier_price?t=…`)

`GET /demo/quote/price-request?t=` returns the items (name, SKU, qty) and the requester label,
never the email body or other quotes. `POST` with `{ t, prices: [{ lineIndex, unitCents }] }`
(integers ≥ 0) sets them, marks `answered`, deletes the `QPR_PENDING` row, and writes the
prices back into the quote lines AND the catalogue items (so the next quote on this catalogue
is priced). Second submission → 409 `already_answered`.

### Quote refresh

While a request is pending, the quote card polls `GET /demo/quote/<quoteId>` every 5 s and
re-renders; answered lines flip to priced and the total recalculates, with a visible
"Precio recibido del proveedor" badge. The pop-up's sent state shows the reminder count.

## Frontend

- `src/pages/QuoteDemo.jsx` + `.css`: three stages in one screen: catalogue step, then a
  two-column layout with a WhatsApp-styled phone chat (green header, bubbles, ticks) and a side
  panel with the catalogue and quote card. Pop-up = modal dialog with editable To / Asunto /
  Cuerpo and "Enviar".
- `src/pages/SupplierPrice.jsx`: a minimal form, one price input per item.
- `quoteDemoApi.js`: reuses `streamRequest`/`post` from `demoApi.js` (export them).
- Routes `quoteDemo: '/quote_demo'`, `supplierPrice: '/supplier_price'` added to `ROUTES` and
  `NOINDEX_PAGES`.
- No emojis; icons are inline SVG (landing has no icon library).

## Abuse / safety

A public page that emails arbitrary addresses is a spam relay, so: per-IP send cap (10/day),
reminder cap (5), catalogue parse cap (20/IP/day), quote cap (60/IP/day), chat cap per session,
`DEMO_OUTBOUND=disabled` kills all sends (existing `outboundFetch`), team BCC on every send,
page is `noindex` and unlinked. The email body is visitor-editable, so it is rendered as
escaped plain text inside the branded shell, never as HTML.

## Error handling

Fail-soft into visible states, never a silent empty: catalogue parse failure → "No pudimos
leer el catálogo" + "usar el de ejemplo"; zero extracted lines → quote card says so; Resend
failure → pop-up shows the error and stays open; reminder send failure logs and retries on the
next sweep without incrementing.

## Testing

Vitest in `demo-backend`: shortlist scoring, pick index bounds (out-of-range discarded), line
status split, catalogue price sanitising, `dueQuoteReminders` window + cap, price-answer
validation (ints ≥ 0, already-answered 409), email escaping of the editable body. Frontend: one
vitest for the `[[COTIZAR]]` marker strip. Then one real run against the deployed stack:
sample catalogue → each sample conversation → send to a real inbox → receive a reminder →
answer → quote updates.

## Delivery

Branch `miguel/quote-demo` off landing `origin/main` (worktree `~/anytrail/landing-quote-demo`),
PR → CI → merge → `deploy.yml` (CDK) + Vercel. Booth-board PR #20 is independent.
