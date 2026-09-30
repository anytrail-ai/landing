// Utilcell 350N shear-beam catalogue for the /es/celdas_demo quoting agent.
// Everything numeric the agent says (capacity per cell, the part to quote,
// prices, totals) is decided here, in code, never by the model: the model
// picks tools and fills their inputs, these functions return the answer.

export interface Part {
  partNumber: string;
  capacityLb: number;
  label: string;
  priceUsd: number;
  /** The -SE suffix is not confirmed with the factory (see the brief). */
  unconfirmedVariant?: boolean;
}

export const PARTS: readonly Part[] = [
  { partNumber: '350NUS250', capacityLb: 250, label: '250 lb', priceUsd: 145 },
  { partNumber: '350NUS500', capacityLb: 500, label: '500 lb', priceUsd: 145 },
  { partNumber: '350NUS001', capacityLb: 1000, label: '1 klb (1,000 lb)', priceUsd: 145 },
  { partNumber: '350NUS105', capacityLb: 1500, label: '1.5 klb', priceUsd: 145 },
  { partNumber: '350NUS002', capacityLb: 2000, label: '2 klb', priceUsd: 145 },
  { partNumber: '350NUS205', capacityLb: 2500, label: '2.5 klb', priceUsd: 145 },
  { partNumber: '350NUS004', capacityLb: 4000, label: '4 klb', priceUsd: 145 },
  { partNumber: '350NUS005-SE', capacityLb: 5000, label: '5 klb', priceUsd: 145, unconfirmedVariant: true },
  { partNumber: '350NUS010', capacityLb: 10000, label: '10 klb', priceUsd: 250 },
];

export const EQUIVALENTS = ['Sensortronics 65023', 'Celtron SQB', 'Tedea 3410', 'Revere 5123', 'Zemic H8C'];

export const SE_ALERT = 'Confirmar variante -SE con fábrica.';

export function findPart(partNumber: string): Part | null {
  const want = partNumber.trim().toUpperCase().replace(/\s+/g, '');
  return PARTS.find((p) => p.partNumber === want) ?? null;
}

/** Smallest 350N whose capacity is at least `lb`, or null above 10 klb. */
export function partForCapacity(lb: number): Part | null {
  return PARTS.find((p) => p.capacityLb >= lb) ?? null;
}

export interface SizingInput {
  capacityLb: number;
  deadLoadLb: number;
  cells: number;
  impact: boolean;
}

export interface SizingOption {
  cells: number;
  perCellLb: number;
  designLb: number;
  part: Part | null;
  totalUsd: number | null;
}

export interface SizingResult {
  factor: number;
  recommended: SizingOption;
  /** Present when the design load lands above 5 klb: the brief asks to
   * compare 4 × 10 klb against more cells of 4-5 klb and offer the cheaper. */
  alternative: SizingOption | null;
  explanation: string;
}

const round = (n: number) => Math.round(n * 10) / 10;

function option(total: number, factor: number, cells: number): SizingOption {
  const perCellLb = total / cells;
  const designLb = perCellLb * factor;
  const part = partForCapacity(designLb);
  return {
    cells,
    perCellLb: round(perCellLb),
    designLb: round(designLb),
    part,
    totalUsd: part ? part.priceUsd * cells : null,
  };
}

// Brief, step 3 (new scale): per cell = (max capacity + dead load) ÷ cells,
// × 1.25 (× 1.5 with impact), round up to the next 350NUS.
export function sizeCells(input: SizingInput): SizingResult {
  const factor = input.impact ? 1.5 : 1.25;
  const total = input.capacityLb + input.deadLoadLb;
  const base = option(total, factor, input.cells);

  let alternative: SizingOption | null = null;
  if (base.designLb > 5000) {
    // Fewest extra cells (even count, platforms are symmetric) that bring the
    // design load back to 5 klb or less.
    let cells = input.cells + 2;
    while (option(total, factor, cells).designLb > 5000) cells += 2;
    alternative = option(total, factor, cells);
  }

  const cheaperAlt =
    alternative?.totalUsd != null && (base.totalUsd == null || alternative.totalUsd < base.totalUsd);
  const recommended = cheaperAlt ? alternative! : base;
  const other = cheaperAlt ? base : alternative;

  const f = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 1 });
  const describe = (o: SizingOption) =>
    o.part
      ? `${o.cells} × ${o.part.partNumber} (${o.part.label}) = $${f(o.totalUsd!)} USD`
      : `${o.cells} celdas: ${f(o.designLb)} lb por celda excede 10 klb, no hay 350N que aplique`;
  const lines = [
    `(${f(input.capacityLb)} + ${f(input.deadLoadLb)} lb) ÷ ${base.cells} celdas = ${f(base.perCellLb)} lb por celda`,
    `× ${factor}${input.impact ? ' (con impacto)' : ''} = ${f(base.designLb)} lb de diseño por celda`,
    `Opción base: ${describe(base)}`,
  ];
  if (alternative) lines.push(`Comparativo arriba de 5 klb: ${describe(alternative)}`);
  lines.push(`Recomendado: ${describe(recommended)}${other ? ` (más económico que ${describe(other)})` : ''}`);
  return { factor, recommended, alternative, explanation: lines.join('\n') };
}

export interface QuoteLineInput {
  partNumber: string;
  qty: number;
}

export interface PricedLine {
  partNumber: string;
  description: string;
  qty: number;
  unitUsd: number;
  totalUsd: number;
}

export class UnknownPartError extends Error {
  constructor(public readonly partNumbers: string[]) {
    super(`unknown_part: ${partNumbers.join(', ')}`);
    this.name = 'UnknownPartError';
  }
}

/** Prices each line from the catalogue. Unknown parts reject the whole quote
 * so the agent has to correct itself rather than ship a half-priced PDF. */
export function priceLines(lines: QuoteLineInput[]): { lines: PricedLine[]; totalUsd: number; alerts: string[] } {
  const unknown = lines.filter((l) => !findPart(l.partNumber)).map((l) => l.partNumber);
  if (unknown.length) throw new UnknownPartError(unknown);
  const alerts: string[] = [];
  const priced = lines.map((l) => {
    const part = findPart(l.partNumber)!;
    if (part.unconfirmedVariant && !alerts.includes(SE_ALERT)) alerts.push(SE_ALERT);
    const qty = Math.min(999, Math.max(1, Math.round(l.qty)));
    return {
      partNumber: part.partNumber,
      description: `Celda de carga tipo viga (shear beam) Utilcell 350N, acero niquelado, ${part.label}`,
      qty,
      unitUsd: part.priceUsd,
      totalUsd: part.priceUsd * qty,
    };
  });
  return { lines: priced, totalUsd: priced.reduce((s, l) => s + l.totalUsd, 0), alerts };
}
