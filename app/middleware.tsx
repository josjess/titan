import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // Protected routes
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const verifyUrl = new URL('/api/auth/verify', request.url);
      const verifyRes = await fetch(verifyUrl, {
        headers: { Cookie: `auth_token=${token}` }
      });

      if (!verifyRes.ok) {
        throw new Error('Invalid token');
      }
    } catch {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth_token');
      return response;
    }
  }

  return NextResponse.next();
}