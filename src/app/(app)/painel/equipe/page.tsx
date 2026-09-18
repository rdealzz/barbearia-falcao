import Link from 'next/link';
import { CalendarCheck2, Lock, Sparkles, Wallet } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { StatTile } from '@/features/account/components/stat-tile';
import { DayNav } from '@/features/staff/components/day-nav';
import { requireOwner } from '@/lib/auth/current-user';
import { db } from '@/services';
import { buildPanelDay } from '@/features/staff/schedule';
import { todayDateString } from '@/lib/utils/date';
import { formatCurrency, formatLongDate } from '@/lib/utils/format';
import { STAFF_ROLE_LABELS } from '@/lib/auth/permissions';

const isValidDate = (value?: string) => !!value && /^\d{4}-\d{2}-\d{2}$/.test(value);

/** Visão de dono: a casa inteira num dia só. */
export default async function StaffTeamPage({
  searchParams,
}: {
  searchParams: Promise<{ data?: string }>;
}) {
  await requireOwner();
  const params = await searchParams;
  const date = isValidDate(params.data) ? params.data! : todayDateString();

  const [barbers, services, appointments] = await Promise.all([
    db.barbers.list(),
    db.services.list(),
    db.appointments.listByDate(date),
  ]);

  const clients = await db.users.findManyByIds(
    Array.from(new Set(appointments.map((appointment) => appointment.clientId).filter(Boolean))),
  );

  const days = await Promise.all(
    barbers.map(async (barber) => {
      const timeOff = await db.barbers.listTimeOff(barber.id, { from: date, to: date });
      const day = buildPanelDay({
        barber,
        date,
        appointments,
        timeOff,
        clients,
        services,
      });

      const barberAppointments = appointments.filter((item) => item.barberId === barber.id);
      const revenue = barberAppointments
        .filter((item) => item.status === 'completed')
        .reduce((total, item) => total + item.priceInCents, 0);

      return { barber, day, revenue, appointments: barberAppointments };
    }),
  );

  const totals = days.reduce(
    (acc, item) => ({
      booked: acc.booked + item.day.totals.booked,
      free: acc.free + item.day.totals.free,
      blocked: acc.blocked + item.day.totals.blocked,
      revenue: acc.revenue + item.revenue,
    }),
    { booked: 0, free: 0, blocked: 0, revenue: 0 },
  );

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <p className="text-sm text-muted">{formatLongDate(date)}</p>
        <h1 className="font-display text-3xl text-content">Agenda da equipe</h1>
        <p className="text-sm text-muted">
          Como está o dia de cada barbeiro da casa. Clique num card para abrir e ajustar a agenda.
        </p>
      </header>

      <DayNav date={date} basePath="/painel/equipe" />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile icon={CalendarCheck2} label="Atendimentos" value={String(totals.booked)} />
        <StatTile icon={Sparkles} label="Horários livres" value={String(totals.free)} />
        <StatTile icon={Lock} label="Bloqueados" value={String(totals.blocked)} />
        <StatTile
          icon={Wallet}
          label="Caixa do dia"
          value={formatCurrency(totals.revenue)}
          hint="Somente atendimentos finalizados"
        />
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        {days.map(({ barber, day, revenue, appointments: items }) => (
          <section key={barber.id} className="surface-card space-y-4 rounded-3xl p-5">
            <header className="flex items-center gap-3">
              <Avatar name={barber.name} src={barber.avatarUrl} size="md" ring />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-content">{barber.name}</p>
                <p className="text-xs text-muted">{STAFF_ROLE_LABELS[barber.staffRole]}</p>
              </div>
              {!day.isWorkingDay ? (
                <Badge variant="muted">Folga</Badge>
              ) : day.totals.free === 0 ? (
                <Badge variant="brand">Lotado</Badge>
              ) : null}
            </header>

            <dl className="grid grid-cols-4 gap-2 rounded-2xl bg-tint p-3 text-center">
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-subtle">Marcados</dt>
                <dd className="font-display text-lg text-content">{day.totals.booked}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-subtle">Livres</dt>
                <dd className="font-display text-lg text-content">{day.totals.free}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-subtle">Bloq.</dt>
                <dd className="font-display text-lg text-content">{day.totals.blocked}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-subtle">Caixa</dt>
                <dd className="font-display text-lg text-content">
                  {formatCurrency(revenue).replace('R$', '').trim()}
                </dd>
              </div>
            </dl>

            {items.length > 0 ? (
              <ul className="space-y-1.5">
                {items.slice(0, 5).map((appointment) => {
                  const client = clients.find((item) => item.id === appointment.clientId);
                  const service = services.find((item) => item.id === appointment.serviceId);
                  return (
                    <li
                      key={appointment.id}
                      className="flex items-center gap-2 rounded-xl px-2 py-1 text-sm"
                    >
                      <span className="font-display text-content">{appointment.startTime}</span>
                      <span className="truncate text-muted">
                        {appointment.manualClientName ?? client?.name ?? 'Cliente'}
                        {service ? ` · ${service.name}` : ''}
                      </span>
                    </li>
                  );
                })}
                {items.length > 5 ? (
                  <li className="px-2 text-xs text-subtle">+{items.length - 5} atendimentos</li>
                ) : null}
              </ul>
            ) : (
              <p className="rounded-2xl border border-dashed border-line px-3 py-4 text-center text-xs text-subtle">
                Sem atendimentos neste dia
              </p>
            )}

            <Link
              href={`/painel/agenda?data=${date}&barbeiro=${barber.id}`}
              className="block rounded-2xl bg-tint px-4 py-2 text-center text-sm text-muted transition-colors hover:bg-tint-strong hover:text-content"
            >
              Abrir agenda de {barber.nickname ?? barber.name.split(' ')[0]}
            </Link>
          </section>
        ))}
      </div>
    </div>
  );
}
