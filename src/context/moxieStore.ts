/**
 * Global Moxie Chat State Store
 * Controls Moxie chat bubble visibility and state across the entire app
 *
 * Moxie Store — Conversation persistence and guest profile management
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Message } from '@/lib/moxie/conversationMemory'
import type { GuestProfile } from '@/lib/moxie/guestProfile'

interface MoxieStore {
  // UI State
  isOpen: boolean
  openMoxie: () => void
  closeMoxie: () => void
  toggleMoxie: () => void

  // Session Management
  sessionId: string
  setSessionId: (id: string) => void

  // Conversation State
  messages: Message[]
  addMessage: (message: Message) => void
  clearMessages: () => void
  setMessages: (messages: Message[]) => void

  // Guest Profile
  guestProfile: GuestProfile | null
  setGuestProfile: (profile: GuestProfile) => void

  // Page Context
  currentPage: string
  setCurrentPage: (page: string) => void
}

export const useMoxieStore = create<MoxieStore>()(
  persist(
    (set) => ({
      // UI State
      isOpen: false,
      openMoxie: () => set({ isOpen: true }),
      closeMoxie: () => set({ isOpen: false }),
      toggleMoxie: () => set((state) => ({ isOpen: !state.isOpen })),

      // Session Management
      sessionId: '',
      setSessionId: (id: string) => set({ sessionId: id }),

      // Conversation State
      messages: [],
      addMessage: (message: Message) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),
      clearMessages: () => set({ messages: [] }),
      setMessages: (messages: Message[]) => set({ messages }),

      // Guest Profile
      guestProfile: null,
      setGuestProfile: (profile: GuestProfile) => set({ guestProfile: profile }),

      // Page Context
      currentPage: '/',
      setCurrentPage: (page: string) => set({ currentPage: page }),
    }),
    {
      name: 'moxie-store',
      // Only persist certain fields (not full messages for size reasons)
      // Messages and profile are managed via ConversationMemoryManager
      partialize: (state) => ({
        isOpen: state.isOpen,
        sessionId: state.sessionId,
        currentPage: state.currentPage,
      }),
    },
  ),
)
