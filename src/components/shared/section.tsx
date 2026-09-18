import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { Reveal } from './reveal';

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10', className)}>
      {children}
    </div>
  );
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        'flex flex-col gap-4',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      {eyebrow ? (
        <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.24em] text-falcao-400">
          <span className="h-px w-8 bg-falcao-500/60" />
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-balance text-3xl font-semibold text-content sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
        {title}
      </h2>
      {description ? (
        <p className={cn('max-w-2xl text-base leading-relaxed text-muted', align === 'center' && 'mx-auto')}>
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}

type SectionSpacing = 'default' | 'tight' | 'page' | 'pageTight' | 'continues' | 'none';

const spacingClasses: Record<SectionSpacing, string> = {
  /** Bloco isolado dentro da página. */
  default: 'py-20 sm:py-28',
  /** Blocos encadeados que compartilham um mesmo assunto. */
  tight: 'py-8 sm:py-12',
  /** Primeiro bloco de uma página interna, abaixo do cabeçalho fixo. */
  page: 'pt-32 pb-20 sm:pt-40 sm:pb-24',
  /** Primeiro bloco quando o conteúdo continua logo abaixo. */
  pageTight: 'pt-32 pb-8 sm:pt-40 sm:pb-10',
  /** Continuação direta do bloco anterior. */
  continues: 'pb-20 sm:pb-28',
  none: '',
};

export function Section({
  children,
  className,
  id,
  spacing = 'default',
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  spacing?: SectionSpacing;
}) {
  return (
    <section id={id} className={cn(spacingClasses[spacing], className)}>
      {children}
    </section>
  );
}
