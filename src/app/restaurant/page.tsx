"use client"

import { useMemo, useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import MoxieChat from '@/components/MoxieChat'
import { useCartStore } from '@/context/cartStore'
import { create } from 'zustand'

// ─────────────────────────────────────────────────────────────────────
// TYPES (all original preserved)
// ─────────────────────────────────────────────────────────────────────
export interface MenuItem {
  id: string; name: string; image: string; description: string; storyLine?: string
  price: number; animal?: string; field: string; freshness: number; phLevel: string
  temp: string; offset: string; dietary: string[]; ingredients: string[]
  featured?: boolean; chefChoice?: boolean; seasonal?: boolean; signature?: boolean
  availability?: string; availabilityCount?: number; pairing?: string
  prepTime?: number; calories?: number; allergens?: string[]; servingSize?: string
}
export interface MenuCategory { category: string; description?: string; items: MenuItem[] }
export type OrderStatus = 'awaiting_payment'|'confirmed'|'sourcing'|'preparing'|'plating'|'ready'|'served'
export interface ActiveOrder {
  id: string; status: OrderStatus; placedAt: number
  items: { name: string; qty: number; price: number }[]; total: number; tableNote?: string
}
interface StagedItem { item: MenuItem; qty: number; category: string; notes?: string }

const ORDER_STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'confirmed', label: 'Order Confirmed' }, { key: 'sourcing', label: 'Sourcing Assets' },
  { key: 'preparing', label: 'Preparing' }, { key: 'plating', label: 'Plating' },
  { key: 'ready', label: 'Ready to Serve' }, { key: 'served', label: 'Served' },
]

// ─────────────────────────────────────────────────────────────────────
// VILLAGE KITCHEN TYPES & DATA — complete Ubuntu menu
// ─────────────────────────────────────────────────────────────────────
export interface VKItem {
  id: string; name: string; subtitle: string; description: string
  price: number; image: string; tag?: string; options?: string[]
  dietary?: string[]; chefPick?: boolean; popular?: boolean; available?: boolean
  ingredients?: string[]; allergens?: string[]; prepTime?: number; calories?: number
  storyLine?: string; servingSize?: string
}
export interface VKCategory {
  id: string; category: string; emoji: string; color: string
  description: string; items: VKItem[]
}

const VILLAGE_KITCHEN: VKCategory[] = [
  {
    id: 'vk-snacks', category: 'Salads & Snacks', emoji: '🌿', color: '#A8F0D8',
    description: 'Light bites from the farm and fire — the natural start to any Ubuntu day.',
    items: [
      { id: 'vk-s1', name: 'Seasonal Fruit Bowl', subtitle: 'Farm-picked daily', description: 'A rotating selection of seasonal fruits picked fresh from the orchard. Sweet, vibrant, and honest. Never from a can.', storyLine: 'Whatever the orchard offered this morning — mango, pawpaw, watermelon, passion. Cut at the pass and served immediately.', price: 500, image: 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=800&q=80', dietary: ['Vegan', 'GF'], popular: true, allergens: ['None'], prepTime: 5, calories: 180, ingredients: ['Seasonal Fruits', 'Honey Drizzle'], servingSize: '300g bowl' },
      { id: 'vk-s2', name: 'Ubuntu Fruit Platter', subtitle: 'Assorted cuts to share', description: 'A generous sharing platter of hand-cut tropical fruits — pawpaw, pineapple, watermelon, and whatever the season offers.', storyLine: 'The full spread of what the orchard is giving today — sliced, arranged, shared.', price: 1000, image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=800&q=80', dietary: ['Vegan', 'GF'], allergens: ['None'], prepTime: 8, calories: 320, ingredients: ['Assorted Fruits', 'Mint Garnish'], servingSize: 'Sharing platter' },
      { id: 'vk-s3', name: 'Village Samosa', subtitle: 'Crisp pastry, spiced filling', description: 'Golden triangles filled with spiced minced meat or vegetables, fried to a perfect crunch and served with chilli and mint chutney.', storyLine: 'Folded by hand in the kitchen each morning. The filling changes with the harvest.', price: 400, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80', popular: true, allergens: ['Gluten'], prepTime: 8, calories: 280, ingredients: ['Pastry', 'Spiced Filling', 'Oil'], servingSize: '2 pieces' },
      { id: 'vk-s4', name: 'Farm Sausage', subtitle: 'Grilled over open flame', description: 'Pork or beef sausage grilled slowly over open flame until the skin chars and blisters. Simple. Honest. Delicious.', storyLine: 'Sourced from within the village supply chain, grilled over open heat.', price: 300, image: 'https://images.unsplash.com/photo-1563897539633-7374c059f29d?w=800&q=80', allergens: ['Gluten'], prepTime: 10, calories: 220, ingredients: ['Pork/Beef Sausage'], servingSize: '2 pieces' },
      { id: 'vk-s5', name: 'Meat Pie / Chicken Pie', subtitle: 'Buttered pastry, hearty fill', description: 'Flaky shortcrust pastry encasing a rich filling of spiced minced meat or tender chicken. Baked fresh each morning.', storyLine: 'Baked in the Ubuntu kitchen — a simple thing done properly.', price: 350, image: 'https://images.unsplash.com/photo-1535438097175-192b6ead1b9a?w=800&q=80', allergens: ['Gluten'], prepTime: 5, calories: 370, ingredients: ['Pastry', 'Minced Meat or Chicken', 'Spices'], servingSize: '1 piece' },
      { id: 'vk-s6', name: 'Mini Ubuntu Pizza', subtitle: 'Stone-baked, locally topped', description: 'A palm-sized pizza on a thin, slightly charred base, topped with tomato, mozzarella, and whatever the kitchen garden is offering.', storyLine: 'Built on a base pressed in the kitchen and fired in the stone oven.', price: 300, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80', allergens: ['Gluten', 'Dairy'], prepTime: 12, calories: 310, ingredients: ['Dough', 'Tomato Sauce', 'Mozzarella', 'Garden Toppings'], servingSize: '1 mini pizza' },
      { id: 'vk-s7', name: 'Farm Fries', subtitle: 'Crisp-cut, sea-salted', description: 'Hand-cut potato fries, double-fried for crunch and finished with house salt and a side of smoky chilli sauce.', storyLine: 'Potatoes from Field C, cut by hand, fried twice for maximum crunch.', price: 500, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80', dietary: ['Vegan', 'GF'], popular: true, allergens: ['None'], prepTime: 12, calories: 380, ingredients: ['Potatoes', 'Oil', 'Sea Salt', 'Smoky Chilli Sauce'], servingSize: 'Generous portion' },
      { id: 'vk-s8', name: 'Village Bhajia', subtitle: 'Golden potato fritters', description: 'Thin-sliced potatoes in a spiced chickpea batter, fried until golden and crisp. A Kenyan classic done with Ubuntu care.', storyLine: 'A Kenyan street classic elevated by the Ubuntu kitchen — spiced to the edge of heat.', price: 500, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80', popular: true, allergens: ['Gluten'], prepTime: 10, calories: 340, ingredients: ['Potatoes', 'Chickpea Flour', 'Spices'], servingSize: 'Sharing portion' },
      { id: 'vk-s9', name: 'Ubuntu Chapati', subtitle: 'Soft-layered, hand-rolled', description: 'Layered flatbread rolled and cooked on a flat griddle. Soft inside, golden outside — served with a dipping sauce or alongside any main.', storyLine: 'Rolled and cooked to order. The smell alone is worth the walk from the cottages.', price: 300, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80', dietary: ['Vegan'], allergens: ['Gluten'], prepTime: 8, calories: 260, ingredients: ['Wheat Flour', 'Oil', 'Salt', 'Water'], servingSize: '2 chapati' },
      { id: 'vk-s10', name: 'Sunrise Pancake', subtitle: 'Light, golden, served warm', description: 'Thin crepe-style pancakes, lightly sweetened and served with local honey and a squeeze of lime. Made to order.', storyLine: 'Made with dairy paddock milk and fresh eggs. Served with honey from the North Apiary.', price: 200, image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80', dietary: ['Vegetarian'], allergens: ['Gluten', 'Dairy', 'Eggs'], prepTime: 8, calories: 320, ingredients: ['Flour', 'Egg', 'Milk', 'Butter', 'Honey'], servingSize: '2 pancakes' },
      { id: 'vk-s11', name: 'Ubuntu Hot Dog', subtitle: 'Spiced frank, toasted bun', description: 'A well-seasoned beef frank in a lightly toasted bun, topped with caramelised onions and house mustard.', storyLine: "The kind of thing you didn't expect to find at an eco-lodge — but once you do, it makes complete sense.", price: 500, image: 'https://images.unsplash.com/photo-1612392062126-a7b46ce7f6a5?w=800&q=80', allergens: ['Gluten'], prepTime: 8, calories: 420, ingredients: ['Beef Frank', 'Bun', 'Caramelised Onions', 'House Mustard'], servingSize: '1 hot dog' },
      { id: 'vk-s12', name: 'Ubuntu Cheese Burger', subtitle: 'Double beef, aged cheddar', description: 'Two smash patties of seasoned beef, melted aged cheddar, crisp lettuce, tomato, pickles, and house sauce in a brioche bun.', storyLine: 'Farm beef. House-baked bun. Cheese from the dairy. Everything from here.', price: 1500, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80', chefPick: true, allergens: ['Gluten', 'Dairy'], prepTime: 15, calories: 740, ingredients: ['Beef Patty', 'Aged Cheddar', 'Lettuce', 'Tomato', 'Pickles', 'House Sauce', 'Brioche Bun'], servingSize: '1 burger' },
      { id: 'vk-s13', name: 'Plain Village Burger', subtitle: 'Classic, honest, satisfying', description: 'A hand-shaped beef patty on a soft bun with fresh salad and a light dressing. No frills — just a great burger.', storyLine: "No frills. Just the patty, the bun, and the trust that when you start with good beef, you don't need much more.", price: 900, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80', allergens: ['Gluten'], prepTime: 12, calories: 580, ingredients: ['Beef Patty', 'Soft Bun', 'Fresh Salad', 'Light Dressing'], servingSize: '1 burger' },
      { id: 'vk-s14', name: 'Village Cake Slice', subtitle: 'Baked in the farm kitchen', description: "A generous slice of whatever the kitchen is baking today — often carrot, lemon, or a rich chocolate. Ask your server.", storyLine: 'Baked in the morning, it depends entirely on what the pastry team are inspired by today.', price: 350, image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80', dietary: ['Vegetarian'], allergens: ['Gluten', 'Dairy', 'Eggs'], prepTime: 3, calories: 340, ingredients: ['Flour', 'Eggs', 'Butter', 'Sugar'], servingSize: '1 slice' },
    ],
  },
  {
    id: 'vk-breakfast', category: 'Ubuntu Breakfast', emoji: '🌅', color: '#F0D8A8',
    description: 'Rise with the farm. Morning meals built from what was gathered at dawn.',
    items: [
      { id: 'vk-b1', name: 'Classic Ubuntu Breakfast', subtitle: 'Sweet potato · pancake · sausage · eggs', description: 'A warm, grounding plate of farm sweet potato, golden pancake, two grilled sausages, and boiled farm eggs. Served with black tea, coffee, fresh juice, or hot milk.', storyLine: 'The village wakes before you do. By the time this plate reaches your table, the sweet potatoes have come from Field C and the eggs collected from the morning count.', price: 1500, image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&q=80', popular: true, chefPick: true, dietary: ['High Protein'], allergens: ['Gluten', 'Eggs', 'Dairy'], prepTime: 20, calories: 720, ingredients: ['Sweet Potato', 'Pancake', 'Grilled Sausage', 'Boiled Eggs'], servingSize: 'Full plate + drink' },
      { id: 'vk-b2', name: 'English Farm Breakfast', subtitle: 'Sausage · egg · bacon · beans · toast', description: 'A full plate: grilled sausage, omelet or sunny-side-up egg, buttered toast, streaky bacon, baked beans, and seasonal fruits. Choose tea, coffee, juice, or hot milk.', storyLine: 'A ritual that has anchored Ubuntu mornings since we first opened the kitchen.', price: 2200, image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&q=80', popular: true, allergens: ['Gluten', 'Eggs', 'Dairy'], prepTime: 25, calories: 960, ingredients: ['Sausage', 'Egg', 'Toasted Bread', 'Butter', 'Bacon', 'Baked Beans', 'Fruit'], servingSize: 'Full plate + drink' },
      { id: 'vk-b3', name: 'Ubuntu Traditional Plate', subtitle: 'Arrowroot · kienyeji eggs · coconut beans', description: 'An entirely local plate: arrowroot, sweet potatoes, fresh kienyeji eggs, coconut beans, and maharishi. Served with wimbi uji, chai, coffee, or fresh juice.', storyLine: 'Before the hotel, before the farm, there was this plate. The arrowroot from the upper ridge, the kienyeji eggs still warm from the yard. This is where Ubuntu began.', price: 2600, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80', dietary: ['GF', 'Traditional'], chefPick: true, allergens: ['Eggs'], prepTime: 30, calories: 680, ingredients: ['Arrowroot', 'Sweet Potatoes', 'Kienyeji Eggs', 'Coconut Bean', 'Maharishi'], servingSize: 'Full plate + drink' },
    ],
  },
  {
    id: 'vk-soups', category: 'Ubuntu Soups', emoji: '🫕', color: '#F0A8B8',
    description: 'Slow-cooked. Patient. The kind of warmth that takes time.',
    items: [
      { id: 'vk-soup1', name: 'Cream of Tomato', subtitle: 'Farm tomato · fresh herb garnish', description: 'A silky smooth blend of sun-ripened tomatoes slow-simmered with aromatics and finished with a swirl of cream and fresh herbs from the kitchen garden.', storyLine: 'Field A tomatoes at peak ripeness, blended with cream from the dairy paddock.', price: 600, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80', dietary: ['Vegetarian'], popular: true, allergens: ['Dairy'], prepTime: 18, calories: 280, ingredients: ['Tomatoes', 'Fresh Cream', 'Herbs', 'Garlic'], servingSize: '350ml' },
      { id: 'vk-soup2', name: 'Slow Mutton Herb Soup', subtitle: 'Braised mutton · herbs · deep broth', description: 'Mutton slow-cooked for hours in a clay pot with valley herbs and aromatic spices until the broth runs deep and the meat falls apart.', storyLine: 'The shoulder that was not carved this morning goes into the pot at noon.', price: 1000, image: 'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=800&q=80', chefPick: true, allergens: ['None'], prepTime: 40, calories: 420, ingredients: ['Mutton', 'Fresh Herbs', 'Spices', 'Root Vegetables'], servingSize: '350ml' },
      { id: 'vk-soup3', name: 'Cream of Mushroom', subtitle: 'Foraged mushroom · velvety finish', description: 'Wild and cultivated mushrooms blended into a deep, earthy cream. Finished with herb oil and croutons from yesterday\'s bread.', storyLine: 'Forest edge porcini at their earthiest, cooked low until the cream carries the depth without covering it.', price: 600, image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=800&q=80', dietary: ['Vegetarian'], allergens: ['Dairy', 'Gluten'], prepTime: 22, calories: 310, ingredients: ['Fresh Mushrooms', 'Cream', 'Thyme', 'Garlic', 'Croutons'], servingSize: '350ml' },
      { id: 'vk-soup4', name: 'Chicken & Veggie Soup', subtitle: 'Farm chicken · garden vegetables', description: 'A clear, golden broth built from free-range chicken and garden vegetables — carrots, celery, leek, and whatever the field offered this morning.', storyLine: 'The broth that has kept Ubuntu going since the beginning.', price: 600, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80', allergens: ['None'], prepTime: 30, calories: 290, ingredients: ['Chicken', 'Carrots', 'Celery', 'Garden Herbs'], servingSize: '350ml' },
    ],
  },
  {
    id: 'vk-mains', category: 'Ala Carte Mains', emoji: '🔥', color: '#E8913A',
    description: 'The heart of the Ubuntu kitchen — fire, spice, and slow-cooked craft.',
    items: [
      { id: 'vk-m1', name: 'Ubuntu Grilled Rabbit', subtitle: 'Herb-marinated · open flame', description: 'Tender farm rabbit marinated overnight in local herbs and spices, grilled slowly over an open flame until the skin crisps and the meat stays impossibly juicy.', storyLine: 'Field C rabbit, marinated for 24 hours in the kitchen herb blend. A plate that takes patience to make and seconds to appreciate.', price: 4000, image: 'https://images.unsplash.com/photo-1582202685791-766b864a7810?w=800&q=80', chefPick: true, allergens: ['None'], prepTime: 40, calories: 520, ingredients: ['Farm Rabbit', 'Herb Marinade', 'Spices', 'Fresh Vegetables'], servingSize: '300g' },
      { id: 'vk-m2', name: 'Slow-Grilled Duck', subtitle: 'Smoky · slow · succulent', description: 'A whole duck leg and breast slow-grilled over hardwood until the fat renders and the skin turns deep mahogany. Served with seasonal sides.', storyLine: 'Aviary duck, marinated overnight and grilled low and slow. The smokiness is not added — it is earned.', price: 3000, image: 'https://images.unsplash.com/photo-1559847844-d721426d6edc?w=800&q=80', chefPick: true, allergens: ['None'], prepTime: 45, calories: 660, ingredients: ['Duck', 'Aromatic Herbs', 'Seasonal Sides'], servingSize: '280g' },
      { id: 'vk-m3', name: 'Kienyeji Farm Chicken', subtitle: 'Free-range · local spices · slow-cooked', description: 'Traditional farm-raised kienyeji chicken, slow-cooked in a clay pot with local spices and aromatics. This is the chicken that grew up on this farm.', storyLine: 'The yard chicken. Raised slowly, cooked your way. The dry fry shows the crispness. The wet fry shows the depth.', price: 2500, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80', popular: true, chefPick: true, dietary: ['High Protein', 'GF'], allergens: ['None'], prepTime: 50, calories: 680, ingredients: ['Kienyeji Chicken', 'Local Spices', 'Herbs'], servingSize: '400g', options: ['Dry Fry', 'Wet Fry', 'Boiled'] },
      { id: 'vk-m4', name: 'Garlic Whole Tilapia', subtitle: 'Fresh from the pond · herb-marinated', description: 'A whole tilapia from our farm pond, marinated in garlic, lemon, and herbs then grilled over an open flame until the flesh flakes at the spine.', storyLine: 'Water Pond tilapia caught this morning, scored and marinated with garlic from the herb garden, then grilled whole over open heat.', price: 2000, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80', popular: true, dietary: ['Seafood', 'GF'], allergens: ['Fish'], prepTime: 30, calories: 440, ingredients: ['Whole Tilapia', 'Garlic', 'Fresh Herbs', 'Lemon'], servingSize: '1 whole fish' },
      { id: 'vk-m5', name: 'Grilled T-Bone Steak', subtitle: 'Seasoned · fire-finished', description: 'A generous T-bone of seasoned beef grilled over high heat to your preferred doneness. Served with grilled vegetables and house sauce.', storyLine: 'Heritage beef from the upper pasture. The T-bone carries both the strip and the tenderloin — two textures, one fire.', price: 2000, image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80', dietary: ['Carnivore', 'GF'], allergens: ['None'], prepTime: 25, calories: 780, ingredients: ['T-Bone Steak', 'Seasoning', 'Choice of Side'], servingSize: '400g', options: ['Rare', 'Medium Rare', 'Medium', 'Medium Well', 'Well Done'] },
      { id: 'vk-m6', name: 'Village Pork Chops', subtitle: 'Juicy · marinated · grilled', description: 'Thick-cut pork chops marinated in garlic, ginger, and a touch of honey, grilled until the edges caramelise. Simple village cooking at its best.', storyLine: 'Properly marinated, properly grilled. The herb crust catches first, then the fat renders, then the rest of it follows.', price: 2500, image: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=800&q=80', allergens: ['None'], prepTime: 25, calories: 640, ingredients: ['Pork Chops', 'Garlic', 'Ginger', 'Honey', 'Spices'], servingSize: '2 chops' },
      { id: 'vk-m7', name: 'Coconut Fish Curry', subtitle: 'Fresh fish · spiced coconut · herbs', description: 'Fresh fish in a slow-built curry of coconut milk, tomato, and aromatic spices. Served with rice or chapati. Fragrant. Deep. Warming.', storyLine: 'Lake fish, fresh from the water, cooked low in a curry that has been building for hours.', price: 2000, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80', popular: true, dietary: ['Seafood', 'GF'], allergens: ['Fish'], prepTime: 35, calories: 480, ingredients: ['Fresh Fish', 'Coconut Milk', 'Tomato', 'Aromatic Spices'], servingSize: '280g' },
      { id: 'vk-m8', name: 'Ubuntu Chicken Tikka', subtitle: 'Marinated · chargrilled · vibrant', description: 'Chicken pieces marinated in a blend of yogurt, fresh ginger, garlic, and spices, chargrilled until tender and smoky. Served with mint chutney.', storyLine: 'Farm chicken marinated overnight in a blend of spices, then grilled over open heat until the char line is exactly right.', price: 1600, image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800&q=80', popular: true, dietary: ['High Protein', 'GF'], allergens: ['Dairy'], prepTime: 25, calories: 560, ingredients: ['Chicken', 'Yogurt', 'Ginger', 'Garlic', 'Spices', 'Mint Chutney'], servingSize: '300g' },
      { id: 'vk-m9', name: 'Ubuntu Biryani', subtitle: 'Mutton · beef · or chicken', description: 'Fragrant long-grain basmati rice slow-cooked with your choice of mutton, beef, or chicken, layered with caramelised onions and aromatic whole spices.', storyLine: 'Basmati layered with farm protein and sealed tight. The steam does the work. You choose what goes inside — we choose how it is cooked.', price: 1000, image: 'https://images.unsplash.com/photo-1563379091339-03246963d651?w=800&q=80', popular: true, dietary: ['High Protein', 'GF'], allergens: ['None'], prepTime: 40, calories: 680, ingredients: ['Basmati Rice', 'Choice of Protein', 'Aromatic Spices', 'Caramelised Onions'], servingSize: '400g', options: ['Mutton Biryani', 'Beef Biryani', 'Chicken Biryani'] },
      { id: 'vk-m10', name: 'Grilled Lamb Chops', subtitle: 'Herb-crusted · served with vegetables', description: 'Succulent lamb chops marinated with herbs and grilled to perfection, served with a side of seasonal vegetables.', storyLine: 'Ridge-grazed lamb, marinated in field herbs, seared until the bone begins to colour.', price: 1400, image: 'https://images.unsplash.com/photo-1544022613-e87cd75aeb7c?w=800&q=80', dietary: ['High Protein', 'GF'], allergens: ['None'], prepTime: 28, calories: 620, ingredients: ['Lamb Chops', 'Herb Marinade', 'Seasonal Vegetables'], servingSize: '3 chops', options: ['Rare', 'Medium Rare', 'Medium', 'Well Done'] },
      { id: 'vk-m11', name: 'Fish Fillet', subtitle: 'Grilled or fried · tartar sauce', description: 'Boneless fish fillet lightly seasoned and grilled or fried, served with tartar sauce.', storyLine: 'The cleanest expression of lake fish — no bones, no drama, just the fillet cooked your way.', price: 1500, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80', dietary: ['Seafood', 'GF'], allergens: ['Fish'], prepTime: 20, calories: 360, ingredients: ['Fish Fillet', 'Light Seasoning', 'Tartar Sauce'], servingSize: '240g', options: ['Grilled', 'Fried'] },
    ],
  },
  {
    id: 'vk-choma', category: 'Choma Zone', emoji: '🔥', color: '#E85D24',
    description: 'Open flame. Smoke. The oldest way to cook — and still the best.',
    items: [
      { id: 'vk-ch1', name: 'Grilled Whole Chicken', subtitle: 'Whole bird · choice of sides', description: 'A whole free-range chicken, marinated in our house blend and slow-grilled over open coals until the skin crisps and the joints yield. Served with your choice of sides.', storyLine: 'A whole bird over the fire. It takes the time it takes. The result is worth every minute.', price: 2000, image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=800&q=80', popular: true, chefPick: true, dietary: ['High Protein', 'GF'], allergens: ['None'], prepTime: 60, calories: 920, ingredients: ['Whole Chicken', 'Herb Marinade', 'Choice of Sides'], servingSize: '1 whole chicken' },
      { id: 'vk-ch2', name: 'Grilled Mutton', subtitle: 'Per kg · premium marinated', description: 'Premium mutton pieces marinated in herbs and aromatic spices, grilled over hardwood coals. Charged per kilogram. Order for the table.', storyLine: 'Boma mutton at its most direct — just the fire, the meat, and the marinade. Priced by weight.', price: 2000, image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&q=80', tag: 'Per kg', dietary: ['High Protein', 'GF'], allergens: ['None'], prepTime: 50, calories: 740, ingredients: ['Mutton', 'Herb Marinade', 'Spices'], servingSize: 'Per kilogram' },
      { id: 'vk-ch3', name: 'Grilled Beef', subtitle: 'Per kg · herb-rubbed', description: 'Premium beef cuts marinated with aromatic herbs and grilled over open coals. Priced per kilogram. Best shared across the table with sides.', storyLine: 'Heritage beef from the pasture, grilled over the open choma fire. The char is what you came for.', price: 2000, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80', tag: 'Per kg', dietary: ['Carnivore', 'GF'], allergens: ['None'], prepTime: 40, calories: 860, ingredients: ['Beef', 'Aromatic Spices', 'Herbs'], servingSize: 'Per kilogram' },
    ],
  },
  {
    id: 'vk-traditional', category: 'Traditional Food', emoji: '🪴', color: '#B8A9F0',
    description: 'Every meal comes with 2 accompaniments from: Ugali, Sweet Potatoes, Mashed Potato, Chapati, Managu, Kienyeji Mix, Creamed Spinach, Matoke Mash, Fries, Wedges or Baked Potatoes.',
    items: [
      { id: 'vk-t1', name: 'Tumbukiza (1kg)', subtitle: 'Goat meat · cabbage or spinach · potatoes', description: 'Goat meat slow-cooked in a communal pot with your choice of cabbage or spinach and potatoes. The original Ubuntu meal.', storyLine: 'The communal pot that Ubuntu grew from. Slow-cooked goat from the Boma herd, falling from the bone into a rich broth.', price: 2500, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80', chefPick: true, popular: true, dietary: ['High Protein', 'GF'], allergens: ['None'], prepTime: 60, calories: 820, ingredients: ['Goat Meat', 'Cabbage or Spinach', 'Potatoes'], servingSize: '1kg serving' },
      { id: 'vk-t2', name: 'Kienyeji Chicken', subtitle: 'Free-range · dry fry · wet fry · boiled', description: 'Traditional farm-raised kienyeji chicken cooked to your preference — dry fry, wet fry, or boiled. Rich, flavourful, authentic.', storyLine: 'The yard chicken. Raised slowly, cooked your way.', price: 3600, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80', chefPick: true, popular: true, dietary: ['High Protein', 'GF'], allergens: ['None'], prepTime: 45, calories: 720, ingredients: ['Kienyeji Chicken', 'Local Spices'], servingSize: 'Full serving', options: ['Dry Fry', 'Wet Fry', 'Boiled'] },
      { id: 'vk-t3', name: 'Fish (Traditional)', subtitle: 'Dry fry · wet fry · boiled · grilled', description: 'Fresh lake fish cooked the traditional way — your choice of method. Dry fry for crispness, wet fry for depth, boiled for purity, grilled for smoke.', storyLine: 'Pond-to-plate. The same fish that will be on tomorrow\'s menu — just cooked the traditional way.', price: 3500, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80', dietary: ['Seafood', 'GF'], allergens: ['Fish'], prepTime: 30, calories: 560, ingredients: ['Fresh Lake Fish', 'Local Seasoning'], servingSize: 'Full serving', options: ['Dry Fry', 'Wet Fry', 'Boiled', 'Grilled'] },
      { id: 'vk-t4', name: 'Duck (Traditional)', subtitle: 'Dry fry · wet fry · boiled · grilled', description: 'Farm duck cooked your way. The most full-flavoured bird on the farm, prepared the traditional way.', storyLine: 'The most full-flavoured bird on the farm. Cooked the way the recipe has always been done.', price: 7000, image: 'https://images.unsplash.com/photo-1559847844-d721426d6edc?w=800&q=80', dietary: ['High Protein', 'GF'], allergens: ['None'], prepTime: 55, calories: 880, ingredients: ['Farm Duck', 'Local Seasoning'], servingSize: 'Full serving', options: ['Dry Fry', 'Wet Fry', 'Boiled', 'Grilled'] },
      { id: 'vk-t5', name: 'Rabbit (Traditional)', subtitle: 'Dry fry · wet fry · grilled', description: 'Farm rabbit cooked the traditional way — lean, rich, and deeply tied to the land it came from.', storyLine: 'Field C rabbit, cooked the old way. Lean, rich, and deeply tied to the land it came from.', price: 5000, image: 'https://images.unsplash.com/photo-1582202685791-766b864a7810?w=800&q=80', dietary: ['High Protein', 'GF'], allergens: ['None'], prepTime: 45, calories: 600, ingredients: ['Farm Rabbit', 'Local Seasoning'], servingSize: 'Full serving', options: ['Dry Fry', 'Wet Fry', 'Grilled'] },
      { id: 'vk-t6', name: 'Matoke (1kg)', subtitle: 'Wet fry · dry fry · peanut-infused', description: 'Ubuntu matoke grown in the lower farm, cooked your way. The peanut version has been on the menu since the first week the kitchen opened.', storyLine: 'Ubuntu matoke — grown in the lower farm and cooked the way you want it.', price: 1000, image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=800&q=80', dietary: ['Vegan', 'GF'], allergens: ['None'], prepTime: 25, calories: 440, ingredients: ['Green Bananas', 'Onions', 'Tomatoes'], servingSize: '1kg', options: ['Wet Fry', 'Dry Fry', 'Peanut-Infused'] },
      { id: 'vk-t7', name: 'Githeri', subtitle: 'Maize & beans · wet fry or dry fry', description: 'Field D maize and farm beans, cooked together. Wet fry or dry fry. A complete protein in a single pot.', storyLine: 'Field D maize and farm beans, cooked together the way they always have been.', price: 1000, image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?w=800&q=80', dietary: ['Vegan', 'GF'], allergens: ['None'], prepTime: 20, calories: 380, ingredients: ['Maize', 'Beans', 'Onions', 'Tomatoes'], servingSize: 'Full serving', options: ['Wet Fry', 'Dry Fry'] },
      { id: 'vk-t8', name: 'Irish Potatoes', subtitle: 'Wet fry · dry fry · baked', description: 'From Field C. The wet fry carries them in tomato. The dry fry crisps them in spice. The baked keeps them honest.', storyLine: 'From Field C. Three ways to cook them. One honest result each time.', price: 1000, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&q=80', dietary: ['Vegan', 'GF'], allergens: ['None'], prepTime: 20, calories: 360, ingredients: ['Irish Potatoes', 'Onions', 'Tomatoes', 'Seasoning'], servingSize: 'Full serving', options: ['Wet Fry', 'Dry Fry', 'Baked'] },
    ],
  },
  {
    id: 'vk-platters', category: 'Platters Menu', emoji: '🍽️', color: '#D4A853',
    description: 'Perfect for sharing. Generous portions crafted for authentic Ubuntu moments.',
    items: [
      { id: 'vk-pl1', name: 'Dry Fry Platter (2 pax)', subtitle: 'Goat · chicken · ugali · fries · spinach', description: 'Dry fry mbuzi, Chicken, Ugali, Fries, Spinach and Kachumbari. A complete Ubuntu table for two.', storyLine: 'Two people, one platter, everything from the farm. The mbuzi and chicken share the same fire. The kachumbari arrives raw from the garden.', price: 3500, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80', chefPick: true, allergens: ['None'], prepTime: 45, calories: 1480, ingredients: ['Dry Fry Goat', 'Chicken', 'Ugali', 'Fries', 'Spinach', 'Kachumbari'], servingSize: '2 persons' },
      { id: 'vk-pl2', name: 'Family Feast Platter (4 pax)', subtitle: 'Wet fry beef · mutton · chicken · rice · chapati', description: 'Wet fry beef, Dry fry mutton, Creamed Spinach, Ugali, Roasted Potato, Grilled Chicken, Rice and Chapati. The Ubuntu table at its fullest.', storyLine: 'Eight dishes, four people, one shared understanding of what eating together means.', price: 4000, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', popular: true, chefPick: true, allergens: ['Gluten'], prepTime: 60, calories: 2800, ingredients: ['Wet Fry Beef', 'Dry Fry Mutton', 'Creamed Spinach', 'Ugali', 'Roasted Potato', 'Grilled Chicken', 'Rice', 'Chapati'], servingSize: '4 persons' },
      { id: 'vk-pl3', name: 'Ubuntu Special Platter (6 pax)', subtitle: 'Grilled fish · beef · goat · chicken · 7 sides', description: 'Grilled fish, Kachumbari, Wet fry beef, Dry fry goat, Vegetables, Rice, Ugali, Potato wedge, Matoke, Chapati and Chicken wet fry. For the gathering that deserves everything.', storyLine: 'The full expression of Ubuntu — every part of the farm on one table.', price: 7000, image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800&q=80', popular: true, allergens: ['Fish', 'Gluten'], prepTime: 75, calories: 4200, ingredients: ['Grilled Fish', 'Kachumbari', 'Wet Fry Beef', 'Dry Fry Goat', 'Vegetables', 'Rice', 'Ugali', 'Potato Wedge', 'Matoke', 'Chapati', 'Chicken Wet Fry'], servingSize: '6 persons' },
    ],
  },
  {
    id: 'vk-combos', category: "Chef's Specials", emoji: '⭐', color: '#A8F0D8',
    description: "Curated pairings designed by the kitchen team. Best value on the menu.",
    items: [
      { id: 'vk-c1', name: 'Ubuntu Classic Combo', subtitle: 'Plain burger · fries · soda', description: 'The crowd favourite — a well-made plain burger, a generous portion of crisp fries, and a cold soda. Simple, satisfying, classic.', storyLine: 'The everyday Ubuntu. Nothing complicated — just the three things that always work together.', price: 1200, image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&q=80', popular: true, allergens: ['Gluten'], prepTime: 15, calories: 820, ingredients: ['Plain Burger', 'Fries', 'Soda'], servingSize: '1 person' },
      { id: 'vk-c2', name: "Cheese Lover's Combo", subtitle: 'Cheese burger · fries · lemonade', description: 'For those who need the cheese. A double-patty cheese burger, golden fries, and a freshly pressed lemonade. Built for hunger.', storyLine: 'For the table that knows what it came for.', price: 1800, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80', chefPick: true, allergens: ['Gluten', 'Dairy'], prepTime: 18, calories: 1100, ingredients: ['Cheese Burger', 'Fries', 'Lemonade'], servingSize: '1 person' },
      { id: 'vk-c3', name: 'Tea Time Delight', subtitle: 'Cake slice · herbal tea', description: 'A moment to slow down. A generous slice of the kitchen cake paired with your choice of herbal infusion. Best taken in the afternoon.', storyLine: 'Freshly baked cake and a herbal infusion from the garden. The simplest things are often the most restorative.', price: 700, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80', dietary: ['Vegetarian'], allergens: ['Gluten', 'Dairy', 'Eggs'], prepTime: 5, calories: 480, ingredients: ['Cake Slice', 'Herbal Tea'], servingSize: '1 person' },
      { id: 'vk-c4', name: 'Light Lunch Plate', subtitle: 'Chicken salad · fresh juice', description: 'A composed chicken salad with seasonal greens, farm vegetables, and a light dressing, paired with freshly pressed juice of your choice.', storyLine: 'The midday choice of the team that runs this farm. Light enough to keep you moving.', price: 1200, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80', dietary: ['GF'], allergens: ['None'], prepTime: 10, calories: 480, ingredients: ['Chicken Salad', 'Fresh Seasonal Juice'], servingSize: '1 person' },
      { id: 'vk-c5', name: "Farmer's Snack Basket", subtitle: 'Bhajia · sausages · coleslaw', description: 'A sharing basket of crisp bhajia, grilled sausages, and a tangy house coleslaw. Perfect for the table to share before mains arrive.', storyLine: 'What the farm team takes to the field at midday. Carried, shared, eaten quickly.', price: 1000, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80', popular: true, allergens: ['Gluten'], prepTime: 15, calories: 720, ingredients: ['Bhajia', 'Sausages', 'Coleslaw'], servingSize: '1 person' },
    ],
  },
  {
    id: 'vk-pizza', category: 'Pizza Corner', emoji: '🍕', color: '#F0A8B8',
    description: 'Stone-baked in the Ubuntu oven. Farm-sourced toppings.',
    items: [
      { id: 'vk-pz1', name: 'Hawaiian Large Pizza', subtitle: 'Ham · pineapple · mozzarella', description: 'Large pizza topped with ham, pineapple, mozzarella cheese and tomato sauce. Stone-baked in the Ubuntu oven.', storyLine: 'Orchard pineapple, house-made tomato sauce from Field A, mozzarella — on a base fired in the Ubuntu stone oven.', price: 1400, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80', popular: true, allergens: ['Gluten', 'Dairy'], prepTime: 18, calories: 880, ingredients: ['Dough', 'Tomato Sauce', 'Mozzarella', 'Ham', 'Pineapple'], servingSize: 'Large (8 slices)' },
      { id: 'vk-pz2', name: 'Chicken Pizza (Medium)', subtitle: 'Tender chicken · mozzarella · tomato', description: 'Medium pizza topped with tender chicken, mozzarella, cheese and tomato sauce.', storyLine: 'Kienyeji chicken from the yard, shredded and seasoned, on a medium base.', price: 900, image: 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?w=800&q=80', allergens: ['Gluten', 'Dairy'], prepTime: 15, calories: 680, ingredients: ['Dough', 'Tomato Sauce', 'Chicken', 'Mozzarella', 'Cheese'], servingSize: 'Medium (6 slices)' },
      { id: 'vk-pz3', name: 'Chicken Pizza (Large)', subtitle: 'Tender chicken · large · stone-baked', description: 'Large pizza topped with tender chicken, mozzarella, cheese and tomato sauce. The same kienyeji chicken on our largest base.', storyLine: 'The same kienyeji chicken on our largest base — built for a table that arrived hungry.', price: 1400, image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800&q=80', allergens: ['Gluten', 'Dairy'], prepTime: 18, calories: 1020, ingredients: ['Dough', 'Tomato Sauce', 'Chicken', 'Mozzarella', 'Cheese'], servingSize: 'Large (8 slices)' },
    ],
  },
  {
    id: 'vk-drinks', category: 'Beverages', emoji: '🍵', color: '#A8D8F0',
    description: 'Grown on this farm. Sourced from the valley. Poured with care.',
    items: [
      // Herbal teas
      { id: 'vk-d-herb', name: 'Herbal Infusions', subtitle: 'Lemongrass · hibiscus · green · orange · lemon · dawaa', description: 'Single-herb infusions from plants grown in the Ubuntu herb garden. Lemongrass, Hibiscus, Green Tea, Orange Tea, Lemon Tea, or Dawaa.', storyLine: 'Every herb in this cup grew within the Ubuntu boundary. The lemongrass from the herb garden. The hibiscus from the Garden Fence.', price: 350, image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800&q=80', dietary: ['Vegan', 'GF'], popular: true, allergens: ['None'], prepTime: 6, calories: 5, ingredients: ['Choice of Fresh Herbs'], servingSize: '300ml', options: ['Lemongrass', 'Hibiscus', 'Green Tea', 'Orange Tea', 'Lemon Tea', 'Dawaa'] },
      // Hot beverages
      { id: 'vk-d-tea-black', name: 'Black Tea', subtitle: 'Farm-grade · clean and bright', description: 'Strong Kenyan black tea brewed dark. The foundation of every Ubuntu morning.', storyLine: 'The tea that opens every day in Kenya. Made properly — steeped to strength.', price: 150, image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&q=80', dietary: ['Vegan'], allergens: ['None'], prepTime: 4, calories: 5, ingredients: ['Black Tea Leaves', 'Hot Water'], servingSize: '300ml' },
      { id: 'vk-d-chai', name: 'African Tea (Chai)', subtitle: 'Spiced · milk-brewed · warming', description: 'Full-fat milk, crushed ginger, cardamom, and black tea simmered together until the flavours merge.', storyLine: 'The real thing. Made with dairy paddock milk, farm ginger, and cardamom.', price: 250, image: 'https://images.unsplash.com/photo-1565799557988-f86dd7dce2da?w=800&q=80', popular: true, allergens: ['Dairy'], prepTime: 5, calories: 90, ingredients: ['Black Tea', 'Masala Spices', 'Whole Milk'], servingSize: '300ml' },
      { id: 'vk-d-ginger', name: 'Ginger Tea', subtitle: 'Fresh ginger · warming · soothing', description: 'Fresh ginger steeped into a warming, spiced brew. Best taken in the morning air before the fields start.', storyLine: 'Herb garden ginger, sliced and steeped until the water carries the full heat of it.', price: 250, image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800&q=80', dietary: ['Vegan', 'GF'], allergens: ['None'], prepTime: 5, calories: 20, ingredients: ['Fresh Ginger', 'Hot Water', 'Honey'], servingSize: '300ml' },
      { id: 'vk-d-hotmilk', name: 'Hot Milk', subtitle: 'Fresh dairy paddock milk', description: 'Fresh dairy paddock milk, steamed and served hot. The way milk should be.', storyLine: 'Friesian dairy milk, same morning as it was collected.', price: 300, image: 'https://images.unsplash.com/photo-1559131397-f94da358f7ca?w=800&q=80', dietary: ['Vegetarian', 'GF'], allergens: ['Dairy'], prepTime: 3, calories: 150, ingredients: ['Fresh Whole Milk'], servingSize: '300ml' },
      { id: 'vk-d-coffee-black', name: 'Coffee', subtitle: 'Black or white · single-origin', description: 'Single-origin Kenyan beans from the Ubuntu roastery. Black or white. Kenyan coffee needs no assistance.', storyLine: 'Roasted in-house. Ground fresh. No milk unless you ask.', price: 250, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80', dietary: ['Vegan', 'GF'], allergens: ['None'], prepTime: 3, calories: 5, ingredients: ['Single-Origin Kenyan Coffee'], servingSize: '250ml', options: ['Black Coffee', 'White Coffee'] },
      { id: 'vk-d-cappuccino', name: 'Cappuccino', subtitle: 'Espresso · steamed milk · froth', description: 'Espresso topped with equal parts steamed milk and thick milk foam. A classic in the Ubuntu coffee bar.', price: 350, image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=800&q=80', dietary: ['Vegetarian'], allergens: ['Dairy'], prepTime: 4, calories: 110, ingredients: ['Espresso', 'Steamed Milk', 'Milk Foam'], servingSize: '200ml' },
      { id: 'vk-d-latte', name: 'Café Latte', subtitle: 'Espresso · smooth steamed milk', description: 'Espresso with a generous pour of steamed milk. Smooth, warm, and satisfying.', price: 400, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80', dietary: ['Vegetarian'], allergens: ['Dairy'], prepTime: 4, calories: 140, ingredients: ['Espresso', 'Steamed Milk'], servingSize: '350ml' },
      { id: 'vk-d-vlatte', name: 'Vanilla Latte', subtitle: 'Espresso · farm vanilla · steamed milk', description: 'Espresso with vanilla syrup and steamed dairy milk. A small luxury.', storyLine: 'Espresso from our own roastery, poured over steamed milk with a shot of house-made vanilla syrup.', price: 400, image: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=800&q=80', dietary: ['Vegetarian'], allergens: ['Dairy'], prepTime: 5, calories: 200, ingredients: ['Espresso', 'Vanilla Syrup', 'Steamed Milk'], servingSize: '350ml' },
      { id: 'vk-d-hotchoc', name: 'Hot Chocolate', subtitle: 'Rich cocoa · farm milk', description: 'Rich cocoa blended with steamed dairy paddock milk. Deep, warming, indulgent.', price: 350, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&q=80', dietary: ['Vegetarian'], allergens: ['Dairy'], prepTime: 5, calories: 220, ingredients: ['Cocoa Powder', 'Whole Milk', 'Sugar'], servingSize: '300ml' },
      // Cold beverages
      { id: 'vk-d-juice', name: 'Fresh Juice', subtitle: 'Pressed daily · seasonal fruits', description: 'Pure cold-pressed juice from whatever fruits are in season — mango, passion fruit, pineapple, orange, or a blend. No concentrate.', storyLine: 'Pressed from whatever is at its best in the orchard this morning. No concentrate. No sugar.', price: 400, image: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=800&q=80', dietary: ['Vegan', 'GF'], popular: true, allergens: ['None'], prepTime: 5, calories: 160, ingredients: ['Fresh Orchard Fruit'], servingSize: '350ml', options: ['Mango', 'Passion Fruit', 'Orange', 'Pineapple', 'Mixed'] },
      { id: 'vk-d-lemonade', name: 'Lemonade', subtitle: 'Classic or strawberry · freshly made', description: 'Freshly made with orchard lemons and apiary honey. Classic or strawberry.', storyLine: 'Orchard lemons. Apiary honey. The classic needs no explanation.', price: 400, image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800&q=80', dietary: ['Vegan', 'GF'], allergens: ['None'], prepTime: 5, calories: 120, ingredients: ['Fresh Lemon', 'Apiary Honey', 'Water'], servingSize: '350ml', options: ['Classic', 'Strawberry'] },
      { id: 'vk-d-soda', name: 'Soda', subtitle: 'Chilled · your choice', description: 'Chilled sodas in your choice of flavour. Ask your server for available options.', price: 200, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80', dietary: ['Vegan', 'GF'], allergens: ['None'], prepTime: 1, calories: 140, ingredients: ['Carbonated Soft Drink'], servingSize: '330ml', options: ['Coke', 'Fanta', 'Sprite', 'Stoney'] },
      { id: 'vk-d-water', name: 'Water', subtitle: 'Still · sparkling · borehole-sourced', description: 'Still or sparkling. Ubuntu borehole-sourced water — clean and pure.', price: 150, image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&q=80', dietary: ['Vegan', 'GF'], allergens: ['None'], prepTime: 1, calories: 0, ingredients: ['Pure Water'], servingSize: '500ml' },
      { id: 'vk-d-delmonte', name: 'Delmonte Juice', subtitle: 'Bottled · full litre', description: 'Bottled Delmonte juice in your choice of flavour. Full litre.', price: 800, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&q=80', dietary: ['Vegan', 'GF'], allergens: ['None'], prepTime: 1, calories: 180, ingredients: ['Delmonte Juice'], servingSize: '1 litre' },
      // Smoothies
      { id: 'vk-d-sm1', name: 'Mango Smoothie', subtitle: 'Pure mango bliss', description: 'Pure mango from the Ubuntu orchard, blended and served immediately. When the mango is this good, complexity would only get in the way.', price: 500, image: 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=800&q=80', dietary: ['Vegan', 'GF'], allergens: ['None'], prepTime: 4, calories: 200, ingredients: ['Pure Mango'], servingSize: '400ml' },
      { id: 'vk-d-sm2', name: 'Strawberry Smoothie', subtitle: 'Bright · fruity · fresh', description: 'Fresh strawberries blended with banana and a touch of honey. Bright, fruity, and deeply satisfying.', price: 500, image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&q=80', dietary: ['Vegan', 'GF'], allergens: ['None'], prepTime: 4, calories: 195, ingredients: ['Fresh Strawberries', 'Banana', 'Honey'], servingSize: '400ml' },
      { id: 'vk-d-sm3', name: 'Banana Smoothie', subtitle: 'Creamy · filling · farm banana', description: 'Farm bananas blended with milk and honey into a thick, creamy, filling smoothie.', price: 500, image: 'https://images.unsplash.com/photo-1635883500871-09d87f1f8b40?w=800&q=80', dietary: ['Vegetarian'], allergens: ['Dairy'], prepTime: 4, calories: 240, ingredients: ['Banana', 'Milk', 'Honey'], servingSize: '400ml' },
      { id: 'vk-d-sm4', name: 'Tropical Mix Smoothie', subtitle: 'Mango · pineapple · passion · orange', description: 'A tropical blend of mango, pineapple, passion fruit, and orange from the Ubuntu orchard.', price: 500, image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=800&q=80', dietary: ['Vegan', 'GF'], allergens: ['None'], prepTime: 5, calories: 220, ingredients: ['Mango', 'Pineapple', 'Passion Fruit', 'Orange'], servingSize: '400ml' },
      { id: 'vk-d-sm5', name: 'Passion Smoothie', subtitle: 'Tangy · tropical · vibrant', description: 'Fresh passion fruit blended with mango and a touch of honey. Tangy, tropical, vivid.', price: 500, image: 'https://images.unsplash.com/photo-1638176066747-d65e8bb4fbb9?w=800&q=80', dietary: ['Vegan', 'GF'], allergens: ['None'], prepTime: 4, calories: 185, ingredients: ['Passion Fruit', 'Mango', 'Honey'], servingSize: '400ml' },
      { id: 'vk-d-sm6', name: 'Avocado Smoothie', subtitle: 'Creamy · rich · satisfying', description: 'Farm avocado blended with milk and honey into a thick, creamy, deeply satisfying smoothie.', price: 500, image: 'https://images.unsplash.com/photo-1645864285949-b9a49fb29c3e?w=800&q=80', dietary: ['Vegetarian'], allergens: ['Dairy'], prepTime: 5, calories: 310, ingredients: ['Avocado', 'Milk', 'Honey'], servingSize: '400ml' },
      // Milkshakes
      { id: 'vk-d-ms1', name: 'Vanilla Milkshake', subtitle: 'Thick · real ice cream · farm milk', description: 'Thick-blend vanilla milkshake made with real ice cream and full-fat farm milk. Cold, indulgent, perfect.', price: 700, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&q=80', dietary: ['Vegetarian'], allergens: ['Dairy'], prepTime: 6, calories: 480, ingredients: ['Ice Cream', 'Full-Fat Milk', 'Vanilla'], servingSize: '400ml' },
      { id: 'vk-d-ms2', name: 'Chocolate Milkshake', subtitle: 'Rich cocoa · indulgent · cold', description: 'Rich chocolate milkshake blended from real cocoa ice cream and farm milk.', price: 700, image: 'https://images.unsplash.com/photo-1585262900234-06cc7f28d5a2?w=800&q=80', dietary: ['Vegetarian'], allergens: ['Dairy'], prepTime: 6, calories: 510, ingredients: ['Chocolate Ice Cream', 'Full-Fat Milk', 'Cocoa'], servingSize: '400ml' },
      { id: 'vk-d-ms3', name: 'Strawberry Milkshake', subtitle: 'Fruity · sweet · thick', description: 'Strawberry milkshake blended from fresh strawberry ice cream and full-fat farm milk.', price: 700, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80', dietary: ['Vegetarian'], allergens: ['Dairy'], prepTime: 6, calories: 470, ingredients: ['Strawberry Ice Cream', 'Full-Fat Milk'], servingSize: '400ml' },
      { id: 'vk-d-ms4', name: 'Oreo Milkshake', subtitle: 'Oreo cookies · vanilla · milk', description: 'Vanilla milkshake blended with crushed Oreo cookies. For the table that could not decide.', price: 700, image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=800&q=80', dietary: ['Vegetarian'], allergens: ['Dairy', 'Gluten'], prepTime: 6, calories: 560, ingredients: ['Vanilla Ice Cream', 'Oreo Cookies', 'Full-Fat Milk'], servingSize: '400ml' },
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────
// SIGNATURE MENU (original preserved)
// ─────────────────────────────────────────────────────────────────────
const MENU_ITEMS: MenuCategory[] = [
  { category: 'Starters', description: 'Begin with the land.', items: [
    { id: 'st-1', name: 'Boma Bone Broth', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=800', description: '12-hour simmered marrow broth.', storyLine: 'Twelve hours of patience distilled into a single cup — marrow drawn from the Boma herd, slow-extracted over hardwood coals until nothing but clarity remains.', price: 850, animal: 'UKV-047', field: 'Boma Unit 3', freshness: 98, phLevel: '6.4', temp: '82°C', offset: '1.2kg', dietary: ['High Protein'], ingredients: ['Beef Marrow', 'Leek', 'Thyme', 'Sea Salt'], availability: 'Available Today', pairing: 'Pairs with Smoked Whiskey', prepTime: 15, calories: 180, allergens: ['Bone'], servingSize: '300ml' },
    { id: 'st-2', name: 'Roasted Bone Marrow', image: 'https://images.unsplash.com/photo-1598511757337-fe2ae963376a?q=80&w=800', description: 'Butter-soft marrow with rock salt.', storyLine: 'Cut from the femur at dawn, slow-roasted until the marrow weeps into its own cavity.', price: 1500, animal: 'UKV-052', field: 'Herb Garden', freshness: 94, phLevel: '6.8', temp: '220°C', offset: '0.8kg', dietary: ['Keto'], ingredients: ['Marrow Bone', 'Rosemary', 'Fleur de Sel'], chefChoice: true, availability: 'Available Today', pairing: 'Pairs with The Ubuntu cocktail', prepTime: 25, calories: 420, allergens: ['Bone'], servingSize: '2 bones' },
    { id: 'st-3', name: 'Field B Kale Crisps', image: 'https://images.unsplash.com/photo-1621447508323-270a444d481d?q=80&w=800', description: 'Flash-fried kale with yeast flakes.', storyLine: 'Harvested at peak chlorophyll from Field B at first light, flash-fried in cold-pressed oil.', price: 600, field: 'Field B', freshness: 100, phLevel: '7.1', temp: '180°C', offset: '0.1kg', dietary: ['Vegan'], ingredients: ['Curly Kale', 'Nutritional Yeast', 'Olive Oil'], availability: 'Available Today', prepTime: 8, calories: 95, allergens: ['None'], servingSize: 'Sharing bowl' },
    { id: 'st-4', name: 'Smoked Beet Carpaccio', image: 'https://images.unsplash.com/photo-1592415499556-74fcb9f18667?q=80&w=800', description: 'Thinly sliced beets, goat cheese.', storyLine: 'Root cellar beets shaved paper-thin over cold-smoked walnut shards. Goat cheese aged seven days in the village cellar.', price: 950, field: 'Root Cellar', freshness: 97, phLevel: '5.5', temp: 'Cold Smoked', offset: '0.3kg', dietary: ['Vegetarian'], ingredients: ['Red Beets', 'Goat Cheese', 'Walnuts'], seasonal: true, availability: 'Only 6 Portions Left', availabilityCount: 6, pairing: 'Pairs with Cold Press Leaf', prepTime: 12, calories: 245, allergens: ['Dairy', 'Tree Nuts'], servingSize: '180g' },
    { id: 'st-5', name: 'Wild Mushroom Arancini', image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=800', description: 'Foraged mushrooms and truffle oil.', storyLine: 'Porcini foraged at the forest edge each morning, folded into arborio risotto and fried to a copper shell.', price: 1100, field: 'Forest Edge', freshness: 92, phLevel: '6.2', temp: 'Deep Fry', offset: '0.5kg', dietary: ['Vegetarian'], ingredients: ['Arborio Rice', 'Porcini', 'Truffle Oil'], chefChoice: true, availability: 'Available Today', pairing: 'Pairs with Golden Baobab cocktail', prepTime: 20, calories: 380, allergens: ['Gluten', 'Dairy'], servingSize: '3 pieces' },
  ]},
  { category: 'Signature Collection', description: 'Our most celebrated plates — each one a story of fire, land and time.', items: [
    { id: 'sig-1', name: 'Ember Tomahawk', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200', description: 'Dry-aged tomahawk over acacia coals.', storyLine: 'A 45-day dry-aged tomahawk from UKV heritage stock — seared directly on the acacia bed, rested under a rosemary smoke dome.', price: 7500, animal: 'UKV-091', field: 'Flame Pit', freshness: 96, phLevel: '6.3', temp: 'Acacia Char', offset: '3.8kg', dietary: ['Carnivore', 'Signature'], ingredients: ['Tomahawk Steak', 'Acacia Charcoal', 'Rosemary Smoke', 'Bone Marrow Butter'], signature: true, featured: true, chefChoice: true, availability: 'Only 2 Portions Left', availabilityCount: 2, pairing: 'Pairs with Smoked Tamarind Old Fashioned', prepTime: 55, calories: 1240, allergens: ['None'], servingSize: '1.2kg bone-in' },
    { id: 'sig-2', name: 'Firepit Oxtail', image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=1200', description: 'Slow braised with bone marrow glaze.', storyLine: 'Sixteen hours in the pit — oxtail braised in red wine, valley herbs and its own fat. Finished with a bone marrow glaze over hand-pounded cassava.', price: 3200, animal: 'UKV-034', field: 'Clay Pit', freshness: 94, phLevel: '6.0', temp: '90°C / 16hrs', offset: '2.2kg', dietary: ['Organic', 'Signature'], ingredients: ['Oxtail', 'Red Wine', 'Cassava', 'Bone Marrow', 'Valley Herbs'], signature: true, featured: true, availability: 'Harvest Today', pairing: 'Pairs with Golden Baobab cocktail', prepTime: 45, calories: 860, allergens: ['None'], servingSize: '400g' },
    { id: 'sig-3', name: 'Savannah Duck', image: 'https://images.unsplash.com/photo-1559847844-d721426d6edc?q=80&w=1200', description: 'Honey lacquered duck, tamarind reduction.', storyLine: 'Free-range duck from Aviary Unit 2, glazed five times with North Apiary honey. Tamarind reduction provides the counterpoint.', price: 3400, animal: 'UKV-AVR-2', field: 'Aviary Unit 2', freshness: 95, phLevel: '6.4', temp: 'High-Roast', offset: '1.6kg', dietary: ['Organic', 'Signature'], ingredients: ['Duck Breast', 'North Apiary Honey', 'Tamarind', 'Star Anise'], signature: true, chefChoice: true, availability: 'Available Today', pairing: 'Pairs with Golden Baobab cocktail', prepTime: 40, calories: 720, allergens: ['None'], servingSize: '280g' },
    { id: 'sig-4', name: 'Rift Valley Wagyu', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1200', description: 'Japanese-grade, African herb infusion.', storyLine: 'A5-grade Wagyu rested 72 hours in valley sage, black pepper and cold-pressed sunflower oil. Seared 90 seconds per side on 400°C iron.', price: 6500, animal: 'UKV-WAG-01', field: 'Upper Pasture', freshness: 99, phLevel: '6.6', temp: '400°C / 90s', offset: '2.9kg', dietary: ['Carnivore', 'Signature', 'Premium'], ingredients: ['Wagyu A5', 'Valley Sage', 'Black Pepper', 'Sunflower Oil'], signature: true, featured: true, availability: 'Only 1 Portion Left', availabilityCount: 1, pairing: 'Pairs with Smoked Whiskey', prepTime: 20, calories: 980, allergens: ['None'], servingSize: '220g' },
    { id: 'sig-5', name: 'Smoked Nile Perch', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=1200', description: 'Banana leaf smoked, citrus ash oil.', storyLine: 'Nile perch from Water Pond 1 wrapped in banana leaves, cold-smoked four hours over green wood. Finished with orange peel ash oil.', price: 2800, field: 'Water Pond 1', freshness: 100, phLevel: '7.2', temp: 'Cold Smoke 4hr', offset: '0.8kg', dietary: ['Seafood', 'GF'], ingredients: ['Nile Perch', 'Banana Leaf', 'Orange Ash Oil', 'Dill'], signature: true, chefChoice: true, availability: 'Available Today', pairing: 'Pairs with Garden Cold Brew', prepTime: 35, calories: 420, allergens: ['Fish'], servingSize: '300g' },
  ]},
  { category: 'Vegetation', description: 'The fields, plated.', items: [
    { id: 'veg-1', name: 'Heirloom Tomato Stack', image: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?q=80&w=800', description: 'Purple and gold heirloom tomatoes.', storyLine: 'Greenhouse-grown purples, golds and greens stacked with fresh basil oil and an aged balsamic.', price: 1100, field: 'Greenhouse A', freshness: 100, phLevel: '4.5', temp: 'Fresh', offset: '0.1kg', dietary: ['Vegan'], ingredients: ['Heirloom Tomato', 'Basil', 'Balsamic'], availability: 'Available Today', prepTime: 8, calories: 195, allergens: ['None'], servingSize: '250g' },
    { id: 'veg-3', name: 'Cauliflower Steak', image: 'https://images.unsplash.com/photo-1628751034128-4033b0068a73?q=80&w=800', description: 'Chimichurri brushed cauliflower.', storyLine: 'A full cross-section of Field B cauliflower, roasted whole and brushed with chimichurri from herbs within fifty metres.', price: 1400, field: 'Field B', freshness: 96, phLevel: '6.7', temp: 'Roasted', offset: '0.3kg', dietary: ['Keto'], ingredients: ['Cauliflower', 'Garlic', 'Parsley'], chefChoice: true, availability: 'Available Today', prepTime: 18, calories: 310, allergens: ['None'], servingSize: '1 steak' },
    { id: 'veg-6', name: 'Wild Herb Risotto', image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=1200', description: 'Slow-stirred with foraged herbs.', storyLine: 'Arborio stirred with vegetable stock, finished with whatever the garden edge offers this morning. No two servings are the same.', price: 1600, field: 'Forest Edge', freshness: 97, phLevel: '6.4', temp: 'Slow Stir', offset: '0.3kg', dietary: ['Vegetarian'], ingredients: ['Arborio Rice', 'Foraged Herbs', 'Butter', 'Stock'], chefChoice: true, availability: 'Available Today', prepTime: 28, calories: 540, allergens: ['Dairy'], servingSize: '320g' },
  ]},
  { category: 'The Apiary', description: 'Sweet endings from the hive and orchard.', items: [
    { id: 'ds-1', name: 'Honey Lavender Tart', image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?q=80&w=800', description: 'North Apiary honey and lavender.', storyLine: 'Raw honey from the North Apiary hives set into vanilla custard with lavender flowers from the herb garden.', price: 950, field: 'North Apiary', freshness: 100, phLevel: '3.9', temp: 'Chilled', offset: '0.2kg', dietary: ['Vegetarian'], ingredients: ['Raw Honey', 'Lavender', 'Pastry'], chefChoice: true, availability: 'Available Today', pairing: 'Pairs with Hibiscus Sorbet', prepTime: 5, calories: 320, allergens: ['Gluten', 'Dairy', 'Eggs'], servingSize: '120g' },
    { id: 'ds-6', name: 'Chocolate Soil', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=1200', description: 'Dark cocoa crumb, mousse, forest floor.', storyLine: 'A deconstructed forest floor — cocoa crumb soil, bitter mousse roots and micro herbs. Ten minutes to build, twenty seconds to destroy.', price: 1200, field: 'Bean Roastery', freshness: 95, phLevel: '5.6', temp: 'Room Temp', offset: '0.4kg', dietary: ['Vegetarian'], ingredients: ['Dark Cocoa', 'Mousse', 'Micro Herbs', 'Cocoa Butter'], featured: true, availability: 'Available Today', pairing: 'Pairs with Garden Cold Brew', prepTime: 6, calories: 490, allergens: ['Dairy', 'Eggs', 'Gluten'], servingSize: '160g' },
  ]},
  { category: 'Signature Drinks', description: 'Cultivated, distilled, poured.', items: [
    { id: 'dr-4', name: 'The Ubuntu', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1200', description: 'Hibiscus gin cocktail, signature.', storyLine: 'Hibiscus-infused gin shaken with lime, apiary honey syrup, and rosemary torched tableside. Our philosophy in a glass.', price: 1300, field: 'Garden Fence', freshness: 98, phLevel: '3.8', temp: 'Shaken Cold', offset: '0.3kg', dietary: ['Alcoholic', 'Signature'], ingredients: ['Hibiscus Gin', 'Lime', 'Apiary Honey Syrup', 'Rosemary'], signature: true, featured: true, chefChoice: true, availability: 'Available Today', prepTime: 4, allergens: ['None'], servingSize: '220ml' },
    { id: 'dr-6', name: 'Smoked Tamarind Old Fashioned', image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=1200', description: 'Bourbon, tamarind reduction, oak.', storyLine: 'Kenyan bourbon stirred with tamarind reduction and borehole ice. The smoke dome lifted at your table.', price: 1800, field: 'Barrel Room', freshness: 90, phLevel: '4.0', temp: 'Stirred Cold', offset: '0.6kg', dietary: ['Alcoholic'], ingredients: ['Bourbon', 'Tamarind', 'Demerara', 'Oak Smoke', 'Bitters'], chefChoice: true, availability: 'Available Today', pairing: 'Pairs with Rift Valley Wagyu', prepTime: 5, allergens: ['Gluten'], servingSize: '180ml' },
    { id: 'dr-5', name: 'Golden Baobab', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=1200', description: 'Baobab powder, turmeric, ginger fizz.', storyLine: 'Wild-harvested baobab dissolved into citrus with turmeric and sparkling water. A glass of the savannah itself.', price: 950, field: 'Wild Harvest', freshness: 100, phLevel: '4.2', temp: 'Chilled', offset: '0.2kg', dietary: ['Vegan', 'Non-Alcoholic'], ingredients: ['Baobab Powder', 'Turmeric', 'Ginger', 'Citrus', 'Sparkling Water'], availability: 'Available Today', prepTime: 4, allergens: ['None'], servingSize: '300ml' },
  ]},
]

const PAIRING_MAP: Record<string, string> = { 'sig-1': 'dr-6', 'sig-4': 'dr-6', 'sig-2': 'dr-5' }
const DIETARY_FILTERS = [
  { label: 'All', value: 'All' }, { label: 'Vegan', value: 'Vegan' },
  { label: 'Vegetarian', value: 'Vegetarian' }, { label: 'Keto / GF', value: 'Keto' },
  { label: 'Carnivore', value: 'Carnivore' }, { label: 'Non-Alcoholic', value: 'Non-Alcoholic' },
]

// ─────────────────────────────────────────────────────────────────────
// FEAST STORE (all original preserved + cart sync)
// ─────────────────────────────────────────────────────────────────────
interface FeastStore {
  staged: StagedItem[]; quantities: Record<string, number>
  activeOrder: ActiveOrder | null; showPayment: boolean; addingId: string | null
  stageItem: (item: MenuItem, category: string, qty?: number) => void
  removeStaged: (id: string) => void; updateStaged: (id: string, qty: number) => void; clearStaged: () => void
  setQty: (id: string, qty: number) => void; incrementQty: (id: string) => void; decrementQty: (id: string) => void; getQty: (id: string) => number
  setShowPayment: (v: boolean) => void; setActiveOrder: (o: ActiveOrder | null) => void; setAddingId: (id: string | null) => void
  stagedCount: () => number; stagedTotal: () => number
}
const useFeastStore = create<FeastStore>((set, get) => ({
  staged: [], quantities: {}, activeOrder: null, showPayment: false, addingId: null,
  stageItem: (item, category, qty = 1) => {
    set(s => {
      const existIdx = s.staged.findIndex(p => p.item.id === item.id)
      return { staged: existIdx >= 0 ? s.staged.map((p, i) => i === existIdx ? { ...p, qty: p.qty + qty } : p) : [...s.staged, { item, qty, category }] }
    })
    set({ addingId: item.id }); setTimeout(() => set({ addingId: null }), 1200)
  },
  removeStaged: (id) => set(s => ({ staged: s.staged.filter(p => p.item.id !== id) })),
  updateStaged: (id, qty) => { if (qty <= 0) { get().removeStaged(id); return } set(s => ({ staged: s.staged.map(p => p.item.id === id ? { ...p, qty } : p) })) },
  clearStaged: () => set({ staged: [] }),
  setQty: (id, qty) => set(s => ({ quantities: { ...s.quantities, [id]: Math.max(1, qty) } })),
  incrementQty: (id) => set(s => ({ quantities: { ...s.quantities, [id]: (s.quantities[id] || 1) + 1 } })),
  decrementQty: (id) => set(s => ({ quantities: { ...s.quantities, [id]: Math.max(1, (s.quantities[id] || 1) - 1) } })),
  getQty: (id) => get().quantities[id] || 1,
  setShowPayment: (v) => set({ showPayment: v }),
  setActiveOrder: (o) => set({ activeOrder: o }),
  setAddingId: (id) => set({ addingId: id }),
  stagedCount: () => get().staged.reduce((s, p) => s + p.qty, 0),
  stagedTotal: () => get().staged.reduce((s, p) => s + p.item.price * p.qty, 0),
}))

// ─────────────────────────────────────────────────────────────────────
// VK ITEM MODAL — fires for every Village Kitchen item
// Full-screen with tilt, zoom, options, related items, cart sync
// ─────────────────────────────────────────────────────────────────────
function VKModal({
  item, category, onClose, onAddRelated,
}: {
  item: VKItem; category: VKCategory
  onClose: () => void; onAddRelated: (item: VKItem) => void
}) {
  const { addItem, items: cartItems, openCart } = useCartStore()
  const [qty, setQty] = useState(1)
  const [selectedOption, setSelectedOption] = useState(item.options?.[0] || '')
  const [justAdded, setJustAdded] = useState(false)
  const [zoomed, setZoomed] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 })
  const [imgTilt, setImgTilt] = useState({ x: 0, y: 0 })
  const [imgHovered, setImgHovered] = useState(false)

  const isInCart = cartItems.some(ci => ci.id === item.id)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') { if (zoomed) setZoomed(false); else onClose() } }
    window.addEventListener('keydown', fn)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', fn) }
  }, [zoomed, onClose])

  const handleZoomMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomed) return
    const rect = e.currentTarget.getBoundingClientRect()
    setZoomPos({ x: ((e.clientX - rect.left) / rect.width - 0.5) * -50, y: ((e.clientY - rect.top) / rect.height - 0.5) * -50 })
  }, [zoomed])

  const handleImgTilt = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (zoomed) return
    const rect = e.currentTarget.getBoundingClientRect()
    setImgTilt({ x: ((e.clientY - rect.top) / rect.height - 0.5) * 6, y: ((e.clientX - rect.left) / rect.width - 0.5) * -6 })
  }, [zoomed])

  function handleAdd() {
    for (let i = 0; i < qty; i++) {
      addItem({ id: item.id, name: item.name + (selectedOption ? ` (${selectedOption})` : ''), price: item.price, tag: category.category, category: 'village-kitchen', unit: 'portion' })
    }
    setJustAdded(true); setTimeout(() => setJustAdded(false), 2000)
  }

  // Related: same category, excluding current
  const related = category.items.filter(i => i.id !== item.id).slice(0, 3)

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center" onClick={onClose} style={{ background: 'rgba(5,8,4,0.95)', backdropFilter: 'blur(20px)', padding: '20px' }}>
      <div
        className="relative w-full max-w-5xl h-full md:max-h-[90vh] flex flex-col md:flex-row overflow-hidden"
        style={{ background: 'rgba(10,12,8,0.99)', border: `1px solid ${category.color}28`, borderRadius: 20, boxShadow: `0 40px 120px rgba(0,0,0,0.9), 0 0 0 1px ${category.color}10`, animation: 'vkModalIn 0.35s cubic-bezier(0.16,1,0.3,1)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── LEFT: IMAGE ── */}
        <div
          className="relative md:w-[46%] h-[280px] md:h-full flex-shrink-0 overflow-hidden cursor-zoom-in"
          style={{ transform: imgHovered && !zoomed ? `perspective(700px) rotateX(${imgTilt.x}deg) rotateY(${imgTilt.y}deg)` : 'none', transition: 'transform 0.3s ease' }}
          onMouseMove={handleImgTilt}
          onMouseEnter={() => setImgHovered(true)}
          onMouseLeave={() => { setImgHovered(false); setImgTilt({ x: 0, y: 0 }) }}
          onClick={() => setZoomed(true)}
          onMouseMove={handleZoomMove}
        >
          <img
            src={item.image} alt={item.name}
            className="w-full h-full object-cover transition-transform duration-700"
            style={{ transform: imgHovered ? 'scale(1.06)' : 'scale(1)' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 55%, rgba(10,12,8,0.8) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,12,8,0.7) 0%, transparent 50%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at center, ${category.color}08, transparent 70%)`, opacity: imgHovered ? 1 : 0, transition: 'opacity 0.5s' }} />

          {/* Top accent */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${category.color}, transparent)` }} />

          {/* Corner marks */}
          {[['top-4 left-4','border-t border-l'],['top-4 right-4','border-t border-r'],['bottom-4 left-4','border-b border-l'],['bottom-4 right-4','border-b border-r']].map(([pos, bdr], i) => (
            <div key={i} className={`absolute w-6 h-6 pointer-events-none ${pos} ${bdr}`} style={{ borderColor: `${category.color}30` }} />
          ))}

          {item.chefPick && (
            <div className="absolute top-4 left-0 px-3 py-1" style={{ background: category.color, fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--obsidian)', fontWeight: 700 }}>
              Chef's Pick
            </div>
          )}
          {item.popular && !item.chefPick && (
            <div className="absolute top-4 left-4 px-3 py-1" style={{ background: `${category.color}18`, border: `1px solid ${category.color}35`, fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '0.15em', textTransform: 'uppercase', color: category.color, borderRadius: 20 }}>
              Popular
            </div>
          )}

          <div className="absolute bottom-4 left-5 right-5">
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: category.color, marginBottom: 4, opacity: 0.8 }}>
              {category.emoji} {category.category}
            </p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.15 }}>{item.name}</h2>
          </div>

          {/* Zoom hint */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity pointer-events-none" style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', background: 'rgba(0,0,0,0.5)', padding: '6px 12px', borderRadius: 8, backdropFilter: 'blur(8px)' }}>
            ⊕ Click to zoom
          </div>
        </div>

        {/* ── RIGHT: CONTENT ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-7 py-5 flex-shrink-0" style={{ borderBottom: `1px solid ${category.color}12` }}>
            <div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 3 }}>
                Ubuntu Kreative Village
              </p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 300, color: 'var(--cream)' }}>{item.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                style={{ padding: '8px 16px', border: `1px solid ${category.color}25`, borderRadius: 8, background: `${category.color}08`, fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: category.color, cursor: 'pointer', transition: 'all 0.2s' }}
              >
                ← Back to Menu
              </button>
              <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>✕</button>
            </div>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-7 py-5 space-y-5" style={{ scrollbarWidth: 'none' }}>
            {/* Price + subtitle */}
            <div className="flex items-baseline justify-between">
              <div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: 3 }}>{item.subtitle}</p>
                <div className="flex items-baseline gap-2">
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300, color: category.color }}>KES {item.price.toLocaleString()}</span>
                  {item.tag && <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', color: 'rgba(255,255,255,0.3)' }}>{item.tag}</span>}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 justify-end">
                {item.dietary?.map(d => (
                  <span key={d} style={{ padding: '3px 9px', borderRadius: 20, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'var(--font-body)', fontSize: '8px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{d}</span>
                ))}
              </div>
            </div>

            {/* Story line */}
            {item.storyLine && (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.85, fontStyle: 'italic', borderLeft: `2px solid ${category.color}30`, paddingLeft: 12 }}>
                "{item.storyLine}"
              </p>
            )}

            {/* Description */}
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.85 }}>{item.description}</p>

            {/* Meta grid */}
            <div className="grid grid-cols-2 gap-2">
              {[
                item.prepTime && ['Prep Time', `${item.prepTime} min`],
                item.calories && ['Calories', `${item.calories} kcal`],
                item.servingSize && ['Serving', item.servingSize],
                item.allergens && ['Allergens', item.allergens.join(', ')],
              ].filter(Boolean).map(([k, v]) => (
                <div key={k as string} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8 }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', marginBottom: 3 }}>{k}</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(255,255,255,0.65)' }}>{v}</p>
                </div>
              ))}
            </div>

            {/* Ingredients */}
            {item.ingredients && item.ingredients.length > 0 && (
              <div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', marginBottom: 10 }}>Ingredients</p>
                <div className="flex flex-wrap gap-2">
                  {item.ingredients.map(ing => (
                    <span key={ing} style={{ padding: '3px 10px', borderRadius: 20, background: `${category.color}08`, border: `1px solid ${category.color}18`, fontFamily: 'var(--font-body)', fontSize: '9px', color: category.color }}>{ing}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Options selector */}
            {item.options && item.options.length > 0 && (
              <div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', marginBottom: 10 }}>
                  {item.id.includes('vk-m') || item.id.includes('vk-t') ? 'Cooking Method' : 'Choose Option'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.options.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setSelectedOption(opt)}
                      style={{
                        padding: '7px 14px', borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s',
                        background: selectedOption === opt ? category.color : 'rgba(255,255,255,0.03)',
                        border: selectedOption === opt ? 'none' : `1px solid ${category.color}25`,
                        color: selectedOption === opt ? 'var(--obsidian)' : category.color,
                        fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: selectedOption === opt ? 700 : 400,
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Related items from same category */}
            {related.length > 0 && (
              <div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', marginBottom: 12 }}>
                  Others from {category.category}
                </p>
                <div className="flex flex-col gap-2">
                  {related.map(rel => (
                    <div
                      key={rel.id}
                      className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-white/5"
                      style={{ border: `1px solid ${category.color}10`, background: 'rgba(255,255,255,0.015)' }}
                      onClick={() => onAddRelated(rel)}
                    >
                      <img src={rel.image} alt={rel.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 300, color: 'var(--cream)', marginBottom: 1 }}>{rel.name}</p>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', color: 'rgba(255,255,255,0.3)' }}>{rel.subtitle}</p>
                      </div>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: category.color, flexShrink: 0 }}>KES {rel.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer CTA */}
          <div className="flex-shrink-0 px-7 pb-7 pt-5" style={{ borderTop: `1px solid ${category.color}12` }}>
            {/* Qty */}
            <div className="flex items-center gap-3 mb-4">
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>Qty</span>
              <div className="flex items-center" style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 32, height: 32, background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 16 }}>−</button>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: category.color, minWidth: 28, textAlign: 'center' }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{ width: 32, height: 32, background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 16 }}>+</button>
              </div>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginLeft: 4 }}>
                = KES {(item.price * qty).toLocaleString()}
              </span>
            </div>

            {/* CTA buttons */}
            {isInCart ? (
              <div className="flex gap-3">
                <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: `${category.color}10`, border: `1px solid ${category.color}25` }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', color: category.color, textTransform: 'uppercase', letterSpacing: '0.1em' }}>✓ Added to Cart</span>
                </div>
                <button onClick={openCart} style={{ padding: '12px 20px', background: `linear-gradient(135deg, ${category.color}, ${category.color}cc)`, border: 'none', borderRadius: 10, color: 'var(--obsidian)', fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer' }}>
                  View Cart →
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleAdd}
                  className="flex-1 py-3.5 font-bold text-[10px] uppercase tracking-widest transition-all duration-300 rounded-xl"
                  style={{
                    background: justAdded ? 'rgba(0,255,65,0.12)' : `linear-gradient(135deg, ${category.color}, ${category.color}cc)`,
                    border: justAdded ? '1px solid rgba(0,255,65,0.35)' : 'none',
                    color: justAdded ? 'var(--neon)' : 'var(--obsidian)',
                    fontFamily: 'var(--font-body)', cursor: 'pointer',
                  }}
                >
                  {justAdded ? `✓ ${qty > 1 ? `${qty}× ` : ''}Added to Cart` : `Add ${qty > 1 ? `${qty}× ` : ''}to Cart`}
                </button>
                <button onClick={openCart} style={{ padding: '12px 18px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}>
                  View Cart
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Global close */}
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer' }}>✕</button>
      </div>

      {/* Lightbox */}
      {zoomed && (
        <div className="fixed inset-0 z-[600] bg-black/98 flex items-center justify-center cursor-zoom-out overflow-hidden" onClick={() => setZoomed(false)} onMouseMove={handleZoomMove}>
          <div className="absolute top-6 left-1/2 -translate-x-1/2 font-mono text-[8px] text-white/20 uppercase tracking-widest z-10">Click to close · Esc to exit</div>
          <div className="relative w-full max-w-5xl aspect-[16/9] overflow-hidden">
            <div style={{ width: '100%', height: '100%', transform: `translate(${zoomPos.x}px, ${zoomPos.y}px) scale(1.5)`, transition: 'transform 0.08s ease-out' }}>
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-6 left-6 pointer-events-none" style={{ background: 'rgba(0,0,0,0.7)', padding: '8px 14px', borderRadius: 8 }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', color: category.color, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{item.name}</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--gold)' }}>KES {item.price.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      <style suppressHydrationWarning>{`
        @keyframes vkModalIn { from { opacity:0; transform:scale(0.96) translateY(16px) } to { opacity:1; transform:scale(1) translateY(0) } }
      `}</style>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// VK CARD — horizontal, warm, opens modal on click
// ─────────────────────────────────────────────────────────────────────
function VKCard({ item, catColor, onOpenModal }: { item: VKItem; catColor: string; onOpenModal: (item: VKItem) => void }) {
  const { items } = useCartStore()
  const [hovered, setHovered] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const inCart = items.some(i => i.id === item.id)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setTilt({ x: ((e.clientY - rect.top) / rect.height - 0.5) * 3, y: ((e.clientX - rect.left) / rect.width - 0.5) * -3 })
  }, [])

  return (
    <div
      style={{
        display: 'flex', gap: 0, overflow: 'hidden', cursor: 'pointer',
        background: inCart ? `${catColor}08` : hovered ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)',
        border: inCart ? `1px solid ${catColor}30` : hovered ? `1px solid ${catColor}22` : '1px solid rgba(255,255,255,0.06)',
        borderRadius: 10, transition: 'all 0.25s',
        transform: hovered ? `perspective(700px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-2px)` : 'none',
        boxShadow: hovered ? `0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px ${catColor}10` : '0 2px 8px rgba(0,0,0,0.12)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }) }}
      onMouseMove={handleMouseMove}
      onClick={() => onOpenModal(item)}
    >
      {/* Image */}
      <div style={{ position: 'relative', width: 96, minHeight: 96, flexShrink: 0, overflow: 'hidden' }}>
        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease', transform: hovered ? 'scale(1.1)' : 'scale(1)' }} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to right, transparent 50%, rgba(10,12,8,0.5) 100%)` }} />
        {item.chefPick && (
          <div style={{ position: 'absolute', top: 0, left: 0, padding: '3px 7px', background: catColor, fontFamily: 'var(--font-body)', fontSize: '7px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--obsidian)', fontWeight: 700 }}>Chef</div>
        )}
        {/* View overlay */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: hovered ? 1 : 0, transition: 'opacity 0.3s' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '7px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', background: 'rgba(0,0,0,0.6)', padding: '3px 7px', borderRadius: 6 }}>View</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ minWidth: 0 }}>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.2, marginBottom: 2 }}>{item.name}</h4>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', color: catColor, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.8 }}>{item.subtitle}</p>
          </div>
          {item.popular && !item.chefPick && (
            <span style={{ flexShrink: 0, padding: '2px 7px', borderRadius: 20, background: `${catColor}12`, border: `1px solid ${catColor}25`, fontFamily: 'var(--font-body)', fontSize: '7px', letterSpacing: '0.12em', textTransform: 'uppercase', color: catColor }}>Popular</span>
          )}
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
          {item.description}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 6 }}>
          <div>
            {item.tag && <span style={{ fontFamily: 'var(--font-body)', fontSize: '8px', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 1 }}>{item.tag}</span>}
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 300, color: catColor }}>KES {item.price.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {inCart && <span style={{ fontFamily: 'var(--font-body)', fontSize: '8px', color: 'var(--neon)', letterSpacing: '0.1em' }}>✓ In Cart</span>}
            <span style={{ padding: '5px 12px', borderRadius: 7, border: `1px solid ${catColor}30`, background: `${catColor}08`, fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase', color: catColor }}>View →</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// VILLAGE KITCHEN SECTION — tabs, grid, modal hookup
// ─────────────────────────────────────────────────────────────────────
function VillageKitchenSection() {
  const [activeCat, setActiveCat] = useState(VILLAGE_KITCHEN[0].id)
  const [modalItem, setModalItem] = useState<VKItem | null>(null)
  const { addItem } = useCartStore()

  const currentCat = VILLAGE_KITCHEN.find(c => c.id === activeCat) || VILLAGE_KITCHEN[0]

  function handleAddVKItem(item: VKItem) {
    if ('vibrate' in navigator) navigator.vibrate(10)
    addItem({ id: item.id, name: item.name, price: item.price, tag: currentCat.category, category: 'village-kitchen', unit: 'portion' })
  }

  return (
    <section id="village-kitchen" style={{ padding: '80px 0 40px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ padding: '0 40px 48px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <div style={{ width: 40, height: '1px', background: 'var(--gold)', opacity: 0.45 }} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>
            Daily Kitchen · Village Dining
          </span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4.5vw, 3.8rem)', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.05, marginBottom: 12 }}>
          The Village <em style={{ color: 'var(--gold)', fontStyle: 'normal' }}>Kitchen</em>
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.9, maxWidth: 520 }}>
          Warm, communal, and alive. Tap any dish to open the full menu card with options, story, ingredients and direct cart checkout.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ padding: '0 40px', maxWidth: 1400, margin: '0 auto', overflowX: 'auto', scrollbarWidth: 'none' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 36, flexWrap: 'nowrap', minWidth: 'max-content' }}>
          {VILLAGE_KITCHEN.map(cat => {
            const active = activeCat === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                style={{
                  padding: '8px 16px', borderRadius: 30, border: 'none', cursor: 'pointer',
                  background: active ? cat.color : 'rgba(255,255,255,0.04)',
                  color: active ? 'var(--obsidian)' : 'rgba(255,255,255,0.42)',
                  fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: active ? 700 : 400,
                  transition: 'all 0.22s',
                  boxShadow: active ? `0 4px 20px ${cat.color}35` : 'none',
                  flexShrink: 0,
                }}
              >
                {cat.emoji} {cat.category}
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ padding: '0 40px', maxWidth: 1400, margin: '0 auto' }}>
        {/* Category description bar */}
        <div style={{ marginBottom: 24, padding: '14px 20px', borderRadius: 10, background: `${currentCat.color}08`, border: `1px solid ${currentCat.color}18`, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{currentCat.emoji}</span>
          <div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, margin: 0 }}>{currentCat.description}</p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', color: currentCat.color, marginTop: 6, opacity: 0.7, letterSpacing: '0.08em' }}>
              Click any dish to see the full story, ingredients, options and add to cart.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
          {currentCat.items.map(item => (
            <VKCard key={item.id} item={item} catColor={currentCat.color} onOpenModal={setModalItem} />
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalItem && (
        <VKModal
          item={modalItem}
          category={currentCat}
          onClose={() => setModalItem(null)}
          onAddRelated={(rel) => setModalItem(rel)}
        />
      )}
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────
// SMALL DISPLAY COMPONENTS (all original preserved)
// ─────────────────────────────────────────────────────────────────────
function DishBadge({ item }: { item: MenuItem }) {
  if (item.signature) return <span className="px-2 py-0.5 bg-[var(--gold)]/15 border border-[var(--gold)]/40 text-[var(--gold)] text-[7px] uppercase tracking-widest font-mono">★ Signature</span>
  if (item.chefChoice) return <span className="px-2 py-0.5 bg-white/5 border border-white/20 text-white/60 text-[7px] uppercase tracking-widest font-mono">Chef&apos;s Choice</span>
  if (item.seasonal) return <span className="px-2 py-0.5 bg-[var(--neon)]/10 border border-[var(--neon)]/30 text-[var(--neon)] text-[7px] uppercase tracking-widest font-mono">Seasonal</span>
  return null
}
function AvailabilityBadge({ item }: { item: MenuItem }) {
  if (!item.availability) return null
  const isLow = typeof item.availabilityCount === 'number' && item.availabilityCount <= 3
  const isTomorrow = item.availability === 'Harvest Tomorrow'
  return <span className={`px-2 py-0.5 text-[7px] uppercase tracking-widest font-mono border ${isLow ? 'bg-red-500/10 border-red-500/30 text-red-400' : isTomorrow ? 'bg-white/5 border-white/10 text-white/30' : 'bg-[var(--neon)]/5 border-[var(--neon)]/20 text-[var(--neon)]/60'}`}>{item.availability}</span>
}
function DishImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [err, setErr] = useState(false)
  return <Image src={err ? 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800' : src} alt={alt} fill loading="lazy" className={className} onError={() => setErr(true)} />
}

// ─────────────────────────────────────────────────────────────────────
// AMBIENT EMBER PARTICLES (original preserved)
// ─────────────────────────────────────────────────────────────────────
function EmberParticles() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  const embers = Array.from({ length: 18 }, (_, i) => ({ id: i, left: `${8 + (i * 5.3) % 84}%`, delay: `${(i * 0.7) % 6}s`, duration: `${4 + (i * 0.4) % 5}s`, size: 2 + (i % 3) }))
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 3 }}>
      {embers.map(e => (
        <div key={e.id} style={{ position: 'absolute', bottom: '-8px', left: e.left, width: e.size, height: e.size, borderRadius: '50%', background: `radial-gradient(circle, #f0a030 0%, #e85d24 60%, transparent 100%)`, animation: `emberFloat ${e.duration} ${e.delay} ease-in infinite`, opacity: 0 }} />
      ))}
      <style suppressHydrationWarning>{`@keyframes emberFloat{0%{transform:translateY(0) translateX(0);opacity:0}10%{opacity:0.8}80%{opacity:0.35}100%{transform:translateY(-240px) translateX(20px);opacity:0}}`}</style>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// ORDER STATUS BAR (original preserved)
// ─────────────────────────────────────────────────────────────────────
function OrderStatusBar({ order }: { order: ActiveOrder }) {
  const [, setTick] = useState(0)
  useEffect(() => { const t = setInterval(() => setTick(p => p + 1), 1000); return () => clearInterval(t) }, [])
  const currentIdx = ORDER_STEPS.findIndex(s => s.key === order.status)
  const elapsed = Math.floor((Date.now() - order.placedAt) / 1000)
  return (
    <div className="bg-[#0a1a0a] border-y border-[var(--neon)]/20 py-4 sticky top-[80px] z-[40] backdrop-blur-md">
      <div className="max-w-8xl mx-auto px-6 md:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-[var(--neon)] rounded-full animate-pulse" />
            <span className="font-mono text-[10px] uppercase text-[var(--neon)] tracking-widest">Feast #{order.id}</span>
            <span className="font-mono text-[9px] text-white/30">· {Math.floor(elapsed/60)}m {String(elapsed%60).padStart(2,'0')}s elapsed</span>
          </div>
          {order.status === 'ready' && <span className="px-3 py-1 bg-[var(--gold)]/20 border border-[var(--gold)]/40 text-[var(--gold)] text-[8px] font-mono uppercase tracking-widest animate-pulse">★ Your table is ready</span>}
        </div>
        <div className="flex items-center gap-0 overflow-x-auto no-scrollbar">
          {ORDER_STEPS.map((step, i) => {
            const done = i < currentIdx; const active = i === currentIdx
            return (
              <div key={step.key} className="flex items-center flex-shrink-0">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-700 ${done ? 'bg-[var(--neon)] border-[var(--neon)]' : active ? 'bg-transparent border-[var(--neon)] shadow-[0_0_12px_rgba(0,255,65,0.5)]' : 'bg-transparent border-white/10'}`}>
                    {done ? <span className="text-black text-[8px] font-bold">✓</span> : active ? <div className="w-2 h-2 bg-[var(--neon)] rounded-full animate-ping" /> : <div className="w-1.5 h-1.5 bg-white/10 rounded-full" />}
                  </div>
                  <span className={`text-[7px] uppercase tracking-wide whitespace-nowrap ${active ? 'text-[var(--neon)] font-bold' : done ? 'text-white/40' : 'text-white/15'}`}>{step.label}</span>
                </div>
                {i < ORDER_STEPS.length - 1 && <div className={`w-8 md:w-16 h-px mx-1 flex-shrink-0 ${i < currentIdx ? 'bg-[var(--neon)]' : 'bg-white/10'}`} />}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// FLOATING FEAST ORB (original preserved)
// ─────────────────────────────────────────────────────────────────────
function FeastOrb() {
  const { staged, stagedCount, stagedTotal } = useFeastStore()
  const { openCart } = useCartStore()
  const [expanded, setExpanded] = useState(false)
  const [pulse, setPulse] = useState(false)
  const prevCount = useRef(0)
  const count = stagedCount(); const total = stagedTotal()
  useEffect(() => {
    if (count > prevCount.current) { setPulse(true); setTimeout(() => setPulse(false), 700) }
    prevCount.current = count
  }, [count])
  if (count === 0) return null
  return (
    <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 9980, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
      {expanded && (
        <div style={{ background: 'rgba(10,10,8,0.97)', border: '1px solid rgba(212,168,83,0.2)', borderRadius: 12, padding: '16px 18px', minWidth: 240, boxShadow: '0 20px 60px rgba(0,0,0,0.7)', animation: 'orbExpand 0.2s ease' }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: 10 }}>Feast Staged</div>
          {staged.slice(0, 4).map(s => (
            <div key={s.item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'rgba(255,255,255,0.55)', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.qty > 1 ? `×${s.qty} ` : ''}{s.item.name}</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'var(--gold)', marginLeft: 8 }}>KES {(s.item.price * s.qty).toLocaleString()}</span>
            </div>
          ))}
          {staged.length > 4 && <div style={{ fontFamily: 'var(--font-body)', fontSize: '9px', color: 'rgba(255,255,255,0.2)', marginBottom: 6 }}>+{staged.length - 4} more</div>}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10, marginTop: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Total</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--gold)' }}>KES {total.toLocaleString()}</span>
          </div>
          <button onClick={() => { openCart(); setExpanded(false) }} style={{ marginTop: 10, width: '100%', padding: '10px', background: 'linear-gradient(135deg, var(--gold), #b8913a)', border: 'none', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, color: 'var(--obsidian)', cursor: 'pointer' }}>
            View Cart & Pay →
          </button>
        </div>
      )}
      <button onMouseEnter={() => setExpanded(true)} onMouseLeave={() => setExpanded(false)} onClick={() => openCart()} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', background: 'linear-gradient(135deg, var(--gold) 0%, #b8913a 100%)', border: 'none', borderRadius: 50, boxShadow: pulse ? '0 0 0 8px rgba(212,168,83,0.15), 0 8px 32px rgba(212,168,83,0.45)' : '0 6px 28px rgba(212,168,83,0.32)', cursor: 'pointer', transition: 'box-shadow 0.3s, transform 0.2s', transform: pulse ? 'scale(1.05)' : expanded ? 'scale(1.02)' : 'scale(1)', animation: 'orbIn 0.3s ease' }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--obsidian)', fontWeight: 700 }}>🛒 {count} {count !== 1 ? 'Items' : 'Item'}</span>
        <span style={{ height: 14, width: 1, background: 'rgba(5,8,4,0.25)' }} />
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: 'var(--obsidian)', fontWeight: 600 }}>KES {total.toLocaleString()}</span>
      </button>
      <style suppressHydrationWarning>{`@keyframes orbIn{from{opacity:0;transform:translateY(8px) scale(0.95)}to{opacity:1;transform:translateY(0) scale(1)}}@keyframes orbExpand{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// LOG MODAL (original preserved, with back-to-menu button added)
// ─────────────────────────────────────────────────────────────────────
function LogModal({ item, onClose, onScrollToMenu }: { item: MenuItem; onClose: () => void; onScrollToMenu?: () => void }) {
  const { stageItem, getQty, incrementQty, decrementQty, stagedCount, addingId } = useFeastStore()
  const { addItem, openCart } = useCartStore()
  const [activeTab, setActiveTab] = useState<'story'|'specs'|'nutrition'|'provenance'>('story')
  const [zoomed, setZoomed] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 })
  const qty = getQty(item.id); const fCount = stagedCount()
  const isStaged = useFeastStore(s => s.staged.some(p => p.item.id === item.id))
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') { if (zoomed) setZoomed(false); else onClose() } }
    window.addEventListener('keydown', fn); document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', fn); document.body.style.overflow = '' }
  }, [zoomed, onClose])
  const handleZoomMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomed) return
    const rect = e.currentTarget.getBoundingClientRect()
    setZoomPos({ x: ((e.clientX - rect.left) / rect.width - 0.5) * -40, y: ((e.clientY - rect.top) / rect.height - 0.5) * -40 })
  }, [zoomed])
  const handleAddToFeast = useCallback(() => {
    stageItem(item, item.dietary[0] || 'Organic', qty)
    for (let i = 0; i < qty; i++) addItem({ id: item.id, name: item.name, price: item.price, tag: item.dietary?.[0] || 'Organic', category: 'restaurant', unit: 'portion' })
  }, [stageItem, addItem, item, qty])
  const tabs = [{ key: 'story' as const, label: 'Story' }, { key: 'specs' as const, label: 'Specs' }, { key: 'nutrition' as const, label: 'Nutrition' }, { key: 'provenance' as const, label: 'Provenance' }]
  return (
    <>
      <div className="fixed inset-0 z-[200] flex items-stretch md:items-center justify-center bg-black/97 backdrop-blur-3xl p-0 md:p-6">
        <div className="absolute inset-0" onClick={onClose} />
        <div className="relative w-full max-w-6xl h-full md:max-h-[92vh] flex flex-col md:flex-row bg-[#060606] border border-white/8 overflow-hidden shadow-[0_0_120px_rgba(0,0,0,0.9)]">
          <div className="relative md:w-[48%] h-[45vh] md:h-full flex-shrink-0 bg-black overflow-hidden group">
            <div className="relative w-full h-full cursor-zoom-in overflow-hidden" onClick={() => setZoomed(true)} onMouseMove={handleZoomMouseMove}>
              <DishImage src={item.image} alt={item.name} className="object-cover transition-transform duration-[2s] group-hover:scale-105 grayscale-[20%] group-hover:grayscale-0" />
              <div className="absolute inset-0 pointer-events-none opacity-[0.06]" style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.12) 2px,rgba(255,255,255,0.12) 4px)' }} />
              {['top-4 left-4 border-t-2 border-l-2','top-4 right-4 border-t-2 border-r-2','bottom-4 left-4 border-b-2 border-l-2','bottom-4 right-4 border-b-2 border-r-2'].map((c,i) => <div key={i} className={`absolute w-8 h-8 border-[var(--neon)]/40 pointer-events-none ${c}`} />)}
              <div className="absolute top-4 right-14 bg-black/60 px-2 py-1 text-[8px] text-neon font-mono uppercase tracking-widest border border-neon/20">{item.freshness}% FRESH</div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-gradient-to-t from-black to-transparent flex items-end justify-between pointer-events-none">
              <div><p className="font-display text-3xl text-[var(--gold)]">KES {item.price.toLocaleString()}</p>{item.servingSize && <p className="font-mono text-[8px] text-white/30 mt-0.5">{item.servingSize}</p>}</div>
              <span className="font-mono text-[8px] text-[var(--neon)]/40 uppercase">[{item.id}]</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-8 py-5 border-b border-white/5 flex-shrink-0">
              <div className="flex items-center gap-3">
                {/* Back to menu button */}
                <button
                  onClick={() => { onClose(); onScrollToMenu?.() }}
                  style={{ padding: '6px 14px', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, background: 'rgba(255,255,255,0.03)', fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', cursor: 'pointer' }}
                >
                  ← Back to Menu
                </button>
                <div className="flex flex-wrap gap-2"><DishBadge item={item} /><AvailabilityBadge item={item} /></div>
              </div>
              <div className="flex items-center gap-3">
                {fCount > 0 && <button onClick={() => { onClose(); openCart() }} className="relative inline-flex items-center gap-2 bg-[var(--gold)] text-black font-bold uppercase tracking-widest px-4 py-2 text-[8px]"><span className="w-4 h-4 rounded-full bg-black text-[var(--gold)] flex items-center justify-center text-[8px] font-black">{fCount}</span>View Feast</button>}
              </div>
            </div>
            <div className="px-8 pt-7 pb-4 flex-shrink-0">
              <h2 className="font-display text-3xl md:text-4xl text-white uppercase tracking-tight leading-[0.9] mb-3">{item.name}</h2>
              {item.pairing && <p className="font-mono text-[8px] text-[var(--gold)]/50 uppercase tracking-widest">◈ {item.pairing}</p>}
            </div>
            <div className="flex gap-0 border-b border-white/5 px-8 flex-shrink-0 overflow-x-auto no-scrollbar">
              {tabs.map(t => <button key={t.key} onClick={() => setActiveTab(t.key)} className={`pb-3 pr-6 text-[9px] uppercase tracking-widest whitespace-nowrap border-b-2 transition-all ${activeTab === t.key ? 'border-[var(--gold)] text-[var(--gold)]' : 'border-transparent text-white/25 hover:text-white/50'}`}>{t.label}</button>)}
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar px-8 py-6">
              {activeTab === 'story' && (
                <div className="space-y-6">
                  <p className="font-body text-sm text-white/50 italic leading-relaxed">&ldquo;{item.storyLine || item.description}&rdquo;</p>
                  <div><p className="text-[8px] uppercase tracking-widest text-white/20 mb-3">Ingredients</p><div className="flex flex-wrap gap-2">{item.ingredients.map(ing => <span key={ing} className="px-3 py-1 bg-white/[0.03] border border-white/5 text-[10px] text-white/50 font-body">{ing}</span>)}</div></div>
                  {item.allergens && item.allergens[0] !== 'None' && <div><p className="text-[8px] uppercase tracking-widest text-white/20 mb-3">Allergens</p><div className="flex flex-wrap gap-2">{item.allergens.map(a => <span key={a} className="px-2 py-1 bg-red-500/10 border border-red-500/20 text-[9px] text-red-400 uppercase tracking-wider">{a}</span>)}</div></div>}
                </div>
              )}
              {activeTab === 'specs' && (
                <div className="grid grid-cols-2 gap-3">
                  {[['Asset Source', item.field || item.animal || '—'],['Carbon Trace',`${item.offset} CO₂e`],['Temperature',item.temp],['Env. pH',item.phLevel],...(item.prepTime?[['Prep Time',`${item.prepTime} min`]]:[]),...(item.servingSize?[['Serving',item.servingSize]]:[])].map(([k,v]) => (
                    <div key={k} className="p-3 border border-white/5 bg-white/[0.02]"><p className="text-[7px] uppercase tracking-widest text-white/25 mb-1">{k}</p><p className="font-mono text-[11px] text-white/80 truncate">{v}</p></div>
                  ))}
                </div>
              )}
              {activeTab === 'nutrition' && (
                <div className="space-y-4">
                  {[['Calories',item.calories?`${item.calories} kcal`:'—'],['Serving',item.servingSize||'—'],['Dietary',item.dietary.join(', ')],['Freshness',`${item.freshness}%`]].map(([k,v]) => (
                    <div key={k} className="flex justify-between border-b border-white/5 pb-3"><span className="text-[9px] uppercase tracking-widest text-white/25">{k}</span><span className="font-mono text-[10px] text-white/70">{v}</span></div>
                  ))}
                  <div className="pt-2"><div className="flex justify-between mb-1"><span className="text-[8px] uppercase tracking-widest text-white/20">Freshness</span><span className="font-mono text-[9px] text-[var(--neon)]">{item.freshness}%</span></div><div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-[var(--neon)] to-emerald-400 transition-all duration-1000" style={{ width: `${item.freshness}%` }} /></div></div>
                </div>
              )}
              {activeTab === 'provenance' && (
                <div className="space-y-4">
                  {[['Harvest Plot',item.field],['Animal Tag',item.animal||'Botanical / No Tag'],['Harvest Time','Dawn — same day'],['Distance','< 2km from kitchen'],['Certification','Ubuntu Farm Organic Standard']].map(([k,v]) => (
                    <div key={k} className="flex justify-between border-b border-white/5 pb-3"><span className="text-[9px] uppercase tracking-widest text-white/25">{k}</span><span className="font-mono text-[10px] text-white/70 text-right max-w-[60%]">{v}</span></div>
                  ))}
                  <div className="p-4 border border-[var(--neon)]/10 bg-[var(--neon)]/[0.03]"><p className="font-mono text-[8px] text-[var(--neon)]/50 uppercase tracking-widest mb-1">Traceability Chain</p><p className="font-body text-[10px] text-white/30 italic leading-relaxed">Soil tested weekly · Animal welfare certified · No synthetic inputs · Carbon logged per batch</p></div>
                </div>
              )}
            </div>
            <div className="px-8 py-6 border-t border-white/5 bg-black flex-shrink-0">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-[8px] uppercase tracking-widest text-white/25">Quantity</span>
                <div className="flex items-center border border-white/10">
                  <button onClick={() => decrementQty(item.id)} className="w-9 h-9 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all border-r border-white/10">−</button>
                  <span className="w-10 text-center font-mono text-sm text-white/80">{qty}</span>
                  <button onClick={() => incrementQty(item.id)} className="w-9 h-9 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all border-l border-white/10">+</button>
                </div>
                <span className="font-display text-lg text-[var(--gold)] ml-auto">KES {(item.price * qty).toLocaleString()}</span>
              </div>
              <div className="flex gap-3">
                <button onClick={handleAddToFeast} className={`flex-1 py-4 font-bold text-[10px] uppercase tracking-[0.25em] transition-all duration-500 ${addingId === item.id ? 'bg-[var(--neon)] text-black scale-[0.98]' : isStaged ? 'bg-[var(--gold)]/20 border border-[var(--gold)]/50 text-[var(--gold)]' : 'bg-[var(--gold)] text-black hover:bg-cream'}`}>
                  {addingId === item.id ? '✓ Added to Feast' : isStaged ? `✓ Added — Add ${qty} More` : `Add ${qty > 1 ? `×${qty} ` : ''}to Feast`}
                </button>
                {fCount > 0 && <button onClick={() => { onClose(); openCart() }} className="relative inline-flex items-center gap-3 bg-[var(--gold)] text-black font-bold uppercase tracking-widest px-6 py-3 text-[9px]"><span className="w-5 h-5 rounded-full bg-black text-[var(--gold)] flex items-center justify-center text-[9px] font-black">{fCount}</span>View Feast</button>}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="absolute top-0 right-0 z-10 px-6 py-5 bg-white/[0.03] hover:bg-red-500/10 border-l border-b border-white/8 font-mono text-[9px] text-white/30 hover:text-white transition-all">✕</button>
        </div>
      </div>
      {zoomed && (
        <div className="fixed inset-0 z-[400] bg-black/98 flex items-center justify-center cursor-zoom-out overflow-hidden" onClick={() => setZoomed(false)}>
          <div className="relative w-full max-w-4xl aspect-[4/3] overflow-hidden">
            <div className="w-full h-full transition-transform duration-100 ease-out" style={{ transform: `translate(${zoomPos.x}px, ${zoomPos.y}px) scale(1.4)` }}>
              <Image src={item.image} alt={item.name} fill className="object-cover" sizes="100vw" />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────
// MENU CARD (original preserved + back-to-menu support)
// ─────────────────────────────────────────────────────────────────────
function MenuCard({ item, category, onOpenLog }: { item: MenuItem; category: string; onOpenLog: (item: MenuItem) => void }) {
  const { stageItem, getQty, incrementQty, decrementQty, addingId, staged } = useFeastStore()
  const { addItem } = useCartStore()
  const [hovered, setHovered] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const qty = getQty(item.id); const stagedQty = staged.find(p => p.item.id === item.id)?.qty ?? 0; const isStaged = stagedQty > 0
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setTilt({ x: ((e.clientY - rect.top) / rect.height - 0.5) * 4, y: ((e.clientX - rect.left) / rect.width - 0.5) * -4 })
  }, [])
  const handleAddToFeast = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); stageItem(item, category, qty)
    for (let i = 0; i < qty; i++) addItem({ id: item.id, name: item.name, price: item.price, tag: item.dietary?.[0] || 'Organic', category: 'restaurant', unit: 'portion' })
  }, [stageItem, addItem, item, category, qty])
  return (
    <div className="group flex flex-col h-full overflow-hidden" style={{ background: isStaged ? 'rgba(212,168,83,0.04)' : 'rgba(255,255,255,0.02)', border: isStaged ? '1px solid rgba(212,168,83,0.2)' : '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s', transform: hovered ? `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` : 'perspective(600px) rotateX(0) rotateY(0)', boxShadow: isStaged ? '0 0 0 1px rgba(212,168,83,0.1), 0 12px 40px rgba(212,168,83,0.06)' : hovered ? '0 20px 48px rgba(0,0,0,0.4)' : '0 4px 16px rgba(0,0,0,0.18)' }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }) }} onMouseMove={handleMouseMove}>
      <div className="relative aspect-[4/5] overflow-hidden cursor-pointer" onClick={() => onOpenLog(item)}>
        <DishImage src={item.image} alt={item.name} className="object-cover transition-all duration-[2s] group-hover:scale-110 grayscale-[40%] group-hover:grayscale-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-80" />
        <div className="absolute top-4 right-4 bg-black/60 px-2 py-1 text-[8px] text-neon font-mono uppercase tracking-widest border border-neon/20">{item.freshness}% FRESH</div>
        {isStaged && <div className="absolute inset-0 flex items-center justify-center bg-black/25 z-10"><span className="px-4 py-2 border border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)] font-mono text-[9px] uppercase tracking-widest">✓ In Feast ×{stagedQty}</span></div>}
        {item.featured && item.signature && <div className="absolute bottom-10 left-4 px-2 py-1 bg-black/70 border border-[var(--gold)]/20 text-[var(--gold)] font-mono text-[7px] uppercase tracking-widest">🔥 Chef&apos;s Pick Tonight</div>}
        <div className="absolute bottom-6 left-6 right-4"><div className="font-display text-2xl text-cream mb-1">KES {item.price.toLocaleString()}</div><div className="text-[9px] text-neon/60 tracking-widest uppercase font-mono">[{item.id}]</div></div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <span className="bg-black/60 border border-white/10 px-4 py-2 font-mono text-[8px] text-white/50 uppercase tracking-widest">View Full Log →</span>
        </div>
      </div>
      <div className="p-8 flex flex-col flex-1">
        <div className="flex flex-wrap gap-2 mb-3"><DishBadge item={item} /><AvailabilityBadge item={item} /></div>
        <h3 className="font-display text-2xl text-cream mb-2 group-hover:text-gold transition-colors uppercase tracking-tight">{item.name}</h3>
        <p className="font-body text-xs text-white/40 leading-relaxed mb-5 italic line-clamp-3">&ldquo;{item.storyLine || item.description}&rdquo;</p>
        {item.pairing && <p className="text-[8px] uppercase tracking-widest text-[var(--gold)]/40 mb-5 font-mono">◈ {item.pairing}</p>}
        <div className="grid grid-cols-2 border border-white/10 mb-6 bg-black/40">
          <div className="p-3 border-r border-white/10 text-center"><div className="text-[7px] uppercase text-white/30 mb-1">Asset Source</div><div className="text-[10px] text-white/80 font-mono truncate px-1">{item.field || item.animal}</div></div>
          <div className="p-3 text-center"><div className="text-[7px] uppercase text-white/30 mb-1">Carbon Trace</div><div className="text-[10px] text-neon">{item.offset}</div></div>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[8px] uppercase tracking-widest text-white/25">Qty</span>
          <button onClick={() => decrementQty(item.id)} className="w-6 h-6 border border-white/10 text-white/40 hover:text-white transition-all text-xs flex items-center justify-center">−</button>
          <span className="font-mono text-sm text-white/70 w-4 text-center">{qty}</span>
          <button onClick={() => incrementQty(item.id)} className="w-6 h-6 border border-white/10 text-white/40 hover:text-white transition-all text-xs flex items-center justify-center">+</button>
        </div>
        <div className="flex items-center gap-3 mt-auto">
          <button onClick={() => onOpenLog(item)} className="px-4 py-3 border border-white/10 text-[9px] uppercase tracking-widest text-white/40 hover:text-white hover:border-white/30 transition-colors flex-shrink-0">Log</button>
          <button onClick={handleAddToFeast} className={`flex-1 py-3 text-[9px] uppercase tracking-widest font-bold transition-all duration-500 ${addingId === item.id ? 'bg-neon text-black scale-95' : isStaged ? 'bg-[var(--gold)]/15 border border-[var(--gold)]/40 text-[var(--gold)]' : 'bg-gold text-black hover:bg-cream'}`}>
            {addingId === item.id ? '✓ Staged' : isStaged ? '✓ Added to Feast' : `Add ${qty > 1 ? `×${qty} ` : ''}to Feast`}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// SMART PAIRING CARD (original preserved)
// ─────────────────────────────────────────────────────────────────────
function SmartPairingCard({ onAdd }: { onAdd: (item: MenuItem, category: string) => void }) {
  const { staged } = useFeastStore()
  const [dismissed, setDismissed] = useState<string[]>([])
  const suggestion = useMemo(() => {
    for (const s of staged) {
      const pairId = PAIRING_MAP[s.item.id]
      if (!pairId || dismissed.includes(pairId)) continue
      if (staged.find(x => x.item.id === pairId)) continue
      const pair = MENU_ITEMS.flatMap(c => c.items).find(i => i.id === pairId)
      if (pair) return { trigger: s.item, pair }
    }
    return null
  }, [staged, dismissed])
  if (!suggestion) return null
  const { trigger, pair } = suggestion
  return (
    <div style={{ position: 'fixed', bottom: 100, left: 28, zIndex: 9970, background: 'rgba(10,10,8,0.97)', border: '1px solid rgba(212,168,83,0.18)', borderRadius: 12, padding: '14px 16px', maxWidth: 280, boxShadow: '0 16px 48px rgba(0,0,0,0.6)', animation: 'orbIn 0.3s ease' }}>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>◈ Chef Pairing Suggestion</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: 10, lineHeight: 1.65 }}>Your <span style={{ color: 'rgba(255,255,255,0.7)' }}>{trigger.name}</span> pairs beautifully with:</div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
        <div style={{ position: 'relative', width: 48, height: 48, borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}><Image src={pair.image} alt={pair.name} fill className="object-cover" /></div>
        <div><div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--cream)', marginBottom: 2 }}>{pair.name}</div><div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: 'var(--gold)' }}>KES {pair.price.toLocaleString()}</div></div>
      </div>
      <div style={{ display: 'flex', gap: 7 }}>
        <button onClick={() => { onAdd(pair, pair.dietary[0] || 'Organic'); setDismissed(d => [...d, pair.id]) }} style={{ flex: 1, padding: '7px', background: 'var(--gold)', border: 'none', borderRadius: 7, fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, color: 'var(--obsidian)', cursor: 'pointer' }}>Add to Feast</button>
        <button onClick={() => setDismissed(d => [...d, pair.id])} style={{ padding: '7px 10px', background: 'none', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, fontFamily: 'var(--font-body)', fontSize: '9px', color: 'rgba(255,255,255,0.28)', cursor: 'pointer' }}>✕</button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────
export default function RestaurantPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeDietary,  setActiveDietary]  = useState('All')
  const [searchQuery,    setSearchQuery]     = useState('')
  const [sortBy,         setSortBy]          = useState('default')
  const [logItem,        setLogItem]         = useState<MenuItem | null>(null)

  const { staged, stagedCount, stagedTotal, stageItem, activeOrder } = useFeastStore()
  const { openCart, addItem } = useCartStore()
  const allCategories = ['All', ...MENU_ITEMS.map(c => c.category)]
  const count = stagedCount(); const total = stagedTotal()

  const filteredMenu = useMemo(() => {
    return MENU_ITEMS.map(group => {
      let items = group.items.filter(item => {
        const catMatch    = activeCategory === 'All' || group.category === activeCategory
        const dietMatch   = activeDietary  === 'All' || item.dietary.some(d => d.toLowerCase().includes(activeDietary.toLowerCase()))
        const searchMatch = !searchQuery   || item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase())
        return catMatch && dietMatch && searchMatch
      })
      if (sortBy === 'price-asc')  items = [...items].sort((a, b) => a.price - b.price)
      if (sortBy === 'price-desc') items = [...items].sort((a, b) => b.price - a.price)
      if (sortBy === 'freshness')  items = [...items].sort((a, b) => b.freshness - a.freshness)
      return { ...group, items }
    }).filter(g => g.items.length > 0)
  }, [activeCategory, activeDietary, searchQuery, sortBy])

  const handleStageAndSync = useCallback((item: MenuItem, category: string, qty = 1) => {
    stageItem(item, category, qty)
    for (let i = 0; i < qty; i++) addItem({ id: item.id, name: item.name, price: item.price, tag: item.dietary?.[0] || 'Organic', category: 'restaurant', unit: 'portion' })
  }, [stageItem, addItem])

  const scrollToSignature = useCallback(() => {
    document.getElementById('signature-menu')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <main style={{ background: 'var(--obsidian)', minHeight: '100vh' }}>
      <Nav />

      {/* ── HERO — FIX: paddingTop accounts for Nav height (~80px) ── */}
      <section
        className="relative w-full flex items-center overflow-hidden"
        style={{
          minHeight: '100vh',
          paddingTop: '80px',   // NAV FIX — hero content starts below nav
        }}
      >
        {/* Background video */}
        <div className="absolute inset-0 z-0">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover" poster="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop">
            <source src="https://v1.mixkit.co/videos/preview/mixkit-chef-preparing-a-dish-in-a-professional-kitchen-41481-large.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-black/40" />
          {/* Firelight flicker */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 40% at 30% 70%, rgba(232,93,36,0.08), transparent 60%)', animation: 'firelightFlicker 3s ease-in-out infinite' }} />
        </div>

        <EmberParticles />

        <div className="relative z-10 w-full max-w-8xl mx-auto px-6 md:px-10 py-24">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-12 h-[1px] bg-neon" />
            <span className="font-body text-[9px] tracking-[0.5em] uppercase text-neon">Ubuntu · Living Farm Restaurant</span>
          </div>

          <h1 className="font-display leading-[0.85] text-cream uppercase mb-6 drop-shadow-2xl" style={{ fontSize: 'clamp(3rem, 10vw, 8rem)', fontWeight: 300 }}>
            Fire. Smoke.<br />
            <span className="text-gold" style={{ fontStyle: 'normal' }}>Harvest.</span>{' '}
            <span style={{ color: 'rgba(255,255,255,0.85)' }}>Feast.</span>
          </h1>

          <p className="font-display font-light text-white/55 lowercase tracking-tight max-w-xl mb-2" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)' }}>
            A living farm restaurant where every meal begins in the soil
          </p>
          <p className="font-display font-light italic text-white/30 tracking-tight max-w-lg mb-10" style={{ fontSize: 'clamp(0.9rem, 2vw, 1.2rem)' }}>
            and ends beneath the Rift Valley sky.
          </p>

          <p className="font-body text-white/40 mb-10" style={{ fontSize: '13px', lineHeight: 1.7, maxWidth: 380 }}>
            {MENU_ITEMS.reduce((s, c) => s + c.items.length, 0)} signature assets + {VILLAGE_KITCHEN.reduce((s, c) => s + c.items.length, 0)} village kitchen items. Click any dish to open the full menu card.
          </p>

          {/* Layer switcher */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
            <button
              onClick={() => document.getElementById('signature-menu')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ padding: '14px 28px', borderRadius: 9, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, var(--gold), #b8913a)', fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, color: 'var(--obsidian)', boxShadow: '0 4px 20px rgba(212,168,83,0.3)', transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px) scale(1.02)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'none' }}
            >
              ★ The Signature Experience
            </button>
            <button
              onClick={() => document.getElementById('village-kitchen')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ padding: '14px 28px', borderRadius: 9, cursor: 'pointer', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.14)', fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', transition: 'all 0.2s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = 'rgba(168,240,216,0.4)'; el.style.color = '#A8F0D8' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = 'rgba(255,255,255,0.14)'; el.style.color = 'rgba(255,255,255,0.65)' }}
            >
              🌿 Village Kitchen
            </button>
            {count > 0 && (
              <button onClick={() => openCart()} style={{ padding: '14px 20px', borderRadius: 9, border: 'none', cursor: 'pointer', background: 'rgba(212,168,83,0.15)', color: 'var(--gold)', fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700 }}>
                🛒 {count} in Feast · KES {total.toLocaleString()}
              </button>
            )}
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none opacity-30" style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,65,0.05) 2px,rgba(0,255,65,0.05) 4px)' }} />
        <style suppressHydrationWarning>{`@keyframes firelightFlicker{0%,100%{opacity:0.6}50%{opacity:1}}`}</style>
      </section>

      {/* ── ORDER TRACKER ── */}
      {activeOrder && <OrderStatusBar order={activeOrder} />}

      {/* ── VILLAGE KITCHEN ── */}
      <VillageKitchenSection />

      {/* ── DIVIDER ── */}
      <div id="signature-menu" style={{ padding: '60px 40px 0', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 60, height: 1, background: 'rgba(212,168,83,0.25)' }} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(212,168,83,0.5)' }}>The Signature Experience</span>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', display: 'inline-block', opacity: 0.7 }} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)' }}>Chef-driven · Provenance-tracked · Cinematic</span>
          <div style={{ width: 60, height: 1, background: 'rgba(212,168,83,0.25)' }} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 3.4rem)', fontWeight: 300, color: 'var(--cream)', marginTop: 16, marginBottom: 8 }}>
          Fire, land and <em style={{ color: 'var(--gold)', fontStyle: 'normal' }}>time.</em>
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.32)', maxWidth: 460, margin: '0 auto 0', lineHeight: 1.9 }}>
          Click any card for the full provenance log — animal, field, temperature, carbon trace.
        </p>
      </div>

      {/* ── STICKY FILTER BAR ── */}
      <div className={`sticky ${activeOrder ? 'top-[152px]' : 'top-[80px]'} z-30 bg-obsidian/90 backdrop-blur-3xl border-y border-white/5`}>
        <div className="max-w-8xl mx-auto px-6 md:px-10 pt-5 pb-0 flex gap-8 md:gap-10 items-center overflow-x-auto no-scrollbar">
          {allCategories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`font-body text-[11px] tracking-[0.35em] uppercase transition-all whitespace-nowrap pb-4 border-b-2 ${activeCategory === cat ? 'text-neon border-neon' : 'text-white/30 border-transparent hover:text-white/60'}`}>{cat}</button>
          ))}
        </div>
        <div className="max-w-8xl mx-auto px-6 md:px-10 py-3 flex flex-wrap gap-3 items-center justify-between border-t border-white/5">
          <div className="flex items-center gap-2 border border-white/10 bg-white/[0.02] px-4 py-2 flex-1 max-w-xs">
            <span className="text-white/20 text-sm">⌕</span>
            <input type="text" placeholder="Search dishes, ingredients..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-transparent text-white/70 text-[10px] uppercase tracking-wider placeholder:text-white/20 w-full outline-none font-mono" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {DIETARY_FILTERS.map(f => (
              <button key={f.value} onClick={() => setActiveDietary(f.value)} className={`px-3 py-1.5 text-[8px] uppercase tracking-widest border transition-all ${activeDietary === f.value ? 'border-[var(--neon)]/40 text-[var(--neon)] bg-[var(--neon)]/5' : 'border-white/10 text-white/30 hover:border-white/20'}`}>{f.label}</button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-[#0d0d0d] text-white/40 text-[9px] uppercase tracking-widest border border-white/10 px-3 py-2 outline-none cursor-pointer">
              <option value="default">Sort: Default</option>
              <option value="featured">Featured</option>
              <option value="price-asc">Price ↑</option>
              <option value="price-desc">Price ↓</option>
              <option value="freshness">Freshness</option>
            </select>
            {count > 0 && <button onClick={() => openCart()} className="relative inline-flex items-center gap-2 bg-[var(--gold)] text-black font-bold uppercase tracking-widest px-4 py-2 text-[8px]"><span className="w-4 h-4 rounded-full bg-black text-[var(--gold)] flex items-center justify-center text-[8px] font-black">{count}</span>View Feast</button>}
          </div>
        </div>
      </div>

      {/* ── STAGED BAR ── */}
      {count > 0 && (
        <div className={`sticky ${activeOrder ? 'top-[238px]' : 'top-[167px]'} z-20 bg-[#0a0a00] border-b border-[var(--gold)]/20 py-3`}>
          <div className="max-w-8xl mx-auto px-6 md:px-10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[var(--gold)] rounded-full animate-pulse" />
              <span className="font-mono text-[9px] uppercase text-[var(--gold)]/70 tracking-widest">{count} item{count !== 1 ? 's' : ''} in your feast</span>
              <span className="font-mono text-[9px] text-white/30">· KES {total.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => useFeastStore.getState().clearStaged()} className="font-mono text-[8px] uppercase tracking-widest text-white/20 hover:text-red-400 transition-colors">Clear</button>
              <button onClick={() => openCart()} className="px-6 py-2 bg-[var(--gold)] text-black font-bold text-[9px] uppercase tracking-widest hover:bg-cream transition-all">Place Order →</button>
            </div>
          </div>
        </div>
      )}

      {/* ── SIGNATURE MENU GRID ── */}
      <section className="px-6 md:px-10 py-24 bg-[#050505]">
        <div className="max-w-8xl mx-auto">
          {filteredMenu.length === 0 && (
            <div className="py-32 text-center">
              <p className="font-display text-4xl text-white/10 mb-4">Nothing found in the harvest</p>
              <button onClick={() => { setActiveCategory('All'); setActiveDietary('All'); setSearchQuery('') }} className="text-[10px] uppercase tracking-widest text-[var(--neon)]/50 hover:text-[var(--neon)] transition-colors">Clear all filters →</button>
            </div>
          )}
          {filteredMenu.map(group => (
            <div key={group.category} className="mb-32">
              <div className="flex items-center gap-6 mb-4">
                <h2 className="font-display text-lg tracking-[0.6em] uppercase text-white/10">{group.category}</h2>
                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                <span className="font-mono text-[8px] text-white/15 uppercase tracking-widest">{group.items.length} items</span>
              </div>
              {group.description && <p className="font-body text-xs text-white/20 italic mb-12 tracking-wide">{group.description}</p>}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {group.items.map(item => <MenuCard key={item.id} item={item} category={group.category} onOpenLog={setLogItem} />)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="text-center py-32 border-t border-white/5">
        <p className="font-display italic mb-8 text-white/50 text-2xl md:text-3xl max-w-3xl mx-auto px-6">
          &ldquo;The menu changes with the farm. Moxie always knows what is fresh today.&rdquo;
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <button onClick={() => count > 0 ? openCart() : undefined} className="btn-gold px-12 py-5 text-[11px] tracking-[0.3em]">
            {count > 0 ? `Place Order (${count} item${count !== 1 ? 's' : ''})` : 'Reserve a Table'}
          </button>
          <button className="btn-neon px-12 py-5 text-[11px] tracking-[0.3em] bg-transparent border border-neon/50 text-neon">Ask Moxie</button>
        </div>
      </section>

      {/* ── LOG MODAL (signature menu) ── */}
      {logItem && (
        <LogModal
          item={logItem}
          onClose={() => setLogItem(null)}
          onScrollToMenu={scrollToSignature}
        />
      )}

      <FeastOrb />
      <SmartPairingCard onAdd={(item, cat) => handleStageAndSync(item, cat, 1)} />
      <Footer />
      <MoxieChat />
    </main>
  )
}