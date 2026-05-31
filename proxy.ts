import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Extract user role from cookies (set during login)
  const userRoleCookie = request.cookies.get('userRole')?.value;

  // Define the protected route prefixes
  const isMentorRoute = pathname.startsWith('/mentor-dashboard');
  const isTutorRoute = pathname.startsWith('/tutor-dashboard');
  const isStudentRoute = pathname.startsWith('/student-dashboard');

  // 1. If trying to access any protected route without being logged in
  if (!userRoleCookie && (isMentorRoute || isTutorRoute || isStudentRoute)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. If logged in, enforce role-based access
  if (userRoleCookie && userRoleCookie !== 'ADMIN') {
    if (isMentorRoute && userRoleCookie !== 'MENTOR') {
      return NextResponse.redirect(new URL(`/${userRoleCookie.toLowerCase()}-dashboard/Home`, request.url));
    }
    
    if (isTutorRoute && userRoleCookie !== 'TUTOR') {
      return NextResponse.redirect(new URL(`/${userRoleCookie.toLowerCase()}-dashboard/Home`, request.url));
    }
    
    if (isStudentRoute && userRoleCookie !== 'STUDENT') {
      return NextResponse.redirect(new URL(`/${userRoleCookie.toLowerCase()}-dashboard/Home`, request.url));
    }
  }

  // Allow the request to proceed if checks pass
  return NextResponse.next();
}

// Configure which paths this middleware applies to
export const config = {
  matcher: [
    '/mentor-dashboard/:path*',
    '/tutor-dashboard/:path*',
    '/student-dashboard/:path*'
  ],
};
