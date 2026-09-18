import Link from 'next/link';
import { ArrowRight, CalendarDays, CalendarPlus, CreditCard, Scissors, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { EmptyState } from '@/components/ui/empty-state';
import { ClubBanner } from '@/features/club/components/club-banner';
import { StatTile } from '@/features/account/components/stat-tile';
import { AppointmentCard } from '@/features/account/components/appointment-card';
import { requireUser } from '@/lib/auth/current-user';
import { db } from '@/services';
import { formatCurrency, formatLongDate, formatShortDate } from '@/lib/utils/format';
import { todayDateString } from '@/lib/utils/date';

export default async function AccountHomePage() {
  const user = await requireUser();

  const [appointments, services, barbers, subscription] = await Promise.all([
    db.appointments.listByClient(user.id),
    db.services.list(),
    db.barbers.list(),
    db.plans.findActiveSubscription(user.id),
  ]);

  const plan = subscription ? await db.plans.findById(subscription.planId) : null;
  const today = todayDateString();

  const upcoming = appointments
    .filter(
      (appointment) =>
        appointment.date >= today && ['pending', 'confirmed', 'in_progress'].includes(appointment.status),
    )
    .sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`));

  const completed = appointments.filter((appointment) => appointment.status === 'completed');
  const next = upcoming[0];

  const haircutsRemaining =
    plan?.haircutsPerCycle === null
      ? 'Ilimitado'
      : plan
        ? String(Math.max(0, (plan.haircutsPerCycle ?? 0) - (subscription?.usage.haircutsUsed ?? 0)))
        : '—';

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted">Olá, {user.name.split(' ')[0]}</p>
          <h1 className="mt-1 font-display text-3xl text-content">Sua conta</h1>
        </div>
        <Button asChild>
          <Link href="/agendar">
            <CalendarPlus className="size-4" />
            Novo agendamento
          </Link>
        </Button>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          icon={CalendarDays}
          label="Próximo horário"
          value={next ? `${next.startTime}` : '—'}
          hint={next ? formatLongDate(next.date) : 'Nenhum agendamento marcado'}
        />
        <StatTile
          icon={Scissors}
          label="Cortes realizados"
          value={String(completed.length)}
          hint="Histórico completo na aba Agendamentos"
        />
        <StatTile
          icon={CreditCard}
          label="Plano atual"
          value={plan?.name ?? 'Sem plano'}
          hint={
            subscription?.nextChargeAt
              ? `Próxima cobrança em ${formatShortDate(subscription.nextChargeAt.slice(0, 10))}`
              : 'Contrate e aproveite os benefícios'
          }
        />
        <StatTile
          icon={Ticket}
          label="Cortes restantes no ciclo"
          value={haircutsRemaining}
          hint={plan ? plan.tagline : 'Disponível para assinantes'}
        />
      </section>

      <ClubBanner />

      {plan && subscription ? (
        <section className="surface-card rounded-3xl p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-subtle">Seu plano</p>
              <p className="mt-2 font-display text-2xl text-content">{plan.name}</p>
              <p className="mt-1 text-sm text-muted">
                {formatCurrency(plan.priceInCents)}/mês ·{' '}
                {subscription.autoRenew ? 'Renovação automática' : 'Sem renovação'}
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/conta/plano">
                Gerenciar
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          {plan.haircutsPerCycle !== null ? (
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs text-muted">
                <span>Cortes usados no ciclo</span>
                <span>
                  {subscription.usage.haircutsUsed} de {plan.haircutsPerCycle}
                </span>
              </div>
              <Progress
                value={subscription.usage.haircutsUsed}
                max={plan.haircutsPerCycle}
                label="Cortes usados no ciclo"
              />
            </div>
          ) : (
            <p className="mt-6 rounded-2xl bg-tint px-4 py-3 text-sm text-muted">
              Cortes ilimitados neste ciclo. Agende quantas vezes precisar.
            </p>
          )}
        </section>
      ) : (
        <section className="surface-card flex flex-wrap items-center justify-between gap-4 rounded-3xl p-6">
          <div>
            <p className="font-medium text-content">Você ainda não assinou um plano</p>
            <p className="mt-1 text-sm text-muted">
              Contrate e aproveite cortes inclusos, desconto e prioridade na agenda.
            </p>
          </div>
          <Button asChild>
            <Link href="/planos">
              Contratar um plano
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl text-content">Próximos agendamentos</h2>
          <Link
            href="/conta/agendamentos"
            className="text-sm text-muted transition-colors hover:text-content"
          >
            Ver tudo
          </Link>
        </div>

        {upcoming.length > 0 ? (
          <div className="grid gap-4">
            {upcoming.slice(0, 3).map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                service={services.find((item) => item.id === appointment.serviceId)}
                barber={barbers.find((item) => item.id === appointment.barberId)}
                cancellable
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={CalendarDays}
            title="Você não tem nenhum agendamento marcado"
            description="Escolha o serviço, o barbeiro e garanta seu horário."
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
      </section>
    </div>
  );
}
