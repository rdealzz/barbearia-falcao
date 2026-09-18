'use client';

import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addDays, rangeOfDays, todayDateString, weekdayOf, WEEKDAY_SHORT } from '@/lib/utils/date';
import { parseDateString } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import type { DateString, Weekday } from '@/types';

interface DatePickerProps {
  value?: DateString;
  onChange: (date: DateString) => void;
  offset: number;
  onOffsetChange: (offset: number) => void;
  horizonInDays: number;
  unavailableWeekdays?: Weekday[];
  visibleDays?: number;
}

export function DatePicker({
  value,
  onChange,
  offset,
  onOffsetChange,
  horizonInDays,
  unavailableWeekdays = [],
  visibleDays = 14,
}: DatePickerProps) {
  const today = todayDateString();
  const dates = useMemo(
    () => rangeOfDays(addDays(today, offset), visibleDays),
    [today, offset, visibleDays],
  );

  const canGoBack = offset > 0;
  const canGoForward = offset + visibleDays < horizonInDays;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-ink-400">
          {parseDateString(dates[0] ?? today).toLocaleDateString('pt-BR', {
            month: 'long',
            year: 'numeric',
          })}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onOffsetChange(Math.max(0, offset - visibleDays))}
            disabled={!canGoBack}
            aria-label="Dias anteriores"
            className="grid size-9 place-items-center rounded-full border border-white/10 text-ink-300 transition-colors hover:border-white/25 hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onOffsetChange(offset + visibleDays)}
            disabled={!canGoForward}
            aria-label="Próximos dias"
            className="grid size-9 place-items-center rounded-full border border-white/10 text-ink-300 transition-colors hover:border-white/25 hover:text-white disabled:opacity-30"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
        {dates.map((date) => {
          const weekday = weekdayOf(date);
          const disabled = unavailableWeekdays.includes(weekday);
          const selected = value === date;
          const isToday = date === today;

          return (
            <button
              key={date}
              type="button"
              disabled={disabled}
              onClick={() => onChange(date)}
              aria-pressed={selected}
              className={cn(
                'flex flex-col items-center gap-1 rounded-2xl border py-3 transition-all duration-300',
                selected
                  ? 'border-falcao-500/60 bg-falcao-600 text-white'
                  : 'border-white/[0.08] bg-white/[0.02] text-ink-300 hover:border-white/20 hover:bg-white/[0.05]',
                disabled && 'cursor-not-allowed opacity-30 hover:border-white/[0.08] hover:bg-white/[0.02]',
              )}
            >
              <span className="text-[10px] uppercase tracking-wider opacity-70">
                {WEEKDAY_SHORT[weekday]}
              </span>
              <span className="font-display text-lg leading-none">
                {parseDateString(date).getDate()}
              </span>
              {isToday ? (
                <span className="text-[10px] opacity-70">hoje</span>
              ) : (
                <span className="text-[10px] opacity-0">.</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
