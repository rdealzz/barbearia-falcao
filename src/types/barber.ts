import type { DateString, ID, TimeString, Timestamped } from './common';

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface WorkingHours {
  weekday: Weekday;
  /** Intervalos de trabalho no dia. Vazio = folga. */
  shifts: Array<{ start: TimeString; end: TimeString }>;
}

export type TimeOffReason = 'ferias' | 'folga' | 'ausencia' | 'feriado' | 'bloqueio';

export interface TimeOff {
  id: ID;
  barberId: ID;
  reason: TimeOffReason;
  start: DateString;
  end: DateString;
  /** Quando ausente, o período inteiro fica bloqueado. */
  startTime?: TimeString;
  endTime?: TimeString;
  note?: string;
}

export interface ScheduleSettings {
  /** Intervalo de oferta de horários na grade, em minutos. */
  slotIntervalInMinutes: number;
  /** Folga entre atendimentos, em minutos. */
  bufferInMinutes: number;
  /** Teto de atendimentos por dia. 0 = ilimitado. */
  dailyAppointmentLimit: number;
  /** Antecedência mínima para agendar, em minutos. */
  minimumNoticeInMinutes: number;
  /** Janela máxima de agendamento, em dias. */
  bookingHorizonInDays: number;
}

export interface Barber extends Timestamped {
  id: ID;
  slug: string;
  name: string;
  nickname?: string;
  role: string;
  bio: string;
  headline: string;
  avatarUrl: string;
  coverUrl?: string;
  specialties: string[];
  experienceSince: number;
  instagramUrl?: string;
  rating: number;
  reviewsCount: number;
  isActive: boolean;
  acceptsNewClients: boolean;
  serviceIds: ID[];
  workingHours: WorkingHours[];
  scheduleSettings: ScheduleSettings;
}
