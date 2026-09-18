'use server';

import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth/current-user';
import { db } from '@/services';
import type { ActionState } from '@/features/auth/state';

export async function redeemCouponAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { status: 'error', message: 'Sessão expirada. Entre novamente.' };

  const coupon = await db.club.redeem(String(formData.get('couponId') ?? ''), user.id);
  if (!coupon) return { status: 'error', message: 'Este cupom não está mais disponível.' };

  revalidatePath('/conta/clube');
  return { status: 'success', message: coupon.code };
}
