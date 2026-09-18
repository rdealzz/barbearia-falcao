import Image from 'next/image';
import { cn } from '@/lib/utils/cn';
import { initials } from '@/lib/utils/format';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  ring?: boolean;
}

const sizes = {
  sm: 'size-9 text-xs',
  md: 'size-12 text-sm',
  lg: 'size-16 text-base',
  xl: 'size-24 text-xl',
} as const;

const pixels = { sm: 36, md: 48, lg: 64, xl: 96 } as const;

export function Avatar({ name, src, size = 'md', className, ring = false }: AvatarProps) {
  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-tint-strong font-semibold text-muted select-none',
        sizes[size],
        ring && 'ring-2 ring-falcao-600/40 ring-offset-2 ring-offset-canvas',
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={name}
          width={pixels[size]}
          height={pixels[size]}
          className="size-full object-cover"
        />
      ) : (
        initials(name)
      )}
    </span>
  );
}
