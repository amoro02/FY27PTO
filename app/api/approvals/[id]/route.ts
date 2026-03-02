import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { eachDate } from '@/lib/utils';
import { requireAuth } from '@/lib/auth';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { user } = await requireAuth(true);
    const form = await req.formData();
    if (String(form.get('adminPasscode')) !== (process.env.ADMIN_PASSCODE || '2468')) return NextResponse.json({ error: 'Invalid passcode' }, { status: 403 });
    const decision = String(form.get('decision')) as 'APPROVED' | 'DENIED';
    const reason = String(form.get('reason') || '');
    const request = await prisma.ptoRequest.findUnique({ where: { id: params.id } });
    if (!request || request.status !== 'PENDING') return NextResponse.json({ error: 'Not found' }, { status: 404 });

    await prisma.$transaction(async (tx) => {
      await tx.ptoRequest.update({ where: { id: params.id }, data: { status: decision } });
      await tx.ptoDecision.create({ data: { requestId: params.id, decidedByUserId: user.id, decision, reason } });
      if (decision === 'APPROVED') {
        const dates = eachDate(request.startDate, request.endDate);
        for (const date of dates) {
          await tx.ptoEntry.upsert({
            where: { userId_date_type: { userId: request.userId, date, type: request.type } },
            update: { hours: request.hoursPerDay },
            create: { userId: request.userId, date, hours: request.hoursPerDay, type: request.type, sourceRequestId: request.id },
          });
        }
      }
    });

    return NextResponse.redirect(new URL('/approvals', req.url));
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
