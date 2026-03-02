import AppShell from '@/components/AppShell';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export default async function SettingsPage() {
  await requireAuth(true);
  const settings = await prisma.settings.findUnique({ where: { id: 'singleton' } });
  const users = await prisma.user.findMany({ where: { role: 'SUPERVISOR' }, orderBy: { name: 'asc' } });
  return <AppShell><h2>Settings</h2>
    <form method="post" action="/api/settings" className="card">
      <input name="fiscalYearStartMonth" type="number" defaultValue={settings?.fiscalYearStartMonth || 4} />
      <input name="fiscalYearStartDay" type="number" defaultValue={settings?.fiscalYearStartDay || 1} />
      <input name="defaultGrantedHours" type="number" defaultValue={settings?.defaultGrantedHours || 160} />
      <button>Save Global</button>
    </form>
    {users.map(u=><form key={u.id} method="post" action="/api/settings" className="card">
      <input type="hidden" name="userId" value={u.id}/><strong>{u.name}</strong>
      <input name="carryoverHours" type="number" step="0.5" defaultValue={u.carryoverHours}/>
      <input name="adjustmentHours" type="number" step="0.5" defaultValue={u.adjustmentHours}/>
      <input name="compTimeBalance" type="number" step="0.5" defaultValue={u.compTimeBalance}/>
      <button>Save User Balances</button></form>)}
  </AppShell>;
}
