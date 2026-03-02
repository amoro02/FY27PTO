import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { createSessionToken } from '@/lib/auth';
import { UserStatus } from '@prisma/client';

export async function POST(req: Request) {
  const form = await req.formData();
  const username = String(form.get('username') || '');
  const password = String(form.get('password') || '');
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || user.status !== UserStatus.ACTIVE || !user.passwordHash) return NextResponse.redirect(new URL('/login', req.url));
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return NextResponse.redirect(new URL('/login', req.url));
  const token = await createSessionToken({ userId: user.id, role: user.role, username: user.username });
  const res = NextResponse.redirect(new URL('/', req.url));
  res.cookies.set('session', token, { httpOnly: true, sameSite: 'lax', secure: false, path: '/' });
  return res;
}
