import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { Container, Section } from '@/components/shared/section';
import { siteConfig } from '@/lib/config/site';

export const metadata: Metadata = buildMetadata({
  title: 'Política de Privacidade',
  description: 'Como a Barbearia Falcão coleta, usa e protege os seus dados pessoais.',
  path: '/privacidade',
});

const sections = [
  {
    title: 'Dados que coletamos',
    body: 'Coletamos nome, e-mail, telefone, data de nascimento, CPF (opcional), endereço (opcional) e foto de perfil, além do histórico de agendamentos e assinaturas vinculado à sua conta.',
  },
  {
    title: 'Como usamos seus dados',
    body: 'Utilizamos suas informações para identificar você no atendimento, gerenciar agendamentos e planos, enviar lembretes e melhorar a experiência na barbearia. Sua foto de perfil é exibida ao barbeiro responsável pelo seu horário.',
  },
  {
    title: 'Compartilhamento',
    body: 'Não vendemos seus dados. O compartilhamento ocorre apenas com prestadores necessários à operação, como o processador de pagamentos das assinaturas, sempre no limite do necessário.',
  },
  {
    title: 'Seus direitos',
    body: 'Você pode acessar, corrigir ou solicitar a exclusão dos seus dados a qualquer momento pela área do cliente ou entrando em contato com a barbearia.',
  },
  {
    title: 'Segurança',
    body: 'Adotamos medidas técnicas e organizacionais para proteger suas informações contra acesso não autorizado, perda ou alteração indevida.',
  },
];

export default function PrivacyPage() {
  return (
    <Section spacing="page">
      <Container className="max-w-3xl">
        <h1 className="font-display text-4xl text-content">Política de Privacidade</h1>
        <p className="mt-4 text-sm text-muted">
          Última atualização: {new Date().toLocaleDateString('pt-BR')}
        </p>

        <div className="mt-12 space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-display text-xl text-content">{section.title}</h2>
              <p className="mt-3 leading-relaxed text-muted">{section.body}</p>
            </section>
          ))}

          <section>
            <h2 className="font-display text-xl text-content">Contato</h2>
            <p className="mt-3 leading-relaxed text-muted">
              Dúvidas sobre privacidade podem ser enviadas à equipe da {siteConfig.legalName}, em{' '}
              {siteConfig.address.street}, {siteConfig.address.number} —{' '}
              {siteConfig.address.district}, {siteConfig.address.city}/{siteConfig.address.state}.
            </p>
          </section>
        </div>
      </Container>
    </Section>
  );
}
