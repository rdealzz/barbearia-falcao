import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium tracking-wide',
  {
    variants: {
      variant: {
        default: 'border-line bg-tint-strong text-content',
        brand:
          'border-falcao-600/25 bg-falcao-600/10 text-falcao-700 dark:border-falcao-500/30 dark:bg-falcao-600/20 dark:text-falcao-200',
        success:
          'border-emerald-600/25 bg-emerald-600/10 text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300',
        warning:
          'border-amber-600/30 bg-amber-500/10 text-amber-700 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-300',
        muted: 'border-line bg-tint text-muted',
        outline: 'border-line-strong bg-transparent text-muted',
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
