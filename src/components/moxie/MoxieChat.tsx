"use client"

import React, { useState } from 'react'
import styles from './MoxieChat.module.css'
import { useCartStore } from '../../context/cartStore'
import toast from 'react-hot-toast'

interface Props {
	className?: string
}

export default function MoxieChat({ className }: Props) {
	const [open, setOpen] = useState(false)
	const [message, setMessage] = useState('')
	const [messages, setMessages] = useState<Array<{role: string, content: string}>>([])
	const [isLoading, setIsLoading] = useState(false)
	
	const addToCart = useCartStore((s: any) => s.addItem)
	const openCartPanel = useCartStore((s: any) => s.openCart)

	async function handleSendMessage() {
		if (!message.trim() || isLoading) return

		const userMessage = { role: 'user', content: message.trim() }
		setMessages(prev => [...prev, userMessage])
		setMessage('')
		setIsLoading(true)

		try {
			const response = await fetch('/api/moxie', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					messages: [...messages, userMessage],
					sessionId: 'session_' + Date.now(),
					pathname: window.location.pathname,
				}),
			})

			if (!response.ok) throw new Error('Failed to connect to Moxie')

			const data = await response.json()
			setMessages(prev => [...prev, { role: 'assistant', content: data.text || 'I apologize, but I encountered an error.' }])

			// Handle tool calls if present
			if (data.toolCall) {
				handleToolCall(data.toolCall)
			}
		} catch (error) {
			console.error('Moxie error:', error)
			setMessages(prev => [...prev, { role: 'assistant', content: 'I apologize, but I am having trouble connecting right now. Please try again or contact us directly at hello@ubuntuecolodge.com' }])
		} finally {
			setIsLoading(false)
		}
	}

	function handleToolCall(toolCall: { name: string; args: any }) {
		switch (toolCall.name) {
			case 'add_to_cart':
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
			case 'create_reservation':
				toast.success('Your reservation request has been received. Please complete the booking details.')
				window.location.href = '/contact#booking'
				break
		}
	}

	return (
		<div className={`${styles.moxieRoot} ${className ?? ''}`.trim()}>
			{open && (
				<div className={styles.chatPanel} role="dialog" aria-label="Moxie chat panel">
					<button className={styles.moxieExit} onClick={() => setOpen(false)}>
						✕
					</button>

					<div className={styles.chatHeader}>
						<div className={styles.chatHeaderLeft}>
							<div className={styles.moxieAvatar}>🤖</div>
							<div>
								<div className={styles.moxieTitle}>Moxie — Concierge</div>
								<div className={styles.moxieSubtitle}>Ubuntu Kreative Village</div>
							</div>
						</div>
						<button 
							onClick={openCartPanel}
							className="rounded-full bg-[#d9c7a2]/20 px-3 py-1.5 text-xs hover:bg-[#d9c7a2]/30 transition"
						>
							View Journey
						</button>
					</div>

					<div className={styles.messages}>
						{messages.length === 0 && (
							<div className={styles.welcomeMessage}>
								<p>🌿 Welcome to Ubuntu Kreative Village!</p>
								<p>I'm Moxie, your digital concierge. How can I help you today?</p>
							</div>
						)}
						{messages.map((msg, i) => (
							<div key={i} className={`${styles.messageRow} ${msg.role === 'user' ? styles.messageUser : styles.messageBot}`}>
								<div className={`${styles.messageBubble} ${msg.role === 'user' ? styles.messageBubbleUser : styles.messageBubbleBot}`}>
									{msg.content}
								</div>
							</div>
						))}
						{isLoading && (
							<div className={styles.messageRow} styles.messageBot}>
								<div className={styles.messageBubble} styles.messageBubbleBot}>
									Thinking...
								</div>
							</div>
						)}
					</div>

					<div className={styles.inputWrap}>
						<div className={styles.inputShell}>
							<input
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage() } }}
								placeholder="Ask Moxie anything..."
								className={styles.chatInput}
								disabled={isLoading}
							/>
							<button
								onClick={handleSendMessage}
								disabled={!message.trim() || isLoading}
								className={styles.sendBtn}
							>
								{isLoading ? '...' : 'Send'}
							</button>
						</div>
					</div>
				</div>
			)}

			<button
				onClick={() => setOpen((s) => !s)}
				className={`${styles.moxieBubble} ${open ? styles.moxiePulse : ''}`}
				aria-label={open ? 'Close chat' : 'Open chat'}
			>
				{open ? '✕' : '💬'}
			</button>
		</div>
	)
}
