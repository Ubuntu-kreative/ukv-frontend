"use client"

import React, { useState } from 'react'
import styles from './MoxieChat.module.css'
import { tableReservationToCartItem, addMenuItemToCart } from '../../lib/moxie/cartActions'
import { validateBooking } from '../../lib/moxie/validation'
import { useCartStore } from '../../context/cartStore'
import { findMenuItem, getMenu } from '../../lib/moxie/menu'
import toast from 'react-hot-toast'

interface Props {
	className?: string
}

export default function MoxieChat({ className }: Props) {
	const [open, setOpen] = useState(false)
	const [message, setMessage] = useState('')
	const [status, setStatus] = useState<string | null>(null)

	const addToCart = useCartStore((s: any) => s.addItem)

	async function handleAddReservation() {
		const booking = {
			name: 'Guest',
			phone: '0712345678',
			time: '19:00',
			guests: 2,
			date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
		}

		const valid = validateBooking(booking as any)
		if (!valid.valid) {
			setStatus(valid.error ?? 'Invalid booking data')
			return
		}

		const cartItem = tableReservationToCartItem({
			time: booking.time,
			guests: booking.guests,
			name: booking.name,
			phone: booking.phone,
			date: booking.date,
		})

		addToCart(cartItem)
		setStatus('Added reservation to cart')
	}

	async function handleAddMenuItem() {
		// Try to resolve menu item from the user's message
		let item = null
		if (message && message.trim().length > 2) {
			item = findMenuItem(message)
		}

		if (!item) {
			const popular = getMenu({ popular: true })
			item = popular && popular.length ? popular[0] : null
		}

		if (!item) {
			toast.error('Could not find a menu item to add')
			setStatus('No menu item found')
			return
		}

		const cartItem = addMenuItemToCart(item as any, 1)
		addToCart(cartItem)
		toast.success(`${item.name} added to cart`)
		setStatus(`Added ${item.name} to cart`)
	}

	return (
		<div className={`${styles.moxieRoot} ${className ?? ''}`.trim()}>
			{open && (
				<div className={styles.chatPanel} role="dialog" aria-label="Moxie chat panel">
					<button className={styles.moxieExit} onClick={() => setOpen(false)}>
						Exit
					</button>

					<div className={styles.chatHeader}>
						<div className={styles.chatHeaderLeft}>
							<div className={styles.moxieAvatar}>🤖</div>
							<div>
								<div className={styles.moxieTitle}>Moxie — Concierge</div>
								<div className={styles.moxieSubtitle}>Ask about bookings</div>
							</div>
						</div>
						<div style={{ display: 'flex', gap: 8 }}>
							<button onClick={handleAddReservation} className="rounded-2xl bg-[#d9c7a2]/10 px-3 py-2 text-sm">Add Table</button>
							<button onClick={handleAddMenuItem} className="rounded-2xl bg-[#d9c7a2]/10 px-3 py-2 text-sm">Add Dish</button>
						</div>
					</div>

					<div style={{ padding: 16 }}>
						<div style={{ marginBottom: 8 }}>
							<input
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								placeholder="Ask Moxie anything..."
								className="w-full rounded-md border px-3 py-2 bg-black text-white"
							/>
						</div>

						<div style={{ display: 'flex', gap: 8 }}>
							<button onClick={() => setMessage('')} className="rounded-2xl bg-white/10 px-4 py-2">Clear</button>
							<button
								onClick={() => setStatus('Moxie is thinking...')}
								className="rounded-2xl bg-[#d9c7a2] px-4 py-2 text-black"
							>
								Send
							</button>
						</div>

						{status && <div style={{ marginTop: 12 }}>{status}</div>}
					</div>
				</div>
			)}

			<button
				onClick={() => setOpen((s) => !s)}
				className={`${styles.moxieBubble} ${open ? styles.moxiePulse : ''}`}
				aria-label={open ? 'Close chat' : 'Open chat'}
			>
				💬
			</button>
		</div>
	)
}
