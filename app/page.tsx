import AppShell from '@/components/AppShell';
import { prisma } from '@/lib/prisma';

export default async function Home() {
  const [pending, approved] = await Promise.all([
    prisma.ptoRequest.count({ where: { status: 'PENDING' } }),
    prisma.ptoEntry.count(),
  ]);
  return <AppShell><h2>Dashboard</h2><div className="grid">
    <div className="card">Pending Requests: {pending}</div>
    <div className="card">Approved PTO Entries: {approved}</div>
  </div></AppShell>;
}
