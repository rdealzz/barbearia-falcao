import { cn } from '@/lib/utils/cn';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  label?: string;
}

export function Progress({ value, max = 100, className, label }: ProgressProps) {
  const percentage = max === 0 ? 0 : Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      className={cn('h-2 w-full overflow-hidden rounded-full bg-tint-strong', className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemax={max}
      aria-valuemin={0}
      aria-label={label}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-falcao-700 via-falcao-500 to-falcao-400 transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
