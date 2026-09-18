'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { CalendarPlus, LogIn, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Logo } from '@/components/shared/logo';
import { navigation } from '@/lib/config/site';
import { cn } from '@/lib/utils/cn';
import type { PublicUser } from '@/types';

interface SiteHeaderProps {
  user: Pick<PublicUser, 'name' | 'role' | 'avatarUrl'> | null;
}

export function SiteHeader({ user }: SiteHeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  // Fecha o menu ao navegar, ajustando o estado durante a renderização.
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
  }

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (value) => setScrolled(value > 24));

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const accountHref = user?.role === 'barber' ? '/painel' : '/conta';

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
        scrolled ? 'py-3' : 'py-5',
      )}
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <div
          className={cn(
            'flex items-center justify-between rounded-full transition-all duration-500',
            scrolled
              ? 'glass border border-white/10 px-4 py-2.5 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)]'
              : 'border border-transparent px-1 py-1',
          )}
        >
          <Link href="/" aria-label="Barbearia Falcão — início">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegação principal">
            {navigation.main.map((item) => {
              const active =
                item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative rounded-full px-4 py-2 text-sm transition-colors duration-200',
                    active ? 'text-white' : 'text-ink-400 hover:text-ink-100',
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-white/[0.07]"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  ) : null}
                  <span className="relative">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <Link
                href={accountHref}
                className="hidden items-center gap-2 rounded-full border border-white/10 py-1.5 pl-1.5 pr-4 text-sm text-ink-200 transition-colors hover:border-white/25 hover:text-white sm:inline-flex"
              >
                <Avatar name={user.name} src={user.avatarUrl} size="sm" />
                {user.name.split(' ')[0]}
              </Link>
            ) : (
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link href="/entrar">
                  <LogIn className="size-4" />
                  Entrar
                </Link>
              </Button>
            )}

            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link href="/agendar">
                <CalendarPlus className="size-4" />
                Agendar
              </Link>
            </Button>

            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              className="grid size-10 place-items-center rounded-full border border-white/10 text-ink-200 transition-colors hover:text-white lg:hidden"
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 top-0 z-30 bg-ink-950/95 backdrop-blur-xl lg:hidden"
          >
            <nav className="flex h-full flex-col gap-1 px-6 pb-10 pt-28" aria-label="Menu mobile">
              {navigation.main.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + index * 0.05, duration: 0.4 }}
                >
                  <Link
                    href={item.href}
                    className="block border-b border-white/[0.06] py-4 font-display text-2xl text-ink-200 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              <div className="mt-auto flex flex-col gap-3">
                <Button asChild size="lg" block>
                  <Link href="/agendar">Agendar agora</Link>
                </Button>
                <Button asChild variant="outline" size="lg" block>
                  <Link href={user ? accountHref : '/entrar'}>
                    {user ? 'Minha conta' : 'Entrar / Cadastrar'}
                  </Link>
                </Button>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
