// src/context/cartStore.ts
// ─────────────────────────────────────────────────────────────────────
// Ubuntu Kreative Village — Global Cart Store
// Production v6
//
// ROOT BUG FIXED (v5 → v6):
//   addItem() was called from Restaurant, Events, Farm, and Spa pages
//   WITHOUT a `cartKey` field. The store stored cartKey = undefined.
//   Then removeItem(item.cartKey) called removeItem(undefined) — nothing
//   matched — so remove never worked.
//
//   FIX: addItem() now auto-generates cartKey from `id` when caller
//   does not supply one. This is backward-compatible: any caller that
//   already passes cartKey keeps their value. Any caller that omits it
//   gets `cartKey = id` automatically.
//
//   SECONDARY FIX: addItem() also now accumulates qty correctly when
//   adding the same item multiple times in a loop. Instead of calling
//   addItem() N times with qty=1, callers can pass qty=N and the store
//   handles it in a single atomic update.
//
// ALL original state shape, actions, and computed selectors preserved.
// The only breaking change: CartPanel should use `item.cartKey` for
// removeItem (which now always exists and equals id when not overridden).
// ─────────────────────────────────────────────────────────────────────

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ─────────────────────────────────────────────────────────────────────
// BOARD PLAN LABELS (original preserved)
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
   * a different cartKey (e.g. "warbugia::bedBreakfast").
   *
   * v6 FIX: addItem() auto-sets this to `id` when caller omits it.
   * This guarantees cartKey is ALWAYS defined and ALWAYS a string.
   */
  cartKey: string

  /** Original product / service id */
  id: string

  /** Display name shown in cart */
  name: string

  /** Category label shown as badge */
  tag: string

  /** Machine category for filtering/grouping */
  category: string

  /** Price per unit */
  price: number

  /** Unit label (e.g. "/ night", "/ person") */
  unit: string

  /** Number of units in this line */
  qty: number

  /** Optional per-item note */
  note?: string

  /** Optional board plan key for accommodation items */
  boardPlan?: string

  /**
   * Source page path — used by CartPanel "Edit" button to navigate
   * back to the exact page and auto-open the item's modal.
   * e.g. "/restaurant", "/events", "/cottages"
   */
  sourcePath?: string

  /**
   * Source item id — same as id, carried explicitly so CartPanel
   * can build a deep-link query param: /restaurant?openItem=sig-1
   */
  sourceItemId?: string
}

// ─────────────────────────────────────────────────────────────────────
// STORE INTERFACE
// ─────────────────────────────────────────────────────────────────────

const SERVICE_CHARGE_RATE = 0.10
const VAT_RATE            = 0.16

export interface CartStore {
  items:    CartItem[]
  isOpen:   boolean
  checkIn:  string
  checkOut: string
  guests:   number

  openCart:  () => void
  closeCart: () => void

  /**
   * Add a new item or accumulate qty if same cartKey exists.
   * cartKey defaults to id when not provided.
   * qty defaults to 1.
   *
   * SAFE TO CALL IN A LOOP — but better to pass qty directly:
   *   addItem({ id: 'abc', ..., qty: 3 })   ← preferred
   *   for (i=0; i<3; i++) addItem({ id: 'abc', ... })  ← also works
   */
  addItem: (item: Omit<CartItem, 'qty' | 'cartKey'> & { qty?: number; cartKey?: string }) => void

  removeItem:  (cartKey: string) => void
  increaseQty: (cartKey: string) => void
  decreaseQty: (cartKey: string) => void
  updateQty:   (cartKey: string, qty: number) => void
  updateNote:  (cartKey: string, note: string) => void
  clearCart:   () => void

  setDates:  (checkIn: string, checkOut: string) => void
  setGuests: (n: number) => void

  subtotal:      () => number
  serviceCharge: () => number
  total:         () => number
}

// ─────────────────────────────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────────────────────────────

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items:    [],
      isOpen:   false,
      checkIn:  '',
      checkOut: '',
      guests:   2,

      openCart:  () => set({ isOpen: true  }),
      closeCart: () => set({ isOpen: false }),

      // ── ADD ───────────────────────────────────────────────────────
      addItem: (incoming) =>
        set((state) => {
          const qty = incoming.qty ?? 1

          // v6 FIX: always resolve a non-empty cartKey
          // Caller may pass cartKey (e.g. "warbugia::bedBreakfast") or
          // omit it (most source pages). When omitted, fall back to id.
          const cartKey = (incoming.cartKey && incoming.cartKey.length > 0)
            ? incoming.cartKey
            : incoming.id

          const existing = state.items.find((i) => i.cartKey === cartKey)

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.cartKey === cartKey
                  ? { ...i, qty: i.qty + qty }
                  : i
              ),
            }
          }

          // New line — spread all incoming fields, override cartKey
          return {
            items: [
              ...state.items,
              {
                ...incoming,
                cartKey,
                qty,
              } as CartItem,
            ],
          }
        }),

      // ── REMOVE ────────────────────────────────────────────────────
      removeItem: (cartKey) =>
        set((state) => ({
          items: state.items.filter((i) => i.cartKey !== cartKey),
        })),

      // ── QTY ───────────────────────────────────────────────────────
      increaseQty: (cartKey) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.cartKey === cartKey ? { ...i, qty: i.qty + 1 } : i
          ),
        })),

      decreaseQty: (cartKey) =>
        set((state) => ({
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

      // ── NOTE ──────────────────────────────────────────────────────
      updateNote: (cartKey, note) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.cartKey === cartKey ? { ...i, note } : i
          ),
        })),

      // ── CLEAR ─────────────────────────────────────────────────────
      clearCart: () => set({ items: [] }),

      // ── DATES / GUESTS ────────────────────────────────────────────
      setDates:  (checkIn, checkOut) => set({ checkIn, checkOut }),
      setGuests: (guests)            => set({ guests }),

      // ── COMPUTED ──────────────────────────────────────────────────
      subtotal: () =>
        get().items.reduce((sum, i) => {
          const p = typeof i.price === 'number' && isFinite(i.price) ? i.price : 0
          return sum + p * i.qty
        }, 0),

      serviceCharge: () => {
        const sub = get().items.reduce((sum, i) => {
          const p = typeof i.price === 'number' && isFinite(i.price) ? i.price : 0
          return sum + p * i.qty
        }, 0)
        return Math.round(sub * SERVICE_CHARGE_RATE)
      },

      total: () => {
        const sub = get().items.reduce((sum, i) => {
          const p = typeof i.price === 'number' && isFinite(i.price) ? i.price : 0
          return sum + p * i.qty
        }, 0)
        const svc = Math.round(sub * SERVICE_CHARGE_RATE)
        const vat = Math.round(sub * VAT_RATE)
        return sub + svc + vat
      },
    }),

    {
      name:    'ukv-cart-v6',
      version:  6,
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
// HELPERS
// ─────────────────────────────────────────────────────────────────────

/**
 * Build a cartKey for products with board plans or variant options.
 * Usage: cartKey: buildCartKey('warbugia', 'bedBreakfast')
 * Result: 'warbugia::bedBreakfast'
 */
export function buildCartKey(id: string, option?: string): string {
  return option ? `${id}::${option}` : id
}

/**
 * Build a deep-link URL for the CartPanel "Edit" button.
 * The destination page reads `openItem` from the query string and
 * auto-opens the modal for that item.
 *
 * Usage:
 *   router.push(buildEditUrl('/restaurant', 'sig-1'))
 *   → '/restaurant?openItem=sig-1'
 */
export function buildEditUrl(sourcePath: string, itemId: string): string {
  if (!sourcePath) return '/'
  return `${sourcePath}?openItem=${encodeURIComponent(itemId)}`
}

/**
 * Helper to read the openItem param on the destination page.
 * Usage (in any page component):
 *   const itemToOpen = getOpenItemParam()
 *   useEffect(() => { if (itemToOpen) setLogItem(menuItems.find(i => i.id === itemToOpen)) }, [])
 */
export function getOpenItemParam(): string | null {
  if (typeof window === 'undefined') return null
  return new URLSearchParams(window.location.search).get('openItem')
}