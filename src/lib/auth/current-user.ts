import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { db } from '@/services';
import type { User, UserRole } from '@/types';
import { getSession } from './session';
import { isOwner } from './permissions';

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const session = await getSession();
  if (!session) return null;
  return db.users.findById(session.userId);
});

export async function requireUser(redirectTo = '/entrar'): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect(redirectTo);
  return user;
}

export async function requireRole(role: UserRole, redirectTo = '/entrar'): Promise<User> {
  const user = await requireUser(redirectTo);
  if (user.role !== role) redirect('/');
  return user;
}

/** Qualquer membro da equipe com perfil de barbeiro vinculado. */
export async function requireStaff(): Promise<User & { barberId: string }> {
  const user = await requireUser('/entrar?redirect=/painel');
  if (user.role !== 'barber' || !user.barberId) redirect('/conta');
  return user as User & { barberId: string };
}

/** Rotas exclusivas do barbeiro-chefe (dono). */
export async function requireOwner(): Promise<User & { barberId: string }> {
  const user = await requireStaff();
  if (!isOwner(user)) redirect('/painel');
  return user;
}
