// src/lib/calendar/useCalendar.ts
// ─────────────────────────────────────────────────────────────────────────────
// Ubuntu Kreative Village — Calendar Hooks
// ─────────────────────────────────────────────────────────────────────────────

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  calendarService,
  CalendarMonth,
  DayInfo,
  DateStatus,
  toISO,
  addDays,
  startOfWeek,
  getDaysInMonth,
  getWeekDays,
} from './calendarService'

export type CalendarView = 'month' | 'week'

// ── useCalendarMonth ──────────────────────────────────────────────────────────
// Fetches and caches a single month's availability data.

interface UseCalendarMonthResult {
  data:       CalendarMonth | null
  isLoading:  boolean
  error:      string | null
  refresh:    () => void
}

export function useCalendarMonth(
  year:  number,
  month: number,
): UseCalendarMonthResult {
  const [data,      setData]      = useState<CalendarMonth | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error,     setError]     = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const fetch = useCallback(async () => {
    abortRef.current?.abort()
    abortRef.current = new AbortController()

    setIsLoading(true)
    setError(null)

    try {
      const result = await calendarService.fetchMonth(year, month)
      setData(result)
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError((err as Error).message ?? 'Failed to load availability')
      }
    } finally {
      setIsLoading(false)
    }
  }, [year, month])

  useEffect(() => {
    fetch()
    return () => abortRef.current?.abort()
  }, [fetch])

  const refresh = useCallback(() => {
    calendarService.invalidateMonth(year, month)
    fetch()
  }, [year, month, fetch])

  return { data, isLoading, error, refresh }
}

// ── useCalendarNavigation ─────────────────────────────────────────────────────
// Manages current date, view mode, and navigation helpers.

interface UseCalendarNavigationResult {
  view:          CalendarView
  setView:       (v: CalendarView) => void
  year:          number
  month:         number
  anchorDate:    Date             // used for week view
  goToPrev:      () => void
  goToNext:      () => void
  goToToday:     () => void
  selectedDate:  string | null
  selectDate:    (iso: string | null) => void
  monthDays:     Date[]
  weekDays:      Date[]
  visibleDays:   Date[]           // monthDays or weekDays depending on view
}

export function useCalendarNavigation(
  initialView: CalendarView = 'month',
): UseCalendarNavigationResult {
  const today = new Date()
  const [view,         setView]         = useState<CalendarView>(initialView)
  const [year,         setYear]         = useState(today.getFullYear())
  const [month,        setMonth]        = useState(today.getMonth())
  const [anchorDate,   setAnchorDate]   = useState(today)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const goToPrev = useCallback(() => {
    if (view === 'month') {
      setMonth(m => {
        if (m === 0) { setYear(y => y - 1); return 11 }
        return m - 1
      })
    } else {
      setAnchorDate(d => addDays(startOfWeek(d), -7))
    }
  }, [view])

  const goToNext = useCallback(() => {
    if (view === 'month') {
      setMonth(m => {
        if (m === 11) { setYear(y => y + 1); return 0 }
        return m + 1
      })
    } else {
      setAnchorDate(d => addDays(startOfWeek(d), 7))
    }
  }, [view])

  const goToToday = useCallback(() => {
    const now = new Date()
    setYear(now.getFullYear())
    setMonth(now.getMonth())
    setAnchorDate(now)
  }, [])

  const selectDate = useCallback((iso: string | null) => {
    setSelectedDate(prev => prev === iso ? null : iso)
  }, [])

  const monthDays   = getDaysInMonth(year, month)
  const weekDays    = getWeekDays(anchorDate)
  const visibleDays = view === 'month' ? monthDays : weekDays

  return {
    view, setView,
    year, month, anchorDate,
    goToPrev, goToNext, goToToday,
    selectedDate, selectDate,
    monthDays, weekDays, visibleDays,
  }
}

// ── useAvailabilityMap ────────────────────────────────────────────────────────
// Returns a flat { "YYYY-MM-DD": DayInfo } map, optionally filtered by room.

export function useAvailabilityMap(
  data:   CalendarMonth | null,
  roomId?: string,
): Record<string, DayInfo> {
  if (!data) return {}

  if (!roomId) return data.days

  // Filter to only include days where the specific room is booked/blocked
  const filtered: Record<string, DayInfo> = {}
  for (const [iso, day] of Object.entries(data.days)) {
    if (day.roomIds?.includes(roomId)) {
      filtered[iso] = day
    } else {
      filtered[iso] = { ...day, status: 'available', bookingIds: [], roomIds: [] }
    }
  }
  return filtered
}

// ── useDateRangeSelection ─────────────────────────────────────────────────────
// Manages selecting a check-in / check-out range for booking creation.

interface UseDateRangeSelectionResult {
  checkIn:     string | null
  checkOut:    string | null
  isSelecting: boolean
  hoveredDate: string | null
  onDateClick: (iso: string, status: DateStatus) => void
  onDateHover: (iso: string | null) => void
  clearRange:  () => void
  isInRange:   (iso: string) => boolean
  isRangeStart:(iso: string) => boolean
  isRangeEnd:  (iso: string) => boolean
}

export function useDateRangeSelection(
  onRangeSelected?: (checkIn: string, checkOut: string) => void,
): UseDateRangeSelectionResult {
  const [checkIn,     setCheckIn]     = useState<string | null>(null)
  const [checkOut,    setCheckOut]    = useState<string | null>(null)
  const [isSelecting, setIsSelecting] = useState(false)
  const [hoveredDate, setHoveredDate] = useState<string | null>(null)

  const onDateClick = useCallback((iso: string, status: DateStatus) => {
    if (status === 'occupied' || status === 'maintenance') return

    if (!isSelecting) {
      setCheckIn(iso)
      setCheckOut(null)
      setIsSelecting(true)
    } else {
      if (iso <= (checkIn ?? '')) {
        setCheckIn(iso)
        return
      }
      setCheckOut(iso)
      setIsSelecting(false)
      if (checkIn) onRangeSelected?.(checkIn, iso)
    }
  }, [isSelecting, checkIn, onRangeSelected])

  const onDateHover = useCallback((iso: string | null) => {
    if (isSelecting) setHoveredDate(iso)
  }, [isSelecting])

  const clearRange = useCallback(() => {
    setCheckIn(null)
    setCheckOut(null)
    setIsSelecting(false)
    setHoveredDate(null)
  }, [])

  const effectiveEnd = checkOut ?? hoveredDate

  const isInRange = useCallback((iso: string) => {
    if (!checkIn || !effectiveEnd) return false
    const [a, b] = checkIn < effectiveEnd
      ? [checkIn, effectiveEnd]
      : [effectiveEnd, checkIn]
    return iso > a && iso < b
  }, [checkIn, effectiveEnd])

  const isRangeStart = useCallback((iso: string) => iso === checkIn, [checkIn])
  const isRangeEnd   = useCallback((iso: string) => iso === (checkOut ?? hoveredDate), [checkOut, hoveredDate])

  return {
    checkIn, checkOut, isSelecting, hoveredDate,
    onDateClick, onDateHover, clearRange,
    isInRange, isRangeStart, isRangeEnd,
  }
}