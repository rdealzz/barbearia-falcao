'use client';

import { Check } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface SelectionCardProps {
  selected: boolean;
  onSelect: () => void;
  title: string;
  subtitle?: string;
  meta?: ReactNode;
  media?: ReactNode;
  disabled?: boolean;
  disabledLabel?: string;
}

export function SelectionCard({
  selected,
  onSelect,
  title,
  subtitle,
  meta,
  media,
  disabled = false,
  disabledLabel,
}: SelectionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        'group relative flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
        selected
          ? 'border-falcao-500/60 bg-falcao-950/30 shadow-[0_18px_50px_-30px_oklch(0.51_0.2_27/0.9)]'
          : 'border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]',
        disabled && 'cursor-not-allowed opacity-40 hover:border-white/[0.08] hover:bg-white/[0.02]',
      )}
    >
      {media}

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-white">{title}</p>
        {subtitle ? <p className="mt-0.5 truncate text-sm text-ink-400">{subtitle}</p> : null}
        {disabled && disabledLabel ? (
          <p className="mt-1 text-xs text-falcao-300">{disabledLabel}</p>
        ) : null}
      </div>

      {meta ? <div className="shrink-0 text-right">{meta}</div> : null}

      <span
        className={cn(
          'grid size-6 shrink-0 place-items-center rounded-full border transition-colors',
          selected
            ? 'border-falcao-500 bg-falcao-600 text-white'
            : 'border-white/15 text-transparent group-hover:border-white/30',
        )}
      >
        <Check className="size-3.5" />
      </span>
    </button>
  );
}
