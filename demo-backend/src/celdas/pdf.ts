import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib';
import { COMPANY_FULL } from './prompt';
import type { CeldasQuote } from './types';

// One-page quote PDF. Standard Helvetica is WinAnsi-encoded, which covers
// Spanish (á, ñ, ¿, °); anything outside it is replaced, never thrown on.

const INK = rgb(0.067, 0.094, 0.153);
const MUTED = rgb(0.42, 0.45, 0.5);
const RULE = rgb(0.906, 0.886, 0.82);
const ACCENT = rgb(0.184, 0.435, 0.31);
const SOFT = rgb(0.996, 0.992, 0.965);

const W = 612;
const H = 792;
const M = 48;

function safe(text: string): string {
  return text
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/…/g, '...')
    .replace(/×/g, 'x')
    .replace(/[^\x20-\x7E -ÿ\n]/g, '?');
}

function wrap(text: string, font: PDFFont, size: number, width: number): string[] {
  const out: string[] = [];
  for (const para of safe(text).split('\n')) {
    let line = '';
    for (const word of para.split(/\s+/)) {
      const next = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(next, size) > width && line) {
        out.push(line);
        line = word;
      } else {
        line = next;
      }
    }
    out.push(line);
  }
  return out;
}

export const usd = (n: number) =>
  `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;

export async function renderQuotePdf(q: CeldasQuote): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(`Cotización ${q.folio}`);
  doc.setAuthor(q.company);
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  let page: PDFPage = doc.addPage([W, H]);
  let y = H - M;

  const text = (s: string, x: number, size = 10, font = regular, color = INK) =>
    page.drawText(safe(s), { x, y, size, font, color });
  const right = (s: string, xRight: number, size = 10, font = regular, color = INK) =>
    page.drawText(safe(s), { x: xRight - font.widthOfTextAtSize(safe(s), size), y, size, font, color });
  const ensure = (needed: number) => {
    if (y - needed > M + 30) return;
    page = doc.addPage([W, H]);
    y = H - M;
  };
  const paragraph = (s: string, x: number, width: number, size = 9.5, font = regular, color = INK) => {
    for (const line of wrap(s, font, size, width)) {
      ensure(size + 4);
      text(line, x, size, font, color);
      y -= size + 4;
    }
  };

  // Header band.
  page.drawRectangle({ x: 0, y: H - 110, width: W, height: 110, color: SOFT });
  page.drawRectangle({ x: 0, y: H - 112, width: W, height: 2, color: ACCENT });
  y = H - 56;
  text(q.company, M, 18, bold);
  right('COTIZACIÓN', W - M, 18, bold, ACCENT);
  y -= 18;
  text(`${COMPANY_FULL} · Celdas de carga Utilcell serie 350N`, M, 10, regular, MUTED);
  right(`Folio ${q.folio}`, W - M, 10, bold);
  y -= 14;
  right(`Fecha ${q.date}`, W - M, 10, regular, MUTED);

  // Customer + application.
  y = H - 140;
  text('CLIENTE', M, 8, bold, MUTED);
  text('APLICACIÓN', W / 2 + 8, 8, bold, MUTED);
  y -= 14;
  const leftTop = y;
  text(q.customer.name, M, 11, bold);
  y -= 14;
  if (q.customer.company) {
    text(q.customer.company, M, 10);
    y -= 13;
  }
  text(q.customer.email, M, 10, regular, MUTED);
  const leftBottom = y;
  y = leftTop;
  for (const [k, v] of [
    ['Aplicación', q.summary.application],
    ['Ambiente', q.summary.environment],
    ['Proyecto', q.summary.replacementOrNew],
  ] as const) {
    const lines = wrap(`${k}: ${v}`, regular, 9.5, W / 2 - M - 8);
    for (const l of lines) {
      text(l, W / 2 + 8, 9.5);
      y -= 13;
    }
  }
  y = Math.min(y, leftBottom) - 24;

  // Lines table.
  // Right-aligned numeric columns: each value ends at its x.
  const cols = { part: M, desc: M + 92, descEnd: W - M - 190, qty: W - M - 160, unit: W - M - 84, total: W - M };
  page.drawRectangle({ x: M - 6, y: y - 6, width: W - 2 * M + 12, height: 20, color: INK });
  const white = rgb(1, 1, 1);
  text('No. de parte', cols.part, 8.5, bold, white);
  text('Descripción', cols.desc, 8.5, bold, white);
  right('Cant.', cols.qty, 8.5, bold, white);
  right('P. unitario', cols.unit, 8.5, bold, white);
  right('Importe', cols.total, 8.5, bold, white);
  y -= 24;
  for (const l of q.lines) {
    const desc = wrap(l.description, regular, 9, cols.descEnd - cols.desc);
    ensure(desc.length * 12 + 10);
    text(l.partNumber, cols.part, 9.5, bold);
    right(String(l.qty), cols.qty, 9.5);
    right(usd(l.unitUsd), cols.unit, 9.5);
    right(usd(l.totalUsd), cols.total, 9.5, bold);
    for (const d of desc) {
      text(d, cols.desc, 9);
      y -= 12;
    }
    y -= 6;
    page.drawLine({ start: { x: M - 6, y: y + 8 }, end: { x: W - M + 6, y: y + 8 }, thickness: 0.6, color: RULE });
  }
  y -= 8;
  right('TOTAL', cols.qty, 11, bold);
  right(usd(q.totalUsd), cols.total, 13, bold, ACCENT);
  y -= 30;

  const section = (title: string, items: string[]) => {
    if (!items.length) return;
    ensure(40);
    text(title, M, 8, bold, MUTED);
    y -= 14;
    for (const item of items) paragraph(`- ${item}`, M, W - 2 * M);
    y -= 10;
  };
  section('ADICIONALES SUGERIDOS (SE COTIZAN APARTE)', q.extras);
  section('NOTAS', q.notes);

  // Footer on every page.
  for (const p of doc.getPages()) {
    p.drawLine({ start: { x: M, y: 50 }, end: { x: W - M, y: 50 }, thickness: 0.6, color: RULE });
    p.drawText(
      safe(`Precios en dólares americanos. Cotización preparada por el agente de ventas de ${q.company}; un vendedor la confirma antes de emitir pedido.`),
      { x: M, y: 36, size: 7.5, font: regular, color: MUTED, maxWidth: W - 2 * M },
    );
  }
  return doc.save();
}
