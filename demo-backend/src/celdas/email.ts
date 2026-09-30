import { esc } from '../html';
import { outboundFetch } from '../net/outbound-fetch';
import { getSecret } from '../secrets';
import { usd } from './pdf';
import type { CeldasQuote } from './types';

const SENDER_ADDRESS = 'agent@demo.anytrail.ai';
const TEAM_COPY = process.env.EMAIL_TEAM_COPY;

export function quoteFilename(q: CeldasQuote): string {
  return `Cotizacion-${q.folio}.pdf`;
}

export function renderQuoteEmail(q: CeldasQuote): { subject: string; html: string; text: string } {
  const subject = `Cotización ${q.folio}: celdas de carga Utilcell 350N`;
  const rows = q.lines.map((l) => `${l.qty} × ${l.partNumber}: ${usd(l.totalUsd)}`);
  const text = [
    `Hola, ${q.customer.name}:`,
    '',
    `Le compartimos la cotización ${q.folio} que preparamos en la conversación por WhatsApp. Va adjunta en PDF.`,
    '',
    ...rows,
    `Total: ${usd(q.totalUsd)}`,
    '',
    'Un vendedor le da seguimiento para confirmar disponibilidad y tiempos de entrega.',
    '',
    `Ventas · ${q.company}`,
  ].join('\n');
  // Every value here came from a chat, so all of it is escaped.
  const html = `<div style="background:#fefdf6;padding:32px 0;font-family:-apple-system,Segoe UI,Roboto,sans-serif">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e7e2d1;border-radius:12px;padding:32px;color:#111827;font-size:15px;line-height:1.5">
    <p style="margin:0 0 12px">Hola, ${esc(q.customer.name)}:</p>
    <p style="margin:0 0 16px">Le compartimos la cotización <strong>${esc(q.folio)}</strong> que preparamos en la conversación por WhatsApp. Va adjunta en PDF.</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      ${q.lines
        .map(
          (l) =>
            `<tr><td style="padding:6px 0;border-bottom:1px solid #eee">${l.qty} × <strong>${esc(l.partNumber)}</strong></td><td style="padding:6px 0;border-bottom:1px solid #eee;text-align:right">${esc(usd(l.totalUsd))}</td></tr>`,
        )
        .join('')}
      <tr><td style="padding:10px 0;font-weight:600">Total</td><td style="padding:10px 0;text-align:right;font-weight:600;color:#2f6f4f">${esc(usd(q.totalUsd))}</td></tr>
    </table>
    <p style="margin:16px 0 0">Un vendedor le da seguimiento para confirmar disponibilidad y tiempos de entrega.</p>
    <p style="margin:16px 0 0">Ventas · ${esc(q.company)}</p>
    <p style="margin:24px 0 0;border-top:1px solid #e7e2d1;padding-top:16px;font-size:12px;color:#9ca3af">Enviado desde una demo de Anytrail · anytrail.ai</p>
  </div>
</div>`;
  return { subject, html, text };
}

export async function sendQuoteEmail(q: CeldasQuote, pdf: Uint8Array): Promise<void> {
  const { subject, html, text } = renderQuoteEmail(q);
  const apiKey = await getSecret('RESEND_SECRET_ARN');
  const res = await outboundFetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      // The company name is a server-side constant (prompt.ts), never visitor
      // input, so this display name cannot be used to impersonate anyone.
      from: `Ventas ${q.company.replace(/[<>"]/g, '')} <${SENDER_ADDRESS}>`,
      to: [q.customer.email],
      ...(TEAM_COPY ? { bcc: [TEAM_COPY] } : {}),
      subject,
      html,
      text,
      attachments: [{ filename: quoteFilename(q), content: Buffer.from(pdf).toString('base64') }],
    }),
  });
  if (!res.ok) {
    console.error('celdas_email_failed', res.status, await res.text());
    throw new Error('email_failed');
  }
}
