'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth/current-user';
import { permissionsFor } from '@/lib/auth/permissions';
import { db } from '@/services';
import { hasConflict, endTimeFor } from '@/features/booking/availability';
import { timeToMinutes } from '@/lib/utils/date';
import type { ActionState } from '@/features/auth/state';
import type { Barber, TimeOffReason, User } from '@/types';

const dateField = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida.');
const timeField = z.string().regex(/^\d{2}:\d{2}$/, 'Horário inválido.');

const blockSchema = z.object({
  barberId: z.string().optional(),
  date: dateField,
  startTime: timeField,
  endTime: timeField,
  reason: z.enum(['bloqueio', 'folga', 'ausencia', 'ferias', 'feriado']).default('bloqueio'),
  note: z.string().trim().max(160).optional(),
});

const shiftSchema = z.object({
  barberId: z.string().optional(),
  date: dateField,
  /** `late` = chego mais tarde, `early` = saio mais cedo, `day` = dia inteiro. */
  mode: z.enum(['late', 'early', 'day']),
  time: timeField.optional(),
  note: z.string().trim().max(160).optional(),
});

const manualSchema = z.object({
  barberId: z.string().optional(),
  date: dateField,
  startTime: timeField,
  serviceId: z.string().min(1, 'Escolha o serviço.'),
  clientName: z.string().trim().min(2, 'Informe quem vai ocupar o horário.').max(80),
  notes: z.string().trim().max(160).optional(),
});

function firstError(error: z.ZodError): string {
  return error.issues[0]?.message ?? 'Dados inválidos.';
}

/**
 * Resolve em qual agenda a ação vai mexer. Um barbeiro funcionário só
 * altera a própria; o barbeiro-chefe pode operar a agenda de qualquer um.
 */
async function resolveAgenda(
  requestedBarberId?: string,
): Promise<{ user: User; barber: Barber } | { error: string }> {
  const user = await getCurrentUser();
  if (!user || user.role !== 'barber' || !user.barberId) {
    return { error: 'Acesso restrito à equipe.' };
  }

  const targetId = requestedBarberId?.trim() || user.barberId;
  if (targetId !== user.barberId && !permissionsFor(user).manageOtherAgendas) {
    return { error: 'Você só pode alterar a sua própria agenda.' };
  }

  const barber = await db.barbers.findById(targetId);
  if (!barber) return { error: 'Barbeiro não encontrado.' };

  return { user, barber };
}

function refreshPanel(): void {
  revalidatePath('/painel', 'layout');
  revalidatePath('/agendar');
  revalidatePath('/conta', 'layout');
}

/** Bloqueia um horário — ele deixa de ser oferecido ao cliente. */
export async function blockSlotAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = blockSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: 'error', message: firstError(parsed.error) };

  const agenda = await resolveAgenda(parsed.data.barberId);
  if ('error' in agenda) return { status: 'error', message: agenda.error };

  const { date, startTime, endTime, reason, note } = parsed.data;
  if (timeToMinutes(endTime) <= timeToMinutes(startTime)) {
    return { status: 'error', message: 'O fim do bloqueio precisa ser depois do início.' };
  }

  await db.barbers.createTimeOff({
    barberId: agenda.barber.id,
    reason: reason as TimeOffReason,
    start: date,
    end: date,
    startTime,
    endTime,
    note: note || undefined,
  });

  refreshPanel();
  return { status: 'success', message: `Horário ${startTime} bloqueado.` };
}

/** Libera um bloqueio: o horário volta a aceitar agendamento. */
export async function releaseBlockAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const blockId = String(formData.get('blockId') ?? '').trim();
  if (!blockId) return { status: 'error', message: 'Bloqueio não informado.' };

  const block = await db.barbers.findTimeOffById(blockId);
  if (!block) return { status: 'error', message: 'Este bloqueio já não existe.' };

  const agenda = await resolveAgenda(block.barberId);
  if ('error' in agenda) return { status: 'error', message: agenda.error };

  await db.barbers.deleteTimeOff(blockId);
  refreshPanel();

  return { status: 'success', message: 'Horário liberado.' };
}

/**
 * Atalhos de jornada para o dia a dia da cadeira: chegar mais tarde,
 * sair mais cedo ou tirar o dia inteiro.
 */
export async function adjustWorkdayAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = shiftSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: 'error', message: firstError(parsed.error) };

  const agenda = await resolveAgenda(parsed.data.barberId);
  if ('error' in agenda) return { status: 'error', message: agenda.error };

  const { date, mode, time, note } = parsed.data;

  if (mode !== 'day' && !time) {
    return { status: 'error', message: 'Informe o horário de referência.' };
  }

  const ranges: Record<typeof mode, { startTime?: string; endTime?: string; label: string }> = {
    late: { startTime: '00:00', endTime: time, label: `Chega às ${time}` },
    early: { startTime: time, endTime: '23:59', label: `Sai às ${time}` },
    day: { startTime: undefined, endTime: undefined, label: 'Fora o dia inteiro' },
  };

  const range = ranges[mode];

  await db.barbers.createTimeOff({
    barberId: agenda.barber.id,
    reason: mode === 'day' ? 'folga' : 'ausencia',
    start: date,
    end: date,
    startTime: range.startTime,
    endTime: range.endTime,
    note: note || range.label,
  });

  refreshPanel();
  return { status: 'success', message: `${range.label}: agenda ajustada.` };
}

/**
 * Marca um horário como já ocupado — encaixe combinado por WhatsApp,
 * cliente de balcão ou qualquer reserva que não nasceu no site.
 */
export async function createManualBookingAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = manualSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: 'error', message: firstError(parsed.error) };

  const agenda = await resolveAgenda(parsed.data.barberId);
  if ('error' in agenda) return { status: 'error', message: agenda.error };

  const { date, startTime, serviceId, clientName, notes } = parsed.data;

  const service = await db.services.findById(serviceId);
  if (!service) return { status: 'error', message: 'Serviço não encontrado.' };

  const dayAppointments = await db.appointments.listByBarberAndDate(agenda.barber.id, date);
  if (
    hasConflict(
      dayAppointments,
      startTime,
      service.durationInMinutes,
      agenda.barber.scheduleSettings.bufferInMinutes,
    )
  ) {
    return { status: 'error', message: 'Esse horário conflita com outro atendimento.' };
  }

  await db.appointments.create({
    clientId: '',
    barberId: agenda.barber.id,
    serviceId,
    date,
    startTime,
    endTime: endTimeFor(startTime, service.durationInMinutes),
    priceInCents: service.priceInCents,
    paymentMethod: 'cash',
    notes: notes || undefined,
    isManual: true,
    manualClientName: clientName,
  });

  refreshPanel();
  return { status: 'success', message: `${startTime} marcado para ${clientName}.` };
}
