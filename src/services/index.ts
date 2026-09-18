import 'server-only';
import { env } from '@/lib/config/env';
import { mockRepositories } from '@/lib/data/mock';
import { supabaseRepositories } from '@/lib/data/supabase';
import type { Repositories } from './repositories';

/**
 * Ponto único de resolução da camada de dados.
 * `mock` sustenta o desenvolvimento local; `supabase` fala com o schema
 * `barbearia` no projeto compartilhado. Nenhuma tela conhece a diferença.
 */
export function getRepositories(): Repositories {
  switch (env.DATA_PROVIDER) {
    case 'supabase':
      return supabaseRepositories;
    case 'prisma':
      // Prisma continua disponível como plano B; até lá, o mock sustenta o app.
      return mockRepositories;
    case 'mock':
    default:
      return mockRepositories;
  }
}

export const db = getRepositories();
export type { Repositories } from './repositories';
