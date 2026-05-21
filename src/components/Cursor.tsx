'use client'

import { useEffect } from 'react'

export default function Cursor() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(hover: none)').matches) return

    document.getElementById('ukv-cursor-dot')?.remove()
    document.getElementById('ukv-cursor-ring')?.remove()
    document.getElementById('ukv-cursor-style')?.remove()

    const dot = document.createElement('div')
    dot.id = 'ukv-cursor-dot'
    Object.assign(dot.style, {
      position:      'fixed',
      top:           '-100px',
      left:          '-100px',
      width:         '8px',
      height:        '8px',
      background:    '#00FF41',
      borderRadius:  '50%',
      pointerEvents: 'none',
      zIndex:        '2147483647',
      transition:    'width .25s ease, height .25s ease, background .25s ease',
    })

    const ring = document.createElement('div')
    ring.id = 'ukv-cursor-ring'
    Object.assign(ring.style, {
      position:      'fixed',
      top:           '-100px',
      left:          '-100px',
      width:         '36px',
      height:        '36px',
      border:        '1.5px solid rgba(0,255,65,0.5)',
      borderRadius:  '50%',
      pointerEvents: 'none',
      zIndex:        '2147483646',
      transition:    'width .35s ease, height .35s ease, border-color .3s ease',
    })

    const style = document.createElement('style')
    style.id = 'ukv-cursor-style'
    style.textContent = `*, *::before, *::after { cursor: none !important; }`
    document.head.appendChild(style)
    document.body.appendChild(dot)
    document.body.appendChild(ring)

    let mx = 0, my = 0, rx = 0, ry = 0, raf: number

    const move = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      dot.style.left = mx - 4 + 'px'
      dot.style.top  = my - 4 + 'px'
    }

    const tick = () => {
      rx += (mx - rx) * 0.12
      ry += (my - ry) * 0.12
      ring.style.left = rx - 18 + 'px'
      ring.style.top  = ry - 18 + 'px'
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    window.addEventListener('mousemove', move, { passive: true })

    const HOVER = 'a,button,[data-hover],input,select,textarea,label'
    const onEnter = (e: MouseEvent) => {
      if (!(e.target as Element).closest?.(HOVER)) return
      dot.style.width      = '5px'
      dot.style.height     = '5px'
      dot.style.background = '#D4A853'
      ring.style.width     = '48px'
      ring.style.height    = '48px'
      ring.style.border    = '1.5px solid rgba(212,168,83,0.6)'
    }
    const onLeave = (e: MouseEvent) => {
      if (!(e.target as Element).closest?.(HOVER)) return
      dot.style.width      = '8px'
      dot.style.height     = '8px'
      dot.style.background = '#00FF41'
      ring.style.width     = '36px'
      ring.style.height    = '36px'
      ring.style.border    = '1.5px solid rgba(0,255,65,0.5)'
    }

    document.addEventListener('mouseover', onEnter, { passive: true })
    document.addEventListener('mouseout',  onLeave, { passive: true })

    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', onEnter)
      document.removeEventListener('mouseout',  onLeave)
      cancelAnimationFrame(raf)
      document.getElementById('ukv-cursor-dot')?.remove()
      document.getElementById('ukv-cursor-ring')?.remove()
      document.getElementById('ukv-cursor-style')?.remove()
    }
  }, [])

  return null
}