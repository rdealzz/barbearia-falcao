import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { Container, Section } from '@/components/shared/section';

export const metadata: Metadata = buildMetadata({
  title: 'Termos de Uso',
  description: 'Regras de uso da plataforma de agendamento e das assinaturas da Barbearia Falcão.',
  path: '/termos',
});

const sections = [
  {
    title: 'Uso da plataforma',
    body: 'A conta é pessoal e intransferível. Você é responsável por manter seus dados atualizados e pela guarda da sua senha.',
  },
  {
    title: 'Agendamentos',
    body: 'Cada horário é reservado individualmente na agenda do barbeiro escolhido. Cancelamentos devem ser feitos com antecedência pela área do cliente para liberar o horário a outro cliente.',
  },
  {
    title: 'Atrasos e ausências',
    body: 'Tolerância de 10 minutos de atraso. Após esse prazo, o atendimento pode ser remarcado conforme a disponibilidade da agenda.',
  },
  {
    title: 'Assinaturas',
    body: 'Os planos têm vigência indeterminada, com renovação automática mensal. O cancelamento pode ser solicitado a qualquer momento e encerra a renovação seguinte, preservando o ciclo já pago.',
  },
  {
    title: 'Planos ilimitados',
    body: 'Planos ilimitados respeitam um intervalo técnico entre atendimentos, definido pela equipe para preservar a saúde do cabelo e da pele.',
  },
  {
    title: 'Alterações',
    body: 'Estes termos podem ser atualizados. Mudanças relevantes serão comunicadas pelos canais oficiais da barbearia.',
  },
];

export default function TermsPage() {
  return (
    <Section className="pt-36">
      <Container className="max-w-3xl">
        <h1 className="font-display text-4xl text-white">Termos de Uso</h1>
        <p className="mt-4 text-sm text-ink-500">
          Última atualização: {new Date().toLocaleDateString('pt-BR')}
        </p>

        <div className="mt-12 space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-display text-xl text-white">{section.title}</h2>
              <p className="mt-3 leading-relaxed text-ink-400">{section.body}</p>
            </section>
          ))}
        </div>
      </Container>
    </Section>
  );
}
