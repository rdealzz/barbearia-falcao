'use client';

import { CalendarX2, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils/cn';
import type { TimeSlot } from '@/types';

interface SlotPickerProps {
  slots: TimeSlot[];
  value?: string;
  onChange: (time: string) => void;
  loading?: boolean;
}

const periods = [
  { label: 'Manhã', from: 0, to: 12 },
  { label: 'Tarde', from: 12, to: 18 },
  { label: 'Noite', from: 18, to: 24 },
];

export function SlotPicker({ slots, value, onChange, loading = false }: SlotPickerProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <p className="flex items-center gap-2 text-sm text-muted">
          <Loader2 className="size-4 animate-spin" />
          Consultando a agenda…
        </p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} className="h-11 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line py-12 text-center">
        <CalendarX2 className="size-6 text-subtle" />
        <p className="text-sm text-muted">Este barbeiro não atende na data escolhida.</p>
        <p className="text-xs text-subtle">Selecione outro dia para ver os horários livres.</p>
      </div>
    );
  }

  const groups = periods
    .map((period) => ({
      ...period,
      items: slots.filter((slot) => {
        const hour = Number(slot.time.split(':')[0]);
        return hour >= period.from && hour < period.to;
      }),
    }))
    .filter((group) => group.items.length > 0);

  const hasAvailable = slots.some((slot) => slot.available);

  return (
    <div className="space-y-6">
      {!hasAvailable ? (
        <p className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-200">
          Todos os horários deste dia já foram preenchidos. Tente outra data.
        </p>
      ) : null}

      {groups.map((group) => (
        <div key={group.label}>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-subtle">
            {group.label}
          </p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {group.items.map((slot) => (
              <button
                key={slot.time}
                type="button"
                disabled={!slot.available}
                onClick={() => onChange(slot.time)}
                aria-pressed={value === slot.time}
                title={
                  slot.available
                    ? undefined
                    : slot.reason === 'booked'
                      ? 'Horário já reservado'
                      : slot.reason === 'time_off'
                        ? 'Barbeiro indisponível'
                        : slot.reason === 'limit_reached'
                          ? 'Limite diário atingido'
                          : 'Horário indisponível'
                }
                className={cn(
                  'h-11 rounded-xl border text-sm transition-all duration-200',
                  value === slot.time
                    ? 'border-falcao-500/60 bg-falcao-600 text-white'
                    : 'border-line bg-tint text-content hover:border-line-strong hover:bg-tint-strong',
                  !slot.available &&
                    'cursor-not-allowed border-line bg-transparent text-subtle line-through hover:border-line-strong hover:bg-transparent',
                )}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
