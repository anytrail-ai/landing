import type { Message } from '@aws-sdk/client-bedrock-runtime';
import type { Cart, Tier, Urgency } from './catalog';

export interface GrubpakLead {
  id: string;
  name: string;
  business: string;
  businessType: string;
  whatsapp: string;
  ordersPerDay: number;
  serves: string[];
  currentPackaging: string;
  urgency: Urgency;
  score: number;
  tier: Tier;
  wholesale: boolean;
}

export type Channel = 'wa' | 'email';
export type StepAction = 'cart' | 'resume' | 'reorder' | null;

export interface SequenceStep {
  id: string;
  title: string;
  channel: Channel;
  subject: string | null;
  action: StepAction;
  /** What the agent should write; never shown to the customer. */
  instruction: string;
  /** Simulated-clock ISO time. */
  at: string;
  status: 'pending' | 'sent' | 'cancelled';
  reason?: string;
}

export type SequenceName = 'sin_clic' | 'carrito_abandonado' | 'post_compra';

export interface Sequence {
  id: string;
  name: SequenceName;
  label: string;
  startedAt: string;
  steps: SequenceStep[];
}

export interface GrubpakOrder {
  number: string;
  totalMxn: number;
  at: string;
}

export interface GrubpakSession {
  sessionId: string;
  /** Full Converse history, thinking blocks and signatures included. */
  messages: Message[];
  userTurns: number;
  lead: GrubpakLead | null;
  cart: Cart | null;
  checkoutUrl: string | null;
  orders: GrubpakOrder[];
  sequences: Sequence[];
  /** Store events the agent has not been told about yet; prefixed to its
   * next turn so it knows whether the customer bought. */
  notes: string[];
  lastFollowUpAt?: string;
  createdAt: string;
}
