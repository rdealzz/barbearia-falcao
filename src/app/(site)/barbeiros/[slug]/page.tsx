import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CalendarClock, Star } from 'lucide-react';
import { InstagramIcon } from '@/components/shared/icons';
import { db } from '@/services';
import { buildMetadata } from '@/lib/seo/metadata';
import { barberJsonLd } from '@/lib/seo/structured-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Container, Section } from '@/components/shared/section';
import { Reveal } from '@/components/shared/reveal';
import { MediaFrame } from '@/components/shared/media-frame';
import { ServiceCard } from '@/features/services/components/service-card';
import { WEEKDAY_LABELS } from '@/lib/utils/date';
import type { Weekday } from '@/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const barbers = await db.barbers.list();
  return barbers.map((barber) => ({ slug: barber.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const barber = await db.barbers.findBySlug(slug);
  if (!barber) return buildMetadata({ title: 'Barbeiro', description: '', noIndex: true });

  return buildMetadata({
    title: barber.name,
    description: `${barber.role} na Barbearia Falcão. ${barber.headline}`,
    path: `/barbeiros/${barber.slug}`,
  });
}

export default async function BarberPage({ params }: PageProps) {
  const { slug } = await params;
  const barber = await db.barbers.findBySlug(slug);
  if (!barber) notFound();

  const services = await db.services.findManyByIds(barber.serviceIds);
  const yearsOfExperience = new Date().getFullYear() - barber.experienceSince;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(barberJsonLd(barber)) }}
      />

      <Section spacing="pageTight">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <Reveal>
              <MediaFrame
                src={barber.avatarUrl || undefined}
                alt={barber.name}
                fallbackLabel={barber.name}
                className="aspect-[4/5] w-full"
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority
              />
            </Reveal>

            <Reveal delay={0.1} className="space-y-8">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.24em] text-falcao-400">{barber.role}</p>
                <h1 className="font-display text-4xl text-content sm:text-5xl">{barber.name}</h1>
                <p className="text-lg text-muted">{barber.headline}</p>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                {barber.reviewsCount > 0 ? (
                  <>
                    <span className="flex items-center gap-2 text-sm text-muted">
                      <Star className="size-4 fill-falcao-400 text-falcao-400" />
                      {barber.rating.toFixed(1)}
                      <span className="text-subtle">({barber.reviewsCount} avaliações)</span>
                    </span>
                    <span className="h-6 w-px bg-line" aria-hidden />
                  </>
                ) : null}
                <span className="text-sm text-muted">
                  {yearsOfExperience} anos de profissão
                </span>
                {barber.acceptsNewClients ? (
                  <Badge variant="success">Aceitando novos clientes</Badge>
                ) : (
                  <Badge variant="warning">Agenda cheia</Badge>
                )}
              </div>

              <p className="max-w-2xl leading-relaxed text-muted">{barber.bio}</p>

              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-subtle">
                  Especialidades
                </p>
                <ul className="flex flex-wrap gap-2">
                  {barber.specialties.map((specialty) => (
                    <li key={specialty}>
                      <Badge>{specialty}</Badge>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="surface-card rounded-3xl p-6">
                <p className="flex items-center gap-2 text-sm font-medium text-content">
                  <CalendarClock className="size-4 text-falcao-400" />
                  Agenda da semana
                </p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {barber.workingHours.map((day) => (
                    <li
                      key={day.weekday}
                      className="flex items-center justify-between rounded-xl bg-tint px-3 py-2 text-sm"
                    >
                      <span className="text-muted">{WEEKDAY_LABELS[day.weekday as Weekday]}</span>
                      <span className={day.shifts.length ? 'text-content' : 'text-subtle'}>
                        {day.shifts.length
                          ? day.shifts.map((shift) => `${shift.start}–${shift.end}`).join(' · ')
                          : 'Folga'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href={`/agendar?barbeiro=${barber.slug}`}>
                    Agendar com {barber.nickname ?? barber.name.split(' ')[0]}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                {barber.instagramUrl ? (
                  <Button asChild size="lg" variant="outline">
                    <a href={barber.instagramUrl} target="_blank" rel="noreferrer">
                      <InstagramIcon className="size-4" />
                      Instagram
                    </a>
                  </Button>
                ) : null}
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section spacing="continues">
        <Container>
          <h2 className="mb-8 flex items-center gap-3 text-sm font-medium uppercase tracking-[0.22em] text-muted">
            Serviços executados
            <span className="h-px flex-1 bg-tint-strong" />
          </h2>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} compact />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
