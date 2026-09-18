import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/config/env';

/**
 * Cliente do schema dedicado da Barbearia Falcão.
 *
 * O projeto do Supabase é compartilhado com outra aplicação, por isso os
 * dados vivem no schema `barbearia` — nunca em `public`. Só o servidor
 * acessa o banco, com a service role, e as políticas de RLS garantem que
 * uma chave pública só enxergue o catálogo.
 */
 
type FalcaoClient = ReturnType<typeof createClient<any, 'barbearia', 'barbearia'>>;

let cached: FalcaoClient | null = null;

export function supabase(): FalcaoClient {
  if (cached) return cached;

  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      'DATA_PROVIDER="supabase" exige SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no ambiente.',
    );
  }

   
  const client = createClient<any, 'barbearia', 'barbearia'>(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      db: { schema: 'barbearia' },
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );

  cached = client;
  return client;
}

/** Ids legíveis no padrão do app (`apt_...`, `off_...`). */
export function newId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

export function unwrap<T>(result: { data: T | null; error: { message: string } | null }): T | null {
  if (result.error) throw new Error(`[supabase] ${result.error.message}`);
  return result.data;
}

export function unwrapMany<T>(result: { data: T[] | null; error: { message: string } | null }): T[] {
  if (result.error) throw new Error(`[supabase] ${result.error.message}`);
  return result.data ?? [];
}
