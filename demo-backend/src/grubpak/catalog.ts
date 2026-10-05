// Grubpak catalogue and the arithmetic the agent must not do itself: pack
// counts, the "arma tu paquete" discount, how long an order lasts, lead
// score. Names, pack sizes and "desde" prices are from grubpak.com
// (Oct 2026); variant ids are invented for the mocked Shopify cart.

export type ProductKey = 'bowl' | 'noodle' | 'charola' | 'lunch' | 'recipiente';

export interface Product {
  key: ProductKey;
  name: string;
  pack: number;
  priceMxn: number;
  variantId: number;
  fits: string;
}

export const PRODUCTS: Record<ProductKey, Product> = {
  bowl: { key: 'bowl', name: 'Bowl con tapa', pack: 100, priceMxn: 899, variantId: 44120001, fits: 'ensaladas, bowls, poke, postres en porción' },
  noodle: { key: 'noodle', name: 'Noodle Box', pack: 100, priceMxn: 589, variantId: 44120002, fits: 'noodles, arroz, comida oriental, papas, botanas' },
  charola: { key: 'charola', name: 'Charola', pack: 200, priceMxn: 469, variantId: 44120003, fits: 'tacos, antojitos, pan, postres, piezas secas' },
  lunch: { key: 'lunch', name: 'Lunch Box 750ml', pack: 450, priceMxn: 1849, variantId: 44120004, fits: 'platos fuertes, comida corrida, menús con guarnición' },
  recipiente: { key: 'recipiente', name: 'Recipiente con tapa', pack: 100, priceMxn: 929, variantId: 44120005, fits: 'sopas, caldos, guisados con salsa, porciones con líquido' },
};
export const PRODUCT_KEYS = Object.keys(PRODUCTS) as ProductKey[];

/** "Arma tu paquete": 3 distinct products 10%, 4 or more 15%. */
export function bundleRate(distinct: number): number {
  return distinct >= 4 ? 0.15 : distinct >= 3 ? 0.1 : 0;
}

export interface CartLine {
  key: ProductKey;
  name: string;
  packs: number;
  pieces: number;
  unitMxn: number;
  totalMxn: number;
}

export interface Cart {
  lines: CartLine[];
  subtotalMxn: number;
  discountRate: number;
  discountMxn: number;
  totalMxn: number;
  supplyDays: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Splits `days` of daily orders evenly across the chosen products and rounds
 * each up to whole packs. `overrides` (packs per product) win over the split. */
export function buildCart(input: { ordersPerDay: number; products: ProductKey[]; days: number; overrides?: Partial<Record<ProductKey, number>> }): Cart {
  const keys = [...new Set(input.products)];
  const share = (input.ordersPerDay * input.days) / Math.max(1, keys.length);
  const lines = keys
    .map((key): CartLine => {
      const p = PRODUCTS[key];
      const packs = input.overrides?.[key] ?? Math.max(1, Math.ceil(share / p.pack));
      return { key, name: p.name, packs, pieces: packs * p.pack, unitMxn: p.priceMxn, totalMxn: packs * p.priceMxn };
    })
    .filter((l) => l.packs > 0);
  const subtotalMxn = lines.reduce((s, l) => s + l.totalMxn, 0);
  const discountRate = bundleRate(lines.length);
  const discountMxn = round2(subtotalMxn * discountRate);
  return {
    lines,
    subtotalMxn,
    discountRate,
    discountMxn,
    totalMxn: round2(subtotalMxn - discountMxn),
    supplyDays: supplyDays(lines, input.ordersPerDay),
  };
}

/** Days until the first product runs out: one container per order, orders
 * split evenly across the products in the cart. */
export function supplyDays(lines: CartLine[], ordersPerDay: number): number {
  if (!lines.length || ordersPerDay <= 0) return 14;
  const perProductPerDay = ordersPerDay / lines.length;
  return Math.max(3, Math.floor(Math.min(...lines.map((l) => l.pieces / perProductPerDay))));
}

export type Urgency = 'esta_semana' | 'este_mes' | 'cotizando';
export type Tier = 'caliente' | 'tibio' | 'frio';

/** Deterministic lead score so the console shows the same number for the
 * same answers: volume, urgency, and how ready they are to switch. */
export function scoreLead(input: { ordersPerDay: number; urgency: Urgency; currentPackaging: string }): { score: number; tier: Tier; wholesale: boolean } {
  const d = input.ordersPerDay;
  const vol = d >= 300 ? 50 : d >= 100 ? 40 : d >= 30 ? 25 : 10;
  const urg = { esta_semana: 30, este_mes: 20, cotizando: 5 }[input.urgency];
  const cur = /biodegrad|ecol|otra marca|compost/i.test(input.currentPackaging) ? 20 : /unicel|plástico|plastico/i.test(input.currentPackaging) ? 15 : 10;
  const score = Math.min(100, vol + urg + cur);
  return { score, tier: score >= 70 ? 'caliente' : score >= 45 ? 'tibio' : 'frio', wholesale: d >= 300 };
}

export function cartPermalink(cart: Cart, leadId: string): string {
  const items = cart.lines.map((l) => `${PRODUCTS[l.key].variantId}:${l.packs}`).join(',');
  return `https://grubpak.com/cart/${items}?attributes[lead_id]=${leadId}&utm_source=agente&utm_medium=chat`;
}

export const mxn = (n: number) => `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`;
