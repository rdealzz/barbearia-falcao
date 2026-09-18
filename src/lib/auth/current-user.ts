import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { db } from '@/services';
import type { User, UserRole } from '@/types';
import { getSession } from './session';

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
