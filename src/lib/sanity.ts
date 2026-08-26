import { createClient } from 'next-sanity'

/**
 * Safe Sanity Client Configuration
 *
 * Handles missing environment variables gracefully.
 * If Sanity is not configured, exports are still safe but queries will fail
 * with warnings instead of crashing the application.
 */

// ─── ENVIRONMENT VARIABLES ──────────────────────────────────────────────────

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET
const SANITY_API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION

// ─── CONFIGURATION STATE ────────────────────────────────────────────────────

const SANITY_CONFIGURED = Boolean(SANITY_PROJECT_ID && SANITY_DATASET && SANITY_API_VERSION)

// ─── SAFE CLIENT CREATION ───────────────────────────────────────────────────

/**
 * Safe Sanity client that won't crash if configuration is missing.
 * Uses fallback values to prevent runtime errors.
 */
export const client = createClient({
  projectId: SANITY_PROJECT_ID || 'missing-project-id',
  dataset: SANITY_DATASET || 'production',
  apiVersion: SANITY_API_VERSION || '2024-01-01',
  useCdn: true,
})

// ─── CONFIGURATION HELPERS ──────────────────────────────────────────────────

/**
 * Check if Sanity is properly configured
 * Returns true only if all required env vars are set
 */
export function isSanityConfigured(): boolean {
  return SANITY_CONFIGURED
}

/**
 * Get configuration status for logging
 */
export function getSanityStatus(): {
  configured: boolean
  projectId: string | null
  dataset: string | null
  apiVersion: string | null
} {
  return {
    configured: SANITY_CONFIGURED,
    projectId: SANITY_PROJECT_ID || null,
    dataset: SANITY_DATASET || null,
    apiVersion: SANITY_API_VERSION || null,
  }
}

/**
 * Log configuration warning in development
 */
if (typeof window === 'undefined' && !SANITY_CONFIGURED && process.env.NODE_ENV === 'development') {
  console.warn(
    '⚠️  Sanity CMS not configured.\n' +
      'Set these environment variables:\n' +
      '  NEXT_PUBLIC_SANITY_PROJECT_ID\n' +
      '  NEXT_PUBLIC_SANITY_DATASET\n' +
      '  NEXT_PUBLIC_SANITY_API_VERSION\n' +
      'Journal will use fallback data until Sanity is configured.'
  )
}