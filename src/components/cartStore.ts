// src/context/cartStore.ts
// ─────────────────────────────────────────────────────────────────────
// Ubuntu Kreative Village — Global Cart Store
// Production v5 — patch: added BOARD_PLAN_LABELS export
//
// Architecture:
//   • ALL cart logic lives here — components only call actions
//   • cartKey is the primary key (not id) so the same product can
//     appear multiple times with different options/notes
//   • qty replaces quantity throughout
//   • decreaseQty removes the item when qty reaches 0
//   • subtotal / serviceCharge / total are callable selectors
//   • Persisted to localStorage via zustand/middleware persist
//   • isOpen / openCart / closeCart managed here (panel state)
//   • Stay dates + global guest count for accommodation flow
// ─────────────────────────────────────────────────────────────────────

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ─────────────────────────────────────────────────────────────────────
// BOARD PLAN LABELS
// Exported so CartPanel (and any other component) can display
// human-readable meal plan names without duplicating the map.
// ─────────────────────────────────────────────────────────────────────

export const BOARD_PLAN_LABELS: Record<string, string> = {
  bedOnly:      'Bed Only',
  bedBreakfast: 'Bed & Breakfast',
  halfBoard:    'Half Board',
  fullBoard:    'Full Board',
}

// ─────────────────────────────────────────────────────────────────────
// CART ITEM TYPE
// ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  /**
   * Primary key for all cart operations.
   * Unique per line — same product with different options gets
   * a different cartKey (e.g. "warbugia-bedBreakfast").
   * Use the product id as cartKey when no variant is needed.
   */
  cartKey: string

  /** Original product / service id */
  id: string

  /** Display name shown in cart */
  name: string

  /** Category label shown as badge (e.g. "Cottage", "Spa", "Dining") */
  tag: string

  /** Machine category for filtering/grouping */
  category: string

  /** Price per unit (per night, per person, per session…) */
  price: number

  /** Unit label shown in cart (e.g. "/ night", "/ person") */
  unit: string

  /** Number of units in this line */
  qty: number

  /** Optional per-item note (dietary, setup, accessibility…) */
  note?: string
}

// ─────────────────────────────────────────────────────────────────────
// STORE INTERFACE
// ─────────────────────────────────────────────────────────────────────

const SERVICE_CHARGE_RATE = 0.10   // 10% village service charge
const VAT_RATE            = 0.16   // 16% VAT

export interface CartStore {
  // ── DATA ───────────────────────────────────────────────────────────
  items:    CartItem[]
  isOpen:   boolean
  checkIn:  string
  checkOut: string
  guests:   number

  // ── PANEL OPEN / CLOSE ─────────────────────────────────────────────
  openCart:  () => void
  closeCart: () => void

  // ── ADD ────────────────────────────────────────────────────────────
  /**
   * Add a new item or increase qty if the same cartKey already exists.
   * qty defaults to 1.
   */
  addItem: (item: Omit<CartItem, 'qty'> & { qty?: number }) => void

  // ── REMOVE ─────────────────────────────────────────────────────────
  /** Remove the entire line by cartKey */
  removeItem: (cartKey: string) => void

  // ── QTY ────────────────────────────────────────────────────────────
  /** Increase qty of an existing line by 1 */
  increaseQty: (cartKey: string) => void

  /**
   * Decrease qty by 1.
   * Removes the item when qty would reach 0.
   */
  decreaseQty: (cartKey: string) => void

  /** Set qty directly — removes item if qty <= 0 */
  updateQty: (cartKey: string, qty: number) => void

  // ── NOTE ───────────────────────────────────────────────────────────
  updateNote: (cartKey: string, note: string) => void

  // ── CLEAR ──────────────────────────────────────────────────────────
  clearCart: () => void

  // ── DATES / GUESTS ─────────────────────────────────────────────────
  setDates:  (checkIn: string, checkOut: string) => void
  setGuests: (n: number) => void

  // ── COMPUTED ───────────────────────────────────────────────────────
  /** Raw sum of all lines: sum(price x qty) */
  subtotal: () => number

  /** 10% village service charge on the subtotal */
  serviceCharge: () => number

  /** Grand total: subtotal + service charge + VAT (16% on subtotal) */
  total: () => number
}

// ─────────────────────────────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────────────────────────────

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // ── Initial state ─────────────────────────────────────────────
      items:    [],
      isOpen:   false,
      checkIn:  '',
      checkOut: '',
      guests:   2,

      // ── Panel ─────────────────────────────────────────────────────
      openCart:  () => set({ isOpen: true  }),
      closeCart: () => set({ isOpen: false }),

      // ── Add ───────────────────────────────────────────────────────
      addItem: (incoming) =>
        set((state) => {
          const qty      = incoming.qty ?? 1
          const existing = state.items.find((i) => i.cartKey === incoming.cartKey)

          if (existing) {
            // Same cartKey already in cart — bump qty
            return {
              items: state.items.map((i) =>
                i.cartKey === incoming.cartKey
                  ? { ...i, qty: i.qty + qty }
                  : i
              ),
            }
          }

          // New line
          return {
            items: [...state.items, { ...incoming, qty }],
          }
        }),

      // ── Remove ────────────────────────────────────────────────────
      removeItem: (cartKey) =>
        set((state) => ({
          items: state.items.filter((i) => i.cartKey !== cartKey),
        })),

      // ── Qty ───────────────────────────────────────────────────────
      increaseQty: (cartKey) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.cartKey === cartKey ? { ...i, qty: i.qty + 1 } : i
          ),
        })),

      decreaseQty: (cartKey) =>
        set((state) => ({
          // Decrease by 1; filter out lines that hit 0
          items: state.items
            .map((i) =>
              i.cartKey === cartKey ? { ...i, qty: i.qty - 1 } : i
            )
            .filter((i) => i.qty > 0),
        })),

      updateQty: (cartKey, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.cartKey !== cartKey)
              : state.items.map((i) =>
                  i.cartKey === cartKey ? { ...i, qty } : i
                ),
        })),

      // ── Note ──────────────────────────────────────────────────────
      updateNote: (cartKey, note) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.cartKey === cartKey ? { ...i, note } : i
          ),
        })),

      // ── Clear ─────────────────────────────────────────────────────
      clearCart: () => set({ items: [] }),

      // ── Dates / guests ────────────────────────────────────────────
      setDates:  (checkIn, checkOut) => set({ checkIn, checkOut }),
      setGuests: (guests)            => set({ guests }),

      // ── Computed ──────────────────────────────────────────────────
      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.qty, 0),

      serviceCharge: () => {
        const sub = get().items.reduce((sum, i) => sum + i.price * i.qty, 0)
        return Math.round(sub * SERVICE_CHARGE_RATE)
      },

      total: () => {
        const sub = get().items.reduce((sum, i) => sum + i.price * i.qty, 0)
        const svc = Math.round(sub * SERVICE_CHARGE_RATE)
        const vat = Math.round(sub * VAT_RATE)
        return sub + svc + vat
      },
    }),

    {
      name: 'ukv-cart-v5',
      version: 5,

      // Only persist data — never the panel open state
      partialize: (state) => ({
        items:    state.items,
        checkIn:  state.checkIn,
        checkOut: state.checkOut,
        guests:   state.guests,
      }),
    }
  )
)

// ─────────────────────────────────────────────────────────────────────
// HELPER — build a cartKey for products with options/variants
//
// Usage:
//   cartKey: buildCartKey('warbugia', 'bedBreakfast')
//   result:  'warbugia::bedBreakfast'
// ─────────────────────────────────────────────────────────────────────
export function buildCartKey(id: string, option?: string): string {
  return option ? `${id}::${option}` : id
}