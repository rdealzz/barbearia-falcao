import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Check, CreditCard, Minus, QrCode, Receipt } from 'lucide-react';
import { db } from '@/services';
import { buildMetadata } from '@/lib/seo/metadata';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Container, Section } from '@/components/shared/section';
import { Reveal } from '@/components/shared/reveal';
import { formatCurrency } from '@/lib/utils/format';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const plans = await db.plans.list();
  return plans.map((plan) => ({ slug: plan.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const plan = await db.plans.findBySlug(slug);
  if (!plan) return buildMetadata({ title: 'Plano', description: '', noIndex: true });

  return buildMetadata({
    title: plan.name,
    description: plan.description,
    path: `/planos/${plan.slug}`,
  });
}

const paymentMethods = [
  { icon: QrCode, label: 'Pix' },
  { icon: CreditCard, label: 'Cartão de crédito' },
  { icon: Receipt, label: 'Boleto' },
];

export default async function PlanPage({ params }: PageProps) {
  const { slug } = await params;
  const plan = await db.plans.findBySlug(slug);
  if (!plan) notFound();

  return (
    <Section spacing="page">
      <Container>
        <Link
          href="/planos"
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-content"
        >
          <ArrowLeft className="size-4" />
          Todos os planos
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <Reveal className="space-y-8">
            <div className="space-y-4">
              {plan.isPopular ? <Badge variant="brand">Mais vendido</Badge> : null}
              <h1 className="font-display text-4xl text-content sm:text-5xl">{plan.name}</h1>
              <p className="text-lg text-muted">{plan.tagline}</p>
              <p className="max-w-2xl leading-relaxed text-muted">{plan.description}</p>
            </div>

            <div className="surface-card rounded-3xl p-7">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-subtle">
                O que está incluso
              </p>
              <ul className="mt-5 space-y-3">
                {plan.benefits.map((benefit) => (
                  <li
                    key={benefit.label}
                    className={`flex items-start gap-3 text-sm ${
                      benefit.included ? 'text-content' : 'text-subtle'
                    }`}
                  >
                    <span
                      className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ${
                        benefit.included
                          ? 'bg-falcao-600/20 text-falcao-700 dark:text-falcao-300'
                          : 'bg-tint text-subtle'
                      }`}
                    >
                      {benefit.included ? <Check className="size-3" /> : <Minus className="size-3" />}
                    </span>
                    <span>
                      {benefit.label}
                      {benefit.description ? (
                        <span className="block text-xs text-muted">{benefit.description}</span>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  label: 'Cortes no ciclo',
                  value: plan.haircutsPerCycle === null ? 'Ilimitado' : String(plan.haircutsPerCycle),
                },
                {
                  label: 'Barbas no ciclo',
                  value: plan.beardsPerCycle === null ? 'Ilimitado' : String(plan.beardsPerCycle),
                },
                { label: 'Desconto nos demais', value: `${plan.discountPercentage}%` },
              ].map((item) => (
                <div key={item.label} className="surface-card rounded-2xl p-5">
                  <p className="font-display text-2xl text-content">{item.value}</p>
                  <p className="mt-1 text-xs text-muted">{item.label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="surface-card sticky top-28 rounded-3xl p-7">
              <p className="text-xs uppercase tracking-[0.2em] text-subtle">Investimento</p>
              <div className="mt-2 flex items-end gap-1">
                <span className="font-display text-4xl text-content">
                  {formatCurrency(plan.priceInCents)}
                </span>
                <span className="pb-1.5 text-sm text-muted">/mês</span>
              </div>
              <p className="mt-2 text-xs text-muted">
                Tempo de vigência: indeterminado. Cancele quando quiser.
              </p>

              {plan.seatsAvailable !== null ? (
                <p className="mt-4 rounded-xl bg-falcao-600/10 dark:bg-falcao-950/40 px-4 py-3 text-xs text-falcao-700 dark:text-falcao-200">
                  Restam {plan.seatsAvailable} vagas para esse plano.
                </p>
              ) : null}

              <Button asChild block size="lg" className="mt-6">
                <Link href={`/conta/plano?assinar=${plan.slug}`}>Assinar plano</Link>
              </Button>

              <p className="mt-6 text-xs font-medium uppercase tracking-[0.18em] text-subtle">
                Formas de pagamento
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {paymentMethods.map((method) => (
                  <li
                    key={method.label}
                    className="inline-flex items-center gap-2 rounded-full border border-line bg-tint px-3 py-1.5 text-xs text-muted"
                  >
                    <method.icon className="size-3.5" />
                    {method.label}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-subtle">
                A cobrança recorrente será processada pelo ASAAS assim que a integração de
                pagamentos for ativada.
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
