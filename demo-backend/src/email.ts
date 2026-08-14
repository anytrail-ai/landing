// Branded lead-delivery email via Resend (https://resend.com). Best-effort:
// email is a bonus channel; failures log and never break the on-page result.
// A copy goes to the team inbox so every outgoing lead list is visible.
import { esc } from './html';
import { outboundFetch } from './net/outbound-fetch';
import { getSecret } from './secrets';
import type { Icp } from './pipeline/icp';
import type { ProspectLead } from './api/prospects';

const SENDER = process.env.EMAIL_SENDER ?? 'Anytrail <agent@demo.anytrail.ai>';
const TEAM_COPY = process.env.EMAIL_TEAM_COPY;

// Landing palette (web/src/index.css) inlined for email clients.
const C = {
  pageBg: '#fefdf6',
  surface: '#ffffff',
  surfaceMuted: '#f6f4ea',
  border: '#e7e2d1',
  text: '#111827',
  muted: '#6b7280',
  faint: '#9ca3af',
  accent: '#2f6f4f',
  accentSoft: '#e8f0eb',
};

export function renderProspectsEmail(
  visitorName: string,
  companyName: string,
  icp: Icp,
  leads: ProspectLead[],
): { html: string; text: string } {
  const text = [
    `Hi ${visitorName},`,
    '',
    `Here is the ideal customer profile our AI derived for ${companyName}, plus ${leads.length} matching leads.`,
    '',
    `ICP: ${icp.icp_summary}`,
    `Buyer titles: ${icp.buyer_titles.join(', ')}`,
    `Sales motion: ${icp.sales_motion}`,
    '',
    ...leads.map(
      (l, i) =>
        `${i + 1}. ${l.company}${l.location ? ` — ${l.location}` : ''}${l.website ? `\n   ${l.website}` : ''}${l.contact ? `\n   ${l.contact.name}${l.contact.title ? ` (${l.contact.title})` : ''}` : ''}\n   ${l.whyFit}`,
    ),
    '',
    'This took our AI about a minute. Imagine it working your real pipeline: https://anytrail.ai',
    '',
    '— Anytrail',
    '(You requested this one-time email at anytrail.ai/demo. No follow-ups.)',
  ].join('\n');

  const leadRows = leads
    .map(
      (l) => `
      <tr><td style="border-top:1px solid ${C.border};padding:16px 0">
        <div style="font-weight:600;font-size:16px">${
          l.website
            ? `<a href="${esc(l.website)}" style="color:${C.text};text-decoration:none">${esc(l.company)}</a>`
            : esc(l.company)
        }</div>
        <div style="color:${C.faint};font-size:13px;margin-top:2px">${esc(
          [l.industry, l.location, l.employees ? `~${l.employees} employees` : null]
            .filter(Boolean)
            .join('  ·  '),
        )}</div>
        ${
          l.contact
            ? `<div style="font-size:14px;margin-top:6px">${
                l.contact.linkedinUrl
                  ? `<a href="${esc(l.contact.linkedinUrl)}" style="color:${C.accent}">${esc(l.contact.name)}</a>`
                  : esc(l.contact.name)
              }${l.contact.title ? ` <span style="color:${C.muted}">— ${esc(l.contact.title)}</span>` : ''}${l.contact.email ? `<br/><a href="mailto:${esc(l.contact.email)}" style="color:${C.accent};font-size:13px">${esc(l.contact.email)}</a>` : ''}</div>`
            : ''
        }
        <div style="color:${C.muted};font-size:14px;margin-top:6px;line-height:1.5">${esc(l.whyFit)}</div>
      </td></tr>`,
    )
    .join('');

  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:${C.pageBg}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.pageBg};padding:32px 16px"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;font-family:'Funnel Sans','Segoe UI',system-ui,sans-serif;color:${C.text}">
  <tr><td style="padding:0 8px 16px">
    <img src="https://www.anytrail.ai/anytrail-mark.png" alt="" height="24" style="height:24px;width:auto;vertical-align:middle"/>
    <span style="font-family:'Montserrat','Funnel Sans',system-ui,sans-serif;font-weight:300;font-size:20px;letter-spacing:0.01em;vertical-align:middle">&nbsp;anytrail</span>
    <span style="color:${C.faint};font-size:13px;vertical-align:middle"> &nbsp;·&nbsp; demo results</span>
  </td></tr>
  <tr><td style="background:${C.surface};border:1px solid ${C.border};border-radius:12px;padding:32px">
    <h1 style="font-family:'Funnel Display','Funnel Sans',system-ui,sans-serif;font-size:24px;line-height:1.2;margin:0 0 8px">Your ideal customers, ${esc(visitorName)}</h1>
    <p style="color:${C.muted};font-size:15px;margin:0 0 20px">Derived from ${esc(companyName)}'s website by your demo sales agent — plus ${leads.length} real companies that match.</p>
    <div style="background:${C.accentSoft};border-radius:8px;padding:14px 16px;font-size:14px;line-height:1.5">
      <strong style="color:${C.accent}">ICP</strong><br/>${esc(icp.icp_summary)}
    </div>
    <p style="color:${C.muted};font-size:13px;margin:12px 0 20px">
      <strong>Who buys:</strong> ${esc(icp.buyer_titles.slice(0, 5).join(', '))}<br/>
      <strong>Sales motion:</strong> ${esc(icp.sales_motion)}
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${leadRows}</table>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:28px"><tr><td style="background:#000000;border-radius:8px">
      <a href="https://anytrail.ai" style="display:inline-block;padding:13px 26px;color:#ffffff;font-weight:600;font-size:15px;text-decoration:none">This took a minute — put it on your real pipeline</a>
    </td></tr></table>
  </td></tr>
  <tr><td style="padding:16px 8px;color:${C.faint};font-size:12px;line-height:1.5">
    You requested this one-time email at <a href="https://anytrail.ai/demo" style="color:${C.faint}">anytrail.ai/demo</a>. No follow-ups, no list.<br/>
    Anytrail — AI sales agents for industrial companies · <a href="https://anytrail.ai" style="color:${C.accent}">anytrail.ai</a>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
  return { html, text };
}

export async function sendProspectsEmail(
  to: string,
  visitorName: string,
  companyName: string,
  icp: Icp,
  leads: ProspectLead[],
): Promise<void> {
  try {
    const apiKey = await getSecret('RESEND_SECRET_ARN');
    const { html, text } = renderProspectsEmail(visitorName, companyName, icp, leads);
    const res = await outboundFetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from: SENDER,
        to: [to],
        ...(TEAM_COPY ? { bcc: [TEAM_COPY] } : {}),
        subject: `Your ideal customer profile + ${leads.length} leads — Anytrail demo`,
        html,
        text,
      }),
    });
    if (!res.ok) {
      console.error('email_failed', { to, status: res.status, body: await res.text() });
    }
  } catch (err) {
    console.error('email_failed', { to, error: err });
  }
}
