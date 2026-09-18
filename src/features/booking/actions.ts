'use server';

import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth/current-user';
import type { ActionState } from '@/features/auth/state';
import { cancelBooking, createBooking, getAvailability } from './booking.service';
import type { AvailabilityDay, DateString, ID } from '@/types';

export async function fetchAvailabilityAction(
  barberId: ID,
  serviceId: ID,
  date: DateString,
): Promise<AvailabilityDay> {
  return getAvailability(barberId, serviceId, date);
}

export interface BookingActionState extends ActionState {
  appointmentId?: string;
}

export async function createBookingAction(
  _state: BookingActionState,
  formData: FormData,
): Promise<BookingActionState> {
  const user = await getCurrentUser();
  if (!user) {
    return { status: 'error', message: 'Entre na sua conta para confirmar o agendamento.' };
  }

  const barberId = String(formData.get('barberId') ?? '');
  const serviceId = String(formData.get('serviceId') ?? '');
  const date = String(formData.get('date') ?? '');
  const startTime = String(formData.get('startTime') ?? '');
  const notes = String(formData.get('notes') ?? '').trim();

  if (!barberId || !serviceId || !date || !startTime) {
    return { status: 'error', message: 'Complete todas as etapas do agendamento.' };
  }

  const result = await createBooking({
    clientId: user.id,
    barberId,
    serviceId,
    date,
    startTime,
    notes: notes || undefined,
    paymentMethod: 'cash',
  });

  if (!result.ok) return { status: 'error', message: result.error };

  revalidatePath('/conta', 'layout');
  revalidatePath('/painel', 'layout');

  return { status: 'success', appointmentId: result.data.id, message: result.data.code };
}

export async function cancelBookingAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { status: 'error', message: 'Sessão expirada. Entre novamente.' };

  const result = await cancelBooking(
    String(formData.get('appointmentId') ?? ''),
    user.id,
    String(formData.get('reason') ?? '') || undefined,
  );

  if (!result.ok) return { status: 'error', message: result.error };

  revalidatePath('/conta', 'layout');
  revalidatePath('/painel', 'layout');
  return { status: 'success', message: 'Agendamento cancelado.' };
}
