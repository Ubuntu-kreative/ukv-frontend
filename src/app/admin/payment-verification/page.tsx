import { requireAdmin } from '@/lib/admin/auth'
import { AdminShell } from '@/components/admin/AdminShell'
import { PendingVerificationClient } from './PendingVerificationClient'

export default async function PaymentVerificationPage() {
  const user = await requireAdmin('bookings.read')
  return (
    <AdminShell user={user} title="M-Pesa Payment Verification">
      <PendingVerificationClient />
    </AdminShell>
  )
}
