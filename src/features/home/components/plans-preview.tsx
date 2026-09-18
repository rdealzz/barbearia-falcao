import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container, Section, SectionHeading } from '@/components/shared/section';
import { Stagger, StaggerItem } from '@/components/shared/reveal';
import { PlanCard } from '@/features/plans/components/plan-card';
import type { Plan } from '@/types';

export function PlansPreview({ plans }: { plans: Plan[] }) {
  return (
    <Section id="planos">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Clube Falcão"
          title="Assine e nunca mais pense no preço do corte"
          description="Planos mensais com cortes e barba inclusos, desconto nos demais serviços e prioridade na agenda."
        />

        <Stagger className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <StaggerItem key={plan.id} className="h-full">
              <PlanCard plan={plan} />
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-10 flex justify-center">
          <Button asChild variant="ghost" size="sm">
            <Link href="/planos">
              Comparar todos os planos
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
