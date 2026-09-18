import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { db } from '@/services';
import { buildMetadata } from '@/lib/seo/metadata';
import { Button } from '@/components/ui/button';
import { Container, Section, SectionHeading } from '@/components/shared/section';
import { ServicesBoard } from '@/features/services/components/services-board';

export const metadata: Metadata = buildMetadata({
  title: 'Serviços',
  description:
    'Corte masculino, barboterapia, combo corte + barba, infantil, platinado e mais. Preço, duração e agendamento online.',
  path: '/servicos',
});

export default async function ServicesPage() {
  const services = await db.services.list();

  return (
    <Section spacing="pageTight">
      <Container>
        <SectionHeading
          eyebrow="Serviços"
          title="Tabela completa, preço e duração"
          description="Filtre pela categoria e agende em um clique. Sem surpresa no valor e sem correria na cadeira."
        />

        <div className="mt-8">
          <ServicesBoard services={services} />
        </div>

        <div className="surface-card mt-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl p-6">
          <div>
            <h2 className="font-display text-lg text-content">Não sabe qual escolher?</h2>
            <p className="mt-1 text-sm text-muted">
              Comece pelo corte + barba: é o atendimento mais completo da casa.
            </p>
          </div>
          <Button asChild size="sm">
            <Link href="/agendar">
              Agendar meu horário
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
