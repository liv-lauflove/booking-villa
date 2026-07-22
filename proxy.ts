import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthRoute = req.nextUrl.pathname.startsWith('/signin');
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  const isProtectedRoute = req.nextUrl.pathname.startsWith('/reservations') || req.nextUrl.pathname.startsWith('/checkout');

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/', req.nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && (isAdminRoute || isProtectedRoute)) {
    return NextResponse.redirect(new URL('/signin', req.nextUrl));
  }

  if (isAdminRoute && req.auth?.user?.role !== 'admin') {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
