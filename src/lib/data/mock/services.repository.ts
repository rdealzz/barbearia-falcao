import type { ServiceRepository } from '@/services/repositories';
import { store } from '../store';

export const mockServiceRepository: ServiceRepository = {
  async list({ onlyActive = true, featured } = {}) {
    return store.services.filter(
      (service) =>
        (!onlyActive || service.isActive) &&
        (featured === undefined || service.isFeatured === featured),
    );
  },

  async findById(id) {
    return store.services.find((service) => service.id === id) ?? null;
  },

  async findBySlug(slug) {
    return store.services.find((service) => service.slug === slug) ?? null;
  },

  async findManyByIds(ids) {
    const set = new Set(ids);
    return store.services.filter((service) => set.has(service.id));
  },
};
