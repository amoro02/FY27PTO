import AppShell from '@/components/AppShell';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export default async function SettingsPage() {
  await requireAuth(true);
  const settings = await prisma.settings.findUnique({ where: { id: 'singleton' } });
  const users = await prisma.user.findMany({ where: { role: 'SUPERVISOR' }, orderBy: { name: 'asc' } });
  return (
    <AppShell>
      <div className="page-header">
        <h2>Settings</h2>
        <p>Fiscal year configuration and per-supervisor balances</p>
      </div>
      <form method="post" action="/api/settings" className="card" style={{ maxWidth: 440 }}>
        <h3>Global Defaults</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fyMonth">FY Start Month</label>
            <input id="fyMonth" name="fiscalYearStartMonth" type="number" min={1} max={12} defaultValue={settings?.fiscalYearStartMonth || 4} />
          </div>
          <div className="form-group">
            <label htmlFor="fyDay">FY Start Day</label>
            <input id="fyDay" name="fiscalYearStartDay" type="number" min={1} max={31} defaultValue={settings?.fiscalYearStartDay || 1} />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="grantedHours">Default Granted Hours</label>
          <input id="grantedHours" name="defaultGrantedHours" type="number" defaultValue={settings?.defaultGrantedHours || 160} />
        </div>
        <button>Save Global Settings</button>
      </form>

      <h3 style={{ marginTop: 24, marginBottom: 12 }}>Supervisor Balances</h3>
      {users.map(u => (
        <form key={u.id} method="post" action="/api/settings" className="card" style={{ maxWidth: 560 }}>
          <input type="hidden" name="userId" value={u.id} />
          <h4>{u.name}</h4>
          <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
            <div className="form-group">
              <label>Carryover Hrs</label>
              <input name="carryoverHours" type="number" step="0.5" defaultValue={u.carryoverHours} />
            </div>
            <div className="form-group">
              <label>Adjustment Hrs</label>
              <input name="adjustmentHours" type="number" step="0.5" defaultValue={u.adjustmentHours} />
            </div>
            <div className="form-group">
              <label>Comp Time Bal.</label>
              <input name="compTimeBalance" type="number" step="0.5" defaultValue={u.compTimeBalance} />
            </div>
          </div>
          <button className="btn-sm">Save Balances</button>
        </form>
      ))}
    </AppShell>
  );
}
