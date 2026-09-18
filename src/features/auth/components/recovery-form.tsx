'use client';

import { useActionState } from 'react';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { requestPasswordRecoveryAction } from '../actions';
import { initialActionState } from '../state';
import { SubmitButton } from './submit-button';

export function RecoveryForm() {
  const [state, formAction] = useActionState(
    requestPasswordRecoveryAction,
    initialActionState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <Field label="E-mail" htmlFor="email" error={state.errors?.email}>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="voce@email.com"
          required
        />
      </Field>

      {state.status === 'success' ? (
        <p className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-200">
          {state.message}
        </p>
      ) : null}

      <SubmitButton block size="lg">
        Enviar instruções
      </SubmitButton>
    </form>
  );
}
