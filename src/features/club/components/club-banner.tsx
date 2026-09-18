import Link from 'next/link';
import { ArrowRight, Ticket } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

/**
 * Chamada do Clube Falcão nas cores da marca (vermelho + creme sobre preto),
 * exibida no início da área do cliente.
 */
export function ClubBanner({ className }: { className?: string }) {
  return (
    <Link
      href="/conta/clube"
      className={cn(
        'group relative isolate flex items-center justify-between gap-6 overflow-hidden rounded-3xl bg-[#121212] p-6 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 sm:p-7',
        className,
      )}
    >
      <span
        className="pointer-events-none absolute -right-16 -top-20 -z-10 size-64 rounded-full bg-falcao-600/40 blur-3xl transition-opacity duration-500 group-hover:opacity-80"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-1.5 bg-gradient-to-b from-falcao-500 via-falcao-600 to-falcao-800"
        aria-hidden
      />

      <span className="flex items-center gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-[#F2E4C9]/20 bg-[#F2E4C9]/10 text-[#F2E4C9]">
          <Ticket className="size-5" />
        </span>
        <span>
          <span className="block font-display text-lg text-[#F2E4C9]">
            Conheça o Clube Falcão
          </span>
          <span className="mt-0.5 block text-sm text-[#F2E4C9]/70">
            e pegue seu cupom com vantagens
          </span>
        </span>
      </span>

      <ArrowRight className="size-5 shrink-0 text-[#F2E4C9] transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}
