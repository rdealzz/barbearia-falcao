'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface StepIndicatorProps {
  steps: string[];
  current: number;
  onSelect?: (index: number) => void;
}

export function StepIndicator({ steps, current, onSelect }: StepIndicatorProps) {
  return (
    <ol className="flex items-center gap-2 overflow-x-auto pb-1" aria-label="Etapas do agendamento">
      {steps.map((step, index) => {
        const done = index < current;
        const active = index === current;

        return (
          <li key={step} className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              disabled={!done || !onSelect}
              onClick={() => onSelect?.(index)}
              className={cn(
                'flex items-center gap-2 rounded-full px-3 py-1.5 text-xs transition-colors',
                active && 'bg-white/[0.07] text-white',
                done && 'text-falcao-300 hover:bg-white/[0.04]',
                !done && !active && 'text-ink-600',
              )}
            >
              <span
                className={cn(
                  'grid size-5 place-items-center rounded-full text-[10px] font-semibold',
                  active && 'bg-falcao-600 text-white',
                  done && 'bg-falcao-600/20 text-falcao-300',
                  !done && !active && 'bg-white/[0.05] text-ink-600',
                )}
              >
                {done ? <Check className="size-3" /> : index + 1}
              </span>
              <span className="whitespace-nowrap">{step}</span>
            </button>
            {index < steps.length - 1 ? (
              <span className="relative h-px w-6 bg-white/10">
                {done ? (
                  <motion.span
                    layoutId={`step-line-${index}`}
                    className="absolute inset-0 bg-falcao-500/60"
                  />
                ) : null}
              </span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
