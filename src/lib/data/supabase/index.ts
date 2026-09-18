import 'server-only';
import type { Repositories } from '@/services/repositories';
import type { Appointment, ClubCoupon, User } from '@/types';
import { newId, supabase, unwrap, unwrapMany } from './client';
import {
  fromAppointment,
  fromUser,
  toAppointment,
  toBarber,
  toCoupon,
  toInvoice,
  toPlan,
  toService,
  toSubscription,
  toTimeOff,
  toUser,
} from './mappers';

const normalizeEmail = (email: string) => email.trim().toLowerCase();

/**
 * Implementação da camada de dados sobre o schema `barbearia` do Supabase.
 * Os contratos são os mesmos do provider mock, então nenhuma tela muda.
 */
export const supabaseRepositories: Repositories = {
  services: {
    async list({ onlyActive = true, featured } = {}) {
      let query = supabase().from('services').select('*').order('sort_order');
      if (onlyActive) query = query.eq('is_active', true);
      if (featured !== undefined) query = query.eq('is_featured', featured);
      return unwrapMany(await query).map(toService);
    },

    async findById(id) {
      const row = unwrap(await supabase().from('services').select('*').eq('id', id).maybeSingle());
      return row ? toService(row) : null;
    },

    async findBySlug(slug) {
      const row = unwrap(
        await supabase().from('services').select('*').eq('slug', slug).maybeSingle(),
      );
      return row ? toService(row) : null;
    },

    async findManyByIds(ids) {
      if (ids.length === 0) return [];
      return unwrapMany(
        await supabase().from('services').select('*').in('id', ids).order('sort_order'),
      ).map(toService);
    },
  },

  barbers: {
    async list({ onlyActive = true, serviceId } = {}) {
      let query = supabase().from('barbers').select('*').order('sort_order');
      if (onlyActive) query = query.eq('is_active', true);
      if (serviceId) query = query.contains('service_ids', [serviceId]);
      return unwrapMany(await query).map(toBarber);
    },

    async findById(id) {
      const row = unwrap(await supabase().from('barbers').select('*').eq('id', id).maybeSingle());
      return row ? toBarber(row) : null;
    },

    async findBySlug(slug) {
      const row = unwrap(
        await supabase().from('barbers').select('*').eq('slug', slug).maybeSingle(),
      );
      return row ? toBarber(row) : null;
    },

    async listTimeOff(barberId, { from, to } = {}) {
      let query = supabase()
        .from('time_off')
        .select('*')
        .eq('barber_id', barberId)
        .order('start_date');
      // Sobreposição de intervalos: começa antes do fim e termina depois do início.
      if (to) query = query.lte('start_date', to);
      if (from) query = query.gte('end_date', from);
      return unwrapMany(await query).map(toTimeOff);
    },

    async findTimeOffById(id) {
      const row = unwrap(await supabase().from('time_off').select('*').eq('id', id).maybeSingle());
      return row ? toTimeOff(row) : null;
    },

    async createTimeOff(input) {
      const row = unwrap(
        await supabase()
          .from('time_off')
          .insert({
            id: newId('off'),
            barber_id: input.barberId,
            reason: input.reason,
            start_date: input.start,
            end_date: input.end,
            start_time: input.startTime ?? null,
            end_time: input.endTime ?? null,
            note: input.note ?? null,
          })
          .select('*')
          .single(),
      );
      return toTimeOff(row);
    },

    async deleteTimeOff(id) {
      const { error } = await supabase().from('time_off').delete().eq('id', id);
      if (error) throw new Error(`[supabase] ${error.message}`);
      return true;
    },
  },

  appointments: {
    async create(input) {
      const row = unwrap(
        await supabase()
          .from('appointments')
          .insert({
            id: newId('apt'),
            code: `FLC-${Math.floor(1000 + Math.random() * 9000)}`,
            client_id: input.clientId || null,
            barber_id: input.barberId,
            service_id: input.serviceId,
            date: input.date,
            start_time: input.startTime,
            end_time: input.endTime,
            status: 'confirmed',
            price_in_cents: input.priceInCents,
            payment_method: input.paymentMethod ?? 'cash',
            payment_status: input.paymentMethod === 'plan' ? 'not_required' : 'pending',
            payment_amount: input.priceInCents,
            notes: input.notes ?? null,
            is_manual: input.isManual ?? false,
            manual_client_name: input.manualClientName ?? null,
          })
          .select('*')
          .single(),
      );
      return toAppointment(row);
    },

    async findById(id) {
      const row = unwrap(
        await supabase().from('appointments').select('*').eq('id', id).maybeSingle(),
      );
      return row ? toAppointment(row) : null;
    },

    async listByClient(clientId) {
      return unwrapMany(
        await supabase()
          .from('appointments')
          .select('*')
          .eq('client_id', clientId)
          .order('date', { ascending: false })
          .order('start_time', { ascending: false }),
      ).map(toAppointment);
    },

    async listByBarber(barberId, { from, to } = {}) {
      let query = supabase()
        .from('appointments')
        .select('*')
        .eq('barber_id', barberId)
        .order('date')
        .order('start_time');
      if (from) query = query.gte('date', from);
      if (to) query = query.lte('date', to);
      return unwrapMany(await query).map(toAppointment);
    },

    async listByBarberAndDate(barberId, date) {
      return unwrapMany(
        await supabase()
          .from('appointments')
          .select('*')
          .eq('barber_id', barberId)
          .eq('date', date)
          .order('start_time'),
      ).map(toAppointment);
    },

    async listByDate(date) {
      return unwrapMany(
        await supabase().from('appointments').select('*').eq('date', date).order('start_time'),
      ).map(toAppointment);
    },

    async updateStatus(id, status, reason) {
      const patch: Record<string, unknown> = { status };
      if (status === 'cancelled') {
        patch.cancelled_at = new Date().toISOString();
        patch.cancellation_reason = reason ?? null;
      }
      const row = unwrap(
        await supabase().from('appointments').update(patch).eq('id', id).select('*').maybeSingle(),
      );
      return row ? toAppointment(row) : null;
    },

    async update(id, patch: Partial<Appointment>) {
      const row = unwrap(
        await supabase()
          .from('appointments')
          .update(fromAppointment(patch))
          .eq('id', id)
          .select('*')
          .maybeSingle(),
      );
      return row ? toAppointment(row) : null;
    },
  },

  users: {
    async list({ role, search } = {}) {
      let query = supabase().from('profiles').select('*').order('name');
      if (role) query = query.eq('role', role);
      if (search?.trim()) {
        const term = `%${search.trim()}%`;
        query = query.or(`name.ilike.${term},email.ilike.${term},phone.ilike.${term}`);
      }
      return unwrapMany(await query).map(toUser);
    },

    async findById(id) {
      const row = unwrap(await supabase().from('profiles').select('*').eq('id', id).maybeSingle());
      return row ? toUser(row) : null;
    },

    async findByEmail(email) {
      const row = unwrap(
        await supabase()
          .from('profiles')
          .select('*')
          .ilike('email', normalizeEmail(email))
          .maybeSingle(),
      );
      return row ? toUser(row) : null;
    },

    async findManyByIds(ids) {
      const valid = ids.filter(Boolean);
      if (valid.length === 0) return [];
      return unwrapMany(await supabase().from('profiles').select('*').in('id', valid)).map(toUser);
    },

    async create({ password, ...input }) {
      const client = supabase();
      const passwordHash = password
        ? unwrap(await client.rpc('hash_password', { plain: password }))
        : null;

      const row = unwrap(
        await client
          .from('profiles')
          .insert({
            id: newId('usr'),
            ...fromUser(input as Partial<User>),
            email: normalizeEmail(input.email),
            password_hash: passwordHash,
          })
          .select('*')
          .single(),
      );
      return toUser(row);
    },

    async update(id, patch) {
      const row = unwrap(
        await supabase()
          .from('profiles')
          .update(fromUser(patch))
          .eq('id', id)
          .select('*')
          .maybeSingle(),
      );
      return row ? toUser(row) : null;
    },

    async verifyPassword(email, password) {
      const client = supabase();
      const userId = unwrap(
        await client.rpc('verify_password', { p_email: email, p_password: password }),
      );
      if (!userId) return null;

      const row = unwrap(
        await client.from('profiles').select('*').eq('id', userId as string).maybeSingle(),
      );
      return row ? toUser(row) : null;
    },

    async updatePassword(id, password) {
      const client = supabase();
      const passwordHash = unwrap(await client.rpc('hash_password', { plain: password }));
      const { error } = await client
        .from('profiles')
        .update({ password_hash: passwordHash })
        .eq('id', id);
      if (error) throw new Error(`[supabase] ${error.message}`);
      return true;
    },
  },

  plans: {
    async list({ onlyActive = true } = {}) {
      let query = supabase().from('plans').select('*').order('sort_order');
      if (onlyActive) query = query.eq('is_active', true);
      return unwrapMany(await query).map(toPlan);
    },

    async findById(id) {
      const row = unwrap(await supabase().from('plans').select('*').eq('id', id).maybeSingle());
      return row ? toPlan(row) : null;
    },

    async findBySlug(slug) {
      const row = unwrap(await supabase().from('plans').select('*').eq('slug', slug).maybeSingle());
      return row ? toPlan(row) : null;
    },

    async findActiveSubscription(userId) {
      const row = unwrap(
        await supabase()
          .from('subscriptions')
          .select('*')
          .eq('user_id', userId)
          .in('status', ['active', 'past_due', 'pending_payment'])
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
      );
      return row ? toSubscription(row) : null;
    },

    async listInvoices(subscriptionId) {
      return unwrapMany(
        await supabase()
          .from('subscription_invoices')
          .select('*')
          .eq('subscription_id', subscriptionId)
          .order('due_date', { ascending: false }),
      ).map(toInvoice);
    },

    async createSubscription(userId, planId) {
      const now = new Date();
      const periodEnd = new Date(now);
      periodEnd.setMonth(periodEnd.getMonth() + 1);

      const row = unwrap(
        await supabase()
          .from('subscriptions')
          .insert({
            id: newId('sub'),
            user_id: userId,
            plan_id: planId,
            status: 'pending_payment',
            started_at: now.toISOString(),
            current_period_start: now.toISOString(),
            current_period_end: periodEnd.toISOString(),
            next_charge_at: periodEnd.toISOString(),
          })
          .select('*')
          .single(),
      );
      return toSubscription(row);
    },

    async cancelSubscription(subscriptionId) {
      const row = unwrap(
        await supabase()
          .from('subscriptions')
          .update({
            status: 'cancelled',
            cancelled_at: new Date().toISOString(),
            auto_renew: false,
          })
          .eq('id', subscriptionId)
          .select('*')
          .maybeSingle(),
      );
      return row ? toSubscription(row) : null;
    },
  },

  club: {
    async listCoupons(userId) {
      const client = supabase();
      const coupons = unwrapMany(
        await client.from('club_coupons').select('*').order('sort_order'),
      );

      const redemptions = userId
        ? unwrapMany(
            await client
              .from('coupon_redemptions')
              .select('coupon_id, redeemed_at')
              .eq('user_id', userId),
          )
        : [];

      return coupons.map((row) =>
        toCoupon(
          row,
          redemptions.find((item) => item.coupon_id === row.id)?.redeemed_at,
        ),
      ) as ClubCoupon[];
    },

    async redeem(couponId, userId) {
      const client = supabase();
      const coupon = unwrap(
        await client.from('club_coupons').select('*').eq('id', couponId).maybeSingle(),
      );
      if (!coupon) return null;

      const redeemedAt = new Date().toISOString();
      const { error } = await client.from('coupon_redemptions').upsert(
        {
          id: newId('rdm'),
          coupon_id: couponId,
          user_id: userId,
          redeemed_at: redeemedAt,
        },
        { onConflict: 'coupon_id,user_id' },
      );
      if (error) throw new Error(`[supabase] ${error.message}`);

      return toCoupon(coupon, redeemedAt);
    },
  },
};
