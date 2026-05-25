// src/lib/moxie/tools.ts
// Basic callable tools for Moxie agent — server and client safe

import { findMenuItem, menuItemToCartItem, getMenu } from './menu'
import { tableReservationToCartItem } from './cartActions'
import { validateBooking } from './validation'

export async function tool_find_menu(query: string) {
  const item = findMenuItem(query)
  if (!item) return { found: false }
  return { found: true, item: { id: item.id, name: item.name, price: item.price, description: item.description } }
}

export async function tool_add_menu_to_cart(params: { query?: string, qty?: number }) {
  const q = params.query || ''
  let item = q ? findMenuItem(q) : null
  if (!item) {
    const popular = getMenu({ popular: true })
    item = popular && popular.length ? popular[0] : null
  }

  if (!item) return { ok: false, error: 'Menu item not found' }

  const cartItem = menuItemToCartItem(item, params.qty || 1)
  return { ok: true, cartItem }
}

export async function tool_create_reservation(params: any) {
  const validation = validateBooking(params)
  if (!validation.valid) return { ok: false, error: validation.error }

  const cartItem = tableReservationToCartItem({
    time: params.time,
    guests: params.guests,
    name: params.name,
    phone: params.phone,
    date: params.date,
    notes: params.notes,
  })

  return { ok: true, cartItem }
}

export default {
  tool_find_menu,
  tool_add_menu_to_cart,
  tool_create_reservation,
}
