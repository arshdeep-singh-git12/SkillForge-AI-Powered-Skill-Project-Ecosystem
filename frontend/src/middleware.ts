import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add the paths that should not require authentication
const publicPaths = ['/', '/login', '/signup', '/api'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Exclude static files, images, next system files, etc.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.match(/\.(png|jpg|jpeg|svg|gif|webp)$/)
  ) {
    return NextResponse.next();
  }

  // Get the token from cookies
  const token = request.cookies.get('token')?.value;

  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`) && path !== '/'
  );

  // If user is trying to access a private route without a token, redirect to login
  if (!isPublicPath && (!token || token === 'none')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user is already logged in and tries to access login/signup, redirect to dashboard
  if ((pathname === '/login' || pathname === '/signup') && token && token !== 'none') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
