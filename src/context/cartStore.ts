// ─────────────────────────────────────────────────────────────────────────────
// Ubuntu Kreative Village — cartStore  (production v2)
//
// UPGRADED from v1:
//   • CartItem now carries: cartKey, qty, note, sourcePath
//     (backward-compatible — all new fields are optional)
//   • addItem generates a unique cartKey so the same product can be added
//     multiple times (e.g. spa treatment for 2 guests = 2 line items)
//   • increaseQty / decreaseQty / updateNote — used by CartPanel v9
//   • removeItem now accepts cartKey OR id (safeKey fallback)
//   • buildEditUrl(sourcePath, id) — generates the deep-link URL that
//     CartPanel's "Edit" button uses to navigate back to the source modal
//   • getOpenItemParam() — reads ?openItem= from the URL on source pages
//   • subtotal() uses qty (with quantity fallback) for correct totals
//   • All original exports preserved: BOARD_PLAN_LABELS, CartItem,
//     useCartStore, total, serviceCharge, setDates, setGuests, etc.
// ─────────────────────────────────────────────────────────────────────────────

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ─────────────────────────────────────────────────────────────────────────────
// BOARD PLAN LABELS — referenced by CartPanel and room pages
// ─────────────────────────────────────────────────────────────────────────────
export const BOARD_PLAN_LABELS: Record<string, string> = {
  roomOnly:     'Room Only',
  bedBreakfast: 'Bed & Breakfast',
  halfBoard:    'Half Board',
  fullBoard:    'Full Board',
  // Legacy keys from older store versions
  'bo':  'Bed Only',
  'bb':  'Bed & Breakfast',
  'hb':  'Half Board',
  'fb':  'Full Board',
}

// ─────────────────────────────────────────────────────────────────────────────
// CART ITEM — backward-compatible with v1
// All new fields are optional so existing persisted items still load.
// ─────────────────────────────────────────────────────────────────────────────
export interface CartItem {
  // ── Core (required) ────────────────────────────────────────────────────────
  id:        string        // stable product/room/service ID
  name:      string
  tag:       string        // e.g. "Spa", "Cottage", "Dining"
  category:  string        // e.g. "spa", "cottage", "restaurant"
  price:     number        // per-unit price in KES
  unit:      string        // e.g. "/ person", "/ night"

  // ── Quantity — both fields kept for backward-compat ────────────────────────
  quantity:  number        // v1 field — kept for backward-compat
  qty?:      number        // v2 field — preferred; mirrors quantity on write

  // ── New in v2 (all optional) ──────────────────────────────────────────────
  cartKey?:   string       // unique line-item key (id + timestamp suffix)
  note?:      string       // per-item guest note
  sourcePath?: string      // page path where item was added (for Edit button)
  boardPlan?: string       // cottage board plan key
}

// ─────────────────────────────────────────────────────────────────────────────
// STORE INTERFACE
// ─────────────────────────────────────────────────────────────────────────────
interface CartStore {
  // ── State ──────────────────────────────────────────────────────────────────
  items:    CartItem[]
  isOpen:   boolean
  checkIn:  string
  checkOut: string
  guests:   number

  // ── Item actions ───────────────────────────────────────────────────────────
  addItem:     (item: Omit<CartItem, 'quantity' | 'qty'> & { qty?: number; quantity?: number }) => void
  removeItem:  (key: string) => void       // accepts cartKey or id
  increaseQty: (key: string) => void
  decreaseQty: (key: string) => void
  updateNote:  (key: string, note: string) => void
  clearCart:   () => void

  // ── Panel actions ──────────────────────────────────────────────────────────
  openCart:   () => void
  closeCart:  () => void
  toggleCart: () => void

  // ── Booking metadata ───────────────────────────────────────────────────────
  setDates:  (checkIn: string, checkOut: string) => void
  setGuests: (n: number) => void

  // ── Derived totals ─────────────────────────────────────────────────────────
  subtotal:      () => number
  serviceCharge: () => number
  total:         () => number
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Generates a unique cartKey for a new line item */
function makeCartKey(id: string): string {
  return `${id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
}

/** Normalises qty — prefers item.qty, falls back to item.quantity, defaults to 1 */
function resolveQty(item: CartItem): number {
  const v = item.qty ?? item.quantity ?? 1
  const n = Number(v)
  return isFinite(n) && n > 0 ? Math.round(n) : 1
}

/** Normalises price — guards against NaN/string from old localStorage */
function resolvePrice(item: CartItem): number {
  const n = Number(item.price)
  return isFinite(n) ? n : 0
}

/** Finds an item by cartKey or id */
function findByKey(items: CartItem[], key: string): number {
  // Prefer exact cartKey match first
  let idx = items.findIndex(i => i.cartKey === key && i.cartKey)
  if (idx !== -1) return idx
  // Fall back to id match (v1 items have no cartKey)
  idx = items.findIndex(i => i.id === key)
  return idx
}

// ─────────────────────────────────────────────────────────────────────────────
// EDIT URL HELPERS — used by CartPanel's "Edit" button
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Builds the deep-link URL that takes a guest back to the source page
 * with the correct item modal open.
 *
 * Usage in CartPanel:
 *   router.push(buildEditUrl(item.sourcePath!, item.id))
 *
 * Usage on destination page (e.g. /cottages, /spa):
 *   const itemId = getOpenItemParam()  // reads ?openItem=xxx from URL
 */
export function buildEditUrl(sourcePath: string, itemId: string): string {
  const base = sourcePath.startsWith('/') ? sourcePath : `/${sourcePath}`
  return `${base}?openItem=${encodeURIComponent(itemId)}`
}

/**
 * Reads the ?openItem= param from the current URL.
 * Call this on mount in source pages to auto-open the right modal.
 *
 * Example:
 *   const openItemId = getOpenItemParam()
 *   if (openItemId) openModal(openItemId)
 */
export function getOpenItemParam(): string | null {
  if (typeof window === 'undefined') return null
  return new URLSearchParams(window.location.search).get('openItem')
}

// ─────────────────────────────────────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────────────────────────────────────
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items:    [],
      isOpen:   false,
      checkIn:  '',
      checkOut: '',
      guests:   2,

      // ── addItem ──────────────────────────────────────────────────────────
      // Generates a cartKey so the same item can be added multiple times.
      // Writes both `qty` (v2) and `quantity` (v1) for backward-compat.
      addItem: (item) => {
        const qty = Number(item.qty ?? item.quantity ?? 1)
        const cartKey = makeCartKey(item.id)
        set((state) => ({
          items: [
            ...state.items,
            {
              ...item,
              cartKey,
              qty:      isFinite(qty) && qty > 0 ? qty : 1,
              quantity: isFinite(qty) && qty > 0 ? qty : 1,
              price:    isFinite(Number(item.price)) ? Number(item.price) : 0,
              note:     item.note ?? '',
              sourcePath: item.sourcePath ?? '',
            } as CartItem,
          ],
          isOpen: true, // auto-open cart on add
        }))
      },

      // ── removeItem ───────────────────────────────────────────────────────
      // Accepts cartKey or id — works with both v1 and v2 items.
      removeItem: (key) =>
        set((state) => {
          const idx = findByKey(state.items, key)
          if (idx === -1) return state
          const next = [...state.items]
          next.splice(idx, 1)
          return { items: next }
        }),

      // ── increaseQty ──────────────────────────────────────────────────────
      increaseQty: (key) =>
        set((state) => {
          const idx = findByKey(state.items, key)
          if (idx === -1) return state
          const next = [...state.items]
          const item = { ...next[idx] }
          const q = resolveQty(item) + 1
          item.qty = q; item.quantity = q
          next[idx] = item
          return { items: next }
        }),

      // ── decreaseQty ──────────────────────────────────────────────────────
      decreaseQty: (key) =>
        set((state) => {
          const idx = findByKey(state.items, key)
          if (idx === -1) return state
          const next = [...state.items]
          const item = { ...next[idx] }
          const q = Math.max(1, resolveQty(item) - 1)
          item.qty = q; item.quantity = q
          next[idx] = item
          return { items: next }
        }),

      // ── updateNote ───────────────────────────────────────────────────────
      updateNote: (key, note) =>
        set((state) => {
          const idx = findByKey(state.items, key)
          if (idx === -1) return state
          const next = [...state.items]
          next[idx] = { ...next[idx], note }
          return { items: next }
        }),

      // ── clearCart ────────────────────────────────────────────────────────
      clearCart: () => set({ items: [] }),

      // ── Panel ────────────────────────────────────────────────────────────
      openCart:   () => set({ isOpen: true  }),
      closeCart:  () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      // ── Booking metadata ─────────────────────────────────────────────────
      setDates:  (checkIn, checkOut) => set({ checkIn, checkOut }),
      setGuests: (n)                 => set({ guests: n }),

      // ── Derived totals ───────────────────────────────────────────────────
      // Uses resolveQty + resolvePrice to guard against stale localStorage
      subtotal: () =>
        get().items.reduce(
          (acc, item) => acc + resolvePrice(item) * resolveQty(item),
          0
        ),

      serviceCharge: () => get().subtotal() * 0.10,

      total: () => {
        const sub = get().subtotal()
        return sub + sub * 0.10 + sub * 0.16 // subtotal + service + VAT
      },
    }),
    {
      name: 'ubuntu-cart-storage',
      // Migration: when loading old v1 items from localStorage,
      // backfill cartKey and qty so v2 functions work correctly.
      onRehydrateStorage: () => (state) => {
        if (!state) return
        state.items = state.items.map((item) => ({
          ...item,
          cartKey:  item.cartKey || makeCartKey(item.id),
          qty:      item.qty ?? item.quantity ?? 1,
          quantity: item.quantity ?? item.qty ?? 1,
          note:     item.note ?? '',
          sourcePath: item.sourcePath ?? '',
        }))
      },
    }
  )
)