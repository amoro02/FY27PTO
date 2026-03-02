import AppShell from '@/components/AppShell';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export default async function ApprovalsPage() {
  await requireAuth(true);
  const requests = await prisma.ptoRequest.findMany({ where: { status: 'PENDING' }, include: { user: true }, orderBy: { createdAt: 'asc' } });
  return <AppShell><h2>Approvals</h2><table><thead><tr><th>Supervisor</th><th>Dates</th><th>Hours</th><th>Type</th><th>Actions</th></tr></thead><tbody>
    {requests.map((r) => <tr key={r.id}><td>{r.user.name}</td><td>{r.startDate.toISOString().slice(0,10)} - {r.endDate.toISOString().slice(0,10)}</td><td>{r.hoursPerDay}</td><td>{r.type}</td><td>
      <form method="post" action={`/api/approvals/${r.id}`}><input type="hidden" name="decision" value="APPROVED" /><input name="adminPasscode" placeholder="Admin passcode" required /><button>Approve</button></form>
      <form method="post" action={`/api/approvals/${r.id}`}><input type="hidden" name="decision" value="DENIED" /><input name="reason" placeholder="Denial reason" required /><input name="adminPasscode" placeholder="Admin passcode" required /><button>Deny</button></form>
    </td></tr>)}
  </tbody></table></AppShell>;
}
