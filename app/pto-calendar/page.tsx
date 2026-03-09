import AppShell from '@/components/AppShell';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function CalendarPage() {
  const { session } = await requireAuth();
  const entries = await prisma.ptoEntry.findMany({ include: { user: true }, orderBy: { date: 'asc' }, take: 200 });
  const vsm = await prisma.vsmOutOfOffice.findMany({ orderBy: { date: 'asc' } });
  return (
    <AppShell>
      <div className="page-header">
        <h2>PTO Calendar</h2>
        <p>Aggregated view of approved time off</p>
      </div>
      <div className="toolbar">
        <a href="/api/export/calendar" className="btn btn-ghost btn-sm">&#8595; Export Calendar CSV</a>
        <a href="/api/export/ot" className="btn btn-ghost btn-sm">&#8595; Export OT CSV</a>
      </div>
      {session.role === 'ADMIN' && (
        <form method="post" action="/api/vsm" className="card" style={{ maxWidth: 440 }}>
          <h3>Add VSM Out-of-Office</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="vsm-date">Date</label>
              <input id="vsm-date" type="date" name="date" required />
            </div>
            <div className="form-group">
              <label htmlFor="vsm-note">Note</label>
              <input id="vsm-note" name="note" placeholder="Optional note" />
            </div>
          </div>
          <button type="submit">Add VSM Entry</button>
        </form>
      )}
      <table>
        <thead>
          <tr><th>Date</th><th>Supervisor</th><th>Hours</th><th>Type</th><th>Note</th></tr>
        </thead>
        <tbody>
          {entries.map(e => (
            <tr key={e.id}>
              <td>{e.date.toISOString().slice(0,10)}</td>
              <td>{e.user.name}</td>
              <td>{e.hours}</td>
              <td><span className={`badge badge-${e.type === 'PTO' ? 'pto' : 'comp'}`}>{e.type}</span></td>
              <td></td>
            </tr>
          ))}
          {vsm.map(v => (
            <tr key={v.id}>
              <td>{v.date.toISOString().slice(0,10)}</td>
              <td>VSM</td>
              <td>—</td>
              <td><span className="badge badge-info">INFO</span></td>
              <td>{v.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AppShell>
  );
}
