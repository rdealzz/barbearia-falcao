import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo/metadata';
import { AuthCard } from '@/features/auth/components/auth-card';
import { RecoveryForm } from '@/features/auth/components/recovery-form';

export const metadata: Metadata = buildMetadata({
  title: 'Recuperar senha',
  description: 'Recupere o acesso à sua conta da Barbearia Falcão.',
  path: '/recuperar-senha',
  noIndex: true,
});

export default function RecoveryPage() {
  return (
    <AuthCard
      title="Recuperar senha"
      description="Informe o e-mail cadastrado e enviaremos as instruções para criar uma nova senha."
      footer={
        <Link
          href="/entrar"
          className="font-medium text-falcao-300 transition-colors hover:text-falcao-200"
        >
          Voltar para o login
        </Link>
      }
    >
      <RecoveryForm />
    </AuthCard>
  );
}
