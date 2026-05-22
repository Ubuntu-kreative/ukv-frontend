// src/components/calendar/BookingCalendar.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Ubuntu Kreative Village — Booking Calendar
// Month + week view with occupied / available / maintenance states.
// ─────────────────────────────────────────────────────────────────────────────

'use client'

import React, { useMemo } from 'react'
import {
  toISO,
  formatMonthYear,
  formatWeekRange,
  startOfWeek,
  addDays,
  DayInfo,
  DateStatus,
} from '@/lib/calendar/calendarService'
import {
  useCalendarNavigation,
  useCalendarMonth,
  useAvailabilityMap,
  useDateRangeSelection,
  CalendarView,
} from '@/lib/calendar/useCalendar'

// ── Design tokens (matches UKV brand) ─────────────────────────────────────────
const STATUS_STYLES: Record<DateStatus, {
  bg:         string
  text:       string
  border:     string
  dot:        string
  label:      string
}> = {
  available:   { bg: '#F0F7E6', text: '#2D5016', border: '#7A9E3B', dot: '#7A9E3B',  label: 'Available'    },
  occupied:    { bg: '#FEF2F2', text: '#991B1B', border: '#FCA5A5', dot: '#EF4444',  label: 'Occupied'     },
  maintenance: { bg: '#FFF7ED', text: '#92400E', border: '#FCD34D', dot: '#F59E0B',  label: 'Maintenance'  },
  partial:     { bg: '#EFF6FF', text: '#1E3A5F', border: '#93C5FD', dot: '#3B82F6',  label: 'Partial'      },
  loading:     { bg: '#F9FAFB', text: '#9CA3AF', border: '#E5E7EB', dot: '#D1D5DB',  label: 'Loading'      },
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface DayCellProps {
  date:         Date
  dayInfo?:     DayInfo
  isToday:      boolean
  isSelected:   boolean
  isInRange:    boolean
  isRangeStart: boolean
  isRangeEnd:   boolean
  isOtherMonth: boolean
  compact?:     boolean
  onClick:      () => void
  onMouseEnter: () => void
}

function DayCell({
  date, dayInfo, isToday, isSelected,
  isInRange, isRangeStart, isRangeEnd,
  isOtherMonth, compact, onClick, onMouseEnter,
}: DayCellProps) {
  const status  = dayInfo?.status ?? 'available'
  const style   = STATUS_STYLES[status]
  const dayNum  = date.getDate()
  const blocked = status === 'occupied' || status === 'maintenance'

  const cellStyle: React.CSSProperties = {
    position:      'relative',
    display:       'flex',
    flexDirection: 'column',
    alignItems:    'center',
    justifyContent:'center',
    minHeight:     compact ? 40 : 64,
    borderRadius:  8,
    border:        isSelected
      ? '2px solid #2D5016'
      : isRangeStart || isRangeEnd
        ? `2px solid ${style.border}`
        : `1px solid transparent`,
    background:    isInRange
      ? '#E8F5D0'
      : isSelected || isRangeStart || isRangeEnd
        ? style.bg
        : isOtherMonth
          ? 'transparent'
          : status !== 'available'
            ? style.bg
            : 'transparent',
    cursor:        blocked ? 'not-allowed' : 'pointer',
    opacity:       isOtherMonth ? 0.35 : 1,
    transition:    'background 0.1s, border-color 0.1s',
    padding:       4,
    userSelect:    'none',
  }

  return (
    <div
      style={cellStyle}
      onClick={blocked ? undefined : onClick}
      onMouseEnter={onMouseEnter}
      title={dayInfo?.note}
      role="button"
      aria-label={`${toISO(date)} — ${style.label}${dayInfo?.note ? ': ' + dayInfo.note : ''}`}
      aria-pressed={isSelected}
      aria-disabled={blocked}
    >
      {/* Day number */}
      <span style={{
        fontSize:   compact ? 13 : 14,
        fontWeight: isToday ? 700 : 400,
        color:      isToday
          ? '#2D5016'
          : isOtherMonth
            ? '#9CA3AF'
            : style.text,
        lineHeight: 1,
      }}>
        {dayNum}
      </span>

      {/* Today indicator */}
      {isToday && (
        <span style={{
          position:     'absolute',
          bottom:       4,
          width:        4,
          height:       4,
          borderRadius: '50%',
          background:   '#2D5016',
        }} />
      )}

      {/* Status dot (non-available days) */}
      {!isOtherMonth && status !== 'available' && status !== 'loading' && (
        <span style={{
          position:     'absolute',
          top:          6,
          right:        6,
          width:        6,
          height:       6,
          borderRadius: '50%',
          background:   style.dot,
        }} aria-hidden="true" />
      )}
    </div>
  )
}

// Day-of-week header
function WeekHeader({ compact }: { compact?: boolean }) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return (
    <>
      {days.map(d => (
        <div key={d} style={{
          textAlign:     'center',
          fontSize:      11,
          fontWeight:    500,
          color:         '#6B7280',
          textTransform: 'uppercase',
          letterSpacing: 1,
          padding:       compact ? '4px 0' : '8px 0',
        }}>
          {compact ? d.slice(0, 1) : d}
        </div>
      ))}
    </>
  )
}

// Legend
function Legend() {
  return (
    <div style={{
      display:    'flex',
      flexWrap:   'wrap',
      gap:        12,
      marginTop:  16,
      paddingTop: 12,
      borderTop:  '1px solid #E5E7EB',
    }}>
      {(['available', 'partial', 'occupied', 'maintenance'] as DateStatus[]).map(s => {
        const st = STATUS_STYLES[s]
        return (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              display:      'inline-block',
              width:        10,
              height:       10,
              borderRadius: '50%',
              background:   st.dot,
              flexShrink:   0,
            }} />
            <span style={{ fontSize: 12, color: '#6B7280' }}>{st.label}</span>
          </div>
        )
      })}
    </div>
  )
}

// Selected day detail panel
function DayDetail({
  iso,
  dayInfo,
  checkIn,
  checkOut,
  onClear,
}: {
  iso:      string
  dayInfo?: DayInfo
  checkIn:  string | null
  checkOut: string | null
  onClear:  () => void
}) {
  const status = dayInfo?.status ?? 'available'
  const style  = STATUS_STYLES[status]

  return (
    <div style={{
      marginTop:    16,
      padding:      '14px 16px',
      borderRadius: 8,
      background:   style.bg,
      border:       `1px solid ${style.border}`,
      display:      'flex',
      justifyContent: 'space-between',
      alignItems:   'center',
      flexWrap:     'wrap',
      gap:          8,
    }}>
      <div>
        <p style={{ margin: 0, fontWeight: 500, fontSize: 14, color: style.text }}>
          {new Date(iso + 'T00:00:00').toLocaleDateString('en-KE', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
          })}
        </p>
        <p style={{ margin: '2px 0 0', fontSize: 12, color: style.text, opacity: 0.8 }}>
          {style.label}
          {dayInfo?.note ? ` — ${dayInfo.note}` : ''}
          {dayInfo?.bookingIds?.length
            ? ` · ${dayInfo.bookingIds.length} booking${dayInfo.bookingIds.length > 1 ? 's' : ''}`
            : ''}
        </p>
        {checkIn && checkOut && (
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#2D5016', fontWeight: 500 }}>
            Range: {checkIn} → {checkOut}
          </p>
        )}
      </div>
      <button
        onClick={onClear}
        style={{
          background: 'transparent',
          border:     `1px solid ${style.border}`,
          borderRadius: 6,
          padding:    '4px 10px',
          fontSize:   12,
          color:      style.text,
          cursor:     'pointer',
        }}
      >
        Clear
      </button>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export interface BookingCalendarProps {
  /** Called when user selects a date range */
  onRangeSelected?: (checkIn: string, checkOut: string) => void
  /** Highlight a specific room's bookings only */
  roomId?:          string
  /** Initial view mode */
  defaultView?:     CalendarView
  /** Show/hide the range-selection UX */
  selectable?:      boolean
  className?:       string
  style?:           React.CSSProperties
}

export function BookingCalendar({
  onRangeSelected,
  roomId,
  defaultView  = 'month',
  selectable   = true,
  className,
  style: styleProp,
}: BookingCalendarProps) {
  const today = toISO(new Date())

  const nav = useCalendarNavigation(defaultView)
  const { data, isLoading, error, refresh } = useCalendarMonth(nav.year, nav.month)
  const availMap = useAvailabilityMap(data, roomId)

  const range = useDateRangeSelection(
    selectable ? onRangeSelected : undefined
  )

  // For week view — ensure we also have the month loaded that contains the anchor week
  const weekMonthYear  = nav.anchorDate.getFullYear()
  const weekMonthMonth = nav.anchorDate.getMonth()
  const needsExtraMonth =
    nav.view === 'week' &&
    (weekMonthYear !== nav.year || weekMonthMonth !== nav.month)
  const { data: weekData } = useCalendarMonth(
    needsExtraMonth ? weekMonthYear  : nav.year,
    needsExtraMonth ? weekMonthMonth : nav.month,
  )
  const weekAvailMap = useAvailabilityMap(
    needsExtraMonth ? weekData : data,
    roomId,
  )

  // Build the grid of cells
  const cells = useMemo(() => {
    if (nav.view === 'month') {
      const firstDay = new Date(nav.year, nav.month, 1).getDay()
      const days = nav.monthDays
      const leadingBlanks: (Date | null)[] = Array(firstDay).fill(null)
      return [...leadingBlanks, ...days]
    }
    return nav.weekDays
  }, [nav.view, nav.year, nav.month, nav.monthDays, nav.weekDays])

  const title = nav.view === 'month'
    ? formatMonthYear(nav.year, nav.month)
    : formatWeekRange(
        startOfWeek(nav.anchorDate),
        addDays(startOfWeek(nav.anchorDate), 6),
      )

  const resolveDay = (date: Date): DayInfo | undefined => {
    const iso = toISO(date)
    return nav.view === 'week' && needsExtraMonth
      ? weekAvailMap[iso]
      : availMap[iso]
  }

  return (
    <div
      className={className}
      style={{
        background:   '#FFFFFF',
        borderRadius: 12,
        border:       '1px solid #E5E7EB',
        padding:      '20px 20px 16px',
        ...styleProp,
      }}
    >
      {/* ── Header ── */}
      <div style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        marginBottom:   16,
        flexWrap:       'wrap',
        gap:            8,
      }}>
        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={nav.goToPrev}
            aria-label="Previous"
            style={{
              border: '1px solid #E5E7EB', borderRadius: 6, background: 'transparent',
              padding: '6px 10px', cursor: 'pointer', fontSize: 16, lineHeight: 1,
            }}
          >
            ‹
          </button>
          <h2 style={{
            margin: 0, fontSize: 16, fontWeight: 500,
            color: '#111827', minWidth: 180, textAlign: 'center',
          }}>
            {title}
          </h2>
          <button
            onClick={nav.goToNext}
            aria-label="Next"
            style={{
              border: '1px solid #E5E7EB', borderRadius: 6, background: 'transparent',
              padding: '6px 10px', cursor: 'pointer', fontSize: 16, lineHeight: 1,
            }}
          >
            ›
          </button>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <button
            onClick={nav.goToToday}
            style={{
              border: '1px solid #E5E7EB', borderRadius: 6, background: 'transparent',
              padding: '6px 12px', cursor: 'pointer', fontSize: 13, color: '#374151',
            }}
          >
            Today
          </button>
          <div style={{
            display: 'flex', borderRadius: 6, border: '1px solid #E5E7EB', overflow: 'hidden',
          }}>
            {(['month', 'week'] as CalendarView[]).map(v => (
              <button
                key={v}
                onClick={() => nav.setView(v)}
                style={{
                  padding:    '6px 12px',
                  fontSize:   13,
                  border:     'none',
                  cursor:     'pointer',
                  background: nav.view === v ? '#2D5016' : 'transparent',
                  color:      nav.view === v ? '#FFF'    : '#374151',
                  fontWeight: nav.view === v ? 500       : 400,
                }}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={refresh}
            title="Refresh availability"
            style={{
              border: '1px solid #E5E7EB', borderRadius: 6, background: 'transparent',
              padding: '6px 10px', cursor: 'pointer', fontSize: 14,
              color: isLoading ? '#9CA3AF' : '#374151',
            }}
            disabled={isLoading}
          >
            ↻
          </button>
        </div>
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div style={{
          padding: '10px 14px', marginBottom: 12, borderRadius: 6,
          background: '#FEF2F2', border: '1px solid #FCA5A5',
          fontSize: 13, color: '#991B1B',
        }}>
          {error} —{' '}
          <button
            onClick={refresh}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#991B1B', textDecoration: 'underline', padding: 0, fontSize: 13 }}
          >
            retry
          </button>
        </div>
      )}

      {/* ── Grid ── */}
      <div style={{ position: 'relative' }}>
        {isLoading && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 8, zIndex: 10, fontSize: 13, color: '#9CA3AF',
          }}>
            Loading availability…
          </div>
        )}

        <div style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap:                 nav.view === 'week' ? 8 : 4,
        }}>
          <WeekHeader compact={nav.view === 'month'} />

          {cells.map((date, i) => {
            if (!date) {
              return <div key={`blank-${i}`} />
            }
            const iso     = toISO(date)
            const dayInfo = resolveDay(date)
            const status  = dayInfo?.status ?? 'available'

            return (
              <DayCell
                key={iso}
                date={date}
                dayInfo={dayInfo}
                isToday={iso === today}
                isSelected={nav.selectedDate === iso}
                isInRange={range.isInRange(iso)}
                isRangeStart={range.isRangeStart(iso)}
                isRangeEnd={range.isRangeEnd(iso)}
                isOtherMonth={
                  nav.view === 'month' &&
                  (date.getMonth() !== nav.month || date.getFullYear() !== nav.year)
                }
                compact={nav.view === 'month'}
                onClick={() => {
                  nav.selectDate(iso)
                  if (selectable) range.onDateClick(iso, status)
                }}
                onMouseEnter={() => range.onDateHover(iso)}
              />
            )
          })}
        </div>
      </div>

      {/* ── Selected day detail ── */}
      {nav.selectedDate && (
        <DayDetail
          iso={nav.selectedDate}
          dayInfo={availMap[nav.selectedDate]}
          checkIn={range.checkIn}
          checkOut={range.checkOut}
          onClear={() => {
            nav.selectDate(null)
            range.clearRange()
          }}
        />
      )}

      {/* ── Selection hint ── */}
      {selectable && !nav.selectedDate && (
        <p style={{
          textAlign: 'center', fontSize: 12, color: '#9CA3AF',
          marginTop: 12, marginBottom: 0,
        }}>
          {range.isSelecting
            ? 'Select check-out date'
            : 'Click a date to start selecting a range'}
        </p>
      )}

      <Legend />
    </div>
  )
}

export default BookingCalendar