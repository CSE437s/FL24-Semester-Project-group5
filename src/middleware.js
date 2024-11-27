import { NextResponse } from 'next/server';
// Remove 'type' keyword
import { NextRequest } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl.clone();

  // Example: Redirect unauthorized users from /admin to /login
  if (url.pathname.startsWith('/admin')) {
    const userEmail = req.cookies.get('next-auth.session-token')?.value;

    if (!userEmail || userEmail !== 'subletify@wustl.edu') {
      url.pathname = '/403'; // Redirect to a forbidden page
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'], // Apply middleware to /admin and its subroutes
};
