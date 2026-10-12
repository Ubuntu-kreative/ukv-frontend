'use client'

import { useEffect, useState } from 'react'
import { AdminTable, Btn, Td, Th, TrHover, T, kes, StatusBadge } from '@/components/admin/AdminShell'

type Booking = {
  id: string
  booking_reference: string
  resource_id: string
  guest_id: string
  status: string
  check_in_date: string
  check_out_date: string
  adults: number
  children: number
  total_amount: number
  currency: string
  payment_reference: string | null
  submitted_at: string | null
  guests?: { first_name: string; last_name: string; email: string } | null
}

export function PendingVerificationClient() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/bookings?status=pending_verification', { cache: 'no-store' })
      const body = await response.json()
      if (!response.ok) throw new Error(body.error || 'Could not load pending bookings')
      setBookings(body.data ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load pending bookings')
    } finally {
      setLoading(false)
    }
  }

  async function review(id: string, action: 'confirm_payment' | 'reject_payment') {
    setBusy(id)
    try {
      const response = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      })
      const body = await response.json()
      if (!response.ok) throw new Error(body.error || 'Could not update booking')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update booking')
    } finally {
      setBusy(null)
    }
  }

  useEffect(() => { void load() }, [])

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 16, marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, color: T.text, fontSize: 22 }}>Pending manual payments</h2>
          <p style={{ color: T.muted, fontSize: 13, margin: '6px 0 0' }}>Compare each code and amount with the M-Pesa statement before confirming.</p>
        </div>
        <Btn onClick={() => void load()}>Refresh</Btn>
      </div>
      {error && <p style={{ color: T.danger, background: '#FEE2E2', padding: 12, borderRadius: 8 }}>{error}</p>}
      {loading ? <p style={{ color: T.muted }}>Loading pending bookings...</p> : bookings.length === 0 ? <p style={{ color: T.muted }}>No bookings are waiting for payment verification.</p> : (
        <AdminTable>
          <thead><tr><Th>Guest / Reference</Th><Th>Booking dates</Th><Th>Amount due</Th><Th>Confirmation code</Th><Th>Submitted</Th><Th right>Action</Th></tr></thead>
          <tbody>{bookings.map(booking => (
            <TrHover key={booking.id}>
              <Td><strong>{booking.guests ? `${booking.guests.first_name} ${booking.guests.last_name}` : booking.guest_id}</strong><br /><span style={{ color: T.muted, fontSize: 11 }}>{booking.guests?.email || booking.booking_reference}</span></Td>
              <Td nowrap>{booking.check_in_date} to {booking.check_out_date}<br /><span style={{ color: T.muted, fontSize: 11 }}>{booking.adults} guest{booking.adults === 1 ? '' : 's'}</span></Td>
              <Td nowrap><strong>{kes(booking.total_amount)}</strong></Td>
              <Td><strong style={{ color: T.gold, fontSize: 16, letterSpacing: 1 }}>{booking.payment_reference || 'Missing code'}</strong><br /><StatusBadge status={booking.status} /></Td>
              <Td nowrap>{booking.submitted_at ? new Date(booking.submitted_at).toLocaleString('en-KE') : 'Unknown'}</Td>
              <Td right nowrap>
                <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                  <Btn variant="success" disabled={busy === booking.id} onClick={() => void review(booking.id, 'confirm_payment')}>Confirm Payment</Btn>
                  <Btn variant="danger" disabled={busy === booking.id} onClick={() => void review(booking.id, 'reject_payment')}>Reject / Invalid</Btn>
                </div>
              </Td>
            </TrHover>
          ))}</tbody>
        </AdminTable>
      )}
    </section>
  )
}
