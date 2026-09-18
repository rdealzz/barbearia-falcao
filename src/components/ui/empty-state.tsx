import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-white/10 px-6 py-16 text-center',
        className,
      )}
    >
      <span className="flex size-14 items-center justify-center rounded-2xl bg-white/[0.04] text-ink-500">
        <Icon className="size-6" />
      </span>
      <div className="space-y-1">
        <p className="font-medium text-ink-200">{title}</p>
        {description ? <p className="text-sm text-ink-500">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
