'use client'

import type { CartItem } from '@/context/cartStore'
import { validateBooking } from './validation'
import type { MoxieCartItem } from './cartActions'

export interface PendingConfirmation {
  id: string
  type: 'cart_add' | 'reservation'
  summary: string
  cartItem?: MoxieCartItem
  guest?: {
    name: string
    phone: string
    email?: string
  }
}

function moxieItemToCart(item: MoxieCartItem, pathname: string): Omit<CartItem, 'quantity'> & { qty?: number } {
  return {
    id: item.id,
    cartKey: item.cartKey,
    name: item.name,
    price: item.price,
    tag: item.tag,
    category: item.category,
    unit: item.unit,
    note: item.note,
    qty: item.qty,
    sourcePath: pathname,
  }
}

export function buildPendingFromToolResult(
  toolCall: { name: string; args?: Record<string, unknown> } | null,
  toolResult: { ok?: boolean; cartItem?: MoxieCartItem; error?: string } | null,
  pathname: string,
): { pending: PendingConfirmation | null; error?: string } {
  if (!toolResult?.ok || !toolResult.cartItem) {
    return { pending: null, error: toolResult?.error || 'Could not prepare that action.' }
  }

  const item = toolResult.cartItem
  const args = toolCall?.args ?? {}

  if (toolCall?.name === 'create_reservation') {
    const validation = validateBooking({
      name: String(args.guestName || args.name || ''),
      phone: String(args.phone || ''),
      email: args.email ? String(args.email) : undefined,
      guests: Number(args.guests) || 1,
      date: args.date ? String(args.date) : undefined,
      time: args.time ? String(args.time) : undefined,
      notes: args.notes ? String(args.notes) : undefined,
    })
    if (!validation.valid) {
      return { pending: null, error: validation.error }
    }

    const guest = {
      name: String(args.guestName || args.name),
      phone: String(args.phone),
      email: args.email ? String(args.email) : undefined,
    }

    return {
      pending: {
        id: `confirm_${item.cartKey}`,
        type: 'reservation',
        summary: [
          `Reservation: ${item.name}`,
          `Guest: ${guest.name}`,
          `Phone: ${guest.phone}`,
          guest.email ? `Email: ${guest.email}` : '',
          `Total: KES ${(item.price * (item.qty || 1)).toLocaleString()}`,
        ].filter(Boolean).join('\n'),
        cartItem: item,
        guest,
      },
    }
  }

  if (toolCall?.name === 'add_to_cart') {
    return {
      pending: {
        id: `confirm_${item.cartKey}`,
        type: 'cart_add',
        summary: `Add to your journey:\n${item.name} × ${item.qty || 1}\nKES ${(item.price * (item.qty || 1)).toLocaleString()}`,
        cartItem: item,
      },
    }
  }

  return {
    pending: {
      id: `confirm_${item.cartKey}`,
      type: 'cart_add',
      summary: `Add to your journey:\n${item.name}`,
      cartItem: item,
    },
  }
}

export function applyCartItem(
  item: MoxieCartItem,
  pathname: string,
  addItem: (item: Omit<CartItem, 'quantity'> & { qty?: number }) => void,
) {
  addItem(moxieItemToCart(item, pathname))
}
