-- =====================================================================
-- Barbearia Falcão — repositório de banco de dados dedicado
-- Schema isolado dentro do projeto compartilhado do Supabase.
-- =====================================================================

create schema if not exists barbearia;
create extension if not exists pgcrypto with schema extensions;

comment on schema barbearia is 'Base de dados da Barbearia Falcão (isolada do restante do projeto).';

-- ------------------------- Tipos -------------------------------------
do $$ begin
  create type barbearia.user_role as enum ('client', 'barber', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type barbearia.staff_role as enum ('owner', 'barber');
exception when duplicate_object then null; end $$;

do $$ begin
  create type barbearia.service_category as enum ('cabelo', 'barba', 'combo', 'estetica', 'infantil');
exception when duplicate_object then null; end $$;

do $$ begin
  create type barbearia.appointment_status as enum
    ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show');
exception when duplicate_object then null; end $$;

do $$ begin
  create type barbearia.payment_method as enum ('pix', 'credit_card', 'boleto', 'cash', 'plan');
exception when duplicate_object then null; end $$;

do $$ begin
  create type barbearia.payment_status as enum ('pending', 'paid', 'refunded', 'failed', 'not_required');
exception when duplicate_object then null; end $$;

do $$ begin
  create type barbearia.time_off_reason as enum ('ferias', 'folga', 'ausencia', 'feriado', 'bloqueio');
exception when duplicate_object then null; end $$;

do $$ begin
  create type barbearia.plan_tier as enum ('bronze', 'silver', 'gold', 'vip');
exception when duplicate_object then null; end $$;

do $$ begin
  create type barbearia.billing_cycle as enum ('monthly', 'quarterly', 'yearly');
exception when duplicate_object then null; end $$;

do $$ begin
  create type barbearia.subscription_status as enum
    ('active', 'past_due', 'cancelled', 'paused', 'pending_payment');
exception when duplicate_object then null; end $$;

do $$ begin
  create type barbearia.coupon_status as enum ('available', 'redeemed', 'expired');
exception when duplicate_object then null; end $$;

-- ------------------------- Gatilho de updated_at ----------------------
create or replace function barbearia.touch_updated_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ------------------------- Serviços -----------------------------------
create table if not exists barbearia.services (
  id                   text primary key,
  slug                 text not null unique,
  name                 text not null,
  short_description    text not null default '',
  description          text not null default '',
  category             barbearia.service_category not null,
  price_in_cents       integer not null check (price_in_cents >= 0),
  duration_in_minutes  integer not null check (duration_in_minutes > 0),
  image_url            text,
  highlights           text[] not null default '{}',
  is_active            boolean not null default true,
  is_featured          boolean not null default false,
  included_in_plan_ids text[] not null default '{}',
  sort_order           integer not null default 0,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- ------------------------- Barbeiros ----------------------------------
create table if not exists barbearia.barbers (
  id                  text primary key,
  slug                text not null unique,
  name                text not null,
  nickname            text,
  role                text not null default 'Barbeiro',
  staff_role          barbearia.staff_role not null default 'barber',
  headline            text not null default '',
  bio                 text not null default '',
  avatar_url          text not null default '',
  cover_url           text,
  specialties         text[] not null default '{}',
  experience_since    integer,
  instagram_url       text,
  rating              numeric(2,1) not null default 0,
  reviews_count       integer not null default 0,
  is_active           boolean not null default true,
  accepts_new_clients boolean not null default true,
  service_ids         text[] not null default '{}',
  working_hours       jsonb not null default '[]'::jsonb,
  schedule_settings   jsonb not null default '{}'::jsonb,
  sort_order          integer not null default 0,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

comment on column barbearia.barbers.staff_role is
  'owner = barbeiro-chefe (dono, acesso total); barber = barbeiro funcionário (apenas a própria agenda).';

-- ------------------------- Planos -------------------------------------
create table if not exists barbearia.plans (
  id                  text primary key,
  slug                text not null unique,
  name                text not null,
  tier                barbearia.plan_tier not null,
  tagline             text not null default '',
  description         text not null default '',
  price_in_cents      integer not null check (price_in_cents >= 0),
  billing_cycle       barbearia.billing_cycle not null default 'monthly',
  haircuts_per_cycle  integer,
  beards_per_cycle    integer,
  discount_percentage integer not null default 0 check (discount_percentage between 0 and 100),
  priority            integer not null default 0,
  benefits            jsonb not null default '[]'::jsonb,
  seats_available     integer,
  is_active           boolean not null default true,
  is_popular          boolean not null default false,
  terms_url           text,
  sort_order          integer not null default 0,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ------------------------- Perfis / usuários --------------------------
create table if not exists barbearia.profiles (
  id               text primary key,
  auth_user_id     uuid unique references auth.users (id) on delete set null,
  role             barbearia.user_role not null default 'client',
  staff_role       barbearia.staff_role,
  name             text not null,
  email            text not null unique,
  phone            text not null default '',
  document         text,
  birth_date       date,
  avatar_url       text not null default '',
  address          jsonb,
  barber_id        text references barbearia.barbers (id) on delete set null,
  notes            text,
  email_verified   boolean not null default false,
  marketing_opt_in boolean not null default false,
  password_hash    text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

comment on column barbearia.profiles.staff_role is
  'Define o nível de acesso do painel quando role = barber.';

create index if not exists profiles_email_idx on barbearia.profiles (lower(email));
create index if not exists profiles_barber_idx on barbearia.profiles (barber_id);

-- ------------------------- Agendamentos -------------------------------
create table if not exists barbearia.appointments (
  id                  text primary key,
  code                text not null unique,
  client_id           text references barbearia.profiles (id) on delete set null,
  barber_id           text not null references barbearia.barbers (id) on delete cascade,
  service_id          text references barbearia.services (id) on delete set null,
  date                date not null,
  start_time          time not null,
  end_time            time not null,
  status              barbearia.appointment_status not null default 'confirmed',
  price_in_cents      integer not null default 0,
  payment_method      barbearia.payment_method not null default 'cash',
  payment_status      barbearia.payment_status not null default 'pending',
  payment_amount      integer not null default 0,
  payment_external_id text,
  paid_at             timestamptz,
  notes               text,
  subscription_id     text,
  -- Encaixe/reserva lançada pelo próprio barbeiro no painel.
  is_manual           boolean not null default false,
  manual_client_name  text,
  created_by          text references barbearia.profiles (id) on delete set null,
  cancelled_at        timestamptz,
  cancellation_reason text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  constraint appointments_time_order check (end_time > start_time)
);

create index if not exists appointments_barber_date_idx
  on barbearia.appointments (barber_id, date, start_time);
create index if not exists appointments_client_idx
  on barbearia.appointments (client_id, date desc);

-- ------------------------- Bloqueios de agenda ------------------------
create table if not exists barbearia.time_off (
  id         text primary key,
  barber_id  text not null references barbearia.barbers (id) on delete cascade,
  reason     barbearia.time_off_reason not null default 'bloqueio',
  start_date date not null,
  end_date   date not null,
  start_time time,
  end_time   time,
  note       text,
  created_by text references barbearia.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint time_off_date_order check (end_date >= start_date)
);

create index if not exists time_off_barber_range_idx
  on barbearia.time_off (barber_id, start_date, end_date);

-- ------------------------- Assinaturas --------------------------------
create table if not exists barbearia.subscriptions (
  id                       text primary key,
  user_id                  text not null references barbearia.profiles (id) on delete cascade,
  plan_id                  text not null references barbearia.plans (id) on delete restrict,
  status                   barbearia.subscription_status not null default 'active',
  started_at               timestamptz not null default now(),
  current_period_start     timestamptz not null default now(),
  current_period_end       timestamptz not null,
  next_charge_at           timestamptz,
  cancelled_at             timestamptz,
  auto_renew               boolean not null default true,
  haircuts_used            integer not null default 0,
  beards_used              integer not null default 0,
  external_customer_id     text,
  external_subscription_id text,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

create index if not exists subscriptions_user_idx on barbearia.subscriptions (user_id, status);

create table if not exists barbearia.subscription_invoices (
  id              text primary key,
  subscription_id text not null references barbearia.subscriptions (id) on delete cascade,
  amount_in_cents integer not null default 0,
  status          text not null default 'pending',
  due_date        date not null,
  paid_at         timestamptz,
  method          text,
  receipt_url     text,
  external_id     text,
  created_at      timestamptz not null default now()
);

-- ------------------------- Clube de vantagens -------------------------
create table if not exists barbearia.club_coupons (
  id              text primary key,
  title           text not null,
  description     text not null default '',
  discount_type   text not null default 'percentage',
  discount_value  integer not null default 0,
  required_tier   barbearia.plan_tier,
  status          barbearia.coupon_status not null default 'available',
  expires_in_hours integer not null default 72,
  code            text,
  usage_limit     integer not null default 1,
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table if not exists barbearia.coupon_redemptions (
  id          text primary key,
  coupon_id   text not null references barbearia.club_coupons (id) on delete cascade,
  user_id     text not null references barbearia.profiles (id) on delete cascade,
  redeemed_at timestamptz not null default now(),
  unique (coupon_id, user_id)
);

-- ------------------------- Gatilhos -----------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'services','barbers','plans','profiles','appointments','time_off',
    'subscriptions','club_coupons'
  ] loop
    execute format(
      'drop trigger if exists touch_updated_at on barbearia.%I;
       create trigger touch_updated_at before update on barbearia.%I
       for each row execute function barbearia.touch_updated_at();', t, t);
  end loop;
end $$;
