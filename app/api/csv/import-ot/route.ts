import { NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function POST(req: Request) {
  await requireAuth(true);
  const form = await req.formData();
  const file = form.get('file') as File;
  const text = await file.text();
  const rows = parse(text, { columns: true, skip_empty_lines: true });
  for (const r of rows) {
    const user = await prisma.user.findFirst({ where: { name: r.supervisor } });
    if (!user) continue;
    await prisma.otAssignment.upsert({ where: { date_shift_valueStream: { date: new Date(r.date), shift: r.shift, valueStream: r.valueStream } }, update: { assignedUserId: user.id, label: r.label }, create: { date: new Date(r.date), shift: r.shift, valueStream: r.valueStream, assignedUserId: user.id, label: r.label } });
  }
  return NextResponse.json({ ok: true });
}
