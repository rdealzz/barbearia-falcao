import { CalendarClock, CreditCard, QrCode, Receipt } from 'lucide-react';
import { requireUser } from '@/lib/auth/current-user';
import { db } from '@/services';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { PlanCard } from '@/features/plans/components/plan-card';
import {
  CancelSubscriptionButton,
  SubscribeButton,
} from '@/features/plans/components/subscription-panel';
import { formatCurrency, formatShortDate } from '@/lib/utils/format';

const methodLabels = { pix: 'Pix', credit_card: 'Cartão de crédito', boleto: 'Boleto' } as const;
const invoiceStatus = {
  paid: { label: 'Pago', variant: 'success' as const },
  pending: { label: 'Pendente', variant: 'warning' as const },
  overdue: { label: 'Vencido', variant: 'default' as const },
  refunded: { label: 'Estornado', variant: 'muted' as const },
};

interface PageProps {
  searchParams: Promise<{ assinar?: string }>;
}

export default async function PlanPage({ searchParams }: PageProps) {
  const { assinar } = await searchParams;
  const user = await requireUser();

  const [subscription, plans] = await Promise.all([
    db.plans.findActiveSubscription(user.id),
    db.plans.list(),
  ]);

  const plan = subscription ? await db.plans.findById(subscription.planId) : null;
  const invoices = subscription ? await db.plans.listInvoices(subscription.id) : [];
  const preSelected = assinar ? plans.find((item) => item.slug === assinar) : undefined;

  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-display text-3xl text-content">Plano</h1>
        <p className="mt-1 text-sm text-muted">
          Acompanhe sua assinatura, o uso do ciclo e o histórico de cobranças.
        </p>
      </header>

      {plan && subscription ? (
        <>
          <section className="surface-card rounded-3xl p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <Badge variant={subscription.status === 'active' ? 'success' : 'warning'}>
                  {subscription.status === 'active' ? 'Assinatura ativa' : 'Pagamento pendente'}
                </Badge>
                <p className="mt-3 font-display text-3xl text-content">{plan.name}</p>
                <p className="mt-1 text-sm text-muted">
                  {formatCurrency(plan.priceInCents)}/mês · {plan.tagline}
                </p>
              </div>

              <div className="text-right">
                <p className="flex items-center justify-end gap-2 text-xs uppercase tracking-[0.18em] text-subtle">
                  <CalendarClock className="size-3.5" />
                  Próxima cobrança
                </p>
                <p className="mt-2 font-display text-xl text-content">
                  {subscription.nextChargeAt
                    ? formatShortDate(subscription.nextChargeAt.slice(0, 10))
                    : '—'}
                </p>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="grid gap-6 sm:grid-cols-2">
              <UsageMeter
                label="Cortes no ciclo"
                used={subscription.usage.haircutsUsed}
                total={plan.haircutsPerCycle}
              />
              <UsageMeter
                label="Barbas no ciclo"
                used={subscription.usage.beardsUsed}
                total={plan.beardsPerCycle}
              />
            </div>

            <Separator className="my-6" />

            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs leading-relaxed text-subtle">
                Ciclo atual: {formatShortDate(subscription.currentPeriodStart.slice(0, 10))} a{' '}
                {formatShortDate(subscription.currentPeriodEnd.slice(0, 10))}
              </p>
              <CancelSubscriptionButton subscriptionId={subscription.id} />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl text-content">Histórico de cobranças</h2>
            <div className="surface-card divide-y divide-line overflow-hidden rounded-3xl">
              {invoices.map((invoice) => {
                const status = invoiceStatus[invoice.status];
                return (
                  <div
                    key={invoice.id}
                    className="flex flex-wrap items-center justify-between gap-4 p-5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid size-9 place-items-center rounded-xl border border-line bg-tint text-muted">
                        {invoice.method === 'pix' ? (
                          <QrCode className="size-4" />
                        ) : invoice.method === 'boleto' ? (
                          <Receipt className="size-4" />
                        ) : (
                          <CreditCard className="size-4" />
                        )}
                      </span>
                      <div>
                        <p className="text-sm text-content">
                          {formatCurrency(invoice.amountInCents)}
                        </p>
                        <p className="text-xs text-muted">
                          {invoice.method ? methodLabels[invoice.method] : 'Método não informado'} ·{' '}
                          {formatShortDate(invoice.dueDate.slice(0, 10))}
                        </p>
                      </div>
                    </div>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      ) : (
        <>
          <section className="surface-card rounded-3xl p-7">
            <p className="font-medium text-content">Você ainda não assinou um plano</p>
            <p className="mt-1 text-sm text-muted">
              Escolha abaixo e comece a aproveitar os benefícios do Clube Falcão.
            </p>
          </section>

          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {plans.map((item) => (
              <div key={item.id} className="flex flex-col gap-3">
                <PlanCard
                  plan={item}
                  ctaHref={`/planos/${item.slug}`}
                  ctaLabel="Ver detalhes"
                  className={
                    preSelected?.id === item.id ? 'ring-2 ring-falcao-500/50 ring-offset-2 ring-offset-canvas' : ''
                  }
                />
                <SubscribeButton planId={item.id} />
              </div>
            ))}
          </section>

          <p className="text-xs leading-relaxed text-subtle">
            A cobrança recorrente (Pix, cartão ou boleto), a renovação automática e os webhooks de
            status serão processados pelo ASAAS assim que a integração de pagamentos for ativada.
          </p>
        </>
      )}
    </div>
  );
}

function UsageMeter({
  label,
  used,
  total,
}: {
  label: string;
  used: number;
  total: number | null;
}) {
  if (total === null) {
    return (
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-subtle">{label}</p>
        <p className="mt-2 font-display text-2xl text-content">Ilimitado</p>
        <p className="mt-1 text-xs text-muted">{used} utilizados neste ciclo</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-subtle">{label}</p>
      <p className="mt-2 font-display text-2xl text-content">
        {Math.max(0, total - used)}
        <span className="text-base text-muted"> de {total} restantes</span>
      </p>
      <Progress value={used} max={total} className="mt-3" label={label} />
    </div>
  );
}
