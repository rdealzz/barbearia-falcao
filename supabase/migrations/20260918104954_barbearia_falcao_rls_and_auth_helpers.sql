-- =====================================================================
-- Barbearia Falcão — RLS + funções de credencial
-- O app acessa o banco pelo servidor (service_role, que ignora RLS).
-- As políticas abaixo garantem que uma eventual chave pública só consiga
-- ler o catálogo, nunca dados de clientes ou agenda.
-- =====================================================================

alter table barbearia.services            enable row level security;
alter table barbearia.barbers             enable row level security;
alter table barbearia.plans               enable row level security;
alter table barbearia.profiles            enable row level security;
alter table barbearia.appointments        enable row level security;
alter table barbearia.time_off            enable row level security;
alter table barbearia.subscriptions       enable row level security;
alter table barbearia.subscription_invoices enable row level security;
alter table barbearia.club_coupons        enable row level security;
alter table barbearia.coupon_redemptions  enable row level security;

-- Catálogo público: leitura liberada apenas do que já aparece no site.
drop policy if exists "catalogo publico de servicos" on barbearia.services;
create policy "catalogo publico de servicos" on barbearia.services
  for select to anon, authenticated using (is_active);

drop policy if exists "catalogo publico de barbeiros" on barbearia.barbers;
create policy "catalogo publico de barbeiros" on barbearia.barbers
  for select to anon, authenticated using (is_active);

drop policy if exists "catalogo publico de planos" on barbearia.plans;
create policy "catalogo publico de planos" on barbearia.plans
  for select to anon, authenticated using (is_active);

drop policy if exists "catalogo publico de cupons" on barbearia.club_coupons;
create policy "catalogo publico de cupons" on barbearia.club_coupons
  for select to anon, authenticated using (true);

-- Demais tabelas ficam sem política: nada é legível fora do service_role.

-- ------------------------- Credenciais --------------------------------
create or replace function barbearia.hash_password(plain text)
returns text
language sql
security definer
set search_path = ''
as $$
  select extensions.crypt(plain, extensions.gen_salt('bf', 10));
$$;

create or replace function barbearia.verify_password(p_email text, p_password text)
returns text
language sql
security definer
set search_path = ''
as $$
  select p.id
  from barbearia.profiles p
  where lower(p.email) = lower(trim(p_email))
    and p.password_hash is not null
    and p.password_hash = extensions.crypt(p_password, p.password_hash)
  limit 1;
$$;

revoke all on function barbearia.hash_password(text) from public, anon, authenticated;
revoke all on function barbearia.verify_password(text, text) from public, anon, authenticated;

comment on function barbearia.verify_password is
  'Retorna o id do perfil quando a senha confere. Uso restrito ao service_role.';

-- ------------------------- Acesso do painel ---------------------------
-- Um único ponto de verdade sobre o que cada nível de barbeiro pode fazer.
create or replace function barbearia.is_owner(p_profile_id text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (select p.staff_role = 'owner'::barbearia.staff_role
     from barbearia.profiles p
     where p.id = p_profile_id),
    false);
$$;

comment on function barbearia.is_owner is
  'true para o barbeiro-chefe (dono): acessa clientes, equipe e financeiro.';
