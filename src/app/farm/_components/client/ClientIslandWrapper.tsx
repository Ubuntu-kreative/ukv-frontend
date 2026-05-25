'use client'

import FarmExperiences from './FarmExperiences'
import FarmVideoLoader from './FarmVideoLoader'
import FarmScrollReveal from './FarmScrollReveal'

export default function ClientIslandWrapper() {
  return (
    <>
      <FarmScrollReveal />
      <FarmExperiences />
      <FarmVideoLoader />
    </>
  )
}
