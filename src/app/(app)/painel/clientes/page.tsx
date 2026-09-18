import { Users } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { ClientRow } from '@/features/staff/components/client-row';
import { requireRole } from '@/lib/auth/current-user';
import { db } from '@/services';
import { addDays, todayDateString } from '@/lib/utils/date';
import { formatShortDate } from '@/lib/utils/format';

export default async function StaffClientsPage() {
  const user = await requireRole('barber');
  const barberId = user.barberId!;
  const today = todayDateString();

  const [appointments, services] = await Promise.all([
    db.appointments.listByBarber(barberId, { from: today, to: addDays(today, 30) }),
    db.services.list(),
  ]);

  const clients = await db.users.findManyByIds(
    Array.from(new Set(appointments.map((appointment) => appointment.clientId))),
  );

  const grouped = appointments.reduce<Record<string, typeof appointments>>((acc, appointment) => {
    (acc[appointment.date] ??= []).push(appointment);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl text-content">Próximos clientes</h1>
        <p className="mt-1 text-sm text-muted">
          Quem está marcado com você nos próximos 30 dias, com foto para facilitar a identificação.
        </p>
      </header>

      {appointments.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Nenhum cliente agendado"
          description="Os próximos atendimentos aparecem aqui automaticamente."
        />
      ) : (
        <div className="space-y-10">
          {Object.entries(grouped).map(([date, items]) => (
            <section key={date} className="space-y-4">
              <h2 className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.18em] text-muted">
                {date === today ? 'Hoje' : formatShortDate(date)}
                <span className="h-px flex-1 bg-tint-strong" />
              </h2>
              <div className="grid gap-4">
                {items.map((appointment) => (
                  <ClientRow
                    key={appointment.id}
                    appointment={appointment}
                    client={clients.find((client) => client.id === appointment.clientId)}
                    service={services.find((service) => service.id === appointment.serviceId)}
                    showActions={date === today}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
