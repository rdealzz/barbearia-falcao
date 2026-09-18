import type { Subscription } from '@/types';
import type { PlanRepository } from '@/services/repositories';
import { nextId, store, timestamp } from '../store';

const MONTH_IN_MS = 30 * 24 * 60 * 60 * 1000;

export const mockPlanRepository: PlanRepository = {
  async list({ onlyActive = true } = {}) {
    return store.plans
      .filter((plan) => !onlyActive || plan.isActive)
      .sort((a, b) => a.priceInCents - b.priceInCents);
  },

  async findById(id) {
    return store.plans.find((plan) => plan.id === id) ?? null;
  },

  async findBySlug(slug) {
    return store.plans.find((plan) => plan.slug === slug) ?? null;
  },

  async findActiveSubscription(userId) {
    return (
      store.subscriptions.find(
        (subscription) =>
          subscription.userId === userId &&
          ['active', 'past_due', 'pending_payment'].includes(subscription.status),
      ) ?? null
    );
  },

  async listInvoices(subscriptionId) {
    return store.invoices
      .filter((invoice) => invoice.subscriptionId === subscriptionId)
      .sort((a, b) => b.dueDate.localeCompare(a.dueDate));
  },

  async createSubscription(userId, planId) {
    const start = new Date();
    const end = new Date(start.getTime() + MONTH_IN_MS);

    const subscription: Subscription = {
      id: nextId('sub'),
      userId,
      planId,
      status: 'pending_payment',
      startedAt: start.toISOString(),
      currentPeriodStart: start.toISOString(),
      currentPeriodEnd: end.toISOString(),
      nextChargeAt: end.toISOString(),
      autoRenew: true,
      usage: {
        haircutsUsed: 0,
        beardsUsed: 0,
        cycleStart: start.toISOString(),
        cycleEnd: end.toISOString(),
      },
      createdAt: timestamp(),
      updatedAt: timestamp(),
    };

    store.subscriptions.push(subscription);
    return subscription;
  },

  async cancelSubscription(subscriptionId) {
    const subscription = store.subscriptions.find((item) => item.id === subscriptionId);
    if (!subscription) return null;

    subscription.status = 'cancelled';
    subscription.autoRenew = false;
    subscription.cancelledAt = timestamp();
    subscription.updatedAt = timestamp();
    return subscription;
  },
};
