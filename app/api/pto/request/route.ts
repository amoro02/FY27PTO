import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { eachDate } from '@/lib/utils';
import { requireAuth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { user } = await requireAuth();
    if (user.status !== 'ACTIVE') throw new Error('Pending cannot request');
    const form = await req.formData();
    const startDate = new Date(String(form.get('startDate')));
    const endDate = new Date(String(form.get('endDate')));
    const hoursPerDay = Number(form.get('hoursPerDay'));
    const type = String(form.get('type')) as 'PTO' | 'COMP_TIME';
    const notes = String(form.get('notes') || '');

    const overlap = await prisma.ptoRequest.findFirst({
      where: { userId: user.id, status: { in: ['PENDING', 'APPROVED'] }, startDate: { lte: endDate }, endDate: { gte: startDate } },
    });
    if (overlap) return NextResponse.json({ error: 'Duplicate overlapping entry' }, { status: 400 });

    const days = eachDate(startDate, endDate);
    const conflict = await prisma.otAssignment.findFirst({ where: { assignedUserId: user.id, date: { in: days } } });

    await prisma.ptoRequest.create({ data: { userId: user.id, startDate, endDate, hoursPerDay, type, notes, status: 'PENDING' } });
    return NextResponse.redirect(new URL(`/request-pto?warning=${conflict ? 'ot_conflict' : ''}`, req.url));
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
