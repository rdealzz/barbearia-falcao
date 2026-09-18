import type { ClubCoupon } from '@/types';

const now = '2026-01-05T12:00:00.000Z';
const base = { createdAt: now, updatedAt: now, status: 'available' as const };

export const couponsSeed: ClubCoupon[] = [
  {
    ...base,
    id: 'cpn_pomada',
    title: '20% em pomadas e finalizadores',
    description: 'Desconto na linha de produtos da casa, válido na loja física.',
    discountType: 'percentage',
    discountValue: 20,
    requiredTier: null,
    expiresInHours: 48,
    usageLimit: 1,
  },
  {
    ...base,
    id: 'cpn_amigo',
    title: 'Traga um amigo: primeiro corte com 30% off',
    description: 'Cupom para indicar alguém que ainda não conhece a Falcão.',
    discountType: 'percentage',
    discountValue: 30,
    requiredTier: null,
    expiresInHours: 72,
    usageLimit: 2,
  },
  {
    ...base,
    id: 'cpn_sobrancelha',
    title: 'Sobrancelha cortesia',
    description: 'Design de sobrancelha sem custo junto ao seu próximo corte.',
    discountType: 'fixed',
    discountValue: 2000,
    requiredTier: 'gold',
    expiresInHours: 24,
    usageLimit: 1,
  },
  {
    ...base,
    id: 'cpn_hidratacao',
    title: 'Hidratação capilar por conta da casa',
    description: 'Exclusivo para assinantes do plano ilimitado.',
    discountType: 'fixed',
    discountValue: 4000,
    requiredTier: 'vip',
    expiresInHours: 24,
    usageLimit: 1,
  },
];
