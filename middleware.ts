import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userCookie = request.cookies.get('user');
  let user = null;

  try {
    user = userCookie ? JSON.parse(userCookie.value) : null;
  } catch (e) {
    console.error('Error parsing user cookie', e);
  }

  const { pathname } = request.nextUrl;

  // Protected admin routes
  if (pathname.startsWith('/admin')) {
    if (!user || user.role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // Protected tenant routes
  if (pathname.startsWith('/tenant')) {
    if (!user || user.role !== 'tenant') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/tenant/:path*'],
};