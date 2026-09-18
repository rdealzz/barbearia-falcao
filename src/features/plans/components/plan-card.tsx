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
          ? 'border-2 border-falcao-500/50 bg-surface shadow-[0_30px_80px_-40px_oklch(0.51_0.2_27/0.55)]'
          : 'surface-card hover:border-line-strong',
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
        <h3 className="font-display text-xl text-content">{plan.name}</h3>
        <p className="text-sm text-muted">{plan.tagline}</p>
      </div>

      <div>
        <div className="flex items-end gap-1">
          <span className="font-display text-4xl text-content">
            {formatCurrency(plan.priceInCents)}
          </span>
          <span className="pb-1.5 text-sm text-muted">/mês</span>
        </div>
        <p className="mt-1 text-xs text-subtle">Vigência indeterminada · cancele quando quiser</p>
        {plan.seatsAvailable !== null ? (
          <p className="mt-2 text-xs font-medium text-falcao-700 dark:text-falcao-300">
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
              benefit.included ? 'text-content' : 'text-subtle',
            )}
          >
            <span
              className={cn(
                'mt-0.5 grid size-5 shrink-0 place-items-center rounded-full',
                benefit.included ? 'bg-falcao-600/20 text-falcao-700 dark:text-falcao-300' : 'bg-tint text-subtle',
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
