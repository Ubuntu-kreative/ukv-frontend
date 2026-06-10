'use client'

import { CSSProperties } from 'react'
import dynamic from 'next/dynamic'

const SKELETON_STYLE: CSSProperties = {
  minHeight: 600,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0.2,
  fontFamily: 'var(--font-body)',
  fontSize: '9px',
  letterSpacing: '0.3em',
  textTransform: 'uppercase',
  color: 'rgba(0,255,65,0.5)',
}

function BentoSkeleton() {
  return <div style={SKELETON_STYLE}>Loading live data…</div>
}

const BentoGrid = dynamic(
  () => import('@/components/home/BentoGrid'),
  { ssr: false, loading: BentoSkeleton }
)

interface Props {
  eventsLabel?: string
}

export default function BentoGridClient({ eventsLabel }: Props) {
  return <BentoGrid eventsLabel={eventsLabel} />
}