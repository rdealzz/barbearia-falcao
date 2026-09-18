import { CalendarCheck2, CalendarDays, Clock, Scissors, Wallet } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { StatTile } from '@/features/account/components/stat-tile';
import { ClientRow } from '@/features/staff/components/client-row';
import { requireRole } from '@/lib/auth/current-user';
import { db } from '@/services';
import { formatCurrency, formatLongDate } from '@/lib/utils/format';
import { todayDateString } from '@/lib/utils/date';

export default async function StaffTodayPage() {
  const user = await requireRole('barber');
  const barberId = user.barberId!;
  const today = todayDateString();

  const [appointments, services] = await Promise.all([
    db.appointments.listByBarberAndDate(barberId, today),
    db.services.list(),
  ]);

  const clients = await db.users.findManyByIds(
    Array.from(new Set(appointments.map((appointment) => appointment.clientId))),
  );

  const active = appointments.filter(
    (appointment) => !['cancelled', 'no_show'].includes(appointment.status),
  );
  const completed = appointments.filter((appointment) => appointment.status === 'completed');
  const revenue = completed.reduce((total, appointment) => total + appointment.priceInCents, 0);
  const next = active.find((appointment) =>
    ['pending', 'confirmed'].includes(appointment.status),
  );

  return (
    <div className="space-y-10">
      <header>
        <p className="text-sm text-ink-500">{formatLongDate(today)}</p>
        <h1 className="mt-1 font-display text-3xl text-white">Agenda do dia</h1>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile icon={CalendarDays} label="Atendimentos hoje" value={String(active.length)} />
        <StatTile
          icon={Clock}
          label="Próximo cliente"
          value={next?.startTime ?? '—'}
          hint={
            next
              ? clients.find((client) => client.id === next.clientId)?.name
              : 'Nada pendente no momento'
          }
        />
        <StatTile icon={CalendarCheck2} label="Finalizados" value={String(completed.length)} />
        <StatTile
          icon={Wallet}
          label="Faturamento do dia"
          value={formatCurrency(revenue)}
          hint="Somente atendimentos finalizados"
        />
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl text-white">Clientes de hoje</h2>

        {appointments.length > 0 ? (
          <div className="grid gap-4">
            {appointments.map((appointment) => (
              <ClientRow
                key={appointment.id}
                appointment={appointment}
                client={clients.find((client) => client.id === appointment.clientId)}
                service={services.find((service) => service.id === appointment.serviceId)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Scissors}
            title="Nenhum atendimento marcado para hoje"
            description="Assim que um cliente agendar, ele aparece aqui automaticamente."
          />
        )}
      </section>
    </div>
  );
}
