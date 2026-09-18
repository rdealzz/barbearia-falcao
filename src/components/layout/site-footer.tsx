import Link from 'next/link';
import { Clock, MapPin, Phone } from 'lucide-react';
import { FacebookIcon, InstagramIcon } from '@/components/shared/icons';
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
    <footer className="relative overflow-hidden border-t border-line bg-canvas">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-falcao-500/8 blur-3xl dark:bg-falcao-700/15"
        aria-hidden
      />
      <Container className="relative py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="space-y-5">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted">
              {siteConfig.description}
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href={social.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-falcao-500/40 hover:text-content"
              >
                <InstagramIcon className="size-4" />
                {social.instagramHandle}
              </a>
              <a
                href={social.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook da Barbearia Falcão"
                className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-falcao-500/40 hover:text-content"
              >
                <FacebookIcon className="size-4" />
                Facebook
              </a>
            </div>
          </div>

          <nav aria-label="Navegação do rodapé" className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-subtle">Navegação</p>
            <ul className="space-y-3">
              {navigation.main.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted transition-colors hover:text-content"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-subtle">Conta</p>
            <ul className="space-y-3">
              <li>
                <Link href="/agendar" className="text-sm text-muted transition-colors hover:text-content">
                  Agendar horário
                </Link>
              </li>
              <li>
                <Link href="/entrar" className="text-sm text-muted transition-colors hover:text-content">
                  Entrar
                </Link>
              </li>
              <li>
                <Link href="/cadastrar" className="text-sm text-muted transition-colors hover:text-content">
                  Criar conta
                </Link>
              </li>
              <li>
                <Link href="/painel" className="text-sm text-muted transition-colors hover:text-content">
                  Área do barbeiro
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-subtle">Contato</p>
            <ul className="space-y-3 text-sm text-muted">
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
                  <a href={`tel:${contact.phone.replace(/\D/g, '')}`} className="hover:text-content">
                    {contact.phone}
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col items-center justify-between gap-4 text-xs text-subtle sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName}. Todos os direitos reservados.
          </p>
          <ul className="flex items-center gap-6">
            {legalLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-muted">
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
