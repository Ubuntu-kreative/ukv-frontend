// ─────────────────────────────────────────────────────────────────────────────
// middleware.ts  — place in project ROOT (same level as src/ and next.config.js)
//
// BUG FIXED — Root cause #5: getToken() with Turbopack / Next.js 16 requires
// the `cookieName` option to be explicitly set. In Next.js 15/16 with the
// App Router, NextAuth v4 writes the session cookie under one of two names
// depending on whether the connection is HTTPS:
//
//   http  (localhost):  next-auth.session-token
//   https (production): __Secure-next-auth.session-token
//
// Turbopack's dev server can confuse this detection. Passing `cookieName`
// explicitly ensures getToken() always reads the right cookie.
//
// Without this fix, middleware always sees `token = null`, redirects every
// request back to /admin/login, and the user can never reach the dashboard
// even after a successful Google sign-in.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from 'next/server'
import { getToken }     from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

// Resolve the correct cookie name for the current environment.
// NEXTAUTH_URL starting with https → secure cookie; http → plain cookie.
function getSessionCookieName(): string {
  const url = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
  return url.startsWith('https://')
    ? '__Secure-next-auth.session-token'
    : 'next-auth.session-token'
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ── Always allow: login page + all NextAuth API routes ───────────────────
  if (
    pathname === '/admin/login' ||
    pathname.startsWith('/api/auth')
  ) {
    return NextResponse.next()
  }

  // ── Verify session token ──────────────────────────────────────────────────
  const token = await getToken({
    req,
    secret:     process.env.NEXTAUTH_SECRET,
    cookieName: getSessionCookieName(), // FIX #5
  })

  if (!token) {
    const loginUrl = new URL('/admin/login', req.url)
    // Preserve the intended destination so the user lands there after login
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// Apply ONLY to /admin routes — /api/auth/* must remain public
export const config = {
  matcher: ['/admin/:path*'],
}