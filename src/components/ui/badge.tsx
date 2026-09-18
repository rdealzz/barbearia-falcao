import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium tracking-wide',
  {
    variants: {
      variant: {
        default: 'border-white/10 bg-white/[0.06] text-ink-200',
        brand: 'border-falcao-500/30 bg-falcao-600/15 text-falcao-200',
        success: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300',
        warning: 'border-amber-500/25 bg-amber-500/10 text-amber-300',
        muted: 'border-white/5 bg-white/[0.03] text-ink-400',
        outline: 'border-white/20 bg-transparent text-ink-300',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
