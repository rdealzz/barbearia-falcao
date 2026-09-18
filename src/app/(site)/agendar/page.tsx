import type { Metadata } from 'next';
import { db } from '@/services';
import { buildMetadata } from '@/lib/seo/metadata';
import { getCurrentUser } from '@/lib/auth/current-user';
import { Container, Section, SectionHeading } from '@/components/shared/section';
import { BookingWizard } from '@/features/booking/components/booking-wizard';

export const metadata: Metadata = buildMetadata({
  title: 'Agendar horário',
  description:
    'Escolha o serviço, o barbeiro, a data e o horário. Agendamento online da Barbearia Falcão em menos de um minuto.',
  path: '/agendar',
});

interface PageProps {
  searchParams: Promise<{ servico?: string; barbeiro?: string }>;
}

export default async function BookingPage({ searchParams }: PageProps) {
  const { servico, barbeiro } = await searchParams;

  const [services, barbers, user] = await Promise.all([
    db.services.list(),
    db.barbers.list(),
    getCurrentUser(),
  ]);

  const initialService = servico ? services.find((item) => item.slug === servico) : undefined;
  const initialBarber = barbeiro ? barbers.find((item) => item.slug === barbeiro) : undefined;

  return (
    <Section className="pt-36">
      <Container>
        <SectionHeading
          eyebrow="Agendamento"
          title="Reserve seu horário"
          description="Quatro etapas rápidas. O horário fica bloqueado na agenda do barbeiro escolhido."
          className="mb-14"
        />

        <BookingWizard
          services={services}
          barbers={barbers}
          user={
            user
              ? { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl }
              : null
          }
          initialServiceId={initialService?.id}
          initialBarberId={initialBarber?.id}
        />
      </Container>
    </Section>
  );
}
