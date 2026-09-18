import { CalendarClock, CalendarDays, CalendarRange, Users, UsersRound } from 'lucide-react';
import { redirect } from 'next/navigation';
import { DashboardShell, type DashboardNavItem } from '@/components/layout/dashboard-shell';
import { getCurrentUser } from '@/lib/auth/current-user';
import { permissionsFor, STAFF_ROLE_LABELS, staffRoleOf } from '@/lib/auth/permissions';
import { db } from '@/services';

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/entrar?redirect=/painel');
  if (user.role !== 'barber' || !user.barberId) redirect('/conta');

  const barber = await db.barbers.findById(user.barberId);
  const permissions = permissionsFor(user);
  const staffRole = staffRoleOf(user) ?? 'barber';

  // O menu é montado pelo nível de acesso: funcionário vê apenas a
  // própria operação; o chefe ganha as rotas de dono da casa.
  const items: DashboardNavItem[] = [
    { label: 'Agenda do dia', href: '/painel', icon: <CalendarDays className="size-4" /> },
    { label: 'Meus horários', href: '/painel/agenda', icon: <CalendarClock className="size-4" /> },
    { label: 'Semana', href: '/painel/semana', icon: <CalendarRange className="size-4" /> },
    ...(permissions.viewTeamAgenda
      ? [{ label: 'Equipe', href: '/painel/equipe', icon: <UsersRound className="size-4" /> }]
      : []),
    ...(permissions.manageClients
      ? [{ label: 'Clientes', href: '/painel/clientes', icon: <Users className="size-4" /> }]
      : []),
  ];

  return (
    <DashboardShell
      items={items}
      user={{ name: user.name, email: user.email, avatarUrl: user.avatarUrl }}
      subtitle={`${STAFF_ROLE_LABELS[staffRole]} · ${barber?.name ?? 'Equipe Falcão'}`}
    >
      {children}
    </DashboardShell>
  );
}
