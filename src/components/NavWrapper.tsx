'use client'

import LuxuryNav from './LuxuryNav'

/**
 * NavWrapper now serves as a simple wrapper for the new LuxuryNav component
 * The luxury navigation includes built-in cart functionality
 * All cart/journey features are handled directly within LuxuryNav
 */
export default function NavWrapper() {
  return <LuxuryNav />
}
