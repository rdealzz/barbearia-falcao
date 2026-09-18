import { z } from 'zod';

const optionalString = z.string().trim().optional().default('');

const schema = z.object({
  DATA_PROVIDER: z.enum(['mock', 'prisma', 'supabase']).default('mock'),
  SESSION_SECRET: z.string().min(8).default('falcao-dev-secret'),
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  /** Projeto compartilhado do Supabase; os dados vivem no schema `barbearia`. */
  SUPABASE_URL: optionalString,
  SUPABASE_SERVICE_ROLE_KEY: optionalString,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: optionalString,
});

const parsed = schema.safeParse({
  DATA_PROVIDER: process.env.DATA_PROVIDER,
  SESSION_SECRET: process.env.SESSION_SECRET,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  SUPABASE_URL: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});

if (process.env.NODE_ENV === 'production' && !process.env.SESSION_SECRET) {
  console.warn(
    '[falcao] SESSION_SECRET não definido: as sessões usam a chave padrão. Defina a variável no ambiente de produção.',
  );
}

export const env = parsed.success ? parsed.data : schema.parse({});
export type Env = typeof env;
