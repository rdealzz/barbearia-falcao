import type { Metadata } from 'next';
import { HelpCircle } from 'lucide-react';
import { db } from '@/services';
import { buildMetadata } from '@/lib/seo/metadata';
import { Container, Section, SectionHeading } from '@/components/shared/section';
import { Stagger, StaggerItem } from '@/components/shared/reveal';
import { PlanCard } from '@/features/plans/components/plan-card';

export const metadata: Metadata = buildMetadata({
  title: 'Planos',
  description:
    'Planos de assinatura da Barbearia Falcão: corte ilimitado, barba ilimitada e combos com desconto e prioridade na agenda.',
  path: '/planos',
});

const faq = [
  {
    question: 'Como funciona a cobrança?',
    answer:
      'A assinatura é mensal e renova automaticamente. Você pode cancelar quando quiser, sem multa, direto na sua área de cliente.',
  },
  {
    question: 'Os planos ilimitados têm alguma regra?',
    answer:
      'Sim: respeitamos um intervalo técnico entre atendimentos para preservar o cabelo e a pele. Na prática, isso cobre a rotina de quem corta toda semana.',
  },
  {
    question: 'Posso agendar com qualquer barbeiro?',
    answer:
      'Pode. O plano vale para toda a equipe e assinantes têm prioridade na fila de horários.',
  },
  {
    question: 'O que é o Clube Falcão?',
    answer:
      'É o programa de vantagens da casa: cupons de desconto em produtos e serviços, liberados conforme o seu plano.',
  },
];

export default async function PlansPage() {
  const plans = await db.plans.list();

  return (
    <>
      <Section spacing="pageTight">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="Assinaturas"
            title="Escolha o plano que combina com a sua rotina"
            description="Vigência indeterminada, renovação automática e cancelamento quando você quiser."
          />
        </Container>
      </Section>

      <Section spacing="tight">
        <Container>
          <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <StaggerItem key={plan.id} className="h-full">
                <PlanCard plan={plan} />
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            eyebrow="Dúvidas"
            title="Perguntas frequentes"
            description="O essencial antes de assinar."
          />
          <Stagger className="mt-12 grid gap-4 lg:grid-cols-2">
            {faq.map((item) => (
              <StaggerItem key={item.question}>
                <div className="surface-card h-full rounded-3xl p-6">
                  <p className="flex items-start gap-3 font-medium text-content">
                    <HelpCircle className="mt-0.5 size-4 shrink-0 text-falcao-400" />
                    {item.question}
                  </p>
                  <p className="mt-3 pl-7 text-sm leading-relaxed text-muted">{item.answer}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>
    </>
  );
}
