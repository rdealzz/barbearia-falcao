import type {
  Appointment,
  AvailabilityDay,
  Barber,
  DateString,
  TimeOff,
  TimeSlot,
} from '@/types';
import {
  addMinutes,
  minutesToTime,
  overlaps,
  timeToMinutes,
  todayDateString,
  weekdayOf,
} from '@/lib/utils/date';

const BLOCKING_STATUSES: Appointment['status'][] = [
  'pending',
  'confirmed',
  'in_progress',
];

interface AvailabilityInput {
  barber: Barber;
  date: DateString;
  serviceDurationInMinutes: number;
  appointments: Appointment[];
  timeOff: TimeOff[];
  /** Injetável para testes; por padrão, o instante atual. */
  now?: Date;
}

interface Interval {
  start: number;
  end: number;
}

function workingIntervals(barber: Barber, date: DateString): Interval[] {
  const weekday = weekdayOf(date);
  const day = barber.workingHours.find((entry) => entry.weekday === weekday);
  if (!day) return [];

  return day.shifts.map((shift) => ({
    start: timeToMinutes(shift.start),
    end: timeToMinutes(shift.end),
  }));
}

function timeOffIntervals(timeOff: TimeOff[], date: DateString): Interval[] {
  return timeOff
    .filter((entry) => entry.start <= date && date <= entry.end)
    .map((entry) => ({
      start: entry.startTime ? timeToMinutes(entry.startTime) : 0,
      end: entry.endTime ? timeToMinutes(entry.endTime) : 24 * 60,
    }));
}

function busyIntervals(appointments: Appointment[], bufferInMinutes: number): Interval[] {
  return appointments
    .filter((appointment) => BLOCKING_STATUSES.includes(appointment.status))
    .map((appointment) => ({
      start: timeToMinutes(appointment.startTime) - bufferInMinutes,
      end: timeToMinutes(appointment.endTime) + bufferInMinutes,
    }));
}

/**
 * Grade de horários de um barbeiro em um dia, considerando jornada,
 * bloqueios, folgas, atendimentos existentes, buffer, limite diário e
 * antecedência mínima. Cada agenda é independente por barbeiro.
 */
export function buildAvailability({
  barber,
  date,
  serviceDurationInMinutes,
  appointments,
  timeOff,
  now = new Date(),
}: AvailabilityInput): AvailabilityDay {
  const { slotIntervalInMinutes, bufferInMinutes, dailyAppointmentLimit, minimumNoticeInMinutes } =
    barber.scheduleSettings;

  const shifts = workingIntervals(barber, date);
  if (shifts.length === 0) {
    return { date, slots: [], hasAvailability: false };
  }

  const dayAppointments = appointments.filter(
    (appointment) => appointment.date === date && appointment.barberId === barber.id,
  );
  const activeCount = dayAppointments.filter((appointment) =>
    BLOCKING_STATUSES.includes(appointment.status),
  ).length;
  const limitReached =
    dailyAppointmentLimit > 0 && activeCount >= dailyAppointmentLimit;

  const blocked = [
    ...timeOffIntervals(timeOff, date),
    ...busyIntervals(dayAppointments, bufferInMinutes),
  ];

  const today = todayDateString();
  const isToday = date === today;
  const isPastDate = date < today;
  const earliestMinutes =
    now.getHours() * 60 + now.getMinutes() + minimumNoticeInMinutes;

  const slots: TimeSlot[] = [];

  for (const shift of shifts) {
    for (
      let cursor = shift.start;
      cursor + serviceDurationInMinutes <= shift.end;
      cursor += slotIntervalInMinutes
    ) {
      const slotEnd = cursor + serviceDurationInMinutes;
      const time = minutesToTime(cursor);

      const reason = ((): TimeSlot['reason'] | undefined => {
        if (isPastDate || (isToday && cursor < earliestMinutes)) return 'past';
        if (limitReached) return 'limit_reached';
        if (blocked.some((interval) => overlaps(cursor, slotEnd, interval.start, interval.end))) {
          return timeOffIntervals(timeOff, date).some((interval) =>
            overlaps(cursor, slotEnd, interval.start, interval.end),
          )
            ? 'time_off'
            : 'booked';
        }
        return undefined;
      })();

      slots.push({ time, available: reason === undefined, reason });
    }
  }

  slots.sort((a, b) => a.time.localeCompare(b.time));

  return {
    date,
    slots,
    hasAvailability: slots.some((slot) => slot.available),
  };
}

/** Conflito de horário na agenda do barbeiro, já com o buffer aplicado. */
export function hasConflict(
  appointments: Appointment[],
  startTime: string,
  durationInMinutes: number,
  bufferInMinutes: number,
): boolean {
  const start = timeToMinutes(startTime);
  const end = start + durationInMinutes;

  return busyIntervals(appointments, bufferInMinutes).some((interval) =>
    overlaps(start, end, interval.start, interval.end),
  );
}

export function endTimeFor(startTime: string, durationInMinutes: number): string {
  return addMinutes(startTime, durationInMinutes);
}
