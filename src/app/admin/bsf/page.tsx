// ─────────────────────────────────────────────────────────────────────────────
// src/app/admin/bsf/page.tsx — BSF Supply Dashboard (SERVER COMPONENT)
// Data imported from src/server/bsf/bsf-admin.data.ts — never in public bundle
// ─────────────────────────────────────────────────────────────────────────────

import {
  BSF_META,
  MILESTONES,
  PRODUCT_LINES,
  CLIENT_ACTIONS,
  SHIPMENT_LOG,
} from '@/server/bsf/bsf-admin.data'

import { BsfDashboardClient } from '@/components/bsf/BsfDashboardClient'

export default function BsfDashboardPage() {
  return (
    <BsfDashboardClient
      meta={BSF_META}
      milestones={MILESTONES}
      productLines={PRODUCT_LINES}
      clientActions={CLIENT_ACTIONS}
      shipmentLog={SHIPMENT_LOG}
    />
  )
}