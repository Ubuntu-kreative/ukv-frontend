/**
 * src/app/restaurant/_data/menu-data.ts
 *
 * Pure static data — NO "use client".
 * Exports both the raw MENU_ITEMS structure AND the derived
 * DISHES / CATEGORIES / DIETARY_FILTERS / SORT_OPTIONS shapes
 * that MenuGrid.tsx expects.
 */

// ─── TYPES (MenuGrid-facing) ──────────────────────────────────────────────────

export type DietaryTag =
  | 'Vegan'
  | 'Vegetarian'
  | 'GF'
  | 'High Protein'
  | 'Seafood'
  | 'Traditional'
  | 'Signature'

export type SortKey = 'default' | 'price-asc' | 'price-desc' | 'popular' | 'recommended'

/** The shape MenuGrid works with */
export interface Dish {
  id:          string
  name:        string
  description: string
  storyLine?:  string
  image:       string
  price:       number
  category:    string    // matches Category.id
  tags:        DietaryTag[]
  popular?:    boolean
  recommended?: boolean
  featured?:   boolean
  chefChoice?: boolean
  seasonal?:   boolean
  signature?:  boolean
  customisable?: boolean
  // farm metadata
  field?:      string
  freshness?:  number
  phLevel?:    string
  temp?:       string
  offset?:     string
  animal?:     string
  // booking/order metadata
  availability?: string
  prepTime?:   number
  calories?:   number
  allergens?:  string[]
  servingSize?: string
  ingredients?: string[]
  pairing?:   string
  trendScore?: number
  co2Score?:  'low' | 'medium' | 'high'
  availabilityCount?: number
}

export interface Category {
  id:       string
  label:    string
  emoji?:   string
  subtitle?: string
}

// ─── SORT OPTIONS ─────────────────────────────────────────────────────────────

export const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: 'default',     label: 'Default'        },
  { id: 'popular',     label: 'Most Popular'   },
  { id: 'recommended', label: 'Recommended'    },
  { id: 'price-asc',   label: 'Price: Low→High' },
  { id: 'price-desc',  label: 'Price: High→Low' },
]

// ─── DIETARY FILTERS ──────────────────────────────────────────────────────────

export const DIETARY_FILTERS: { id: DietaryTag; label: string }[] = [
  { id: 'Vegan',        label: '🌱 Vegan'        },
  { id: 'Vegetarian',   label: '🥦 Vegetarian'   },
  { id: 'GF',           label: '🌾 GF / Keto'    },
  { id: 'High Protein', label: '💪 High Protein'  },
  { id: 'Seafood',      label: '🐟 Seafood'       },
]

// ─── CATEGORIES ───────────────────────────────────────────────────────────────

export const CATEGORIES: Category[] = [
  { id: 'all',              label: 'All',               emoji: '✦'  },
  { id: 'Breakfast',        label: 'Breakfast',         emoji: '🌅', subtitle: 'Rise with the farm. Morning meals built from what was gathered at dawn.' },
  { id: 'Main Course',      label: 'Main Course',       emoji: '🍽', subtitle: 'The heart of the Ubuntu kitchen — fire, land and slow-cooked craft.' },
  { id: 'Farm Specialities',label: 'Farm Specialities', emoji: '🪵', subtitle: 'Slow-cooked Ubuntu traditions. Each pot tells a story of time and patience.' },
  { id: 'Specials',         label: 'Specials',          emoji: '🔥', subtitle: 'Mbuzi, chicken and fish — your way, your method, your moment.' },
  { id: 'Accompaniments',   label: 'Accompaniments',    emoji: '🌾', subtitle: 'From the fields. Simple, honest, made to share.' },
  { id: 'Pizzas',           label: 'Pizzas',            emoji: '🍕', subtitle: 'Stone-baked in the Ubuntu oven. Farm-sourced toppings.' },
  { id: 'Pork & Grill',     label: 'Pork & Grill',      emoji: '🥩', subtitle: 'Open flame. Smoke. The oldest way to cook — still the best.' },
  { id: 'Salads & Snacks',  label: 'Salads & Snacks',   emoji: '🥗', subtitle: 'Light bites from the farm and fire.' },
  { id: 'Soups',            label: 'Soups',             emoji: '🍲', subtitle: 'Slow-cooked. Patient. The kind of warmth that takes time.' },
  { id: 'Sauces',           label: 'Sauces',            emoji: '🫙', subtitle: 'House-made condiments to elevate every plate.' },
  { id: 'Hot Beverages',    label: 'Hot Beverages',     emoji: '☕', subtitle: 'Grown on this farm. Sourced from the valley. Poured with care.' },
  { id: 'Cold Beverages',   label: 'Cold Beverages',    emoji: '🧃', subtitle: 'Pressed, blended and chilled — straight from the orchard.' },
  { id: 'Smoothies',        label: 'Smoothies',         emoji: '🥤', subtitle: 'Blended from the orchard. No powder. No preserve. Just the real thing.' },
  { id: 'Milkshakes',       label: 'Milkshakes',        emoji: '🥛', subtitle: 'Thick-blend, real ice cream, farm milk. The proper way.' },
  { id: 'Ice Cream',        label: 'Ice Cream',         emoji: '🍦', subtitle: 'Churned daily. Cold. Simple. The perfect finish.' },
]

// ─── DISHES (flat array — the primary data structure for MenuGrid) ────────────

export const DISHES: Dish[] = [
  // ── BREAKFAST ──────────────────────────────────────────────────────────────
  {
    id: 'bk-1', category: 'Breakfast', name: 'The Classic Eco Lodge Delight',
    image: '/images/The-Classic-Eco-Lodge-Delight.jpeg',
    description: 'Sweet potatoes, pancakes, sausages and boiled eggs.',
    storyLine: 'The village wakes before you do. By the time this plate reaches your table, the sweet potatoes have come from Field C and the eggs collected from the morning count. Served with coffee, hot milk, black tea or freshly squeezed juice.',
    price: 1500,
    tags: ['High Protein'],
    chefChoice: true, popular: true,
    field: 'Farm Kitchen', freshness: 99, phLevel: '6.8', temp: 'Warm', offset: '0.6kg',
    ingredients: ['Sweet Potatoes', 'Pancakes', 'Grilled Sausages', 'Boiled Eggs'],
    availability: 'Available Today', pairing: 'Pairs with African Tea or Fresh Juice',
    prepTime: 20, calories: 720, allergens: ['Gluten', 'Eggs', 'Dairy'], servingSize: 'Full plate + drink',
    trendScore: 88, co2Score: 'low',
  },
  {
    id: 'bk-2', category: 'Breakfast', name: 'The English Farm Breakfast',
    image: '/images/The-English-Farm-Breakfast.jpeg',
    description: 'Sausages, omelettes, bacon, beans and fruit cuts.',
    storyLine: 'A full plate of farm-raised proteins and garden vegetables. Sausage, omelette or sunny-side egg, streaky bacon, baked beans and seasonal fruits. Choose African tea, coffee, juice or hot milk.',
    price: 2200,
    tags: ['High Protein'],
    featured: true, chefChoice: true,
    field: 'Farm Kitchen', freshness: 98, phLevel: '6.5', temp: 'Hot', offset: '0.9kg',
    ingredients: ['Sausages', 'Omelette', 'Bacon', 'Baked Beans', 'Fruit Cuts'],
    availability: 'Available Today',
    prepTime: 25, calories: 960, allergens: ['Gluten', 'Eggs', 'Dairy'], servingSize: 'Full plate + drink',
    trendScore: 82, co2Score: 'low',
  },
  {
    id: 'bk-3', category: 'Breakfast', name: 'Ubuntu Eco Lodge Family Harvest Plate',
    image: '/images/Ubuntu-Eco-Lodge-Family-Harvest-Plate.jpeg',
    description: 'Arrowroot, sweet potatoes, kienyeji eggs, beans in coconut sauce.',
    storyLine: 'Before the hotel, before the farm, there was this plate. The arrowroot from the upper ridge, the kienyeji eggs still warm from the yard, beans cooked slow in coconut. Served with millet porridge, African tea, coffee, hot milk or juice.',
    price: 2600,
    tags: ['Traditional', 'GF'],
    signature: true, chefChoice: true, recommended: true,
    field: 'Heritage Kitchen', freshness: 100, phLevel: '6.9', temp: 'Warm', offset: '0.8kg',
    ingredients: ['Arrowroot', 'Sweet Potatoes', 'Kienyeji Eggs', 'Beans in Coconut Sauce'],
    availability: 'Available Today', pairing: 'Pairs with Millet Porridge or African Tea',
    prepTime: 30, calories: 680, allergens: ['Eggs'], servingSize: 'Full plate + drink',
    trendScore: 91, co2Score: 'low',
  },

  // ── MAIN COURSE ───────────────────────────────────────────────────────────
  {
    id: 'mc-1', category: 'Main Course', name: 'The Mighty Traditional Platter',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200',
    description: 'Wet fry mbuzi, dry fry chicken, fries, ugali, mashed potatoes and kachumbari salad.',
    storyLine: 'The Ubuntu table at its most generous. Wet fry goat from the Boma herd and dry fry yard chicken on a single platter, surrounded by fries, hand-pounded ugali, mashed potato and a raw kachumbari that cuts through everything. This is celebration food.',
    price: 4500,
    tags: ['High Protein', 'Signature'],
    signature: true, featured: true, chefChoice: true, popular: true, recommended: true,
    animal: 'UKV-Boma', field: 'Open Fire Pit', freshness: 96, phLevel: '6.3', temp: 'Piping Hot', offset: '2.8kg',
    ingredients: ['Wet Fry Mbuzi', 'Dry Fry Chicken', 'Fries', 'Ugali', 'Mashed Potatoes', 'Kachumbari'],
    availability: 'Available Today',
    prepTime: 45, calories: 1480, allergens: ['None'], servingSize: 'Full sharing platter',
    trendScore: 97, co2Score: 'low',
  },
  {
    id: 'mc-2', category: 'Main Course', name: 'Grilled Whole Tilapia',
    image: '/images/Grilled-Whole-Tilapia.jpeg',
    description: 'Grilled fish, potatoes and seasoned wild lime green salad.',
    storyLine: 'Farm pond tilapia scored and grilled whole over open heat until the skin chars and crisps. Plated with roasted potatoes and a lime-dressed green salad that wakes everything up.',
    price: 2500,
    tags: ['Seafood', 'GF'],
    chefChoice: true,
    field: 'Water Pond 1', freshness: 100, phLevel: '7.0', temp: 'Open Grill', offset: '0.9kg',
    ingredients: ['Whole Tilapia', 'Potatoes', 'Wild Lime Green Salad'],
    availability: 'Available Today', pairing: 'Pairs with Fresh Juice',
    prepTime: 30, calories: 520, allergens: ['Fish'], servingSize: '1 whole fish + sides',
    trendScore: 84, co2Score: 'low',
  },
  {
    id: 'mc-3', category: 'Main Course', name: 'BBQ Dry Marinated Lake Victoria Fish',
    image: '/images/BBQ-Dry-Marinated-Lake-Victoria-Fish.jpeg',
    description: 'Dry marinated barbequed whole fish from Lake Victoria, grilled to perfection with choice of side.',
    storyLine: 'Lake Victoria fish dry-marinated overnight in the Ubuntu spice blend, then slow-grilled over hardwood until the marinade caramelises into the skin. Every bite carries the lake and the fire in the same breath.',
    price: 2500,
    tags: ['Seafood', 'GF'],
    customisable: true,
    field: 'Lake Victoria', freshness: 98, phLevel: '7.1', temp: 'BBQ Char', offset: '1.0kg',
    ingredients: ['Lake Victoria Fish', 'Dry Marinade', 'Aromatic Spices', 'Choice of Side'],
    availability: 'Available Today', pairing: 'Pairs with Ugali or Chips',
    prepTime: 35, calories: 490, allergens: ['Fish'], servingSize: '1 whole fish + side',
    trendScore: 78, co2Score: 'low',
  },
  {
    id: 'mc-4', category: 'Main Course', name: 'Marinated Whole Tilapia — Your Way',
    image: '/images/Marinated-Whole-Tilapia.jpeg',
    description: 'Marinated whole tilapia — grilled, dry fried, wet or curry — with a side of choice.',
    storyLine: 'One fish. Four ways to cook it. The grilled version carries the smoke of the open fire; dry fried delivers crunch; wet fry is warmth in a pot; curry wraps it in deep spice. You choose how the lake comes to your table.',
    price: 2500,
    tags: ['Seafood', 'GF'],
    customisable: true,
    field: 'Farm Pond', freshness: 100, phLevel: '7.0', temp: 'Choice of Method', offset: '0.9kg',
    ingredients: ['Whole Tilapia', 'House Marinade', 'Choice of Side'],
    availability: 'Available Today',
    prepTime: 30, calories: 480, allergens: ['Fish'], servingSize: '1 whole fish + side',
    trendScore: 75, co2Score: 'low',
  },
  {
    id: 'mc-5', category: 'Main Course', name: 'Whole Grilled Lamb Chops',
    image: '/images/Whole-Grilled-Lamb-Chops.jpeg',
    description: 'Whole grilled lamb chops with a side of choice and BBQ sauce.',
    storyLine: 'Ridge-grazed lamb chops marinated in herb blend, seared on the open grill until the bone begins to colour and the fat renders sweet. Served with your choice of accompaniment and the house BBQ sauce.',
    price: 2500,
    tags: ['High Protein', 'GF'],
    chefChoice: true, customisable: true,
    animal: 'UKV-Lamb', field: 'Ridge Pasture', freshness: 96, phLevel: '6.5', temp: 'Open Grill', offset: '1.4kg',
    ingredients: ['Lamb Chops', 'Herb Marinade', 'BBQ Sauce', 'Choice of Side'],
    availability: 'Available Today', pairing: 'Pairs with Roasted Potatoes',
    prepTime: 32, calories: 720, allergens: ['None'], servingSize: 'Full rack + side',
    trendScore: 86, co2Score: 'low',
  },

  // ── FARM SPECIALITIES ─────────────────────────────────────────────────────
  {
    id: 'fs-1', category: 'Farm Specialities', name: 'Goat Tumbukiza (1kg)',
    image: '/images/Goat-Tumbukiza-(1kg).jpeg',
    description: 'Goat meat slow-cooked in a communal pot — the original Ubuntu meal.',
    storyLine: 'The communal pot that Ubuntu grew from. Slow-cooked goat from the Boma herd, falling from the bone into a rich broth after hours of patience over the fire.',
    price: 2500,
    tags: ['High Protein', 'GF'],
    signature: true, featured: true, chefChoice: true, popular: true, recommended: true,
    animal: 'UKV-Boma', field: 'Clay Pit', freshness: 96, phLevel: '6.0', temp: 'Slow Simmered', offset: '1.8kg',
    ingredients: ['Goat Meat', 'Valley Herbs', 'Root Vegetables', 'Broth'],
    availability: 'Available Today', pairing: 'Pairs with Ugali',
    prepTime: 60, calories: 820, allergens: ['None'], servingSize: '1kg serving',
    trendScore: 95, co2Score: 'low',
  },
  {
    id: 'fs-2', category: 'Farm Specialities', name: 'Whole Kienyeji Chicken Tumbukiza',
    image: '/images/Whole-Kienyeji-Chicken-Tumbukiza.jpeg',
    description: 'Free-range kienyeji chicken, slow-cooked Tumbukiza style.',
    storyLine: 'The yard chicken that grew up on this farm, cooked the old way in a sealed pot with local spices until the meat falls from the bone.',
    price: 3600,
    tags: ['High Protein', 'GF'],
    signature: true, chefChoice: true, recommended: true,
    animal: 'UKV-Yard', field: 'Heritage Pot', freshness: 98, phLevel: '6.3', temp: 'Slow Cooked', offset: '1.6kg',
    ingredients: ['Kienyeji Chicken', 'Local Spices', 'Herbs', 'Broth'],
    availability: 'Available Today', pairing: 'Pairs with Ugali or Chapati',
    prepTime: 50, calories: 720, allergens: ['None'], servingSize: '1 whole chicken',
    trendScore: 90, co2Score: 'low',
  },
  {
    id: 'fs-3', category: 'Farm Specialities', name: 'Mbuzi Tumbukiza (1kg)',
    image: '/images/Mbuzi-Tumbukiza-(1kg).jpeg',
    description: '1kg of goat meat, slow-cooked in the traditional Tumbukiza style.',
    storyLine: 'One kilogram of Boma goat, sealed in the clay pot with valley herbs and slow heat. This is what patience tastes like.',
    price: 2500,
    tags: ['High Protein', 'GF'],
    signature: true,
    animal: 'UKV-Boma', field: 'Clay Pit', freshness: 95, phLevel: '5.9', temp: 'Slow Simmered', offset: '1.5kg',
    ingredients: ['Goat Meat', 'Valley Herbs', 'Aromatic Spices', 'Broth'],
    availability: 'Available Today',
    prepTime: 55, calories: 760, allergens: ['None'], servingSize: '1kg',
    trendScore: 88, co2Score: 'low',
  },
  {
    id: 'fs-4', category: 'Farm Specialities', name: 'Biryani — Beef, Mutton or Chicken',
    image: '/images/Biryani-Beef-Mutton-or-Chicken.jpeg',
    description: 'Fragrant basmati rice layered with your choice of protein and whole spices.',
    storyLine: 'Basmati layered with farm protein and sealed tight. Caramelised onions, whole cardamom, cloves and bay leaf rise from the pot when you lift the lid.',
    price: 2500,
    tags: ['High Protein', 'GF'],
    chefChoice: true, customisable: true,
    field: 'Farm Kitchen', freshness: 96, phLevel: '6.4', temp: 'Sealed Pot', offset: '1.2kg',
    ingredients: ['Basmati Rice', 'Choice of Protein', 'Aromatic Spices', 'Caramelised Onions'],
    availability: 'Available Today',
    prepTime: 45, calories: 720, allergens: ['None'], servingSize: '400g',
    trendScore: 82, co2Score: 'low',
  },

  // ── SPECIALS ──────────────────────────────────────────────────────────────
  {
    id: 'sp-1', category: 'Specials', name: 'Mbuzi — Wet Fry, Dry Fry or Choma',
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?q=80&w=800',
    description: 'Boma goat cooked your preferred way — wet fry, dry fry or open-flame choma.',
    storyLine: 'Wet fry carries the tomato and onion depth; dry fry crisps the edges; choma is the oldest way — just fire, meat and time.',
    price: 2500,
    tags: ['High Protein', 'GF'],
    chefChoice: true, customisable: true,
    animal: 'UKV-Boma', field: 'Open Fire', freshness: 96, phLevel: '6.1', temp: 'Choice of Method', offset: '1.5kg',
    ingredients: ['Goat Meat', 'Aromatic Spices', 'Fresh Herbs'],
    availability: 'Available Today', pairing: 'Pairs with Ugali and Kachumbari',
    prepTime: 40, calories: 680, allergens: ['None'], servingSize: '300g',
    trendScore: 87, co2Score: 'low',
  },
  {
    id: 'sp-2', category: 'Specials', name: 'Chicken — Wet Fry, Dry Fry or Choma',
    image: '/images/ChickenWetFryDryFryChoma.jpeg',
    description: 'Farm chicken cooked your preferred way — wet fry, dry fry or open-flame choma.',
    storyLine: 'The wet fry warms you from inside; the dry fry delivers the crisp herb crust you came for; the choma is the version that makes the table go quiet.',
    price: 2500,
    tags: ['High Protein', 'GF'],
    customisable: true,
    animal: 'UKV-Yard', field: 'Open Fire', freshness: 97, phLevel: '6.2', temp: 'Choice of Method', offset: '1.3kg',
    ingredients: ['Farm Chicken', 'Local Spices', 'Fresh Herbs'],
    availability: 'Available Today', pairing: 'Pairs with Chapati or Ugali',
    prepTime: 35, calories: 640, allergens: ['None'], servingSize: '300g',
    trendScore: 85, co2Score: 'low',
  },
  {
    id: 'sp-3', category: 'Specials', name: 'Fish — Wet Fry, Dry Fry or Choma',
    image: '/images/FishWetFryDryFryorChoma.jpeg',
    description: 'Fresh farm fish cooked your preferred way — wet fry, dry fry or open-flame choma.',
    storyLine: 'Pond-to-plate. Dry fry for crispness, wet fry for depth, choma for the smoke that clings beautifully.',
    price: 2500,
    tags: ['Seafood', 'GF'],
    customisable: true,
    field: 'Farm Pond', freshness: 100, phLevel: '7.0', temp: 'Choice of Method', offset: '0.9kg',
    ingredients: ['Fresh Farm Fish', 'Local Seasoning', 'Herbs'],
    availability: 'Available Today', pairing: 'Pairs with Ugali or Rice',
    prepTime: 28, calories: 480, allergens: ['Fish'], servingSize: '300g',
    trendScore: 79, co2Score: 'low',
  },

  // ── ACCOMPANIMENTS ────────────────────────────────────────────────────────
  { id: 'ac-1',  category: 'Accompaniments', name: 'Ugali',             price: 300,  image: '/images/Ugali.jpeg',              description: 'Hand-stirred maize ugali, the Ubuntu staple.',                     storyLine: 'Stone-ground maize slowly hand-stirred over the fire until it pulls cleanly from the pot.', tags: ['Vegan', 'GF'],        field: 'Corn Patch',      freshness: 100, temp: 'Hot',              ingredients: ['Maize Flour', 'Water'],                                      prepTime: 10, calories: 280,  allergens: ['None'],           servingSize: '1 portion',        trendScore: 60, co2Score: 'low', availability: 'Available Today' },
  { id: 'ac-2',  category: 'Accompaniments', name: 'Chapati (Pair)',    price: 300,  image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800', description: 'Soft-layered, hand-rolled chapati — two per serving.',        storyLine: 'Rolled and cooked to order on a flat griddle. Soft inside, golden outside.',               tags: ['Vegan'],             field: 'Farm Kitchen',    freshness: 100, temp: 'Fresh off griddle', ingredients: ['Wheat Flour', 'Oil', 'Salt'],                                prepTime: 8,  calories: 260,  allergens: ['Gluten'],         servingSize: '2 chapati',        trendScore: 65, co2Score: 'low', availability: 'Available Today' },
  { id: 'ac-3',  category: 'Accompaniments', name: 'Mashed Potatoes',  price: 300,  image: '/images/Mashed-Potatoes.jpeg',    description: 'Creamy farm mashed potatoes with butter.',                         storyLine: 'Field C potatoes boiled and mashed with cultured dairy butter until silky.',                tags: ['Vegetarian', 'GF'], field: 'Field C',         freshness: 98,  temp: 'Hot',              ingredients: ['Irish Potatoes', 'Butter', 'Salt'],                          prepTime: 12, calories: 320,  allergens: ['Dairy'],          servingSize: '1 portion',        trendScore: 58, co2Score: 'low', availability: 'Available Today' },
  { id: 'ac-4',  category: 'Accompaniments', name: 'Fries',            price: 300,  image: '/images/Ubuntu-Farm-Fries.jpeg',  description: 'Hand-cut potatoes, double-fried, sea-salted.',                     storyLine: 'Potatoes from Field C, cut by hand, fried twice for maximum crunch.',                       tags: ['Vegan', 'GF'],      field: 'Field C',         freshness: 98,  temp: 'Crisp Hot',        ingredients: ['Potatoes', 'Oil', 'Sea Salt'],                               prepTime: 12, calories: 380,  allergens: ['None'],           servingSize: 'Generous portion', trendScore: 72, co2Score: 'low', availability: 'Available Today' },
  { id: 'ac-5',  category: 'Accompaniments', name: 'Sauté Vegetables', price: 500,  image: '/images/Sauté-Vegetables1.jpeg', description: 'Seasonal farm vegetables, sautéed in herb butter.',           storyLine: 'Whatever the garden is giving this morning — sautéed in herb butter over high heat.',        tags: ['Vegetarian', 'GF'], field: 'Kitchen Garden',  freshness: 100, temp: 'Sautéed Hot',      ingredients: ['Seasonal Vegetables', 'Herb Butter', 'Garlic'],              prepTime: 8,  calories: 140,  allergens: ['Dairy'],          servingSize: '1 portion',        trendScore: 50, co2Score: 'low', availability: 'Available Today' },
  { id: 'ac-6',  category: 'Accompaniments', name: 'Bhajia',           price: 500,  image: '/images/Bhajia.jpeg', description: 'Spiced chickpea batter, thin-sliced potatoes, fried golden.', storyLine: 'A Kenyan street classic elevated by the Ubuntu kitchen.',                                    tags: ['Vegan'],             field: 'Field C',         freshness: 99,  temp: 'Fresh Fried',      ingredients: ['Potatoes', 'Chickpea Flour', 'Spices'],                      prepTime: 10, calories: 340,  allergens: ['Gluten'],         servingSize: 'Sharing portion',  trendScore: 76, co2Score: 'low', availability: 'Available Today' },
  { id: 'ac-7',  category: 'Accompaniments', name: 'Roasted Potatoes', price: 700,  image: '/images/Roasted-Potatoes.jpeg',   description: 'Whole oven-roasted potatoes with rosemary.',                       storyLine: 'Field C potatoes tossed in herb oil and roasted whole in the farm oven.',                   tags: ['Vegan', 'GF'],      field: 'Field C',         freshness: 97,  temp: 'Oven Hot',         ingredients: ['Potatoes', 'Rosemary', 'Herb Oil'],                          prepTime: 25, calories: 360,  allergens: ['None'],           servingSize: '1 portion',        trendScore: 62, co2Score: 'low', availability: 'Available Today' },
  { id: 'ac-8',  category: 'Accompaniments', name: 'Plain Rice',       price: 300,  image: '/images/Plain-Rice.jpeg',         description: 'Steamed long-grain plain rice.',                                   storyLine: 'Long-grain rice steamed clean. The neutral foundation that lets everything else speak.',     tags: ['Vegan', 'GF'],      field: 'Farm Kitchen',    freshness: 100, temp: 'Steamed Hot',      ingredients: ['Long Grain Rice', 'Water', 'Salt'],                          prepTime: 15, calories: 260,  allergens: ['None'],           servingSize: '1 portion',        trendScore: 45, co2Score: 'low', availability: 'Available Today' },
  { id: 'ac-9',  category: 'Accompaniments', name: 'Vegetable Rice',   price: 500,  image: '/images/Vegetable-Rice.jpeg',     description: 'Fragrant rice cooked with garden vegetables.',                     storyLine: 'Rice cooked with whatever the kitchen garden yields — fragrant with cumin and a touch of turmeric.', tags: ['Vegan', 'GF'], field: 'Kitchen Garden',  freshness: 99,  temp: 'Hot',              ingredients: ['Long Grain Rice', 'Seasonal Vegetables', 'Cumin', 'Turmeric'], prepTime: 18, calories: 310, allergens: ['None'],           servingSize: '1 portion',        trendScore: 55, co2Score: 'low', availability: 'Available Today' },
  { id: 'ac-10', category: 'Accompaniments', name: 'Sweet Potatoes',   price: 250,  image: '/images/Sweet-Potatoes.jpeg',     description: 'Farm sweet potatoes, boiled or roasted.',                          storyLine: 'Field C sweet potatoes, harvested that morning. Boiled until tender or roasted until the skins caramelise.', tags: ['Vegan', 'GF'], field: 'Field C',     freshness: 100, temp: 'Hot',              ingredients: ['Sweet Potatoes'],                                            prepTime: 15, calories: 220,  allergens: ['None'],           servingSize: '1 portion',        trendScore: 58, co2Score: 'low', availability: 'Available Today' },
  { id: 'ac-11', category: 'Accompaniments', name: 'Arrow Root',       price: 250,  image: '/images/Arrow-Root.jpeg',         description: 'Traditional boiled arrowroot from the upper ridge.',               storyLine: 'Upper ridge arrowroot, harvested and boiled in salted water until soft and slightly earthy.', tags: ['Vegan', 'GF'],    field: 'Upper Ridge',     freshness: 100, temp: 'Warm',             ingredients: ['Arrow Root'],                                                prepTime: 20, calories: 180,  allergens: ['None'],           servingSize: '1 portion',        trendScore: 44, co2Score: 'low', availability: 'Available Today' },
  { id: 'ac-12', category: 'Accompaniments', name: 'Vegetables',       price: 200,  image: '/images/Vegetables.jpeg', description: 'Sukuma wiki, spinach or whatever the garden offers today.',   storyLine: 'The garden decides what this is each day. Always farm-fresh, always honest.',                tags: ['Vegan', 'GF'],      field: 'Kitchen Garden',  freshness: 100, temp: 'Hot',              ingredients: ['Seasonal Greens', 'Oil', 'Garlic', 'Salt'],                  prepTime: 6,  calories: 80,   allergens: ['None'],           servingSize: '1 portion',        trendScore: 42, co2Score: 'low', availability: 'Available Today' },
  { id: 'ac-13', category: 'Accompaniments', name: 'Matoke (1kg)',     price: 500,  image: '/images/Matoke-(1kg).jpeg',       description: 'Ubuntu Matoke — wet fry, dry fry, or signature peanut-infused.', storyLine: 'Harvested from the lower farm and slow-cooked. Choose wet-fried, dry-fried, or enriched with our signature peanut sauce.', tags: ['Vegan', 'GF'], field: 'Lower Farm', freshness: 97, temp: 'Hot', ingredients: ['Green Bananas', 'Onions', 'Tomatoes'],                        prepTime: 25, calories: 440,  allergens: ['None'],           servingSize: '1kg',              trendScore: 60, co2Score: 'low', customisable: true, availability: 'Available Today' },

  // ── PIZZAS ────────────────────────────────────────────────────────────────
  { id: 'pz-1', category: 'Pizzas', name: 'BBQ / Beef / Chicken Pizza (Medium)', price: 1200, image: '/images/BBQ-Beef-Chicken-Pizza-(Medium).jpeg', description: 'Your choice of BBQ, beef, or chicken on a medium stone-baked pizza.',   tags: ['High Protein'], customisable: true, field: 'Stone Oven', freshness: 98, temp: '300°C Stone Baked', ingredients: ['Pizza Dough', 'Tomato Sauce', 'Mozzarella', 'Choice of BBQ / Beef / Chicken'], prepTime: 18, calories: 720,  allergens: ['Gluten', 'Dairy'], servingSize: 'Medium — 6 slices', trendScore: 78, co2Score: 'low', availability: 'Available Today', storyLine: 'Farm-sourced proteins meet artisan craftsmanship on a hand-stretched base baked in the Ubuntu stone oven.' },
  { id: 'pz-2', category: 'Pizzas', name: 'BBQ / Beef / Chicken Pizza (Large)',  price: 2300, image: '/images/BBQ-Beef-Chicken-Pizza-(Large).jpeg',  description: 'Your choice of BBQ, beef, or chicken on a large stone-baked artisan pizza.', tags: ['High Protein'], customisable: true, field: 'Stone Oven', freshness: 98, temp: '300°C Stone Baked', ingredients: ['Pizza Dough', 'Tomato Sauce', 'Mozzarella', 'Choice of BBQ / Beef / Chicken'], prepTime: 22, calories: 1080, allergens: ['Gluten', 'Dairy'], servingSize: 'Large — 8 slices',  trendScore: 80, co2Score: 'low', availability: 'Available Today', storyLine: 'Built for gathering and baked for sharing.' },
  { id: 'pz-3', category: 'Pizzas', name: 'Hawaiian Pizza (Medium)',              price: 1300, image: '/images/Hawaiian-Pizza-(Medium).jpeg',         description: 'Smoked ham, orchard pineapple, and mozzarella on a medium base.',          tags: ['High Protein'], field: 'Stone Oven', freshness: 97, temp: '300°C Stone Baked', ingredients: ['Pizza Dough', 'Tomato Sauce', 'Mozzarella', 'Ham', 'Pineapple'],             prepTime: 18, calories: 760,  allergens: ['Gluten', 'Dairy'], servingSize: 'Medium — 6 slices', trendScore: 74, co2Score: 'low', availability: 'Available Today', storyLine: 'Orchard pineapple, ham and house-made tomato sauce on a base fired in the Ubuntu stone oven.' },
  { id: 'pz-4', category: 'Pizzas', name: 'Hawaiian Pizza (Large)',               price: 2000, image: '/images/Hawaiian-Pizza-(Large).jpeg',          description: 'Smoked ham, orchard pineapple, and mozzarella on a large base.',           tags: ['High Protein'], field: 'Stone Oven', freshness: 97, temp: '300°C Stone Baked', ingredients: ['Pizza Dough', 'Tomato Sauce', 'Mozzarella', 'Ham', 'Pineapple'],             prepTime: 22, calories: 1120, allergens: ['Gluten', 'Dairy'], servingSize: 'Large — 8 slices',  trendScore: 76, co2Score: 'low', availability: 'Available Today', storyLine: 'The full Hawaiian experience on our largest stone-baked base.' },
  { id: 'pz-5', category: 'Pizzas', name: 'Margherita Pizza (Medium)',            price: 900,  image: '/images/Margherita-Pizza-(Medium).jpeg',       description: 'Classic tomato, mozzarella, and fresh basil on a medium base.',            tags: ['Vegetarian'],   field: 'Stone Oven', freshness: 99, temp: '300°C Stone Baked', ingredients: ['Pizza Dough', 'Tomato Sauce', 'Mozzarella', 'Fresh Basil'],                 prepTime: 15, calories: 620,  allergens: ['Gluten', 'Dairy'], servingSize: 'Medium — 6 slices', trendScore: 65, co2Score: 'low', availability: 'Available Today', storyLine: "The purist's choice. Simple ingredients prepared with care." },
  { id: 'pz-6', category: 'Pizzas', name: 'Margherita Pizza (Large)',             price: 1800, image: '/images/Margherita-Pizza-(Large).jpeg',        description: 'Classic tomato, mozzarella, and basil on a large base.',                   tags: ['Vegetarian'],   field: 'Stone Oven', freshness: 99, temp: '300°C Stone Baked', ingredients: ['Pizza Dough', 'Tomato Sauce', 'Mozzarella', 'Fresh Basil'],                 prepTime: 18, calories: 960,  allergens: ['Gluten', 'Dairy'], servingSize: 'Large — 8 slices',  trendScore: 67, co2Score: 'low', availability: 'Available Today', storyLine: 'The classic on our largest base. Simple, elegant, and exactly right when shared.' },
  // Pizza extra toppings
  { id: 'pz-t1', category: 'Pizzas', name: 'Extra Topping — Chicken', price: 500, image: '/images/BBQ-Beef-Chicken-Pizza-(Medium).jpeg', description: 'Add extra chicken to any pizza.',  tags: ['High Protein'], field: 'Stone Oven', freshness: 98, temp: 'N/A', ingredients: ['Chicken'], prepTime: 2, calories: 120, allergens: ['None'], servingSize: 'Per pizza', trendScore: 50, co2Score: 'low', availability: 'Available Today', storyLine: 'Add more of the good stuff.' },
  { id: 'pz-t2', category: 'Pizzas', name: 'Extra Topping — Pineapple', price: 400, image: '/images/Hawaiian-Pizza-(Medium).jpeg', description: 'Add orchard pineapple to any pizza.', tags: ['Vegan'],         field: 'Orchard',     freshness: 100, temp: 'N/A', ingredients: ['Pineapple'], prepTime: 1, calories: 40, allergens: ['None'], servingSize: 'Per pizza', trendScore: 40, co2Score: 'low', availability: 'Available Today', storyLine: 'Fresh orchard pineapple.' },
  { id: 'pz-t3', category: 'Pizzas', name: 'Extra Topping — Cheese', price: 500, image: '/images/Margherita-Pizza-(Medium).jpeg', description: 'Add extra mozzarella to any pizza.', tags: ['Vegetarian'],   field: 'Stone Oven',  freshness: 99,  temp: 'N/A', ingredients: ['Mozzarella'], prepTime: 1, calories: 90, allergens: ['Dairy'], servingSize: 'Per pizza', trendScore: 55, co2Score: 'low', availability: 'Available Today', storyLine: 'More cheese. Always the right call.' },

  // ── PORK & GRILL ──────────────────────────────────────────────────────────
  {
    id: 'pg-1', category: 'Pork & Grill', name: 'Pork Chops — Dry or Wet Fry',
    image: '/images/Pork-Chops-Dry-or-Wet-Fry.jpeg',
    description: 'Thick-cut pork chops — dry fried to a crisp or wet fried in a rich tomato sauce.',
    storyLine: 'Farm pork, marinated in garlic, ginger and a touch of honey, then cooked your way.',
    price: 2500,
    tags: ['High Protein', 'GF'],
    chefChoice: true, customisable: true,
    field: 'Farm Paddock', freshness: 95, phLevel: '6.2', temp: 'Choice of Method', offset: '1.2kg',
    ingredients: ['Pork Chops', 'Garlic', 'Ginger', 'Honey', 'Spices'],
    availability: 'Available Today',
    prepTime: 25, calories: 640, allergens: ['None'], servingSize: '2 chops',
    trendScore: 83, co2Score: 'low',
  },
  {
    id: 'pg-2', category: 'Pork & Grill', name: 'Chicken Grill',
    image: '/images/Chicken-Grill.jpeg',
    description: 'Herb-marinated farm chicken grilled slowly over open coals.',
    storyLine: 'Ubuntu yard chicken, marinated overnight in a blend of fresh herbs, slow-grilled over glowing hardwood coals.',
    price: 2600,
    tags: ['High Protein', 'GF'],
    signature: true, chefChoice: true, popular: true,
    animal: 'UKV-Yard', field: 'Open Grill', freshness: 97, phLevel: '6.1', temp: 'Open Grill', offset: '1.4kg',
    ingredients: ['Farm Chicken', 'Herb Marinade', 'Aromatic Spices'],
    availability: 'Available Today', pairing: 'Pairs with Roasted Potatoes or Ugali',
    prepTime: 40, calories: 680, allergens: ['None'], servingSize: '1 whole grilled chicken',
    trendScore: 92, co2Score: 'low',
  },

  // ── SALADS & SNACKS ───────────────────────────────────────────────────────
  { id: 'ss-1', category: 'Salads & Snacks', name: 'Kachumbari',             price: 300, image: 'images/Kachumbari.jpeg', description: 'Fresh tomato, onion and coriander salad.',                         tags: ['Vegan', 'GF'],      field: 'Kitchen Garden', freshness: 100, temp: 'Fresh',       ingredients: ['Tomatoes', 'Onions', 'Coriander', 'Lemon'],       prepTime: 5,  calories: 45,  allergens: ['None'],           servingSize: 'Side portion',    trendScore: 55, co2Score: 'low', availability: 'Available Today', storyLine: 'Garden tomatoes, white onion and fresh coriander sliced raw and dressed with lemon and a pinch of salt.' },
  { id: 'ss-2', category: 'Salads & Snacks', name: 'Coleslaw',               price: 300, image: '/images/Coleslaw.jpeg', description: 'Creamy farm coleslaw with shredded cabbage and carrot.',          tags: ['Vegetarian'],       field: 'Kitchen Garden', freshness: 100, temp: 'Chilled',     ingredients: ['Cabbage', 'Carrot', 'Mayo Dressing'],             prepTime: 8,  calories: 180, allergens: ['Eggs'],           servingSize: 'Side portion',    trendScore: 52, co2Score: 'low', availability: 'Available Today', storyLine: 'Garden cabbage and carrot, shredded and dressed in the Ubuntu house dressing.' },
  { id: 'ss-3', category: 'Salads & Snacks', name: 'Fruit Bowl Salad',       price: 500, image: '/images/Fruit-Bowl-Salad.jpeg', description: 'Farm-picked seasonal fruit bowl with honey drizzle.',             tags: ['Vegan', 'GF'],      field: 'Orchard',        freshness: 100, temp: 'Fresh',       ingredients: ['Seasonal Fruits', 'Honey Drizzle'],               prepTime: 5,  calories: 180, allergens: ['None'],           servingSize: '300g bowl',       trendScore: 65, co2Score: 'low', availability: 'Available Today', storyLine: 'Whatever the orchard offered this morning — mango, pawpaw, watermelon, passion. Cut at the pass and served immediately.' },
  { id: 'ss-4', category: 'Salads & Snacks', name: 'Fruit Cut Platter',      price: 800, image: '/images/Fruit-Cut-Platter.jpeg', description: 'Generous assorted hand-cut tropical fruit platter for sharing.',   tags: ['Vegan', 'GF'],      field: 'Orchard',        freshness: 100, temp: 'Fresh',       ingredients: ['Assorted Tropical Fruits', 'Mint Garnish'],       prepTime: 8,  calories: 320, allergens: ['None'],           servingSize: 'Sharing platter', trendScore: 68, co2Score: 'low', availability: 'Available Today', storyLine: 'The full spread of what the orchard is giving today. Built for two, best enjoyed by four.' },
  { id: 'ss-5', category: 'Salads & Snacks', name: 'Protein Rich Salad Bowl',price: 700, image: '/images/Protein-Rich-Salad-Bowl.jpeg', description: 'Composed salad with farm protein, greens and house dressing.',    tags: ['High Protein', 'GF'],field: 'Kitchen Garden', freshness: 100, temp: 'Fresh',       ingredients: ['Seasonal Greens', 'Farm Protein', 'House Dressing'],prepTime: 10, calories: 480, allergens: ['None'],           servingSize: '1 bowl',          trendScore: 71, co2Score: 'low', availability: 'Available Today', storyLine: 'Seasonal greens and a generous protein from the kitchen, composed and dressed in the Ubuntu house vinaigrette.' },
  { id: 'ss-6', category: 'Salads & Snacks', name: 'Farm Sausages (2pc)',    price: 300, image: '/images/Farm-Sausages2pc.jpeg', description: 'Pork or beef sausages grilled over open flame.',                  tags: ['High Protein'],     field: 'Open Grill',     freshness: 97,  temp: 'Grilled Hot', ingredients: ['Pork / Beef Sausage'],                            prepTime: 10, calories: 220, allergens: ['Gluten'],         servingSize: '2 pieces',        trendScore: 60, co2Score: 'low', availability: 'Available Today', storyLine: 'Sourced from within the village supply chain, grilled slowly over open heat until the skin chars and blisters.' },
  { id: 'ss-7', category: 'Salads & Snacks', name: 'Beef Samosa',            price: 300, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800', description: 'Crisp pastry triangles filled with spiced minced beef.',          tags: ['High Protein'],     field: 'Farm Kitchen',   freshness: 98,  temp: 'Fresh Fried', ingredients: ['Pastry', 'Spiced Minced Beef', 'Oil'],            chefChoice: true, prepTime: 8, calories: 280, allergens: ['Gluten'], servingSize: '2 pieces',        trendScore: 74, co2Score: 'low', availability: 'Available Today', storyLine: 'Folded by hand in the kitchen each morning with spiced minced beef. Fried to a perfect crunch.' },
  { id: 'ss-8', category: 'Salads & Snacks', name: 'Chicken Pie',            price: 300, image: '/images/Chicken-Pie.jpeg', description: 'Flaky shortcrust pastry with tender spiced chicken filling.',      tags: ['High Protein'],     field: 'Farm Kitchen',   freshness: 98,  temp: 'Warm Baked',  ingredients: ['Pastry', 'Chicken', 'Spices'],                    prepTime: 5,  calories: 370, allergens: ['Gluten'],         servingSize: '1 piece',         trendScore: 66, co2Score: 'low', availability: 'Available Today', storyLine: 'Baked in the Ubuntu kitchen — a simple thing done properly. Flaky shortcrust encasing a rich filling of spiced farm chicken.' },
  { id: 'ss-9', category: 'Salads & Snacks', name: 'Cinnamon Rolls',         price: 300, image: '/images/Cinnamon-Rolls.jpeg', description: 'Soft, warm cinnamon rolls fresh from the farm oven.',             tags: ['Vegetarian'],       field: 'Farm Bakery',    freshness: 100, temp: 'Warm',        ingredients: ['Flour', 'Cinnamon', 'Butter', 'Sugar', 'Eggs'],  prepTime: 5,  calories: 340, allergens: ['Gluten', 'Dairy', 'Eggs'], servingSize: '1 roll', trendScore: 69, co2Score: 'low', availability: 'Available Today', storyLine: 'Baked in the farm oven each morning. Soft, sweet, fragrant with cinnamon from the spice garden. Best eaten warm with a cup of African tea.' },

  // ── SOUPS ─────────────────────────────────────────────────────────────────
  { id: 'so-1', category: 'Soups', name: 'Chicken Soup',    price: 700, image: '/images/Chicken-Soup.jpeg', description: 'Clear golden farm chicken broth with garden vegetables.', tags: ['High Protein', 'GF'],  field: 'Farm Kitchen',  freshness: 98,  temp: '85°C', ingredients: ['Farm Chicken', 'Carrots', 'Celery', 'Garden Herbs'],             prepTime: 30, calories: 290, allergens: ['None'],           servingSize: '350ml', trendScore: 68, co2Score: 'low', availability: 'Available Today', storyLine: 'Free-range chicken simmered for hours with farm carrots, celery and leek until the broth runs deep gold.' },
  { id: 'so-2', category: 'Soups', name: 'Vegetable Soup', price: 700, image: '/images/Vegetable-Soup.jpeg', description: 'Hearty vegetable broth made from the morning harvest.',      tags: ['Vegan', 'GF'],        field: 'Kitchen Garden', freshness: 100, temp: '85°C', ingredients: ['Seasonal Vegetables', 'Herbs', 'Vegetable Stock'],             prepTime: 22, calories: 180, allergens: ['None'],           servingSize: '350ml', trendScore: 55, co2Score: 'low', availability: 'Available Today', storyLine: 'Whatever the garden gave this morning, slow-simmered into a nourishing broth.' },
  { id: 'so-3', category: 'Soups', name: 'Mushroom Soup',  price: 700, image: '/images/Mushroom-Soup.jpeg', description: 'Velvety mushroom cream soup with herb oil and croutons.',     tags: ['Vegetarian'],         field: 'Forest Edge',    freshness: 95,  temp: '82°C', ingredients: ['Fresh Mushrooms', 'Cream', 'Thyme', 'Garlic', 'Croutons'], chefChoice: true, prepTime: 25, calories: 310, allergens: ['Dairy', 'Gluten'], servingSize: '350ml', trendScore: 73, co2Score: 'low', availability: 'Available Today', storyLine: 'Wild and cultivated mushrooms blended into a deep, earthy cream. Finished with herb oil and croutons from the farm bakery.' },
  { id: 'so-4', category: 'Soups', name: 'Butternut Soup', price: 600, image: '/images/Butternut-Soup.jpeg', description: 'Silky roasted butternut squash soup with warm spices.',       tags: ['Vegan', 'GF'],        field: 'Kitchen Garden', freshness: 97,  temp: '80°C', ingredients: ['Butternut Squash', 'Warm Spices', 'Coconut Milk'],             prepTime: 28, calories: 260, allergens: ['None'],           servingSize: '350ml', trendScore: 70, co2Score: 'low', availability: 'Available Today', storyLine: 'Butternut from the kitchen garden, roasted until it sweetens, then blended with warm spices into a velvety soup.' },

  // ── SAUCES ────────────────────────────────────────────────────────────────
  { id: 'sa-1', category: 'Sauces', name: 'Tartar Sauce',      price: 300, image: '/images/Tartar-Sauce.jpeg', description: 'Classic creamy tartar sauce with capers and herbs.', tags: ['Vegetarian'],   field: 'Farm Kitchen',   freshness: 99,  temp: 'Room Temp', ingredients: ['Mayo', 'Capers', 'Dill', 'Lemon'],               prepTime: 2, calories: 90,  allergens: ['Eggs'], servingSize: 'Side pot', trendScore: 45, co2Score: 'low', availability: 'Available Today', storyLine: 'House-made with capers, fresh dill and lemon.' },
  { id: 'sa-2', category: 'Sauces', name: 'Garlic Mayo Sauce', price: 300, image: '/images/Garlic-Mayo-Sauce.jpeg', description: 'Rich roasted garlic mayo, house-made daily.',        tags: ['Vegetarian'],   field: 'Farm Kitchen',   freshness: 100, temp: 'Room Temp', ingredients: ['Mayo', 'Roasted Garlic', 'Herbs'],               prepTime: 2, calories: 110, allergens: ['Eggs'], servingSize: 'Side pot', trendScore: 62, co2Score: 'low', availability: 'Available Today', storyLine: 'Roasted farm garlic blended into the Ubuntu house mayo.' },
  { id: 'sa-3', category: 'Sauces', name: 'Chilli Sauce',      price: 300, image: '/images/Chilli-Sauce.jpeg', description: 'House-made chilli sauce with farm chillis and tomato.', tags: ['Vegan', 'GF'], field: 'Kitchen Garden', freshness: 100, temp: 'Room Temp', ingredients: ['Farm Chillis', 'Tomato', 'Vinegar', 'Garlic'],   prepTime: 2, calories: 35,  allergens: ['None'], servingSize: 'Side pot', trendScore: 70, co2Score: 'low', availability: 'Available Today', storyLine: 'Kitchen garden chillis blended with tomato and vinegar into a sauce that adds heat without hiding everything underneath it.' },
  { id: 'sa-4', category: 'Sauces', name: 'BBQ Sauce',         price: 300, image: '/images/BBQ-Sauce.jpeg', description: 'Smoky house-made BBQ sauce with molasses and spice.',  tags: ['Vegan', 'GF'], field: 'Farm Kitchen',   freshness: 98,  temp: 'Room Temp', ingredients: ['Tomato', 'Molasses', 'Smoked Paprika', 'Farm Honey'], prepTime: 2, calories: 75, allergens: ['None'], servingSize: 'Side pot', trendScore: 68, co2Score: 'low', availability: 'Available Today', storyLine: 'Slow-reduced molasses, tomato, smoked paprika and a touch of farm honey. The sauce that finishes the choma.' },
  { id: 'sa-5', category: 'Sauces', name: 'Extra Sauce',       price: 300, image: '/images/Extra-Sauce.jpeg', description: 'Any additional sauce of your choice.',               tags: ['Vegan', 'GF'], field: 'Farm Kitchen',   freshness: 100, temp: 'Room Temp', ingredients: ['Ask your server'],                               prepTime: 1, calories: 60,  allergens: ['None'], servingSize: 'Side pot', trendScore: 35, co2Score: 'low', availability: 'Available Today', storyLine: 'More of whatever you love.' },

  // ── HOT BEVERAGES ─────────────────────────────────────────────────────────
  { id: 'hb-1', category: 'Hot Beverages', name: 'Hot Milk',           price: 300, image: '/images/Hot-Milk.jpeg', description: 'Fresh dairy paddock milk, steamed and served hot.',         tags: ['Vegetarian', 'GF'], field: 'Dairy Paddock', freshness: 100, temp: 'Steamed',     ingredients: ['Fresh Whole Milk'],                                            prepTime: 3,  calories: 150, allergens: ['Dairy'], servingSize: '300ml', trendScore: 48, co2Score: 'low', availability: 'Available Today', storyLine: 'Friesian dairy milk collected that morning, steamed and served.' },
  { id: 'hb-2', category: 'Hot Beverages', name: 'African Tea (Chai)', price: 250, image: '/images/African-Tea-Chai.jpeg', description: 'Spiced chai brewed with masala, whole milk and black tea.',  tags: ['Vegetarian', 'GF'], field: 'Dairy Paddock', freshness: 100, temp: 'Hot',         chefChoice: true, ingredients: ['Black Tea', 'Masala Spices', 'Whole Milk'],   prepTime: 5,  calories: 90,  allergens: ['Dairy'], servingSize: '300ml', trendScore: 72, co2Score: 'low', availability: 'Available Today', storyLine: 'Full-fat dairy milk, crushed ginger, cardamom and black tea simmered together until the flavours merge.' },
  { id: 'hb-3', category: 'Hot Beverages', name: 'Black Tea',          price: 200, image: '/images/Black-Tea.jpeg', description: 'Strong Kenyan black tea, steeped to strength.',             tags: ['Vegan'],            field: 'Tea Garden',    freshness: 100, temp: 'Hot',         ingredients: ['Black Tea Leaves', 'Hot Water'],                              prepTime: 4,  calories: 5,   allergens: ['None'], servingSize: '300ml', trendScore: 55, co2Score: 'low', availability: 'Available Today', storyLine: 'The tea that opens every day in Kenya. Made properly — steeped dark and served clean.' },
  { id: 'hb-4', category: 'Hot Beverages', name: 'Black Coffee',       price: 200, image: '/images/Black-Coffee.jpeg', description: 'Single-origin Kenyan beans, brewed clean.',                  tags: ['Vegan', 'GF'],     field: 'Bean Roastery', freshness: 100, temp: 'Hot',         ingredients: ['Single-Origin Kenyan Coffee'],                                prepTime: 3,  calories: 5,   allergens: ['None'], servingSize: '250ml', trendScore: 65, co2Score: 'low', availability: 'Available Today', storyLine: 'Roasted in-house. Ground fresh. No milk unless you ask. Kenyan coffee needs no assistance.' },
  { id: 'hb-5', category: 'Hot Beverages', name: 'Americano',          price: 300, image: '/images/Americano.jpeg', description: 'Double espresso diluted with hot water.',                    tags: ['Vegan', 'GF'],     field: 'Bean Roastery', freshness: 100, temp: 'Hot',         ingredients: ['Double Espresso', 'Hot Water'],                               prepTime: 3,  calories: 10,  allergens: ['None'], servingSize: '300ml', trendScore: 68, co2Score: 'low', availability: 'Available Today', storyLine: 'Two shots of the Ubuntu roastery espresso, lengthened with hot water.' },
  { id: 'hb-6', category: 'Hot Beverages', name: 'Café Latte',         price: 350, image: '/images/Café-Latte,jpeg', description: 'Espresso with a generous pour of steamed dairy milk.',       tags: ['Vegetarian'],      field: 'Bean Roastery', freshness: 100, temp: 'Steamed Hot', ingredients: ['Espresso', 'Steamed Dairy Milk'],                              prepTime: 4,  calories: 140, allergens: ['Dairy'], servingSize: '350ml', trendScore: 74, co2Score: 'low', availability: 'Available Today', storyLine: 'Ubuntu roastery espresso with steamed dairy paddock milk.' },
  { id: 'hb-7', category: 'Hot Beverages', name: 'Cappuccino',         price: 350, image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=800', description: 'Espresso, steamed milk and thick milk foam.',                 tags: ['Vegetarian'],      field: 'Bean Roastery', freshness: 100, temp: 'Steamed Hot', ingredients: ['Espresso', 'Steamed Milk', 'Milk Foam'],                       prepTime: 4,  calories: 110, allergens: ['Dairy'], servingSize: '200ml', trendScore: 71, co2Score: 'low', availability: 'Available Today', storyLine: 'Equal parts espresso, steamed milk and thick foam. A classic in the Ubuntu coffee bar.' },
  { id: 'hb-8', category: 'Hot Beverages', name: 'Mocha',              price: 400, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=800', description: 'Espresso, chocolate and steamed milk — the indulgent cup.',   tags: ['Vegetarian'],      field: 'Bean Roastery', freshness: 100, temp: 'Steamed Hot', chefChoice: true, ingredients: ['Espresso', 'Chocolate', 'Steamed Milk'],         prepTime: 5,  calories: 220, allergens: ['Dairy'], servingSize: '300ml', trendScore: 78, co2Score: 'low', availability: 'Available Today', storyLine: 'Espresso pulled over house-made chocolate and finished with steamed dairy milk.' },
  { id: 'hb-9', category: 'Hot Beverages', name: 'Herbal Infusions',   price: 350, image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?q=80&w=800', description: 'Lemon grass, mint, hibiscus, verbena — all at 350/=.',        tags: ['Vegan', 'GF'],     field: 'Herb Garden',   freshness: 100, temp: 'Hot Infused', customisable: true, ingredients: ['Lemongrass / Mint / Hibiscus / Verbena'], prepTime: 6, calories: 5, allergens: ['None'], servingSize: '300ml', trendScore: 61, co2Score: 'low', availability: 'Available Today', storyLine: 'Every herb in this cup grew within the Ubuntu boundary.' },

  // ── COLD BEVERAGES ────────────────────────────────────────────────────────
  { id: 'cb-1', category: 'Cold Beverages', name: 'Fresh Juice',          price: 400, image: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?q=80&w=800', description: 'Pressed daily — mango, pineapple, passion, orange or black passion.', tags: ['Vegan', 'GF'], customisable: true, field: 'Orchard', freshness: 100, temp: 'Chilled', ingredients: ['Fresh Seasonal Fruit'],        prepTime: 5, calories: 160, allergens: ['None'], servingSize: '350ml', trendScore: 80, co2Score: 'low', availability: 'Available Today', storyLine: 'Pressed from whatever is at its best in the orchard this morning. No concentrate. No sugar.' },
  { id: 'cb-2', category: 'Cold Beverages', name: 'Tropical Fruit Medley', price: 700, image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?q=80&w=800', description: 'A blend of tropical fruits — mango, pineapple, passion and orange.', tags: ['Vegan', 'GF'], field: 'Orchard', freshness: 100, temp: 'Chilled', ingredients: ['Mango', 'Pineapple', 'Passion Fruit', 'Orange'], prepTime: 5, calories: 220, allergens: ['None'], servingSize: '400ml', trendScore: 77, co2Score: 'low', availability: 'Available Today', storyLine: 'When choosing one fruit is impossible. All four orchard fruits blended together into a single vivid glass.' },
  { id: 'cb-3', category: 'Cold Beverages', name: 'Soda (350ml)',          price: 200, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800', description: 'Chilled soda — Coke, Fanta, Sprite or Stoney.',                 tags: ['Vegan', 'GF'], customisable: true, field: 'Bar', freshness: 100, temp: 'Chilled', ingredients: ['Carbonated Soft Drink'],        prepTime: 1, calories: 140, allergens: ['None'], servingSize: '350ml', trendScore: 50, co2Score: 'medium', availability: 'Available Today', storyLine: 'Chilled and ready.' },
  { id: 'cb-4', category: 'Cold Beverages', name: 'Water Bottle (300ml)', price: 200, image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=80&w=800', description: 'Ubuntu borehole-sourced water — still and pure.',               tags: ['Vegan', 'GF'], field: 'Borehole', freshness: 100, temp: 'Chilled', ingredients: ['Pure Water'],                   prepTime: 1, calories: 0,   allergens: ['None'], servingSize: '300ml', trendScore: 35, co2Score: 'low', availability: 'Available Today', storyLine: 'Borehole-sourced and purified on-site.' },
  { id: 'cb-5', category: 'Cold Beverages', name: 'Delmonte Juice Pack',   price: 700, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=800', description: 'Bottled Delmonte juice in your choice of flavour.',             tags: ['Vegan', 'GF'], customisable: true, field: 'Bar', freshness: 100, temp: 'Chilled', ingredients: ['Delmonte Juice'],               prepTime: 1, calories: 180, allergens: ['None'], servingSize: '200ml', trendScore: 40, co2Score: 'medium', availability: 'Available Today', storyLine: 'Bottled Delmonte juice in your choice of flavour.' },

  // ── SMOOTHIES ─────────────────────────────────────────────────────────────
  { id: 'sm-1', category: 'Smoothies', name: 'Pineapple Mango Smoothie', price: 450, image: 'https://images.unsplash.com/photo-1546548970-71785318a17b?q=80&w=800', description: 'Fresh pineapple and mango blended together.',                     tags: ['Vegan', 'GF'],        field: 'Orchard',       freshness: 100, temp: 'Chilled', ingredients: ['Fresh Pineapple', 'Fresh Mango'],               prepTime: 4, calories: 200, allergens: ['None'],  servingSize: '400ml', trendScore: 75, co2Score: 'low', availability: 'Available Today', storyLine: 'Orchard pineapple and mango blended immediately. Bright, tropical, and absolutely no concentrate.' },
  { id: 'sm-2', category: 'Smoothies', name: 'Vanilla Smoothie',         price: 450, image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=800', description: 'Creamy vanilla-scented smoothie with banana and milk.',           tags: ['Vegetarian', 'GF'],   field: 'Dairy Paddock', freshness: 100, temp: 'Chilled', ingredients: ['Banana', 'Whole Milk', 'Vanilla'],               prepTime: 4, calories: 240, allergens: ['Dairy'], servingSize: '400ml', trendScore: 68, co2Score: 'low', availability: 'Available Today', storyLine: 'Farm banana, whole dairy milk and a measure of house vanilla — blended thick.' },
  { id: 'sm-3', category: 'Smoothies', name: 'Mix Fruits Smoothie',      price: 600, image: 'https://images.unsplash.com/photo-1638176066747-d65e8bb4fbb9?q=80&w=800', description: 'A tropical blend of all the orchard fruits in season.',          tags: ['Vegan', 'GF'],        field: 'Orchard',       freshness: 100, temp: 'Chilled', chefChoice: true, ingredients: ['Assorted Seasonal Fruits'], prepTime: 5, calories: 220, allergens: ['None'], servingSize: '400ml',  trendScore: 80, co2Score: 'low', availability: 'Available Today', storyLine: 'The full orchard in one glass. Whatever is ripe today goes in.' },

  // ── MILKSHAKES ────────────────────────────────────────────────────────────
  { id: 'ms-1', category: 'Milkshakes', name: 'Strawberry Milkshake', price: 700, image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=800', description: 'Thick strawberry milkshake with real ice cream and farm milk.', tags: ['Vegetarian'], field: 'Dairy Paddock', freshness: 100, temp: '-8°C Blended', ingredients: ['Strawberry Ice Cream', 'Full-Fat Dairy Milk'], prepTime: 6, calories: 470, allergens: ['Dairy'], servingSize: '400ml', trendScore: 79, co2Score: 'low', availability: 'Available Today', storyLine: 'Fresh strawberry ice cream and full-fat dairy milk blended thick.' },
  { id: 'ms-2', category: 'Milkshakes', name: 'Vanilla Milkshake',    price: 700, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=800', description: 'Classic thick vanilla milkshake with real ice cream.',          tags: ['Vegetarian'], field: 'Dairy Paddock', freshness: 100, temp: '-8°C Blended', chefChoice: true, ingredients: ['Vanilla Ice Cream', 'Full-Fat Dairy Milk'], prepTime: 6, calories: 480, allergens: ['Dairy'], servingSize: '400ml', trendScore: 74, co2Score: 'low', availability: 'Available Today', storyLine: 'Thick-blend vanilla milkshake made with real ice cream and full-fat dairy paddock milk.' },
  { id: 'ms-3', category: 'Milkshakes', name: 'Chocolate Milkshake',  price: 700, image: 'https://images.unsplash.com/photo-1585262900234-06cc7f28d5a2?q=80&w=800', description: 'Rich chocolate milkshake with real cocoa ice cream.',          tags: ['Vegetarian'], field: 'Dairy Paddock', freshness: 100, temp: '-8°C Blended', ingredients: ['Chocolate Ice Cream', 'Full-Fat Dairy Milk', 'Cocoa'], prepTime: 6, calories: 510, allergens: ['Dairy'], servingSize: '400ml', trendScore: 77, co2Score: 'low', availability: 'Available Today', storyLine: 'Rich chocolate ice cream from our in-house batch, blended with full-fat farm milk.' },

  // ── ICE CREAM ─────────────────────────────────────────────────────────────
  { id: 'ic-1', category: 'Ice Cream', name: 'Strawberry Ice Cream', price: 400,  image: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?q=80&w=800', description: 'Fresh strawberry ice cream, churned in-house.',                       tags: ['Vegetarian', 'GF'], field: 'Dairy Paddock', freshness: 100, temp: '-14°C', ingredients: ['Fresh Strawberries', 'Dairy Cream', 'Sugar'],                      prepTime: 2, calories: 250, allergens: ['Dairy'], servingSize: '2 scoops',              trendScore: 70, co2Score: 'low', availability: 'Available Today', storyLine: 'Churned daily from fresh strawberries and dairy paddock cream.' },
  { id: 'ic-2', category: 'Ice Cream', name: 'Vanilla Ice Cream',    price: 400,  image: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?q=80&w=800', description: 'Classic vanilla bean ice cream, churned in-house.',                  tags: ['Vegetarian', 'GF'], field: 'Dairy Paddock', freshness: 100, temp: '-14°C', chefChoice: true, ingredients: ['Vanilla Bean', 'Dairy Cream', 'Sugar'],         prepTime: 2, calories: 280, allergens: ['Dairy'], servingSize: '2 scoops',              trendScore: 66, co2Score: 'low', availability: 'Available Today', storyLine: 'Real vanilla beans from the spice garden steeped into dairy cream and churned until thick and cold.' },
  { id: 'ic-3', category: 'Ice Cream', name: 'Chocolate Ice Cream',  price: 400,  image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?q=80&w=800', description: 'Rich dark chocolate ice cream, churned in-house.',                  tags: ['Vegetarian', 'GF'], field: 'Bean Roastery', freshness: 100, temp: '-14°C', ingredients: ['Dark Cocoa', 'Dairy Cream', 'Sugar'],                           prepTime: 2, calories: 310, allergens: ['Dairy'], servingSize: '2 scoops',              trendScore: 72, co2Score: 'low', availability: 'Available Today', storyLine: 'Single-origin cocoa from the bean roastery churned into dairy cream.' },
  { id: 'ic-4', category: 'Ice Cream', name: 'Mix Combo Ice Cream',  price: 1200, image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=800', description: 'All three flavours — strawberry, vanilla and chocolate — in one bowl.', tags: ['Vegetarian', 'GF'], field: 'Dairy Paddock', freshness: 100, temp: '-14°C', featured: true, ingredients: ['Strawberry Ice Cream', 'Vanilla Ice Cream', 'Chocolate Ice Cream'], prepTime: 3, calories: 840, allergens: ['Dairy'], servingSize: '6 scoops — full combo', trendScore: 85, co2Score: 'low', availability: 'Available Today', storyLine: 'For those who cannot choose. All three in a single bowl.' },
]

// ─── LEGACY / ADDITIONAL EXPORTS (kept for backward compatibility) ────────────

export interface MenuItem extends Dish {}   // alias so old imports still work
export interface MenuCategory {
  category: string
  description?: string
  items: Dish[]
}

/** Flat alias — some components import FLAT_ITEMS directly */
export const FLAT_ITEMS: Dish[] = DISHES

/** O(1) lookup by id */
export const ITEM_BY_ID: Map<string, Dish> = new Map(DISHES.map(d => [d.id, d]))

export const TOTAL_DISHES: number = DISHES.length

export const ALL_CATEGORIES: string[] = ['All', ...CATEGORIES.filter(c => c.id !== 'all').map(c => c.label)]

export const TICKER_MESSAGES = [
  '🔥 Goat Tumbukiza — slow-cooking since 10am',
  '◈ North Apiary honey extracted fresh this morning',
  '🌿 Cinnamon rolls fresh from the farm oven',
  '🐟 Lake Victoria fish arrived at dawn — limited tonight',
  '🥩 Charcoal pork ribs marinating since yesterday',
  '🌱 Field C harvest brought in at 6am today',
  '🍯 New seasonal honey — wildflower & acacia blend',
  '🔥 Boma oven at temperature — wood-fired pizzas ready',
  '🌿 Ubuntu Family Harvest Plate changes daily',
  '◈ Farm Cold Brew steeped 16 hours — serving now',
]

export type { Dish as default }