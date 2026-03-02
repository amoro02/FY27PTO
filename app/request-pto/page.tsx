import AppShell from '@/components/AppShell';
import { requireAuth } from '@/lib/auth';

export default async function RequestPtoPage() {
  const { user } = await requireAuth();
  const disabled = user.status !== 'ACTIVE' || !user.passwordHash;
  return <AppShell><h2>Request PTO</h2>
    {disabled ? <p>Pending supervisors cannot submit PTO until activated.</p> :
    <form method="post" action="/api/pto/request" className="card">
      <input type="date" name="startDate" required />
      <input type="date" name="endDate" required />
      <select name="hoursPerDay"><option value="8">8</option><option value="4">4</option></select>
      <select name="type"><option value="PTO">PTO</option><option value="COMP_TIME">Comp Time</option></select>
      <textarea name="notes" placeholder="notes" />
      <button type="submit">Submit</button>
    </form>}
  </AppShell>;
}
