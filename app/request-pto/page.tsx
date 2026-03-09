import AppShell from '@/components/AppShell';
import { requireAuth } from '@/lib/auth';

export default async function RequestPtoPage() {
  const { user } = await requireAuth();
  const disabled = user.status !== 'ACTIVE' || !user.passwordHash;
  return (
    <AppShell>
      <div className="page-header">
        <h2>Request PTO</h2>
        <p>Submit a new time-off request</p>
      </div>
      {disabled
        ? <div className="alert alert-warn">Pending supervisors cannot submit PTO until activated by an admin.</div>
        : (
          <form method="post" action="/api/pto/request" className="card" style={{ maxWidth: 480 }}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input id="startDate" type="date" name="startDate" required />
              </div>
              <div className="form-group">
                <label htmlFor="endDate">End Date</label>
                <input id="endDate" type="date" name="endDate" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="hoursPerDay">Hours / Day</label>
                <select id="hoursPerDay" name="hoursPerDay">
                  <option value="8">8 hours</option>
                  <option value="4">4 hours</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="type">Type</label>
                <select id="type" name="type">
                  <option value="PTO">PTO</option>
                  <option value="COMP_TIME">Comp Time</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea id="notes" name="notes" placeholder="Optional notes..." />
            </div>
            <button type="submit">Submit Request</button>
          </form>
        )
      }
    </AppShell>
  );
}
