import type { Repositories } from '@/services/repositories';
import { mockAppointmentRepository } from './appointments.repository';
import { mockBarberRepository } from './barbers.repository';
import { mockClubRepository } from './club.repository';
import { mockPlanRepository } from './plans.repository';
import { mockServiceRepository } from './services.repository';
import { mockUserRepository } from './users.repository';

export const mockRepositories: Repositories = {
  services: mockServiceRepository,
  barbers: mockBarberRepository,
  appointments: mockAppointmentRepository,
  users: mockUserRepository,
  plans: mockPlanRepository,
  club: mockClubRepository,
};
