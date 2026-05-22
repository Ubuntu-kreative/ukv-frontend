/**
 * Next.js Middleware
 *
 * Fixes applied (errors 6):
 *   - Removed duplicate `middleware` function declaration
 *   - Replaced deprecated `createMiddlewareClient` (@supabase/auth-helpers-nextjs)
 *     with `createServerClient` from @supabase/ssr
 *   - Single, consolidated export — no duplicate identifiers
 *
 * Place this file at: src/middleware.ts  (root of /src, NOT inside /components)
 */

import { createServerClient } from '@supabase/ssr'
import { NextResponse }        from 'next/server'
import type { NextRequest }    from 'next/server'

export async function middleware(request: NextRequest): Promise<NextResponse> {
  // Start with a pass-through response; session cookies are mutated onto it.
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Write onto the outgoing request so downstream handlers see them
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          // Re-create response with updated request, then write onto response
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // Refresh the session token if it has expired.
  // getUser() is preferred over getSession() — it re-validates with the server.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ── Admin route protection ────────────────────────────────────────────────
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const role = user?.user_metadata?.role

    if (!user || role !== 'admin') {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     *   - _next/static  (static files)
     *   - _next/image   (image optimisation)
     *   - favicon.ico
     *   - public assets (svg, png, jpg …)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}