import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { buildMetadata } from '@/lib/seo/metadata';
import { getCurrentUser } from '@/lib/auth/current-user';
import { AuthCard } from '@/features/auth/components/auth-card';
import { RegisterForm } from '@/features/auth/components/register-form';

export const metadata: Metadata = buildMetadata({
  title: 'Criar conta',
  description: 'Crie sua conta na Barbearia Falcão e agende seu horário online.',
  path: '/cadastrar',
  noIndex: true,
});

interface PageProps {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function RegisterPage({ searchParams }: PageProps) {
  const user = await getCurrentUser();
  if (user) redirect(user.role === 'barber' ? '/painel' : '/conta');

  const { redirect: redirectTo } = await searchParams;

  return (
    <AuthCard
      title="Criar conta"
      description="Leva menos de um minuto. Depois é só escolher o horário e aparecer."
      footer={
        <>
          Já tem uma conta?{' '}
          <Link
            href={redirectTo ? `/entrar?redirect=${redirectTo}` : '/entrar'}
            className="font-medium text-falcao-700 dark:text-falcao-300 transition-colors hover:text-falcao-700 dark:text-falcao-200"
          >
            Entrar
          </Link>
        </>
      }
    >
      <RegisterForm redirectTo={redirectTo} />
    </AuthCard>
  );
}
