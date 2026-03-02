import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    await requireAuth(true);
    const form = await req.formData();
    await prisma.vsmOutOfOffice.create({ data: { date: new Date(String(form.get('date'))), note: String(form.get('note') || '') } });
    return NextResponse.redirect(new URL('/pto-calendar', req.url));
  } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
}
