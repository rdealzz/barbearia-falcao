import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared/logo';

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center px-6">
      <div className="text-center">
        <Logo className="mx-auto" />
        <p className="mt-10 font-display text-7xl text-content/10">404</p>
        <h1 className="mt-4 font-display text-3xl text-content">Página não encontrada</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
          O endereço que você tentou acessar não existe ou foi movido. Que tal voltar para o
          início e marcar seu horário?
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/">Voltar ao início</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/agendar">Agendar horário</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
