// ─────────────────────────────────────────────────────────────────────────────
// src/app/admin/login/page.tsx
//
// BUG FIXED: LoginForm uses useSearchParams() to read ?callbackUrl=.
// In Next.js App Router, any component that calls useSearchParams() must be
// wrapped in <Suspense> at or above its usage — otherwise the build will throw:
//
//   "useSearchParams() should be wrapped in a suspense boundary"
//
// This page is the correct place to add that boundary.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import { Suspense }      from 'react'
import LoginForm         from './LoginForm'

export const metadata: Metadata = {
  title:   'Staff Login | Ubuntu',
  robots:  { index: false, follow: false },
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        // Minimal skeleton — same dark background, no layout shift
        <div
          style={{
            minHeight: '100vh',
            background: '#050805',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
      }
    >
      <LoginForm />
    </Suspense>
  )
}