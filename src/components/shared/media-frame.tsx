'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface MediaFrameProps {
  src?: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
  fallbackLabel?: string;
}

/**
 * Moldura de imagem com degradê de apoio: se a foto ainda não foi enviada
 * ou falhar ao carregar, o bloco continua elegante em vez de quebrar.
 */
export function MediaFrame({
  src,
  alt,
  className,
  imageClassName,
  priority = false,
  sizes = '(max-width: 768px) 100vw, 50vw',
  fallbackLabel,
}: MediaFrameProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <div
      className={cn(
        'relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-canvas-subtle via-surface to-canvas',
        className,
      )}
    >
      {showImage ? (
        <Image
          src={src!}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          onError={() => setFailed(true)}
          className={cn('object-cover', imageClassName)}
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          <span
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'radial-gradient(120% 80% at 20% 0%, oklch(0.36 0.13 27 / 0.35), transparent 60%)',
            }}
            aria-hidden
          />
          <span className="relative px-4 text-center text-xs uppercase tracking-[0.3em] text-subtle">
            {fallbackLabel ?? 'Barbearia Falcão'}
          </span>
        </div>
      )}
    </div>
  );
}
