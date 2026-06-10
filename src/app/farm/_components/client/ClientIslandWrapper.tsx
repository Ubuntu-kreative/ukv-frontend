'use client'

import FarmVideoLoader from './FarmVideoLoader'
import FarmScrollReveal from './FarmScrollReveal'
import MoxieChat from '@/components/MoxieChat'

export default function ClientIslandWrapper() {
  return (
    <>
      <FarmScrollReveal />
      <FarmVideoLoader />
      <MoxieChat />
    </>
  )
}