import type { DateString, ID, Timestamped } from './common';

export type UserRole = 'client' | 'barber' | 'admin';

/**
 * Nível de acesso dentro do painel da equipe.
 * - `owner`: barbeiro-chefe/dono — vê a base de clientes, a equipe e o caixa.
 * - `barber`: barbeiro funcionário — vê e controla apenas a própria agenda.
 */
export type StaffRole = 'owner' | 'barber';

export interface Address {
  zipCode?: string;
  street?: string;
  number?: string;
  complement?: string;
  district?: string;
  city?: string;
  state?: string;
}

export interface User extends Timestamped {
  id: ID;
  role: UserRole;
  /** Definido apenas quando role = "barber". */
  staffRole?: StaffRole;
  name: string;
  email: string;
  phone: string;
  document?: string;
  birthDate?: DateString;
  avatarUrl?: string;
  address?: Address;
  /** Vínculo com o perfil público quando role = "barber". */
  barberId?: ID;
  notes?: string;
  emailVerified: boolean;
  marketingOptIn: boolean;
}

export type PublicUser = Omit<User, 'notes'>;

export interface Session {
  userId: ID;
  role: UserRole;
  expiresAt: number;
}
