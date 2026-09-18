import { requireUser } from '@/lib/auth/current-user';
import { PasswordForm, ProfileForm } from '@/features/account/components/profile-form';
import { Separator } from '@/components/ui/separator';

export default async function ProfilePage() {
  const user = await requireUser();

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <header>
        <h1 className="font-display text-3xl text-content">Perfil</h1>
        <p className="mt-1 text-sm text-muted">
          Mantenha seus dados atualizados — eles aparecem para o barbeiro no dia do atendimento.
        </p>
      </header>

      <section className="surface-card rounded-3xl p-7">
        <ProfileForm user={user} />
      </section>

      <section className="surface-card rounded-3xl p-7">
        <h2 className="font-display text-xl text-content">Segurança</h2>
        <p className="mt-1 text-sm text-muted">Altere sua senha de acesso.</p>
        <Separator className="my-6" />
        <PasswordForm />
      </section>

      <section className="rounded-3xl border border-line p-7">
        <h2 className="font-medium text-content">Excluir conta</h2>
        <p className="mt-1 max-w-lg text-sm leading-relaxed text-muted">
          A exclusão definitiva da conta, com remoção do histórico de agendamentos, será liberada
          junto da integração de autenticação. Enquanto isso, fale com a equipe da barbearia.
        </p>
      </section>
    </div>
  );
}
