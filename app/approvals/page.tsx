import AppShell from '@/components/AppShell';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export default async function ApprovalsPage() {
  await requireAuth(true);
  const requests = await prisma.ptoRequest.findMany({ where: { status: 'PENDING' }, include: { user: true }, orderBy: { createdAt: 'asc' } });
  return (
    <AppShell>
      <div className="page-header">
        <h2>Approvals</h2>
        <p>Review and act on pending PTO requests</p>
      </div>
      {requests.length === 0
        ? <div className="alert alert-info">No pending requests.</div>
        : (
          <table>
            <thead>
              <tr>
                <th>Supervisor</th>
                <th>Dates</th>
                <th>Hrs/Day</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id}>
                  <td>{r.user.name}</td>
                  <td>{r.startDate.toISOString().slice(0,10)} – {r.endDate.toISOString().slice(0,10)}</td>
                  <td>{r.hoursPerDay}</td>
                  <td><span className={`badge badge-${r.type === 'PTO' ? 'pto' : 'comp'}`}>{r.type}</span></td>
                  <td style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <form method="post" action={`/api/approvals/${r.id}`} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      <input type="hidden" name="decision" value="APPROVED" />
                      <input name="adminPasscode" placeholder="Passcode" required style={{ width: 110 }} />
                      <button className="btn-success btn-sm">Approve</button>
                    </form>
                    <form method="post" action={`/api/approvals/${r.id}`} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      <input type="hidden" name="decision" value="DENIED" />
                      <input name="reason" placeholder="Reason" required style={{ width: 110 }} />
                      <input name="adminPasscode" placeholder="Passcode" required style={{ width: 110 }} />
                      <button className="btn-danger btn-sm">Deny</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      }
    </AppShell>
  );
}
