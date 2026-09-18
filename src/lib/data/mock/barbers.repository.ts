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

  async listTimeOff(barberId) {
    return store.timeOff.filter((entry) => entry.barberId === barberId);
  },

  async createTimeOff(input) {
    const entry = { ...input, id: nextId('off') };
    store.timeOff.push(entry);
    return entry;
  },
};
