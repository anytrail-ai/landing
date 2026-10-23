import { createHash } from 'node:crypto';
import { esc } from '../html';
import { outboundFetch } from '../net/outbound-fetch';
import { notifyBooking } from '../notify';
import { getSecret } from '../secrets';
import { MEET_URL, SCHEDULE } from './config';
import { buildIcs } from './ics';
import type { Booking } from './store';

const SENDER = process.env.EMAIL_SENDER ?? 'Anytrail <agent@demo.anytrail.ai>';
/** Scheduling uses plain comma-separated mailbox addresses, not display names. */
export function parseTeamRecipients(value: string): string[] {
  return [...new Set(value.split(',').map((address) => address.trim().toLowerCase()).filter(Boolean))];
}

function bookingTeamRecipients(): string[] {
  // A scheduling-only override preserves the recipients of unrelated lead emails.
  return parseTeamRecipients(process.env.SCHEDULE_TEAM_COPY ?? process.env.EMAIL_TEAM_COPY ?? '');
}
const SITE = 'https://www.anytrail.ai';

// Landing palette, same values as src/email.ts.
const C = {
  pageBg: '#fefdf6',
  surface: '#ffffff',
  border: '#e7e2d1',
  text: '#111827',
  muted: '#6b7280',
  faint: '#9ca3af',
  accent: '#2f6f4f',
  accentSoft: '#e8f0eb',
};

/**
 * "Thursday, August 20, 2026 at 2:30 PM New York time" in the visitor's
 * language. `shortGeneric` names the city rather than an offset abbreviation
 * (EDT/GMT-4) in both locales: most visitors are not in the US, so naming
 * the zone beats naming an abbreviation they would have to look up, and one
 * format string for both locales cannot drift apart later.
 */
export function formatSlot(slotStartUtc: string, lang: 'en' | 'es'): string {
  return new Intl.DateTimeFormat(lang === 'es' ? 'es-MX' : 'en-US', {
    timeZone: SCHEDULE.timezone,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'shortGeneric',
  }).format(new Date(slotStartUtc));
}

/**
 * Stable per booking, not per slot. `createdAt` survives a reschedule (move()
 * spreads the existing booking), so the same calendar event gets updated.
 */
export function icsUidFor(b: Pick<Booking, 'email' | 'createdAt'>): string {
  const digest = createHash('sha256')
    .update(`${b.email.trim().toLowerCase()}|${b.createdAt}`)
    .digest('hex')
    .slice(0, 24);
  return `anytrail-${digest}@anytrail.ai`;
}

const T = {
  en: {
    subject: (when: string) => `Your Anytrail call is booked: ${when}`,
    subjectMoved: (when: string) => `Your Anytrail call moved: ${when}`,
    heading: 'Your call is booked.',
    headingMoved: 'Your call has been moved.',
    join: 'Join the call',
    manage: 'Need to change it? Cancel or move your call',
    demoLead: 'bring the names of your customer portals and one rejection or delayed payment to discuss.',
    demoCta: 'What we’re building',
    minutes: `${SCHEDULE.slotMinutes} minutes, by video.`,
    remind24: (when: string) => `Reminder: your Anytrail call is tomorrow, ${when}`,
    remind1: (when: string) => `Starting in an hour: your Anytrail call at ${when}`,
  },
  es: {
    subject: (when: string) => `Tu llamada con Anytrail está agendada: ${when}`,
    subjectMoved: (when: string) => `Tu llamada con Anytrail cambió de horario: ${when}`,
    heading: 'Tu llamada está agendada.',
    headingMoved: 'Tu llamada cambió de horario.',
    join: 'Entrar a la llamada',
    manage: '¿Necesitas cambiarla? Cancela o mueve tu llamada',
    demoLead: 'trae los nombres de tus portales de clientes y un ejemplo de rechazo o pago atrasado para revisar.',
    demoCta: 'Lo que estamos construyendo',
    minutes: `${SCHEDULE.slotMinutes} minutos, por video.`,
    remind24: (when: string) => `Recordatorio: tu llamada con Anytrail es mañana, ${when}`,
    remind1: (when: string) => `Comienza en una hora: tu llamada con Anytrail a las ${when}`,
  },
} as const;

function shell(inner: string): string {
  return `<div style="background:${C.pageBg};padding:32px 0;font-family:-apple-system,Segoe UI,Roboto,sans-serif">
  <div style="max-width:560px;margin:0 auto;background:${C.surface};border:1px solid ${C.border};border-radius:12px;padding:32px">
    <!-- Served from the landing site's public/ so it survives independently of
         this deploy. Width and height are attributes as well as styles because
         Outlook ignores the CSS; alt text carries the brand when a client blocks
         images, which many do by default. -->
    <div style="margin-bottom:24px">
      <a href="${SITE}" style="text-decoration:none"><img src="${SITE}/anytrail-logo.png" alt="Anytrail" width="130" height="32" style="display:block;width:130px;height:32px;border:0;outline:none;text-decoration:none" /></a>
    </div>
    ${inner}
    <div style="margin-top:28px;border-top:1px solid ${C.border};padding-top:16px;font-size:12px;color:${C.faint}">
      Anytrail · <a href="${SITE}" style="color:${C.accent}">anytrail.ai</a>
    </div>
  </div>
</div>`;
}

export function renderConfirmation(
  b: Booking,
  manageUrl: string,
  meetUrl: string,
  // A reschedule reuses this same renderer (move() sends the same email
  // shape as book()); 'moved' swaps only the subject/heading so the team and
  // the visitor see a reschedule for what it is, not a second new booking.
  kind: 'booked' | 'moved' = 'booked',
): { subject: string; html: string; text: string } {
  const t = T[b.lang];
  const when = formatSlot(b.slotStartUtc, b.lang);
  const demoUrl = `${SITE}${b.lang === 'es' ? '/es' : '/'}`;
  const heading = kind === 'moved' ? t.headingMoved : t.heading;
  const subject = kind === 'moved' ? t.subjectMoved(when) : t.subject(when);

  const html = shell(`
    <h1 style="font-size:24px;color:${C.text};margin:0 0 8px">${heading}</h1>
    <p style="color:${C.text};font-size:15px;margin:0 0 4px"><strong>${esc(when)}</strong></p>
    <p style="color:${C.muted};font-size:14px;margin:0 0 24px">${t.minutes}</p>
    <a href="${meetUrl}" style="display:inline-block;background:#000;color:#fff;padding:13px 26px;border-radius:6px;font-weight:600;text-decoration:none">${t.join}</a>
    <p style="margin:24px 0 0;font-size:14px"><a href="${esc(manageUrl)}" style="color:${C.muted}">${t.manage}</a></p>
    <div style="margin-top:28px;background:${C.accentSoft};border-radius:6px;padding:16px">
      <p style="margin:0 0 8px;font-size:14px;color:${C.text}">${esc(b.name)}, ${t.demoLead}</p>
      <a href="${demoUrl}" style="color:${C.accent};font-weight:600">${t.demoCta}</a>
    </div>`);

  const text = [
    heading,
    when,
    t.minutes,
    `${t.join}: ${meetUrl}`,
    `${t.manage}: ${manageUrl}`,
    `${b.name}, ${t.demoLead}`,
    `${t.demoCta}: ${demoUrl}`,
  ].join('\n\n');

  return { subject, html, text };
}

export function renderReminder(
  b: Booking,
  manageUrl: string,
  meetUrl: string,
  which: 'T24' | 'T1',
): { subject: string; html: string; text: string } {
  const t = T[b.lang];
  const when = formatSlot(b.slotStartUtc, b.lang);
  const subject = which === 'T24' ? t.remind24(when) : t.remind1(when);

  const html = shell(`
    <h1 style="font-size:24px;color:${C.text};margin:0 0 8px">${esc(subject)}</h1>
    <p style="color:${C.text};font-size:15px;margin:0 0 24px"><strong>${esc(when)}</strong></p>
    <a href="${meetUrl}" style="display:inline-block;background:#000;color:#fff;padding:13px 26px;border-radius:6px;font-weight:600;text-decoration:none">${t.join}</a>
    <p style="margin:24px 0 0;font-size:14px"><a href="${esc(manageUrl)}" style="color:${C.muted}">${t.manage}</a></p>`);

  return { subject, html, text: [subject, when, `${t.join}: ${meetUrl}`, manageUrl].join('\n\n') };
}

// `label` makes a Resend failure greppable by which recipient it was for: the
// manage link reaches the visitor ONLY through their email (it is their only
// proof of ownership), so a silent visitor-send failure permanently locks
// them out with no way to self-serve. A team-copy failure is not that.
async function send(payload: Record<string, unknown>, label: 'visitor' | 'team'): Promise<void> {
  const apiKey = await getSecret('RESEND_SECRET_ARN');
  const res = await outboundFetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from: SENDER, ...payload }),
  });
  if (!res.ok) {
    console.error(`schedule_email_${label}_failed`, res.status, await res.text());
  }
}

type TeamBookingKind = 'booked' | 'moved' | 'cancelled';

async function sendTeamBookingEmail(
  b: Booking,
  kind: TeamBookingKind,
  attachments?: Array<{ filename: string; content: string }>,
  previousSlotStartUtc?: string,
): Promise<void> {
  const recipients = bookingTeamRecipients();
  if (recipients.length === 0) return;
  // Each channel is best-effort and independent. Mail must not roll back a
  // committed book/move/cancel or suppress its separate Slack notification.
  try {
    const labels = {
      booked: { subject: 'New booking', status: 'CONFIRMED', slot: 'Slot' },
      moved: { subject: 'Rescheduled', status: 'RESCHEDULED', slot: 'New slot' },
      cancelled: { subject: 'Cancelled booking', status: 'CANCELLED', slot: 'Cancelled slot' },
    } as const;
    const label = labels[kind];
    const when = formatSlot(b.slotStartUtc, 'en');
    const text = [
      `Booking status: ${label.status}`,
      `Booking ID: ${icsUidFor(b)}`,
      `Prospect: ${b.name} <${b.email}>`,
      `Company website: ${b.website}`,
      `Booking created (UTC): ${b.createdAt}`,
      ...(previousSlotStartUtc ? [`Previous slot (UTC): ${previousSlotStartUtc}`] : []),
      `${label.slot} (UTC): ${b.slotStartUtc}`,
      `${label.slot} (America/New_York): ${when}`,
      `Duration: ${SCHEDULE.slotMinutes} minutes`,
      `Note: ${b.note || '(none)'}`,
      kind === 'cancelled'
        ? 'Calendar action: remove this booking from the host calendar.'
        : `Join: ${MEET_URL}`,
    ].join('\n');
    await send({
      to: recipients,
      subject: `${label.subject}: ${b.name} (${b.website}) ${when}`,
      text,
      ...(attachments ? { attachments } : {}),
    }, 'team');
  } catch (err) {
    console.error(`schedule_team_${kind}_email_failed`, err);
  }
}

/** Host notification only; the existing visitor cancellation response is unchanged. */
export async function sendCancellationEmail(b: Booking): Promise<void> {
  await sendTeamBookingEmail(b, 'cancelled');
}

/**
 * Visitor confirmation plus a team copy, both carrying the .ics. Best-effort:
 * a mail failure logs and never fails the booking the visitor already made.
 * `kind` distinguishes a fresh booking from a reschedule in both the subject/
 * heading and the Slack ping — move() reuses this same function, and without
 * it a reschedule reads as a second new booking to both the team and the
 * visitor.
 */
export async function sendBookingEmails(
  b: Booking,
  manageUrl: string,
  kind: 'booked' | 'moved' = 'booked',
  previousSlotStartUtc?: string,
): Promise<void> {
  // Everything through the mail send is inside the try: formatSlot/buildIcs
  // can throw (e.g. Intl.DateTimeFormat's RangeError on an unparseable
  // instant), and this function must never reject regardless of where the
  // failure happens — a mail bug must never fail the booking the visitor
  // already made.
  try {
    const { subject, html, text } = renderConfirmation(b, manageUrl, MEET_URL, kind);
    const ics = buildIcs({
      slotStartUtc: b.slotStartUtc,
      // Identity is the booking, not the slot: a reschedule keeps this uid and
      // bumps the sequence, so calendar clients update the event in place
      // instead of leaving a ghost meeting at the old time.
      uid: icsUidFor(b),
      sequence: b.sequence ?? 0,
      attendeeEmail: b.email,
      attendeeName: b.name,
      organizerEmail: (SENDER.match(/<(.+)>/) ?? [, SENDER])[1] as string,
      meetUrl: MEET_URL,
      summary: 'Anytrail: customer AP portal early-access demo',
      description: `${SCHEDULE.slotMinutes} minutes by video. Join: ${MEET_URL}`,
    });
    const attachments = [
      { filename: 'anytrail-call.ics', content: Buffer.from(ics).toString('base64') },
    ];

    try {
      await send({ to: [b.email], subject, html, text, attachments }, 'visitor');
    } catch (err) {
      console.error('schedule_visitor_email_failed', err);
    }
    await sendTeamBookingEmail(b, kind, attachments, previousSlotStartUtc);
  } catch (err) {
    console.error('send_booking_emails_failed', err);
  }

  // Slack ping is separate from the mail: one failing must not skip the
  // other, and its own formatSlot call is guarded the same way.
  try {
    await notifyBooking(
      {
        name: b.name,
        email: b.email,
        website: b.website,
        when: formatSlot(b.slotStartUtc, 'en'),
        note: b.note,
      },
      kind,
    );
  } catch (err) {
    console.error('notify_booking_failed', err);
  }
}

export async function sendReminderEmail(
  b: Booking,
  manageUrl: string,
  which: 'T24' | 'T1',
): Promise<void> {
  try {
    const { subject, html, text } = renderReminder(b, manageUrl, MEET_URL, which);
    await send({ to: [b.email], subject, html, text }, 'visitor');
  } catch (err) {
    console.error('send_reminder_failed', err);
  }
}
