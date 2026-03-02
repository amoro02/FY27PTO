import AppShell from '@/components/AppShell';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export default async function UsersPage() {
  await requireAuth(true);
  const users = await prisma.user.findMany({ orderBy: { name: 'asc' } });
  return <AppShell><h2>Users</h2>
    <form method="post" action="/api/users" className="card">
      <input name="name" placeholder="Name" required />
      <input name="username" placeholder="Username" required />
      <select name="role"><option value="SUPERVISOR">Supervisor</option><option value="ADMIN">Admin</option></select>
      <select name="status"><option value="ACTIVE">active</option><option value="PENDING">pending</option><option value="INACTIVE">inactive</option></select>
      <select name="shift"><option value="FIRST">1st</option><option value="SECOND">2nd</option><option value="THIRD">3rd</option></select>
      <select name="valueStream"><option value="WCZ">WCZ</option><option value="BCZ">BCZ</option></select>
      <input name="password" placeholder="Optional password" />
      <button>Create</button>
    </form>
    <table><thead><tr><th>Name</th><th>Status</th><th>Shift</th><th>VS</th><th>Actions</th></tr></thead><tbody>
      {users.map(u=><tr key={u.id}><td>{u.name}</td><td>{u.status}</td><td>{u.shift}</td><td>{u.valueStream}</td><td>
      <form method="post" action="/api/users"><input type="hidden" name="id" value={u.id}/><input type="hidden" name="action" value="activate"/><button>Activate</button></form>
      <form method="post" action="/api/users"><input type="hidden" name="id" value={u.id}/><input type="hidden" name="action" value="disable"/><button>Disable</button></form>
      </td></tr>)}
    </tbody></table>
  </AppShell>;
}
