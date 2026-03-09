import AppShell from '@/components/AppShell';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function OtPage() {
  const { session } = await requireAuth();
  const users = await prisma.user.findMany({ where: { role: 'SUPERVISOR' }, orderBy: { name: 'asc' } });
  const assignments = await prisma.otAssignment.findMany({ include: { assignedUser: true }, orderBy: { date: 'asc' }, take: 100 });

  return (
    <AppShell>
      <div className="page-header">
        <h2>OT Rotation</h2>
        <p>Weekend overtime assignment schedule</p>
      </div>
      {session.role === 'ADMIN' && (
        <form method="post" action="/api/ot" className="card" style={{ maxWidth: 560 }}>
          <h3>Add Assignment</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ot-date">Date</label>
              <input id="ot-date" type="date" name="date" required />
            </div>
            <div className="form-group">
              <label htmlFor="ot-shift">Shift</label>
              <select id="ot-shift" name="shift">
                <option value="FIRST">1st Shift</option>
                <option value="SECOND">2nd Shift</option>
                <option value="THIRD">3rd Shift</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ot-vs">Value Stream</label>
              <select id="ot-vs" name="valueStream">
                <option value="WCZ">WCZ</option>
                <option value="BCZ">BCZ</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="ot-user">Supervisor</label>
              <select id="ot-user" name="assignedUserId">
                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="ot-label">Label (optional)</label>
            <input id="ot-label" name="label" placeholder="e.g. Holiday weekend" />
          </div>
          <button type="submit">Save Assignment</button>
        </form>
      )}
      <table>
        <thead>
          <tr><th>Date</th><th>Shift</th><th>Value Stream</th><th>Supervisor</th><th>Label</th></tr>
        </thead>
        <tbody>
          {assignments.map(a => (
            <tr key={a.id}>
              <td>{a.date.toISOString().slice(0,10)}</td>
              <td>{a.shift}</td>
              <td>{a.valueStream}</td>
              <td>{a.assignedUser.name}</td>
              <td>{a.label}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AppShell>
  );
}
