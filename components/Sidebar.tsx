import Link from 'next/link';
import { Role } from '@prisma/client';

export default function Sidebar({ role }: { role: Role }) {
  return <div className="sidebar">
    <h3>PTO Manager</h3>
    <Link href="/">Dashboard</Link>
    <Link href="/ot-rotation">OT Rotation</Link>
    <Link href="/pto-calendar">PTO Calendar</Link>
    <Link href="/request-pto">Request PTO</Link>
    {role === Role.ADMIN && <>
      <Link href="/approvals">Approvals</Link>
      <Link href="/settings">Settings</Link>
      <Link href="/users">Users</Link>
    </>}
    <form action="/api/auth/logout" method="post"><button type="submit">Logout</button></form>
  </div>;
}
