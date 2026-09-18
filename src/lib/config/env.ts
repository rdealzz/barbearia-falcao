import { z } from 'zod';

const schema = z.object({
  DATA_PROVIDER: z.enum(['mock', 'prisma', 'supabase']).default('mock'),
  SESSION_SECRET: z.string().min(8).default('falcao-dev-secret'),
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
});

const parsed = schema.safeParse({
  DATA_PROVIDER: process.env.DATA_PROVIDER,
  SESSION_SECRET: process.env.SESSION_SECRET,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

export const env = parsed.success ? parsed.data : schema.parse({});
export type Env = typeof env;
