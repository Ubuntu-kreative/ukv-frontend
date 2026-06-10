'use client'

import { useEffect } from 'react'
import MoxieChat from '@/components/MoxieChat'

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })

    const updateEnvironment = () => {
      const now = new Date()
      const kenyaTime = new Date(now.getTime() + 3 * 60 * 60 * 1000)
      const hour = kenyaTime.getUTCHours()
      const root = document.documentElement

      if (hour >= 17 && hour <= 19) {
        root.style.setProperty('--gold', '#E69342')
        root.style.setProperty('--neon', '#00FF65')
        root.style.setProperty('--obsidian', '#0A0A0A')
      } else if (hour >= 20 || hour <= 5) {
        root.style.setProperty('--gold', '#C9973E')
        root.style.setProperty('--neon', '#00C832')
        root.style.setProperty('--obsidian', '#050505')
      } else {
        root.style.setProperty('--gold', '#D4A853')
        root.style.setProperty('--neon', '#00FF41')
        root.style.setProperty('--obsidian', '#080808')
      }
    }

    updateEnvironment()
    const interval = setInterval(updateEnvironment, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {children}
      <MoxieChat />
    </>
  )
}