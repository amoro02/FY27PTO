import AppShell from '@/components/AppShell';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function CalendarPage() {
  const { session } = await requireAuth();
  const entries = await prisma.ptoEntry.findMany({ include: { user: true }, orderBy: { date: 'asc' }, take: 200 });
  const vsm = await prisma.vsmOutOfOffice.findMany({ orderBy: { date: 'asc' } });
  return <AppShell><h2>PTO Calendar</h2>
    <a href="/api/export/calendar">Export Calendar CSV</a> | <a href="/api/export/ot">Export OT CSV</a>
    {session.role === 'ADMIN' && <form method="post" action="/api/vsm" className="card">
      <h4>Add VSM PTO</h4><input type="date" name="date" required /><input name="note" placeholder="note"/><button>Add</button></form>}
    <table><thead><tr><th>Date</th><th>Supervisor</th><th>Hours</th><th>Type</th><th>Overlap Alert</th></tr></thead><tbody>
      {entries.map(e=><tr key={e.id}><td>{e.date.toISOString().slice(0,10)}</td><td>{e.user.name}</td><td>{e.hours}</td><td>{e.type}</td><td></td></tr>)}
      {vsm.map(v=><tr key={v.id}><td>{v.date.toISOString().slice(0,10)}</td><td>VSM</td><td>-</td><td>INFO</td><td>{v.note}</td></tr>)}
    </tbody></table>
  </AppShell>;
}
