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

interface SlackBot {
  token: string;
  channel: string;
}

/** Bot credentials from the optional slack-bot secret: JSON
 * {"token":"xoxb-…","channel":"C…"}. A missing, placeholder, or malformed
 * secret disables the bot path and everything falls back to the webhook. */
async function getSlackBot(): Promise<SlackBot | null> {
  if (!process.env.SLACK_BOT_SECRET_ARN) return null;
  try {
    const parsed = JSON.parse(await getSecret('SLACK_BOT_SECRET_ARN')) as Partial<SlackBot>;
    if (parsed.token && parsed.channel) return { token: parsed.token, channel: parsed.channel };
  } catch {
    /* fall through to webhook */
  }
  return null;
}

/** Post to the team channel and return the message ts. With the bot secret
 * configured this uses chat.postMessage, so replies can thread under the
 * returned ts. Otherwise it falls back to the incoming webhook, which cannot
 * thread — threaded posts are silently skipped there. Never throws. */
export async function postSlackMessage(text: string, threadTs?: string): Promise<string | null> {
  const bot = await getSlackBot();
  if (!bot) {
    if (!threadTs) await postSlack(text);
    return null;
  }
  try {
    const res = await outboundFetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: { authorization: `Bearer ${bot.token}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        channel: bot.channel,
        text,
        ...(threadTs ? { thread_ts: threadTs } : {}),
      }),
    });
    const data = (await res.json()) as { ok?: boolean; ts?: string; error?: string };
    if (!data.ok) {
      console.error('notify_slack_failed', data.error);
      return null;
    }
    return data.ts ?? null;
  } catch (err) {
    console.error('notify_slack_failed', err);
    return null;
  }
}

/** Booking ping (ANY-66). Fire-and-forget, like every other notification.
 * `kind` tells 'booked' apart from 'moved' so a reschedule doesn't read as a
 * second new booking to the team. */
export async function notifyBooking(
  info: {
    name: string;
    email: string;
    website: string;
    when: string;
    note: string;
  },
  kind: 'booked' | 'moved' = 'booked',
): Promise<void> {
  const label = kind === 'moved' ? '🔄 Call moved' : '📅 Call booked';
  await postSlackMessage(
    `${label}: ${info.name} <${info.email}> — ${info.website}\n${info.when}${info.note ? `\nNote: ${info.note}` : ''}`,
  );
}

/** Returns the Slack message ts of the signup ping (bot path only) so the
 * chat transcript can thread under it; null on the webhook path or failure. */
export async function notifySignup(info: SignupInfo): Promise<string | null> {
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

  const slackTask = postSlackMessage(line);
  tasks.push(slackTask);

  const results = await Promise.allSettled(tasks);
  for (const r of results) {
    if (r.status === 'rejected') console.error('notify_failed', r.reason);
  }
  return slackTask.catch(() => null);
}
