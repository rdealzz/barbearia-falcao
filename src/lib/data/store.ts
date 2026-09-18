import type {
  Appointment,
  Barber,
  ClubCoupon,
  Plan,
  Service,
  Subscription,
  SubscriptionInvoice,
  TimeOff,
  User,
} from '@/types';
import {
  barbersSeed,
  buildAppointmentsSeed,
  buildInvoicesSeed,
  buildSubscriptionsSeed,
  buildTimeOffSeed,
  couponsSeed,
  credentialsSeed,
  plansSeed,
  servicesSeed,
  usersSeed,
} from './seed';

export interface MemoryStore {
  services: Service[];
  barbers: Barber[];
  timeOff: TimeOff[];
  appointments: Appointment[];
  users: User[];
  credentials: Map<string, string>;
  plans: Plan[];
  subscriptions: Subscription[];
  invoices: SubscriptionInvoice[];
  coupons: ClubCoupon[];
}

function createStore(): MemoryStore {
  return {
    services: structuredClone(servicesSeed),
    barbers: structuredClone(barbersSeed),
    timeOff: buildTimeOffSeed(),
    appointments: buildAppointmentsSeed(),
    users: structuredClone(usersSeed),
    credentials: new Map(Object.entries(credentialsSeed)),
    plans: structuredClone(plansSeed),
    subscriptions: buildSubscriptionsSeed(),
    invoices: buildInvoicesSeed(),
    coupons: structuredClone(couponsSeed),
  };
}

const globalStore = globalThis as typeof globalThis & {
  __falcaoStore?: MemoryStore;
};

/**
 * Store em memória do provider "mock". Guardado no escopo global para
 * sobreviver ao hot reload em desenvolvimento.
 */
export const store: MemoryStore = globalStore.__falcaoStore ?? createStore();

if (process.env.NODE_ENV !== 'production') {
  globalStore.__falcaoStore = store;
}

let sequence = 0;
export function nextId(prefix: string): string {
  sequence += 1;
  return `${prefix}_${Date.now().toString(36)}${sequence.toString(36)}`;
}

export function timestamp(): string {
  return new Date().toISOString();
}
