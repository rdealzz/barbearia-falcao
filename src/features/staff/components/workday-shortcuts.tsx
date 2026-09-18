'use client';

import { useActionState, useState } from 'react';
import { CalendarX2, Loader2, LockOpen, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { initialActionState } from '@/features/auth/state';
import { cn } from '@/lib/utils/cn';
import type { TimeOff } from '@/types';
import { adjustWorkdayAction, releaseBlockAction } from '../schedule.actions';

const REASON_LABELS: Record<TimeOff['reason'], string> = {
  ferias: 'Férias',
  folga: 'Folga',
  ausencia: 'Ausência',
  feriado: 'Feriado',
  bloqueio: 'Bloqueio',
};

interface WorkdayShortcutsProps {
  barberId: string;
  date: string;
  /** Bloqueios que já valem para o dia — cada um pode ser desfeito. */
  blocks: TimeOff[];
  dayStart?: string;
  dayEnd?: string;
}

/**
 * A rotina real da cadeira: chegar mais tarde, sair mais cedo ou não vir.
 * Cada atalho vira um bloqueio que some da grade pública na hora.
 */
export function WorkdayShortcuts({
  barberId,
  date,
  blocks,
  dayStart = '09:00',
  dayEnd = '20:00',
}: WorkdayShortcutsProps) {
  const [arrival, setArrival] = useState(dayStart);
  const [departure, setDeparture] = useState(dayEnd);
  const [state, formAction, pending] = useActionState(adjustWorkdayAction, initialActionState);
  const [releaseState, releaseForm, releasing] = useActionState(
    releaseBlockAction,
    initialActionState,
  );

  const feedback = [state, releaseState].find((item) => item.status !== 'idle' && item.message);

  return (
    <div className="surface-card space-y-5 rounded-3xl p-5">
      <div>
        <h2 className="font-display text-lg text-content">Ajustar o dia</h2>
        <p className="mt-0.5 text-sm text-muted">
          Chegou mais tarde ou precisa sair antes? Os horários fora da sua jornada param de ser
          oferecidos na hora.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <form action={formAction} className="flex flex-col gap-2 rounded-2xl bg-tint p-3">
          <input type="hidden" name="barberId" value={barberId} />
          <input type="hidden" name="date" value={date} />
          <input type="hidden" name="mode" value="late" />
          <input type="hidden" name="time" value={arrival} />
          <label className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
            Chego às
          </label>
          <input
            type="time"
            value={arrival}
            onChange={(event) => setArrival(event.target.value)}
            className="h-10 rounded-xl border border-line bg-surface px-3 text-content focus:border-falcao-500/60 focus:outline-none"
          />
          <Button type="submit" variant="outline" size="sm" block disabled={pending}>
            {pending ? <Loader2 className="animate-spin" /> : <LogIn />}
            Bloquear antes
          </Button>
        </form>

        <form action={formAction} className="flex flex-col gap-2 rounded-2xl bg-tint p-3">
          <input type="hidden" name="barberId" value={barberId} />
          <input type="hidden" name="date" value={date} />
          <input type="hidden" name="mode" value="early" />
          <input type="hidden" name="time" value={departure} />
          <label className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
            Saio às
          </label>
          <input
            type="time"
            value={departure}
            onChange={(event) => setDeparture(event.target.value)}
            className="h-10 rounded-xl border border-line bg-surface px-3 text-content focus:border-falcao-500/60 focus:outline-none"
          />
          <Button type="submit" variant="outline" size="sm" block disabled={pending}>
            {pending ? <Loader2 className="animate-spin" /> : <LogOut />}
            Bloquear depois
          </Button>
        </form>

        <form action={formAction} className="flex flex-col justify-between gap-2 rounded-2xl bg-tint p-3">
          <input type="hidden" name="barberId" value={barberId} />
          <input type="hidden" name="date" value={date} />
          <input type="hidden" name="mode" value="day" />
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">Dia inteiro</p>
            <p className="mt-2 text-sm text-muted">Folga, imprevisto ou compromisso o dia todo.</p>
          </div>
          <Button type="submit" variant="outline" size="sm" block disabled={pending}>
            {pending ? <Loader2 className="animate-spin" /> : <CalendarX2 />}
            Não atendo hoje
          </Button>
        </form>
      </div>

      {blocks.length > 0 ? (
        <div className="space-y-2 border-t border-line pt-4">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
            Bloqueios ativos neste dia
          </p>
          <ul className="space-y-2">
            {blocks.map((block) => (
              <li
                key={block.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-tint px-4 py-2.5"
              >
                <div className="min-w-0">
                  <p className="text-sm text-content">
                    {block.startTime && block.endTime
                      ? `${block.startTime} – ${block.endTime}`
                      : 'Dia inteiro'}
                    <span className="ml-2 text-xs text-subtle">{REASON_LABELS[block.reason]}</span>
                  </p>
                  {block.note ? <p className="truncate text-xs text-muted">{block.note}</p> : null}
                </div>
                <form action={releaseForm}>
                  <input type="hidden" name="blockId" value={block.id} />
                  <Button type="submit" variant="ghost" size="sm" disabled={releasing}>
                    {releasing ? <Loader2 className="animate-spin" /> : <LockOpen />}
                    Liberar
                  </Button>
                </form>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {feedback?.message ? (
        <p
          role="status"
          className={cn(
            'text-sm',
            feedback.status === 'error'
              ? 'text-falcao-700 dark:text-falcao-300'
              : 'text-emerald-700 dark:text-emerald-300',
          )}
        >
          {feedback.message}
        </p>
      ) : null}
    </div>
  );
}
