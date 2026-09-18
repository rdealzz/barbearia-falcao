'use server';

import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth/current-user';
import { db } from '@/services';
import type { ActionState } from '@/features/auth/state';

/**
 * Registra a intenção de assinatura. A cobrança recorrente será criada no
 * ASAAS quando a integração de pagamentos for ativada — o restante do fluxo
 * (status, ciclo, uso) já está modelado.
 */
export async function subscribeToPlanAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { status: 'error', message: 'Sessão expirada. Entre novamente.' };

  const planId = String(formData.get('planId') ?? '');
  const plan = await db.plans.findById(planId);
  if (!plan) return { status: 'error', message: 'Plano não encontrado.' };

  const current = await db.plans.findActiveSubscription(user.id);
  if (current) {
    return { status: 'error', message: 'Você já possui uma assinatura ativa.' };
  }

  await db.plans.createSubscription(user.id, planId);
  revalidatePath('/conta', 'layout');

  return {
    status: 'success',
    message: 'Assinatura registrada. O pagamento será liberado assim que a integração for ativada.',
  };
}

export async function cancelSubscriptionAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { status: 'error', message: 'Sessão expirada. Entre novamente.' };

  const subscription = await db.plans.findActiveSubscription(user.id);
  const subscriptionId = String(formData.get('subscriptionId') ?? '');

  if (!subscription || subscription.id !== subscriptionId) {
    return { status: 'error', message: 'Assinatura não encontrada.' };
  }

  await db.plans.cancelSubscription(subscription.id);
  revalidatePath('/conta', 'layout');

  return { status: 'success', message: 'Assinatura cancelada.' };
}
