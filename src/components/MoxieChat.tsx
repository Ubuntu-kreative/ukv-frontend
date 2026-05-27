'use client'

import dynamic from 'next/dynamic'

/** Global luxury concierge — presence + chat on demand (lazy-loaded) */
const MoxieConcierge = dynamic(() => import('./moxie/MoxieConcierge'), {
  ssr: false,
  loading: () => null,
})

export default MoxieConcierge
