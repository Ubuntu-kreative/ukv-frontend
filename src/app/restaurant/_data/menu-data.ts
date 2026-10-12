export type DietaryTag =
  | 'Vegan'
  | 'Vegetarian'
  | 'GF'
  | 'High Protein'
  | 'Seafood'
  | 'Traditional'
  | 'Signature'

export type SortKey = 'default' | 'price-asc' | 'price-desc' | 'popular' | 'recommended'

export interface Dish {
  id: string
  name: string
  description: string
  storyLine?: string
  image: string
  price: number
  category: string
  tags: DietaryTag[]
  popular?: boolean
  recommended?: boolean
  featured?: boolean
  chefChoice?: boolean
  seasonal?: boolean
  signature?: boolean
  customisable?: boolean
  field?: string
  freshness?: number
  phLevel?: string
  temp?: string
  offset?: string
  animal?: string
  availability?: string
  prepTime?: number
  calories?: number
  allergens?: string[]
  servingSize?: string
  ingredients?: string[]
  pairing?: string
  trendScore?: number
  co2Score?: 'low' | 'medium' | 'high'
  availabilityCount?: number
}

export interface Category {
  id: string
  label: string
  emoji?: string
  subtitle?: string
}

export const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: 'default', label: 'Default' },
  { id: 'popular', label: 'Most Popular' },
  { id: 'recommended', label: 'Recommended' },
  { id: 'price-asc', label: 'Price: Low→High' },
  { id: 'price-desc', label: 'Price: High→Low' },
]

export const DIETARY_FILTERS: { id: DietaryTag; label: string }[] = [
  { id: 'Vegan', label: '🌱 Vegan' },
  { id: 'Vegetarian', label: '🥦 Vegetarian' },
  { id: 'GF', label: '🌾 GF / Keto' },
  { id: 'High Protein', label: '💪 High Protein' },
  { id: 'Seafood', label: '🐟 Seafood' },
]

export const CATEGORIES: Category[] = [
  { id: 'all', label: 'All', emoji: '✦' },
  { id: 'Breakfast at the Lodge', label: 'Breakfast at the Lodge', emoji: '🌅' },
  { id: 'Signature Mains & Heritage Feasts', label: 'Signature Mains & Heritage Feasts', emoji: '🍽' },
  { id: 'Stone-Baked Pizzas', label: 'Stone-Baked Pizzas', emoji: '🍕' },
  { id: 'Soups & Light Starters', label: 'Soups & Light Starters', emoji: '🍲' },
  { id: 'Beverages', label: 'Beverages', emoji: '☕' },
  { id: 'Chilled Drinks & Fresh Juices', label: 'Chilled Drinks & Fresh Juices', emoji: '🧃' },
  { id: 'Accompaniments', label: 'Accompaniments', emoji: '🌾' },
  { id: 'Slow-Cooked Tumbukiza Specials', label: 'Slow-Cooked Tumbukiza Specials', emoji: '🪵' },
]

type DishInput = Omit<Dish, 'image'> & { image?: string }

const createDish = (dish: DishInput): Dish => ({
  ...dish,
  image: dish.image ?? '',
  freshness: dish.freshness ?? 100,
  availability: dish.availability ?? 'Available Today',
  tags: dish.tags ?? [],
})

export const DISHES: Dish[] = [
  createDish({ id: 'bk-1', category: 'Breakfast at the Lodge', name: 'Classic Eco Lodge Delight', image: '/images/The-Classic-Eco-Lodge-Delight.jpeg', description: 'Pancakes, sausages, eggs, sweet potatoes, served with choice of teas, coffee, fruits, or juice', price: 1500, tags: ['High Protein'], chefChoice: true }),
  createDish({ id: 'bk-2', category: 'Breakfast at the Lodge', name: 'English Farm Breakfast', image: '/images/The-Farm-Breakfast.jpeg', description: 'Bacon, sausages, eggs, baked beans, fruits, served with African Tea, coffee, milk, or juice', price: 2200, tags: ['High Protein'], featured: true }),

  createDish({ id: 'main-1', category: 'Signature Mains & Heritage Feasts', name: 'Swahili Biryani (Mutton or Chicken)', image: '/images/Biryani-Beef-Mutton-or-Chicken.jpeg', description: 'Fragrant Swahili biryani with your choice of mutton or chicken', price: 3000, tags: ['High Protein', 'Traditional'], customisable: true }),
  createDish({ id: 'main-2', category: 'Signature Mains & Heritage Feasts', name: 'Whole Lake Tilapia', image: '/images/Marinated-Whole-Tilapia.jpeg', description: 'Grilled, Dry-Fried, Wet-Fried or Curry', price: 2500, tags: ['Seafood', 'GF'], customisable: true }),
  createDish({ id: 'main-3', category: 'Signature Mains & Heritage Feasts', name: 'Marinated Farm Mbuzi (1kg)', description: 'Choma, Wet-Fry, or Dry-Fry', price: 2600, tags: ['High Protein'], customisable: true }),
  createDish({ id: 'main-4', category: 'Signature Mains & Heritage Feasts', name: 'The Ubuntu Capon (Whole Chicken)', description: 'Choma, Wet-Fried, or Crisp-Fried', price: 2600, tags: ['High Protein'], customisable: true }),
  createDish({ id: 'main-5', category: 'Signature Mains & Heritage Feasts', name: 'Free Range Kienyeji (Roadrunner)', description: 'Free-range, indigenous chicken prepared traditionally', price: 3600, tags: ['High Protein', 'Traditional'] }),

  createDish({ id: 'pizza-1', category: 'Stone-Baked Pizzas', name: 'BBQ Chicken Tikka Pizza', description: 'Stone-baked pizza with BBQ chicken tikka', price: 2000, tags: ['High Protein'], customisable: true, servingSize: 'Medium KSh 2,000 / Large KSh 2,500' }),
  createDish({ id: 'pizza-2', category: 'Stone-Baked Pizzas', name: 'Classic Hawaiian Pizza', description: 'Stone-baked pizza with ham and pineapple', price: 1500, tags: ['High Protein'], customisable: true, servingSize: 'Medium KSh 1,500 / Large KSh 2,300' }),
  createDish({ id: 'pizza-3', category: 'Stone-Baked Pizzas', name: 'Garden Margherita Pizza', image: '/images/Margherita-Pizza-(Medium).jpeg', description: 'Stone-baked garden Margherita pizza', price: 1000, tags: ['Vegetarian'], customisable: true, servingSize: 'Medium KSh 1,000 / Large KSh 1,800' }),

  createDish({ id: 'starter-1', category: 'Soups & Light Starters', name: 'Mushroom Broth', image: '/images/Mushroom-Soup.jpeg', description: 'Warm, earthy mushroom broth', price: 700, tags: ['Vegetarian'] }),
  createDish({ id: 'starter-2', category: 'Soups & Light Starters', name: 'Velvety Butternut Soup', image: '/images/Butternut-Soup.jpeg', description: 'Silky butternut soup with warm spices', price: 700, tags: ['Vegan', 'GF'] }),
  createDish({ id: 'starter-3', category: 'Soups & Light Starters', name: 'Garden Vegetable Soup', image: '/images/Vegetable-Soup.jpeg', description: 'Hearty soup made from garden vegetables', price: 700, tags: ['Vegan', 'GF'] }),
  createDish({ id: 'starter-4', category: 'Soups & Light Starters', name: 'Crispy Beef Samosas', image: '/images/Beef-Samosa.jpeg', description: 'Crisp pastry filled with spiced beef', price: 300, tags: ['High Protein'] }),
  createDish({ id: 'starter-5', category: 'Soups & Light Starters', name: 'Lodge Pancakes', image: '/images/pancakes.jpeg', description: 'Fresh lodge pancakes served warm', price: 300, tags: ['Vegetarian'] }),

  createDish({ id: 'bev-1', category: 'Beverages', name: 'African Spiced Tea', image: '/images/African-Tea-Chai.jpeg', description: 'Spiced African tea', price: 250, tags: ['Vegetarian'] }),
  createDish({ id: 'bev-2', category: 'Beverages', name: 'House Brewed Coffee', image: '/images/Black-Coffee.jpeg', description: 'House brewed coffee', price: 250, tags: ['Vegan', 'GF'] }),
  createDish({ id: 'bev-3', category: 'Beverages', name: 'Steamed Warm Milk', image: '/images/Hot-Milk.jpeg', description: 'Steamed warm milk', price: 300, tags: ['Vegetarian', 'GF'] }),
  createDish({ id: 'bev-4', category: 'Beverages', name: 'Pure Black Tea', image: '/images/Black-Tea.jpeg', description: 'Pure Kenyan black tea', price: 200, tags: ['Vegan'] }),
  createDish({ id: 'bev-5', category: 'Beverages', name: 'Hand-Picked Herbal Teas', image: '/images/Herbal-Infusions.jpeg', description: 'Hand-picked herbal tea infusions', price: 350, tags: ['Vegan', 'GF'] }),
  createDish({ id: 'bev-6', category: 'Beverages', name: 'Farmhouse Dawa', description: 'A warming farmhouse dawa', price: 600, tags: ['Vegan', 'GF'] }),
  createDish({ id: 'bev-7', category: 'Beverages', name: 'Masala Tea', description: 'Aromatic masala tea', price: 300, tags: ['Vegetarian'] }),

  createDish({ id: 'cold-1', category: 'Chilled Drinks & Fresh Juices', name: 'Iced Herbal/Tea', description: 'Chilled herbal tea', price: 250, tags: ['Vegan', 'GF'] }),
  createDish({ id: 'cold-2', category: 'Chilled Drinks & Fresh Juices', name: 'Iced Coffee', description: 'Chilled coffee', price: 400, tags: ['Vegan', 'GF'] }),
  createDish({ id: 'cold-3', category: 'Chilled Drinks & Fresh Juices', name: 'Fresh Juices', image: '/images/Fresh-Juice.jpeg', description: 'Fresh seasonal juices', price: 400, tags: ['Vegan', 'GF'] }),
  createDish({ id: 'cold-4', category: 'Chilled Drinks & Fresh Juices', name: 'Tropical Fruit Medley', image: '/images/Tropical-Fruit-Medley.jpeg', description: 'A blend of tropical fruits', price: 700, tags: ['Vegan', 'GF'] }),

  createDish({ id: 'side-1', category: 'Accompaniments', name: 'Traditional White Ugali', image: '/images/Ugali.jpeg', description: 'Traditional white ugali', price: 300, tags: ['Vegan', 'GF'] }),
  createDish({ id: 'side-2', category: 'Accompaniments', name: 'Steamed White Rice', image: '/images/Plain-Rice.jpeg', description: 'Steamed white rice', price: 300, tags: ['Vegan', 'GF'] }),
  createDish({ id: 'side-3', category: 'Accompaniments', name: 'Flaky Layered Chapatis (Plain)', image: '/images/Chapati-(Pair).jpeg', description: 'Plain flaky layered chapatis', price: 300, tags: ['Vegan'] }),
  createDish({ id: 'side-4', category: 'Accompaniments', name: 'Sweet Potato Spears', image: '/images/Sweet-Potatoes.jpeg', description: 'Sweet potato spears', price: 250, tags: ['Vegan', 'GF'] }),
  createDish({ id: 'side-5', category: 'Accompaniments', name: 'Mashed Potatoes', image: '/images/Mashed-Potatoes.jpeg', description: 'Creamy mashed potatoes', price: 300, tags: ['Vegetarian', 'GF'] }),
  createDish({ id: 'side-6', category: 'Accompaniments', name: 'Golden Lodge Fries', image: '/images/Ubuntu-Farm-Fries.jpeg', description: 'Golden lodge fries', price: 500, tags: ['Vegan', 'GF'] }),
  createDish({ id: 'side-7', category: 'Accompaniments', name: 'Sautéed Potatoes', description: 'Sautéed potatoes', price: 500, tags: ['Vegan', 'GF'] }),
  createDish({ id: 'side-8', category: 'Accompaniments', name: 'Sautéed Garden Vegetables', image: '/images/Sauté-Vegetables1.jpeg', description: 'Sautéed garden vegetables', price: 200, tags: ['Vegetarian', 'GF'] }),
  createDish({ id: 'side-9', category: 'Accompaniments', name: 'Vegetable Rice Medley', image: '/images/Vegetable-Rice.jpeg', description: 'Vegetable rice medley', price: 500, tags: ['Vegan', 'GF'] }),
  createDish({ id: 'side-10', category: 'Accompaniments', name: 'Spiced Potato Bhajias', image: '/images/Bhajia.jpeg', description: 'Spiced potato bhajias', price: 600, tags: ['Vegan'] }),
  createDish({ id: 'side-11', category: 'Accompaniments', name: 'Matoke (1 kg)', image: '/images/Matoke-(1kg).jpeg', description: 'Matoke prepared in the Ubuntu kitchen', price: 500, tags: ['Vegan', 'GF'] }),

  createDish({ id: 'tumb-1', category: 'Slow-Cooked Tumbukiza Specials', name: '2kg Mbuzi Tumbukiza', description: 'Goat Meat slow-cooked with sweet garden vegetables and soft fresh potatoes in a rich broth', price: 2800, tags: ['High Protein', 'GF', 'Traditional'] }),
  createDish({ id: 'tumb-2', category: 'Slow-Cooked Tumbukiza Specials', name: 'Kuku Kienyeji Tumbukiza', image: '/images/Whole-Kienyeji-Chicken-Tumbukiza.jpeg', description: 'Whole free-range indigenous chicken poached low and slow with fresh garden vegetables and potatoes', price: 3800, tags: ['High Protein', 'GF', 'Traditional'] }),
]

export interface MenuItem extends Dish {}
export interface MenuCategory { category: string; description?: string; items: Dish[] }
export const FLAT_ITEMS: Dish[] = DISHES
export const ITEM_BY_ID: Map<string, Dish> = new Map(DISHES.map(dish => [dish.id, dish]))
export const TOTAL_DISHES = DISHES.length
export const ALL_CATEGORIES: string[] = ['All', ...CATEGORIES.filter(category => category.id !== 'all').map(category => category.label)]
export const TICKER_MESSAGES = [
  '🔥 Slow-cooked Tumbukiza specials from the Ubuntu kitchen',
  '◈ Stone-baked pizzas ready to share',
  '🌿 Fresh garden vegetables gathered for today\'s table',
  '☕ Hand-picked herbal teas and farmhouse coffee',
]

export type { Dish as default }
