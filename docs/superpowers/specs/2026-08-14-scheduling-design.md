# Self-hosted scheduling, book first, demo second

**Date:** 2026-08-14
**Scope:** `demo-backend/src/schedule/*`, `demo-backend/lib/api-stack.ts`, `src/pages/Schedule.jsx` + `.css`, `src/components/CtaLink.jsx`, `src/i18n/copy.js`, `src/config.js`, `prerender.js`
**Linear:** ANY-66 (re-scoped), ANY-69, ANY-70, ANY-54, ANY-76

## Why

The funnel inverts. Until now the landing page's CTA pointed at a Google Appointment Schedule, and the demo at `/demo` was an unlinked orphan. The new order is:

> landing CTA "Review my commercial process" -> book a call -> `/thanks` offers the demo

Booking is the front door; the demo is what fills the wait between booking and call. That makes the demo a reason to stay engaged rather than a competing door, and it means the CTA copy finally matches its destination.

No Calendly, no Cal.com, no third-party scheduler. We build it, on the infrastructure `demo-backend` already has.

## Decisions taken

| Decision | Choice |
|---|---|
| Availability | Fixed weekly hours. **No busy-checking against a real calendar** , the founder is always available for customer calls. |
| Meeting medium | One permanent video-room URL in config, carried by every confirmation and invite. |
| v1 scope | Booking, cancel/reschedule, **and** reminders. Closes ANY-70 in the same pass. |
| Where it lives | `demo-backend`. It already owns the DynamoDB table, Resend, the Slack webhook, IP rate limiting, and the outbound-fetch chokepoint. |
| Slot storage | None. Slots are computed; only bookings are rows. |
| Date math | Server-side only. The landing repo has no test runner, so the untestable half stays dumb. |

## Configuration

Lives in one place, `demo-backend/src/schedule/config.ts`, the way `limits.ts` centralises caps:

```
timezone      America/New_York
hours         Mon-Fri 09:00-17:00
slot          30 minutes
leadTime      2 hours
horizon       14 days
meetUrl       process.env.MEET_URL
```

Hours are defined in **New York time**; every visitor sees them converted to their own zone (see Timezones below). `MEET_URL` is `https://meet.google.com/kzk-tpgh-sbm`, set on the Lambdas in `api-stack.ts` beside `EMAIL_SENDER`. Changing hours is a config edit and a redeploy, never a code change.

The room link is permanent and reusable, so anyone who has ever booked keeps a working door into it. That is the accepted trade for having no calendar integration; if it becomes a problem the fix is a per-booking link, which needs the Google Calendar API this design deliberately avoids.

## Data model

Single table, existing `keys` convention in `src/db.ts`:

```
BOOKINGDAY#<yyyy-mm-dd>  / SLOT#<hh:mm>   the booking
EMAIL#<lowercased email> / ACTIVE         guard, points at that booking
```

The date partition is in the host timezone, so a day query returns that day's bookings. `slotStartUtc` is stored as an attribute; the key is human-readable for debugging, the attribute is the truth.

Booking attributes: `slotStartUtc`, `name`, `email`, `website`, `note`, `lang`, `remindedT24`, `remindedT1`, `createdAt`, `ip`.

Two consequences fall out of this key shape for free:

- **Double-booking is impossible.** A booking is a `PutItem` with `attribute_not_exists(pk)`, the same conditional-write trick `api/rate-limit.ts` uses. Two people clicking 14:30 at once: one wins, the other gets 409 and a refreshed grid.
- **The reminder sweep is a query, not a scan.** Today plus tomorrow is two `Query` calls. No GSI.

**The email guard exists because the day partition cannot be searched by email.** Enforcing one active booking per person needs its own row, so the two go in together as a `TransactWriteItems` of two conditional puts , slot free *and* no active booking for that address, or neither is written. Without the transaction a crash between the two writes would leave a booking nobody can find or a guard blocking a booking that does not exist.

Cancel deletes both rows, which reopens the slot. Reschedule transacts the new slot in **first** (with the guard repointed), then deletes the old row , a race can lose the reschedule, never the booking.

## Timezones

The failure mode this design exists to avoid: slots that smear across a DST boundary, or a visitor who books 9am and arrives at 8am.

- Slots are generated in `America/New_York` from the config above.
- They cross the wire and land in DynamoDB as UTC instants.
- The page renders them in the visitor's local zone via `Intl.DateTimeFormat`, with the zone named explicitly ("2:30 PM CST").

A visitor in Madrid and one in Monterrey see the same instant, each labelled correctly, and neither is asked to do arithmetic. DST transitions are handled by generating in New York time rather than by adding a fixed offset , the US and Mexico no longer change clocks on the same dates, so a hardcoded offset would be wrong for weeks of every year.

## API

Four routes on the existing HTTP API, added to the router in `src/api/handler.ts`. All go through `assertWithinRateLimit`.

```
GET  /schedule/slots?days=14      open slots as UTC instants
POST /schedule/book               zod-validated -> conditional put -> emails + Slack
GET  /schedule/manage?b=&s=       signed link, returns the booking
POST /schedule/cancel | /move     re-verifies the signature, then acts
```

Open slots = generated , booked , past , inside lead time.

The manage link carries the slot id plus an HMAC signature over it, secret in Secrets Manager beside the Resend key. No lookup row, and a guessed URL cannot cancel someone else's call. Every mutating route re-verifies the signature; possession of the link is the only proof of ownership.

## On booking

Three sends, all fire-and-forget in the style of `notifySignup`. **A Slack outage must never fail a booking.**

1. **Visitor** , branded confirmation in the landing palette: their local time, the meeting link, the cancel/reschedule link, and the "while you wait, run the agent on your own catalog" CTA into `/demo`. EN and ES.
2. **Team** , Slack ping through the existing webhook, plus the same `.ics` by email so the call lands in the founder's calendar. This is how calendar coverage happens with no Google integration.
3. **`.ics`** , hand-rolled `VCALENDAR`, `METHOD:REQUEST`, meet URL in `LOCATION`, attached base64 through Resend. Gmail and Outlook both render an add-to-calendar chip.

## Reminders

One EventBridge rule at a 15-minute rate, hitting a small Lambda , **not** one schedule per booking, so there is nothing to clean up when someone cancels.

Each run queries today and tomorrow, then for each booking sends at T-24h and T-1h. The `remindedT24` / `remindedT1` flags are set with a conditional update, so a Lambda retry cannot double-send. That idempotency is the whole reason the flags exist.

A booking made less than 24 hours out **skips** the T-24h reminder rather than firing it immediately: `remindedT24` is written as already-sent at creation time when the slot is inside that window. Someone who books tomorrow morning at 9am tonight should not get a "reminder" thirty seconds after their confirmation.

## Abuse

This is a public write endpoint on the open internet.

- IP rate limit, reusing `assertWithinRateLimit`.
- One active booking per email address, enforced by the guard row above. A second attempt returns 409 with a message telling them they already hold a slot , not a silent failure, and not a second call on the calendar.
- Slots validated to be inside the horizon and outside the lead time, server-side, on every write.

**Not solved in v1:** email addresses are unverified, so a fake address can burn a slot. The cancel link is the only ownership proof, and the Slack ping surfaces it immediately. Accepted, not overlooked.

## Landing page changes

- **New route pair in `ROUTES`**: `/schedule` and `/es/agenda`. Prerenderer, sitemap, hreflang and metadata all follow from that one entry.
- **Real copy above the picker** , what the call is, how long it runs, what they walk away with. Converts better, and a thin interactive page would drag the Semrush word-count and text-to-HTML checks back down after ANY-65 cleared them.
- **`DemoLink` becomes `CtaLink`**, pointing at `ROUTES[lang].schedule`. Navbar, hero and closing CTAs all flow through it, so that is the entire rewiring. It keeps emitting `demo_cta_click` with an added `dest` field: a comparable series across the change instead of a break in the data.
- **`/thanks` and `/es/gracias` finally get reached.** They become the post-booking page and carry the CTA into `/demo`.
- **`/demo` gets a quiet footer link** so it stops being an orphan in the sitemap (ANY-65) without competing with the primary CTA.
- **`DEMO_URL` comes out of `config.js`.** With routes driving everything, `prerender.js` builds both URLs from `ROUTES` plus the host constant. No third place for a URL to drift.

CTA copy is unchanged. "Review my commercial process" now genuinely leads to booking a review.

## Testing

Vitest siblings in `demo-backend`, matching the existing every-source-file-has-a-`.test.ts` convention:

- Slot generation: DST boundaries, lead-time edge, horizon edge, weekend exclusion.
- The conditional-write race: two concurrent books on one slot, exactly one wins.
- HMAC: valid link verifies, tampered slot id and tampered signature both reject.
- `.ics` output shape.
- Reminder idempotency, and the T-24h / T-1h window boundaries.
- Zod schemas against malformed and hostile input.

The landing repo has eslint and the build only. Frontend verification is the build plus prerender of all eight routes, which is why no date logic lives there.

## Out of scope

- Busy-checking a real calendar. Explicitly rejected above.
- Email verification before booking.
- Multiple call types or durations.
- Rescheduling by the host. The founder cancels through the same link the visitor has.
