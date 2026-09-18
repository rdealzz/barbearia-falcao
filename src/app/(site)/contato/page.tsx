import type { Metadata } from 'next';
import Link from 'next/link';
import { CalendarPlus, Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { InstagramIcon } from '@/components/shared/icons';
import { buildMetadata } from '@/lib/seo/metadata';
import { Button } from '@/components/ui/button';
import { Container, Section, SectionHeading } from '@/components/shared/section';
import { Reveal, Stagger, StaggerItem } from '@/components/shared/reveal';
import { siteConfig } from '@/lib/config/site';

export const metadata: Metadata = buildMetadata({
  title: 'Contato',
  description:
    'Endereço, horário de funcionamento, WhatsApp e Instagram da Barbearia Falcão em Curitiba.',
  path: '/contato',
});

export default function ContactPage() {
  const { address, openingHours, social, contact } = siteConfig;
  const mapsEmbed = `https://www.google.com/maps?q=${encodeURIComponent(address.mapsQuery)}&output=embed`;

  const channels = [
    {
      icon: MapPin,
      label: 'Endereço',
      value: `${address.street}, ${address.number} — ${address.district}, ${address.city}/${address.state}`,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.mapsQuery)}`,
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: contact.whatsapp || 'Em configuração',
      href: contact.whatsapp ? `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}` : undefined,
    },
    {
      icon: Phone,
      label: 'Telefone',
      value: contact.phone || 'Em configuração',
      href: contact.phone ? `tel:${contact.phone.replace(/\D/g, '')}` : undefined,
    },
    {
      icon: Mail,
      label: 'E-mail',
      value: contact.email || 'Em configuração',
      href: contact.email ? `mailto:${contact.email}` : undefined,
    },
    {
      icon: InstagramIcon,
      label: 'Instagram',
      value: social.instagramHandle,
      href: social.instagram,
    },
  ];

  return (
    <>
      <Section spacing="pageTight">
        <Container>
          <SectionHeading
            eyebrow="Contato"
            title="Fale com a Falcão"
            description="Para agendar, o caminho mais rápido é pelo site. Para o resto, escolha o canal que preferir."
          />
        </Container>
      </Section>

      <Section spacing="tight">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <Stagger className="space-y-4">
              {channels.map((channel) => {
                const content = (
                  <div className="surface-card flex items-start gap-4 rounded-2xl p-5 transition-colors duration-300 hover:border-line-strong">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-tint text-falcao-400">
                      <channel.icon className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.18em] text-subtle">
                        {channel.label}
                      </p>
                      <p className="mt-1 break-words text-sm text-content">{channel.value}</p>
                    </div>
                  </div>
                );

                return (
                  <StaggerItem key={channel.label}>
                    {channel.href ? (
                      <a href={channel.href} target="_blank" rel="noreferrer" className="block">
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </StaggerItem>
                );
              })}

              <StaggerItem>
                <div className="surface-card rounded-2xl p-5">
                  <p className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-subtle">
                    <Clock className="size-3.5" />
                    Horário de funcionamento
                  </p>
                  <ul className="mt-3 space-y-1.5 text-sm text-muted">
                    {openingHours.map((entry) => (
                      <li key={entry.label} className="flex justify-between gap-4">
                        <span className="text-muted">{entry.label}</span>
                        <span>{entry.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>

              <StaggerItem>
                <Button asChild block size="lg">
                  <Link href="/agendar">
                    <CalendarPlus className="size-4" />
                    Agendar horário
                  </Link>
                </Button>
              </StaggerItem>
            </Stagger>

            <Reveal delay={0.1}>
              <div className="h-full overflow-hidden rounded-3xl border border-line">
                <iframe
                  src={mapsEmbed}
                  title="Mapa da Barbearia Falcão"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full min-h-[32rem] w-full grayscale-[0.6] contrast-[1.1]"
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}
