'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { loginAction } from '../actions';
import { initialActionState } from '../state';
import { SubmitButton } from './submit-button';

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const [state, formAction] = useActionState(loginAction, initialActionState);

  useEffect(() => {
    if (state.status === 'success') {
      router.push(redirectTo || state.message || '/conta');
      router.refresh();
    }
  }, [state, redirectTo, router]);

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

      <Field label="Senha" htmlFor="password" error={state.errors?.password}>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
        />
      </Field>

      <div className="flex justify-end">
        <Link
          href="/recuperar-senha"
          className="text-xs text-ink-500 transition-colors hover:text-white"
        >
          Esqueceu sua senha?
        </Link>
      </div>

      {state.status === 'error' && state.message ? (
        <p
          role="alert"
          className="rounded-2xl border border-falcao-500/30 bg-falcao-950/40 px-4 py-3 text-sm text-falcao-200"
        >
          {state.message}
        </p>
      ) : null}

      <SubmitButton block size="lg">
        Entrar
      </SubmitButton>
    </form>
  );
}
