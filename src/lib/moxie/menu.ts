// src/lib/moxie/menu.ts
// ─────────────────────────────────────────────────────────────────────
// Ubuntu Kreative Village — Live Menu Service
//
// Single source of truth for all menu data.
// In production: replace getMenu() with a Sanity/Supabase fetch.
// The static data below matches the real menu exactly.
// ─────────────────────────────────────────────────────────────────────

export interface MenuItem {
  id:          string
  name:        string
  description: string
  price:       number
  category:    MenuCategory
  section:     'signature' | 'village-kitchen'
  dietary:     ('vegetarian' | 'vegan' | 'gluten-free' | 'halal' | 'contains-nuts' | 'spicy')[]
  fromFarm:    boolean   // traced to Ubuntu farm
  popular:     boolean
  available:   boolean
}

export type MenuCategory =
  | 'starters'
  | 'signature-collection'
  | 'mains'
  | 'vegetarian'
  | 'desserts'
  | 'drinks'
  | 'breakfast'
  | 'soups'
  | 'choma'
  | 'beverages'

// ─────────────────────────────────────────────────────────────────────
// SIGNATURE RESTAURANT
// ─────────────────────────────────────────────────────────────────────
const SIGNATURE_MENU: MenuItem[] = [
  // Starters
  {
    id: 'sig-starter-001',
    name: 'Smoked Farm Bone Broth',
    description: 'Slow-rendered from Ubuntu cattle bones, finished with wild herbs and farm-dried chilli',
    price: 850,
    category: 'starters',
    section: 'signature',
    dietary: ['halal', 'gluten-free'],
    fromFarm: true,
    popular: true,
    available: true,
  },
  {
    id: 'sig-starter-002',
    name: 'Apiary Honey & Goat Cheese',
    description: 'Raw Ubuntu honey, aged farm goat cheese, sourdough crisps, wild thyme',
    price: 1200,
    category: 'starters',
    section: 'signature',
    dietary: ['vegetarian'],
    fromFarm: true,
    popular: true,
    available: true,
  },
  {
    id: 'sig-starter-003',
    name: 'Farm Egg Tasting Trio',
    description: 'Three preparations of Ubuntu kienyeji eggs: soft-boiled, farm-smoked, raw-cured with hibiscus salt',
    price: 950,
    category: 'starters',
    section: 'signature',
    dietary: ['vegetarian', 'gluten-free'],
    fromFarm: true,
    popular: false,
    available: true,
  },

  // Signature Collection
  {
    id: 'sig-main-001',
    name: 'Ember Tomahawk',
    description: 'Acacia-charred, 45-day dry-aged tomahawk. Rested 20 minutes at tableside. Served with roasted marrow and farm greens',
    price: 7500,
    category: 'signature-collection',
    section: 'signature',
    dietary: ['halal', 'gluten-free'],
    fromFarm: true,
    popular: true,
    available: true,
  },
  {
    id: 'sig-main-002',
    name: 'Rift Valley Wagyu A5',
    description: '72-hour marinated with farm-pressed botanicals. Sliced tableside on heated stone',
    price: 6500,
    category: 'signature-collection',
    section: 'signature',
    dietary: ['halal', 'gluten-free'],
    fromFarm: false,
    popular: true,
    available: true,
  },
  {
    id: 'sig-main-003',
    name: 'Firepit Oxtail',
    description: '16-hour clay-pit braise, served with ugali pearls, farm kale oil, and fermented farm chilli',
    price: 3200,
    category: 'signature-collection',
    section: 'signature',
    dietary: ['halal', 'gluten-free'],
    fromFarm: true,
    popular: true,
    available: true,
  },
  {
    id: 'sig-main-004',
    name: 'Smoked Nile Perch',
    description: 'Banana-leaf wrapped, 4-hour cold smoke. Served with coconut-cassava purée and farm tomato relish',
    price: 2800,
    category: 'signature-collection',
    section: 'signature',
    dietary: ['halal', 'gluten-free'],
    fromFarm: false,
    popular: false,
    available: true,
  },
  {
    id: 'sig-main-005',
    name: 'Ubuntu Lamb Shank',
    description: 'Slow-braised in farm rosemary and Kilimanjaro red wine reduction. Served with mashed arrowroot',
    price: 3800,
    category: 'signature-collection',
    section: 'signature',
    dietary: ['halal', 'gluten-free'],
    fromFarm: false,
    popular: false,
    available: true,
  },

  // Vegetarian Signature
  {
    id: 'sig-veg-001',
    name: 'Fire-Roasted Harvest Platter',
    description: 'Seasonal vegetables direct from Ubuntu fields, roasted on acacia wood. Served with apiary honey dressing and farm herb oils',
    price: 2200,
    category: 'vegetarian',
    section: 'signature',
    dietary: ['vegetarian', 'vegan', 'gluten-free'],
    fromFarm: true,
    popular: true,
    available: true,
  },
  {
    id: 'sig-veg-002',
    name: 'Farm Kale & Goat Cheese Ravioli',
    description: 'Hand-rolled pasta, Ubuntu kale filling, aged farm goat cheese, burnt butter and thyme',
    price: 1800,
    category: 'vegetarian',
    section: 'signature',
    dietary: ['vegetarian'],
    fromFarm: true,
    popular: false,
    available: true,
  },

  // Desserts — The Apiary
  {
    id: 'sig-dessert-001',
    name: 'Raw Honey Panna Cotta',
    description: 'Ubuntu apiary raw honey, farm cream, topped with caramelised farm fruit and bee pollen',
    price: 1100,
    category: 'desserts',
    section: 'signature',
    dietary: ['vegetarian', 'gluten-free'],
    fromFarm: true,
    popular: true,
    available: true,
  },
  {
    id: 'sig-dessert-002',
    name: 'Charcoal & Chocolate Tart',
    description: 'Activated charcoal shell, 70% farm-origin cacao ganache, salted apiary caramel',
    price: 1300,
    category: 'desserts',
    section: 'signature',
    dietary: ['vegetarian'],
    fromFarm: false,
    popular: false,
    available: true,
  },

  // Drinks
  {
    id: 'sig-drink-001',
    name: 'The Ubuntu',
    description: 'Hibiscus gin, Ubuntu apiary honey, farm lemon verbena, activated charcoal ice',
    price: 1300,
    category: 'drinks',
    section: 'signature',
    dietary: ['vegan', 'gluten-free'],
    fromFarm: true,
    popular: true,
    available: true,
  },
  {
    id: 'sig-drink-002',
    name: 'Farm Sunset Mocktail',
    description: 'Cold-pressed farm ginger, hibiscus, tamarind, smoked salt rim',
    price: 750,
    category: 'drinks',
    section: 'signature',
    dietary: ['vegan', 'gluten-free'],
    fromFarm: true,
    popular: false,
    available: true,
  },
]

// ─────────────────────────────────────────────────────────────────────
// VILLAGE KITCHEN
// ─────────────────────────────────────────────────────────────────────
const VILLAGE_KITCHEN_MENU: MenuItem[] = [
  // Breakfast
  {
    id: 'vk-breakfast-001',
    name: 'Ubuntu Classic Breakfast',
    description: 'Farm eggs, arrowroot, sweet potato, Ubuntu tea or coffee, farm fruit',
    price: 1500,
    category: 'breakfast',
    section: 'village-kitchen',
    dietary: ['vegetarian', 'gluten-free', 'halal'],
    fromFarm: true,
    popular: true,
    available: true,
  },
  {
    id: 'vk-breakfast-002',
    name: 'English Farm Breakfast',
    description: 'Farm sausages, kienyeji eggs (any style), sourdough toast, baked beans, roasted tomatoes',
    price: 2200,
    category: 'breakfast',
    section: 'village-kitchen',
    dietary: ['halal'],
    fromFarm: true,
    popular: true,
    available: true,
  },
  {
    id: 'vk-breakfast-003',
    name: 'Ubuntu Traditional Plate',
    description: 'Arrowroot, kienyeji eggs, coconut beans, sukuma wiki, fermented milk',
    price: 2600,
    category: 'breakfast',
    section: 'village-kitchen',
    dietary: ['vegetarian', 'gluten-free', 'halal'],
    fromFarm: true,
    popular: true,
    available: true,
  },

  // Mains
  {
    id: 'vk-main-001',
    name: 'Kienyeji Farm Chicken',
    description: 'Slow-cooked Ubuntu free-range chicken, served with ugali or rice and farm greens',
    price: 2500,
    category: 'mains',
    section: 'village-kitchen',
    dietary: ['halal', 'gluten-free'],
    fromFarm: true,
    popular: true,
    available: true,
  },
  {
    id: 'vk-main-002',
    name: 'Garlic Whole Tilapia',
    description: 'Farm-caught tilapia, garlic butter, lemon, fresh farm herbs. Served with ugali and kachumbari',
    price: 2000,
    category: 'mains',
    section: 'village-kitchen',
    dietary: ['halal', 'gluten-free'],
    fromFarm: true,
    popular: true,
    available: true,
  },
  {
    id: 'vk-main-003',
    name: 'Ubuntu Biryani',
    description: 'Farm-spiced rice with seasonal vegetables and choice of chicken or vegetarian',
    price: 1000,
    category: 'mains',
    section: 'village-kitchen',
    dietary: ['halal'],
    fromFarm: true,
    popular: false,
    available: true,
  },
  {
    id: 'vk-main-004',
    name: 'Coconut Vegetable Curry',
    description: 'Seasonal Ubuntu farm vegetables in house-ground coconut curry. Served with chapati or rice',
    price: 1200,
    category: 'mains',
    section: 'village-kitchen',
    dietary: ['vegetarian', 'vegan', 'gluten-free'],
    fromFarm: true,
    popular: false,
    available: true,
  },

  // Choma
  {
    id: 'vk-choma-001',
    name: 'Farm Nyama Choma',
    description: 'Ubuntu farm beef, charcoal-grilled, served with kachumbari and ugali',
    price: 1800,
    category: 'choma',
    section: 'village-kitchen',
    dietary: ['halal', 'gluten-free'],
    fromFarm: true,
    popular: true,
    available: true,
  },
  {
    id: 'vk-choma-002',
    name: 'Choma Chicken Half',
    description: 'Ubuntu kienyeji chicken, marinated overnight, charcoal-grilled. With chips or ugali',
    price: 1400,
    category: 'choma',
    section: 'village-kitchen',
    dietary: ['halal', 'gluten-free'],
    fromFarm: true,
    popular: true,
    available: true,
  },

  // Beverages
  {
    id: 'vk-bev-001',
    name: 'Farm Herbal Infusions',
    description: 'Lemongrass, hibiscus, or green tea — all grown on Ubuntu farm',
    price: 350,
    category: 'beverages',
    section: 'village-kitchen',
    dietary: ['vegan', 'gluten-free'],
    fromFarm: true,
    popular: true,
    available: true,
  },
  {
    id: 'vk-bev-002',
    name: 'African Chai',
    description: 'Ubuntu farm milk, masala spices, strong black tea',
    price: 200,
    category: 'beverages',
    section: 'village-kitchen',
    dietary: ['vegetarian'],
    fromFarm: true,
    popular: true,
    available: true,
  },
  {
    id: 'vk-bev-003',
    name: 'Fresh Farm Juice',
    description: 'Seasonal pressed juice — ask your server what the farm has today',
    price: 400,
    category: 'beverages',
    section: 'village-kitchen',
    dietary: ['vegan', 'gluten-free'],
    fromFarm: true,
    popular: false,
    available: true,
  },
]

// ─────────────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────────────

export const ALL_MENU_ITEMS: MenuItem[] = [...SIGNATURE_MENU, ...VILLAGE_KITCHEN_MENU]

/**
 * Get the full menu, optionally filtered.
 * In production: replace this with a Sanity/Supabase fetch.
 */
export function getMenu(options?: {
  section?:  'signature' | 'village-kitchen'
  category?: MenuCategory
  dietary?:  string
  popular?:  boolean
  fromFarm?: boolean
}): MenuItem[] {
  let items = ALL_MENU_ITEMS.filter(i => i.available)

  if (options?.section)  items = items.filter(i => i.section  === options.section)
  if (options?.category) items = items.filter(i => i.category === options.category)
  if (options?.popular)  items = items.filter(i => i.popular)
  if (options?.fromFarm) items = items.filter(i => i.fromFarm)
  if (options?.dietary)  {
    const d = options.dietary.toLowerCase()
    items = items.filter(i => i.dietary.some(tag => tag.toLowerCase().includes(d)))
  }

  return items
}

/**
 * Get a Moxie-formatted menu summary string for injecting into AI context.
 * Keeps token count low — just names, prices, and key tags.
 */
export function getMenuSummaryForAI(options?: {
  section?: 'signature' | 'village-kitchen'
  dietary?: string
}): string {
  const items = getMenu(options)

  const grouped: Record<string, MenuItem[]> = {}
  items.forEach(item => {
    if (!grouped[item.category]) grouped[item.category] = []
    grouped[item.category].push(item)
  })

  const categoryLabels: Record<string, string> = {
    starters:             'Starters',
    'signature-collection': 'Signature Collection',
    mains:                'Mains',
    vegetarian:           'Vegetarian',
    desserts:             'The Apiary (Desserts)',
    drinks:               'Drinks',
    breakfast:            'Breakfast',
    soups:                'Soups',
    choma:                'Choma Zone',
    beverages:            'Beverages',
  }

  return Object.entries(grouped).map(([cat, catItems]) => {
    const label = categoryLabels[cat] || cat
    const lines = catItems.map(item => {
      const tags: string[] = []
      if (item.fromFarm) tags.push('farm-sourced')
      if (item.popular)  tags.push('popular')
      if (item.dietary.includes('vegetarian')) tags.push('vegetarian')
      if (item.dietary.includes('vegan'))      tags.push('vegan')
      return `  • ${item.name} — KES ${item.price.toLocaleString()}${tags.length ? ` (${tags.join(', ')})` : ''}`
    }).join('\n')
    return `${label}:\n${lines}`
  }).join('\n\n')
}

/**
 * Find a menu item by rough name match — used by Moxie to add items to cart.
 */
export function findMenuItem(query: string): MenuItem | null {
  const q = query.toLowerCase()
  return ALL_MENU_ITEMS.find(item =>
    item.available &&
    (item.name.toLowerCase().includes(q) ||
     item.description.toLowerCase().includes(q))
  ) || null
}

/**
 * Get cart-ready representation of a menu item.
 */
export function menuItemToCartItem(item: MenuItem, qty = 1) {
  return {
    id:       item.id,
    cartKey:  item.id,
    name:     item.name,
    price:    item.price,
    qty,
    tag:      item.section === 'signature' ? 'Signature Dining' : 'Village Kitchen',
    category: 'restaurant' as const,
    unit:     '/ person',
    note:     item.fromFarm ? 'Farm-sourced' : undefined,
  }
}