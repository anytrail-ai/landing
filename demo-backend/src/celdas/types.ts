import type { Message } from '@aws-sdk/client-bedrock-runtime';
import type { PricedLine } from './catalog';

export type Decision = 'Cotizar 350N' | 'Referir a otro producto' | 'Escalar a humano';

export interface Summary {
  application: string;
  environment: string;
  replacementOrNew: string;
}

/** The brief's "formato de salida al vendedor", shown in the demo's side
 * panel as the handoff a salesperson would receive. */
export interface Handoff {
  decision: Decision;
  summary: Summary;
  referral: string | null;
  quoteFolio: string | null;
  pending: string[];
  alerts: string[];
  /** Set when the customer agreed to buy: what they accepted and what the
   * salesperson does next. Stops the follow-ups. */
  accepted: { detail: string; nextStep: string } | null;
}

export interface CeldasQuote {
  folio: string;
  date: string;
  company: string;
  customer: { name: string; company: string | null; email: string };
  summary: Summary;
  lines: PricedLine[];
  totalUsd: number;
  extras: string[];
  notes: string[];
}

export interface CeldasSession {
  sessionId: string;
  /** Full Converse history, thinking blocks and signatures included, append
   * only: replaying a turn's reasoning unchanged is what keeps it valid. */
  messages: Message[];
  userTurns: number;
  quote: CeldasQuote | null;
  emailedTo: string[];
  createdAt: string;
  /** Latest handoff, so a later acceptance can extend it. */
  handoff?: Handoff | null;
  /** Automatic follow-ups sent since the quote. Optional: sessions from
   * before follow-ups existed read as 0 / open. */
  followUps?: number;
  closed?: boolean;
  /** ISO time of the last customer message or agent follow-up. */
  lastActivityAt?: string;
}
