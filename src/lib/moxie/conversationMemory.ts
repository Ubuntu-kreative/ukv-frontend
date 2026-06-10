/**
 * src/lib/moxie/conversationMemory.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Ubuntu Kreative Village — Moxie Conversation Memory System
 *
 * Tracks conversation history and persists to localStorage.
 * Enables conversation to survive page navigation.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { buildProfileFromMessage, type GuestProfile, createEmptyProfile } from './guestProfile'

// ─── TYPES ───────────────────────────────────────────────────────────────────

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
}

export interface ConversationMemory {
  sessionId: string
  messages: Message[]
  guestProfile: GuestProfile
  createdAt: number
  updatedAt: number
  pageHistory: string[] // Track which pages user visited
}

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const STORAGE_PREFIX = 'moxie_session_'
const MAX_MESSAGES_PER_SESSION = 50 // Keep last 50 messages
const SESSION_TTL = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

// ─── IN-MEMORY CACHE ───────────────────────────────────────────────────────

const memoryCache = new Map<string, ConversationMemory>()

// ─── LOCAL STORAGE FUNCTIONS ────────────────────────────────────────────────

/**
 * Load conversation from localStorage
 * @param sessionId - Session identifier
 * @returns Conversation memory or null if not found or expired
 */
function loadFromStorage(sessionId: string): ConversationMemory | null {
  if (typeof window === 'undefined') return null

  try {
    const key = `${STORAGE_PREFIX}${sessionId}`
    const stored = localStorage.getItem(key)
    if (!stored) return null

    const memory = JSON.parse(stored) as ConversationMemory

    // Check if session has expired
    if (Date.now() - memory.updatedAt > SESSION_TTL) {
      localStorage.removeItem(key)
      return null
    }

    return memory
  } catch (error) {
    console.error('Failed to load conversation memory:', error)
    return null
  }
}

/**
 * Save conversation to localStorage
 * @param memory - Conversation memory to save
 */
function saveToStorage(memory: ConversationMemory): void {
  if (typeof window === 'undefined') return

  try {
    const key = `${STORAGE_PREFIX}${memory.sessionId}`
    // Prune old messages if needed
    if (memory.messages.length > MAX_MESSAGES_PER_SESSION) {
      memory.messages = memory.messages.slice(-MAX_MESSAGES_PER_SESSION)
    }
    memory.updatedAt = Date.now()
    localStorage.setItem(key, JSON.stringify(memory))
  } catch (error) {
    console.error('Failed to save conversation memory:', error)
  }
}

/**
 * Clear a session from storage
 * @param sessionId - Session to clear
 */
function clearFromStorage(sessionId: string): void {
  if (typeof window === 'undefined') return

  try {
    const key = `${STORAGE_PREFIX}${sessionId}`
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Failed to clear conversation memory:', error)
  }
}

/**
 * Clean up expired sessions from storage
 */
function cleanupExpiredSessions(): void {
  if (typeof window === 'undefined') return

  try {
    const keys = Object.keys(localStorage)
    const now = Date.now()

    for (const key of keys) {
      if (!key.startsWith(STORAGE_PREFIX)) continue

      const stored = localStorage.getItem(key)
      if (!stored) continue

      try {
        const memory = JSON.parse(stored) as ConversationMemory
        if (now - memory.updatedAt > SESSION_TTL) {
          localStorage.removeItem(key)
        }
      } catch {
        // Invalid JSON, remove it
        localStorage.removeItem(key)
      }
    }
  } catch (error) {
    console.error('Failed to cleanup expired sessions:', error)
  }
}

// ─── MEMORY MANAGER CLASS ───────────────────────────────────────────────────

/**
 * Manages conversation memory for a single session
 */
export class ConversationMemoryManager {
  private memory: ConversationMemory

  constructor(sessionId: string) {
    // Try to load from cache first
    if (memoryCache.has(sessionId)) {
      this.memory = memoryCache.get(sessionId)!
    } else {
      // Try to load from storage
      const stored = loadFromStorage(sessionId)
      if (stored) {
        this.memory = stored
      } else {
        // Create new memory
        this.memory = {
          sessionId,
          messages: [],
          guestProfile: createEmptyProfile(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
          pageHistory: [],
        }
      }

      // Cache it
      memoryCache.set(sessionId, this.memory)
    }
  }

  /**
   * Add a message to memory
   * @param role - 'user' | 'assistant'
   * @param content - Message text
   */
  addMessage(role: 'user' | 'assistant', content: string): void {
    const message: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      role,
      content,
      timestamp: Date.now(),
    }

    this.memory.messages.push(message)

    // Extract and update profile if user message
    if (role === 'user') {
      this.memory.guestProfile = buildProfileFromMessage(
        this.memory.guestProfile,
        content,
      )
    }

    // Auto-save after each message
    saveToStorage(this.memory)
  }

  /**
   * Get all messages in memory
   * @returns Array of messages
   */
  getMessages(): Message[] {
    return this.memory.messages
  }

  /**
   * Get last N messages (for context to LLM)
   * @param n - Number of recent messages
   * @returns Last N messages
   */
  getRecentMessages(n: number = 12): Message[] {
    return this.memory.messages.slice(-n)
  }

  /**
   * Get guest profile
   * @returns Current guest profile
   */
  getProfile(): GuestProfile {
    return this.memory.guestProfile
  }

  /**
   * Update guest profile directly
   * @param profile - New profile
   */
  setProfile(profile: GuestProfile): void {
    this.memory.guestProfile = profile
    this.memory.updatedAt = Date.now()
    saveToStorage(this.memory)
  }

  /**
   * Add page to history
   * @param page - Page name or pathname
   */
  addPageHistory(page: string): void {
    this.memory.pageHistory.push(page)
    // Keep last 20 pages
    if (this.memory.pageHistory.length > 20) {
      this.memory.pageHistory = this.memory.pageHistory.slice(-20)
    }
    saveToStorage(this.memory)
  }

  /**
   * Get page history
   * @returns Array of visited pages
   */
  getPageHistory(): string[] {
    return this.memory.pageHistory
  }

  /**
   * Check if user has visited a specific page
   * @param page - Page to check
   * @returns true if visited
   */
  hasVisitedPage(page: string): boolean {
    return this.memory.pageHistory.includes(page)
  }

  /**
   * Clear all memory
   */
  clear(): void {
    this.memory = {
      sessionId: this.memory.sessionId,
      messages: [],
      guestProfile: createEmptyProfile(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      pageHistory: [],
    }
    clearFromStorage(this.memory.sessionId)
  }

  /**
   * Get full memory object
   * @returns Full ConversationMemory
   */
  getMemory(): ConversationMemory {
    return this.memory
  }

  /**
   * Get memory as string for system prompt
   * @returns Formatted memory context
   */
  toSystemContext(): string {
    const parts: string[] = []

    if (this.memory.messages.length > 0) {
      parts.push(`Previous messages (last ${Math.min(5, this.memory.messages.length)}):`)
      const recent = this.memory.messages.slice(-5)
      for (const msg of recent) {
        parts.push(`  ${msg.role === 'user' ? 'Guest' : 'Moxie'}: ${msg.content.slice(0, 100)}`)
      }
    }

    if (this.memory.pageHistory.length > 0) {
      const lastPage = this.memory.pageHistory[this.memory.pageHistory.length - 1]
      parts.push(`Recently visited: ${lastPage}`)
    }

    if (parts.length === 0) {
      return 'New conversation - no prior context.'
    }

    return parts.join('\n')
  }
}

// ─── SESSION MANAGEMENT ─────────────────────────────────────────────────────

/**
 * Get or create a memory manager for a session
 * @param sessionId - Session identifier
 * @returns Memory manager instance
 */
export function getOrCreateMemoryManager(
  sessionId: string,
): ConversationMemoryManager {
  return new ConversationMemoryManager(sessionId)
}

/**
 * Delete a session
 * @param sessionId - Session to delete
 */
export function deleteSession(sessionId: string): void {
  memoryCache.delete(sessionId)
  clearFromStorage(sessionId)
}

/**
 * Generate a new session ID
 * @returns Unique session identifier
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
}

/**
 * Clean up all expired sessions (call periodically)
 */
export function cleanupSessions(): void {
  cleanupExpiredSessions()

  // Also clean up cache
  for (const [sessionId, memory] of memoryCache.entries()) {
    if (Date.now() - memory.updatedAt > SESSION_TTL) {
      memoryCache.delete(sessionId)
    }
  }
}

// Run cleanup on module load (if in browser)
if (typeof window !== 'undefined') {
  cleanupSessions()
}
