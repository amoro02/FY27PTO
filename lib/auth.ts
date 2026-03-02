import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { Role, UserStatus } from '@prisma/client';
import { prisma } from './prisma';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev_secret_change');

export type Session = { userId: string; role: Role; username: string };

export async function createSessionToken(payload: Session) {
  return new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('8h').sign(secret);
}

export async function getSession(): Promise<Session | null> {
  const token = cookies().get('session')?.value;
  if (!token) return null;
  try {
    const data = await jwtVerify(token, secret);
    return data.payload as Session;
  } catch {
    return null;
  }
}

export async function requireAuth(adminOnly = false) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  if (adminOnly && session.role !== Role.ADMIN) throw new Error('Forbidden');
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user || user.status !== UserStatus.ACTIVE) throw new Error('Unauthorized');
  return { session, user };
}
