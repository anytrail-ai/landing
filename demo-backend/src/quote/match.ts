import type { CatalogItem, QuoteLine } from './types';

// Decide in code, not in the prompt (lead-crm quote-suggest doctrine): the
// shortlist is deterministic, the model only picks an index from it, and the
// price is attached here from the catalogue row.

export const MAX_CANDIDATES = 8;

export interface ExtractedItem {
  query: string;
  qty: number;
}

const STOP = new Set([
  'de', 'del', 'la', 'el', 'los', 'las', 'un', 'una', 'unos', 'unas', 'y', 'o', 'con',
  'para', 'por', 'en', 'a', 'al', 'que', 'mi', 'me', 'the', 'of', 'and', 'for', 'with',
]);

export function tokens(s: string): string[] {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1 && !STOP.has(t));
}

function score(queryTokens: string[], rawQuery: string, item: CatalogItem): number {
  let s = 0;
  if (item.sku && rawQuery.toLowerCase().includes(item.sku.toLowerCase())) s += 10;
  const name = new Set(tokens(item.name));
  const desc = new Set(tokens(item.description ?? ''));
  const sku = new Set(tokens(item.sku ?? ''));
  for (const t of queryTokens) {
    if (name.has(t)) s += 2;
    else if (sku.has(t)) s += 2;
    else if (desc.has(t)) s += 1;
  }
  return s;
}

export function shortlist(query: string, items: CatalogItem[], max = MAX_CANDIDATES): CatalogItem[] {
  const qt = tokens(query);
  return items
    .map((item, idx) => ({ item, idx, s: score(qt, query, item) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s || a.idx - b.idx)
    .slice(0, max)
    .map((r) => r.item);
}

/** Model output `{picks:[{q,c}]}` → queryIndex → candidateIndex. Anything not an
 * in-range integer is DISCARDED, never clamped: a clamped index is a wrong
 * product at a real-looking price. */
export function parsePicks(raw: unknown, shortlists: CatalogItem[][]): Map<number, number> {
  const out = new Map<number, number>();
  const picks = (raw as { picks?: unknown } | null)?.picks;
  if (!Array.isArray(picks)) return out;
  for (const p of picks) {
    const q = (p as { q?: unknown })?.q;
    const c = (p as { c?: unknown })?.c;
    if (!Number.isInteger(q) || !Number.isInteger(c)) continue;
    const list = shortlists[q as number];
    if (!list || (c as number) < 0 || (c as number) >= list.length) continue;
    out.set(q as number, c as number);
  }
  return out;
}

export function buildLines(
  extracted: ExtractedItem[],
  shortlists: CatalogItem[][],
  picks: Map<number, number>,
): QuoteLine[] {
  return extracted.map((e, i) => {
    const c = picks.get(i);
    const item = c === undefined ? undefined : shortlists[i]?.[c];
    if (!item) {
      return { itemId: null, query: e.query, name: e.query, sku: null, qty: e.qty, unitCents: null, status: 'no_match' };
    }
    return {
      itemId: item.id,
      query: e.query,
      name: item.name,
      sku: item.sku,
      qty: e.qty,
      unitCents: item.priceCents,
      status: item.priceCents === null ? 'unpriced' : 'priced',
    };
  });
}

export function totalCents(lines: QuoteLine[]): number {
  return lines.reduce((sum, l) => (l.unitCents === null ? sum : sum + l.unitCents * l.qty), 0);
}
