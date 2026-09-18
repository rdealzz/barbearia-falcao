import type {
  Appointment,
  Barber,
  DateString,
  Service,
  TimeOff,
  TimeString,
  User,
} from '@/types';
import {
  addMinutes,
  minutesToTime,
  overlaps,
  timeToMinutes,
  todayDateString,
  weekdayOf,
} from '@/lib/utils/date';

/** Estados possíveis de um horário na grade do painel. */
export type SlotState = 'free' | 'booked' | 'blocked' | 'past';

/**
 * O que ocupa o horário na visão do barbeiro. Diferente da disponibilidade
 * pública, atendimentos já finalizados continuam visíveis: o barbeiro precisa
 * saber quem passou pela cadeira. Só o cancelado devolve o horário à grade.
 */
const OCCUPYING_STATUSES: Appointment['status'][] = [
  'pending',
  'confirmed',
  'in_progress',
  'completed',
  'no_show',
];

export interface PanelSlot {
  startTime: TimeString;
  endTime: TimeString;
  state: SlotState;
  /** Atendimento que ocupa o horário, com quem marcou. */
  appointment?: Appointment;
  client?: User;
  service?: Service;
  /** Bloqueio que cobre o horário — a chave para liberá-lo de novo. */
  block?: TimeOff;
  /** Primeiro horário de um bloco que se estende por vários slots. */
  isBlockStart?: boolean;
}

export interface PanelShift {
  start: TimeString;
  end: TimeString;
  slots: PanelSlot[];
}

export interface PanelDay {
  date: DateString;
  isWorkingDay: boolean;
  /** Jornada do barbeiro no dia, dividida em turnos. */
  shifts: PanelShift[];
  blocks: TimeOff[];
  totals: { booked: number; free: number; blocked: number };
  /** Abertura e fechamento do dia, úteis para os atalhos de jornada. */
  dayStart?: TimeString;
  dayEnd?: TimeString;
}

interface BuildPanelDayInput {
  barber: Barber;
  date: DateString;
  appointments: Appointment[];
  timeOff: TimeOff[];
  clients: User[];
  services: Service[];
  now?: Date;
}

function blocksCovering(timeOff: TimeOff[], date: DateString): Array<TimeOff & { from: number; to: number }> {
  return timeOff
    .filter((entry) => entry.start <= date && date <= entry.end)
    .map((entry) => ({
      ...entry,
      from: entry.startTime ? timeToMinutes(entry.startTime) : 0,
      to: entry.endTime ? timeToMinutes(entry.endTime) : 24 * 60,
    }));
}

/**
 * Grade completa do dia de um barbeiro: o que está livre, quem marcou cada
 * horário e o que foi bloqueado manualmente. Diferente de `buildAvailability`,
 * aqui nada é escondido — o barbeiro precisa enxergar a agenda inteira.
 */
export function buildPanelDay({
  barber,
  date,
  appointments,
  timeOff,
  clients,
  services,
  now = new Date(),
}: BuildPanelDayInput): PanelDay {
  const { slotIntervalInMinutes } = barber.scheduleSettings;
  const weekday = weekdayOf(date);
  const workday = barber.workingHours.find((entry) => entry.weekday === weekday);
  const shifts = workday?.shifts ?? [];

  const blocks = blocksCovering(timeOff, date);
  const dayAppointments = appointments.filter(
    (appointment) => appointment.date === date && appointment.barberId === barber.id,
  );

  const today = todayDateString();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const isPastMinute = (minutes: number) =>
    date < today || (date === today && minutes + slotIntervalInMinutes <= nowMinutes);

  const seenBlocks = new Set<string>();
  const totals = { booked: 0, free: 0, blocked: 0 };

  const panelShifts: PanelShift[] = shifts.map((shift) => {
    const start = timeToMinutes(shift.start);
    const end = timeToMinutes(shift.end);
    const slots: PanelSlot[] = [];

    for (let cursor = start; cursor + slotIntervalInMinutes <= end; cursor += slotIntervalInMinutes) {
      const slotEnd = cursor + slotIntervalInMinutes;
      const startTime = minutesToTime(cursor);

      const appointment = dayAppointments.find(
        (item) =>
          OCCUPYING_STATUSES.includes(item.status) &&
          overlaps(cursor, slotEnd, timeToMinutes(item.startTime), timeToMinutes(item.endTime)),
      );

      const block = blocks.find((entry) => overlaps(cursor, slotEnd, entry.from, entry.to));

      const slot: PanelSlot = {
        startTime,
        endTime: minutesToTime(slotEnd),
        state: 'free',
      };

      if (appointment) {
        slot.state = 'booked';
        slot.appointment = appointment;
        slot.client = clients.find((client) => client.id === appointment.clientId);
        slot.service = services.find((service) => service.id === appointment.serviceId);
        totals.booked += 1;
      } else if (block) {
        slot.state = 'blocked';
        slot.block = block;
        slot.isBlockStart = !seenBlocks.has(block.id);
        seenBlocks.add(block.id);
        totals.blocked += 1;
      } else if (isPastMinute(cursor)) {
        slot.state = 'past';
      } else {
        totals.free += 1;
      }

      slots.push(slot);
    }

    return { start: shift.start, end: shift.end, slots };
  });

  return {
    date,
    isWorkingDay: shifts.length > 0,
    shifts: panelShifts,
    blocks,
    totals,
    dayStart: shifts[0]?.start,
    dayEnd: shifts[shifts.length - 1]?.end,
  };
}

/** Fim de um bloqueio de N slots a partir de um horário. */
export function slotEndTime(barber: Barber, startTime: TimeString): TimeString {
  return addMinutes(startTime, barber.scheduleSettings.slotIntervalInMinutes);
}

export const SLOT_STATE_LABELS: Record<SlotState, string> = {
  free: 'Livre',
  booked: 'Marcado',
  blocked: 'Bloqueado',
  past: 'Passou',
};
