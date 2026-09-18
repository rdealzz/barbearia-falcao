import type { ID, Timestamped } from './common';

export type PlanTier = 'bronze' | 'silver' | 'gold' | 'vip';
export type BillingCycle = 'monthly' | 'quarterly' | 'yearly';

export interface PlanBenefit {
  label: string;
  description?: string;
  included: boolean;
}

export interface Plan extends Timestamped {
  id: ID;
  slug: string;
  name: string;
  tier: PlanTier;
  tagline: string;
  description: string;
  priceInCents: number;
  billingCycle: BillingCycle;
  /** null = ilimitado no ciclo. */
  haircutsPerCycle: number | null;
  beardsPerCycle: number | null;
  /** Percentual de desconto nos demais serviços (0-100). */
  discountPercentage: number;
  /** Prioridade na fila de agendamento; maior vence. */
  priority: number;
  benefits: PlanBenefit[];
  /** Vagas restantes; null = sem limite. */
  seatsAvailable: number | null;
  isActive: boolean;
  isPopular: boolean;
  termsUrl?: string;
}

export type SubscriptionStatus =
  | 'active'
  | 'past_due'
  | 'cancelled'
  | 'paused'
  | 'pending_payment';

export interface SubscriptionUsage {
  haircutsUsed: number;
  beardsUsed: number;
  cycleStart: string;
  cycleEnd: string;
}

export interface Subscription extends Timestamped {
  id: ID;
  userId: ID;
  planId: ID;
  status: SubscriptionStatus;
  startedAt: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  nextChargeAt?: string;
  cancelledAt?: string;
  autoRenew: boolean;
  usage: SubscriptionUsage;
  /** Identificadores da integração futura com o ASAAS. */
  externalCustomerId?: string;
  externalSubscriptionId?: string;
}

export interface SubscriptionInvoice {
  id: ID;
  subscriptionId: ID;
  amountInCents: number;
  status: 'paid' | 'pending' | 'overdue' | 'refunded';
  dueDate: string;
  paidAt?: string;
  method?: 'pix' | 'credit_card' | 'boleto';
  receiptUrl?: string;
  externalId?: string;
}
