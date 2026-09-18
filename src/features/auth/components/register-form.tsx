'use client';

import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { formatPhone } from '@/lib/utils/format';
import { registerAction } from '../actions';
import { initialActionState } from '../state';
import { SubmitButton } from './submit-button';

export function RegisterForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const [state, formAction] = useActionState(registerAction, initialActionState);
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (state.status === 'success') {
      router.push(redirectTo || state.message || '/conta');
      router.refresh();
    }
  }, [state, redirectTo, router]);

  return (
    <form action={formAction} className="space-y-5">
      <Field label="Nome completo" htmlFor="name" error={state.errors?.name}>
        <Input id="name" name="name" autoComplete="name" placeholder="Seu nome" required />
      </Field>

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

      <Field label="Telefone" htmlFor="phone" error={state.errors?.phone}>
        <Input
          id="phone"
          name="phone"
          inputMode="tel"
          autoComplete="tel"
          placeholder="(41) 99999-9999"
          value={phone}
          onChange={(event) => setPhone(formatPhone(event.target.value))}
          required
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Senha" htmlFor="password" error={state.errors?.password}>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            required
          />
        </Field>

        <Field
          label="Confirmar senha"
          htmlFor="confirmPassword"
          error={state.errors?.confirmPassword}
        >
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            required
          />
        </Field>
      </div>

      <label className="flex items-start gap-3 text-xs leading-relaxed text-ink-500">
        <input
          type="checkbox"
          name="marketingOptIn"
          className="mt-0.5 size-4 rounded border-white/20 bg-transparent accent-[oklch(0.51_0.2_27)]"
        />
        Quero receber novidades, promoções e lembretes da Barbearia Falcão.
      </label>

      {state.status === 'error' && state.message ? (
        <p
          role="alert"
          className="rounded-2xl border border-falcao-500/30 bg-falcao-950/40 px-4 py-3 text-sm text-falcao-200"
        >
          {state.message}
        </p>
      ) : null}

      <SubmitButton block size="lg">
        Criar minha conta
      </SubmitButton>
    </form>
  );
}
