// /middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protect all routes housed in /admin
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const role = session?.user?.user_metadata?.role
    
    if (!session || role !== 'admin') {
      const redirectUrl = new URL('/login', req.url)
      redirectUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*'],
}