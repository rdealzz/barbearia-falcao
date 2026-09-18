import type { DateString, ID, Timestamped } from './common';

export type UserRole = 'client' | 'barber' | 'admin';

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
