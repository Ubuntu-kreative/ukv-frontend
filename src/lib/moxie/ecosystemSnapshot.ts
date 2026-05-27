// Compact real-data snapshot for Moxie API context (no hallucination)

import { COTTAGES, SPA_TREATMENTS, EVENT_PACKAGES, PUBLIC_EVENTS } from '@/lib/data'
import { getMenuSummaryForAI } from './menu'

export function getEcosystemSnapshot(pathname: string): string {
  const lines: string[] = []

  if (pathname.includes('restaurant') || pathname === '/') {
    lines.push('MENU (sample):')
    lines.push(getMenuSummaryForAI({ section: 'signature' }).slice(0, 1200))
  }

  if (pathname.includes('cottages') || pathname === '/') {
    lines.push('\nCOTTAGES (live catalogue):')
    COTTAGES.slice(0, 6).forEach((c) => {
      lines.push(`- ${c.name}: KES ${c.price.toLocaleString()} ${c.unit} · ${c.tag}`)
    })
  }

  if (pathname.includes('spa') || pathname === '/') {
    lines.push('\nSPA (live catalogue):')
    SPA_TREATMENTS.slice(0, 6).forEach((s) => {
      lines.push(`- ${s.name}: KES ${s.price?.toLocaleString() ?? 'enquire'} ${s.unit ?? ''}`)
    })
  }

  if (pathname.includes('events') || pathname === '/') {
    lines.push('\nPUBLIC EVENTS:')
    PUBLIC_EVENTS.slice(0, 5).forEach((e) => {
      lines.push(`- ${e.name}: KES ${e.price.toLocaleString()}`)
    })
    lines.push('\nEVENT PACKAGES:')
    EVENT_PACKAGES.slice(0, 4).forEach((p) => {
      lines.push(`- ${p.name}: KES ${p.price.toLocaleString()}`)
    })
  }

  if (pathname.includes('farm')) {
    lines.push('\nFARM: Sunrise Farm Walk KES 2,800/person · School Farm Days KES 800/student')
  }

  return lines.join('\n')
}
