// Signup notifications: fire-and-forget, never blocks or breaks the visitor
// flow. Two channels:
//  - Resend email to the team inbox (EMAIL_TEAM_COPY)
//  - optional webhook POST (NOTIFY_WEBHOOK_URL) — Slack-incoming-webhook
//    compatible payload ({text}), works with anything that accepts JSON.
import { outboundFetch } from './net/outbound-fetch';
import { getSecret } from './secrets';

const SENDER = process.env.EMAIL_SENDER ?? 'Anytrail <agent@demo.anytrail.ai>';
// Signup pings go to Slack (NOTIFY_WEBHOOK_URL). NOTIFY_EMAIL is a fallback
// channel, empty by default — EMAIL_TEAM_COPY is only the BCC on lead emails.
const TEAM = process.env.NOTIFY_EMAIL;


export interface SignupInfo {
  name: string;
  email: string;
  domain: string;
  wantsProspects: boolean;
  ip: string;
}

/** Slack-incoming-webhook compatible POST. Never throws: a Slack outage must
 *  never fail the visitor action that triggered it. */
export async function postSlack(text: string): Promise<void> {
  if (!process.env.SLACK_WEBHOOK_SECRET_ARN) return;
  try {
    const url = await getSecret('SLACK_WEBHOOK_SECRET_ARN');
    const res = await outboundFetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) console.error('notify_slack_failed', res.status);
  } catch (err) {
    console.error('notify_slack_failed', err);
  }
}

/** Booking ping (ANY-66). Fire-and-forget, like every other notification. */
export async function notifyBooking(info: {
  name: string;
  email: string;
  website: string;
  when: string;
  note: string;
}): Promise<void> {
  await postSlack(
    `📅 Call booked: ${info.name} <${info.email}> — ${info.website}\n${info.when}${info.note ? `\nNote: ${info.note}` : ''}`,
  );
}

export async function notifySignup(info: SignupInfo): Promise<void> {
  const line = `New demo signup: ${info.name} <${info.email}> — ${info.domain}${info.wantsProspects ? ' (wants ICP + leads)' : ''}`;

  const tasks: Promise<unknown>[] = [];

  if (TEAM) {
    tasks.push(
      (async () => {
        const apiKey = await getSecret('RESEND_SECRET_ARN');
        const res = await outboundFetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            authorization: `Bearer ${apiKey}`,
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            from: SENDER,
            to: [TEAM],
            subject: `🔔 Demo signup: ${info.name} — ${info.domain}`,
            text: `${line}\n\nIP: ${info.ip}\nTime: ${new Date().toISOString()}\n\nLive demo: https://demo.anytrail.ai`,
          }),
        });
        if (!res.ok) console.error('notify_email_failed', res.status, await res.text());
      })(),
    );
  }

  tasks.push(postSlack(line));

  const results = await Promise.allSettled(tasks);
  for (const r of results) {
    if (r.status === 'rejected') console.error('notify_failed', r.reason);
  }
}
