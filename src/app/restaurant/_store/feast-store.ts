'use client'
/**
 * _store/feast-store.ts
 *
 * WHY A SEPARATE FILE:
 *   When the Zustand store lived inside the page file, every hot-module reload
 *   of the page would destroy and recreate the store, wiping staged items.
 *   Moving it to its own module means the store survives page-level HMR.
 *
 * STABILITY FIX:
 *   All action references are stable (Zustand guarantees this for set/get
 *   callbacks). Components that only read from the store use granular
 *   selectors so they only re-render when their specific slice changes.
 */

import { create } from 'zustand'
import type { MenuItem } from '../_data/menu-data'

interface StagedItem {
  item:        MenuItem
  qty:         number
  category:    string
  notes?:      string
  cookingPref?: string
}

interface ActiveOrder {
  id:      string
  items:   StagedItem[]
  total?:  number
}

interface FeastStore {
  staged:      StagedItem[]
  activeOrder: ActiveOrder | null
  addingId:    string | null

  stageItem:      (item: MenuItem, category: string, qty: number) => void
  removeStaged:   (id: string) => void
  updateQty:      (id: string, delta: number) => void
  setQty:         (id: string, qty: number) => void
  setNotes:       (id: string, notes: string) => void
  setCookPref:    (id: string, pref: string) => void
  clearStaged:    () => void
  setActiveOrder: (o: ActiveOrder | null) => void
  setAddingId:    (id: string | null) => void

  // Derived — stable selectors (avoid recomputing in components)
  getStagedItem: (id: string) => StagedItem | undefined
  stagedCount:   () => number
  stagedTotal:   () => number
}

export const useFeastStore = create<FeastStore>((set, get) => ({
  staged:      [],
  activeOrder: null,
  addingId:    null,

  stageItem: (item, category, qty) => {
    set(s => {
      const idx = s.staged.findIndex(p => p.item.id === item.id)
      if (idx >= 0) {
        const next = [...s.staged]
        next[idx] = { ...next[idx], qty: next[idx].qty + qty }
        return { staged: next }
      }
      return { staged: [...s.staged, { item, qty, category }] }
    })
    // Flash the adding indicator then clear — no infinite loop risk
    set({ addingId: item.id })
    setTimeout(() => set({ addingId: null }), 1200)
  },

  removeStaged: (id) =>
    set(s => ({ staged: s.staged.filter(p => p.item.id !== id) })),

  updateQty: (id, delta) =>
    set(s => {
      const idx = s.staged.findIndex(p => p.item.id === id)
      if (idx < 0) return s
      const newQty = s.staged[idx].qty + delta
      if (newQty <= 0) return { staged: s.staged.filter(p => p.item.id !== id) }
      const next = [...s.staged]
      next[idx] = { ...next[idx], qty: newQty }
      return { staged: next }
    }),

  setQty: (id, qty) =>
    set(s => {
      if (qty <= 0) return { staged: s.staged.filter(p => p.item.id !== id) }
      return { staged: s.staged.map(p => p.item.id === id ? { ...p, qty } : p) }
    }),

  setNotes:    (id, notes) =>
    set(s => ({ staged: s.staged.map(p => p.item.id === id ? { ...p, notes }             : p) })),
  setCookPref: (id, pref)  =>
    set(s => ({ staged: s.staged.map(p => p.item.id === id ? { ...p, cookingPref: pref } : p) })),

  clearStaged:    ()  => set({ staged: [], addingId: null }),
  setActiveOrder: (o) => set({ activeOrder: o }),
  setAddingId:    (id) => set({ addingId: id }),

  getStagedItem: (id) => get().staged.find(p => p.item.id === id),
  stagedCount:   ()   => get().staged.reduce((s, p) => s + p.qty, 0),
  stagedTotal:   ()   => get().staged.reduce((s, p) => s + p.item.price * p.qty, 0),
}))