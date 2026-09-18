import Link from 'next/link';
import type { ReactNode } from 'react';
import { Logo } from '@/components/shared/logo';

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <div className="w-full max-w-md">
      <Link href="/" className="mb-10 inline-block">
        <Logo />
      </Link>

      <h1 className="font-display text-3xl text-content">{title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>

      <div className="mt-8">{children}</div>

      {footer ? <div className="mt-8 text-sm text-muted">{footer}</div> : null}
    </div>
  );
}
