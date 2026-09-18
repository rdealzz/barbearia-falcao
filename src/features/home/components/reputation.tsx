import { ArrowUpRight, MapPin, Star } from 'lucide-react';
import { Container, Section, SectionHeading } from '@/components/shared/section';
import { Reveal, Stagger, StaggerItem } from '@/components/shared/reveal';
import { Button } from '@/components/ui/button';
import { InstagramIcon } from '@/components/shared/icons';
import { siteConfig } from '@/lib/config/site';

/**
 * Prova social baseada apenas em números públicos verificáveis.
 * Depoimentos individuais só entram aqui quando vierem das avaliações reais.
 */
export function Reputation() {
  const { reputation, social, address, foundedIn } = siteConfig;

  const cards = [
    {
      icon: Star,
      value: reputation.rating.toLocaleString('pt-BR'),
      title: `Nota no ${reputation.source}`,
      description: `${reputation.reviewsCount} avaliações de quem já sentou na cadeira.`,
      href: social.googleMaps,
      cta: 'Ler avaliações',
    },
    {
      icon: InstagramIcon,
      value: '+1 mil',
      title: 'Seguidores no Instagram',
      description: `Trabalhos do dia a dia publicados em ${social.instagramHandle}.`,
      href: social.instagram,
      cta: 'Ver o perfil',
    },
    {
      icon: MapPin,
      value: `${new Date().getFullYear() - foundedIn} anos`,
      title: `No ${address.district}`,
      description: `Referência em ${address.city} desde ${foundedIn}.`,
      href: social.googleMaps,
      cta: 'Ver no mapa',
    },
  ];

  return (
    <Section className="bg-canvas-subtle">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Reputação"
          title="Quem senta na cadeira, volta"
          description={`${reputation.reviewsCount} avaliações no ${reputation.source} e uma média de ${reputation.rating
            .toLocaleString('pt-BR')} que a gente faz questão de sustentar.`}
        />

        <Stagger className="mt-14 grid gap-5 lg:grid-cols-3">
          {cards.map((card) => (
            <StaggerItem key={card.title} className="h-full">
              <a
                href={card.href}
                target="_blank"
                rel="noreferrer"
                className="surface-card group flex h-full flex-col gap-4 rounded-3xl p-7 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-line-strong"
              >
                <span className="grid size-11 place-items-center rounded-2xl border border-line bg-tint text-falcao-400">
                  <card.icon className="size-5" />
                </span>
                <p className="font-display text-4xl text-content">{card.value}</p>
                <div>
                  <p className="font-medium text-content">{card.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{card.description}</p>
                </div>
                <span className="mt-auto inline-flex items-center gap-1.5 text-sm text-falcao-700 dark:text-falcao-300">
                  {card.cta}
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </a>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.1} className="mt-10 flex justify-center">
          <Button asChild variant="outline">
            <a href={social.googleMaps} target="_blank" rel="noreferrer">
              <Star className="size-4" />
              Avaliar a Barbearia Falcão
            </a>
          </Button>
        </Reveal>
      </Container>
    </Section>
  );
}
