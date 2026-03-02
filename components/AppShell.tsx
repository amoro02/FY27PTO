import { requireAuth } from '@/lib/auth';
import Sidebar from './Sidebar';

export default async function AppShell({ children }: { children: React.ReactNode }) {
  const { session } = await requireAuth();
  return <div className="layout"><Sidebar role={session.role} /><main className="main">{children}</main></div>;
}
