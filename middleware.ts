import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/api') || pathname.startsWith('/_next')) return NextResponse.next();
  const token = req.cookies.get('session')?.value;
  if (!token && pathname !== '/login') return NextResponse.redirect(new URL('/login', req.url));
  if (token && pathname === '/login') return NextResponse.redirect(new URL('/', req.url));
  return NextResponse.next();
}

export const config = { matcher: ['/((?!favicon.ico).*)'] };
