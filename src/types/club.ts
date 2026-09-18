import type { ID, Timestamped } from './common';

export type CouponStatus = 'available' | 'redeemed' | 'expired';

export interface ClubCoupon extends Timestamped {
  id: ID;
  title: string;
  description: string;
  /** Percentual ou valor fixo em centavos, conforme o tipo. */
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  /** Requisito mínimo de plano; null = aberto a todos. */
  requiredTier: import('./plan').PlanTier | null;
  status: CouponStatus;
  expiresInHours: number;
  code?: string;
  redeemedAt?: string;
  usageLimit: number;
}
