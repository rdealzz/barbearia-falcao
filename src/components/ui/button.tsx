import { Slot } from '@/components/ui/slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';
import type { ButtonHTMLAttributes } from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary:
          'bg-falcao-600 text-white shadow-[0_10px_30px_-12px_oklch(0.51_0.2_27/0.9)] hover:bg-falcao-500 hover:shadow-[0_16px_40px_-14px_oklch(0.575_0.215_27/0.95)]',
        light:
          'bg-white text-ink-950 hover:bg-ink-100 shadow-[0_10px_30px_-16px_rgba(255,255,255,0.6)]',
        outline:
          'border border-white/15 bg-white/[0.03] text-ink-100 hover:border-white/30 hover:bg-white/[0.07]',
        ghost: 'text-ink-300 hover:bg-white/[0.06] hover:text-white',
        danger: 'bg-falcao-700/20 text-falcao-200 hover:bg-falcao-700/30',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-sm',
        lg: 'h-13 px-8 text-base',
        icon: 'size-10',
      },
      block: { true: 'w-full', false: '' },
    },
    defaultVariants: { variant: 'primary', size: 'md', block: false },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  block,
  asChild = false,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : 'button';
  return (
    <Component
      className={cn(buttonVariants({ variant, size, block }), className)}
      {...props}
    />
  );
}

export { buttonVariants };
