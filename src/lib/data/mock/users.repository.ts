import type { User } from '@/types';
import type { UserRepository } from '@/services/repositories';
import { nextId, store, timestamp } from '../store';

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const mockUserRepository: UserRepository = {
  async findById(id) {
    return store.users.find((user) => user.id === id) ?? null;
  },

  async findByEmail(email) {
    const target = normalizeEmail(email);
    return store.users.find((user) => normalizeEmail(user.email) === target) ?? null;
  },

  async findManyByIds(ids) {
    const set = new Set(ids);
    return store.users.filter((user) => set.has(user.id));
  },

  async create({ password, ...input }) {
    const user: User = {
      ...input,
      id: nextId('usr'),
      createdAt: timestamp(),
      updatedAt: timestamp(),
    };

    store.users.push(user);
    if (password) store.credentials.set(normalizeEmail(user.email), password);
    return user;
  },

  async update(id, patch) {
    const index = store.users.findIndex((user) => user.id === id);
    const current = store.users[index];
    if (index < 0 || !current) return null;

    const updated: User = { ...current, ...patch, id: current.id, updatedAt: timestamp() };
    store.users[index] = updated;
    return updated;
  },

  async verifyPassword(email, password) {
    const target = normalizeEmail(email);
    if (store.credentials.get(target) !== password) return null;
    return store.users.find((user) => normalizeEmail(user.email) === target) ?? null;
  },

  async updatePassword(id, password) {
    const user = store.users.find((item) => item.id === id);
    if (!user) return false;
    store.credentials.set(normalizeEmail(user.email), password);
    return true;
  },
};
