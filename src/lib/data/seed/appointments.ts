import type { Appointment, Subscription, SubscriptionInvoice } from '@/types';
import { addDays, addMinutes, todayDateString } from '@/lib/utils/date';

const now = '2026-01-05T12:00:00.000Z';

interface Draft {
  id: string;
  clientId: string;
  barberId: string;
  serviceId: string;
  dayOffset: number;
  startTime: string;
  durationInMinutes: number;
  status: Appointment['status'];
  priceInCents: number;
  notes?: string;
  paid?: boolean;
}

const drafts: Draft[] = [
  { id: 'apt_1001', clientId: 'usr_cliente_1', barberId: 'brb_falcao', serviceId: 'svc_corte_barba', dayOffset: 0, startTime: '10:00', durationInMinutes: 70, status: 'confirmed', priceInCents: 9000, notes: 'Degradê baixo, barba alinhada.' },
  { id: 'apt_1002', clientId: 'usr_cliente_2', barberId: 'brb_falcao', serviceId: 'svc_corte', dayOffset: 0, startTime: '11:30', durationInMinutes: 40, status: 'in_progress', priceInCents: 5500 },
  { id: 'apt_1003', clientId: 'usr_cliente_3', barberId: 'brb_falcao', serviceId: 'svc_barba', dayOffset: 0, startTime: '14:00', durationInMinutes: 40, status: 'confirmed', priceInCents: 4500, notes: 'Alérgico a mentol.' },
  { id: 'apt_1004', clientId: 'usr_cliente_4', barberId: 'brb_falcao', serviceId: 'svc_corte', dayOffset: 0, startTime: '16:00', durationInMinutes: 40, status: 'pending', priceInCents: 5500 },
  { id: 'apt_1005', clientId: 'usr_cliente_2', barberId: 'brb_lucas', serviceId: 'svc_corte', dayOffset: 0, startTime: '09:30', durationInMinutes: 40, status: 'completed', priceInCents: 5500, paid: true },
  { id: 'apt_1006', clientId: 'usr_cliente_1', barberId: 'brb_falcao', serviceId: 'svc_corte', dayOffset: 3, startTime: '15:00', durationInMinutes: 40, status: 'confirmed', priceInCents: 5500 },
  { id: 'apt_1007', clientId: 'usr_cliente_3', barberId: 'brb_lucas', serviceId: 'svc_corte_barba', dayOffset: 1, startTime: '10:30', durationInMinutes: 70, status: 'confirmed', priceInCents: 9000 },
  { id: 'apt_1008', clientId: 'usr_cliente_4', barberId: 'brb_diego', serviceId: 'svc_platinado', dayOffset: 2, startTime: '13:00', durationInMinutes: 180, status: 'confirmed', priceInCents: 22000 },
  { id: 'apt_1009', clientId: 'usr_cliente_1', barberId: 'brb_falcao', serviceId: 'svc_corte_barba', dayOffset: -14, startTime: '10:00', durationInMinutes: 70, status: 'completed', priceInCents: 9000, paid: true },
  { id: 'apt_1010', clientId: 'usr_cliente_1', barberId: 'brb_falcao', serviceId: 'svc_corte', dayOffset: -30, startTime: '18:00', durationInMinutes: 40, status: 'completed', priceInCents: 5500, paid: true },
  { id: 'apt_1011', clientId: 'usr_cliente_1', barberId: 'brb_lucas', serviceId: 'svc_pezinho', dayOffset: -44, startTime: '09:00', durationInMinutes: 20, status: 'no_show', priceInCents: 2500 },
];

export function buildAppointmentsSeed(): Appointment[] {
  const today = todayDateString();

  return drafts.map((draft, index) => {
    const date = addDays(today, draft.dayOffset);
    return {
      id: draft.id,
      code: `FLC-${String(1000 + index)}`,
      clientId: draft.clientId,
      barberId: draft.barberId,
      serviceId: draft.serviceId,
      date,
      startTime: draft.startTime,
      endTime: addMinutes(draft.startTime, draft.durationInMinutes),
      status: draft.status,
      priceInCents: draft.priceInCents,
      payment: {
        method: draft.paid ? 'credit_card' : 'cash',
        status: draft.paid ? 'paid' : 'pending',
        amountInCents: draft.priceInCents,
      },
      notes: draft.notes,
      createdAt: now,
      updatedAt: now,
    } satisfies Appointment;
  });
}

export function buildSubscriptionsSeed(): Subscription[] {
  const today = todayDateString();
  const cycleStart = addDays(today, -12);
  const cycleEnd = addDays(today, 18);

  return [
    {
      id: 'sub_1',
      userId: 'usr_cliente_1',
      planId: 'plan_corte_barba_ilimitado',
      status: 'active',
      startedAt: `${addDays(today, -102)}T12:00:00.000Z`,
      currentPeriodStart: `${cycleStart}T12:00:00.000Z`,
      currentPeriodEnd: `${cycleEnd}T12:00:00.000Z`,
      nextChargeAt: `${cycleEnd}T12:00:00.000Z`,
      autoRenew: true,
      usage: {
        haircutsUsed: 2,
        beardsUsed: 1,
        cycleStart: `${cycleStart}T12:00:00.000Z`,
        cycleEnd: `${cycleEnd}T12:00:00.000Z`,
      },
      createdAt: now,
      updatedAt: now,
    },
  ];
}

export function buildInvoicesSeed(): SubscriptionInvoice[] {
  const today = todayDateString();
  return [
    { id: 'inv_3', subscriptionId: 'sub_1', amountInCents: 12990, status: 'paid', dueDate: `${addDays(today, -12)}T12:00:00.000Z`, paidAt: `${addDays(today, -12)}T12:04:00.000Z`, method: 'credit_card' },
    { id: 'inv_2', subscriptionId: 'sub_1', amountInCents: 12990, status: 'paid', dueDate: `${addDays(today, -42)}T12:00:00.000Z`, paidAt: `${addDays(today, -42)}T12:02:00.000Z`, method: 'pix' },
    { id: 'inv_1', subscriptionId: 'sub_1', amountInCents: 12990, status: 'paid', dueDate: `${addDays(today, -72)}T12:00:00.000Z`, paidAt: `${addDays(today, -72)}T12:10:00.000Z`, method: 'pix' },
  ];
}
