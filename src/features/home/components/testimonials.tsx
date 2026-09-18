import { Quote, Star } from 'lucide-react';
import { Container, Section, SectionHeading } from '@/components/shared/section';
import { Stagger, StaggerItem } from '@/components/shared/reveal';
import { Avatar } from '@/components/ui/avatar';

const testimonials = [
  {
    name: 'Gustavo M.',
    role: 'Cliente há 4 anos',
    quote:
      'Nunca mais precisei explicar o que eu queria. Chego, sento e sei exatamente o resultado que vou levar para casa.',
  },
  {
    name: 'Rodrigo A.',
    role: 'Assinante do plano ilimitado',
    quote:
      'O plano pagou a si mesmo no segundo corte do mês. Agendo pelo celular em 30 segundos e o horário é respeitado.',
  },
  {
    name: 'Felipe S.',
    role: 'Cliente desde 2021',
    quote:
      'A barboterapia é outro nível. Toalha quente, navalha e um cuidado com o detalhe que eu não achei em outro lugar da cidade.',
  },
];

export function Testimonials() {
  return (
    <Section className="bg-ink-900/30">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Avaliações"
          title="Quem senta na cadeira, volta"
          description="Mais de mil atendimentos e uma régua que não abaixa."
        />

        <Stagger className="mt-14 grid gap-5 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <StaggerItem key={testimonial.name} className="h-full">
              <figure className="surface-card flex h-full flex-col gap-5 rounded-3xl p-7">
                <Quote className="size-6 text-falcao-500/60" />
                <blockquote className="flex-1 text-sm leading-relaxed text-ink-300">
                  “{testimonial.quote}”
                </blockquote>
                <figcaption className="flex items-center gap-3 border-t border-white/[0.06] pt-5">
                  <Avatar name={testimonial.name} size="sm" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{testimonial.name}</p>
                    <p className="text-xs text-ink-500">{testimonial.role}</p>
                  </div>
                  <span className="flex gap-0.5 text-falcao-400">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className="size-3 fill-current" />
                    ))}
                  </span>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
