import type { ClubRepository } from '@/services/repositories';
import { store, timestamp } from '../store';

export const mockClubRepository: ClubRepository = {
  async listCoupons() {
    return store.coupons;
  },

  async redeem(couponId) {
    const coupon = store.coupons.find((item) => item.id === couponId);
    if (!coupon || coupon.status !== 'available') return null;

    coupon.status = 'redeemed';
    coupon.redeemedAt = timestamp();
    coupon.code = `FALCAO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    coupon.updatedAt = timestamp();
    return coupon;
  },
};
