import 'server-only';
import { env } from '@/lib/config/env';
import { mockRepositories } from '@/lib/data/mock';
import type { Repositories } from './repositories';

/**
 * Ponto único de resolução da camada de dados.
 * Ao plugar Prisma ou Supabase, basta registrar a implementação aqui —
 * nenhuma tela precisa mudar.
 */
export function getRepositories(): Repositories {
  switch (env.DATA_PROVIDER) {
    case 'prisma':
    case 'supabase':
      // Implementações reais entram aqui; o mock sustenta o app até lá.
      return mockRepositories;
    case 'mock':
    default:
      return mockRepositories;
  }
}

export const db = getRepositories();
export type { Repositories } from './repositories';
