'use client';

import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

const fieldStyles =
  'w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-ink-100 placeholder:text-ink-600 transition-all duration-200 focus:border-falcao-500/60 focus:bg-white/[0.05] focus:outline-none focus:ring-4 focus:ring-falcao-600/15 disabled:opacity-50';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cn(fieldStyles, 'h-12', className)} {...props} />;
  },
);

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea ref={ref} className={cn(fieldStyles, 'min-h-28 py-3 resize-none', className)} {...props} />
  );
});

export { fieldStyles };
