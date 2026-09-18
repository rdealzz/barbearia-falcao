import type {
  Appointment,
  AppointmentStatus,
  Barber,
  ClubCoupon,
  CreateAppointmentInput,
  DateString,
  ID,
  Plan,
  Service,
  Subscription,
  SubscriptionInvoice,
  TimeOff,
  User,
} from '@/types';

/**
 * Contratos da camada de dados. A aplicação depende apenas destas interfaces,
 * o que permite trocar o provider (mock → Prisma/Supabase) sem tocar na UI.
 */

export interface ServiceRepository {
  list(options?: { onlyActive?: boolean; featured?: boolean }): Promise<Service[]>;
  findById(id: ID): Promise<Service | null>;
  findBySlug(slug: string): Promise<Service | null>;
  findManyByIds(ids: ID[]): Promise<Service[]>;
}

export interface BarberRepository {
  list(options?: { onlyActive?: boolean; serviceId?: ID }): Promise<Barber[]>;
  findById(id: ID): Promise<Barber | null>;
  findBySlug(slug: string): Promise<Barber | null>;
  listTimeOff(barberId: ID): Promise<TimeOff[]>;
  createTimeOff(input: Omit<TimeOff, 'id'>): Promise<TimeOff>;
}

export interface AppointmentRepository {
  create(input: CreateAppointmentInput & { endTime: string; priceInCents: number }): Promise<Appointment>;
  findById(id: ID): Promise<Appointment | null>;
  listByClient(clientId: ID): Promise<Appointment[]>;
  listByBarber(barberId: ID, options?: { from?: DateString; to?: DateString }): Promise<Appointment[]>;
  listByBarberAndDate(barberId: ID, date: DateString): Promise<Appointment[]>;
  updateStatus(id: ID, status: AppointmentStatus, reason?: string): Promise<Appointment | null>;
  update(id: ID, patch: Partial<Appointment>): Promise<Appointment | null>;
}

export interface UserRepository {
  findById(id: ID): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findManyByIds(ids: ID[]): Promise<User[]>;
  create(input: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { password?: string }): Promise<User>;
  update(id: ID, patch: Partial<User>): Promise<User | null>;
  verifyPassword(email: string, password: string): Promise<User | null>;
  updatePassword(id: ID, password: string): Promise<boolean>;
}

export interface PlanRepository {
  list(options?: { onlyActive?: boolean }): Promise<Plan[]>;
  findById(id: ID): Promise<Plan | null>;
  findBySlug(slug: string): Promise<Plan | null>;
  findActiveSubscription(userId: ID): Promise<Subscription | null>;
  listInvoices(subscriptionId: ID): Promise<SubscriptionInvoice[]>;
  /** Preparado para o ASAAS: hoje apenas registra a intenção de assinatura. */
  createSubscription(userId: ID, planId: ID): Promise<Subscription>;
  cancelSubscription(subscriptionId: ID): Promise<Subscription | null>;
}

export interface ClubRepository {
  listCoupons(userId?: ID): Promise<ClubCoupon[]>;
  redeem(couponId: ID, userId: ID): Promise<ClubCoupon | null>;
}

export interface Repositories {
  services: ServiceRepository;
  barbers: BarberRepository;
  appointments: AppointmentRepository;
  users: UserRepository;
  plans: PlanRepository;
  club: ClubRepository;
}
