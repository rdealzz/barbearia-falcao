import Link from 'next/link';
import { Check, Crown, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import type { Plan } from '@/types';

interface PlanCardProps {
  plan: Plan;
  className?: string;
  ctaHref?: string;
  ctaLabel?: string;
}

export function PlanCard({
  plan,
  className,
  ctaHref = `/planos/${plan.slug}`,
  ctaLabel = 'Assinar plano',
}: PlanCardProps) {
  return (
    <article
      className={cn(
        'group relative flex h-full flex-col gap-6 rounded-3xl p-7 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1',
        plan.isPopular
          ? 'border border-falcao-500/40 bg-gradient-to-b from-falcao-950/40 to-ink-900 shadow-[0_30px_80px_-40px_oklch(0.51_0.2_27/0.8)]'
          : 'surface-card hover:border-white/20',
        className,
      )}
    >
      {plan.isPopular ? (
        <span className="absolute -top-3 left-7">
          <Badge variant="brand" className="border-falcao-500/50 bg-falcao-600 text-white">
            <Crown className="size-3" />
            Mais vendido
          </Badge>
        </span>
      ) : null}

      <div className="space-y-2">
        <h3 className="font-display text-xl text-white">{plan.name}</h3>
        <p className="text-sm text-ink-400">{plan.tagline}</p>
      </div>

      <div>
        <div className="flex items-end gap-1">
          <span className="font-display text-4xl text-white">
            {formatCurrency(plan.priceInCents)}
          </span>
          <span className="pb-1.5 text-sm text-ink-500">/mês</span>
        </div>
        <p className="mt-1 text-xs text-ink-600">Vigência indeterminada · cancele quando quiser</p>
        {plan.seatsAvailable !== null ? (
          <p className="mt-2 text-xs font-medium text-falcao-300">
            Resta{plan.seatsAvailable === 1 ? '' : 'm'} {plan.seatsAvailable} vaga
            {plan.seatsAvailable === 1 ? '' : 's'} para esse plano
          </p>
        ) : null}
      </div>

      <ul className="flex flex-1 flex-col gap-3">
        {plan.benefits.map((benefit) => (
          <li
            key={benefit.label}
            className={cn(
              'flex items-start gap-3 text-sm',
              benefit.included ? 'text-ink-200' : 'text-ink-600',
            )}
          >
            <span
              className={cn(
                'mt-0.5 grid size-5 shrink-0 place-items-center rounded-full',
                benefit.included ? 'bg-falcao-600/20 text-falcao-300' : 'bg-white/[0.04] text-ink-600',
              )}
            >
              {benefit.included ? <Check className="size-3" /> : <Minus className="size-3" />}
            </span>
            {benefit.label}
          </li>
        ))}
      </ul>

      <Button asChild variant={plan.isPopular ? 'primary' : 'outline'} block>
        <Link href={ctaHref}>{ctaLabel}</Link>
      </Button>
    </article>
  );
}
