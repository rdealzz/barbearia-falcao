import type { TimeOff } from '@/types';
import { addDays, todayDateString } from '@/lib/utils/date';

export function buildTimeOffSeed(): TimeOff[] {
  const today = todayDateString();
  return [
    {
      id: 'off_1',
      barberId: 'brb_lucas',
      reason: 'ferias',
      start: addDays(today, 10),
      end: addDays(today, 17),
      note: 'Férias programadas.',
    },
    {
      id: 'off_2',
      barberId: 'brb_falcao',
      reason: 'ausencia',
      start: addDays(today, 4),
      end: addDays(today, 4),
      startTime: '09:00',
      endTime: '13:00',
      note: 'Compromisso pessoal pela manhã.',
    },
  ];
}
