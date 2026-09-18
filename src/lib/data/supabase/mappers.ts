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

 

/** "08:30:00" → "08:30" */
const time = (value: string): string => value.slice(0, 5);

export function toService(row: any): Service {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortDescription: row.short_description ?? '',
    description: row.description ?? '',
    category: row.category,
    priceInCents: row.price_in_cents,
    durationInMinutes: row.duration_in_minutes,
    imageUrl: row.image_url ?? undefined,
    highlights: row.highlights ?? [],
    isActive: row.is_active,
    isFeatured: row.is_featured,
    includedInPlanIds: row.included_in_plan_ids ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toBarber(row: any): Barber {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    nickname: row.nickname ?? undefined,
    role: row.role,
    staffRole: row.staff_role,
    bio: row.bio ?? '',
    headline: row.headline ?? '',
    avatarUrl: row.avatar_url ?? '',
    coverUrl: row.cover_url ?? undefined,
    specialties: row.specialties ?? [],
    experienceSince: row.experience_since ?? new Date().getFullYear(),
    instagramUrl: row.instagram_url ?? undefined,
    rating: Number(row.rating ?? 0),
    reviewsCount: row.reviews_count ?? 0,
    isActive: row.is_active,
    acceptsNewClients: row.accepts_new_clients,
    serviceIds: row.service_ids ?? [],
    workingHours: row.working_hours ?? [],
    scheduleSettings: row.schedule_settings ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toUser(row: any): User {
  return {
    id: row.id,
    role: row.role,
    staffRole: row.staff_role ?? undefined,
    name: row.name,
    email: row.email,
    phone: row.phone ?? '',
    document: row.document ?? undefined,
    birthDate: row.birth_date ?? undefined,
    avatarUrl: row.avatar_url ?? '',
    address: row.address ?? undefined,
    barberId: row.barber_id ?? undefined,
    notes: row.notes ?? undefined,
    emailVerified: row.email_verified,
    marketingOptIn: row.marketing_opt_in,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function fromUser(patch: Partial<User>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (patch.role !== undefined) row.role = patch.role;
  if (patch.staffRole !== undefined) row.staff_role = patch.staffRole;
  if (patch.name !== undefined) row.name = patch.name;
  if (patch.email !== undefined) row.email = patch.email;
  if (patch.phone !== undefined) row.phone = patch.phone;
  if (patch.document !== undefined) row.document = patch.document;
  if (patch.birthDate !== undefined) row.birth_date = patch.birthDate || null;
  if (patch.avatarUrl !== undefined) row.avatar_url = patch.avatarUrl;
  if (patch.address !== undefined) row.address = patch.address;
  if (patch.barberId !== undefined) row.barber_id = patch.barberId;
  if (patch.notes !== undefined) row.notes = patch.notes;
  if (patch.emailVerified !== undefined) row.email_verified = patch.emailVerified;
  if (patch.marketingOptIn !== undefined) row.marketing_opt_in = patch.marketingOptIn;
  return row;
}

export function toAppointment(row: any): Appointment {
  return {
    id: row.id,
    code: row.code,
    clientId: row.client_id ?? '',
    barberId: row.barber_id,
    serviceId: row.service_id ?? '',
    date: row.date,
    startTime: time(row.start_time),
    endTime: time(row.end_time),
    status: row.status,
    priceInCents: row.price_in_cents,
    payment: {
      method: row.payment_method,
      status: row.payment_status,
      amountInCents: row.payment_amount,
      externalId: row.payment_external_id ?? undefined,
      paidAt: row.paid_at ?? undefined,
    },
    notes: row.notes ?? undefined,
    isManual: row.is_manual ?? false,
    manualClientName: row.manual_client_name ?? undefined,
    subscriptionId: row.subscription_id ?? undefined,
    cancelledAt: row.cancelled_at ?? undefined,
    cancellationReason: row.cancellation_reason ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function fromAppointment(patch: Partial<Appointment>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.date !== undefined) row.date = patch.date;
  if (patch.startTime !== undefined) row.start_time = patch.startTime;
  if (patch.endTime !== undefined) row.end_time = patch.endTime;
  if (patch.notes !== undefined) row.notes = patch.notes;
  if (patch.priceInCents !== undefined) row.price_in_cents = patch.priceInCents;
  if (patch.cancelledAt !== undefined) row.cancelled_at = patch.cancelledAt;
  if (patch.cancellationReason !== undefined) row.cancellation_reason = patch.cancellationReason;
  if (patch.payment) {
    row.payment_method = patch.payment.method;
    row.payment_status = patch.payment.status;
    row.payment_amount = patch.payment.amountInCents;
    if (patch.payment.paidAt !== undefined) row.paid_at = patch.payment.paidAt;
  }
  return row;
}

export function toTimeOff(row: any): TimeOff {
  return {
    id: row.id,
    barberId: row.barber_id,
    reason: row.reason,
    start: row.start_date,
    end: row.end_date,
    startTime: row.start_time ? time(row.start_time) : undefined,
    endTime: row.end_time ? time(row.end_time) : undefined,
    note: row.note ?? undefined,
  };
}

export function toPlan(row: any): Plan {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tier: row.tier,
    tagline: row.tagline ?? '',
    description: row.description ?? '',
    priceInCents: row.price_in_cents,
    billingCycle: row.billing_cycle,
    haircutsPerCycle: row.haircuts_per_cycle,
    beardsPerCycle: row.beards_per_cycle,
    discountPercentage: row.discount_percentage,
    priority: row.priority,
    benefits: row.benefits ?? [],
    seatsAvailable: row.seats_available,
    isActive: row.is_active,
    isPopular: row.is_popular,
    termsUrl: row.terms_url ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toSubscription(row: any): Subscription {
  return {
    id: row.id,
    userId: row.user_id,
    planId: row.plan_id,
    status: row.status,
    startedAt: row.started_at,
    currentPeriodStart: row.current_period_start,
    currentPeriodEnd: row.current_period_end,
    nextChargeAt: row.next_charge_at ?? undefined,
    cancelledAt: row.cancelled_at ?? undefined,
    autoRenew: row.auto_renew,
    usage: {
      haircutsUsed: row.haircuts_used ?? 0,
      beardsUsed: row.beards_used ?? 0,
      cycleStart: row.current_period_start,
      cycleEnd: row.current_period_end,
    },
    externalCustomerId: row.external_customer_id ?? undefined,
    externalSubscriptionId: row.external_subscription_id ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toInvoice(row: any): SubscriptionInvoice {
  return {
    id: row.id,
    subscriptionId: row.subscription_id,
    amountInCents: row.amount_in_cents,
    status: row.status,
    dueDate: row.due_date,
    paidAt: row.paid_at ?? undefined,
    method: row.method ?? undefined,
    receiptUrl: row.receipt_url ?? undefined,
    externalId: row.external_id ?? undefined,
  };
}

export function toCoupon(row: any, redeemedAt?: string): ClubCoupon {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    discountType: row.discount_type,
    discountValue: row.discount_value,
    requiredTier: row.required_tier ?? null,
    status: redeemedAt ? 'redeemed' : row.status,
    expiresInHours: row.expires_in_hours,
    code: row.code ?? undefined,
    redeemedAt,
    usageLimit: row.usage_limit,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
