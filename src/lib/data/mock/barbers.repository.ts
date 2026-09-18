import type { BarberRepository } from '@/services/repositories';
import { nextId, store } from '../store';

export const mockBarberRepository: BarberRepository = {
  async list({ onlyActive = true, serviceId } = {}) {
    return store.barbers.filter(
      (barber) =>
        (!onlyActive || barber.isActive) &&
        (!serviceId || barber.serviceIds.includes(serviceId)),
    );
  },

  async findById(id) {
    return store.barbers.find((barber) => barber.id === id) ?? null;
  },

  async findBySlug(slug) {
    return store.barbers.find((barber) => barber.slug === slug) ?? null;
  },

  async listTimeOff(barberId, { from, to } = {}) {
    return store.timeOff
      .filter(
        (entry) =>
          entry.barberId === barberId &&
          (!to || entry.start <= to) &&
          (!from || entry.end >= from),
      )
      .sort((a, b) => `${a.start}${a.startTime ?? ''}`.localeCompare(`${b.start}${b.startTime ?? ''}`));
  },

  async findTimeOffById(id) {
    return store.timeOff.find((entry) => entry.id === id) ?? null;
  },

  async createTimeOff(input) {
    const entry = { ...input, id: nextId('off') };
    store.timeOff.push(entry);
    return entry;
  },

  async deleteTimeOff(id) {
    const index = store.timeOff.findIndex((entry) => entry.id === id);
    if (index < 0) return false;
    store.timeOff.splice(index, 1);
    return true;
  },
};
