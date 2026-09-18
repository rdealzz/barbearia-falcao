import 'server-only';
import { db } from '@/services';
import type {
  AvailabilityDay,
  DateString,
  ID,
  Result,
} from '@/types';
import { fail, ok } from '@/types/common';
import { addDays, rangeOfDays, todayDateString } from '@/lib/utils/date';
import { buildAvailability, endTimeFor, hasConflict } from './availability';

export async function getAvailability(
  barberId: ID,
  serviceId: ID,
  date: DateString,
): Promise<AvailabilityDay> {
  const [barber, service] = await Promise.all([
    db.barbers.findById(barberId),
    db.services.findById(serviceId),
  ]);

  if (!barber || !service) return { date, slots: [], hasAvailability: false };

  const [appointments, timeOff] = await Promise.all([
    db.appointments.listByBarberAndDate(barberId, date),
    db.barbers.listTimeOff(barberId),
  ]);

  return buildAvailability({
    barber,
    date,
    serviceDurationInMinutes: service.durationInMinutes,
    appointments,
    timeOff,
  });
}

/** Resumo de disponibilidade usado pelo calendário do agendamento. */
export async function getAvailabilityRange(
  barberId: ID,
  serviceId: ID,
  startDate: DateString = todayDateString(),
  days = 14,
): Promise<AvailabilityDay[]> {
  const barber = await db.barbers.findById(barberId);
  if (!barber) return [];

  const horizon = Math.min(days, barber.scheduleSettings.bookingHorizonInDays);
  const dates = rangeOfDays(startDate, horizon);

  return Promise.all(dates.map((date) => getAvailability(barberId, serviceId, date)));
}

export interface BookingRequest {
  clientId: ID;
  barberId: ID;
  serviceId: ID;
  date: DateString;
  startTime: string;
  notes?: string;
  paymentMethod?: 'pix' | 'credit_card' | 'boleto' | 'cash' | 'plan';
}

export async function createBooking(request: BookingRequest) {
  const [barber, service, client] = await Promise.all([
    db.barbers.findById(request.barberId),
    db.services.findById(request.serviceId),
    db.users.findById(request.clientId),
  ]);

  if (!barber) return fail('Barbeiro não encontrado.');
  if (!service) return fail('Serviço não encontrado.');
  if (!client) return fail('Cliente não encontrado.');
  if (!barber.serviceIds.includes(service.id)) {
    return fail('Este barbeiro não executa o serviço selecionado.');
  }

  const maxDate = addDays(todayDateString(), barber.scheduleSettings.bookingHorizonInDays);
  if (request.date > maxDate) {
    return fail('Data fora da janela de agendamento.');
  }

  const availability = await getAvailability(request.barberId, request.serviceId, request.date);
  const slot = availability.slots.find((item) => item.time === request.startTime);

  if (!slot) return fail('Horário inválido para este serviço.');
  if (!slot.available) return fail('Este horário acabou de ser ocupado. Escolha outro.');

  // Segunda checagem contra corrida entre duas reservas simultâneas.
  const sameDay = await db.appointments.listByBarberAndDate(request.barberId, request.date);
  if (
    hasConflict(
      sameDay,
      request.startTime,
      service.durationInMinutes,
      barber.scheduleSettings.bufferInMinutes,
    )
  ) {
    return fail('Este horário acabou de ser ocupado. Escolha outro.');
  }

  const subscription = await db.plans.findActiveSubscription(request.clientId);
  const coveredByPlan = Boolean(
    subscription &&
      subscription.status === 'active' &&
      service.includedInPlanIds.includes(subscription.planId),
  );

  const appointment = await db.appointments.create({
    ...request,
    endTime: endTimeFor(request.startTime, service.durationInMinutes),
    priceInCents: coveredByPlan ? 0 : service.priceInCents,
    paymentMethod: coveredByPlan ? 'plan' : request.paymentMethod,
  });

  return ok(appointment);
}

export async function cancelBooking(
  appointmentId: ID,
  userId: ID,
  reason?: string,
): Promise<Result<true>> {
  const appointment = await db.appointments.findById(appointmentId);
  if (!appointment) return fail('Agendamento não encontrado.');
  if (appointment.clientId !== userId) return fail('Sem permissão para cancelar.');
  if (['completed', 'cancelled'].includes(appointment.status)) {
    return fail('Este agendamento não pode mais ser cancelado.');
  }

  await db.appointments.updateStatus(appointmentId, 'cancelled', reason);
  return ok(true);
}
