import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { env } from '@/lib/config/env';
import type { Session, UserRole } from '@/types';

const COOKIE_NAME = 'falcao_session';
const MAX_AGE_IN_SECONDS = 60 * 60 * 24 * 30;

function sign(payload: string): string {
  return createHmac('sha256', env.SESSION_SECRET).update(payload).digest('base64url');
}

function safeEqual(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  return bufferA.length === bufferB.length && timingSafeEqual(bufferA, bufferB);
}

function encode(session: Session): string {
  const payload = Buffer.from(JSON.stringify(session)).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

function decode(token: string): Session | null {
  const [payload, signature] = token.split('.');
  if (!payload || !signature || !safeEqual(sign(payload), signature)) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString()) as Session;
    return session.expiresAt > Date.now() ? session : null;
  } catch {
    return null;
  }
}

export async function createSession(userId: string, role: UserRole): Promise<void> {
  const session: Session = {
    userId,
    role,
    expiresAt: Date.now() + MAX_AGE_IN_SECONDS * 1000,
  };

  const jar = await cookies();
  jar.set(COOKIE_NAME, encode(session), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE_IN_SECONDS,
  });
}

export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  return token ? decode(token) : null;
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}
