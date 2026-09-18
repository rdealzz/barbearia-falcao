'use client';

import { Loader2 } from 'lucide-react';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { initialActionState } from '@/features/auth/state';
import { cancelSubscriptionAction, subscribeToPlanAction } from '../actions';

export function SubscribeButton({ planId, label = 'Assinar plano' }: { planId: string; label?: string }) {
  const [state, formAction, pending] = useActionState(subscribeToPlanAction, initialActionState);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="planId" value={planId} />
      <Button type="submit" block disabled={pending}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : null}
        {label}
      </Button>
      {state.message ? (
        <p
          role="status"
          className={`text-xs ${state.status === 'error' ? 'text-falcao-300' : 'text-emerald-300'}`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

export function CancelSubscriptionButton({ subscriptionId }: { subscriptionId: string }) {
  const [state, formAction, pending] = useActionState(cancelSubscriptionAction, initialActionState);

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="subscriptionId" value={subscriptionId} />
      <Button type="submit" variant="danger" size="sm" disabled={pending}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : null}
        Cancelar assinatura
      </Button>
      {state.message ? (
        <p
          role="status"
          className={`text-xs ${state.status === 'error' ? 'text-falcao-300' : 'text-ink-400'}`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
