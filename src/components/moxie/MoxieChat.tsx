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
  const previousPathnameRef = useRef(pathname)

  // Store refs for persistence
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  // Zustand stores
  const addToCart = useCartStore((s: any) => s.addItem)
  const openCartPanel = useCartStore((s: any) => s.openCart)
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
      const sid = (storeSessionId || generateSessionId())
        .replace(/[^A-Za-z0-9_-]/g, '')
        .slice(0, 64) || generateSessionId()
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

  useEffect(() => {
    if (inline) return
    if (previousPathnameRef.current === pathname) return

    previousPathnameRef.current = pathname
    setOpen(false)
    closeMoxie()
  }, [pathname, inline, closeMoxie])

  useEffect(() => {
    if (inline) return
    useMoxieStore.setState({ isOpen: false })
    return useMoxieStore.subscribe((state, previousState) => {
      if (state.isOpen && !previousState.isOpen) setOpen(true)
    })
  }, [inline])

  useEffect(() => {
    if (inline || !open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        closeMoxie()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [inline, open, closeMoxie])

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
    let requestErrorMessage =
      'I apologize, but I am having trouble connecting right now. Please try again or contact us directly at hello@ubuntuecolodge.com'

    try {
      // Get current memory state
      const recentMessages = memoryManagerRef.current.getMessages()
        .filter(({ role }) => role === 'user' || role === 'assistant')
        .slice(-20)
        .map(({ role, content }) => ({ role, content: content.slice(0, 2000) }))
      const profile = memoryManagerRef.current.getProfile()
      const requestProfile = {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        checkInDate: profile.checkInDate,
        checkOutDate: profile.checkOutDate,
        numberOfGuests: profile.numberOfGuests,
        numberOfChildren: profile.numberOfChildren,
        occasion: profile.occasion,
        budget: profile.budget,
        vibes: profile.vibes,
        dietary: profile.dietary,
        allergies: profile.allergies,
        wellnessInterests: profile.wellnessInterests,
        roomPreference: profile.roomPreference,
        viewPreference: profile.viewPreference,
        timezone: profile.timezone,
        language: profile.language,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      }
      const requestSessionId = sessionId
        .replace(/[^A-Za-z0-9_-]/g, '')
        .slice(0, 64) || generateSessionId()

      const response = await fetch('/api/moxie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: recentMessages,
          sessionId: requestSessionId,
          pathname,
          pageContext: pageContext.page,
          guestProfile: requestProfile,
        }),
      })

      if (!response.ok) {
        if (response.status === 429) {
          requestErrorMessage = 'Moxie needs a moment, please try again shortly.'
        } else if (response.status === 400) {
          requestErrorMessage = 'Moxie could not use that request. Please try again.'
        } else if (response.status === 413) {
          requestErrorMessage = 'That message is too long. Please shorten it and try again.'
        }
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
        content: requestErrorMessage,
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
    <div
      className={styles.chatPanel}
      data-theme="dark"
      data-moxie-floating-panel={inline ? undefined : ''}
      role="dialog"
      aria-label="Moxie chat panel"
      style={inline ? undefined : { position: 'relative' }}
    >
      {!inline && (
        <button
          className={styles.moxieExit}
          onClick={() => {
            setOpen(false)
            closeMoxie()
          }}
          type="button"
          aria-label="Close chat"
          style={{ top: 8, right: 8, width: 44, height: 44, padding: 0, zIndex: 1 }}
        >
          ✕
        </button>
      )}

      <div className={styles.chatHeader} style={inline ? undefined : { paddingRight: 76 }}>
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

      <div
        className={styles.messages}
        aria-live="polite"
        style={inline ? undefined : { height: 'auto', minHeight: 0, flex: '1 1 auto' }}
      >
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
  if (pathname === '/moxie') return null

  return (
    <>
      <style jsx global>{`
        [data-moxie-floating-root] {
          position: fixed;
          right: 1rem;
          bottom: calc(1rem + env(safe-area-inset-bottom));
          z-index: 2000;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        [data-moxie-floating-panel] {
          display: flex;
          flex-direction: column;
          width: min(380px, calc(100vw - 2rem));
          height: min(560px, calc(100dvh - 7rem));
          max-height: min(560px, calc(100dvh - 7rem));
        }

        @media (max-width: 639px) {
          [data-moxie-floating-root] {
            left: 0;
            right: 0;
            width: 100vw;
          }

          [data-moxie-floating-panel] {
            width: 100vw;
            max-width: 100vw;
            height: min(560px, 80dvh);
            max-height: 80dvh;
            border-radius: 24px 24px 0 0;
          }
        }
      `}</style>
      <div
        className={`${styles.moxieRoot} ${className ?? ''}`.trim()}
        data-moxie-floating-root=""
      >
        {open ? chatPanel : (
          <button
            type="button"
            onClick={() => {
              setOpen(true)
              useMoxieStore.setState({ isOpen: true })
            }}
            className={styles.moxieBubble}
            data-theme="dark"
            aria-label="Open chat"
          >
            💬
          </button>
        )}
      </div>
    </>
  )
}
