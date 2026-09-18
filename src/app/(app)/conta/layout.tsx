import { CalendarDays, CreditCard, Home, Ticket, UserRound } from 'lucide-react';
import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { WhatsAppButton } from '@/components/shared/whatsapp-button';
import { getCurrentUser } from '@/lib/auth/current-user';

const items = [
  { label: 'Início', href: '/conta', icon: <Home className="size-4" /> },
  { label: 'Agendamentos', href: '/conta/agendamentos', icon: <CalendarDays className="size-4" /> },
  { label: 'Clube Falcão', href: '/conta/clube', icon: <Ticket className="size-4" /> },
  { label: 'Plano', href: '/conta/plano', icon: <CreditCard className="size-4" /> },
  { label: 'Perfil', href: '/conta/perfil', icon: <UserRound className="size-4" /> },
];

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/entrar?redirect=/conta');
  if (user.role === 'barber') redirect('/painel');

  return (
    <>
      <DashboardShell
        items={items}
        user={{ name: user.name, email: user.email, avatarUrl: user.avatarUrl }}
        subtitle={user.email}
      >
        {children}
      </DashboardShell>
      <WhatsAppButton />
    </>
  );
}
