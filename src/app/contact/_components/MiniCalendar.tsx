'use client'

// ─────────────────────────────────────────────────────────────
// MiniCalendar.tsx
//
// FIXES vs original VillageCalendar:
//  1. Day grid was recalculated on every render → now useMemo
//  2. Event lookup was O(n) scan per cell → now Map for O(1)
//  3. Framer Motion on every cell → pure CSS transitions
//  4. Calendar was full-width + huge → now max-w-sm, compact
//  5. No selectedDate state caused full re-render on any parent state change
//  6. Month navigation was broken (no year rollover)
// ─────────────────────────────────────────────────────────────

import { useState, useMemo, useCallback, memo } from 'react'
import { CALENDAR_EVENTS, MONTHS, DAYS, type CalendarEvent } from '../_data/booking-data'

interface MiniCalendarProps {
  onDateClick?: (dateStr: string) => void
  onEventClick?: (event: CalendarEvent) => void
}

// Build O(1) lookup: "YYYY-M-D" → CalendarEvent[]
const EVENT_MAP = new Map<string, CalendarEvent[]>()
for (const ev of CALENDAR_EVENTS) {
  const key = `${ev.year}-${ev.month}-${ev.day}`
  const arr = EVENT_MAP.get(key) ?? []
  arr.push(ev)
  EVENT_MAP.set(key, arr)
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate()
}
function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month - 1, 1).getDay()
}

export const MiniCalendar = memo(function MiniCalendar({
  onDateClick,
  onEventClick,
}: MiniCalendarProps) {
  const today = new Date()
  const [viewYear,  setViewYear]  = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1) // 1-based
  const [selected,  setSelected]  = useState<string | null>(null)
  const [hoveredEvent, setHoveredEvent] = useState<CalendarEvent | null>(null)

  // Stable navigation handlers
  const prevMonth = useCallback(() => {
    setViewMonth(m => {
      if (m === 1) { setViewYear(y => y - 1); return 12 }
      return m - 1
    })
  }, [])

  const nextMonth = useCallback(() => {
    setViewMonth(m => {
      if (m === 12) { setViewYear(y => y + 1); return 1 }
      return m + 1
    })
  }, [])

  // Day grid — only recalculates when month/year changes
  const { days, firstDow, totalDays } = useMemo(() => ({
    totalDays: getDaysInMonth(viewYear, viewMonth),
    firstDow:  getFirstDayOfWeek(viewYear, viewMonth),
    days:      Array.from({ length: getDaysInMonth(viewYear, viewMonth) }, (_, i) => i + 1),
  }), [viewYear, viewMonth])

  const isToday = useCallback((day: number) =>
    day === today.getDate() && viewMonth === today.getMonth() + 1 && viewYear === today.getFullYear(),
  [viewMonth, viewYear, today])

  const isPast = useCallback((day: number) => {
    const d = new Date(viewYear, viewMonth - 1, day)
    d.setHours(0,0,0,0)
    const t = new Date(); t.setHours(0,0,0,0)
    return d < t
  }, [viewYear, viewMonth])

  const handleDayClick = useCallback((day: number) => {
    if (isPast(day)) return
    const dateStr = `${viewYear}-${String(viewMonth).padStart(2,'0')}-${String(day).padStart(2,'0')}`
    setSelected(dateStr)
    onDateClick?.(dateStr)
  }, [viewYear, viewMonth, isPast, onDateClick])

  // Empty cells before first day
  const leadingBlanks = Array.from({ length: firstDow })

  return (
    <div className="w-full max-w-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="w-7 h-7 flex items-center justify-center rounded transition-colors text-white/40 hover:text-[var(--gold)] hover:bg-white/5"
          aria-label="Previous month"
        >
          ‹
        </button>

        <div className="text-center">
          <p className="font-display text-base font-light text-white/90 leading-none">
            {MONTHS[viewMonth - 1]}
          </p>
          <p className="font-mono text-[10px] text-white/30 mt-0.5">{viewYear}</p>
        </div>

        <button
          onClick={nextMonth}
          className="w-7 h-7 flex items-center justify-center rounded transition-colors text-white/40 hover:text-[var(--gold)] hover:bg-white/5"
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center font-body text-[9px] uppercase tracking-wider text-white/20 py-1">
            {d[0]}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-px">
        {leadingBlanks.map((_, i) => <div key={`blank-${i}`} />)}

        {days.map(day => {
          const key         = `${viewYear}-${viewMonth}-${day}`
          const events      = EVENT_MAP.get(key) ?? []
          const hasEvent    = events.length > 0
          const dateStr     = `${viewYear}-${String(viewMonth).padStart(2,'0')}-${String(day).padStart(2,'0')}`
          const isSelected  = selected === dateStr
          const past        = isPast(day)
          const todayMark   = isToday(day)

          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              disabled={past}
              className={[
                'relative flex flex-col items-center justify-start py-1.5 rounded transition-all duration-150 group',
                past        ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer hover:bg-white/5',
                isSelected  ? 'bg-[var(--gold)]/15 ring-1 ring-[var(--gold)]/50' : '',
                todayMark   ? 'ring-1 ring-white/20' : '',
              ].filter(Boolean).join(' ')}
              aria-label={`${day} ${MONTHS[viewMonth - 1]}${hasEvent ? ` — ${events.length} event${events.length > 1 ? 's' : ''}` : ''}`}
            >
              <span className={[
                'font-mono text-[11px] leading-none',
                isSelected  ? 'text-[var(--gold)]' : '',
                todayMark   ? 'text-white font-bold' : '',
                !isSelected && !todayMark ? 'text-white/60' : '',
              ].filter(Boolean).join(' ')}>
                {day}
              </span>

              {/* Event dots */}
              {hasEvent && (
                <div className="flex gap-px mt-1 justify-center">
                  {events.slice(0, 3).map(ev => (
                    <span
                      key={ev.id}
                      className="w-1 h-1 rounded-full flex-shrink-0"
                      style={{ background: ev.color }}
                    />
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap gap-3">
        {[
          { color: 'var(--neon)',  label: 'Public' },
          { color: 'var(--gold)', label: 'Corporate' },
          { color: '#D4906A',     label: 'Dining' },
          { color: '#F0A8B8',     label: 'Spa / Private' },
          { color: '#A8D4B4',     label: 'Experiences' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
            <span className="font-body text-[9px] text-white/30 uppercase tracking-wider">{label}</span>
          </div>
        ))}
      </div>

      {/* Upcoming events for current month */}
      <UpcomingEvents month={viewMonth} year={viewYear} onEventClick={onEventClick} />
    </div>
  )
})

// Upcoming events list — separate memo component so calendar grid never re-renders for this
const UpcomingEvents = memo(function UpcomingEvents({
  month, year, onEventClick,
}: {
  month: number
  year: number
  onEventClick?: (ev: CalendarEvent) => void
}) {
  const events = useMemo(() =>
    CALENDAR_EVENTS
      .filter(e => e.month === month && e.year === year)
      .sort((a, b) => a.day - b.day),
  [month, year])

  if (events.length === 0) return null

  return (
    <div className="mt-4 space-y-1.5">
      <p className="font-body text-[9px] uppercase tracking-[0.2em] text-white/25 mb-2">
        {MONTHS[month - 1]} Events
      </p>
      {events.map(ev => (
        <button
          key={ev.id}
          onClick={() => onEventClick?.(ev)}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded text-left transition-colors hover:bg-white/5 group"
        >
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: ev.color }} />
          <div className="flex-1 min-w-0">
            <p className="font-body text-[11px] text-white/70 truncate group-hover:text-white/90 transition-colors">
              {ev.name}
            </p>
            <p className="font-mono text-[9px] text-white/25">
              {ev.day} {MONTHS[ev.month - 1].slice(0, 3)}
              {ev.spotsLeft !== undefined && ev.spotsLeft > 0 && (
                <span className="ml-2 text-[var(--neon)]/60">{ev.spotsLeft} spots</span>
              )}
              {ev.spotsLeft === 0 && (
                <span className="ml-2 text-red-400/60">Full</span>
              )}
            </p>
          </div>
          <span className="font-mono text-[9px] text-[var(--gold)]/60 flex-shrink-0">
            KES {ev.price.toLocaleString()}
          </span>
        </button>
      ))}
    </div>
  )
})