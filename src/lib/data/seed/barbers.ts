import type { Barber, ScheduleSettings, WorkingHours } from '@/types';

const now = '2026-01-05T12:00:00.000Z';

const defaultSchedule: ScheduleSettings = {
  slotIntervalInMinutes: 30,
  bufferInMinutes: 10,
  dailyAppointmentLimit: 12,
  minimumNoticeInMinutes: 60,
  bookingHorizonInDays: 45,
};

const weekdayShift = (start: string, end: string) => [{ start, end }];

const standardHours: WorkingHours[] = [
  { weekday: 0, shifts: [] },
  { weekday: 1, shifts: weekdayShift('08:30', '20:30') },
  { weekday: 2, shifts: weekdayShift('08:30', '20:30') },
  { weekday: 3, shifts: weekdayShift('08:30', '20:30') },
  { weekday: 4, shifts: weekdayShift('08:30', '20:30') },
  { weekday: 5, shifts: weekdayShift('08:30', '20:30') },
  { weekday: 6, shifts: weekdayShift('08:30', '18:00') },
];

const lateHours: WorkingHours[] = [
  { weekday: 0, shifts: [] },
  { weekday: 1, shifts: [] },
  { weekday: 2, shifts: weekdayShift('11:00', '20:30') },
  { weekday: 3, shifts: weekdayShift('11:00', '20:30') },
  { weekday: 4, shifts: weekdayShift('11:00', '20:30') },
  { weekday: 5, shifts: weekdayShift('11:00', '20:30') },
  { weekday: 6, shifts: weekdayShift('08:30', '18:00') },
];

const splitHours: WorkingHours[] = [
  { weekday: 0, shifts: [] },
  { weekday: 1, shifts: [{ start: '08:30', end: '13:00' }, { start: '14:30', end: '20:30' }] },
  { weekday: 2, shifts: [{ start: '08:30', end: '13:00' }, { start: '14:30', end: '20:30' }] },
  { weekday: 3, shifts: [{ start: '08:30', end: '13:00' }, { start: '14:30', end: '20:30' }] },
  { weekday: 4, shifts: [{ start: '08:30', end: '13:00' }, { start: '14:30', end: '20:30' }] },
  { weekday: 5, shifts: [{ start: '08:30', end: '13:00' }, { start: '14:30', end: '20:30' }] },
  { weekday: 6, shifts: weekdayShift('08:30', '17:00') },
];

const allServices = [
  'svc_corte',
  'svc_corte_barba',
  'svc_barba',
  'svc_pezinho',
  'svc_infantil',
  'svc_sobrancelha',
  'svc_hidratacao',
];

/**
 * Barbeiros de demonstração: nome, bio, foto e especialidades precisam ser
 * substituídos pelos profissionais reais da casa antes do lançamento.
 * `rating`/`reviewsCount` ficam zerados de propósito — a única avaliação
 * pública confirmada é a da barbearia (ver siteConfig.reputation).
 */
export const barbersSeed: Barber[] = [
  {
    id: 'brb_falcao',
    slug: 'rafael-falcao',
    name: 'Rafael Falcão',
    nickname: 'Falcão',
    role: 'Barbeiro-chefe e fundador',
    headline: 'Degradês milimétricos e barba desenhada na navalha.',
    bio: 'Fundador da Falcão em 2018, Rafael construiu a casa em cima de uma ideia simples: barbearia é ofício, não pressa. Referência em degradê e no acabamento com navalha, atende clientes que voltam há anos pela mesma cadeira.',
    avatarUrl: '',
    specialties: ['Degradê', 'Navalha', 'Barba desenhada', 'Visagismo'],
    experienceSince: 2012,
    instagramUrl: 'https://www.instagram.com/barbeariia_falcao/',
    rating: 0,
    reviewsCount: 0,
    isActive: true,
    acceptsNewClients: true,
    serviceIds: [...allServices, 'svc_platinado'],
    workingHours: standardHours,
    scheduleSettings: defaultSchedule,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'brb_lucas',
    slug: 'lucas-moreira',
    name: 'Lucas Moreira',
    role: 'Barbeiro sênior',
    headline: 'Cortes sociais, texturizados e finalização impecável.',
    bio: 'Especialista em cortes sociais e texturizados, Lucas tem mão leve na tesoura e obsessão por simetria. É o nome certo para quem quer um corte discreto e perfeito para o ambiente de trabalho.',
    avatarUrl: '',
    specialties: ['Corte social', 'Texturizado', 'Tesoura', 'Sobrancelha'],
    experienceSince: 2016,
    instagramUrl: 'https://www.instagram.com/barbeariia_falcao/',
    rating: 0,
    reviewsCount: 0,
    isActive: true,
    acceptsNewClients: true,
    serviceIds: allServices,
    workingHours: splitHours,
    scheduleSettings: { ...defaultSchedule, dailyAppointmentLimit: 10 },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'brb_diego',
    slug: 'diego-santos',
    name: 'Diego Santos',
    role: 'Barbeiro e colorista',
    headline: 'Platinado, luzes e química com preservação do fio.',
    bio: 'Diego é o responsável pelos trabalhos de cor da casa. Trabalha em etapas, com avaliação prévia do fio e protocolo de reconstrução, para entregar platinado e luzes sem comprometer a saúde do cabelo.',
    avatarUrl: '',
    specialties: ['Platinado', 'Luzes', 'Coloração', 'Reconstrução'],
    experienceSince: 2018,
    instagramUrl: 'https://www.instagram.com/barbeariia_falcao/',
    rating: 0,
    reviewsCount: 0,
    isActive: true,
    acceptsNewClients: true,
    serviceIds: [...allServices, 'svc_platinado'],
    workingHours: lateHours,
    scheduleSettings: { ...defaultSchedule, slotIntervalInMinutes: 60, dailyAppointmentLimit: 8 },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'brb_matheus',
    slug: 'matheus-lima',
    name: 'Matheus Lima',
    role: 'Barbeiro',
    headline: 'Atendimento infantil e cortes clássicos.',
    bio: 'Paciente com os pequenos e preciso nos clássicos, Matheus atende famílias inteiras — do primeiro corte do filho ao corte do avô.',
    avatarUrl: '',
    specialties: ['Infantil', 'Clássico', 'Pezinho', 'Barba'],
    experienceSince: 2019,
    instagramUrl: 'https://www.instagram.com/barbeariia_falcao/',
    rating: 0,
    reviewsCount: 0,
    isActive: true,
    acceptsNewClients: true,
    serviceIds: allServices,
    workingHours: standardHours,
    scheduleSettings: defaultSchedule,
    createdAt: now,
    updatedAt: now,
  },
];
