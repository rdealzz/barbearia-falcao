import { CalendarRange } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { Avatar } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/shared/status-badge';
import { requireRole } from '@/lib/auth/current-user';
import { db } from '@/services';
import { addDays, rangeOfDays, startOfWeek, todayDateString, WEEKDAY_SHORT, weekdayOf } from '@/lib/utils/date';
import { parseDateString } from '@/lib/utils/format';
import type { Weekday } from '@/types';

export default async function StaffWeekPage() {
  const user = await requireRole('barber');
  const barberId = user.barberId!;

  const today = todayDateString();
  const weekStart = startOfWeek(today);
  const weekEnd = addDays(weekStart, 6);
  const days = rangeOfDays(weekStart, 7);

  const [appointments, services] = await Promise.all([
    db.appointments.listByBarber(barberId, { from: weekStart, to: weekEnd }),
    db.services.list(),
  ]);

  const clients = await db.users.findManyByIds(
    Array.from(new Set(appointments.map((appointment) => appointment.clientId))),
  );

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl text-content">Agenda da semana</h1>
        <p className="mt-1 text-sm text-muted">
          Visão completa dos seus atendimentos de segunda a domingo.
        </p>
      </header>

      {appointments.length === 0 ? (
        <EmptyState
          icon={CalendarRange}
          title="Semana sem agendamentos"
          description="Os horários reservados aparecem aqui assim que os clientes agendarem."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {days.map((date) => {
            const dayAppointments = appointments.filter(
              (appointment) => appointment.date === date,
            );
            const isToday = date === today;

            return (
              <section
                key={date}
                className={`surface-card rounded-3xl p-5 ${
                  isToday ? 'border-falcao-500/40' : ''
                }`}
              >
                <header className="flex items-baseline justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-subtle">
                      {WEEKDAY_SHORT[weekdayOf(date) as Weekday]}
                    </p>
                    <p className="font-display text-2xl text-content">
                      {parseDateString(date).getDate()}
                    </p>
                  </div>
                  {isToday ? (
                    <span className="rounded-full bg-falcao-600/20 px-2 py-0.5 text-[10px] uppercase tracking-wider text-falcao-700 dark:text-falcao-300">
                      hoje
                    </span>
                  ) : null}
                </header>

                <ul className="mt-4 space-y-3">
                  {dayAppointments.length === 0 ? (
                    <li className="rounded-2xl border border-dashed border-line px-3 py-6 text-center text-xs text-subtle">
                      Sem atendimentos
                    </li>
                  ) : (
                    dayAppointments.map((appointment) => {
                      const client = clients.find((item) => item.id === appointment.clientId);
                      const service = services.find((item) => item.id === appointment.serviceId);

                      return (
                        <li
                          key={appointment.id}
                          className="rounded-2xl bg-tint p-3 transition-colors hover:bg-tint-strong"
                        >
                          <div className="flex items-center gap-2">
                            <Avatar name={client?.name ?? 'Cliente'} src={client?.avatarUrl} size="sm" />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm text-content">
                                {client?.name ?? 'Cliente'}
                              </p>
                              <p className="text-xs text-muted">
                                {appointment.startTime} · {service?.name}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2">
                            <StatusBadge status={appointment.status} />
                          </div>
                        </li>
                      );
                    })
                  )}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
