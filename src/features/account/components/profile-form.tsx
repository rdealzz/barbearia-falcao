'use client';

import { useActionState, useState } from 'react';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { SubmitButton } from '@/features/auth/components/submit-button';
import { updatePasswordAction, updateProfileAction } from '@/features/auth/actions';
import { initialActionState } from '@/features/auth/state';
import { formatDocument, formatPhone, formatZipCode } from '@/lib/utils/format';
import type { User } from '@/types';
import { AvatarPicker } from './avatar-picker';

export function ProfileForm({ user }: { user: User }) {
  const [state, formAction] = useActionState(updateProfileAction, initialActionState);
  const [phone, setPhone] = useState(user.phone);
  const [document, setDocument] = useState(user.document ?? '');
  const [zipCode, setZipCode] = useState(user.address?.zipCode ?? '');

  return (
    <form action={formAction} className="space-y-8">
      <AvatarPicker name={user.name} defaultValue={user.avatarUrl} />

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-subtle">
          Dados pessoais
        </legend>

        <Field label="Nome completo" htmlFor="name" error={state.errors?.name} className="sm:col-span-2">
          <Input id="name" name="name" defaultValue={user.name} required />
        </Field>

        <Field label="E-mail" htmlFor="email" error={state.errors?.email}>
          <Input id="email" name="email" type="email" defaultValue={user.email} required />
        </Field>

        <Field label="Telefone" htmlFor="phone" error={state.errors?.phone}>
          <Input
            id="phone"
            name="phone"
            inputMode="tel"
            value={phone}
            onChange={(event) => setPhone(formatPhone(event.target.value))}
            required
          />
        </Field>

        <Field label="Data de nascimento" htmlFor="birthDate">
          <Input id="birthDate" name="birthDate" type="date" defaultValue={user.birthDate ?? ''} />
        </Field>

        <Field label="CPF" htmlFor="document">
          <Input
            id="document"
            name="document"
            inputMode="numeric"
            placeholder="000.000.000-00"
            value={document}
            onChange={(event) => setDocument(formatDocument(event.target.value))}
          />
        </Field>
      </fieldset>

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-subtle">
          Endereço
        </legend>

        <Field label="CEP" htmlFor="zipCode">
          <Input
            id="zipCode"
            name="zipCode"
            inputMode="numeric"
            placeholder="00000-000"
            value={zipCode}
            onChange={(event) => setZipCode(formatZipCode(event.target.value))}
          />
        </Field>

        <Field label="Rua" htmlFor="street">
          <Input id="street" name="street" defaultValue={user.address?.street ?? ''} />
        </Field>

        <Field label="Número" htmlFor="number">
          <Input id="number" name="number" defaultValue={user.address?.number ?? ''} />
        </Field>

        <Field label="Complemento" htmlFor="complement">
          <Input id="complement" name="complement" defaultValue={user.address?.complement ?? ''} />
        </Field>

        <Field label="Bairro" htmlFor="district">
          <Input id="district" name="district" defaultValue={user.address?.district ?? ''} />
        </Field>

        <Field label="Cidade" htmlFor="city">
          <Input id="city" name="city" defaultValue={user.address?.city ?? ''} />
        </Field>

        <Field label="Estado" htmlFor="state">
          <Input id="state" name="state" maxLength={2} defaultValue={user.address?.state ?? ''} />
        </Field>
      </fieldset>

      {state.message ? (
        <p
          role="status"
          className={`rounded-2xl px-4 py-3 text-sm ${
            state.status === 'error'
              ? 'border border-falcao-500/30 bg-falcao-600/10 dark:bg-falcao-950/40 text-falcao-700 dark:text-falcao-200'
              : 'border border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200'
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <SubmitButton size="lg">Salvar alterações</SubmitButton>
    </form>
  );
}

export function PasswordForm() {
  const [state, formAction] = useActionState(updatePasswordAction, initialActionState);

  return (
    <form action={formAction} className="space-y-5">
      <Field label="Senha atual" htmlFor="currentPassword" error={state.errors?.currentPassword}>
        <Input id="currentPassword" name="currentPassword" type="password" required />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nova senha" htmlFor="newPassword" error={state.errors?.newPassword}>
          <Input id="newPassword" name="newPassword" type="password" required />
        </Field>

        <Field label="Confirmar nova senha" htmlFor="confirmPassword" error={state.errors?.confirmPassword}>
          <Input id="confirmPassword" name="confirmPassword" type="password" required />
        </Field>
      </div>

      {state.message ? (
        <p
          role="status"
          className={`text-sm ${state.status === 'error' ? 'text-falcao-700 dark:text-falcao-300' : 'text-emerald-700 dark:text-emerald-300'}`}
        >
          {state.message}
        </p>
      ) : null}

      <SubmitButton variant="outline">Alterar senha</SubmitButton>
    </form>
  );
}
