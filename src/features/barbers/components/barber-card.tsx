import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import { InstagramIcon } from '@/components/shared/icons';
import { Badge } from '@/components/ui/badge';
import { MediaFrame } from '@/components/shared/media-frame';
import { cn } from '@/lib/utils/cn';
import type { Barber } from '@/types';

interface BarberCardProps {
  barber: Barber;
  className?: string;
}

export function BarberCard({ barber, className }: BarberCardProps) {
  return (
    <article
      className={cn(
        'group surface-card relative flex h-full flex-col overflow-hidden rounded-3xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-line-strong',
        className,
      )}
    >
      <Link href={`/barbeiros/${barber.slug}`} className="relative block">
        <MediaFrame
          src={barber.avatarUrl || undefined}
          alt={barber.name}
          fallbackLabel={barber.name}
          className="aspect-[4/5] w-full rounded-none"
          imageClassName="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[#F2E4C9]/80">{barber.role}</p>
          <h3 className="mt-1 font-display text-2xl text-[#F2E4C9]">{barber.name}</h3>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <p className="text-sm leading-relaxed text-muted">{barber.headline}</p>

        <ul className="flex flex-wrap gap-2">
          {barber.specialties.slice(0, 3).map((specialty) => (
            <li key={specialty}>
              <Badge variant="muted">{specialty}</Badge>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center justify-between border-t border-line pt-4">
          {barber.reviewsCount > 0 ? (
            <span className="flex items-center gap-1.5 text-sm text-muted">
              <Star className="size-4 fill-falcao-400 text-falcao-400" />
              {barber.rating.toFixed(1)}
              <span className="text-xs text-subtle">({barber.reviewsCount})</span>
            </span>
          ) : (
            <span className="text-xs text-subtle">
              Desde {barber.experienceSince}
            </span>
          )}

          <div className="flex items-center gap-3">
            {barber.instagramUrl ? (
              <a
                href={barber.instagramUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Instagram de ${barber.name}`}
                className="text-muted transition-colors hover:text-content"
              >
                <InstagramIcon className="size-4" />
              </a>
            ) : null}
            <Link
              href={`/agendar?barbeiro=${barber.slug}`}
              className="inline-flex items-center gap-1 text-sm text-falcao-700 dark:text-falcao-300 transition-colors hover:text-falcao-700 dark:text-falcao-200"
            >
              Agendar
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
