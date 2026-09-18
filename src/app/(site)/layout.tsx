import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { WhatsAppButton } from '@/components/shared/whatsapp-button';
import { getCurrentUser } from '@/lib/auth/current-user';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader
        user={user ? { name: user.name, role: user.role, avatarUrl: user.avatarUrl } : null}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <WhatsAppButton />
    </div>
  );
}
