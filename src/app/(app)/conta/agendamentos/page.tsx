import Link from 'next/link';
import { CalendarDays, CalendarPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { AppointmentCard } from '@/features/account/components/appointment-card';
import { requireUser } from '@/lib/auth/current-user';
import { db } from '@/services';
import { todayDateString } from '@/lib/utils/date';

interface PageProps {
  searchParams: Promise<{ aba?: string }>;
}

export default async function AppointmentsPage({ searchParams }: PageProps) {
  const { aba } = await searchParams;
  const tab = aba === 'anteriores' ? 'anteriores' : 'agendados';

  const user = await requireUser();
  const [appointments, services, barbers] = await Promise.all([
    db.appointments.listByClient(user.id),
    db.services.list(),
    db.barbers.list(),
  ]);

  const today = todayDateString();
  const upcoming = appointments
    .filter(
      (appointment) =>
        appointment.date >= today &&
        ['pending', 'confirmed', 'in_progress'].includes(appointment.status),
    )
    .sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`));

  const past = appointments.filter((appointment) => !upcoming.includes(appointment));
  const visible = tab === 'agendados' ? upcoming : past;

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-white">Agendamentos</h1>
          <p className="mt-1 text-sm text-ink-500">
            Acompanhe seus horários e consulte o histórico completo.
          </p>
        </div>
        <Button asChild>
          <Link href="/agendar">
            <CalendarPlus className="size-4" />
            Novo agendamento
          </Link>
        </Button>
      </header>

      <nav className="flex gap-2 border-b border-white/[0.06]" aria-label="Filtro de agendamentos">
        {[
          { key: 'agendados', label: `Agendados (${upcoming.length})` },
          { key: 'anteriores', label: `Anteriores (${past.length})` },
        ].map((item) => (
          <Link
            key={item.key}
            href={`/conta/agendamentos?aba=${item.key}`}
            className={`-mb-px border-b-2 px-4 py-3 text-sm transition-colors ${
              tab === item.key
                ? 'border-falcao-500 text-white'
                : 'border-transparent text-ink-500 hover:text-ink-200'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {visible.length > 0 ? (
        <div className="grid gap-4">
          {visible.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              service={services.find((item) => item.id === appointment.serviceId)}
              barber={barbers.find((item) => item.id === appointment.barberId)}
              cancellable={tab === 'agendados'}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CalendarDays}
          title={
            tab === 'agendados'
              ? 'Você não tem nenhum agendamento marcado'
              : 'Nenhum atendimento no histórico ainda'
          }
          description={
            tab === 'agendados'
              ? 'Escolha o serviço, o barbeiro e garanta seu horário.'
              : 'Assim que você concluir um atendimento, ele aparece aqui.'
          }
          action={
            <Button asChild>
              <Link href="/agendar">
                <CalendarPlus className="size-4" />
                Novo agendamento
              </Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
