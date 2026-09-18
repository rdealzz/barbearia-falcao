import type { User } from '@/types';

const now = '2026-01-05T12:00:00.000Z';

/**
 * Usuários de demonstração. As senhas vivem em `credentialsSeed` apenas
 * enquanto o provider é "mock" — a integração real usa Supabase Auth.
 */
export const usersSeed: User[] = [
  {
    id: 'usr_cliente_1',
    role: 'client',
    name: 'Erick Jesus',
    email: 'cliente@falcao.com',
    phone: '(41) 99677-2138',
    birthDate: '2006-05-16',
    avatarUrl: '',
    address: { city: 'Curitiba', state: 'PR', district: 'Novo Mundo' },
    emailVerified: true,
    marketingOptIn: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'usr_cliente_2',
    role: 'client',
    name: 'André Ribeiro',
    email: 'andre@exemplo.com',
    phone: '(41) 98812-4410',
    birthDate: '1994-02-08',
    avatarUrl: '',
    emailVerified: true,
    marketingOptIn: false,
    notes: 'Prefere máquina 1 nas laterais.',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'usr_cliente_3',
    role: 'client',
    name: 'Bruno Carvalho',
    email: 'bruno@exemplo.com',
    phone: '(41) 99120-7788',
    avatarUrl: '',
    emailVerified: true,
    marketingOptIn: true,
    notes: 'Alérgico a produtos com mentol.',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'usr_cliente_4',
    role: 'client',
    name: 'Thiago Nunes',
    email: 'thiago@exemplo.com',
    phone: '(41) 99655-1020',
    avatarUrl: '',
    emailVerified: true,
    marketingOptIn: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'usr_barbeiro_1',
    role: 'barber',
    name: 'Rafael Falcão',
    email: 'barbeiro@falcao.com',
    phone: '(41) 99000-0001',
    barberId: 'brb_falcao',
    avatarUrl: '',
    emailVerified: true,
    marketingOptIn: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'usr_barbeiro_2',
    role: 'barber',
    name: 'Lucas Moreira',
    email: 'lucas@falcao.com',
    phone: '(41) 99000-0002',
    barberId: 'brb_lucas',
    avatarUrl: '',
    emailVerified: true,
    marketingOptIn: false,
    createdAt: now,
    updatedAt: now,
  },
];

export const credentialsSeed: Record<string, string> = {
  'cliente@falcao.com': 'falcao123',
  'barbeiro@falcao.com': 'falcao123',
  'lucas@falcao.com': 'falcao123',
};
