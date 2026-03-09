import AppShell from '@/components/AppShell';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export default async function UsersPage() {
  await requireAuth(true);
  const users = await prisma.user.findMany({ orderBy: { name: 'asc' } });
  return (
    <AppShell>
      <div className="page-header">
        <h2>Users</h2>
        <p>Manage supervisors and admin accounts</p>
      </div>

      <form method="post" action="/api/users" className="card" style={{ maxWidth: 560 }}>
        <h3>Create User</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="u-name">Full Name</label>
            <input id="u-name" name="name" placeholder="Jane Smith" required />
          </div>
          <div className="form-group">
            <label htmlFor="u-username">Username</label>
            <input id="u-username" name="username" placeholder="jane.smith" required />
          </div>
        </div>
        <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
          <div className="form-group">
            <label htmlFor="u-role">Role</label>
            <select id="u-role" name="role">
              <option value="SUPERVISOR">Supervisor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="u-status">Status</label>
            <select id="u-status" name="status">
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="u-shift">Shift</label>
            <select id="u-shift" name="shift">
              <option value="FIRST">1st</option>
              <option value="SECOND">2nd</option>
              <option value="THIRD">3rd</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="u-vs">Value Stream</label>
            <select id="u-vs" name="valueStream">
              <option value="WCZ">WCZ</option>
              <option value="BCZ">BCZ</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="u-password">Password (optional)</label>
          <input id="u-password" name="password" type="password" placeholder="Leave blank for pending activation" />
        </div>
        <button>Create User</button>
      </form>

      <table>
        <thead>
          <tr><th>Name</th><th>Status</th><th>Shift</th><th>Value Stream</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>
                <span className={`badge badge-${u.status.toLowerCase()}`}>{u.status}</span>
              </td>
              <td>{u.shift}</td>
              <td>{u.valueStream}</td>
              <td style={{ display: 'flex', gap: 6 }}>
                <form method="post" action="/api/users">
                  <input type="hidden" name="id" value={u.id} />
                  <input type="hidden" name="action" value="activate" />
                  <button className="btn-success btn-sm">Activate</button>
                </form>
                <form method="post" action="/api/users">
                  <input type="hidden" name="id" value={u.id} />
                  <input type="hidden" name="action" value="disable" />
                  <button className="btn-danger btn-sm">Disable</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AppShell>
  );
}
