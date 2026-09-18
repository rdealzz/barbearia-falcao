'use server';

import { revalidatePath } from 'next/cache';
import { createSession, destroySession } from '@/lib/auth/session';
import { getCurrentUser } from '@/lib/auth/current-user';
import { db } from '@/services';
import type { ActionState } from './state';
import { loginSchema, passwordSchema, profileSchema, recoverySchema, registerSchema } from './schemas';

function fieldErrors(error: { issues: Array<{ path: PropertyKey[]; message: string }> }) {
  return error.issues.reduce<Record<string, string>>((acc, issue) => {
    const key = String(issue.path[0] ?? 'form');
    acc[key] ??= issue.message;
    return acc;
  }, {});
}

export async function loginAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: 'error', errors: fieldErrors(parsed.error) };
  }

  const user = await db.users.verifyPassword(parsed.data.email, parsed.data.password);
  if (!user) {
    return { status: 'error', message: 'E-mail ou senha incorretos.' };
  }

  await createSession(user.id, user.role);
  revalidatePath('/', 'layout');

  return { status: 'success', message: user.role === 'barber' ? '/painel' : '/conta' };
}

export async function registerAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: 'error', errors: fieldErrors(parsed.error) };
  }

  const existing = await db.users.findByEmail(parsed.data.email);
  if (existing) {
    return { status: 'error', message: 'Já existe uma conta com este e-mail.' };
  }

  const user = await db.users.create({
    role: 'client',
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    password: parsed.data.password,
    emailVerified: false,
    marketingOptIn: formData.get('marketingOptIn') === 'on',
  });

  await createSession(user.id, user.role);
  revalidatePath('/', 'layout');

  return { status: 'success', message: '/conta' };
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  revalidatePath('/', 'layout');
}

export async function updateProfileAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { status: 'error', message: 'Sessão expirada. Entre novamente.' };

  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: 'error', errors: fieldErrors(parsed.error) };
  }

  const { zipCode, street, number, complement, district, city, state, ...profile } = parsed.data;

  await db.users.update(user.id, {
    ...profile,
    address: { zipCode, street, number, complement, district, city, state },
  });

  revalidatePath('/conta', 'layout');
  return { status: 'success', message: 'Perfil atualizado com sucesso.' };
}

export async function updatePasswordAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { status: 'error', message: 'Sessão expirada. Entre novamente.' };

  const parsed = passwordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: 'error', errors: fieldErrors(parsed.error) };
  }

  const valid = await db.users.verifyPassword(user.email, parsed.data.currentPassword);
  if (!valid) return { status: 'error', errors: { currentPassword: 'Senha atual incorreta.' } };

  await db.users.updatePassword(user.id, parsed.data.newPassword);
  return { status: 'success', message: 'Senha alterada com sucesso.' };
}

export async function requestPasswordRecoveryAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = recoverySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: 'error', errors: fieldErrors(parsed.error) };
  }

  // O envio real do e-mail entra com a integração de autenticação.
  // A resposta é sempre igual para não revelar quais e-mails existem.
  return {
    status: 'success',
    message: 'Se houver uma conta com este e-mail, enviaremos as instruções em instantes.',
  };
}
