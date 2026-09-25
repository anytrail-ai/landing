export interface CatalogItem {
  id: string;
  sku: string | null;
  name: string;
  description: string | null;
  /** Integer cents, or null when the catalogue does not state a price. */
  priceCents: number | null;
}

/** A catalogue before it is stored (no id yet). */
export interface CatalogBody {
  supplier: string;
  supplierEmail: string | null;
  currency: string;
  items: CatalogItem[];
}

export interface Catalog extends CatalogBody {
  catalogId: string;
}

export type LineStatus = 'priced' | 'unpriced' | 'no_match';

export interface QuoteLine {
  itemId: string | null;
  /** What the customer asked for, as extracted from the conversation. */
  query: string;
  /** Catalogue name when matched, else the query. */
  name: string;
  sku: string | null;
  qty: number;
  unitCents: number | null;
  status: LineStatus;
  /** True once the price came from the supplier's answer. */
  fromSupplier?: boolean;
}

export interface Quote {
  quoteId: string;
  sessionId: string;
  catalogId: string;
  currency: string;
  lines: QuoteLine[];
  priceRequestId: string | null;
  createdAt: string;
}

export interface PriceRequestItem {
  lineIndex: number;
  name: string;
  sku: string | null;
  qty: number;
}

export interface PriceRequest {
  token: string;
  quoteId: string;
  catalogId: string;
  supplier: string;
  currency: string;
  to: string;
  subject: string;
  body: string;
  items: PriceRequestItem[];
  status: 'pending' | 'answered';
  remindersSent: number;
  /** Epoch ms. */
  nextReminderAt: number;
  createdAt: string;
  answeredAt?: string;
}
