import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { buildMetadata } from '@/lib/seo/metadata';
import { getCurrentUser } from '@/lib/auth/current-user';
import { AuthCard } from '@/features/auth/components/auth-card';
import { LoginForm } from '@/features/auth/components/login-form';

export const metadata: Metadata = buildMetadata({
  title: 'Entrar',
  description: 'Acesse sua conta da Barbearia Falcão para agendar e gerenciar seus horários.',
  path: '/entrar',
  noIndex: true,
});

interface PageProps {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const user = await getCurrentUser();
  if (user) redirect(user.role === 'barber' ? '/painel' : '/conta');

  const { redirect: redirectTo } = await searchParams;

  return (
    <AuthCard
      title="Entrar"
      description="Acesse sua conta para agendar, acompanhar seus horários e gerenciar seu plano."
      footer={
        <>
          Ainda não tem uma conta?{' '}
          <Link
            href={redirectTo ? `/cadastrar?redirect=${redirectTo}` : '/cadastrar'}
            className="font-medium text-falcao-700 dark:text-falcao-300 transition-colors hover:text-falcao-700 dark:text-falcao-200"
          >
            Cadastre-se
          </Link>
        </>
      }
    >
      <LoginForm redirectTo={redirectTo} />
    </AuthCard>
  );
}
