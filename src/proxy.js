import { NextResponse } from 'next/server';

export function proxy(request) {
  const response = NextResponse.next();

  // 1. Add Security Headers
  // Prevents clickjacking by forbidding rendering inside iframes
  response.headers.set('X-Frame-Options', 'DENY');
  
  // Prevents MIME-sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Strict Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions Policy
  response.headers.set(
    'Permissions-Policy', 
    'camera=(), microphone=(), geolocation=()'
  );

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
