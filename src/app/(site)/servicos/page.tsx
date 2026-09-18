import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { db } from '@/services';
import { buildMetadata } from '@/lib/seo/metadata';
import { Button } from '@/components/ui/button';
import { Container, Section, SectionHeading } from '@/components/shared/section';
import { Stagger, StaggerItem } from '@/components/shared/reveal';
import { ServiceCard } from '@/features/services/components/service-card';
import type { ServiceCategory } from '@/types';

export const metadata: Metadata = buildMetadata({
  title: 'Serviços',
  description:
    'Corte masculino, barboterapia, combo corte + barba, infantil, platinado e mais. Preço, duração e agendamento online.',
  path: '/servicos',
});

const categoryLabels: Record<ServiceCategory, string> = {
  cabelo: 'Cabelo',
  barba: 'Barba',
  combo: 'Combos',
  estetica: 'Estética',
  infantil: 'Infantil',
};

export default async function ServicesPage() {
  const services = await db.services.list();

  const grouped = services.reduce<Record<string, typeof services>>((acc, service) => {
    (acc[service.category] ??= []).push(service);
    return acc;
  }, {});

  return (
    <>
      <Section spacing="pageTight">
        <Container>
          <SectionHeading
            eyebrow="Serviços"
            title="Cada serviço com tempo, técnica e preço definidos"
            description="Sem surpresa no valor e sem correria na cadeira. Escolha o atendimento e agende em segundos."
          />
        </Container>
      </Section>

      {Object.entries(grouped).map(([category, items]) => (
        <Section key={category} spacing="tight">
          <Container>
            <h2 className="mb-8 flex items-center gap-3 text-sm font-medium uppercase tracking-[0.22em] text-muted">
              {categoryLabels[category as ServiceCategory]}
              <span className="h-px flex-1 bg-tint-strong" />
            </h2>
            <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {items.map((service) => (
                <StaggerItem key={service.id} className="h-full">
                  <ServiceCard service={service} />
                </StaggerItem>
              ))}
            </Stagger>
          </Container>
        </Section>
      ))}

      <Section spacing="continues">
        <Container>
          <div className="surface-card flex flex-col items-center gap-6 rounded-4xl p-10 text-center sm:p-14">
            <h2 className="font-display text-2xl text-content sm:text-3xl">
              Não sabe qual escolher?
            </h2>
            <p className="max-w-lg text-sm leading-relaxed text-muted">
              Comece pelo corte + barba: é o atendimento mais completo da casa e o mais pedido
              pelos nossos clientes.
            </p>
            <Button asChild size="lg">
              <Link href="/agendar">
                Agendar meu horário
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
