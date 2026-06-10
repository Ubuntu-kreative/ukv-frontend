// ─────────────────────────────────────────────────────────────────────────────
// src/app/api/auth/[...nextauth]/route.ts
//
// BUG FIXED — Root cause #3: The `session` callback was not receiving the
// `token` argument (JWT strategy). Without it, session data is stale/empty
// on the first request after sign-in, causing middleware getToken() to see
// no valid session and redirect back to /admin/login in a loop.
//
// Fix: pass `token` through in the session callback so the JWT round-trip
// is complete, and add `jwt` callback to persist the isAdmin flag in the token
// (not just on the session object, which is derived from the token).
//
// BUG FIXED — Root cause #4: Missing `next-auth.d.ts` type augmentation means
// TypeScript would silently widen `session.user` and strip `isAdmin`, causing
// subtle runtime behaviour differences between dev and prod builds.
// The augmentation is included inline here via module declaration.
// ─────────────────────────────────────────────────────────────────────────────

import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import type { NextAuthOptions } from 'next-auth'

// ─── Type augmentation ────────────────────────────────────────────────────
// Extends next-auth's built-in Session and JWT types so TypeScript knows
// `session.user.isAdmin` and `token.isAdmin` exist.
declare module 'next-auth' {
  interface Session {
    user: {
      name?: string | null
      email?: string | null
      image?: string | null
      isAdmin: boolean
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    isAdmin?: boolean
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function getAllowedEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean)
}

// ─── Auth options ─────────────────────────────────────────────────────────

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Explicitly request offline access so a refresh token is issued.
      // Without this, tokens expire and the session silently breaks.
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],

  // IMPORTANT: must match NEXTAUTH_SECRET in .env.local exactly
  secret: process.env.NEXTAUTH_SECRET,

  // NextAuth v4 + App Router = JWT strategy (no database needed)
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: '/admin/login',
    error:  '/admin/login',   // ?error= param is appended automatically
  },

  callbacks: {
    // ── Step 1: Block non-allowlisted emails at the door ──────────────────
    async signIn({ user }) {
      const email   = user.email?.toLowerCase() ?? ''
      const allowed = getAllowedEmails()

      if (allowed.length === 0) {
        console.error(
          '[NextAuth] ADMIN_EMAILS env var is empty or not set. ' +
          'All sign-ins are blocked (fail-secure).'
        )
        return false
      }

      if (!allowed.includes(email)) {
        console.warn(`[NextAuth] Blocked sign-in attempt from: ${email}`)
        return false
      }

      return true
    },

    // ── Step 2: Persist isAdmin into the JWT token ────────────────────────
    // FIX #3a: This callback was missing. Without it, `token.isAdmin` is never
    // set, so middleware getToken() sees a token with no admin flag and the
    // session callback below never has the data it needs.
    async jwt({ token, user }) {
      // `user` is only present on the very first sign-in
      if (user) {
        token.isAdmin = true // signIn callback already validated the email
      }
      return token
    },

    // ── Step 3: Expose isAdmin on the session object ──────────────────────
    // FIX #3b: Pass `token` and read from it — this is the correct pattern.
    // The previous version spread `session.user` but never read `token`,
    // so the JWT round-trip was broken.
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          isAdmin: token.isAdmin ?? false,
        },
      }
    },
  },

  // Enable debug logging in development — remove in production
  debug: process.env.NODE_ENV === 'development',
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }