'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowUpRight, Clock } from 'lucide-react';
import { formatCurrency, formatDuration } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import type { Service, ServiceCategory } from '@/types';

const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  cabelo: 'Cabelo',
  barba: 'Barba',
  combo: 'Combos',
  estetica: 'Estética',
  infantil: 'Infantil',
};

const ORDER: ServiceCategory[] = ['combo', 'cabelo', 'barba', 'estetica', 'infantil'];

/**
 * Lista densa de serviços: tudo cabe em poucas rolagens, com filtro por
 * categoria em vez de seções empilhadas.
 */
export function ServicesBoard({ services }: { services: Service[] }) {
  const [active, setActive] = useState<ServiceCategory | 'all'>('all');

  const categories = useMemo(
    () => ORDER.filter((category) => services.some((service) => service.category === category)),
    [services],
  );

  const visible = useMemo(() => {
    const filtered = active === 'all' ? services : services.filter((s) => s.category === active);
    return [...filtered].sort(
      (a, b) =>
        ORDER.indexOf(a.category) - ORDER.indexOf(b.category) ||
        Number(b.isFeatured) - Number(a.isFeatured) ||
        a.priceInCents - b.priceInCents,
    );
  }, [services, active]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filtrar por categoria">
        <FilterChip active={active === 'all'} onClick={() => setActive('all')}>
          Todos
          <span className="ml-1.5 text-xs opacity-60">{services.length}</span>
        </FilterChip>
        {categories.map((category) => (
          <FilterChip
            key={category}
            active={active === category}
            onClick={() => setActive(category)}
          >
            {CATEGORY_LABELS[category]}
            <span className="ml-1.5 text-xs opacity-60">
              {services.filter((service) => service.category === category).length}
            </span>
          </FilterChip>
        ))}
      </div>

      <ul className="grid gap-2 lg:grid-cols-2">
        {visible.map((service) => (
          <li key={service.id}>
            <Link
              href={`/agendar?servico=${service.slug}`}
              className="group surface-card flex items-center gap-4 rounded-2xl px-4 py-3 transition-all duration-300 hover:border-line-strong hover:bg-tint"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-base text-content">{service.name}</h3>
                  {service.isFeatured ? (
                    <span className="rounded-full border border-falcao-600/25 bg-falcao-600/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-falcao-700 dark:text-falcao-200">
                      destaque
                    </span>
                  ) : null}
                </div>
                <p className="mt-0.5 truncate text-sm text-muted">{service.shortDescription}</p>
              </div>

              <div className="shrink-0 text-right">
                <p className="font-display text-lg leading-tight text-content">
                  {formatCurrency(service.priceInCents)}
                </p>
                <p className="flex items-center justify-end gap-1 text-xs text-subtle">
                  <Clock className="size-3" />
                  {formatDuration(service.durationInMinutes)}
                </p>
              </div>

              <ArrowUpRight className="size-4 shrink-0 text-subtle transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-falcao-500" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'rounded-full border px-4 py-1.5 text-sm transition-colors',
        active
          ? 'border-falcao-500/50 bg-falcao-600/10 text-content'
          : 'border-line text-muted hover:border-line-strong hover:text-content',
      )}
    >
      {children}
    </button>
  );
}
