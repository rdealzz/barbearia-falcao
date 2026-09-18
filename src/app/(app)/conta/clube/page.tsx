import { HelpCircle, Ticket } from 'lucide-react';
import { requireUser } from '@/lib/auth/current-user';
import { db } from '@/services';
import { CouponList } from '@/features/club/components/coupon-list';
import { formatCurrency } from '@/lib/utils/format';

const howTo = [
  'Abra o Clube Falcão na sua conta.',
  'Escolha o cupom com o benefício que quiser.',
  'Toque em resgatar para gerar o seu código de desconto.',
  'Apresente o código no balcão ou informe no agendamento.',
];

const faq = [
  {
    question: 'Os cupons renovam?',
    answer:
      'Sim. Alguns cupons renovam junto com a mensalidade do seu plano, de forma automática.',
  },
  {
    question: 'Se expirar o prazo, posso resgatar novamente?',
    answer:
      'Após expirado o prazo, aquele cupom é encerrado — mas fique atento: existem cupons com mais de uma utilização.',
  },
  {
    question: 'Os cupons são acumulativos?',
    answer: 'Não. Cada cupom é individual e não pode ser somado a outro para gerar mais desconto.',
  },
];

export default async function ClubPage() {
  const user = await requireUser();
  const [coupons, subscription] = await Promise.all([
    db.club.listCoupons(user.id),
    db.plans.findActiveSubscription(user.id),
  ]);

  const plan = subscription ? await db.plans.findById(subscription.planId) : null;

  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-display text-3xl text-white">Clube Falcão</h1>
        <p className="mt-1 text-sm text-ink-500">
          Vantagens exclusivas para clientes da casa. {plan ? `Seu plano: ${plan.name}.` : ''}
        </p>
      </header>

      <CouponList coupons={coupons} currentTier={plan?.tier ?? null} />

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="surface-card rounded-3xl p-6">
          <p className="flex items-center gap-2 font-medium text-white">
            <Ticket className="size-4 text-falcao-400" />
            Como resgatar um cupom
          </p>
          <ol className="mt-4 space-y-3 text-sm text-ink-400">
            {howTo.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-white/[0.05] text-[10px] text-ink-300">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs leading-relaxed text-ink-600">
            O prazo de expiração começa a contar a partir do resgate. Depois de expirado, não é
            possível utilizar o mesmo cupom.
          </p>
        </div>

        <div className="surface-card rounded-3xl p-6">
          <p className="flex items-center gap-2 font-medium text-white">
            <HelpCircle className="size-4 text-falcao-400" />
            Perguntas frequentes
          </p>
          <dl className="mt-4 space-y-4">
            {faq.map((item) => (
              <div key={item.question}>
                <dt className="text-sm font-medium text-ink-200">{item.question}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-ink-500">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {plan ? (
        <p className="text-xs text-ink-600">
          Assinantes do {plan.name} ({formatCurrency(plan.priceInCents)}/mês) têm acesso aos cupons
          exclusivos do seu nível.
        </p>
      ) : null}
    </div>
  );
}
