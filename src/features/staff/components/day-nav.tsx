import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addDays, todayDateString, WEEKDAY_SHORT, weekdayOf } from '@/lib/utils/date';
import { parseDateString } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import type { Weekday } from '@/types';

interface DayNavProps {
  date: string;
  /** Rota base; a data entra como ?data=. */
  basePath: string;
  /** Parâmetros extras a preservar (ex.: barbeiro selecionado pelo chefe). */
  params?: Record<string, string | undefined>;
  /** Quantidade de dias visíveis na régua. */
  days?: number;
}

function hrefFor(basePath: string, date: string, params: Record<string, string | undefined>) {
  const search = new URLSearchParams({ data: date });
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }
  return `${basePath}?${search.toString()}`;
}

/** Régua de dias do painel: uma semana à frente, sempre a um clique. */
export function DayNav({ date, basePath, params = {}, days = 8 }: DayNavProps) {
  const today = todayDateString();
  const strip = Array.from({ length: days }, (_, index) => addDays(date, index - 1));

  return (
    <div className="flex items-center gap-2">
      <Link
        href={hrefFor(basePath, addDays(date, -1), params)}
        aria-label="Dia anterior"
        className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-content"
      >
        <ChevronLeft className="size-4" />
      </Link>

      <div className="flex flex-1 gap-1.5 overflow-x-auto pb-1">
        {strip.map((item) => {
          const active = item === date;
          return (
            <Link
              key={item}
              href={hrefFor(basePath, item, params)}
              className={cn(
                'flex min-w-14 shrink-0 flex-col items-center rounded-2xl border px-3 py-2 transition-colors',
                active
                  ? 'border-falcao-500/50 bg-falcao-600/10 text-content'
                  : 'border-line text-muted hover:border-line-strong hover:text-content',
              )}
            >
              <span className="text-[10px] uppercase tracking-wider">
                {WEEKDAY_SHORT[weekdayOf(item) as Weekday]}
              </span>
              <span className="font-display text-lg leading-tight">
                {parseDateString(item).getDate()}
              </span>
              {item === today ? (
                <span className="text-[9px] uppercase tracking-wider text-falcao-600 dark:text-falcao-300">
                  hoje
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>

      <Link
        href={hrefFor(basePath, addDays(date, 1), params)}
        aria-label="Próximo dia"
        className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-content"
      >
        <ChevronRight className="size-4" />
      </Link>
    </div>
  );
}
