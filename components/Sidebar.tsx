import Link from 'next/link';
import { Role } from '@prisma/client';

export default function Sidebar({ role }: { role: Role }) {
  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        PTO Manager
        <small>FY27 CRZ Time Off</small>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section">Main</div>
        <Link href="/">Dashboard</Link>
        <Link href="/pto-calendar">PTO Calendar</Link>
        <Link href="/request-pto">Request PTO</Link>
        <Link href="/ot-rotation">OT Rotation</Link>

        {role === Role.ADMIN && (
          <>
            <div className="sidebar-section">Admin</div>
            <Link href="/approvals">Approvals</Link>
            <Link href="/users">Users</Link>
            <Link href="/settings">Settings</Link>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <form action="/api/auth/logout" method="post">
          <button type="submit" className="btn-logout">&#x2192; Logout</button>
        </form>
      </div>
    </div>
  );
}
