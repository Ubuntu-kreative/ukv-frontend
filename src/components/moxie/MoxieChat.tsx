'use client'

import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import styles from './MoxieChat.module.css'
import { useCartStore } from '@/context/cartStore'
import toast from 'react-hot-toast'
import { getMoxieSessionId, getMoxieGuest, saveMoxieGuest } from '@/lib/moxie/sessionClient'
import { getPageContext } from '@/lib/moxie/pageContext'
import {
  applyCartItem,
  buildPendingFromToolResult,
  type PendingConfirmation,
} from '@/lib/moxie/clientTools'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface Props {
  className?: string
  inline?: boolean
  onClose?: () => void
}

const CartRibbon = memo(function CartRibbon({
  count,
  subtotal,
  onOpen,
}: {
  count: number
  subtotal: number
  onOpen: () => void
}) {
  if (count === 0) return null
  return (
    <button type="button" className={styles.cartRibbon} onClick={onOpen}>
      <span className={styles.cartRibbonPulse} aria-hidden />
      <span>
        Journey · {count} item{count !== 1 ? 's' : ''} · KES {subtotal.toLocaleString()}
      </span>
      <span className={styles.cartRibbonCta}>View</span>
    </button>
  )
})

function MoxieChat({ inline = false, onClose }: Props) {
  const pathname = usePathname()
  const pageCtx = useMemo(() => getPageContext(pathname), [pathname])

  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [pending, setPending] = useState<PendingConfirmation | null>(null)

  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const sessionIdRef = useRef<string>('')

  const items = useCartStore((s) => s.items)
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const subtotal = useCartStore((s) => s.subtotal())

  const cartCount = items.length

  useEffect(() => {
    sessionIdRef.current = getMoxieSessionId()
  }, [])

  useEffect(() => {
    if (!inline && onClose) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [inline, onClose])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, isLoading, pending])

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || isLoading) return

      const userMessage: ChatMessage = { role: 'user', content: trimmed }
      const nextMessages = [...messages, userMessage]

      setMessages(nextMessages)
      setMessage('')
      setIsLoading(true)
      setPending(null)

      const guest = getMoxieGuest()

      try {
        const response = await fetch('/api/moxie', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: nextMessages,
            sessionId: sessionIdRef.current || getMoxieSessionId(),
            pathname,
            guest,
            cartSummary: items.map((i) => ({
              name: i.name,
              qty: i.qty ?? i.quantity ?? 1,
              price: i.price,
            })),
          }),
        })

        if (!response.ok) throw new Error('Moxie unavailable')

        const data = await response.json()
        const assistantContent =
          data.content ||
          data.text ||
          'The village lines are quiet for a moment. Please try again.'

        setMessages((prev) => [...prev, { role: 'assistant', content: assistantContent }])

        if (data.guestPatch) {
          saveMoxieGuest(data.guestPatch)
        }

        if (data.toolCall && data.toolResult) {
          const { pending: nextPending, error } = buildPendingFromToolResult(
            data.toolCall,
            data.toolResult,
            pathname,
          )
          if (error) {
            toast.error(error)
          } else if (nextPending) {
            setPending(nextPending)
          }
        }
      } catch (error) {
        console.error('[Moxie]', error)
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              'I could not reach the village network. Try again shortly, or email hello@ubuntuecolodge.com.',
          },
        ])
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, messages, pathname, items],
  )

  const handleSendMessage = useCallback(() => {
    sendMessage(message)
  }, [message, sendMessage])

  const handleSuggestion = useCallback(
    (s: string) => sendMessage(s),
    [sendMessage],
  )

  const confirmPending = useCallback(() => {
    if (!pending?.cartItem) return

    applyCartItem(pending.cartItem, pathname, addItem)

    if (pending.guest) {
      saveMoxieGuest(pending.guest)
    }

    toast.success('Added to your journey', { icon: '✦' })
    openCart()
    setPending(null)
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: 'Beautiful — it is in your journey cart. Review totals there when you are ready.',
      },
    ])
  }, [pending, pathname, addItem, openCart])

  const cancelPending = useCallback(() => {
    setPending(null)
    setMessages((prev) => [
      ...prev,
      { role: 'assistant', content: 'No change made. Tell me what you would like instead.' },
    ])
  }, [])

  return (
    <div
      className={`${styles.chatPanel} ${inline ? styles.chatPanelInline : ''}`}
      role="dialog"
      aria-label="Moxie concierge"
    >
      <div className={styles.chatHeader}>
        <div className={styles.chatHeaderLeft}>
          <div className={styles.moxieAvatar} aria-hidden>
            <svg viewBox="0 0 32 32" width="28" height="28">
              <circle cx="16" cy="17" r="9" fill="rgba(200,168,75,0.25)" />
              <circle cx="13" cy="16" r="1.2" fill="#ede6d3" />
              <circle cx="19" cy="16" r="1.2" fill="#ede6d3" />
            </svg>
          </div>
          <div>
            <div className={styles.moxieTitle}>Moxie</div>
            <div className={styles.moxieSubtitle}>{pageCtx.subtitle}</div>
          </div>
        </div>
        {onClose && (
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close concierge">
            ✕
          </button>
        )}
      </div>

      <CartRibbon count={cartCount} subtotal={subtotal} onOpen={openCart} />

      <div className={styles.messages}>
        {messages.length === 0 && (
          <div className={styles.welcomeBlock}>
            <p className={styles.welcomeLead}>{pageCtx.welcome}</p>
            <div className={styles.suggestions}>
              {pageCtx.suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={styles.suggestionBtn}
                  onClick={() => handleSuggestion(s)}
                  disabled={isLoading}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={`${msg.role}-${index}-${msg.content.slice(0, 12)}`}
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
              <span className={styles.typingIndicator} aria-hidden />
              Moxie is composing…
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {pending && (
        <div className={styles.confirmCard}>
          <p className={styles.confirmTitle}>Please confirm</p>
          <pre className={styles.confirmBody}>{pending.summary}</pre>
          <div className={styles.confirmActions}>
            <button type="button" className={styles.confirmBtn} onClick={confirmPending}>
              Confirm
            </button>
            <button type="button" className={styles.confirmCancel} onClick={cancelPending}>
              Not yet
            </button>
          </div>
        </div>
      )}

      <div className={styles.inputWrap}>
        <div className={styles.inputShell}>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            placeholder="Speak with Moxie…"
            className={styles.chatInput}
            disabled={isLoading}
            aria-label="Message to Moxie"
          />
          <button
            type="button"
            onClick={handleSendMessage}
            disabled={!message.trim() || isLoading}
            className={styles.sendBtn}
          >
            {isLoading ? '…' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default memo(MoxieChat)
