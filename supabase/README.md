# Banco de dados — Barbearia Falcão

O projeto do Supabase é compartilhado com outra aplicação. Para não dividir a
`public`, todos os dados da Barbearia Falcão vivem no schema **`barbearia`**.

As migrations em `migrations/` são a cópia versionada do que já está aplicado no
projeto `kpkrndklpwuybadkpkdw`, na ordem dos nomes de arquivo.

| Migration | O que faz |
| --- | --- |
| `..._schema_init.sql` | Schema, tipos, tabelas, índices e gatilhos de `updated_at` |
| `..._rls_and_auth_helpers.sql` | RLS em todas as tabelas + funções de senha e de nível de acesso |
| `..._seed_catalog.sql` | Serviços, barbeiros, planos e cupons |
| `..._seed_users_and_agenda.sql` | Usuários de acesso e agenda de demonstração |

## Regras que sustentam o desenho

- **RLS ligado em tudo.** Só o catálogo tem política de leitura pública; agenda,
  clientes e assinaturas não têm política alguma e só são acessíveis pela
  service role, no servidor.
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
