import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  
  // Exclude static files, images, next system files, etc.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.match(/\.(png|jpg|jpeg|svg|gif|webp)$/)
  ) {
    return NextResponse.next();
  }

  // If token is in query params (e.g. OAuth callback redirect to /dashboard?token=...),
  // set cookie on the frontend domain and proceed directly without blocking
  const urlToken = searchParams.get('token');
  if (urlToken) {
    const response = NextResponse.next();
    response.cookies.set('token', urlToken, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    });
    return response;
  }

  // Client-side authentication and route guarding is handled by ClientLayoutWrapper
  // and AuthContext, which support both localStorage JWT tokens and cross-origin OAuth.
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
