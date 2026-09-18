import type { Appointment } from '@/types';
import type { AppointmentRepository } from '@/services/repositories';
import { nextId, store, timestamp } from '../store';

export const mockAppointmentRepository: AppointmentRepository = {
  async create(input) {
    const appointment: Appointment = {
      id: nextId('apt'),
      code: `FLC-${Math.floor(1000 + Math.random() * 9000)}`,
      clientId: input.clientId,
      barberId: input.barberId,
      serviceId: input.serviceId,
      date: input.date,
      startTime: input.startTime,
      endTime: input.endTime,
      status: 'confirmed',
      priceInCents: input.priceInCents,
      payment: {
        method: input.paymentMethod ?? 'cash',
        status: input.paymentMethod === 'plan' ? 'not_required' : 'pending',
        amountInCents: input.priceInCents,
      },
      notes: input.notes,
      isManual: input.isManual ?? false,
      manualClientName: input.manualClientName,
      createdAt: timestamp(),
      updatedAt: timestamp(),
    };

    store.appointments.push(appointment);
    return appointment;
  },

  async findById(id) {
    return store.appointments.find((appointment) => appointment.id === id) ?? null;
  },

  async listByClient(clientId) {
    return store.appointments
      .filter((appointment) => appointment.clientId === clientId)
      .sort((a, b) => `${b.date}${b.startTime}`.localeCompare(`${a.date}${a.startTime}`));
  },

  async listByBarber(barberId, { from, to } = {}) {
    return store.appointments
      .filter(
        (appointment) =>
          appointment.barberId === barberId &&
          (!from || appointment.date >= from) &&
          (!to || appointment.date <= to),
      )
      .sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`));
  },

  async listByBarberAndDate(barberId, date) {
    return store.appointments
      .filter((appointment) => appointment.barberId === barberId && appointment.date === date)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  },

  async listByDate(date) {
    return store.appointments
      .filter((appointment) => appointment.date === date)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  },

  async updateStatus(id, status, reason) {
    const appointment = store.appointments.find((item) => item.id === id);
    if (!appointment) return null;

    appointment.status = status;
    appointment.updatedAt = timestamp();
    if (status === 'cancelled') {
      appointment.cancelledAt = timestamp();
      appointment.cancellationReason = reason;
    }
    return appointment;
  },

  async update(id, patch) {
    const index = store.appointments.findIndex((item) => item.id === id);
    const current = store.appointments[index];
    if (index < 0 || !current) return null;

    const updated: Appointment = { ...current, ...patch, id: current.id, updatedAt: timestamp() };
    store.appointments[index] = updated;
    return updated;
  },
};
