import { cn } from '@/lib/utils/cn';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-gradient-to-r from-ink-900 via-ink-850 to-ink-900 bg-[length:200%_100%]',
        className,
      )}
    />
  );
}
