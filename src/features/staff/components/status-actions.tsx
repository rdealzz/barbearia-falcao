'use client';

import { CheckCircle2, Loader2, PlayCircle, UserX, XCircle } from 'lucide-react';
import { useActionState } from 'react';
import { initialActionState } from '@/features/auth/state';
import { updateAppointmentStatusAction } from '../actions';
import { cn } from '@/lib/utils/cn';
import type { AppointmentStatus } from '@/types';

const transitions: Record<
  AppointmentStatus,
  Array<{ status: AppointmentStatus; label: string; icon: typeof PlayCircle; tone: string }>
> = {
  pending: [
    { status: 'confirmed', label: 'Confirmar', icon: CheckCircle2, tone: 'text-emerald-300' },
    { status: 'cancelled', label: 'Cancelar', icon: XCircle, tone: 'text-falcao-300' },
  ],
  confirmed: [
    { status: 'in_progress', label: 'Iniciar', icon: PlayCircle, tone: 'text-falcao-200' },
    { status: 'no_show', label: 'Não veio', icon: UserX, tone: 'text-ink-400' },
    { status: 'cancelled', label: 'Cancelar', icon: XCircle, tone: 'text-falcao-300' },
  ],
  in_progress: [
    { status: 'completed', label: 'Finalizar', icon: CheckCircle2, tone: 'text-emerald-300' },
  ],
  completed: [],
  cancelled: [],
  no_show: [],
};

export function StatusActions({
  appointmentId,
  status,
}: {
  appointmentId: string;
  status: AppointmentStatus;
}) {
  const [state, formAction, pending] = useActionState(
    updateAppointmentStatusAction,
    initialActionState,
  );

  const options = transitions[status];
  if (options.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {options.map((option) => (
        <form key={option.status} action={formAction}>
          <input type="hidden" name="appointmentId" value={appointmentId} />
          <input type="hidden" name="status" value={option.status} />
          <button
            type="submit"
            disabled={pending}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs transition-colors hover:border-white/25 hover:bg-white/[0.04] disabled:opacity-50',
              option.tone,
            )}
          >
            {pending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <option.icon className="size-3.5" />
            )}
            {option.label}
          </button>
        </form>
      ))}

      {state.status === 'error' && state.message ? (
        <p role="alert" className="text-xs text-falcao-300">
          {state.message}
        </p>
      ) : null}
    </div>
  );
}
