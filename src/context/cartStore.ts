import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  tag: string
  category: string
  price: number
  unit: string
  quantity: number
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  checkIn: string
  checkOut: string
  guests: number
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  setDates: (checkIn: string, checkOut: string) => void
  setGuests: (n: number) => void
  total: () => number
  subtotal: () => number
  serviceCharge: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      checkIn: '',
      checkOut: '',
      guests: 2,

      addItem: (item) => {
        const existing = get().items.find((i) => i.id === item.id)
        if (existing) return
        set((s) => ({ items: [...s.items, { ...item, quantity: 1 }] }))
      },

      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      setDates: (checkIn, checkOut) => set({ checkIn, checkOut }),
      setGuests: (n) => set({ guests: n }),

      subtotal: () => get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
      serviceCharge: () => get().subtotal() * 0.1,
      total: () => get().subtotal() + get().serviceCharge(),
    }),
    {
      name: 'ubuntu-cart-storage', // Persists cart to localStorage
    }
  )
)