import { CalendarDays, CheckCircle2, Scissors, UserCircle2 } from 'lucide-react';
import { Container, Section, SectionHeading } from '@/components/shared/section';
import { Stagger, StaggerItem } from '@/components/shared/reveal';

const steps = [
  {
    icon: Scissors,
    title: 'Escolha o serviço',
    description: 'Corte, barba ou o combo completo — com preço e duração transparentes.',
  },
  {
    icon: UserCircle2,
    title: 'Escolha o barbeiro',
    description: 'Cada profissional tem agenda própria. Você escolhe a mão e o estilo.',
  },
  {
    icon: CalendarDays,
    title: 'Selecione data e horário',
    description: 'A grade mostra só o que está realmente livre naquela cadeira.',
  },
  {
    icon: CheckCircle2,
    title: 'Confirme e pronto',
    description: 'Resumo na tela, agendamento salvo na sua conta e lembrete antes do horário.',
  },
];

export function ProcessSection() {
  return (
    <Section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute right-0 top-1/4 size-[28rem] rounded-full bg-falcao-500/10 blur-[120px] dark:bg-falcao-800/20"
        aria-hidden
      />
      <Container className="relative">
        <SectionHeading
          eyebrow="Como funciona"
          title="Quatro passos entre você e a cadeira"
          description="Agendamento direto, sem telefone, sem espera e sem depender de resposta no direct."
        />

        <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <StaggerItem key={step.title} className="h-full">
              <div className="surface-card group relative h-full rounded-3xl p-6 transition-colors duration-500 hover:border-line-strong">
                <span className="font-display text-5xl text-content/10 transition-colors duration-500 group-hover:text-falcao-500/20">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <step.icon className="mt-4 size-6 text-falcao-400" />
                <h3 className="mt-4 font-display text-lg text-content">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
