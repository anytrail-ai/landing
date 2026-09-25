import { esc } from '../html';
import { LIMITS } from '../limits';
import { outboundFetch } from '../net/outbound-fetch';
import { getSecret } from '../secrets';
import type { PriceRequest } from './types';

const SITE = process.env.SITE_URL ?? 'https://www.anytrail.ai';
const SENDER = process.env.EMAIL_SENDER ?? 'Anytrail <agent@demo.anytrail.ai>';
const TEAM_COPY = process.env.EMAIL_TEAM_COPY;

export function priceLink(token: string): string {
  return `${SITE}/supplier_price?t=${encodeURIComponent(token)}`;
}

export function renderPriceRequestEmail(
  req: PriceRequest,
  reminderNumber: number,
): { subject: string; html: string; text: string } {
  const link = priceLink(req.token);
  const subject =
    reminderNumber > 0 ? `Recordatorio ${reminderNumber}/${LIMITS.priceReminderMax}: ${req.subject}` : req.subject;
  const text = `${req.body}\n\nCaptura los precios aquí: ${link}`;
  // The body is typed by a demo visitor: escaped text only, never HTML.
  const bodyHtml = esc(req.body).replace(/\n/g, '<br />');
  const html = `<div style="background:#fefdf6;padding:32px 0;font-family:-apple-system,Segoe UI,Roboto,sans-serif">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e7e2d1;border-radius:12px;padding:32px;color:#111827;font-size:15px;line-height:1.5">
    ${reminderNumber > 0 ? `<p style="margin:0 0 16px;color:#6b7280;font-size:13px">Recordatorio ${reminderNumber} de ${LIMITS.priceReminderMax}. Aún no recibimos los precios.</p>` : ''}
    <p style="margin:0">${bodyHtml}</p>
    <p style="margin:24px 0 0"><a href="${esc(link)}" style="display:inline-block;background:#2f6f4f;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600">Capturar precios</a></p>
    <p style="margin:24px 0 0;border-top:1px solid #e7e2d1;padding-top:16px;font-size:12px;color:#9ca3af">Enviado desde una demo de Anytrail · anytrail.ai</p>
  </div>
</div>`;
  return { subject, html, text };
}

export async function sendPriceRequestEmail(req: PriceRequest, reminderNumber: number): Promise<void> {
  const { subject, html, text } = renderPriceRequestEmail(req, reminderNumber);
  const apiKey = await getSecret('RESEND_SECRET_ARN');
  const res = await outboundFetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: SENDER,
      to: [req.to],
      ...(TEAM_COPY ? { bcc: [TEAM_COPY] } : {}),
      subject,
      html,
      text,
    }),
  });
  if (!res.ok) {
    console.error('price_request_email_failed', res.status, await res.text());
    throw new Error('email_failed');
  }
}
