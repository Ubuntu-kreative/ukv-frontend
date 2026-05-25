/**
 * FarmExperiences/actions.ts
 *
 * Pure action helpers that call Zustand's getState() at *call time*,
 * NOT at render time. They do NOT subscribe to the store, so calling
 * them never triggers a re-render.
 *
 * Hoisted at module level → created once, garbage-collected never.
 */

import { useCartStore } from '@/context/cartStore'
import toast from 'react-hot-toast'
import type { ExperienceItem, TabItem } from '../../../_data/farm-data'
import { TOAST_STYLE, TOAST_ICON_THEME } from './constants'

export function addExperienceAction(exp: ExperienceItem, qty = 1) {
  const { addItem } = useCartStore.getState()
  for (let i = 0; i < qty; i++) {
    addItem({
      id:       exp.id,
      name:     exp.name,
      category: 'farm',
      tag:      exp.category,
      price:    exp.price,
      unit:     '/ person',
    })
  }
  toast.success(`${exp.name} added to cart`, {
    style:     TOAST_STYLE,
    iconTheme: TOAST_ICON_THEME,
  })
}

export function addTabItemAction(item: TabItem) {
  const { addItem } = useCartStore.getState()
  addItem({
    id:       item.id,
    name:     item.name,
    category: 'farm',
    tag:      item.tag,
    price:    item.price ?? 0,
    unit:     '/ person',
  })
  toast.success(`${item.name} added to cart`, { style: TOAST_STYLE })
}