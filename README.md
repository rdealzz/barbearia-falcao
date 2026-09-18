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

| Perfil | E-mail | Senha |
| --- | --- | --- |
| Cliente | `cliente@falcao.com` | `falcao123` |
| Barbeiro | `barbeiro@falcao.com` | `falcao123` |
| Barbeiro | `lucas@falcao.com` | `falcao123` |

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

- **Supabase / PostgreSQL / Prisma** — `prisma/schema.prisma` espelha os contratos,
  incluindo índice único `(barbeiro, data, horário)` que impede overbooking no banco.
  Ative implementando os repositórios e trocando `DATA_PROVIDER`.
- **ASAAS** — assinaturas, ciclos, uso por período, faturas e `WebhookEvent` já modelados;
  `subscribeToPlanAction` é o ponto de entrada da cobrança recorrente.
- **WhatsApp** — componente flutuante pronto; basta definir `NEXT_PUBLIC_WHATSAPP_NUMBER`.
- **Upload de foto de perfil** — `AvatarPicker` isola a leitura do arquivo; trocar
  `readAsDataURL` pelo upload no Supabase Storage encerra a integração.
- **Google Calendar, push, login social, dashboard admin, financeiro, fidelidade,
  cupons, cashback, avaliações, loja e relatórios** — acomodados pela separação
  `features/ + services/ + types/`, sem necessidade de reescrita.

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
