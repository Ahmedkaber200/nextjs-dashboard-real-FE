// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  
  // Public routes (allow without token)
  const publicPaths = ['/auth', '/api/auth'];
  if (publicPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  try {
    // Verify token with Laravel API
    const response = await fetch('http://localhost:8000/api/getprofile', { // Use a dedicated verify endpoint
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    // If status is false or error in response
    if (!data.status || response.status !== 200) {
      const res = NextResponse.redirect(new URL('/auth/login', request.url));
      res.cookies.delete('auth_token'); // Clear invalid token
      return res;
    }

    // If valid, continue with request
    return NextResponse.next();

  } catch (error) {
    console.error("Token verification failed:", error);
    const res = NextResponse.redirect(new URL('/auth/login', request.url));
    res.cookies.delete('auth_token');
    return res;
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/customers/:path*',
    '/settings/:path*'
  ],
};