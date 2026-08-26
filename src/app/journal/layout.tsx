/**
 * src/app/journal/layout.tsx
 *
 * Layout wrapper for journal section
 */

import React, { ReactNode } from 'react'

interface JournalLayoutProps {
  children: ReactNode
}

export default function JournalLayout({ children }: JournalLayoutProps) {
  return <>{children}</>
}
