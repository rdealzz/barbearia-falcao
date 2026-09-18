import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface StatTileProps {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  className?: string;
}

export function StatTile({ icon: Icon, label, value, hint, className }: StatTileProps) {
  return (
    <div className={cn('surface-card rounded-3xl p-6', className)}>
      <span className="grid size-10 place-items-center rounded-2xl border border-line bg-tint text-falcao-400">
        <Icon className="size-4" />
      </span>
      <p className="mt-5 font-display text-3xl text-content">{value}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
      {hint ? <p className="mt-2 text-xs text-subtle">{hint}</p> : null}
    </div>
  );
}
