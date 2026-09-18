# Banco de dados — Barbearia Falcão

Todos os dados da Barbearia Falcão vivem no schema **`barbearia`**, dentro do
projeto próprio do Supabase — a `public` fica livre para extensões e integrações.

As migrations em `migrations/` são a cópia versionada do que já está aplicado no
projeto `xmfeeasrnbyujummqmxz`, na ordem dos nomes de arquivo.

| Migration | O que faz |
| --- | --- |
| `..._schema_init.sql` | Schema, tipos, tabelas, índices e gatilhos de `updated_at` |
| `..._rls_and_auth_helpers.sql` | RLS em todas as tabelas + funções de senha e de nível de acesso |
| `..._seed_catalog.sql` | Serviços, barbeiros, planos e cupons |
| `..._seed_users_and_agenda.sql` | Usuários de acesso e agenda de demonstração |
| `..._schema_grants.sql` | Permissões da Data API — sem elas nem a service_role lê o schema |

## Regras que sustentam o desenho

- **Duas trancas, não uma.** Um schema fora da `public` não tem permissão
  nenhuma por padrão, então os `GRANT`s são explícitos: `service_role` acessa
  tudo; `anon`/`authenticated` só têm `SELECT` nas quatro tabelas de catálogo.
  Agenda, clientes e assinaturas não recebem grant algum — nem uma política de
  RLS mal escrita no futuro os exporia.
- **RLS ligado em tudo.** Só o catálogo tem política de leitura pública.
- **Senhas nunca em texto puro.** Hash bcrypt via `pgcrypto`, conferido por
  `barbearia.verify_password(email, senha)`.
- **`staff_role`** (`owner` | `barber`) separa o barbeiro-chefe do funcionário,
  espelhando `src/lib/auth/permissions.ts` no app.

## Aplicando em outro ambiente

Com a CLI do Supabase:

```bash
supabase link --project-ref <ref>
supabase db push
```

Depois, em **Settings → API → Exposed schemas**, acrescente `barbearia` — a API
REST só enxerga schemas expostos.
