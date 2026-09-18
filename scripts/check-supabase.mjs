#!/usr/bin/env node
/**
 * Confere se a conexão com o Supabase está de pé e se as duas trancas
 * (GRANTs + RLS) estão fazendo o trabalho delas.
 *
 *   npm run check:supabase
 *
 * Nenhuma chave é impressa: a saída pode ser compartilhada para diagnóstico.
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createClient } from '@supabase/supabase-js';

let failures = 0;
const ok = (m) => console.log(`  \x1b[32m✓\x1b[0m ${m}`);
const bad = (m, hint) => {
  console.log(`  \x1b[31m✗\x1b[0m ${m}`);
  if (hint) console.log(`      → ${hint}`);
  failures += 1;
};

// ---- 1. Ler o .env.local sem depender de nenhuma biblioteca -----------
const envPath = resolve(process.cwd(), '.env.local');
if (!existsSync(envPath)) {
  console.log('\n  Não achei o arquivo .env.local.');
  console.log('  Rode primeiro:  npm run setup:env\n');
  process.exit(1);
}

const env = {};
for (const line of readFileSync(envPath, 'utf8').split('\n')) {
  const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
  if (match) env[match[1]] = match[2].trim().replace(/^["']|["']$/g, '');
}

console.log('\n  Conferindo a configuração do Supabase\n');

const url = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const secret = env.SUPABASE_SERVICE_ROLE_KEY;
const publishable = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (url) ok(`URL do projeto: ${url}`);
else bad('SUPABASE_URL não preenchida');

if (secret) ok(`Chave secreta presente (${secret.length} caracteres, não vou mostrá-la)`);
else
  bad(
    'SUPABASE_SERVICE_ROLE_KEY está vazia',
    'Supabase → Project Settings → API Keys → Secret keys → Reveal, e cole no .env.local',
  );

if (env.DATA_PROVIDER === 'supabase') ok('DATA_PROVIDER = "supabase"');
else bad(`DATA_PROVIDER = "${env.DATA_PROVIDER ?? '(vazio)'}"`, 'Troque para "supabase" no .env.local');

if (!url || !secret) {
  console.log('\n  Preencha o que falta acima e rode de novo.\n');
  process.exit(1);
}

// ---- 2. Classificação de erros ---------------------------------------
// Requisições `head: true` devolvem a mensagem vazia, então um erro sem
// texto é tratado como inconclusivo — nunca como aprovação.
const textOf = (error) =>
  [error?.message, error?.details, error?.hint, error?.code].filter(Boolean).join(' ');

const isNetworkError = (error) =>
  /fetch failed|not in allowlist|ENOTFOUND|ECONNREFUSED|ETIMEDOUT|network|socket/i.test(
    textOf(error),
  );

/** Negativa vinda do banco: é o que prova que a tranca funciona. */
const isPermissionError = (error) =>
  error?.code === '42501' || /permission denied|not authorized|row-level security/i.test(textOf(error));

const isSchemaNotExposed = (error) =>
  error?.code === 'PGRST106' || /schema must be one of/i.test(textOf(error));

const explain = (error) => {
  if (isNetworkError(error)) return 'Não alcancei o Supabase — verifique conexão, proxy ou firewall';
  if (isSchemaNotExposed(error))
    return 'Exponha o schema: Supabase → Project Settings → API → Exposed schemas → adicione "barbearia"';
  if (error?.code === '42501')
    return 'Permissão negada — aplique a migration ..._schema_grants.sql (supabase/migrations/)';
  if (/Invalid API key|JWT/i.test(textOf(error)))
    return 'A chave secreta parece inválida — confira se copiou a Secret key inteira';
  return textOf(error) || 'erro sem detalhe (geralmente rede ou chave inválida)';
};

// ---- 3. Sonda de conectividade ---------------------------------------
// Sem `head`, para que a mensagem de erro venha completa.
const server = createClient(url, secret, {
  db: { schema: 'barbearia' },
  auth: { persistSession: false },
});

const probe = await server.from('services').select('id').limit(1);
if (probe.error) {
  bad(`Servidor não conseguiu falar com o banco`, explain(probe.error));
  console.log('\n  Resolva o ponto acima antes de interpretar qualquer outro resultado.\n');
  process.exit(1);
}
ok('Servidor conectou no schema "barbearia"');

// ---- 4. Leitura do servidor ------------------------------------------
for (const [tabela, rotulo] of [
  ['services', 'catálogo'],
  ['appointments', 'agenda'],
  ['profiles', 'clientes e equipe'],
]) {
  const { count, error } = await server.from(tabela).select('id', { count: 'exact', head: true });
  if (error) bad(`Servidor não lê ${rotulo}`, explain(error));
  else ok(`Servidor lê ${rotulo}: ${count} registro(s)`);
}

// ---- 5. Login dos dois níveis de barbeiro ----------------------------
for (const [email, esperado, papel] of [
  ['barbeiro@falcao.com', 'usr_barbeiro_1', 'barbeiro-chefe'],
  ['lucas@falcao.com', 'usr_barbeiro_2', 'barbeiro funcionário'],
]) {
  const { data, error } = await server.rpc('verify_password', {
    p_email: email,
    p_password: 'falcao123',
  });
  if (error) bad(`Login do ${papel} falhou`, explain(error));
  else if (data === esperado) ok(`Login do ${papel} (${email}) confere`);
  else bad(`Login do ${papel} não retornou o perfil esperado`);
}

const recusa = await server.rpc('verify_password', {
  p_email: 'lucas@falcao.com',
  p_password: 'senha-errada',
});
if (recusa.error) bad('Não consegui testar a recusa de senha errada', explain(recusa.error));
else if (recusa.data === null) ok('Senha errada é recusada');
else bad('Senha errada NÃO foi recusada — verifique a função verify_password');

// ---- 6. A chave pública não pode enxergar dados sensíveis ------------
if (publishable) {
  const anon = createClient(url, publishable, {
    db: { schema: 'barbearia' },
    auth: { persistSession: false },
  });

  const catalogo = await anon.from('services').select('id').limit(1);
  if (catalogo.error) bad('Chave pública não lê o catálogo', explain(catalogo.error));
  else ok('Chave pública lê o catálogo (como deve)');

  for (const tabela of ['appointments', 'profiles']) {
    const { data, error } = await anon.from(tabela).select('id').limit(1);

    if (isPermissionError(error)) {
      ok(`Chave pública é barrada em "${tabela}" (como deve)`);
    } else if (error) {
      // Rede fora do ar ou schema não exposto não provam nada sobre segurança.
      bad(`Não consegui testar o acesso público a "${tabela}"`, explain(error));
    } else if ((data ?? []).length === 0) {
      ok(`Chave pública não obtém dados de "${tabela}"`);
    } else {
      bad(`VAZAMENTO: a chave pública leu "${tabela}"`, 'Reveja os GRANTs e o RLS antes de publicar');
    }
  }
}

console.log(
  failures === 0
    ? '\n  Tudo certo. Pode rodar:  npm run dev\n'
    : `\n  ${failures} ponto(s) para resolver acima.\n`,
);
process.exit(failures === 0 ? 0 : 1);
