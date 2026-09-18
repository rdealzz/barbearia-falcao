import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container, Section, SectionHeading } from '@/components/shared/section';
import { Stagger, StaggerItem } from '@/components/shared/reveal';
import { BarberCard } from '@/features/barbers/components/barber-card';
import type { Barber } from '@/types';

export function BarbersPreview({ barbers }: { barbers: Barber[] }) {
  return (
    <Section className="bg-ink-900/30">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Equipe"
            title="Escolha a mão que vai cuidar do seu visual"
            description="Cada barbeiro tem agenda própria, especialidade definida e clientes que voltam pelo nome."
          />
          <Button asChild variant="ghost" size="sm" className="shrink-0">
            <Link href="/barbeiros">
              Conhecer a equipe
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {barbers.map((barber) => (
            <StaggerItem key={barber.id} className="h-full">
              <BarberCard barber={barber} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
