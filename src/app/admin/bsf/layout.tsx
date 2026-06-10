// ─────────────────────────────────────────────────────────────────────────────
// src/app/admin/bsf/layout.tsx
// Server layout — server-side session guard + chrome
// This file is correct as-is. No bugs found here.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata }      from 'next'
import { getServerSession }   from 'next-auth'
import { redirect }           from 'next/navigation'
import { authOptions }        from '@/app/api/auth/[...nextauth]/route'
import SignOutButton           from './SignOutButton'

export const metadata: Metadata = {
  title:  'BSF Supply Dashboard | Ubuntu Internal',
  robots: { index: false, follow: false },
}

export default async function BsfAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Belt-and-braces server-side check alongside middleware
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#050805',
        fontFamily: 'var(--font-body, sans-serif)',
      }}
    >
      {/* ── Confidentiality banner ── */}
      <div
        style={{
          background: 'rgba(212,168,83,0.08)',
          borderBottom: '1px solid rgba(212,168,83,0.18)',
          padding: '10px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <p
          style={{
            color: 'rgba(212,168,83,0.75)',
            fontSize: 10,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          ⚠ Confidential — Internal Use Only · Do not share outside the Ubuntu team
        </p>
        <span style={{ color: 'rgba(255,255,255,0.28)', fontSize: 10 }}>
          {session.user?.email}
        </span>
      </div>

      {/* ── Top nav ── */}
      <nav
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          padding: '16px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span
            style={{
              color: '#D4A853',
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
            }}
          >
            Ubuntu · Staff Portal
          </span>
          <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 12 }}>/</span>
          <span
            style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: 11,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            BSF Dashboard
          </span>
        </div>

        <SignOutButton />
      </nav>

      {children}
    </div>
  )
}