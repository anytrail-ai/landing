import { describe, expect, it } from 'vitest';
import { renderPriceRequestEmail } from './email';
import type { PriceRequest } from './types';

const req: PriceRequest = {
  token: 'tok123', quoteId: 'q', catalogId: 'c', supplier: 'Acme', currency: 'MXN',
  to: 'p@acme.mx', subject: 'Precio <b>urgente</b>', body: 'Hola <script>alert(1)</script>\nlinea 2',
  items: [{ lineIndex: 1, name: 'Bomba', sku: 'B1', qty: 2 }], status: 'pending',
  remindersSent: 0, nextReminderAt: 0, createdAt: '2026-09-24T00:00:00Z',
};

describe('renderPriceRequestEmail', () => {
  it('escapes the visitor-editable body and keeps line breaks', () => {
    const { html, text } = renderPriceRequestEmail(req, 0);
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('linea 2');
    expect(html).toContain('<br');
    expect(text).toContain('/supplier_price?t=tok123');
  });
  it('prefixes reminders with the count', () => {
    expect(renderPriceRequestEmail(req, 2).subject).toBe('Recordatorio 2/5: Precio <b>urgente</b>');
    expect(renderPriceRequestEmail(req, 0).subject).toBe('Precio <b>urgente</b>');
  });
});
