import { prisma } from '@/lib/prisma';

export async function GET() {
  const rows = await prisma.ptoEntry.findMany({ include: { user: true }, orderBy: { date: 'asc' } });
  const csv = ['date,supervisor,hours,type'].concat(rows.map(r => `${r.date.toISOString().slice(0,10)},${r.user.name},${r.hours},${r.type}`)).join('\n');
  return new Response(csv, { headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="calendar.csv"' } });
}
