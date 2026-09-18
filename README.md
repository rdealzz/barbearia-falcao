# Barbearia Falcão

Plataforma da Barbearia Falcão (Curitiba/PR): site institucional, agendamento online,
área do cliente, painel dos barbeiros e base de assinaturas — construída como fundação
de um ERP, não como página de vitrine.

```
Next.js 15 (App Router) · React 19 · TypeScript estrito · Tailwind CSS v4 · Framer Motion · Zod
```

## Começando

```bash
npm install
cp .env.example .env.local
npm run dev          # http://localhost:3000
```

Scripts disponíveis:

| Script | O que faz |
| --- | --- |
| `npm run dev` | Ambiente de desenvolvimento |
| `npm run build` / `npm start` | Build e execução em produção |
| `npm run lint` | ESLint (regras do Next + TypeScript) |
| `npm run typecheck` | Verificação de tipos sem emitir arquivos |
| `npm run db:generate` / `db:push` / `db:studio` | Prisma (após ativar o banco) |

### Contas de demonstração

O provider padrão é `mock`, com dados em memória recriados a cada boot do servidor.

| Perfil | E-mail | Senha | Acesso |
| --- | --- | --- | --- |
| Cliente | `cliente@falcao.com` | `falcao123` | Área do cliente (`/conta`) |
| **Barbeiro-chefe (dono)** | `barbeiro@falcao.com` | `falcao123` | Painel completo: agenda, equipe e base de clientes |
| **Barbeiro funcionário** | `lucas@falcao.com` | `falcao123` | Painel da própria agenda |

## Painel da equipe: dois níveis de acesso

O painel (`/painel`) tem dois perfis, definidos por `staffRole` no usuário e no
barbeiro (`owner` | `barber`). Quem decide o que cada um vê é
`src/lib/auth/permissions.ts` — um único ponto de verdade, espelhado no banco
pela função `barbearia.is_owner()`.

| Rota | Barbeiro funcionário | Barbeiro-chefe |
| --- | --- | --- |
| `/painel` — agenda do dia | ✅ | ✅ |
| `/painel/agenda` — controle de horários | ✅ (a própria) | ✅ (de qualquer barbeiro) |
| `/painel/semana` — visão semanal | ✅ | ✅ |
| `/painel/equipe` — a casa inteira no dia | — | ✅ |
| `/painel/clientes` — base de clientes | — | ✅ |

O bloqueio é de rota, não só de menu: um funcionário que digitar
`/painel/clientes` cai de volta na própria agenda, e passar `?barbeiro=` de
outro profissional não abre a agenda alheia.

### Controle de horários (`/painel/agenda`)

A grade mostra o dia inteiro do barbeiro — livre, marcado, bloqueado e o que já
passou — com **quem marcou cada horário**. A partir dela o barbeiro:

- **bloqueia** um horário, que some da grade pública de agendamento na hora;
- **libera** de volta um horário bloqueado;
- **marca como já ocupado** (encaixe combinado por WhatsApp ou cliente de balcão,
  sem cadastro no site);
- ajusta a jornada do dia com os atalhos **chego às…**, **saio às…** e
  **não atendo hoje** — a rotina real de chegar mais tarde ou sair antes.

## Arquitetura

A aplicação nunca fala com um banco diretamente: ela depende de **contratos**
(`src/services/repositories.ts`). Hoje quem os implementa é um store em memória;
amanhã será Prisma ou Supabase — sem alterar uma linha de tela.

```
UI (app/ + features/)
      ↓  usa
db  (src/services/index.ts)      ← resolve o provider por DATA_PROVIDER
      ↓  implementa
Repositories (contratos TypeScript)
      ↓
mock (src/lib/data/mock)   |   prisma   |   supabase
```

```
src/
├── app/                      Rotas (App Router)
│   ├── (site)/               Site público: home, sobre, serviços, cortes, barbeiros, planos, contato, agendar
│   ├── (auth)/               Entrar, cadastrar, recuperar senha
│   └── (app)/                Áreas logadas: /conta (cliente) e /painel (barbeiro)
├── components/
│   ├── ui/                   Primitivas do design system (Button, Card, Input, Avatar…)
│   ├── layout/               Header, footer e shell das áreas logadas
│   └── shared/               Logo, animações, seções, ícones de marca, botão de WhatsApp
├── features/                 Domínios: booking, barbers, services, plans, club, gallery, theme, auth, account, staff, home
│   └── <feature>/            components/ + actions.ts + services de domínio
├── services/                 Contratos da camada de dados e resolução do provider
├── lib/
│   ├── auth/                 Sessão assinada (HMAC) e usuário atual
│   ├── config/               siteConfig, navegação e variáveis de ambiente validadas
│   ├── data/                 Store em memória, seeds e implementação mock
│   ├── seo/                  Metadata helpers e JSON-LD
│   └── utils/                cn, formatação (BRL, telefone, CPF, CEP) e datas
├── hooks/                    Hooks reutilizáveis (rascunho do agendamento)
├── types/                    Modelo de domínio tipado (fonte da verdade)
└── styles/                   Tokens e camadas do Tailwind v4
```

### Motor de agendamento

`src/features/booking/availability.ts` é puro e testável: recebe barbeiro, serviço,
agendamentos e bloqueios e devolve a grade de horários. Ele já respeita:

- jornada por dia da semana, com múltiplos turnos (ex.: 09–13 e 14:30–19);
- férias, folgas, ausências e bloqueios parciais de período;
- duração real do serviço (um combo de 1h10 não cabe num vão de 40 min);
- intervalo entre atendimentos (buffer) e granularidade da grade por barbeiro;
- limite diário de atendimentos, antecedência mínima e janela máxima de agendamento.

Cada barbeiro tem agenda independente — um horário ocupado com um profissional não
bloqueia o mesmo horário com outro. A criação do agendamento revalida a disponibilidade
antes de gravar, evitando que duas reservas simultâneas ocupem o mesmo vão.

### Autenticação

Sessão em cookie `httpOnly` assinado com HMAC-SHA256 (`src/lib/auth/session.ts`),
com `getCurrentUser`, `requireUser` e `requireRole` para proteger as rotas.
A troca por Supabase Auth (ou Google/Apple) afeta apenas esse módulo.

## Tema e identidade

O site abre no **tema claro** e oferece alternância para o escuro no cabeçalho
e nas áreas logadas. A preferência é gravada em `localStorage` e aplicada antes
da primeira pintura (`src/features/theme/theme-script.tsx`), sem flash de troca.

Todas as telas usam tokens semânticos (`bg-canvas`, `text-content`, `text-muted`,
`border-line`, `bg-tint`…) definidos em `src/styles/globals.css`. Trocar uma cor
de tema é editar um valor em um único arquivo — nenhuma tela tem cor fixa,
exceto o vermelho e o creme da marca.

A marca vive em `src/components/shared/logo-mark.tsx` (brasão vetorial: disco
vermelho `#C1272D`, aros creme `#F2E4C9`, aro preto `#121212`, tipografia script
e poste de barbeiro) e se repete no favicon (`public/icon.svg`). Para usar o
arquivo oficial, salve-o em `public/` e aponte `brand.logoSrc` em
`src/lib/data/media.ts` — ele substitui o brasão em todo o site de uma vez.

## Dados reais x dados de demonstração

| Já reflete a barbearia | Precisa ser preenchido |
| --- | --- |
| Endereço completo com CEP (R. Pedro Gusso, 281 — Novo Mundo, 81050-200) | E-mail oficial |
| Telefone e WhatsApp (41) 99936-0911 | Horário de sábado e domingo |
| Nota 4,9 e 397 avaliações no Google | Fotos reais (equipe, ambiente, cortes) |
| Instagram `@barbeariia_falcao` e Facebook | Nomes, bios e fotos dos barbeiros |
| Catálogo de planos e preços vigentes | Logotipo oficial em arquivo |
| Clube Falcão (cupons, regras e FAQ) | |

Nada de reputação é inventado: o site mostra apenas a nota pública do Google.
Os barbeiros ficam com `rating`/`reviewsCount` zerados e a interface esconde o
bloco de avaliação enquanto não houver dado real.

Pontos de edição:

- `src/lib/config/site.ts` — contato, horários, endereço e redes.
- `src/lib/data/seed/` — serviços, barbeiros, planos, cupons e usuários.
- `src/lib/data/media.ts` — todas as imagens do site e a marca em um só lugar.
- `public/galeria/` — fotos dos cortes exibidas em `/galeria` (veja o LEIA-ME de lá).

Os barbeiros cadastrados são **fictícios**: nome, bio e especialidades devem ser
trocados pelos profissionais reais antes do lançamento.

## Integrações preparadas (ainda não ativas)

O código já tem o formato certo para receber cada item abaixo:

- **Prisma / PostgreSQL** — `prisma/schema.prisma` espelha os contratos,
  incluindo índice único `(barbeiro, data, horário)` que impede overbooking no banco.
  Continua como plano B; o caminho ativo hoje é o Supabase (seção acima).
- **ASAAS** — assinaturas, ciclos, uso por período, faturas e `WebhookEvent` já modelados;
  `subscribeToPlanAction` é o ponto de entrada da cobrança recorrente.
- **WhatsApp** — componente flutuante pronto; basta definir `NEXT_PUBLIC_WHATSAPP_NUMBER`.
- **Upload de foto de perfil** — `AvatarPicker` isola a leitura do arquivo; trocar
  `readAsDataURL` pelo upload no Supabase Storage encerra a integração.
- **Google Calendar, push, login social, dashboard admin, financeiro, fidelidade,
  cupons, cashback, avaliações, loja e relatórios** — acomodados pela separação
  `features/ + services/ + types/`, sem necessidade de reescrita.

## Banco de dados no Supabase

A Barbearia Falcão tem **projeto próprio** no Supabase (`barbearia`), e dentro
dele um **schema dedicado** — também `barbearia` — em vez da `public`. A `public`
fica livre para extensões e integrações futuras, e o schema do app permanece
autocontido: tabelas, tipos e funções próprias.

```
projeto Supabase "barbearia"
├── public      → livre (extensões, integrações)
└── barbearia   → esta aplicação
    ├── services, barbers, plans, club_coupons      (catálogo, leitura pública)
    ├── profiles                                    (clientes + equipe, com staff_role)
    ├── appointments                                (agendamentos, inclusive reservas manuais)
    ├── time_off                                    (bloqueios e ajustes de jornada)
    └── subscriptions, subscription_invoices, coupon_redemptions
```

Decisões que valem registrar:

- **Duas trancas, não uma.** Além do RLS, os `GRANT`s são explícitos: só a
  service role (servidor) alcança agenda, clientes e assinaturas. `anon` tem
  `SELECT` apenas nas quatro tabelas de catálogo — sem grant, nem uma política
  de RLS mal escrita no futuro exporia o resto.
- **RLS ligado em tudo.** Só o catálogo (serviços, barbeiros, planos, cupons)
  tem política de leitura pública.
- **Senhas com `pgcrypto`.** Ficam como hash bcrypt em `profiles.password_hash`;
  `barbearia.verify_password(email, senha)` confere sem nunca devolver o hash.
- **`staff_role`** separa o barbeiro-chefe do funcionário, igual ao app.
- **Horário e data separados** (`date` + `start_time`/`end_time`), com
  `constraint` garantindo fim depois do início.

### Ativando o Supabase

```bash
npm run setup:env        # cria o .env.local já preenchido
# cole a chave secreta na linha SUPABASE_SERVICE_ROLE_KEY
npm run check:supabase   # confere conexão, logins e as duas trancas
npm run dev
```

Dois passos precisam de você:

1. **A chave secreta.** Supabase → *Project Settings → API Keys → Secret keys →
   Reveal*. Ela dá acesso total ao banco e ignora o RLS: vive só em variável de
   ambiente no servidor, nunca no navegador nem no Git.
2. **Expor o schema.** Supabase → *Project Settings → API → Exposed schemas* →
   acrescente `barbearia`. A Data API só enxerga schemas expostos.

`npm run check:supabase` diz exatamente qual dos dois está faltando, e nunca
imprime a chave — a saída pode ser colada em qualquer lugar para diagnóstico.

Em produção (Vercel e afins), as mesmas variáveis vão no painel de *Environment
Variables* do serviço, nunca em arquivo versionado.

A troca de provider não muda nenhuma tela — quem resolve é `src/services/index.ts`.

A carga inicial (serviços, barbeiros, planos, cupons, usuários de acesso e uma
agenda de demonstração) já está aplicada por migrations no projeto.

## SEO e performance

- Metadata por rota, Open Graph gerado dinamicamente (`src/app/opengraph-image.tsx`),
  `sitemap.xml` e `robots.txt` com as áreas logadas fora do índice.
- JSON-LD de `HairSalon` (com catálogo de serviços) e de cada barbeiro.
- Server Components por padrão; JavaScript de cliente só onde há interação.
- Páginas públicas pré-renderizadas, imagens em AVIF/WebP com `next/image` e
  moldura que degrada para um bloco elegante caso a foto não carregue.
- Respeito a `prefers-reduced-motion` em todas as animações.

## Identidade visual

Preto como base, vermelho Falcão como acento, tipografia display para títulos e
detalhes metálicos discretos. Os tokens vivem em `src/styles/globals.css`
(`--color-falcao-*`, `--color-ink-*`, `--color-steel-*`) e valem para todo o app.
