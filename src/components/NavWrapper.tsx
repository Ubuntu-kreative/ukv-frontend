'use client'

import { useMemo, useState, useEffect } from 'react'
import UbuntuNav, { JourneyItem } from './UbuntuNav'
import { useCartStore, CartItem } from '@/context/cartStore'

/**
 * NavWrapper bridges the UbuntuNav luxury component with the existing cartStore
 * It transforms CartItem objects to JourneyItem format and handles cart operations
 * Now includes dynamic farm data integration, availability, and smart suggestions
 */
export default function NavWrapper() {
  const { items, removeItem, openCart } = useCartStore()
  const [harvestData, setHarvestData] = useState({ count: 0, readyCrops: [] as string[] })
  const [availability, setAvailability] = useState({ cottages: 2, spa: 5 })
  const [suggestion, setSuggestion] = useState<{ title: string; description: string } | null>(null)

  // Fetch farm data dynamically
  useEffect(() => {
    // In production, this would come from your farm API
    // For now, we'll simulate it based on the farm-data structure
    const harvestReadyCrops = ['Sukuma Wiki (Kale)', 'Lemongrass', 'Rosemary']
    const totalCrops = 18 // Total crops in the farm
    
    setHarvestData({
      count: harvestReadyCrops.length,
      readyCrops: harvestReadyCrops
    })
  }, [])

  // Simulate availability (in production, connect to booking API)
  useEffect(() => {
    const checkAvailability = () => {
      setAvailability({
        cottages: Math.max(0, 2 - Math.floor(Math.random() * 3)), // 0-2 available
        spa: Math.max(0, 5 - Math.floor(Math.random() * 6)), // 0-5 available
      })
    }
    
    checkAvailability()
    const interval = setInterval(checkAvailability, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  // Smart suggestions based on cart contents
  useEffect(() => {
    if (items.length === 0) {
      setSuggestion(null)
      return
    }

    const categories = items.map(item => item.category)
    const hasCottage = categories.includes('cottage')
    const hasSpa = categories.includes('spa')
    const hasFarm = categories.includes('farm')
    const hasRestaurant = categories.includes('restaurant')

    // Generate contextual suggestions
    if (hasCottage && !hasSpa && availability.spa > 0) {
      setSuggestion({
        title: 'Complete your stay',
        description: `${availability.spa} spa sessions available today - perfect after your farm walk`,
      })
    } else if (hasCottage && !hasFarm) {
      setSuggestion({
        title: 'Farm experience recommended',
        description: 'Add a sunrise farm walk to complete the Ubuntu experience',
      })
    } else if (hasSpa && !hasRestaurant) {
      setSuggestion({
        title: 'Farm-to-table dining',
        description: 'Enjoy our morning harvest in the farm breakfast',
      })
    } else {
      setSuggestion(null)
    }
  }, [items, availability])

  // Transform CartItem to JourneyItem format for UbuntuNav
  const journeyItems = useMemo(() => {
    return items.map((item): JourneyItem => {
      // Create appropriate icon based on category
      const getIcon = (category: string) => {
        switch (category) {
          case 'cottage': return '🏡'
          case 'spa': return '💆'
          case 'restaurant': return '🍽️'
          case 'farm': return '🌱'
          default: return '✨'
        }
      }

      // Format subtitle based on item data
      const getSubtitle = (item: CartItem) => {
        if (item.category === 'cottage') {
          return `${item.qty || 1} night${(item.qty || 1) > 1 ? 's' : ''} · ${item.tag}`
        }
        return `${item.tag} · ${item.unit}`
      }

      return {
        id: item.cartKey || item.id,
        name: item.name,
        sub: getSubtitle(item),
        price: (item.price || 0) * (item.qty || item.quantity || 1),
        icon: getIcon(item.category),
      }
    })
  }, [items])

  // Handle remove item - UbuntuNav passes id, but cartStore uses cartKey or id
  const handleRemoveItem = (id: string) => {
    removeItem(id)
  }

  return (
    <UbuntuNav
      journeyItems={journeyItems}
      onRemoveItem={handleRemoveItem}
      harvestCount={harvestData.count}
      readyCrops={harvestData.readyCrops}
      availability={availability}
      suggestion={suggestion}
    />
  )
}
