import Image from 'next/image';
import { cn } from '@/lib/utils/cn';
import { brand } from '@/lib/data/media';
import { LogoMark } from './logo-mark';

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const markSizes = { sm: 'size-9', md: 'size-11', lg: 'size-16' } as const;
const markPixels = { sm: 36, md: 44, lg: 64 } as const;

/**
 * Marca da casa. Assim que o arquivo oficial for adicionado em
 * `brand.logoSrc`, ele substitui o brasão vetorial em todo o site.
 */
export function Logo({ className, showWordmark = true, size = 'md' }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      {brand.logoSrc ? (
        <Image
          src={brand.logoSrc}
          alt="Barbearia Falcão"
          width={markPixels[size]}
          height={markPixels[size]}
          className={cn(markSizes[size], 'object-contain')}
          priority
        />
      ) : (
        <LogoMark className={markSizes[size]} />
      )}

      {showWordmark ? (
        <span className="flex flex-col leading-none">
          <span className="font-display text-base font-semibold tracking-tight text-content">
            Barbearia Falcão
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-subtle">
            Cuts &amp; Shave
          </span>
        </span>
      ) : null}
    </span>
  );
}
