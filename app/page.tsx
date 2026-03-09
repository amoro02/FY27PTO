import AppShell from '@/components/AppShell';
import { prisma } from '@/lib/prisma';

export default async function Home() {
  const [pending, approved] = await Promise.all([
    prisma.ptoRequest.count({ where: { status: 'PENDING' } }),
    prisma.ptoEntry.count(),
  ]);
  return (
    <AppShell>
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Overview of time-off activity</p>
      </div>
      <div className="grid">
        <div className="card">
          <div className="card-title">Pending Requests</div>
          <div className="stat-value">{pending}</div>
        </div>
        <div className="card">
          <div className="card-title">Approved PTO Entries</div>
          <div className="stat-value">{approved}</div>
        </div>
      </div>
    </AppShell>
  );
}
