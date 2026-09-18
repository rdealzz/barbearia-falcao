import Link from 'next/link';
import { CalendarClock, Phone, StickyNote, Users } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { StatTile } from '@/features/account/components/stat-tile';
import { requireOwner } from '@/lib/auth/current-user';
import { db } from '@/services';
import { todayDateString } from '@/lib/utils/date';
import { formatCurrency, formatShortDate } from '@/lib/utils/format';
import type { Appointment } from '@/types';

const COMPLETED: Appointment['status'][] = ['completed'];
const UPCOMING: Appointment['status'][] = ['pending', 'confirmed', 'in_progress'];

/** Base de clientes da casa — exclusiva do barbeiro-chefe. */
export default async function StaffClientsPage() {
  await requireOwner();
  const today = todayDateString();

  const [clients, barbers] = await Promise.all([
    db.users.list({ role: 'client' }),
    db.barbers.list({ onlyActive: false }),
  ]);

  const histories = await Promise.all(
    clients.map(async (client) => {
      const appointments = await db.appointments.listByClient(client.id);
      const completed = appointments.filter((item) => COMPLETED.includes(item.status));
      const next = appointments
        .filter((item) => UPCOMING.includes(item.status) && item.date >= today)
        .sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`))[0];
      const last = completed[0];

      return {
        client,
        visits: completed.length,
        spent: completed.reduce((total, item) => total + item.priceInCents, 0),
        lastVisit: last ? last.date : undefined,
        next,
      };
    }),
  );

  const ranked = histories.sort((a, b) => b.visits - a.visits || a.client.name.localeCompare(b.client.name, 'pt-BR'));
  const totalRevenue = ranked.reduce((total, item) => total + item.spent, 0);
  const withUpcoming = ranked.filter((item) => item.next).length;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl text-content">Clientes da Falcão</h1>
        <p className="mt-1 text-sm text-muted">
          Histórico, frequência e contato de quem já passou pela cadeira. Visão exclusiva do
          barbeiro-chefe.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatTile icon={Users} label="Clientes cadastrados" value={String(ranked.length)} />
        <StatTile
          icon={CalendarClock}
          label="Com horário marcado"
          value={String(withUpcoming)}
          hint="Agendamentos de hoje em diante"
        />
        <StatTile
          icon={StickyNote}
          label="Receita acumulada"
          value={formatCurrency(totalRevenue)}
          hint="Somente atendimentos finalizados"
        />
      </section>

      {ranked.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Nenhum cliente cadastrado ainda"
          description="Cada cadastro feito no site aparece aqui automaticamente."
        />
      ) : (
        <div className="grid gap-3">
          {ranked.map(({ client, visits, spent, lastVisit, next }) => {
            const barber = next ? barbers.find((item) => item.id === next.barberId) : undefined;

            return (
              <article
                key={client.id}
                className="surface-card flex flex-wrap items-center gap-4 rounded-3xl p-4 transition-colors hover:border-line-strong"
              >
                <Avatar name={client.name} src={client.avatarUrl} size="lg" ring />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-content">{client.name}</p>
                    {visits >= 5 ? <Badge variant="brand">Fiel</Badge> : null}
                    {visits === 0 ? <Badge variant="muted">Sem visita</Badge> : null}
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                    {client.phone ? (
                      <a
                        href={`tel:${client.phone.replace(/\D/g, '')}`}
                        className="inline-flex items-center gap-1.5 transition-colors hover:text-content"
                      >
                        <Phone className="size-3.5" />
                        {client.phone}
                      </a>
                    ) : null}
                    <span className="truncate">{client.email}</span>
                  </div>

                  {client.notes ? (
                    <p className="mt-2 flex items-start gap-2 text-sm text-muted">
                      <StickyNote className="mt-0.5 size-3.5 shrink-0 text-falcao-400" />
                      {client.notes}
                    </p>
                  ) : null}
                </div>

                <dl className="grid grid-cols-3 gap-4 text-center sm:gap-6">
                  <div>
                    <dt className="text-[10px] uppercase tracking-wider text-subtle">Visitas</dt>
                    <dd className="font-display text-xl text-content">{visits}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-wider text-subtle">Gasto</dt>
                    <dd className="font-display text-xl text-content">{formatCurrency(spent)}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-wider text-subtle">Última</dt>
                    <dd className="font-display text-xl text-content">
                      {lastVisit ? formatShortDate(lastVisit).slice(0, 5) : '—'}
                    </dd>
                  </div>
                </dl>

                {next ? (
                  <Link
                    href={`/painel/agenda?data=${next.date}&barbeiro=${next.barberId}`}
                    className="w-full rounded-2xl bg-tint px-4 py-2 text-sm text-muted transition-colors hover:bg-tint-strong hover:text-content sm:w-auto"
                  >
                    Próximo: {formatShortDate(next.date)} às {next.startTime}
                    {barber ? ` · ${barber.name}` : ''}
                  </Link>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
