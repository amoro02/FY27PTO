import { prisma } from '@/lib/prisma';

export async function GET() {
  const rows = await prisma.otAssignment.findMany({ include: { assignedUser: true }, orderBy: { date: 'asc' } });
  const csv = ['date,shift,valueStream,supervisor,label'].concat(rows.map(r => `${r.date.toISOString().slice(0,10)},${r.shift},${r.valueStream},${r.assignedUser.name},${r.label || ''}`)).join('\n');
  return new Response(csv, { headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="ot-rotation.csv"' } });
}
