import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    await requireAuth(true);
    const form = await req.formData();
    const action = String(form.get('action') || 'create');
    const id = String(form.get('id') || '');
    if (action === 'activate') await prisma.user.update({ where: { id }, data: { status: 'ACTIVE' } });
    else if (action === 'disable') await prisma.user.update({ where: { id }, data: { status: 'INACTIVE' } });
    else {
      const password = String(form.get('password') || '');
      await prisma.user.create({ data: {
        name: String(form.get('name')), username: String(form.get('username')), role: String(form.get('role')) as any,
        status: String(form.get('status')) as any, shift: String(form.get('shift')) as any, valueStream: String(form.get('valueStream')) as any,
        passwordHash: password ? await bcrypt.hash(password, 10) : null,
      }});
    }
    return NextResponse.redirect(new URL('/users', req.url));
  } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
}
