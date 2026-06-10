'use client'

// ─────────────────────────────────────────────────────────────────────────────
// src/components/providers/AuthProvider.tsx
//
// Wraps the app in NextAuth's SessionProvider so any client component can
// call useSession(). This must be a 'use client' component — SessionProvider
// uses React context internally.
//
// NOTE: SessionProvider must sit ABOVE any component that calls useSession()
// or signIn(). It is correctly placed in the root layout.tsx wrapping
// CartProvider and ClientLayout.
// ─────────────────────────────────────────────────────────────────────────────

import { SessionProvider } from 'next-auth/react'
import type { ReactNode }  from 'react'

export default function AuthProvider({ children }: { children: ReactNode }) {
  return (
    // refetchInterval: 0 — don't poll the session endpoint every N seconds.
    // refetchOnWindowFocus: false — don't re-fetch when the tab regains focus.
    // These settings prevent unnecessary /api/auth/session requests.
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      {children}
    </SessionProvider>
  )
}