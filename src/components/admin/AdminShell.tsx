// src/components/admin/AdminShell.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Shared admin layout, nav, status badges, table primitives
// ─────────────────────────────────────────────────────────────────────────────

'use client'

import React, { useState, useTransition } from 'react'
import Link          from 'next/link'
import { usePathname } from 'next/navigation'
import type { AdminUser } from '@/lib/admin/auth'

// ── Design tokens ─────────────────────────────────────────────────────────────
export const T = {
  sidebar:   '#1A2E0F',
  sidebarHov:'#2D5016',
  sidebarAct:'#3B6B1A',
  accent:    '#7A9E3B',
  gold:      '#C8962A',
  text:      '#111827',
  muted:     '#6B7280',
  border:    '#E5E7EB',
  bg:        '#F9FAF7',
  card:      '#FFFFFF',
  danger:    '#DC2626',
  warning:   '#D97706',
  success:   '#16A34A',
  info:      '#2563EB',
}

// ── Status badge ──────────────────────────────────────────────────────────────
const STATUS_COLOUR: Record<string, { bg: string; text: string }> = {
  // booking
  pending:        { bg: '#FEF9C3', text: '#854D0E' },
  confirmed:      { bg: '#DCFCE7', text: '#14532D' },
  cancelled:      { bg: '#FEE2E2', text: '#991B1B' },
  checked_in:     { bg: '#DBEAFE', text: '#1E3A8A' },
  checked_out:    { bg: '#F3F4F6', text: '#374151' },
  payment_failed: { bg: '#FEE2E2', text: '#991B1B' },
  no_show:        { bg: '#FEF3C7', text: '#92400E' },
  // payment
  paid:           { bg: '#DCFCE7', text: '#14532D' },
  failed:         { bg: '#FEE2E2', text: '#991B1B' },
  refunded:       { bg: '#EDE9FE', text: '#4C1D95' },
  partial_refund: { bg: '#FEF3C7', text: '#92400E' },
  // room
  available:      { bg: '#DCFCE7', text: '#14532D' },
  occupied:       { bg: '#FEE2E2', text: '#991B1B' },
  maintenance:    { bg: '#FEF3C7', text: '#92400E' },
  cleaning:       { bg: '#DBEAFE', text: '#1E3A8A' },
  // inquiry
  new:            { bg: '#DBEAFE', text: '#1E3A8A' },
  in_progress:    { bg: '#FEF9C3', text: '#854D0E' },
  resolved:       { bg: '#DCFCE7', text: '#14532D' },
  spam:           { bg: '#F3F4F6', text: '#6B7280' },
  // priority
  low:            { bg: '#F3F4F6', text: '#6B7280' },
  normal:         { bg: '#DBEAFE', text: '#1E3A8A' },
  high:           { bg: '#FEF3C7', text: '#92400E' },
  urgent:         { bg: '#FEE2E2', text: '#991B1B' },
}

export function StatusBadge({ status }: { status: string }) {
  const c = STATUS_COLOUR[status] ?? { bg: '#F3F4F6', text: '#374151' }
  return (
    <span style={{
      display: 'inline-block', padding: '2px 10px', borderRadius: 20,
      fontSize: 11, fontWeight: 600, letterSpacing: '0.5px',
      textTransform: 'uppercase', background: c.bg, color: c.text,
      whiteSpace: 'nowrap',
    }}>
      {status.replace(/_/g, ' ')}
    </span>
  )
}

// ── KES formatter ─────────────────────────────────────────────────────────────
export function kes(n: number) {
  return 'KES ' + Math.round(n).toLocaleString('en-KE')
}

// ── Stat card ─────────────────────────────────────────────────────────────────
export function StatCard({
  label, value, sub, colour,
}: { label: string; value: string | number; sub?: string; colour?: string }) {
  return (
    <div style={{
      background: T.card, border: `0.5px solid ${T.border}`,
      borderRadius: 10, padding: '16px 20px',
      borderTop: `3px solid ${colour ?? T.accent}`,
    }}>
      <p style={{ margin: 0, fontSize: 12, color: T.muted, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</p>
      <p style={{ margin: '6px 0 0', fontSize: 26, fontWeight: 500, color: T.text }}>{value}</p>
      {sub && <p style={{ margin: '2px 0 0', fontSize: 12, color: T.muted }}>{sub}</p>}
    </div>
  )
}

// ── Table primitives ──────────────────────────────────────────────────────────
export function AdminTable({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ overflowX: 'auto', border: `0.5px solid ${T.border}`, borderRadius: 10 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        {children}
      </table>
    </div>
  )
}

export function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return (
    <th style={{
      padding: '10px 14px', textAlign: right ? 'right' : 'left',
      fontSize: 11, fontWeight: 600, color: T.muted,
      textTransform: 'uppercase', letterSpacing: 0.8,
      borderBottom: `0.5px solid ${T.border}`, background: T.bg,
      whiteSpace: 'nowrap',
    }}>
      {children}
    </th>
  )
}

export function Td({
  children, right, muted, nowrap,
}: { children: React.ReactNode; right?: boolean; muted?: boolean; nowrap?: boolean }) {
  return (
    <td style={{
      padding: '11px 14px', textAlign: right ? 'right' : 'left',
      color: muted ? T.muted : T.text, borderBottom: `0.5px solid ${T.border}`,
      whiteSpace: nowrap ? 'nowrap' : 'normal', verticalAlign: 'middle',
    }}>
      {children}
    </td>
  )
}

export function TrHover({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <tr
      style={{ background: hov ? '#F9FAF7' : 'transparent', cursor: onClick ? 'pointer' : 'default', transition: 'background 0.1s' }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
    >
      {children}
    </tr>
  )
}

// ── Search + filter bar ───────────────────────────────────────────────────────
export function SearchBar({
  value, onChange, placeholder,
}: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
      <span style={{
        position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
        color: T.muted, fontSize: 16, pointerEvents: 'none',
      }}>
        🔍
      </span>
      <input
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder ?? 'Search…'}
        style={{
          width: '100%', padding: '8px 12px 8px 34px',
          border: `0.5px solid ${T.border}`, borderRadius: 8,
          fontSize: 13, background: T.card, color: T.text,
          outline: 'none',
        }}
      />
    </div>
  )
}

export function FilterSelect({
  value, onChange, options, label,
}: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; label?: string }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        padding: '8px 10px', border: `0.5px solid ${T.border}`, borderRadius: 8,
        fontSize: 13, background: T.card, color: T.text, cursor: 'pointer',
      }}
      aria-label={label}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

// ── Action buttons ────────────────────────────────────────────────────────────
type BtnVariant = 'primary' | 'danger' | 'ghost' | 'warning' | 'success'

const BTN_STYLES: Record<BtnVariant, React.CSSProperties> = {
  primary: { background: T.sidebarAct,  color: '#FFF', border: 'none' },
  danger:  { background: T.danger,       color: '#FFF', border: 'none' },
  warning: { background: T.warning,      color: '#FFF', border: 'none' },
  success: { background: T.success,      color: '#FFF', border: 'none' },
  ghost:   { background: 'transparent',  color: T.text, border: `0.5px solid ${T.border}` },
}

export function Btn({
  children, onClick, variant = 'ghost', disabled, size = 'sm',
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: BtnVariant
  disabled?: boolean
  size?: 'sm' | 'md'
}) {
  const [pend, start] = useTransition()
  return (
    <button
      onClick={() => onClick && start(() => onClick())}
      disabled={disabled || pend}
      style={{
        ...BTN_STYLES[variant],
        padding:      size === 'sm' ? '5px 12px' : '8px 18px',
        fontSize:     size === 'sm' ? 12 : 14,
        borderRadius: 6,
        cursor:       disabled ? 'not-allowed' : 'pointer',
        opacity:      disabled || pend ? 0.6 : 1,
        fontFamily:   'inherit',
        whiteSpace:   'nowrap',
        transition:   'opacity 0.1s',
      }}
    >
      {pend ? '…' : children}
    </button>
  )
}

// ── Pagination ────────────────────────────────────────────────────────────────
export function Pagination({
  page, total, perPage, onChange,
}: { page: number; total: number; perPage: number; onChange: (p: number) => void }) {
  const pages = Math.ceil(total / perPage)
  if (pages <= 1) return null
  const start = (page - 1) * perPage + 1
  const end   = Math.min(page * perPage, total)

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, fontSize: 12, color: T.muted }}>
      <span>{start}–{end} of {total}</span>
      <div style={{ display: 'flex', gap: 4 }}>
        {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => onChange(p)} style={{
            width: 28, height: 28, border: `0.5px solid ${T.border}`, borderRadius: 6,
            background: p === page ? T.sidebarAct : 'transparent',
            color: p === page ? '#FFF' : T.text, cursor: 'pointer', fontSize: 12,
          }}>
            {p}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export function Modal({
  open, title, onClose, children, width = 520,
}: { open: boolean; title: string; onClose: () => void; children: React.ReactNode; width?: number }) {
  if (!open) return null
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 16,
    }} onClick={onClose}>
      <div style={{
        background: T.card, borderRadius: 12, width: '100%', maxWidth: width,
        maxHeight: '90vh', overflow: 'auto', padding: '24px 28px',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 500, color: T.text }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: T.muted }}>×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────
export function EmptyState({ message }: { message: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 24px', color: T.muted }}>
      <p style={{ fontSize: 15, margin: 0 }}>{message}</p>
    </div>
  )
}

// ── Sidebar nav ───────────────────────────────────────────────────────────────
const NAV = [
  { href: '/admin',            label: 'Dashboard',  icon: '⌂'  },
  { href: '/admin/bookings',   label: 'Bookings',   icon: '📋' },
  { href: '/admin/payments',   label: 'Payments',   icon: '💳' },
  { href: '/admin/calendar',   label: 'Calendar',   icon: '📅' },
  { href: '/admin/inquiries',  label: 'Inquiries',  icon: '💬' },
  { href: '/admin/rooms',      label: 'Rooms',      icon: '🛏' },
]

export function AdminShell({
  user,
  children,
  title,
}: { user: AdminUser; children: React.ReactNode; title?: string }) {
  const path = usePathname()

  return (
    <div style={{ display: 'flex', minHeight: '100dvh', background: T.bg }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, background: T.sidebar, display: 'flex',
        flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100dvh',
      }}>
        <div style={{ padding: '20px 18px 12px' }}>
          <p style={{ margin: 0, color: T.accent, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' }}>Ubuntu Kreative Village</p>
          <p style={{ margin: '2px 0 0', color: '#FFF', fontSize: 14, fontWeight: 500 }}>Admin</p>
        </div>

        <nav style={{ flex: 1, padding: '8px 10px' }}>
          {NAV.map(n => {
            const active = path === n.href || (n.href !== '/admin' && path.startsWith(n.href))
            return (
              <Link key={n.href} href={n.href} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 8, marginBottom: 2,
                background: active ? T.sidebarAct : 'transparent',
                color: active ? '#FFF' : 'rgba(255,255,255,0.65)',
                textDecoration: 'none', fontSize: 13, fontWeight: active ? 500 : 400,
                transition: 'background 0.15s',
              }}>
                <span style={{ fontSize: 15 }}>{n.icon}</span>
                {n.label}
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: '14px 18px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 500 }}>{user.name}</p>
          <p style={{ margin: '2px 0 0', color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{user.role.replace('_', ' ')}</p>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {title && (
          <header style={{
            padding: '16px 28px', borderBottom: `0.5px solid ${T.border}`,
            background: T.card, position: 'sticky', top: 0, zIndex: 10,
          }}>
            <h1 style={{ margin: 0, fontSize: 17, fontWeight: 500, color: T.text }}>{title}</h1>
          </header>
        )}
        <div style={{ flex: 1, padding: 28 }}>
          {children}
        </div>
      </main>
    </div>
  )
}