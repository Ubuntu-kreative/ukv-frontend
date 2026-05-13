'use client'

import { useState } from 'react'
import { SectionDivider } from '@/components/ui/SectionDivider'
import { CALENDAR_EVENTS } from '@/lib/data'
import { useCartStore } from '@/context/cartStore'
import type { VillageEvent } from '@/types'
import toast from 'react-hot-toast'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

export function CalendarSection() {
  const [year,  setYear]  = useState(2026)
  const [month, setMonth] = useState(4) // 0-indexed, 4 = May
  const [selected, setSelected] = useState<number | null>(null)
  const { items, addItem } = useCartStore()

  const shiftMonth = (d: number) => {
    let m = month + d, y = year
    if (m > 11) { m = 0; y++ }
    if (m < 0)  { m = 11; y-- }
    setMonth(m); setYear(y); setSelected(null)
  }

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()

  const eventsThisMonth = CALENDAR_EVENTS.filter(
    (e) => e.month === month && e.year === year
  )
  const eventDays = eventsThisMonth.map((e) => e.day)
  const privateDays = eventsThisMonth.filter((e) => e.type === 'corporate').map((e) => e.day)

  const selectedEvents = selected
    ? eventsThisMonth.filter((e) => e.day === selected)
    : []

  const handleAddEvent = (ev: VillageEvent) => {
    const id = `cal-${ev.id}`
    if (items.some((i) => i.id === id)) {
      toast('Already in your booking', { icon: '✦' })
      return
    }
    addItem({ id, name: ev.name, tag: ev.type, category: 'event-public', price: ev.price, unit: '/ person' })
    toast.success(`${ev.name} added`)
  }

  return (
    <div className="animate-fade-up px-8 md:px-10 py-14">
      <SectionDivider label="Village Schedule" />

      <h2
        className="text-[40px] font-light mb-2"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        What&apos;s{' '}
        <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>happening</em>
      </h2>
      <p className="text-[13px] mb-10" style={{ color: 'var(--muted)' }}>
        Browse upcoming events and availability. Click any highlighted date to add it to your cart.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">

        {/* ── Calendar Grid ── */}
        <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', padding: '28px' }}>

          {/* Month navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => shiftMonth(-1)}
              className="px-3 py-1.5 text-[13px] transition-colors"
              style={{ border: '0.5px solid var(--border2)', color: 'var(--cream)', background: 'none', cursor: 'pointer' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)'; (e.currentTarget as HTMLElement).style.color = 'var(--gold)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border2)'; (e.currentTarget as HTMLElement).style.color = 'var(--cream)' }}
            >
              ←
            </button>
            <h3
              className="text-[24px] font-light"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {MONTHS[month]} {year}
            </h3>
            <button
              onClick={() => shiftMonth(1)}
              className="px-3 py-1.5 text-[13px] transition-colors"
              style={{ border: '0.5px solid var(--border2)', color: 'var(--cream)', background: 'none', cursor: 'pointer' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)'; (e.currentTarget as HTMLElement).style.color = 'var(--gold)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border2)'; (e.currentTarget as HTMLElement).style.color = 'var(--cream)' }}
            >
              →
            </button>
          </div>

          {/* Day names */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map((d) => (
              <div
                key={d}
                className="text-center text-[9px] tracking-[0.1em] uppercase py-1"
                style={{ color: 'var(--muted)', fontFamily: 'var(--font-body)' }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-[2px]">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const d = i + 1
              const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear()
              const hasEv = eventDays.includes(d)
              const isPrivate = privateDays.includes(d)
              const isSel = selected === d

              return (
                <button
                  key={d}
                  onClick={() => setSelected(d === selected ? null : d)}
                  className="relative flex flex-col items-center justify-center text-[12px] transition-all duration-150"
                  style={{
                    aspectRatio: '1',
                    border: isSel ? '0.5px solid var(--gold)' : '0.5px solid transparent',
                    background: isSel ? 'var(--gold-dim)' : 'transparent',
                    color: isSel || isToday ? 'var(--gold)' : 'var(--cream)',
                    fontWeight: isToday ? '500' : '300',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSel) {
                      ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(200,168,75,0.4)'
                      ;(e.currentTarget as HTMLElement).style.color = 'var(--gold)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSel) {
                      ;(e.currentTarget as HTMLElement).style.borderColor = 'transparent'
                      ;(e.currentTarget as HTMLElement).style.color = isToday ? 'var(--gold)' : 'var(--cream)'
                    }
                  }}
                >
                  {d}
                  {hasEv && (
                    <span
                      className="absolute bottom-[4px] w-[4px] h-[4px] rounded-full"
                      style={{ background: isPrivate ? 'var(--gold)' : 'var(--sage)' }}
                    />
                  )}
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex gap-5 mt-4">
            {[
              { color: 'var(--sage)', label: 'Village Event' },
              { color: 'var(--gold)', label: 'Private Booking' },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span
                  className="w-[5px] h-[5px] rounded-full"
                  style={{ background: l.color }}
                />
                <span
                  className="text-[10px]"
                  style={{ color: 'var(--muted)', fontFamily: 'var(--font-body)' }}
                >
                  {l.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="flex flex-col gap-3">
          {/* Selected day events */}
          {selectedEvents.length > 0 && selectedEvents.map((ev) => (
            <div
              key={ev.id}
              className="p-5 animate-fade-up"
              style={{
                background: 'var(--bg2)',
                border: '0.5px solid var(--gold)',
              }}
            >
              <p
                className="text-[9px] tracking-[0.15em] uppercase mb-1.5"
                style={{ color: 'var(--sage2)', fontFamily: 'var(--font-body)' }}
              >
                {MONTHS[month].slice(0,3)} {ev.day}, {year}
              </p>
              <h4
                className="text-[18px] font-light mb-1"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {ev.name}
              </h4>
              <p className="text-[11px] mb-1" style={{ color: 'var(--muted)' }}>
                {ev.description}
              </p>
              {ev.spotsLeft !== undefined && (
                <p className="text-[10px] mb-3" style={{ color: ev.spotsLeft === 0 ? 'var(--rust)' : 'var(--sage2)' }}>
                  {ev.spotsLeft === 0 ? 'Fully booked' : `${ev.spotsLeft} spots left`}
                </p>
              )}
              <p
                className="text-[18px] font-light mb-3"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)' }}
              >
                KES {ev.price.toLocaleString()} <span className="text-[12px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-body)' }}>/ person</span>
              </p>
              {ev.spotsLeft !== 0 && (
                <button
                  onClick={() => handleAddEvent(ev)}
                  className="btn-outline-gold w-full"
                >
                  + Add to Cart
                </button>
              )}
            </div>
          ))}

          {/* Upcoming events list */}
          <p
            className="text-[9px] tracking-[0.2em] uppercase"
            style={{ color: 'var(--muted)', fontFamily: 'var(--font-body)' }}
          >
            Upcoming Events
          </p>
          {eventsThisMonth.map((ev) => (
            <button
              key={ev.id}
              onClick={() => { setSelected(ev.day); handleAddEvent(ev) }}
              className="text-left p-4 transition-all duration-200"
              style={{ background: 'var(--bg2)', border: '0.5px solid var(--border2)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border2)' }}
            >
              <p
                className="text-[9px] tracking-[0.15em] uppercase mb-1"
                style={{ color: 'var(--sage2)', fontFamily: 'var(--font-body)' }}
              >
                {MONTHS[month].slice(0,3)} {ev.day}
              </p>
              <p
                className="text-[16px] font-light"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {ev.name}
              </p>
              <p className="text-[11px]" style={{ color: 'var(--muted)' }}>
                {ev.type}
              </p>
            </button>
          ))}

          {eventsThisMonth.length === 0 && (
            <p className="text-[12px]" style={{ color: 'var(--muted)' }}>
              No events scheduled this month. Navigate to find upcoming dates.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
