'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import styles from './MoxieChat.module.css'
import { useCartStore } from '../../context/cartStore'
import { useMoxieStore } from '../../context/moxieStore'
import { usePageContext } from '@/hooks/usePageContext'
import {
  ConversationMemoryManager,
  generateSessionId,
  type Message,
} from '@/lib/moxie/conversationMemory'
import { buildPageSystemPrompt } from '@/lib/moxie/pageContext'
import toast from 'react-hot-toast'

interface Props {
  className?: string
  inline?: boolean
}

export default function MoxieChat({ className, inline = false }: Props) {
  const pathname = usePathname()
  const pageContext = usePageContext()

  // State management
  const [open, setOpen] = useState(inline)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const memoryManagerRef = useRef<ConversationMemoryManager | null>(null)

  // Store refs for persistence
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  // Zustand stores
  const addToCart = useCartStore((s: any) => s.addItem)
  const openCartPanel = useCartStore((s: any) => s.openCart)
  const moxieIsOpen = useMoxieStore((s) => s.isOpen)
  const closeMoxie = useMoxieStore((s) => s.closeMoxie)
  const storeSessionId = useMoxieStore((s) => s.sessionId)
  const setStoreSessionId = useMoxieStore((s) => s.setSessionId)
  const storeCurrentPage = useMoxieStore((s) => s.currentPage)
  const setStoreCurrentPage = useMoxieStore((s) => s.setCurrentPage)
  const storeGuestProfile = useMoxieStore((s) => s.guestProfile)
  const setStoreGuestProfile = useMoxieStore((s) => s.setGuestProfile)

  // ─── INITIALIZATION: Load or create session and memory ───────────────────

  useEffect(() => {
    // Initialize session ID on first mount
    if (!sessionId) {
      const sid = storeSessionId || generateSessionId()
      setSessionId(sid)
      setStoreSessionId(sid)

      // Load persisted conversation
      const manager = new ConversationMemoryManager(sid)
      memoryManagerRef.current = manager
      const savedMessages = manager.getMessages()
      const savedProfile = manager.getProfile()

      setMessages(savedMessages)
      if (savedProfile && Object.keys(savedProfile).length > 0) {
        setStoreGuestProfile(savedProfile)
      }
    }
  }, [sessionId, storeSessionId, setStoreSessionId, setStoreGuestProfile])

  // ─── PAGE TRACKING: Update store when page changes ────────────────────────

  useEffect(() => {
    if (sessionId && memoryManagerRef.current) {
      // Track page change in memory
      if (storeCurrentPage !== pathname) {
        setStoreCurrentPage(pathname)
        memoryManagerRef.current.addPageHistory(pageContext.page)
      }
    }
  }, [pathname, pageContext.page, sessionId, storeCurrentPage, setStoreCurrentPage])

  // ─── AUTO-SCROLL: Keep chat scrolled to bottom ──────────────────────────

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, open])

  // ─── UI SYNC: Sync bubble with global moxie store ──────────────────────

  useEffect(() => {
    if (!inline) {
      setOpen(moxieIsOpen)
    }
  }, [moxieIsOpen, inline])

  // ─── MESSAGE SENDING ───────────────────────────────────────────────────────

  const handleSendMessage = useCallback(async () => {
    const trimmed = message.trim()
    if (!trimmed || isLoading || !sessionId || !memoryManagerRef.current) return

    // Create user message
    const userMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    }

    // Add to local state and memory
    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    memoryManagerRef.current.addMessage('user', trimmed)
    setMessage('')
    setIsLoading(true)

    try {
      // Get current memory state
      const recentMessages = memoryManagerRef.current.getRecentMessages(12)
      const profile = memoryManagerRef.current.getProfile()

      const response = await fetch('/api/moxie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: recentMessages.map(({ role, content }) => ({ role, content })),
          sessionId,
          pathname,
          pageContext: pageContext.page,
          guestProfile: profile,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      const assistantContent =
        data.content || data.text || 'I apologize, but I encountered an error while generating a response.'

      // Create assistant message
      const assistantMessage: Message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        role: 'assistant',
        content: assistantContent,
        timestamp: Date.now(),
      }

      // Add to state and memory
      setMessages((prev) => [...prev, assistantMessage])
      memoryManagerRef.current.addMessage('assistant', assistantContent)

      // Update guest profile if changed
      if (data.guestProfile) {
        memoryManagerRef.current.setProfile(data.guestProfile)
        setStoreGuestProfile(data.guestProfile)
      }

      // Handle tool calls
      if (data.toolCall) {
        handleToolCall(data.toolCall)
      }
    } catch (error) {
      console.error('Moxie error:', error)

      const errorMessage: Message = {
        id: `msg_${Date.now()}_error`,
        role: 'assistant',
        content: 'I apologize, but I am having trouble connecting right now. Please try again or contact us directly at hello@ubuntuecolodge.com',
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, errorMessage])
      if (memoryManagerRef.current) {
        memoryManagerRef.current.addMessage('assistant', errorMessage.content)
      }
    } finally {
      setIsLoading(false)
    }
  }, [message, isLoading, sessionId, messages, setMessage, pathname, pageContext.page, setStoreGuestProfile])

  // ─── TOOL CALL HANDLING ────────────────────────────────────────────────────

  const handleToolCall = useCallback(
    (toolCall: { name: string; args: any }) => {
      switch (toolCall.name) {
        case 'add_to_cart': {
          const { itemName, price, qty = 1, category = 'general' } = toolCall.args
          const stableId = `moxie_${itemName.toLowerCase().replace(/\s+/g, '_')}_${category}`

          addToCart({
            id: stableId,
            name: itemName,
            price: Number(price),
            category,
            tag: '',
            unit: '/ each',
            qty: Number(qty),
          })
          toast.success(`${itemName} added to your journey`)
          openCartPanel()
          break
        }
        case 'create_reservation': {
          toast.success('Your reservation request has been received. Please complete the booking details.')
          window.location.href = '/contact#booking'
          break
        }
        default: {
          console.warn('Unknown Moxie tool call:', toolCall.name)
          break
        }
      }
    },
    [addToCart, openCartPanel],
  )

  // ─── RENDER: Chat Panel ────────────────────────────────────────────────────

  const chatPanel = (
    <div className={styles.chatPanel} role="dialog" aria-label="Moxie chat panel">
      {!inline && (
        <button className={styles.moxieExit} onClick={() => {
          setOpen(false)
          closeMoxie()
        }} type="button">
          ✕
        </button>
      )}

      <div className={styles.chatHeader}>
        <div className={styles.chatHeaderLeft}>
          <div className={styles.moxieAvatar}>🤖</div>
          <div>
            <div className={styles.moxieTitle}>Moxie — Concierge</div>
            <div className={styles.moxieSubtitle}>Ubuntu Kreative Village</div>
          </div>
        </div>
        <button
          type="button"
          onClick={openCartPanel}
          className="rounded-full bg-[#d9c7a2]/20 px-3 py-1.5 text-xs hover:bg-[#d9c7a2]/30 transition"
        >
          View Journey
        </button>
      </div>

      <div className={styles.messages} aria-live="polite">
        {messages.length === 0 ? (
          <div className={styles.welcomeMessage}>
            <p>🌿 Welcome to Ubuntu Kreative Village!</p>
            <p>I'm Moxie, your digital concierge. How can I help you today?</p>
          </div>
        ) : null}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.messageRow} ${
              msg.role === 'user' ? styles.messageUser : styles.messageBot
            } ${styles.messageAnimated}`}
          >
            <div
              className={`${styles.messageBubble} ${
                msg.role === 'user' ? styles.messageBubbleUser : styles.messageBubbleBot
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className={`${styles.messageRow} ${styles.messageBot}`}>
            <div className={`${styles.messageBubble} ${styles.messageBubbleBot}`}>
              Thinking...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputWrap}>
        <div className={styles.inputShell}>
          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                handleSendMessage()
              }
            }}
            placeholder="Ask Moxie anything..."
            className={styles.chatInput}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={handleSendMessage}
            disabled={!message.trim() || isLoading}
            className={styles.sendBtn}
          >
            {isLoading ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )

  // Inline mode: always show chat panel without bubble
  if (inline) {
    return (
      <div className={`${styles.moxieRoot} ${className ?? ''}`.trim()}>
        {chatPanel}
      </div>
    )
  }

  // Floating bubble mode
  return (
    <div className={`${styles.moxieRoot} ${className ?? ''}`.trim()}>
      {open && chatPanel}
      <button
        type="button"
        onClick={() => {
          setOpen((current) => !current)
          // Also update the global store
          if (!open) {
            useMoxieStore.setState({ isOpen: true })
          } else {
            closeMoxie()
          }
        }}
        className={`${styles.moxieBubble} ${open ? styles.moxiePulse : ''}`}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? '✕' : '💬'}
      </button>
    </div>
  )
}
