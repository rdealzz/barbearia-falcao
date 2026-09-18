#!/usr/bin/env node
/**
 * Cria o .env.local com tudo que já sabemos preenchido, deixando em branco
 * apenas o que é segredo. Nunca sobrescreve um arquivo existente.
 *
 *   npm run setup:env
 */
import { existsSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { randomBytes } from 'node:crypto';

const target = resolve(process.cwd(), '.env.local');

if (existsSync(target)) {
  console.log('\n  O arquivo .env.local já existe — não vou mexer nele.');
  console.log(`  Abra e edite à mão se precisar:  ${target}\n`);
  process.exit(0);
}

// Dados públicos do projeto "barbearia" no Supabase.
const SUPABASE_URL = 'https://xmfeeasrnbyujummqmxz.supabase.co';
const PUBLISHABLE_KEY = 'sb_publishable_l5y-0iF86dzDEH2TX_i5DA_yoSZzQyA';

const content = `# Gerado por "npm run setup:env".
# Este arquivo é ignorado pelo Git e nunca deve ser compartilhado.

NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Camada de dados: "mock" (dados em memória) | "supabase" (banco real)
DATA_PROVIDER="supabase"

# Chave que assina os cookies de sessão. Já gerada, não precisa mexer.
SESSION_SECRET="${randomBytes(32).toString('base64url')}"

# ---------------------------------------------------------------------
# Supabase — projeto "barbearia"
# ---------------------------------------------------------------------
NEXT_PUBLIC_SUPABASE_URL="${SUPABASE_URL}"
SUPABASE_URL="${SUPABASE_URL}"
NEXT_PUBLIC_SUPABASE_ANON_KEY="${PUBLISHABLE_KEY}"

# >>> O ÚNICO CAMPO QUE VOCÊ PRECISA PREENCHER <<<
# Supabase → Project Settings → API Keys → Secret keys → Reveal.
# Começa com "sb_secret_..." (ou é um JWT longo, em projetos antigos).
# Dá acesso total ao banco: nunca publique nem cole em chat.
SUPABASE_SERVICE_ROLE_KEY=""

# ---------------------------------------------------------------------
# Integrações futuras
# ---------------------------------------------------------------------
NEXT_PUBLIC_WHATSAPP_NUMBER=""
ASAAS_API_KEY=""
ASAAS_API_URL="https://api.asaas.com/v3"
ASAAS_WEBHOOK_TOKEN=""
`;

writeFileSync(target, content, { mode: 0o600 });

console.log(`
  ✓ Criei o arquivo .env.local

  ${target}

  Falta um passo: abra esse arquivo e cole a chave secreta na linha

      SUPABASE_SERVICE_ROLE_KEY=""

  Onde achar: Supabase → projeto "barbearia" → Project Settings →
  API Keys → Secret keys → Reveal.

  Depois rode:  npm run check:supabase
`);
