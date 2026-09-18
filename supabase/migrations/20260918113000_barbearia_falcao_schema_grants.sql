-- =====================================================================
-- Barbearia Falcão — permissões de acesso ao schema pela Data API
--
-- Um schema fora da `public` não recebe permissão nenhuma por padrão: sem
-- os GRANTs abaixo, nem a service_role consegue ler as tabelas (erro 42501).
--
-- A regra é deliberadamente assimétrica e funciona como segunda tranca,
-- além do RLS:
--   - service_role (só o servidor): acesso completo.
--   - anon/authenticated: SELECT apenas no catálogo que já é público no
--     site. Agenda, clientes e assinaturas não recebem permissão alguma,
--     então nem uma política de RLS mal escrita no futuro os exporia.
-- =====================================================================

grant usage on schema barbearia to anon, authenticated, service_role;

-- ------------------------- Servidor (service_role) --------------------
grant all on all tables    in schema barbearia to service_role;
grant all on all sequences in schema barbearia to service_role;

alter default privileges for role postgres in schema barbearia
  grant all on tables to service_role;
alter default privileges for role postgres in schema barbearia
  grant all on sequences to service_role;

-- ------------------------- Catálogo público ---------------------------
-- Somente leitura, e somente destas quatro tabelas.
grant select on barbearia.services     to anon, authenticated;
grant select on barbearia.barbers      to anon, authenticated;
grant select on barbearia.plans        to anon, authenticated;
grant select on barbearia.club_coupons to anon, authenticated;

-- ------------------------- Funções ------------------------------------
-- Credenciais e nível de acesso só podem ser chamados pelo servidor.
revoke all on function barbearia.hash_password(text)            from public, anon, authenticated;
revoke all on function barbearia.verify_password(text, text)    from public, anon, authenticated;
revoke all on function barbearia.is_owner(text)                 from public, anon, authenticated;

grant execute on function barbearia.hash_password(text)         to service_role;
grant execute on function barbearia.verify_password(text, text) to service_role;
grant execute on function barbearia.is_owner(text)              to service_role;
