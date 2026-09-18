'use server';

import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth/current-user';
import { db } from '@/services';
import type { ActionState } from '@/features/auth/state';
import type { AppointmentStatus } from '@/types';

const allowed: AppointmentStatus[] = [
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
  'no_show',
];

export async function updateAppointmentStatusAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user || user.role !== 'barber' || !user.barberId) {
    return { status: 'error', message: 'Acesso restrito à equipe.' };
  }

  const appointmentId = String(formData.get('appointmentId') ?? '');
  const status = String(formData.get('status') ?? '') as AppointmentStatus;

  if (!allowed.includes(status)) {
    return { status: 'error', message: 'Status inválido.' };
  }

  const appointment = await db.appointments.findById(appointmentId);
  if (!appointment || appointment.barberId !== user.barberId) {
    return { status: 'error', message: 'Agendamento fora da sua agenda.' };
  }

  await db.appointments.updateStatus(appointmentId, status);
  revalidatePath('/painel', 'layout');
  revalidatePath('/conta', 'layout');

  return { status: 'success' };
}
