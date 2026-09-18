'use client';

import { Check, Copy, Loader2, Lock, Ticket } from 'lucide-react';
import { useActionState, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { initialActionState } from '@/features/auth/state';
import { redeemCouponAction } from '../actions';
import { formatCurrency } from '@/lib/utils/format';
import type { ClubCoupon, PlanTier } from '@/types';

const tierOrder: Record<PlanTier, number> = { bronze: 1, silver: 2, gold: 3, vip: 4 };

interface CouponListProps {
  coupons: ClubCoupon[];
  currentTier: PlanTier | null;
}

export function CouponList({ coupons, currentTier }: CouponListProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {coupons.map((coupon) => (
        <CouponCard key={coupon.id} coupon={coupon} currentTier={currentTier} />
      ))}
    </section>
  );
}

function CouponCard({ coupon, currentTier }: { coupon: ClubCoupon; currentTier: PlanTier | null }) {
  const [state, formAction, pending] = useActionState(redeemCouponAction, initialActionState);
  const [copied, setCopied] = useState(false);

  const locked =
    coupon.requiredTier !== null &&
    (currentTier === null || tierOrder[currentTier] < tierOrder[coupon.requiredTier]);

  const code = state.status === 'success' ? state.message : coupon.code;

  const copy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Área de transferência indisponível: o código segue visível na tela.
    }
  };

  return (
    <article className="surface-card flex flex-col gap-4 rounded-3xl p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="grid size-10 place-items-center rounded-2xl border border-line bg-tint text-falcao-400">
          <Ticket className="size-4" />
        </span>
        <Badge variant={locked ? 'muted' : 'brand'}>
          {coupon.discountType === 'percentage'
            ? `${coupon.discountValue}% off`
            : `${formatCurrency(coupon.discountValue)} off`}
        </Badge>
      </div>

      <div>
        <h3 className="font-medium text-content">{coupon.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">{coupon.description}</p>
      </div>

      <p className="text-xs text-subtle">
        Válido por {coupon.expiresInHours}h após o resgate · {coupon.usageLimit} uso
        {coupon.usageLimit > 1 ? 's' : ''}
      </p>

      <div className="mt-auto">
        {locked ? (
          <p className="flex items-center gap-2 rounded-2xl bg-tint px-4 py-3 text-xs text-muted">
            <Lock className="size-3.5" />
            Exclusivo para assinantes do plano {coupon.requiredTier?.toUpperCase()}
          </p>
        ) : code ? (
          <button
            type="button"
            onClick={copy}
            className="flex w-full items-center justify-between gap-3 rounded-2xl border border-dashed border-falcao-500/40 bg-falcao-600/8 dark:bg-falcao-950/30 px-4 py-3 text-sm text-falcao-800 dark:text-falcao-100 transition-colors hover:border-falcao-500/70"
          >
            <span className="font-mono tracking-widest">{code}</span>
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          </button>
        ) : (
          <form action={formAction}>
            <input type="hidden" name="couponId" value={coupon.id} />
            <Button type="submit" variant="outline" block disabled={pending}>
              {pending ? <Loader2 className="size-4 animate-spin" /> : null}
              Resgatar cupom
            </Button>
          </form>
        )}

        {state.status === 'error' && state.message ? (
          <p role="alert" className="mt-2 text-xs text-falcao-700 dark:text-falcao-300">
            {state.message}
          </p>
        ) : null}
      </div>
    </article>
  );
}
