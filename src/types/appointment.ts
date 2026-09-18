import type { DateString, ID, TimeString, Timestamped } from './common';

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type PaymentMethod = 'pix' | 'credit_card' | 'boleto' | 'cash' | 'plan';
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed' | 'not_required';

export interface AppointmentPayment {
  method: PaymentMethod;
  status: PaymentStatus;
  amountInCents: number;
  /** Preenchido pela integração futura com o ASAAS. */
  externalId?: string;
  paidAt?: string;
}

export interface Appointment extends Timestamped {
  id: ID;
  code: string;
  clientId: ID;
  barberId: ID;
  serviceId: ID;
  date: DateString;
  startTime: TimeString;
  endTime: TimeString;
  status: AppointmentStatus;
  priceInCents: number;
  payment: AppointmentPayment;
  notes?: string;
  /** Quando o atendimento é consumido por uma assinatura. */
  subscriptionId?: ID;
  cancelledAt?: string;
  cancellationReason?: string;
}

export interface TimeSlot {
  time: TimeString;
  available: boolean;
  reason?: 'booked' | 'time_off' | 'past' | 'limit_reached' | 'closed';
}

export interface AvailabilityDay {
  date: DateString;
  slots: TimeSlot[];
  hasAvailability: boolean;
}

export interface CreateAppointmentInput {
  clientId: ID;
  barberId: ID;
  serviceId: ID;
  date: DateString;
  startTime: TimeString;
  notes?: string;
  paymentMethod?: import('./appointment').PaymentMethod;
}
