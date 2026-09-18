import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container, Section, SectionHeading } from '@/components/shared/section';
import { Stagger, StaggerItem } from '@/components/shared/reveal';
import { ServiceCard } from '@/features/services/components/service-card';
import type { Service } from '@/types';

export function ServicesPreview({ services }: { services: Service[] }) {
  return (
    <Section id="servicos">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Serviços"
            title="O que a cadeira da Falcão entrega"
            description="Cada atendimento tem tempo próprio, técnica definida e produto certo. Nada de pressa."
          />
          <Button asChild variant="ghost" size="sm" className="shrink-0">
            <Link href="/servicos">
              Ver todos os serviços
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <Stagger className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <StaggerItem key={service.id} className="h-full">
              <ServiceCard service={service} compact />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
