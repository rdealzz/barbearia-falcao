import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Award, Heart, Target } from 'lucide-react';
import { db } from '@/services';
import { buildMetadata } from '@/lib/seo/metadata';
import { Button } from '@/components/ui/button';
import { Container, Section, SectionHeading } from '@/components/shared/section';
import { Reveal, Stagger, StaggerItem } from '@/components/shared/reveal';
import { MediaFrame } from '@/components/shared/media-frame';
import { BarberCard } from '@/features/barbers/components/barber-card';
import { media } from '@/lib/data/media';
import { siteConfig } from '@/lib/config/site';

export const metadata: Metadata = buildMetadata({
  title: 'Sobre',
  description:
    'A história da Barbearia Falcão, a equipe, a estrutura e o cuidado que sustentam cada atendimento em Curitiba.',
  path: '/sobre',
});

const values = [
  {
    icon: Target,
    title: 'Missão',
    description:
      'Entregar ao homem curitibano um corte impecável e uma experiência que ele faça questão de repetir.',
  },
  {
    icon: Award,
    title: 'Técnica',
    description:
      'Formação contínua da equipe, ferramentas profissionais e protocolos definidos para cada serviço.',
  },
  {
    icon: Heart,
    title: 'Cuidado',
    description:
      'Do café na chegada ao acabamento na navalha: o detalhe é o que separa um corte de uma experiência.',
  },
];

export default async function AboutPage() {
  const barbers = await db.barbers.list();

  return (
    <>
      <Section className="pt-36 pb-12">
        <Container>
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeading
                eyebrow={`Desde ${siteConfig.foundedIn}`}
                title="Uma barbearia construída cadeira por cadeira"
                description="A Falcão nasceu em 2018 no Novo Mundo com uma cadeira, uma navalha e uma régua alta. Sete anos depois, são milhares de atendimentos e uma equipe que trata corte como ofício."
              />
              <Reveal delay={0.1} className="mt-8 space-y-5 text-ink-400">
                <p className="leading-relaxed">
                  O que começou como um espaço pequeno virou ponto de encontro do bairro. Cliente
                  que entrou para cortar o cabelo antes do trabalho voltou com o filho, depois com
                  o pai — e a agenda passou a ser o nosso maior ativo.
                </p>
                <p className="leading-relaxed">
                  Por isso levamos horário a sério. Cada barbeiro tem a própria agenda, cada
                  serviço tem tempo definido e cada atendimento começa quando foi marcado.
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.15} className="grid grid-cols-2 gap-4">
              <MediaFrame src={media.chair} alt="Cadeira da Barbearia Falcão" className="aspect-[3/4]" />
              <div className="mt-8 space-y-4">
                <MediaFrame src={media.tools} alt="Ferramentas profissionais" className="aspect-square" />
                <MediaFrame src={media.shopWide} alt="Salão da barbearia" className="aspect-square" />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section className="bg-ink-900/30">
        <Container>
          <Stagger className="grid gap-5 md:grid-cols-3">
            {values.map((value) => (
              <StaggerItem key={value.title} className="h-full">
                <div className="surface-card h-full rounded-3xl p-7">
                  <span className="grid size-11 place-items-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-falcao-400">
                    <value.icon className="size-5" />
                  </span>
                  <h3 className="mt-5 font-display text-xl text-white">{value.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-400">{value.description}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            eyebrow="Equipe"
            title="Quem faz a Falcão acontecer"
            description="Profissionais com especialidade definida e agenda própria."
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

      <Section className="pt-0">
        <Container>
          <SectionHeading
            eyebrow="Estrutura"
            title="Um espaço pensado para o tempo parar um pouco"
            description="Ambiente climatizado, som na medida, café e um atendimento que não empurra ninguém para a porta."
          />
          <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {media.gallery.map((image, index) => (
              <StaggerItem key={image}>
                <MediaFrame
                  src={image}
                  alt={`Estrutura da Barbearia Falcão ${index + 1}`}
                  className="aspect-[4/3] w-full transition-transform duration-500 hover:scale-[1.01]"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </StaggerItem>
            ))}
          </Stagger>

          <div className="mt-14 flex justify-center">
            <Button asChild size="lg">
              <Link href="/agendar">
                Reservar meu horário
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
