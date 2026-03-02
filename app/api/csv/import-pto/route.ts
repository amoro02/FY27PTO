import { NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function POST(req: Request) {
  await requireAuth(true);
  const form = await req.formData();
  const file = form.get('file') as File;
  const rows = parse(await file.text(), { columns: true, skip_empty_lines: true });
  for (const r of rows) {
    const user = await prisma.user.findFirst({ where: { name: r.supervisor } });
    if (!user) continue;
    await prisma.ptoEntry.upsert({ where: { userId_date_type: { userId: user.id, date: new Date(r.date), type: r.type } }, update: { hours: Number(r.hours) }, create: { userId: user.id, date: new Date(r.date), hours: Number(r.hours), type: r.type } });
  }
  return NextResponse.json({ ok: true });
}
