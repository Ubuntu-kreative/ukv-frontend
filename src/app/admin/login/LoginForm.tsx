'use client'

// ─────────────────────────────────────────────────────────────────────────────
// src/app/admin/login/LoginForm.tsx
//
// BUG FIXED — Root cause #6: `signIn('google', { redirect: true })` combined
// with a try/catch is the wrong pattern for browser-side OAuth.
//
// When redirect: true (the default), NextAuth performs a full-page browser
// redirect to Google's OAuth consent page. This navigation is NOT a Promise
// rejection — it's a browser navigation event. The try/catch never fires,
// but the `finally` block runs BEFORE Google completes the OAuth flow,
// setting loading=false and making the button appear stuck/idle.
//
// Additionally, wrapping a full-page redirect in try/catch suppresses
// any real errors (like NEXTAUTH_URL mismatch) that would otherwise
// surface in the console.
//
// Fix:
//   1. Remove try/catch — let real errors propagate to the browser console.
//   2. Remove redirect: true (it is the default, explicit is fine but
//      the finally block incorrectly resets loading state mid-redirect).
//   3. Do NOT reset loading state after signIn() — the page is navigating
//      away; the spinner should persist until Google loads.
//   4. Read callbackUrl from the query string so the middleware-appended
//      destination is honoured after login.
// ─────────────────────────────────────────────────────────────────────────────

import { useState }              from 'react'
import { signIn }                from 'next-auth/react'
import { useSearchParams }       from 'next/navigation'

export default function LoginForm() {
  const [loading, setLoading] = useState(false)
  const searchParams  = useSearchParams()

  // The middleware appends ?callbackUrl=... when redirecting to login.
  // Fall back to /admin/bsf if not present.
  const callbackUrl = searchParams.get('callbackUrl') ?? '/admin/bsf'

  async function handleGoogleSignIn() {
    // Set loading and do NOT reset it — the page will navigate away.
    // Resetting loading in a finally block causes a visual flicker where
    // the button briefly returns to idle before the redirect completes.
    setLoading(true)

    // signIn() with redirect:true (default) causes a full browser navigation.
    // It does not return a meaningful value in this case.
    // Do not wrap in try/catch — real errors (env var missing, etc.) should
    // surface visibly in the browser console, not be swallowed silently.
    await signIn('google', { callbackUrl })
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#050805',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-body, sans-serif)',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 20,
          padding: '48px 40px',
          textAlign: 'center',
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            border: '1px solid rgba(212,168,83,0.35)',
            margin: '0 auto 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ color: '#D4A853', fontSize: 22 }}>U</span>
        </div>

        <p
          style={{
            color: '#D4A853',
            fontSize: 10,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            marginBottom: 10,
          }}
        >
          Ubuntu Eco Lodge
        </p>

        <h1
          style={{
            color: 'rgba(255,255,255,0.9)',
            fontSize: '1.6rem',
            fontWeight: 300,
            marginBottom: 8,
            fontFamily: 'var(--font-display, serif)',
          }}
        >
          Staff Portal
        </h1>

        <p
          style={{
            color: 'rgba(255,255,255,0.32)',
            fontSize: 13,
            lineHeight: 1.7,
            marginBottom: 40,
          }}
        >
          Access is restricted to authorised Ubuntu team members only.
        </p>

        {/* Google sign-in button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px 20px',
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.12)',
            background: loading
              ? 'rgba(255,255,255,0.03)'
              : 'rgba(255,255,255,0.06)',
            color: loading
              ? 'rgba(255,255,255,0.3)'
              : 'rgba(255,255,255,0.8)',
            fontSize: 14,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            transition: 'background 0.2s, color 0.2s',
          }}
        >
          {/* Google G icon (inline SVG — no external dependency) */}
          {!loading && (
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
          )}

          {/* Spinner shown while redirect is in flight */}
          {loading && (
            <svg
              width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round"
              style={{ animation: 'spin 0.8s linear infinite' }}
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" opacity="0.25"/>
              <path d="M12 2a10 10 0 0 1 10 10" opacity="0.85"/>
              <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </svg>
          )}

          {loading ? 'Redirecting to Google…' : 'Continue with Google'}
        </button>

        <p
          style={{
            marginTop: 32,
            color: 'rgba(255,255,255,0.18)',
            fontSize: 11,
            lineHeight: 1.7,
          }}
        >
          Unauthorised access attempts are logged.
          <br />
          For access requests contact your Ubuntu administrator.
        </p>
      </div>
    </div>
  )
}