import type { Metadata } from 'next';
import { db } from '@/services';
import { buildMetadata } from '@/lib/seo/metadata';
import { Container, Section, SectionHeading } from '@/components/shared/section';
import { Stagger, StaggerItem } from '@/components/shared/reveal';
import { BarberCard } from '@/features/barbers/components/barber-card';

export const metadata: Metadata = buildMetadata({
  title: 'Barbeiros',
  description:
    'Conheça a equipe da Barbearia Falcão: especialidades, experiência e agenda própria de cada barbeiro.',
  path: '/barbeiros',
});

export default async function BarbersPage() {
  const barbers = await db.barbers.list();

  return (
    <Section spacing="page">
      <Container>
        <SectionHeading
          eyebrow="Equipe"
          title="Os nomes por trás de cada corte"
          description="Agenda independente por profissional: você escolhe quem atende e o horário é reservado só para você."
        />

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
