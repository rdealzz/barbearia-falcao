import { CalendarDays, CalendarRange, Users } from 'lucide-react';
import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { getCurrentUser } from '@/lib/auth/current-user';
import { db } from '@/services';

const items = [
  { label: 'Agenda do dia', href: '/painel', icon: <CalendarDays className="size-4" /> },
  { label: 'Semana', href: '/painel/semana', icon: <CalendarRange className="size-4" /> },
  { label: 'Clientes', href: '/painel/clientes', icon: <Users className="size-4" /> },
];

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/entrar?redirect=/painel');
  if (user.role !== 'barber' || !user.barberId) redirect('/conta');

  const barber = await db.barbers.findById(user.barberId);

  return (
    <DashboardShell
      items={items}
      user={{ name: user.name, email: user.email, avatarUrl: user.avatarUrl }}
      subtitle={barber?.role ?? 'Equipe Falcão'}
    >
      {children}
    </DashboardShell>
  );
}
