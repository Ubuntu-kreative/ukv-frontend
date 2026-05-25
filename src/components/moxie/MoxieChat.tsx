"use client"

import React, { useEffect, useRef, useState } from 'react'
import styles from './MoxieChat.module.css'
import { useCartStore } from '../../context/cartStore'
import toast from 'react-hot-toast'

interface Props {
  className?: string
  inline?: boolean
}

export default function MoxieChat({ className, inline = false }: Props) {
  const [open, setOpen] = useState(inline)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])
  const [isLoading, setIsLoading] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const addToCart = useCartStore((s: any) => s.addItem)
  const openCartPanel = useCartStore((s: any) => s.openCart)

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, open])

  async function handleSendMessage() {
    const trimmed = message.trim()
    if (!trimmed || isLoading) return

    const userMessage = { role: 'user', content: trimmed }
    const nextMessages = [...messages, userMessage]

    setMessages(nextMessages)
    setMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/moxie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages,
          sessionId: 'session_' + Date.now(),
          pathname: window.location.pathname,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to connect to Moxie')
      }

      const data = await response.json()
      const assistantContent = data.content || data.text || 'I apologize, but I encountered an error while generating a response.'

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: assistantContent,
        },
      ])

      if (data.toolCall) {
        handleToolCall(data.toolCall)
      }
    } catch (error) {
      console.error('Moxie error:', error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'I apologize, but I am having trouble connecting right now. Please try again or contact us directly at hello@ubuntuecolodge.com',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  function handleToolCall(toolCall: { name: string; args: any }) {
    switch (toolCall.name) {
      case 'add_to_cart': {
        const { itemName, price, qty = 1, category = 'general' } = toolCall.args
        addToCart({
          id: Date.now().toString(),
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
  }

  const chatPanel = (
    <div className={styles.chatPanel} role="dialog" aria-label="Moxie chat panel">
      {!inline && (
        <button className={styles.moxieExit} onClick={() => setOpen(false)} type="button">
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

        {messages.map((msg, index) => (
          <div
            key={index}
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
        onClick={() => setOpen((current) => !current)}
        className={`${styles.moxieBubble} ${open ? styles.moxiePulse : ''}`}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? '✕' : '💬'}
      </button>
    </div>
  )
}
