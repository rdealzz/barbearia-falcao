import Link from 'next/link';
import { Clock, MapPin, Phone } from 'lucide-react';
import { InstagramIcon } from '@/components/shared/icons';
import { Logo } from '@/components/shared/logo';
import { Container } from '@/components/shared/section';
import { Separator } from '@/components/ui/separator';
import { navigation, siteConfig } from '@/lib/config/site';

const legalLinks = [
  { label: 'Política de Privacidade', href: '/privacidade' },
  { label: 'Termos de Uso', href: '/termos' },
];

export function SiteFooter() {
  const { address, openingHours, social, contact } = siteConfig;

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] bg-ink-950">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-falcao-700/10 blur-3xl"
        aria-hidden
      />
      <Container className="relative py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="space-y-5">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-ink-500">
              {siteConfig.description}
            </p>
            <a
              href={social.instagram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-ink-300 transition-colors hover:border-falcao-500/40 hover:text-white"
            >
              <InstagramIcon className="size-4" />
              {social.instagramHandle}
            </a>
          </div>

          <nav aria-label="Navegação do rodapé" className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink-600">Navegação</p>
            <ul className="space-y-3">
              {navigation.main.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-ink-400 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink-600">Conta</p>
            <ul className="space-y-3">
              <li>
                <Link href="/agendar" className="text-sm text-ink-400 transition-colors hover:text-white">
                  Agendar horário
                </Link>
              </li>
              <li>
                <Link href="/entrar" className="text-sm text-ink-400 transition-colors hover:text-white">
                  Entrar
                </Link>
              </li>
              <li>
                <Link href="/cadastrar" className="text-sm text-ink-400 transition-colors hover:text-white">
                  Criar conta
                </Link>
              </li>
              <li>
                <Link href="/painel" className="text-sm text-ink-400 transition-colors hover:text-white">
                  Área do barbeiro
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink-600">Contato</p>
            <ul className="space-y-3 text-sm text-ink-400">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-falcao-400" />
                <span>
                  {address.street}, {address.number}
                  <br />
                  {address.district} — {address.city}/{address.state}
                </span>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-falcao-400" />
                <span>
                  {openingHours.map((entry) => (
                    <span key={entry.label} className="block">
                      {entry.label}: {entry.value}
                    </span>
                  ))}
                </span>
              </li>
              {contact.phone ? (
                <li className="flex gap-3">
                  <Phone className="mt-0.5 size-4 shrink-0 text-falcao-400" />
                  <a href={`tel:${contact.phone.replace(/\D/g, '')}`} className="hover:text-white">
                    {contact.phone}
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col items-center justify-between gap-4 text-xs text-ink-600 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName}. Todos os direitos reservados.
          </p>
          <ul className="flex items-center gap-6">
            {legalLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-ink-300">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
