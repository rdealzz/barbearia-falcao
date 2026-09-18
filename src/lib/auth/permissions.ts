import type { StaffRole, User } from '@/types';

/**
 * Ponto único de verdade sobre o que cada nível da equipe pode fazer.
 * Espelha `barbearia.is_owner()` no banco — se mudar aqui, mude lá.
 */
export interface StaffPermissions {
  /** Base completa de clientes da barbearia. */
  manageClients: boolean;
  /** Agenda de todos os barbeiros, não apenas a própria. */
  viewTeamAgenda: boolean;
  /** Faturamento consolidado da casa. */
  viewFinance: boolean;
  /** Alterar a agenda de outro barbeiro. */
  manageOtherAgendas: boolean;
}

const OWNER: StaffPermissions = {
  manageClients: true,
  viewTeamAgenda: true,
  viewFinance: true,
  manageOtherAgendas: true,
};

const EMPLOYEE: StaffPermissions = {
  manageClients: false,
  viewTeamAgenda: false,
  viewFinance: false,
  manageOtherAgendas: false,
};

export function staffRoleOf(user: Pick<User, 'role' | 'staffRole'> | null): StaffRole | null {
  if (!user || user.role !== 'barber') return null;
  return user.staffRole ?? 'barber';
}

export function isOwner(user: Pick<User, 'role' | 'staffRole'> | null): boolean {
  return staffRoleOf(user) === 'owner';
}

export function permissionsFor(user: Pick<User, 'role' | 'staffRole'> | null): StaffPermissions {
  return isOwner(user) ? OWNER : EMPLOYEE;
}

export const STAFF_ROLE_LABELS: Record<StaffRole, string> = {
  owner: 'Barbeiro-chefe',
  barber: 'Barbeiro',
};
