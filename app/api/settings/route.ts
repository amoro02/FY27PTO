import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    await requireAuth(true);
    const form = await req.formData();
    const userId = String(form.get('userId') || '');
    if (userId) {
      await prisma.user.update({ where: { id: userId }, data: {
        carryoverHours: Number(form.get('carryoverHours') || 0),
        adjustmentHours: Number(form.get('adjustmentHours') || 0),
        compTimeBalance: Number(form.get('compTimeBalance') || 0),
      }});
    } else {
      await prisma.settings.upsert({ where: { id: 'singleton' }, update: {
        fiscalYearStartMonth: Number(form.get('fiscalYearStartMonth') || 4),
        fiscalYearStartDay: Number(form.get('fiscalYearStartDay') || 1),
        defaultGrantedHours: Number(form.get('defaultGrantedHours') || 160),
      }, create: { id: 'singleton', fiscalYearStartMonth: 4, fiscalYearStartDay: 1, defaultGrantedHours: 160 } });
    }
    return NextResponse.redirect(new URL('/settings', req.url));
  } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
}
