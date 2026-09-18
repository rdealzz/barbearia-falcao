import type { LabelHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn('text-xs font-medium uppercase tracking-[0.12em] text-ink-500', className)}
      {...props}
    />
  );
}

interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}

export function Field({ label, htmlFor, error, hint, children, className }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? (
        <p className="text-xs text-falcao-300" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-ink-600">{hint}</p>
      ) : null}
    </div>
  );
}
