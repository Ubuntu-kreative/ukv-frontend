'use client'
// ─────────────────────────────────────────────────────────────────────────────
// src/components/bsf/BsfDashboardClient.tsx
//
// PRODUCTION UPGRADE — what changed from v1:
//
// 1. LIVE CHECKLIST  — items persist to Supabase via /api/bsf/checklist
//                      on toggle. Loads live state on mount. Shows who
//                      completed each item + timestamp.
//
// 2. LIVE SHIPMENT LOG — real shipments fetched from Supabase on mount.
//                        "Log Shipment" button opens inline form. Saves
//                        to /api/bsf/shipments. Table updates immediately.
//
// 3. PRODUCTION LOG  — new section: weekly harvest numbers entered by
//                      farm team via "Log Week" form. Saves to
//                      /api/bsf/production. Shows last 8 weeks as a
//                      mini bar chart + raw table.
//
// 4. STAT CARDS      — "Actions complete" counter now reflects live DB
//                      state, not static prop data.
//
// 5. LOADING + ERROR STATES — every async section has skeleton/error UI.
//
// Aesthetics, palette, typography, spacing — 100% preserved from v1.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react'
import type {
  Milestone,
  ProductLine,
  ActionItem,
  ShipmentEntry,
} from '@/server/bsf/bsf-admin.data'

// ─── Types ────────────────────────────────────────────────────────────────────

type Meta = {
  documentTitle:      string
  preparedDate:       string
  classification:     string
  exportDestination:  string
  supplyStartDate:    string
  firstShipmentTarget: string
}

type Props = {
  meta:          Meta
  milestones:    Milestone[]
  productLines:  ProductLine[]
  clientActions: ActionItem[]
  shipmentLog:   ShipmentEntry[]   // static seed — overridden by live fetch
}

// Live DB shapes (snake_case from Supabase)
type DbChecklistItem = {
  id:           string
  completed:    boolean
  completed_by: string | null
  completed_at: string | null
}

type DbShipment = {
  id:              string
  week_of:         string
  product_id:      string
  committed_kg:    number
  actual_kg:       number | null
  qc_passed:       boolean | null
  tracking_number: string | null
  carrier:         string | null
  notes:           string | null
  dispatched_at:   string | null
  created_by:      string | null
  created_at:      string
}

type DbProductionEntry = {
  id:            string
  week_of:       string
  eggs_kg:       number
  neonates_kg:   number
  larvae_kg:     number
  mortality_pct: number | null
  feed_input_kg: number | null
  notes:         string | null
  logged_by:     string | null
  created_at:    string
}

// ─── Palette (unchanged from v1) ──────────────────────────────────────────────

const GOLD        = '#D4A853'
const GOLD_DIM    = 'rgba(212,168,83,0.12)'
const GOLD_BORDER = 'rgba(212,168,83,0.22)'
const GREEN       = '#00C853'
const RED         = '#FF5252'
const BLUE        = '#A8D8F0'
const CREAM       = 'rgba(255,255,255,0.85)'
const MUTED       = 'rgba(255,255,255,0.38)'
const SUBTLE      = 'rgba(255,255,255,0.06)'
const BORDER      = 'rgba(255,255,255,0.07)'

// ─── Shared primitives (unchanged from v1) ────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
      <span style={{ display: 'block', width: 28, height: 1, background: GOLD, opacity: 0.5 }} />
      <h2 style={{
        color: GOLD, fontSize: 10, letterSpacing: '0.24em',
        textTransform: 'uppercase', fontWeight: 400, margin: 0,
      }}>
        {children}
      </h2>
    </div>
  )
}

function Card({
  children, accent, style,
}: { children: React.ReactNode; accent?: boolean; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: accent ? GOLD_DIM : SUBTLE,
      border: `1px solid ${accent ? GOLD_BORDER : BORDER}`,
      borderRadius: 14, padding: '22px 24px', ...style,
    }}>
      {children}
    </div>
  )
}

function Badge({ status }: { status: 'completed' | 'active' | 'upcoming' }) {
  const map = {
    completed: { label: '✓ Completed', color: GREEN,  bg: 'rgba(0,200,83,0.1)',     border: 'rgba(0,200,83,0.25)' },
    active:    { label: '● Active',    color: GOLD,   bg: GOLD_DIM,                 border: GOLD_BORDER           },
    upcoming:  { label: '○ Upcoming',  color: MUTED,  bg: 'rgba(255,255,255,0.04)', border: BORDER                },
  }
  const s = map[status]
  return (
    <span style={{
      padding: '3px 10px', borderRadius: 20, fontSize: 9,
      letterSpacing: '0.14em', textTransform: 'uppercase',
      color: s.color, background: s.bg, border: `1px solid ${s.border}`,
    }}>
      {s.label}
    </span>
  )
}

function Skeleton({ width = '100%', height = 16 }: { width?: string | number; height?: number }) {
  return (
    <div style={{
      width, height, borderRadius: 4,
      background: 'rgba(255,255,255,0.06)',
      animation: 'bsf-pulse 1.6s ease-in-out infinite',
    }} />
  )
}

// ─── Input helper ─────────────────────────────────────────────────────────────

function FormInput({
  label, type = 'text', value, onChange, placeholder, required, min, max, step,
}: {
  label: string; type?: string; value: string; onChange: (v: string) => void
  placeholder?: string; required?: boolean; min?: string; max?: string; step?: string
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ color: MUTED, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
        {label}{required && <span style={{ color: RED, marginLeft: 2 }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        step={step}
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${BORDER}`,
          borderRadius: 8, padding: '9px 12px',
          color: CREAM, fontSize: 13,
          outline: 'none', width: '100%',
          fontFamily: 'inherit',
          transition: 'border-color 0.15s',
        }}
        onFocus={e => (e.target.style.borderColor = GOLD_BORDER)}
        onBlur={e  => (e.target.style.borderColor = BORDER)}
      />
    </div>
  )
}

function FormSelect({
  label, value, onChange, options, required,
}: {
  label: string; value: string; onChange: (v: string) => void
  options: { value: string; label: string }[]; required?: boolean
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ color: MUTED, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
        {label}{required && <span style={{ color: RED, marginLeft: 2 }}>*</span>}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        style={{
          background: 'rgba(20,22,18,0.95)',
          border: `1px solid ${BORDER}`,
          borderRadius: 8, padding: '9px 12px',
          color: CREAM, fontSize: 13,
          outline: 'none', width: '100%',
          fontFamily: 'inherit', cursor: 'pointer',
        }}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

// ─── Milestone timeline (unchanged from v1) ───────────────────────────────────

function MilestoneTimeline({ milestones }: { milestones: Milestone[] }) {
  const maxKg = 30
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {milestones.map((m, i) => {
        const kg     = m.eggsMaxKg ?? m.eggsMinKg
        const pct    = Math.round((kg / maxKg) * 100)
        const isLast = i === milestones.length - 1
        return (
          <div key={m.id} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <div style={{
                width: 10, height: 10, borderRadius: '50%',
                background: m.status === 'completed' ? GREEN : m.status === 'active' ? GOLD : 'rgba(255,255,255,0.18)',
                marginTop: 4, flexShrink: 0,
                boxShadow: m.status === 'active' ? `0 0 10px ${GOLD}66` : 'none',
              }} />
              {!isLast && <div style={{ width: 1, flex: 1, minHeight: 32, background: 'rgba(255,255,255,0.07)', marginTop: 4 }} />}
            </div>
            <div style={{ flex: 1, paddingBottom: isLast ? 0 : 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                <span style={{ color: m.status === 'active' ? CREAM : MUTED, fontSize: 13, fontWeight: m.status === 'active' ? 500 : 400 }}>
                  {m.period}
                </span>
                <Badge status={m.status} />
              </div>
              <div style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ color: MUTED, fontSize: 11 }}>BSF Eggs</span>
                  <span style={{ color: m.status === 'active' ? GOLD : CREAM, fontSize: 13, fontWeight: 500 }}>
                    {m.eggsMaxKg ? `${m.eggsMinKg}–${m.eggsMaxKg} kg/wk` : `${m.eggsMinKg} kg/wk`}
                    {m.id === 'm5' && <span style={{ color: GOLD, fontSize: 9, marginLeft: 6, letterSpacing: '0.12em' }}>FULL SCALE</span>}
                  </span>
                </div>
                <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                  <div style={{
                    width: `${pct}%`, height: '100%', borderRadius: 2,
                    background: m.status === 'completed' ? GREEN
                      : m.status === 'active' ? `linear-gradient(90deg, ${GOLD}, ${GOLD}bb)`
                      : 'rgba(255,255,255,0.15)',
                    transition: 'width 0.8s ease',
                  }} />
                </div>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.32)', fontSize: 11, lineHeight: 1.6, margin: 0 }}>{m.notes}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Product lines (unchanged from v1) ────────────────────────────────────────

function ProductLines({ lines }: { lines: ProductLine[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
      {lines.map(line => (
        <Card key={line.id} accent={line.active}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <span style={{ color: CREAM, fontSize: 14, fontWeight: 500 }}>{line.name}</span>
            <span style={{
              padding: '3px 10px', borderRadius: 20, fontSize: 9,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: line.active ? GREEN : MUTED,
              background: line.active ? 'rgba(0,200,83,0.1)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${line.active ? 'rgba(0,200,83,0.25)' : BORDER}`,
            }}>
              {line.active ? '● Active' : '○ Pending'}
            </span>
          </div>
          <div style={{ marginBottom: 14 }}>
            <span style={{ color: GOLD, fontSize: 28, fontWeight: 300, lineHeight: 1 }}>{line.weeklyMinKg} kg</span>
            <span style={{ color: MUTED, fontSize: 11, marginLeft: 6 }}>/ week minimum</span>
          </div>
          {line.conditional && (
            <div style={{
              padding: '10px 12px', borderRadius: 8,
              background: 'rgba(212,168,83,0.06)',
              border: `1px solid ${GOLD_BORDER}`, marginBottom: 10,
            }}>
              <p style={{ color: 'rgba(212,168,83,0.7)', fontSize: 10, lineHeight: 1.6, margin: 0 }}>
                ⚠ Conditional supply — {line.conditionNote}
              </p>
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}

// ─── LIVE Checklist ───────────────────────────────────────────────────────────

function ActionChecklist({ actions }: { actions: ActionItem[] }) {
  const [checked,  setChecked]  = useState<Record<string, boolean>>(
    Object.fromEntries(actions.map(a => [a.id, a.completed]))
  )
  const [meta,     setMeta]     = useState<Record<string, DbChecklistItem>>({})
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState<string | null>(null)
  const [error,    setError]    = useState<string | null>(null)

  // Load live state from DB
  useEffect(() => {
    fetch('/api/bsf/checklist')
      .then(r => r.json())
      .then(({ items }: { items: DbChecklistItem[] }) => {
        const map: Record<string, boolean> = {}
        const metaMap: Record<string, DbChecklistItem> = {}
        items.forEach(item => {
          map[item.id]     = item.completed
          metaMap[item.id] = item
        })
        setChecked(map)
        setMeta(metaMap)
      })
      .catch(() => setError('Could not load checklist from server'))
      .finally(() => setLoading(false))
  }, [])

  const toggle = async (id: string) => {
    const next = !checked[id]
    setChecked(prev => ({ ...prev, [id]: next }))
    setSaving(id)
    try {
      const res = await fetch('/api/bsf/checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, completed: next }),
      })
      if (!res.ok) throw new Error('Save failed')
    } catch {
      // Revert on failure
      setChecked(prev => ({ ...prev, [id]: !next }))
      setError('Failed to save — check your connection')
    } finally {
      setSaving(null)
    }
  }

  const total = actions.length
  const done  = Object.values(checked).filter(Boolean).length

  const responsibleColor = { client: BLUE, ubuntu: GOLD, both: '#B8A9F0' }
  const responsibleLabel = { client: 'Client', ubuntu: 'Ubuntu', both: 'Both parties' }

  return (
    <div>
      {/* Error banner */}
      {error && (
        <div style={{
          padding: '10px 14px', borderRadius: 8, marginBottom: 14,
          background: 'rgba(255,82,82,0.08)', border: '1px solid rgba(255,82,82,0.2)',
        }}>
          <p style={{ color: RED, fontSize: 11, margin: 0 }}>⚠ {error}</p>
        </div>
      )}

      {/* Progress summary */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20,
        padding: '14px 18px', borderRadius: 10, background: SUBTLE, border: `1px solid ${BORDER}`,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          border: `2px solid ${done === total ? GREEN : GOLD}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {loading ? (
            <span style={{ color: MUTED, fontSize: 11 }}>…</span>
          ) : (
            <span style={{ color: done === total ? GREEN : GOLD, fontSize: 14, fontWeight: 500 }}>
              {done}/{total}
            </span>
          )}
        </div>
        <div>
          <p style={{ color: CREAM, fontSize: 13, margin: 0, marginBottom: 3 }}>
            {loading ? 'Loading checklist…'
              : done === total ? 'All actions complete ✓'
              : `${total - done} action${total - done === 1 ? '' : 's'} outstanding`}
          </p>
          <p style={{ color: MUTED, fontSize: 11, margin: 0 }}>
            Pre-shipment checklist · Source: PDF Section 6 · Saves automatically
          </p>
        </div>
      </div>

      {/* Action items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {actions.map(action => {
          const isChecked = checked[action.id] ?? false
          const isSaving  = saving === action.id
          const itemMeta  = meta[action.id]

          return (
            <div
              key={action.id}
              onClick={() => !isSaving && toggle(action.id)}
              style={{
                display: 'flex', gap: 14, alignItems: 'flex-start',
                padding: '14px 16px', borderRadius: 10,
                background: isChecked ? 'rgba(0,200,83,0.05)' : SUBTLE,
                border: `1px solid ${isChecked ? 'rgba(0,200,83,0.2)' : BORDER}`,
                cursor: isSaving ? 'wait' : 'pointer',
                transition: 'all 0.2s',
                opacity: isSaving ? 0.7 : 1,
              }}
            >
              {/* Checkbox */}
              <div style={{
                width: 20, height: 20, borderRadius: 5,
                border: `1.5px solid ${isChecked ? GREEN : 'rgba(255,255,255,0.2)'}`,
                background: isChecked ? 'rgba(0,200,83,0.15)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginTop: 1, transition: 'all 0.15s',
              }}>
                {isSaving ? (
                  <span style={{ color: MUTED, fontSize: 9 }}>…</span>
                ) : isChecked ? (
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke={GREEN} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : null}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'flex-start', gap: 8, flexWrap: 'wrap', marginBottom: 4,
                }}>
                  <span style={{
                    color: isChecked ? MUTED : CREAM, fontSize: 13, fontWeight: 400,
                    textDecoration: isChecked ? 'line-through' : 'none', transition: 'all 0.2s',
                  }}>
                    {action.title}
                  </span>
                  <span style={{
                    padding: '2px 8px', borderRadius: 20, fontSize: 8,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: responsibleColor[action.responsible],
                    background: `${responsibleColor[action.responsible]}14`,
                    border: `1px solid ${responsibleColor[action.responsible]}30`,
                    flexShrink: 0,
                  }}>
                    {responsibleLabel[action.responsible]}
                  </span>
                </div>

                <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 11, lineHeight: 1.6, margin: 0 }}>
                  {action.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginTop: 4 }}>
                  {action.dueNote && !isChecked && (
                    <p style={{
                      color: GOLD, fontSize: 9, letterSpacing: '0.1em',
                      textTransform: 'uppercase', margin: 0,
                    }}>
                      ◷ {action.dueNote}
                    </p>
                  )}
                  {isChecked && itemMeta?.completed_by && (
                    <p style={{ color: 'rgba(0,200,83,0.5)', fontSize: 9, margin: 0 }}>
                      ✓ {itemMeta.completed_by}
                      {itemMeta.completed_at && ` · ${new Date(itemMeta.completed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}`}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── LIVE Shipment Log ────────────────────────────────────────────────────────

const EMPTY_SHIPMENT_FORM = {
  week_of:         '',
  product_id:      'bsf-eggs',
  committed_kg:    '',
  actual_kg:       '',
  qc_passed:       '',
  tracking_number: '',
  carrier:         '',
  notes:           '',
  dispatched_at:   '',
}

function ShipmentLogSection({ seedLog }: { seedLog: ShipmentEntry[] }) {
  const [shipments, setShipments] = useState<DbShipment[]>([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState<string | null>(null)
  const [showForm,  setShowForm]  = useState(false)
  const [saving,    setSaving]    = useState(false)
  const [form,      setForm]      = useState(EMPTY_SHIPMENT_FORM)

  const load = useCallback(() => {
    setLoading(true)
    fetch('/api/bsf/shipments')
      .then(r => r.json())
      .then(({ shipments: data }: { shipments: DbShipment[] }) => setShipments(data ?? []))
      .catch(() => setError('Could not load shipments'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const handleSubmit = async () => {
    if (!form.week_of || !form.committed_kg) return
    setSaving(true)
    try {
      const res = await fetch('/api/bsf/shipments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          week_of:         form.week_of,
          product_id:      form.product_id,
          committed_kg:    parseFloat(form.committed_kg),
          actual_kg:       form.actual_kg       ? parseFloat(form.actual_kg)       : undefined,
          qc_passed:       form.qc_passed === 'true' ? true : form.qc_passed === 'false' ? false : undefined,
          tracking_number: form.tracking_number || undefined,
          carrier:         form.carrier         || undefined,
          notes:           form.notes           || undefined,
          dispatched_at:   form.dispatched_at   || undefined,
        }),
      })
      if (!res.ok) throw new Error('Save failed')
      setForm(EMPTY_SHIPMENT_FORM)
      setShowForm(false)
      load()
    } catch {
      setError('Failed to save shipment')
    } finally {
      setSaving(false)
    }
  }

  const f = (k: keyof typeof form) => (v: string) => setForm(prev => ({ ...prev, [k]: v }))

  return (
    <div>
      {error && (
        <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 14, background: 'rgba(255,82,82,0.08)', border: '1px solid rgba(255,82,82,0.2)' }}>
          <p style={{ color: RED, fontSize: 11, margin: 0 }}>⚠ {error}</p>
        </div>
      )}

      {/* Log shipment button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
        <button
          onClick={() => setShowForm(v => !v)}
          style={{
            padding: '8px 18px', borderRadius: 8, fontSize: 11,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            background: showForm ? SUBTLE : GOLD_DIM,
            border: `1px solid ${showForm ? BORDER : GOLD_BORDER}`,
            color: showForm ? MUTED : GOLD, cursor: 'pointer',
            fontFamily: 'inherit', transition: 'all 0.2s',
          }}
        >
          {showForm ? '✕ Cancel' : '+ Log Shipment'}
        </button>
      </div>

      {/* Inline form */}
      {showForm && (
        <Card style={{ marginBottom: 20 }}>
          <p style={{ color: GOLD, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16, marginTop: 0 }}>
            New Shipment Entry
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 14 }}>
            <FormInput label="Week of (date)"   type="date"   value={form.week_of}         onChange={f('week_of')}         required />
            <FormSelect label="Product"          value={form.product_id}      onChange={f('product_id')}      required
              options={[{ value: 'bsf-eggs', label: 'BSF Eggs' }, { value: 'bsf-neonates', label: 'BSF Neonates' }]}
            />
            <FormInput label="Committed (kg)"   type="number" value={form.committed_kg}    onChange={f('committed_kg')}    required min="0" step="0.01" />
            <FormInput label="Actual (kg)"       type="number" value={form.actual_kg}       onChange={f('actual_kg')}       min="0" step="0.01" />
            <FormSelect label="QC Result"        value={form.qc_passed}       onChange={f('qc_passed')}
              options={[{ value: '', label: '— Pending —' }, { value: 'true', label: '✓ Pass' }, { value: 'false', label: '✗ Fail' }]}
            />
            <FormInput label="Tracking No."      value={form.tracking_number} onChange={f('tracking_number')} placeholder="e.g. KQ-12345" />
            <FormInput label="Carrier"           value={form.carrier}         onChange={f('carrier')}         placeholder="e.g. Kenya Airways Cargo" />
            <FormInput label="Dispatched at"     type="datetime-local" value={form.dispatched_at} onChange={f('dispatched_at')} />
          </div>
          <FormInput label="Notes" value={form.notes} onChange={f('notes')} placeholder="Any relevant notes about this shipment" />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
            <button
              onClick={handleSubmit}
              disabled={saving || !form.week_of || !form.committed_kg}
              style={{
                padding: '10px 28px', borderRadius: 8, fontSize: 12,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                background: saving ? SUBTLE : '#00C853',
                border: 'none', color: saving ? MUTED : '#050805',
                cursor: saving ? 'wait' : 'pointer',
                fontFamily: 'inherit', fontWeight: 600,
                opacity: (!form.week_of || !form.committed_kg) ? 0.5 : 1,
                transition: 'all 0.2s',
              }}
            >
              {saving ? 'Saving…' : 'Save Shipment'}
            </button>
          </div>
        </Card>
      )}

      {/* Table */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1,2,3].map(i => <Skeleton key={i} height={44} />)}
        </div>
      ) : shipments.length === 0 && seedLog.length === 0 ? (
        <div style={{ padding: '32px 24px', textAlign: 'center', borderRadius: 12, border: `1px dashed ${BORDER}` }}>
          <p style={{ color: MUTED, fontSize: 13, margin: 0 }}>
            No shipments recorded yet. First shipment target: 9 June 2026.
          </p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr>
                {['Week of', 'Product', 'Committed', 'Actual', 'QC', 'Carrier', 'Tracking', 'Notes'].map(h => (
                  <th key={h} style={{
                    padding: '8px 12px', textAlign: 'left', color: MUTED,
                    fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase',
                    borderBottom: `1px solid ${BORDER}`, fontWeight: 400,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shipments.map(s => (
                <tr key={s.id} style={{ transition: 'background 0.15s' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                >
                  <td style={{ padding: '10px 12px', color: CREAM,  borderBottom: `1px solid ${BORDER}` }}>
                    {new Date(s.week_of).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                  </td>
                  <td style={{ padding: '10px 12px', color: MUTED,  borderBottom: `1px solid ${BORDER}` }}>{s.product_id}</td>
                  <td style={{ padding: '10px 12px', color: CREAM,  borderBottom: `1px solid ${BORDER}` }}>{s.committed_kg} kg</td>
                  <td style={{ padding: '10px 12px', color: s.actual_kg != null ? CREAM : MUTED, borderBottom: `1px solid ${BORDER}` }}>
                    {s.actual_kg != null ? `${s.actual_kg} kg` : '—'}
                  </td>
                  <td style={{ padding: '10px 12px', borderBottom: `1px solid ${BORDER}` }}>
                    {s.qc_passed == null ? <span style={{ color: MUTED }}>—</span>
                      : s.qc_passed    ? <span style={{ color: GREEN }}>✓ Pass</span>
                      :                  <span style={{ color: RED   }}>✗ Fail</span>}
                  </td>
                  <td style={{ padding: '10px 12px', color: MUTED,  borderBottom: `1px solid ${BORDER}` }}>{s.carrier         ?? '—'}</td>
                  <td style={{ padding: '10px 12px', color: BLUE,   borderBottom: `1px solid ${BORDER}` }}>{s.tracking_number ?? '—'}</td>
                  <td style={{ padding: '10px 12px', color: MUTED,  borderBottom: `1px solid ${BORDER}` }}>{s.notes           ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ─── LIVE Production Log ──────────────────────────────────────────────────────

const EMPTY_PROD_FORM = {
  week_of:       '',
  eggs_kg:       '',
  neonates_kg:   '',
  larvae_kg:     '',
  mortality_pct: '',
  feed_input_kg: '',
  notes:         '',
}

function ProductionLogSection() {
  const [entries,  setEntries]  = useState<DbProductionEntry[]>([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saving,   setSaving]   = useState(false)
  const [form,     setForm]     = useState(EMPTY_PROD_FORM)

  const load = useCallback(() => {
    setLoading(true)
    fetch('/api/bsf/production')
      .then(r => r.json())
      .then(({ log }: { log: DbProductionEntry[] }) => setEntries(log ?? []))
      .catch(() => setError('Could not load production log'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const handleSubmit = async () => {
    if (!form.week_of || !form.eggs_kg) return
    setSaving(true)
    try {
      const res = await fetch('/api/bsf/production', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          week_of:       form.week_of,
          eggs_kg:       parseFloat(form.eggs_kg),
          neonates_kg:   form.neonates_kg   ? parseFloat(form.neonates_kg)   : 0,
          larvae_kg:     form.larvae_kg     ? parseFloat(form.larvae_kg)     : 0,
          mortality_pct: form.mortality_pct ? parseFloat(form.mortality_pct) : undefined,
          feed_input_kg: form.feed_input_kg ? parseFloat(form.feed_input_kg) : undefined,
          notes:         form.notes         || undefined,
        }),
      })
      if (!res.ok) throw new Error('Save failed')
      setForm(EMPTY_PROD_FORM)
      setShowForm(false)
      load()
    } catch {
      setError('Failed to save production entry')
    } finally {
      setSaving(false)
    }
  }

  const f = (k: keyof typeof form) => (v: string) => setForm(prev => ({ ...prev, [k]: v }))

  // Mini bar chart — last 8 weeks
  const chartData = [...entries].reverse().slice(-8)
  const chartMax  = Math.max(...chartData.map(e => e.eggs_kg), 3)

  return (
    <div>
      {error && (
        <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 14, background: 'rgba(255,82,82,0.08)', border: '1px solid rgba(255,82,82,0.2)' }}>
          <p style={{ color: RED, fontSize: 11, margin: 0 }}>⚠ {error}</p>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
        <button
          onClick={() => setShowForm(v => !v)}
          style={{
            padding: '8px 18px', borderRadius: 8, fontSize: 11,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            background: showForm ? SUBTLE : GOLD_DIM,
            border: `1px solid ${showForm ? BORDER : GOLD_BORDER}`,
            color: showForm ? MUTED : GOLD, cursor: 'pointer',
            fontFamily: 'inherit', transition: 'all 0.2s',
          }}
        >
          {showForm ? '✕ Cancel' : '+ Log Week'}
        </button>
      </div>

      {/* Inline form */}
      {showForm && (
        <Card style={{ marginBottom: 20 }}>
          <p style={{ color: GOLD, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16, marginTop: 0 }}>
            Weekly Production Entry
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, marginBottom: 14 }}>
            <FormInput label="Week of (date)"   type="date"   value={form.week_of}       onChange={f('week_of')}       required />
            <FormInput label="Eggs (kg)"         type="number" value={form.eggs_kg}       onChange={f('eggs_kg')}       required min="0" step="0.01" />
            <FormInput label="Neonates (kg)"     type="number" value={form.neonates_kg}   onChange={f('neonates_kg')}   min="0" step="0.01" />
            <FormInput label="Larvae (kg)"       type="number" value={form.larvae_kg}     onChange={f('larvae_kg')}     min="0" step="0.01" />
            <FormInput label="Mortality (%)"     type="number" value={form.mortality_pct} onChange={f('mortality_pct')} min="0" max="100" step="0.1" />
            <FormInput label="Feed input (kg)"   type="number" value={form.feed_input_kg} onChange={f('feed_input_kg')} min="0" step="0.1" />
          </div>
          <FormInput label="Notes" value={form.notes} onChange={f('notes')} placeholder="Any relevant notes about this production week" />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
            <button
              onClick={handleSubmit}
              disabled={saving || !form.week_of || !form.eggs_kg}
              style={{
                padding: '10px 28px', borderRadius: 8, fontSize: 12,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                background: saving ? SUBTLE : '#00C853',
                border: 'none', color: saving ? MUTED : '#050805',
                cursor: saving ? 'wait' : 'pointer',
                fontFamily: 'inherit', fontWeight: 600,
                opacity: (!form.week_of || !form.eggs_kg) ? 0.5 : 1,
                transition: 'all 0.2s',
              }}
            >
              {saving ? 'Saving…' : 'Save Entry'}
            </button>
          </div>
        </Card>
      )}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1,2,3].map(i => <Skeleton key={i} height={44} />)}
        </div>
      ) : entries.length === 0 ? (
        <div style={{ padding: '32px 24px', textAlign: 'center', borderRadius: 12, border: `1px dashed ${BORDER}` }}>
          <p style={{ color: MUTED, fontSize: 13, margin: 0 }}>
            No production data yet. Log your first week above.
          </p>
        </div>
      ) : (
        <>
          {/* Mini bar chart */}
          {chartData.length > 0 && (
            <Card style={{ marginBottom: 20 }}>
              <p style={{ color: MUTED, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 14, marginTop: 0 }}>
                Eggs kg/week — last {chartData.length} weeks
              </p>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
                {chartData.map(e => {
                  const pct = (e.eggs_kg / chartMax) * 100
                  return (
                    <div key={e.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <span style={{ color: GOLD, fontSize: 8 }}>{e.eggs_kg}</span>
                      <div style={{ width: '100%', borderRadius: '3px 3px 0 0', background: `linear-gradient(to top, ${GOLD}, ${GOLD}88)`, height: `${pct}%`, minHeight: 3, transition: 'height 0.5s ease' }} />
                      <span style={{ color: MUTED, fontSize: 7, letterSpacing: '0.04em', writingMode: 'vertical-lr', transform: 'rotate(180deg)', whiteSpace: 'nowrap' }}>
                        {new Date(e.week_of).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  )
                })}
              </div>
            </Card>
          )}

          {/* Raw table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr>
                  {['Week of', 'Eggs kg', 'Neonates kg', 'Larvae kg', 'Mortality %', 'Feed kg', 'Logged by', 'Notes'].map(h => (
                    <th key={h} style={{
                      padding: '8px 12px', textAlign: 'left', color: MUTED,
                      fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase',
                      borderBottom: `1px solid ${BORDER}`, fontWeight: 400,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {entries.map(e => (
                  <tr key={e.id}
                    style={{ transition: 'background 0.15s' }}
                    onMouseEnter={ev => ((ev.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)')}
                    onMouseLeave={ev => ((ev.currentTarget as HTMLElement).style.background = 'transparent')}
                  >
                    <td style={{ padding: '10px 12px', color: CREAM, borderBottom: `1px solid ${BORDER}` }}>
                      {new Date(e.week_of).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </td>
                    <td style={{ padding: '10px 12px', color: GOLD,  borderBottom: `1px solid ${BORDER}`, fontWeight: 500 }}>{e.eggs_kg}</td>
                    <td style={{ padding: '10px 12px', color: e.neonates_kg > 0 ? CREAM : MUTED, borderBottom: `1px solid ${BORDER}` }}>{e.neonates_kg || '—'}</td>
                    <td style={{ padding: '10px 12px', color: e.larvae_kg   > 0 ? CREAM : MUTED, borderBottom: `1px solid ${BORDER}` }}>{e.larvae_kg   || '—'}</td>
                    <td style={{ padding: '10px 12px', color: e.mortality_pct != null ? (e.mortality_pct > 10 ? RED : CREAM) : MUTED, borderBottom: `1px solid ${BORDER}` }}>
                      {e.mortality_pct != null ? `${e.mortality_pct}%` : '—'}
                    </td>
                    <td style={{ padding: '10px 12px', color: MUTED, borderBottom: `1px solid ${BORDER}` }}>{e.feed_input_kg ?? '—'}</td>
                    <td style={{ padding: '10px 12px', color: MUTED, borderBottom: `1px solid ${BORDER}`, fontSize: 10 }}>{e.logged_by ?? '—'}</td>
                    <td style={{ padding: '10px 12px', color: MUTED, borderBottom: `1px solid ${BORDER}` }}>{e.notes ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Main dashboard export ────────────────────────────────────────────────────

export function BsfDashboardClient({
  meta,
  milestones,
  productLines,
  clientActions,
  shipmentLog,
}: Props) {
  // Live checklist count — fetched independently so stat card reflects DB
  const [liveCompleted, setLiveCompleted] = useState<number | null>(null)
  const totalActions = clientActions.length

  useEffect(() => {
    fetch('/api/bsf/checklist')
      .then(r => r.json())
      .then(({ items }: { items: DbChecklistItem[] }) => {
        setLiveCompleted(items.filter(i => i.completed).length)
      })
      .catch(() => {/* fallback to static count */})
  }, [])

  const completedActions = liveCompleted ?? clientActions.filter(a => a.completed).length

  return (
    <>
      {/* Pulse animation for skeleton loaders */}
      <style>{`
        @keyframes bsf-pulse {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.8; }
        }
      `}</style>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 28px 80px' }}>

        {/* ── Header (unchanged) ── */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ color: GOLD, fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', marginBottom: 10 }}>
            {meta.exportDestination} · Export Programme
          </p>
          <h1 style={{
            color: CREAM, fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 300,
            lineHeight: 1.1, marginBottom: 12, fontFamily: 'var(--font-display, serif)',
          }}>
            BSF Supply Dashboard
          </h1>
          <p style={{ color: MUTED, fontSize: 13 }}>
            {meta.documentTitle} · Prepared {meta.preparedDate} ·{' '}
            <span style={{ color: 'rgba(212,168,83,0.55)' }}>{meta.classification}</span>
          </p>
        </div>

        {/* ── Summary stat cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 52 }}>
          {[
            { label: 'Supply start',    value: 'Jun 2026', note: 'Week 2 · 9 June target'  },
            { label: 'Launch volume',   value: '3 kg/wk',  note: 'BSF Eggs minimum'         },
            { label: 'Nov 2026 target', value: '30 kg/wk', note: 'Full-scale production'    },
            {
              label: 'Actions complete',
              value: `${completedActions}/${totalActions}`,
              note: completedActions === totalActions ? 'All done ✓' : 'See checklist below',
            },
          ].map(stat => (
            <Card key={stat.label}>
              <p style={{ color: MUTED, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 8 }}>
                {stat.label}
              </p>
              <p style={{ color: GOLD, fontSize: 24, fontWeight: 300, margin: 0, lineHeight: 1 }}>{stat.value}</p>
              <p style={{ color: 'rgba(255,255,255,0.22)', fontSize: 10, margin: '6px 0 0' }}>{stat.note}</p>
            </Card>
          ))}
        </div>

        {/* ── Two-column: Milestones + Products ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)', gap: 32, marginBottom: 52, alignItems: 'start' }}>
          <div>
            <SectionHeading>Production scale-up · Jun–Nov 2026</SectionHeading>
            <MilestoneTimeline milestones={milestones} />
          </div>
          <div>
            <SectionHeading>Available product lines</SectionHeading>
            <ProductLines lines={productLines} />
            <div style={{ marginTop: 20 }}>
              <Card>
                <p style={{ color: GOLD, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10 }}>
                  Quality &amp; reliability commitment
                </p>
                {[
                  'Rigorous pre-shipment quality checks per consignment',
                  'Cold-chain integrity maintained throughout export',
                  'Agreed egg viability and hatch rate specifications',
                  'Transparent communication at every ramp-up stage',
                  'Early notification if production exceeds milestones',
                ].map(point => (
                  <p key={point} style={{ color: 'rgba(255,255,255,0.38)', fontSize: 11, lineHeight: 1.7, margin: 0, paddingBottom: 6, borderBottom: `1px solid ${BORDER}`, marginBottom: 6 }}>
                    ↗ {point}
                  </p>
                ))}
              </Card>
            </div>
          </div>
        </div>

        {/* ── Production Log (NEW) ── */}
        <div style={{ marginBottom: 52 }}>
          <SectionHeading>Weekly farm production log</SectionHeading>
          <ProductionLogSection />
        </div>

        {/* ── Action checklist (LIVE) ── */}
        <div style={{ marginBottom: 52 }}>
          <SectionHeading>Pre-shipment action checklist · Section 6</SectionHeading>
          <ActionChecklist actions={clientActions} />
        </div>

        {/* ── Shipment log (LIVE) ── */}
        <div style={{ marginBottom: 52 }}>
          <SectionHeading>Weekly shipment log</SectionHeading>
          <ShipmentLogSection seedLog={shipmentLog} />
        </div>

        {/* ── Document footer (unchanged) ── */}
        <div style={{
          marginTop: 60, paddingTop: 24, borderTop: `1px solid ${BORDER}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          flexWrap: 'wrap', gap: 12,
        }}>
          <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: 10, lineHeight: 1.7, margin: 0 }}>
            {meta.classification}<br />
            For further information contact your Ubuntu account representative.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.14)', fontSize: 10, margin: 0 }}>
            Ubuntu | BSF Export Programme | {meta.preparedDate}
          </p>
        </div>
      </main>
    </>
  )
}