import Link from 'next/link';
import { CalendarClock, CalendarCheck2, Lock, Sparkles } from 'lucide-react';
import { requireStaff } from '@/lib/auth/current-user';
import { permissionsFor } from '@/lib/auth/permissions';
import { db } from '@/services';
import { buildPanelDay } from '@/features/staff/schedule';
import { SlotGrid } from '@/features/staff/components/slot-grid';
import { WorkdayShortcuts } from '@/features/staff/components/workday-shortcuts';
import { DayNav } from '@/features/staff/components/day-nav';
import { StatTile } from '@/features/account/components/stat-tile';
import { todayDateString } from '@/lib/utils/date';
import { formatLongDate } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';

const isValidDate = (value?: string) => !!value && /^\d{4}-\d{2}-\d{2}$/.test(value);

export default async function StaffSchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ data?: string; barbeiro?: string }>;
}) {
  const user = await requireStaff();
  const params = await searchParams;
  const permissions = permissionsFor(user);

  const date = isValidDate(params.data) ? params.data! : todayDateString();

  // Só o chefe pode abrir a agenda de outro barbeiro; os demais veem a própria.
  const barberId =
    permissions.manageOtherAgendas && params.barbeiro ? params.barbeiro : user.barberId;

  const [barber, services, team] = await Promise.all([
    db.barbers.findById(barberId),
    db.services.list(),
    permissions.viewTeamAgenda ? db.barbers.list() : Promise.resolve([]),
  ]);

  if (!barber) {
    return (
      <p className="text-sm text-muted">Barbeiro não encontrado.</p>
    );
  }

  const [appointments, timeOff] = await Promise.all([
    db.appointments.listByBarberAndDate(barber.id, date),
    db.barbers.listTimeOff(barber.id, { from: date, to: date }),
  ]);

  const clients = await db.users.findManyByIds(
    Array.from(new Set(appointments.map((appointment) => appointment.clientId).filter(Boolean))),
  );

  const day = buildPanelDay({ barber, date, appointments, timeOff, clients, services });
  const bookableServices = services.filter((service) => barber.serviceIds.includes(service.id));
  const isOwnAgenda = barber.id === user.barberId;

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <p className="text-sm text-muted">{formatLongDate(date)}</p>
        <h1 className="font-display text-3xl text-content">
          {isOwnAgenda ? 'Minha agenda' : `Agenda de ${barber.name}`}
        </h1>
        <p className="text-sm text-muted">
          Veja quem marcou cada horário, bloqueie o que não estará disponível e libere de volta
          quando quiser.
        </p>
      </header>

      {permissions.viewTeamAgenda && team.length > 1 ? (
        <nav className="flex flex-wrap gap-2" aria-label="Escolher barbeiro">
          {team.map((member) => (
            <Link
              key={member.id}
              href={`/painel/agenda?data=${date}&barbeiro=${member.id}`}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm transition-colors',
                member.id === barber.id
                  ? 'border-falcao-500/50 bg-falcao-600/10 text-content'
                  : 'border-line text-muted hover:border-line-strong hover:text-content',
              )}
            >
              {member.name}
              {member.id === user.barberId ? ' (você)' : ''}
            </Link>
          ))}
        </nav>
      ) : null}

      <DayNav
        date={date}
        basePath="/painel/agenda"
        params={{ barbeiro: barber.id === user.barberId ? undefined : barber.id }}
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <StatTile icon={CalendarCheck2} label="Marcados" value={String(day.totals.booked)} />
        <StatTile icon={Sparkles} label="Livres" value={String(day.totals.free)} />
        <StatTile icon={Lock} label="Bloqueados" value={String(day.totals.blocked)} />
      </section>

      <WorkdayShortcuts
        barberId={barber.id}
        date={date}
        blocks={day.blocks}
        dayStart={day.dayStart}
        dayEnd={day.dayEnd}
      />

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 font-display text-xl text-content">
          <CalendarClock className="size-5 text-falcao-500" />
          Grade de horários
        </h2>
        <SlotGrid
          barberId={barber.id}
          date={date}
          day={day}
          services={bookableServices}
        />
      </section>
    </div>
  );
}
