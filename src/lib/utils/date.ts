import type { DateString, TimeString, Weekday } from '@/types';

export function toDateString(date: Date): DateString {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function todayDateString(): DateString {
  return toDateString(new Date());
}

export function addDays(date: DateString, days: number): DateString {
  const [year, month, day] = date.split('-').map(Number);
  const next = new Date(year ?? 1970, (month ?? 1) - 1, (day ?? 1) + days);
  return toDateString(next);
}

export function weekdayOf(date: DateString): Weekday {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1).getDay() as Weekday;
}

export function timeToMinutes(time: TimeString): number {
  const [hours, minutes] = time.split(':').map(Number);
  return (hours ?? 0) * 60 + (minutes ?? 0);
}

export function minutesToTime(minutes: number): TimeString {
  const normalized = ((minutes % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  return `${String(hours).padStart(2, '0')}:${String(normalized % 60).padStart(2, '0')}`;
}

export function addMinutes(time: TimeString, minutes: number): TimeString {
  return minutesToTime(timeToMinutes(time) + minutes);
}

export function isBefore(date: DateString, other: DateString): boolean {
  return date < other;
}

export function rangeOfDays(start: DateString, count: number): DateString[] {
  return Array.from({ length: count }, (_, index) => addDays(start, index));
}

/** Segunda-feira da semana de referência. */
export function startOfWeek(date: DateString): DateString {
  const weekday = weekdayOf(date);
  const offset = weekday === 0 ? -6 : 1 - weekday;
  return addDays(date, offset);
}

export function overlaps(
  startA: number,
  endA: number,
  startB: number,
  endB: number,
): boolean {
  return startA < endB && startB < endA;
}

export const WEEKDAY_LABELS: Record<Weekday, string> = {
  0: 'Domingo',
  1: 'Segunda',
  2: 'Terça',
  3: 'Quarta',
  4: 'Quinta',
  5: 'Sexta',
  6: 'Sábado',
};

export const WEEKDAY_SHORT: Record<Weekday, string> = {
  0: 'Dom',
  1: 'Seg',
  2: 'Ter',
  3: 'Qua',
  4: 'Qui',
  5: 'Sex',
  6: 'Sáb',
};
