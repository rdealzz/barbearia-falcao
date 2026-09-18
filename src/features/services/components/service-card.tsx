import Link from 'next/link';
import { ArrowUpRight, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDuration } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import type { Service } from '@/types';

interface ServiceCardProps {
  service: Service;
  className?: string;
  compact?: boolean;
}

export function ServiceCard({ service, className, compact = false }: ServiceCardProps) {
  return (
    <article
      className={cn(
        'group surface-card relative flex h-full flex-col gap-5 rounded-3xl p-6 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-line-strong',
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-falcao-500/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      />

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h3 className="font-display text-xl text-content">{service.name}</h3>
          <p className="text-sm leading-relaxed text-muted">
            {compact ? service.shortDescription : service.description}
          </p>
        </div>
        {service.isFeatured ? <Badge variant="brand">Destaque</Badge> : null}
      </div>

      {!compact ? (
        <ul className="flex flex-wrap gap-2">
          {service.highlights.map((highlight) => (
            <li
              key={highlight}
              className="rounded-full border border-line bg-tint px-3 py-1 text-xs text-muted"
            >
              {highlight}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-auto flex items-end justify-between gap-4 border-t border-line pt-5">
        <div>
          <p className="font-display text-2xl text-content">
            {formatCurrency(service.priceInCents)}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
            <Clock className="size-3.5" />
            {formatDuration(service.durationInMinutes)}
          </p>
        </div>

        <Button asChild variant="outline" size="sm">
          <Link href={`/agendar?servico=${service.slug}`}>
            Agendar
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </Button>
      </div>
    </article>
  );
}
