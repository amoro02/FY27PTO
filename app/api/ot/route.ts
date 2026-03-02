import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    await requireAuth(true);
    const form = await req.formData();
    const date = new Date(String(form.get('date')));
    const shift = String(form.get('shift')) as any;
    const valueStream = String(form.get('valueStream')) as any;
    const assignedUserId = String(form.get('assignedUserId'));
    const label = String(form.get('label') || '');
    const ptoConflict = await prisma.ptoEntry.findFirst({ where: { userId: assignedUserId, date } });
    await prisma.otAssignment.upsert({
      where: { date_shift_valueStream: { date, shift, valueStream } },
      update: { assignedUserId, label },
      create: { date, shift, valueStream, assignedUserId, label },
    });
    return NextResponse.redirect(new URL(`/ot-rotation?warning=${ptoConflict ? 'pto_conflict' : ''}`, req.url));
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
