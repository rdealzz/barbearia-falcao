import { Clock, MapPin, Navigation } from 'lucide-react';
import { InstagramIcon } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';
import { Container, Section, SectionHeading } from '@/components/shared/section';
import { Reveal } from '@/components/shared/reveal';
import { siteConfig } from '@/lib/config/site';

export function LocationSection() {
  const { address, openingHours, social } = siteConfig;
  const mapsEmbed = `https://www.google.com/maps?q=${encodeURIComponent(address.mapsQuery)}&output=embed`;
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.mapsQuery)}`;

  return (
    <Section id="localizacao">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Onde estamos"
              title="No coração do Novo Mundo, em Curitiba"
              description="Fácil de chegar, com estacionamento na rua e uma sala de espera que convida a ficar."
            />

            <Reveal delay={0.1} className="mt-10 space-y-6">
              <div className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-2xl border border-line bg-tint text-falcao-400">
                  <MapPin className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-medium text-content">Endereço</p>
                  <p className="mt-1 text-sm text-muted">
                    {address.street}, {address.number} — {address.district}
                    <br />
                    {address.city}/{address.state}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-2xl border border-line bg-tint text-falcao-400">
                  <Clock className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-medium text-content">Horário de funcionamento</p>
                  <ul className="mt-1 space-y-0.5 text-sm text-muted">
                    {openingHours.map((entry) => (
                      <li key={entry.label}>
                        {entry.label}: {entry.value}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild variant="outline" size="sm">
                  <a href={mapsLink} target="_blank" rel="noreferrer">
                    <Navigation className="size-4" />
                    Como chegar
                  </a>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <a href={social.instagram} target="_blank" rel="noreferrer">
                    <InstagramIcon className="size-4" />
                    {social.instagramHandle}
                  </a>
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div className="overflow-hidden rounded-3xl border border-line">
              <iframe
                src={mapsEmbed}
                title="Mapa da Barbearia Falcão"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[26rem] w-full grayscale-[0.6] contrast-[1.1]"
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
