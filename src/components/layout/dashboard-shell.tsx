'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import type { ReactNode } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Logo } from '@/components/shared/logo';
import { logoutAction } from '@/features/auth/actions';
import { ThemeToggle } from '@/features/theme/theme-toggle';
import { cn } from '@/lib/utils/cn';

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

interface DashboardShellProps {
  items: DashboardNavItem[];
  user: { name: string; email: string; avatarUrl?: string };
  subtitle: string;
  children: ReactNode;
}

export function DashboardShell({ items, user, subtitle, children }: DashboardShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh bg-canvas lg:flex">
      <aside className="hidden w-72 shrink-0 flex-col border-r border-line p-6 lg:flex">
        <Link href="/" className="mb-10">
          <Logo />
        </Link>

        <nav className="flex flex-1 flex-col gap-1" aria-label="Navegação da área logada">
          {items.map((item) => {
            const active =
              item.href === pathname || (item.href !== '/conta' && item.href !== '/painel' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-colors',
                  active ? 'text-content' : 'text-muted hover:text-content',
                )}
              >
                {active ? (
                  <motion.span
                    layoutId="dashboard-active"
                    className="absolute inset-0 rounded-2xl border border-line bg-tint-strong"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                ) : null}
                <span className="relative flex items-center gap-3">
                  {item.icon}
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 space-y-4 border-t border-line pt-6">
          <div className="flex items-center gap-3">
            <Avatar name={user.name} src={user.avatarUrl} size="md" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-content">{user.name}</p>
              <p className="truncate text-xs text-muted">{subtitle}</p>
            </div>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-muted transition-colors hover:bg-tint-strong hover:text-content"
            >
              <LogOut className="size-4" />
              Sair
            </button>
          </form>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-line bg-canvas/85 px-5 py-4 backdrop-blur-xl lg:hidden">
          <Link href="/">
            <Logo showWordmark={false} />
          </Link>
          <nav className="flex flex-1 items-center gap-1 overflow-x-auto" aria-label="Navegação mobile">
            {items.map((item) => {
              const active = item.href === pathname;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'whitespace-nowrap rounded-full px-3 py-1.5 text-xs transition-colors',
                    active ? 'bg-tint-strong text-content' : 'text-muted',
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle className="size-9" />
            <form action={logoutAction}>
              <button type="submit" aria-label="Sair" className="text-muted hover:text-content">
                <LogOut className="size-5" />
              </button>
            </form>
          </div>
        </header>

        <main className="flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-12">{children}</main>
      </div>
    </div>
  );
}
