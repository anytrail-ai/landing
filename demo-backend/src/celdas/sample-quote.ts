import { priceLines } from './catalog';
import type { CeldasQuote } from './types';

/** Fixture for the PDF test and for eyeballing the layout. */
export function sampleQuote(): CeldasQuote {
  const priced = priceLines([
    { partNumber: '350NUS005-SE', qty: 6 },
    { partNumber: '350NUS010', qty: 4 },
  ]);
  return {
    folio: 'CEL-260930-ABCD',
    date: '30 de septiembre de 2026',
    company: 'IPPSA',
    customer: { name: 'Ana Muñoz', company: 'Básculas del Norte', email: 'ana@example.com' },
    summary: { application: 'Tolva de 20,000 lb', environment: 'Interior seco', replacementOrNew: 'Reemplazo de Revere 5123 — juego completo' },
    lines: priced.lines,
    totalUsd: priced.totalUsd,
    extras: ['Monturas', 'Calibración'],
    notes: [...priced.alerts, 'Se cotiza juego completo: mezclar celdas nuevas y usadas da error de esquinas “grave”…'],
  };
}
