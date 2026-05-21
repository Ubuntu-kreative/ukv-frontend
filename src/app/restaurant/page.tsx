"use client"

import { useMemo, useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import MoxieChat from '@/components/MoxieChat'
import { useCartStore } from '@/context/cartStore'
import { create } from 'zustand'

// ─────────────────────────────────────────────────────────────────────
// TYPES (unchanged)
// ─────────────────────────────────────────────────────────────────────
export interface MenuItem {
  id: string
  name: string
  image: string
  description: string
  storyLine?: string
  price: number
  animal?: string
  field: string
  freshness: number
  phLevel: string
  temp: string
  offset: string
  dietary: string[]
  ingredients: string[]
  featured?: boolean
  chefChoice?: boolean
  seasonal?: boolean
  signature?: boolean
  availability?: string
  availabilityCount?: number
  pairing?: string
  prepTime?: number
  calories?: number
  allergens?: string[]
  servingSize?: string
  trendScore?: number
  co2Score?: 'low' | 'medium' | 'high'
  customisable?: boolean
}

export interface MenuCategory {
  category: string
  description?: string
  items: MenuItem[]
}

export type OrderStatus =
  | 'awaiting_payment'
  | 'confirmed'
  | 'sourcing'
  | 'preparing'
  | 'plating'
  | 'ready'
  | 'served'

export interface ActiveOrder {
  id: string
  status: OrderStatus
  placedAt: number
  items: { name: string; qty: number; price: number }[]
  total: number
  tableNote?: string
}

interface StagedItem {
  item: MenuItem
  qty: number
  category: string
  notes?: string
  cookingPref?: string
}

const ORDER_STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'confirmed',  label: 'Order Confirmed' },
  { key: 'sourcing',   label: 'Sourcing Assets'  },
  { key: 'preparing',  label: 'Preparing'        },
  { key: 'plating',    label: 'Plating'          },
  { key: 'ready',      label: 'Ready to Serve'   },
  { key: 'served',     label: 'Served'           },
]

// ─────────────────────────────────────────────────────────────────────
// MENU DATA (100% unchanged)
// ─────────────────────────────────────────────────────────────────────
const MENU_ITEMS: MenuCategory[] = [
  {
    category: 'Breakfast',
    description: 'Rise with the farm. Morning meals built from what was gathered at dawn.',
    items: [
      {
        id: 'bk-1',
        name: 'The Classic Eco Lodge Delight',
        image: '/images/The-Classic-Eco-Lodge-Delight.jpeg',
        description: 'Sweet potatoes, pancakes, sausages and boiled eggs.',
        storyLine: 'The village wakes before you do. By the time this plate reaches your table, the sweet potatoes have come from Field C and the eggs collected from the morning count. Served with coffee, hot milk, black tea or freshly squeezed juice.',
        price: 1500,
        field: 'Farm Kitchen',
        freshness: 99,
        phLevel: '6.8',
        temp: 'Warm',
        offset: '0.6kg',
        dietary: ['High Protein'],
        ingredients: ['Sweet Potatoes', 'Pancakes', 'Grilled Sausages', 'Boiled Eggs'],
        chefChoice: true,
        availability: 'Available Today',
        pairing: 'Pairs with African Tea or Fresh Juice',
        prepTime: 20,
        calories: 720,
        allergens: ['Gluten', 'Eggs', 'Dairy'],
        servingSize: 'Full plate + drink',
        trendScore: 88,
        co2Score: 'low',
      },
      {
        id: 'bk-2',
        name: 'The English Farm Breakfast',
        image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=800',
        description: 'Sausages, omelettes, bacon, beans and fruit cuts.',
        storyLine: 'A full plate of farm-raised proteins and garden vegetables. Sausage, omelette or sunny-side egg, streaky bacon, baked beans and seasonal fruits. Choose African tea, coffee, juice or hot milk.',
        price: 2200,
        field: 'Farm Kitchen',
        freshness: 98,
        phLevel: '6.5',
        temp: 'Hot',
        offset: '0.9kg',
        dietary: ['High Protein'],
        ingredients: ['Sausages', 'Omelette', 'Bacon', 'Baked Beans', 'Fruit Cuts'],
        featured: true,
        chefChoice: true,
        availability: 'Available Today',
        prepTime: 25,
        calories: 960,
        allergens: ['Gluten', 'Eggs', 'Dairy'],
        servingSize: 'Full plate + drink',
        trendScore: 82,
        co2Score: 'low',
      },
      {
        id: 'bk-3',
        name: 'Ubuntu Eco Lodge Family Harvest Plate',
        image: '/images/Ubuntu-Eco-Lodge-Family-Harvest-Plate.jpeg',
        description: 'Arrowroot, sweet potatoes, kienyeji eggs, beans in coconut sauce.',
        storyLine: 'Before the hotel, before the farm, there was this plate. The arrowroot from the upper ridge, the kienyeji eggs still warm from the yard, beans cooked slow in coconut. Served with millet porridge, African tea, coffee, hot milk or juice.',
        price: 2600,
        field: 'Heritage Kitchen',
        freshness: 100,
        phLevel: '6.9',
        temp: 'Warm',
        offset: '0.8kg',
        dietary: ['Traditional', 'GF'],
        ingredients: ['Arrowroot', 'Sweet Potatoes', 'Kienyeji Eggs', 'Beans in Coconut Sauce'],
        signature: true,
        chefChoice: true,
        availability: 'Available Today',
        pairing: 'Pairs with Millet Porridge or African Tea',
        prepTime: 30,
        calories: 680,
        allergens: ['Eggs'],
        servingSize: 'Full plate + drink',
        trendScore: 91,
        co2Score: 'low',
      },
    ],
  },
  {
    category: 'Main Course',
    description: 'The heart of the Ubuntu kitchen — fire, land and slow-cooked craft.',
    items: [
      {
        id: 'mc-1',
        name: 'The Mighty Traditional Platter',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200',
        description: 'Wet fry mbuzi, dry fry chicken, fries, ugali, mashed potatoes and kachumbari salad.',
        storyLine: 'The Ubuntu table at its most generous. Wet fry goat from the Boma herd and dry fry yard chicken on a single platter, surrounded by fries, hand-pounded ugali, mashed potato and a raw kachumbari that cuts through everything. This is celebration food.',
        price: 4500,
        animal: 'UKV-Boma',
        field: 'Open Fire Pit',
        freshness: 96,
        phLevel: '6.3',
        temp: 'Piping Hot',
        offset: '2.8kg',
        dietary: ['High Protein', 'Signature'],
        ingredients: ['Wet Fry Mbuzi', 'Dry Fry Chicken', 'Fries', 'Ugali', 'Mashed Potatoes', 'Kachumbari'],
        signature: true,
        featured: true,
        chefChoice: true,
        availability: 'Available Today',
        prepTime: 45,
        calories: 1480,
        allergens: ['None'],
        servingSize: 'Full sharing platter',
        trendScore: 97,
        co2Score: 'low',
        customisable: false,
      },
      {
        id: 'mc-2',
        name: 'Grilled Whole Tilapia',
        image: '/images/Grilled-Whole-Tilapia.jpeg',
        description: 'Grilled fish, potatoes and seasoned wild lime green salad.',
        storyLine: 'Farm pond tilapia scored and grilled whole over open heat until the skin chars and crisps. Plated with roasted potatoes and a lime-dressed green salad that wakes everything up.',
        price: 2500,
        field: 'Water Pond 1',
        freshness: 100,
        phLevel: '7.0',
        temp: 'Open Grill',
        offset: '0.9kg',
        dietary: ['Seafood', 'GF'],
        ingredients: ['Whole Tilapia', 'Potatoes', 'Wild Lime Green Salad'],
        chefChoice: true,
        availability: 'Available Today',
        pairing: 'Pairs with Fresh Juice',
        prepTime: 30,
        calories: 520,
        allergens: ['Fish'],
        servingSize: '1 whole fish + sides',
        trendScore: 84,
        co2Score: 'low',
      },
      {
        id: 'mc-3',
        name: 'BBQ Dry Marinated Lake Victoria Fish',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1200',
        description: 'Dry marinated barbequed whole fish from Lake Victoria, grilled to perfection with choice of side.',
        storyLine: 'Lake Victoria fish dry-marinated overnight in the Ubuntu spice blend, then slow-grilled over hardwood until the marinade caramelises into the skin. Every bite carries the lake and the fire in the same breath.',
        price: 2500,
        field: 'Lake Victoria',
        freshness: 98,
        phLevel: '7.1',
        temp: 'BBQ Char',
        offset: '1.0kg',
        dietary: ['Seafood', 'GF'],
        ingredients: ['Lake Victoria Fish', 'Dry Marinade', 'Aromatic Spices', 'Choice of Side'],
        availability: 'Available Today',
        pairing: 'Pairs with Ugali or Chips',
        prepTime: 35,
        calories: 490,
        allergens: ['Fish'],
        servingSize: '1 whole fish + side',
        trendScore: 78,
        co2Score: 'low',
        customisable: true,
      },
      {
        id: 'mc-4',
        name: 'Marinated Whole Tilapia — Your Way',
        image: '/images/Marinated-Whole-Tilapia.jpeg',
        description: 'Marinated whole tilapia — grilled, dry fried, wet or curry — with a side of choice.',
        storyLine: 'One fish. Four ways to cook it. The grilled version carries the smoke of the open fire; dry fried delivers crunch; wet fry is warmth in a pot; curry wraps it in deep spice. You choose how the lake comes to your table.',
        price: 2500,
        field: 'Farm Pond',
        freshness: 100,
        phLevel: '7.0',
        temp: 'Choice of Method',
        offset: '0.9kg',
        dietary: ['Seafood', 'GF'],
        ingredients: ['Whole Tilapia', 'House Marinade', 'Choice of Side'],
        availability: 'Available Today',
        prepTime: 30,
        calories: 480,
        allergens: ['Fish'],
        servingSize: '1 whole fish + side',
        trendScore: 75,
        co2Score: 'low',
        customisable: true,
      },
      {
        id: 'mc-5',
        name: 'Whole Grilled Lamb Chops',
        image: '/images/Whole-Grilled-Lamb-Chops.jpeg',
        description: 'Whole grilled lamb chops with a side of choice and BBQ sauce.',
        storyLine: 'Ridge-grazed lamb chops marinated in herb blend, seared on the open grill until the bone begins to colour and the fat renders sweet. Served with your choice of accompaniment and the house BBQ sauce.',
        price: 2500,
        animal: 'UKV-Lamb',
        field: 'Ridge Pasture',
        freshness: 96,
        phLevel: '6.5',
        temp: 'Open Grill',
        offset: '1.4kg',
        dietary: ['High Protein', 'GF'],
        ingredients: ['Lamb Chops', 'Herb Marinade', 'BBQ Sauce', 'Choice of Side'],
        chefChoice: true,
        availability: 'Available Today',
        pairing: 'Pairs with Roasted Potatoes',
        prepTime: 32,
        calories: 720,
        allergens: ['None'],
        servingSize: 'Full rack + side',
        trendScore: 86,
        co2Score: 'low',
        customisable: true,
      },
    ],
  },
  {
    category: 'Accompaniments',
    description: 'From the fields. Simple, honest, made to share.',
    items: [
      { id: 'ac-1', name: 'Ugali', image: '/images/Ugali.jpeg', description: 'Hand-stirred maize ugali, the Ubuntu staple.', storyLine: 'Stone-ground maize slowly hand-stirred over the fire until it pulls cleanly from the pot. The foundation of every Ubuntu meal—simple, satisfying, and always prepared fresh to order.', price: 300, field: 'Corn Patch', freshness: 100, phLevel: '6.6', temp: 'Hot', offset: '0.4kg', dietary: ['Vegan', 'GF'], ingredients: ['Maize Flour', 'Water'], availability: 'Available Today', prepTime: 10, calories: 280, allergens: ['None'], servingSize: '1 portion', trendScore: 60, co2Score: 'low' },
      { id: 'ac-2', name: 'Chapati (Pair)', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800', description: 'Soft-layered, hand-rolled chapati — two per serving.', storyLine: 'Rolled and cooked to order on a flat griddle. Soft inside, golden outside. The smell alone is worth the walk from the cottages.', price: 300, field: 'Farm Kitchen', freshness: 100, phLevel: '6.4', temp: 'Fresh off griddle', offset: '0.2kg', dietary: ['Vegan'], ingredients: ['Wheat Flour', 'Oil', 'Salt'], availability: 'Available Today', prepTime: 8, calories: 260, allergens: ['Gluten'], servingSize: '2 chapati', trendScore: 65, co2Score: 'low' },
      { id: 'ac-3', name: 'Mashed Potatoes', image: '/images/Mashed-Potatoes.jpeg', description: 'Creamy farm mashed potatoes with butter.', storyLine: 'Field C potatoes boiled and mashed with cultured dairy butter until silky. The most comforting thing on the table.', price: 300, field: 'Field C', freshness: 98, phLevel: '6.7', temp: 'Hot', offset: '0.3kg', dietary: ['Vegetarian', 'GF'], ingredients: ['Irish Potatoes', 'Butter', 'Salt'], availability: 'Available Today', prepTime: 12, calories: 320, allergens: ['Dairy'], servingSize: '1 portion', trendScore: 58, co2Score: 'low' },
      { id: 'ac-4', name: 'Ubuntu Farm Fries', image: '/images/Ubuntu-Farm-Fries.jpeg', description: 'Hand-cut potatoes, double-fried, sea-salted.', storyLine: 'Potatoes from Field C, cut by hand, fried twice for maximum crunch and finished with house salt. Served with smoky chilli sauce on the side.', price: 300, field: 'Field C', freshness: 98, phLevel: '6.5', temp: 'Crisp Hot', offset: '0.3kg', dietary: ['Vegan', 'GF'], ingredients: ['Potatoes', 'Oil', 'Sea Salt'], availability: 'Available Today', prepTime: 12, calories: 380, allergens: ['None'], servingSize: 'Generous portion', trendScore: 72, co2Score: 'low' },
      { id: 'ac-5', name: 'Sauté Vegetables', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800', description: 'Seasonal farm vegetables, sautéed in herb butter.', storyLine: 'Whatever the garden is giving this morning — spinach, sukuma, bell peppers — sautéed in herb butter over high heat until they glisten.', price: 500, field: 'Kitchen Garden', freshness: 100, phLevel: '6.9', temp: 'Sautéed Hot', offset: '0.2kg', dietary: ['Vegetarian', 'GF'], ingredients: ['Seasonal Vegetables', 'Herb Butter', 'Garlic'], availability: 'Available Today', prepTime: 8, calories: 140, allergens: ['Dairy'], servingSize: '1 portion', trendScore: 50, co2Score: 'low' },
      { id: 'ac-6', name: 'Village Bhajia', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=800', description: 'Spiced chickpea batter, thin-sliced potatoes, fried golden.', storyLine: 'A Kenyan street classic elevated by the Ubuntu kitchen — spiced to the edge of heat and fried to a perfect golden crust.', price: 500, field: 'Field C', freshness: 99, phLevel: '6.3', temp: 'Fresh Fried', offset: '0.3kg', dietary: ['Vegan'], ingredients: ['Potatoes', 'Chickpea Flour', 'Spices'], availability: 'Available Today', prepTime: 10, calories: 340, allergens: ['Gluten'], servingSize: 'Sharing portion', trendScore: 76, co2Score: 'low' },
      { id: 'ac-7', name: 'Roasted Potatoes', image: '/images/Roasted-Potatoes.jpeg', description: 'Whole oven-roasted potatoes with rosemary.', storyLine: 'Field C potatoes tossed in herb oil and roasted whole in the farm oven until the skins blister and the insides collapse into softness.', price: 700, field: 'Field C', freshness: 97, phLevel: '6.6', temp: 'Oven Hot', offset: '0.4kg', dietary: ['Vegan', 'GF'], ingredients: ['Potatoes', 'Rosemary', 'Herb Oil'], availability: 'Available Today', prepTime: 25, calories: 360, allergens: ['None'], servingSize: '1 portion', trendScore: 62, co2Score: 'low' },
      { id: 'ac-8', name: 'Plain Rice', image: '/images/Plain-Rice.jpeg', description: 'Steamed long-grain plain rice.', storyLine: 'Long-grain rice steamed clean. The neutral foundation that lets everything else speak.', price: 300, field: 'Farm Kitchen', freshness: 100, phLevel: '6.5', temp: 'Steamed Hot', offset: '0.3kg', dietary: ['Vegan', 'GF'], ingredients: ['Long Grain Rice', 'Water', 'Salt'], availability: 'Available Today', prepTime: 15, calories: 260, allergens: ['None'], servingSize: '1 portion', trendScore: 45, co2Score: 'low' },
      { id: 'ac-9', name: 'Vegetable Rice', image: '/images/Vegetable-Rice.jpeg', description: 'Fragrant rice cooked with garden vegetables.', storyLine: 'Rice cooked with whatever the kitchen garden yields — diced carrots, peas, peppers — fragrant with cumin and a touch of turmeric.', price: 500, field: 'Kitchen Garden', freshness: 99, phLevel: '6.6', temp: 'Hot', offset: '0.4kg', dietary: ['Vegan', 'GF'], ingredients: ['Long Grain Rice', 'Seasonal Vegetables', 'Cumin', 'Turmeric'], availability: 'Available Today', prepTime: 18, calories: 310, allergens: ['None'], servingSize: '1 portion', trendScore: 55, co2Score: 'low' },
      { id: 'ac-10', name: 'Sweet Potatoes', image: '/images/Sweet-Potatoes.jpeg', description: 'Farm sweet potatoes, boiled or roasted.', storyLine: 'Field C sweet potatoes, harvested that morning. Boiled until tender or roasted until the skins caramelise. The honest taste of the farm.', price: 250, field: 'Field C', freshness: 100, phLevel: '6.8', temp: 'Hot', offset: '0.3kg', dietary: ['Vegan', 'GF'], ingredients: ['Sweet Potatoes'], availability: 'Available Today', prepTime: 15, calories: 220, allergens: ['None'], servingSize: '1 portion', trendScore: 58, co2Score: 'low' },
      { id: 'ac-11', name: 'Arrow Root', image: '/images/Arrow-Root.jpeg', description: 'Traditional boiled arrowroot from the upper ridge.', storyLine: 'Upper ridge arrowroot, harvested and boiled in salted water until soft and slightly earthy. The ingredient that anchors every traditional Ubuntu morning.', price: 250, field: 'Upper Ridge', freshness: 100, phLevel: '6.9', temp: 'Warm', offset: '0.3kg', dietary: ['Vegan', 'GF'], ingredients: ['Arrow Root'], availability: 'Available Today', prepTime: 20, calories: 180, allergens: ['None'], servingSize: '1 portion', trendScore: 44, co2Score: 'low' },
      { id: 'ac-12', name: 'Seasonal Vegetables', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800', description: 'Sukuma wiki, spinach or whatever the garden offers today.', storyLine: 'The garden decides what this is each day. Sukuma wiki, creamed spinach, or steamed greens — always farm-fresh, always honest.', price: 200, field: 'Kitchen Garden', freshness: 100, phLevel: '7.0', temp: 'Hot', offset: '0.2kg', dietary: ['Vegan', 'GF'], ingredients: ['Seasonal Greens', 'Oil', 'Garlic', 'Salt'], availability: 'Available Today', prepTime: 6, calories: 80, allergens: ['None'], servingSize: '1 portion', trendScore: 42, co2Score: 'low' },
      { id: 'ac-13', name: 'Matoke (1kg)', image: '/images/Matoke-(1kg).jpeg', description: 'Ubuntu Matoke — wet fry, dry fry, or signature peanut-infused.', storyLine: 'Harvested from the lower farm and slow-cooked to bring out its natural sweetness, Ubuntu matoke has nourished families and travelers across East Africa for generations. Choose it wet-fried, dry-fried, or enriched with our signature peanut sauce—the version that has been loved by guests since the kitchen first opened. Rich, earthy, comforting, and deeply satisfying.', price: 500, field: 'Lower Farm', freshness: 97, phLevel: '6.7', temp: 'Hot', offset: '0.5kg', dietary: ['Vegan', 'GF'], ingredients: ['Green Bananas', 'Onions', 'Tomatoes'], availability: 'Available Today', prepTime: 25, calories: 440, allergens: ['None'], servingSize: '1kg', trendScore: 60, co2Score: 'low', customisable: true },
    ],
  },
  {
    category: 'Pizzas',
    description: 'Stone-baked in the Ubuntu oven. Farm-sourced toppings.',
    items: [
      { id: 'pz-1', name: 'BBQ / Beef / Chicken Pizza (Medium)', image: '/images/BBQ-Beef-Chicken-Pizza-(Medium).jpeg', description: 'Your choice of BBQ, beef, or chicken on a medium artisan stone-baked pizza.', storyLine: 'Farm-sourced proteins meet artisan craftsmanship on a hand-stretched base baked in the Ubuntu stone oven. Choose smoky BBQ chicken, slow-seasoned beef, or tender grilled chicken, layered with rich mozzarella and house tomato sauce. Fired until the crust develops a delicate char and the cheese melts into every crevice, creating a pizza thats both comforting and unforgettable.', price: 1200, field: 'Stone Oven', freshness: 98, phLevel: '5.8', temp: '300°C Stone Baked', offset: '0.5kg', dietary: ['High Protein'], ingredients: ['Pizza Dough', 'Tomato Sauce', 'Mozzarella', 'Choice of BBQ / Beef / Chicken'], availability: 'Available Today', prepTime: 18, calories: 720, allergens: ['Gluten', 'Dairy'], servingSize: 'Medium — 6 slices', trendScore: 78, co2Score: 'low', customisable: true },
      { id: 'pz-2', name: 'BBQ / Beef / Chicken Pizza (Large)', image: '/images/BBQ-Beef-Chicken-Pizza-(Large).jpeg', description: 'Your choice of BBQ, beef, or chicken on a large stone-baked artisan pizza.', storyLine: 'Built for gathering and baked for sharing. Choose smoky BBQ, slow-seasoned beef, or tender farm-style chicken atop a hand-stretched crust, layered with rich mozzarella and Ubuntu signature tomato sauce. Finished in our stone oven until perfectly blistered and golden, its the pizza that arrives at the table and instantly becomes the centre of attention.', price: 2300, field: 'Stone Oven', freshness: 98, phLevel: '5.8', temp: '300°C Stone Baked', offset: '0.8kg', dietary: ['High Protein'], ingredients: ['Pizza Dough', 'Tomato Sauce', 'Mozzarella', 'Choice of BBQ / Beef / Chicken'], availability: 'Available Today', prepTime: 22, calories: 1080, allergens: ['Gluten', 'Dairy'], servingSize: 'Large — 8 slices', trendScore: 80, co2Score: 'low', customisable: true },
      { id: 'pz-3', name: 'Hawaiian Pizza (Medium)', image: '/images/Hawaiian-Pizza-(Medium).jpeg', description: 'Smoked ham, orchard pineapple, and mozzarella on a stone-baked medium base.', storyLine: 'Orchard pineapple, ham and house-made tomato sauce from Field A on a base fired in the Ubuntu stone oven. The sweetness of the farm in every bite.', price: 1300, field: 'Stone Oven', freshness: 97, phLevel: '5.6', temp: '300°C Stone Baked', offset: '0.5kg', dietary: ['High Protein'], ingredients: ['Pizza Dough', 'Tomato Sauce', 'Mozzarella', 'Ham', 'Pineapple'], availability: 'Available Today', prepTime: 18, calories: 760, allergens: ['Gluten', 'Dairy'], servingSize: 'Medium — 6 slices', trendScore: 74, co2Score: 'low' },
      { id: 'pz-4', name: 'Hawaiian Pizza (Large)', image: '/images/Hawaiian-Pizza-(Large).jpeg', description: 'Smoked ham, orchard pineapple, and mozzarella on a large stone-baked base.', storyLine: 'The full Hawaiian experience on our largest stone-baked base. Sweet orchard pineapple, premium smoked ham, and creamy mozzarella come together over slow-risen dough for the perfect balance of savoury and sweet. Crafted for sharing, celebrated for flavour, and built for the table that knows exactly what it wants.', price: 2000, field: 'Stone Oven', freshness: 97, phLevel: '5.6', temp: '300°C Stone Baked', offset: '0.8kg', dietary: ['High Protein'], ingredients: ['Pizza Dough', 'Tomato Sauce', 'Mozzarella', 'Ham', 'Pineapple'], availability: 'Available Today', prepTime: 22, calories: 1120, allergens: ['Gluten', 'Dairy'], servingSize: 'Large — 8 slices', trendScore: 76, co2Score: 'low' },
      { id: 'pz-5', name: 'Margherita Pizza (Medium)', image: '/images/Margherita-Pizza-(Medium).jpeg', description: 'Classic tomato, mozzarella, and fresh basil on a medium artisan stone-baked base.', storyLine: 'The purists choice. Vine-ripened tomatoes, creamy mozzarella, and fresh basil harvested from the kitchen garden come together on a hand-stretched base baked in the Ubuntu stone oven. Nothing hidden. Everything honest. A celebration of simple ingredients prepared with care.', price: 900, field: 'Stone Oven', freshness: 99, phLevel: '5.5', temp: '300°C Stone Baked', offset: '0.4kg', dietary: ['Vegetarian'], ingredients: ['Pizza Dough', 'Tomato Sauce', 'Mozzarella', 'Fresh Basil'], availability: 'Available Today', prepTime: 15, calories: 620, allergens: ['Gluten', 'Dairy'], servingSize: 'Medium — 6 slices', trendScore: 65, co2Score: 'low' },
      { id: 'pz-6', name: 'Margherita Pizza (Large)', image: '/images/Margherita-Pizza-(Large).jpeg', description: 'Classic tomato, mozzarella, and basil on a large artisan stone-baked base.', storyLine: 'The classic on our largest base. Simple, elegant, and exactly right when shared between friends on the terrace.', price: 1800, field: 'Stone Oven', freshness: 99, phLevel: '5.5', temp: '300°C Stone Baked', offset: '0.7kg', dietary: ['Vegetarian'], ingredients: ['Pizza Dough', 'Tomato Sauce', 'Mozzarella', 'Fresh Basil'], availability: 'Available Today', prepTime: 18, calories: 960, allergens: ['Gluten', 'Dairy'], servingSize: 'Large — 8 slices', trendScore: 67, co2Score: 'low' },
    ],
  },
  {
    category: 'Pork & Grill',
    description: 'Open flame. Smoke. The oldest way to cook — still the best.',
    items: [
      { id: 'pg-1', name: 'Pork Chops — Dry or Wet Fry', image: '/images/Pork-Chops-Dry-or-Wet-Fry.jpeg', description: 'Thick-cut pork chops — dry fried to a crisp or wet fried in a rich tomato sauce.', storyLine: 'Farm pork, marinated in garlic, ginger and a touch of honey, then cooked your way. Dry fry for the crisp herb crust; wet fry for the deep tomato depth. Both versions are how Sundays are supposed to feel.', price: 2500, field: 'Farm Paddock', freshness: 95, phLevel: '6.2', temp: 'Choice of Method', offset: '1.2kg', dietary: ['High Protein', 'GF'], ingredients: ['Pork Chops', 'Garlic', 'Ginger', 'Honey', 'Spices'], chefChoice: true, availability: 'Available Today', prepTime: 25, calories: 640, allergens: ['None'], servingSize: '2 chops', trendScore: 83, co2Score: 'low', customisable: true },
      { id: 'pg-2', name: 'Chicken Grill', image: '/images/Chicken-Grill.jpeg', description: 'Herb-marinated farm chicken grilled slowly over open coals.', storyLine: 'Ubuntu yard chicken, marinated overnight in a blend of fresh herbs, aromatic spices, and garden-grown ingredients, then slow-grilled over glowing hardwood coals. The skin crisps beautifully while the meat remains tender and juicy within. A dish rooted in patience, craftsmanship, and the timeless pleasure of food cooked over fire.', price: 2600, animal: 'UKV-Yard', field: 'Open Grill', freshness: 97, phLevel: '6.1', temp: 'Open Grill', offset: '1.4kg', dietary: ['High Protein', 'GF'], ingredients: ['Farm Chicken', 'Herb Marinade', 'Aromatic Spices'], signature: true, chefChoice: true, availability: 'Available Today', pairing: 'Pairs with Roasted Potatoes or Ugali', prepTime: 40, calories: 680, allergens: ['None'], servingSize: '1 whole grilled chicken', trendScore: 92, co2Score: 'low', customisable: false },
    ],
  },
  {
    category: 'Farm Specialities',
    description: 'Slow-cooked Ubuntu traditions. Each pot tells a story of time and patience.',
    items: [
      { id: 'fs-1', name: 'Goat Tumbukiza (1kg)', image: '/images/Goat-Tumbukiza-(1kg).jpeg', description: 'Goat meat slow-cooked in a communal pot — the original Ubuntu meal.', storyLine: 'The communal pot that Ubuntu grew from. Slow-cooked goat from the Boma herd, falling from the bone into a rich broth after hours of patience over the fire. Served with your choice of carb.', price: 2500, animal: 'UKV-Boma', field: 'Clay Pit', freshness: 96, phLevel: '6.0', temp: 'Slow Simmered', offset: '1.8kg', dietary: ['High Protein', 'GF'], ingredients: ['Goat Meat', 'Valley Herbs', 'Root Vegetables', 'Broth'], signature: true, featured: true, chefChoice: true, availability: 'Available Today', pairing: 'Pairs with Ugali', prepTime: 60, calories: 820, allergens: ['None'], servingSize: '1kg serving', trendScore: 95, co2Score: 'low' },
      { id: 'fs-2', name: 'Whole Kienyeji Chicken Tumbukiza', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800', description: 'Free-range kienyeji chicken, slow-cooked Tumbukiza style.', storyLine: 'The yard chicken that grew up on this farm, cooked the old way in a sealed pot with local spices until the meat falls from the bone. Rich, deeply flavoured and completely authentic.', price: 3600, animal: 'UKV-Yard', field: 'Heritage Pot', freshness: 98, phLevel: '6.3', temp: 'Slow Cooked', offset: '1.6kg', dietary: ['High Protein', 'GF'], ingredients: ['Kienyeji Chicken', 'Local Spices', 'Herbs', 'Broth'], signature: true, chefChoice: true, availability: 'Available Today', pairing: 'Pairs with Ugali or Chapati', prepTime: 50, calories: 720, allergens: ['None'], servingSize: '1 whole chicken', trendScore: 90, co2Score: 'low' },
      { id: 'fs-3', name: 'Mbuzi Tumbukiza (1kg)', image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?q=80&w=800', description: '1kg of goat meat, slow-cooked in the traditional Tumbukiza style.', storyLine: 'One kilogram of Boma goat, sealed in the clay pot with valley herbs and slow heat. The collagen surrenders completely. The broth deepens with every passing hour. This is what patience tastes like.', price: 2500, animal: 'UKV-Boma', field: 'Clay Pit', freshness: 95, phLevel: '5.9', temp: 'Slow Simmered', offset: '1.5kg', dietary: ['High Protein', 'GF'], ingredients: ['Goat Meat', 'Valley Herbs', 'Aromatic Spices', 'Broth'], signature: true, availability: 'Available Today', prepTime: 55, calories: 760, allergens: ['None'], servingSize: '1kg', trendScore: 88, co2Score: 'low' },
      { id: 'fs-4', name: 'Biryani — Beef, Mutton or Chicken', image: '/images/Biryani-Beef-Mutton-or-Chicken.jpeg', description: 'Fragrant basmati rice layered with your choice of protein and whole spices.', storyLine: 'Basmati layered with farm protein and sealed tight. The steam does the work. Caramelised onions, whole cardamom, cloves and bay leaf rise from the pot when you lift the lid.', price: 2500, field: 'Farm Kitchen', freshness: 96, phLevel: '6.4', temp: 'Sealed Pot', offset: '1.2kg', dietary: ['High Protein', 'GF'], ingredients: ['Basmati Rice', 'Choice of Protein', 'Aromatic Spices', 'Caramelised Onions'], chefChoice: true, availability: 'Available Today', prepTime: 45, calories: 720, allergens: ['None'], servingSize: '400g', trendScore: 82, co2Score: 'low', customisable: true },
    ],
  },
  {
    category: 'Specials',
    description: 'Mbuzi, chicken and fish — your way, your method, your moment.',
    items: [
      { id: 'sp-1', name: 'Mbuzi — Wet Fry, Dry Fry or Choma', image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?q=80&w=800', description: 'Boma goat cooked your preferred way — wet fry, dry fry or open-flame choma.', storyLine: 'Boma goat at its most direct. Wet fry carries the tomato and onion depth; dry fry crisps the edges and concentrates the flavour; choma is the oldest way — just fire, meat and time.', price: 2500, animal: 'UKV-Boma', field: 'Open Fire', freshness: 96, phLevel: '6.1', temp: 'Choice of Method', offset: '1.5kg', dietary: ['High Protein', 'GF'], ingredients: ['Goat Meat', 'Aromatic Spices', 'Fresh Herbs'], chefChoice: true, availability: 'Available Today', pairing: 'Pairs with Ugali and Kachumbari', prepTime: 40, calories: 680, allergens: ['None'], servingSize: '300g', trendScore: 87, co2Score: 'low', customisable: true },
      { id: 'sp-2', name: 'Chicken — Wet Fry, Dry Fry or Choma', image: 'https://images.unsplash.com/photo-1598512752271-33f913a5af13?q=80&w=800', description: 'Farm chicken cooked your preferred way — wet fry, dry fry or open-flame choma.', storyLine: 'Ubuntu yard chicken cooked three ways. The wet fry warms you from inside; the dry fry delivers the crisp herb crust you came for; the choma is the version that makes the table go quiet.', price: 2500, animal: 'UKV-Yard', field: 'Open Fire', freshness: 97, phLevel: '6.2', temp: 'Choice of Method', offset: '1.3kg', dietary: ['High Protein', 'GF'], ingredients: ['Farm Chicken', 'Local Spices', 'Fresh Herbs'], availability: 'Available Today', pairing: 'Pairs with Chapati or Ugali', prepTime: 35, calories: 640, allergens: ['None'], servingSize: '300g', trendScore: 85, co2Score: 'low', customisable: true },
      { id: 'sp-3', name: 'Fish — Wet Fry, Dry Fry or Choma', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800', description: 'Fresh farm fish cooked your preferred way — wet fry, dry fry or open-flame choma.', storyLine: 'Pond-to-plate. The same fish that will be on the menu tomorrow — just cooked the way you want it. Dry fry for crispness, wet fry for depth, choma for the smoke that clings beautifully.', price: 2500, field: 'Farm Pond', freshness: 100, phLevel: '7.0', temp: 'Choice of Method', offset: '0.9kg', dietary: ['Seafood', 'GF'], ingredients: ['Fresh Farm Fish', 'Local Seasoning', 'Herbs'], availability: 'Available Today', pairing: 'Pairs with Ugali or Rice', prepTime: 28, calories: 480, allergens: ['Fish'], servingSize: '300g', trendScore: 79, co2Score: 'low', customisable: true },
    ],
  },
  {
    category: 'Salads & Snacks',
    description: 'Light bites from the farm and fire — the natural start to any Ubuntu day.',
    items: [
      { id: 'ss-1', name: 'Kachumbari', image: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?q=80&w=800', description: 'Fresh tomato, onion and coriander salad.', storyLine: 'Garden tomatoes, white onion and fresh coriander sliced raw and dressed with lemon and a pinch of salt. The brightest thing on the table.', price: 300, field: 'Kitchen Garden', freshness: 100, phLevel: '4.5', temp: 'Fresh', offset: '0.1kg', dietary: ['Vegan', 'GF'], ingredients: ['Tomatoes', 'Onions', 'Coriander', 'Lemon'], availability: 'Available Today', prepTime: 5, calories: 45, allergens: ['None'], servingSize: 'Side portion', trendScore: 55, co2Score: 'low' },
      { id: 'ss-2', name: 'Coleslaw', image: 'https://images.unsplash.com/photo-1593828354269-b6a4e2d37d6b?q=80&w=800', description: 'Creamy farm coleslaw with shredded cabbage and carrot.', storyLine: 'Garden cabbage and carrot, shredded and dressed in the Ubuntu house dressing. Creamy, crisp, cooling.', price: 300, field: 'Kitchen Garden', freshness: 100, phLevel: '5.0', temp: 'Chilled', offset: '0.2kg', dietary: ['Vegetarian'], ingredients: ['Cabbage', 'Carrot', 'Mayo Dressing'], availability: 'Available Today', prepTime: 8, calories: 180, allergens: ['Eggs'], servingSize: 'Side portion', trendScore: 52, co2Score: 'low' },
      { id: 'ss-3', name: 'Fruit Bowl Salad', image: 'https://images.unsplash.com/photo-1546548970-71785318a17b?q=80&w=800', description: 'Farm-picked seasonal fruit bowl with honey drizzle.', storyLine: 'Whatever the orchard offered this morning — mango, pawpaw, watermelon, passion. Cut at the pass and served immediately.', price: 500, field: 'Orchard', freshness: 100, phLevel: '4.2', temp: 'Fresh', offset: '0.3kg', dietary: ['Vegan', 'GF'], ingredients: ['Seasonal Fruits', 'Honey Drizzle'], availability: 'Available Today', prepTime: 5, calories: 180, allergens: ['None'], servingSize: '300g bowl', trendScore: 65, co2Score: 'low' },
      { id: 'ss-4', name: 'Fruit Cut Platter', image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?q=80&w=800', description: 'Generous assorted hand-cut tropical fruit platter for sharing.', storyLine: 'The full spread of what the orchard is giving today — sliced, arranged and shared across the table. Built for two, best enjoyed by four.', price: 800, field: 'Orchard', freshness: 100, phLevel: '4.3', temp: 'Fresh', offset: '0.5kg', dietary: ['Vegan', 'GF'], ingredients: ['Assorted Tropical Fruits', 'Mint Garnish'], availability: 'Available Today', prepTime: 8, calories: 320, allergens: ['None'], servingSize: 'Sharing platter', trendScore: 68, co2Score: 'low' },
      { id: 'ss-5', name: 'Protein Rich Salad Bowl', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800', description: 'Composed salad with farm protein, greens and house dressing.', storyLine: 'Seasonal greens, farm vegetables and a generous protein from the kitchen, composed and dressed in the Ubuntu house vinaigrette. The midday choice of the team that runs this farm.', price: 700, field: 'Kitchen Garden', freshness: 100, phLevel: '5.2', temp: 'Fresh', offset: '0.3kg', dietary: ['High Protein', 'GF'], ingredients: ['Seasonal Greens', 'Farm Protein', 'Vegetables', 'House Dressing'], availability: 'Available Today', prepTime: 10, calories: 480, allergens: ['None'], servingSize: '1 bowl', trendScore: 71, co2Score: 'low' },
      { id: 'ss-6', name: 'Farm Sausages (2pc)', image: 'https://images.unsplash.com/photo-1563897539633-7374c059f29d?q=80&w=800', description: 'Pork or beef sausages grilled over open flame.', storyLine: 'Sourced from within the village supply chain, grilled slowly over open heat until the skin chars and blisters. Simple. Honest. Delicious.', price: 300, field: 'Open Grill', freshness: 97, phLevel: '6.2', temp: 'Grilled Hot', offset: '0.2kg', dietary: ['High Protein'], ingredients: ['Pork / Beef Sausage'], availability: 'Available Today', prepTime: 10, calories: 220, allergens: ['Gluten'], servingSize: '2 pieces', trendScore: 60, co2Score: 'low' },
      { id: 'ss-7', name: 'Beef Samosa', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800', description: 'Crisp pastry triangles filled with spiced minced beef.', storyLine: 'Folded by hand in the kitchen each morning with spiced minced beef. Fried to a perfect crunch and served with chilli and mint chutney.', price: 300, field: 'Farm Kitchen', freshness: 98, phLevel: '6.0', temp: 'Fresh Fried', offset: '0.15kg', dietary: ['High Protein'], ingredients: ['Pastry', 'Spiced Minced Beef', 'Oil'], chefChoice: true, availability: 'Available Today', prepTime: 8, calories: 280, allergens: ['Gluten'], servingSize: '2 pieces', trendScore: 74, co2Score: 'low' },
      { id: 'ss-8', name: 'Chicken Pie', image: 'https://images.unsplash.com/photo-1535438097175-192b6ead1b9a?q=80&w=800', description: 'Flaky shortcrust pastry with tender spiced chicken filling.', storyLine: 'Baked in the Ubuntu kitchen — a simple thing done properly. Flaky shortcrust encasing a rich filling of spiced farm chicken. Baked fresh each morning.', price: 300, field: 'Farm Kitchen', freshness: 98, phLevel: '6.1', temp: 'Warm Baked', offset: '0.2kg', dietary: ['High Protein'], ingredients: ['Pastry', 'Chicken', 'Spices'], availability: 'Available Today', prepTime: 5, calories: 370, allergens: ['Gluten'], servingSize: '1 piece', trendScore: 66, co2Score: 'low' },
      { id: 'ss-9', name: 'Cinnamon Rolls', image: 'https://images.unsplash.com/photo-1609951651556-5334e2706168?q=80&w=800', description: 'Soft, warm cinnamon rolls fresh from the farm oven.', storyLine: 'Baked in the farm oven each morning. Soft, sweet, fragrant with cinnamon from the spice garden. Best eaten warm with a cup of African tea.', price: 300, field: 'Farm Bakery', freshness: 100, phLevel: '6.2', temp: 'Warm', offset: '0.15kg', dietary: ['Vegetarian'], ingredients: ['Flour', 'Cinnamon', 'Butter', 'Sugar', 'Eggs'], availability: 'Available Today', prepTime: 5, calories: 340, allergens: ['Gluten', 'Dairy', 'Eggs'], servingSize: '1 roll', trendScore: 69, co2Score: 'low' },
    ],
  },
  {
    category: 'Soups',
    description: 'Slow-cooked. Patient. The kind of warmth that takes time.',
    items: [
      { id: 'so-1', name: 'Chicken Soup', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=800', description: 'Clear golden farm chicken broth with garden vegetables.', storyLine: 'Free-range chicken simmered for hours with farm carrots, celery and leek until the broth runs deep gold. The broth that has kept Ubuntu going since the beginning.', price: 700, field: 'Farm Kitchen', freshness: 98, phLevel: '6.8', temp: '85°C', offset: '0.4kg', dietary: ['High Protein', 'GF'], ingredients: ['Farm Chicken', 'Carrots', 'Celery', 'Garden Herbs'], availability: 'Available Today', prepTime: 30, calories: 290, allergens: ['None'], servingSize: '350ml', trendScore: 68, co2Score: 'low' },
      { id: 'so-2', name: 'Vegetable Soup', image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?q=80&w=800', description: 'Hearty vegetable broth made from the morning harvest.', storyLine: 'Whatever the garden gave this morning, slow-simmered into a nourishing broth. The vegetable changes daily. The warmth is always the same.', price: 700, field: 'Kitchen Garden', freshness: 100, phLevel: '6.9', temp: '85°C', offset: '0.3kg', dietary: ['Vegan', 'GF'], ingredients: ['Seasonal Vegetables', 'Herbs', 'Vegetable Stock'], availability: 'Available Today', prepTime: 22, calories: 180, allergens: ['None'], servingSize: '350ml', trendScore: 55, co2Score: 'low' },
      { id: 'so-3', name: 'Mushroom Soup', image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?q=80&w=800', description: 'Velvety mushroom cream soup with herb oil and croutons.', storyLine: 'Wild and cultivated mushrooms blended into a deep, earthy cream. Finished with herb oil and croutons from the farm bakery. Forest edge porcini at their earthiest.', price: 700, field: 'Forest Edge', freshness: 95, phLevel: '6.2', temp: '82°C', offset: '0.3kg', dietary: ['Vegetarian'], ingredients: ['Fresh Mushrooms', 'Cream', 'Thyme', 'Garlic', 'Croutons'], chefChoice: true, availability: 'Available Today', prepTime: 25, calories: 310, allergens: ['Dairy', 'Gluten'], servingSize: '350ml', trendScore: 73, co2Score: 'low' },
      { id: 'so-4', name: 'Butternut Soup', image: 'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?q=80&w=800', description: 'Silky roasted butternut squash soup with warm spices.', storyLine: 'Butternut from the kitchen garden, roasted until it sweetens, then blended with warm spices into a velvety soup that arrives like an embrace on a cool evening.', price: 600, field: 'Kitchen Garden', freshness: 97, phLevel: '6.5', temp: '80°C', offset: '0.4kg', dietary: ['Vegan', 'GF'], ingredients: ['Butternut Squash', 'Warm Spices', 'Coconut Milk'], availability: 'Available Today', prepTime: 28, calories: 260, allergens: ['None'], servingSize: '350ml', trendScore: 70, co2Score: 'low' },
    ],
  },
  {
    category: 'Sauces',
    description: 'House-made condiments to elevate every plate.',
    items: [
      { id: 'sa-1', name: 'Tartar Sauce', image: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?q=80&w=800', description: 'Classic creamy tartar sauce with capers and herbs.', storyLine: 'House-made with capers, fresh dill and lemon — the natural companion to our grilled tilapia and fried fish.', price: 300, field: 'Farm Kitchen', freshness: 99, phLevel: '4.8', temp: 'Room Temp', offset: '0.05kg', dietary: ['Vegetarian'], ingredients: ['Mayo', 'Capers', 'Dill', 'Lemon'], availability: 'Available Today', prepTime: 2, calories: 90, allergens: ['Eggs'], servingSize: 'Side pot', trendScore: 45, co2Score: 'low' },
      { id: 'sa-2', name: 'Garlic Mayo Sauce', image: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?q=80&w=800', description: 'Rich roasted garlic mayo, house-made daily.', storyLine: 'Roasted farm garlic blended into the Ubuntu house mayo. The sauce that makes the fries disappear faster than any other.', price: 300, field: 'Farm Kitchen', freshness: 100, phLevel: '4.5', temp: 'Room Temp', offset: '0.05kg', dietary: ['Vegetarian'], ingredients: ['Mayo', 'Roasted Garlic', 'Herbs'], availability: 'Available Today', prepTime: 2, calories: 110, allergens: ['Eggs'], servingSize: 'Side pot', trendScore: 62, co2Score: 'low' },
      { id: 'sa-3', name: 'Chilli Sauce', image: 'https://images.unsplash.com/photo-1589778655375-3e622c0b2a5a?q=80&w=800', description: 'House-made chilli sauce with farm chillis and tomato.', storyLine: 'Kitchen garden chillis blended with tomato and vinegar into a sauce that adds heat without hiding everything underneath it.', price: 300, field: 'Kitchen Garden', freshness: 100, phLevel: '3.8', temp: 'Room Temp', offset: '0.05kg', dietary: ['Vegan', 'GF'], ingredients: ['Farm Chillis', 'Tomato', 'Vinegar', 'Garlic'], availability: 'Available Today', prepTime: 2, calories: 35, allergens: ['None'], servingSize: 'Side pot', trendScore: 70, co2Score: 'low' },
      { id: 'sa-4', name: 'BBQ Sauce', image: 'https://images.unsplash.com/photo-1545468800-85cc9bc6ecf7?q=80&w=800', description: 'Smoky house-made BBQ sauce with molasses and spice.', storyLine: 'Slow-reduced molasses, tomato, smoked paprika and a touch of farm honey. The sauce that finishes the choma and the grill plate.', price: 300, field: 'Farm Kitchen', freshness: 98, phLevel: '4.0', temp: 'Room Temp', offset: '0.05kg', dietary: ['Vegan', 'GF'], ingredients: ['Tomato', 'Molasses', 'Smoked Paprika', 'Farm Honey'], availability: 'Available Today', prepTime: 2, calories: 75, allergens: ['None'], servingSize: 'Side pot', trendScore: 68, co2Score: 'low' },
    ],
  },
  {
    category: 'Hot Beverages',
    description: 'Grown on this farm. Sourced from the valley. Poured with care.',
    items: [
      { id: 'hb-1', name: 'Hot Milk', image: 'https://images.unsplash.com/photo-1559131397-f94da358f7ca?q=80&w=800', description: 'Fresh dairy paddock milk, steamed and served hot.', storyLine: 'Friesian dairy milk collected that morning, steamed and served. The way milk should be.', price: 300, field: 'Dairy Paddock', freshness: 100, phLevel: '6.5', temp: 'Steamed', offset: '0.1kg', dietary: ['Vegetarian', 'GF'], ingredients: ['Fresh Whole Milk'], availability: 'Available Today', prepTime: 3, calories: 150, allergens: ['Dairy'], servingSize: '300ml', trendScore: 48, co2Score: 'low' },
      { id: 'hb-2', name: 'African Tea (Chai)', image: 'https://images.unsplash.com/photo-1565799557988-f86dd7dce2da?q=80&w=800', description: 'Spiced chai brewed with masala, whole milk and black tea.', storyLine: 'Full-fat dairy milk, crushed ginger, cardamom and black tea simmered together until the flavours merge. The real thing.', price: 250, field: 'Dairy Paddock', freshness: 100, phLevel: '6.2', temp: 'Hot', offset: '0.1kg', dietary: ['Vegetarian', 'GF'], ingredients: ['Black Tea', 'Masala Spices', 'Whole Milk'], chefChoice: true, availability: 'Available Today', prepTime: 5, calories: 90, allergens: ['Dairy'], servingSize: '300ml', trendScore: 72, co2Score: 'low' },
      { id: 'hb-3', name: 'Black Tea', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800', description: 'Strong Kenyan black tea, steeped to strength.', storyLine: 'The tea that opens every day in Kenya. Made properly — steeped dark and served clean.', price: 200, field: 'Tea Garden', freshness: 100, phLevel: '5.8', temp: 'Hot', offset: '0.01kg', dietary: ['Vegan'], ingredients: ['Black Tea Leaves', 'Hot Water'], availability: 'Available Today', prepTime: 4, calories: 5, allergens: ['None'], servingSize: '300ml', trendScore: 55, co2Score: 'low' },
      { id: 'hb-4', name: 'Black Coffee', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800', description: 'Single-origin Kenyan beans, brewed clean.', storyLine: 'Roasted in-house. Ground fresh. No milk unless you ask. Kenyan coffee needs no assistance.', price: 200, field: 'Bean Roastery', freshness: 100, phLevel: '5.0', temp: 'Hot', offset: '0.01kg', dietary: ['Vegan', 'GF'], ingredients: ['Single-Origin Kenyan Coffee'], availability: 'Available Today', prepTime: 3, calories: 5, allergens: ['None'], servingSize: '250ml', trendScore: 65, co2Score: 'low' },
      { id: 'hb-5', name: 'Americano', image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=800', description: 'Double espresso diluted with hot water.', storyLine: 'Two shots of the Ubuntu roastery espresso, lengthened with hot water. Bold, clean, and exactly what a long morning requires.', price: 300, field: 'Bean Roastery', freshness: 100, phLevel: '5.0', temp: 'Hot', offset: '0.01kg', dietary: ['Vegan', 'GF'], ingredients: ['Double Espresso', 'Hot Water'], availability: 'Available Today', prepTime: 3, calories: 10, allergens: ['None'], servingSize: '300ml', trendScore: 68, co2Score: 'low' },
      { id: 'hb-6', name: 'Café Latte', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=800', description: 'Espresso with a generous pour of steamed dairy milk.', storyLine: 'Ubuntu roastery espresso with steamed dairy paddock milk. Smooth, warm and deeply satisfying.', price: 350, field: 'Bean Roastery', freshness: 100, phLevel: '6.0', temp: 'Steamed Hot', offset: '0.02kg', dietary: ['Vegetarian'], ingredients: ['Espresso', 'Steamed Dairy Milk'], availability: 'Available Today', prepTime: 4, calories: 140, allergens: ['Dairy'], servingSize: '350ml', trendScore: 74, co2Score: 'low' },
      { id: 'hb-7', name: 'Cappuccino', image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=800', description: 'Espresso, steamed milk and thick milk foam.', storyLine: 'Equal parts espresso, steamed milk and thick foam. A classic in the Ubuntu coffee bar.', price: 350, field: 'Bean Roastery', freshness: 100, phLevel: '6.0', temp: 'Steamed Hot', offset: '0.02kg', dietary: ['Vegetarian'], ingredients: ['Espresso', 'Steamed Milk', 'Milk Foam'], availability: 'Available Today', prepTime: 4, calories: 110, allergens: ['Dairy'], servingSize: '200ml', trendScore: 71, co2Score: 'low' },
      { id: 'hb-8', name: 'Mocha', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=800', description: 'Espresso, chocolate and steamed milk — the indulgent cup.', storyLine: 'Espresso pulled over house-made chocolate and finished with steamed dairy milk. The cup that says the morning is going well.', price: 400, field: 'Bean Roastery', freshness: 100, phLevel: '5.8', temp: 'Steamed Hot', offset: '0.02kg', dietary: ['Vegetarian'], ingredients: ['Espresso', 'Chocolate', 'Steamed Milk'], chefChoice: true, availability: 'Available Today', prepTime: 5, calories: 220, allergens: ['Dairy'], servingSize: '300ml', trendScore: 78, co2Score: 'low' },
      { id: 'hb-9', name: 'Herbal Infusions', image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?q=80&w=800', description: 'Lemon grass, mint, hibiscus, verbena — all at 350/=.', storyLine: 'Every herb in this cup grew within the Ubuntu boundary. The lemongrass from the herb garden. The hibiscus from the Garden Fence. The mint from beside the kitchen door.', price: 350, field: 'Herb Garden', freshness: 100, phLevel: '6.5', temp: 'Hot Infused', offset: '0.01kg', dietary: ['Vegan', 'GF'], ingredients: ['Choice of: Lemongrass / Mint / Hibiscus / Verbena'], availability: 'Available Today', prepTime: 6, calories: 5, allergens: ['None'], servingSize: '300ml', trendScore: 61, co2Score: 'low', customisable: true },
    ],
  },
  {
    category: 'Cold Beverages',
    description: 'Pressed, blended and chilled — straight from the orchard.',
    items: [
      { id: 'cb-1', name: 'Fresh Juice', image: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?q=80&w=800', description: 'Pressed daily — mango, pineapple, passion, orange or black passion.', storyLine: 'Pressed from whatever is at its best in the orchard this morning. No concentrate. No sugar. Just the fruit at its peak.', price: 400, field: 'Orchard', freshness: 100, phLevel: '4.0', temp: 'Chilled', offset: '0.1kg', dietary: ['Vegan', 'GF'], ingredients: ['Fresh Seasonal Fruit'], availability: 'Available Today', prepTime: 5, calories: 160, allergens: ['None'], servingSize: '350ml', trendScore: 80, co2Score: 'low', customisable: true },
      { id: 'cb-2', name: 'Tropical Fruit Medley', image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?q=80&w=800', description: 'A blend of tropical fruits — mango, pineapple, passion and orange.', storyLine: 'When choosing one fruit is impossible. All four orchard fruits blended together into a single vivid glass of the Ubuntu valley.', price: 700, field: 'Orchard', freshness: 100, phLevel: '4.2', temp: 'Chilled', offset: '0.15kg', dietary: ['Vegan', 'GF'], ingredients: ['Mango', 'Pineapple', 'Passion Fruit', 'Orange'], availability: 'Available Today', prepTime: 5, calories: 220, allergens: ['None'], servingSize: '400ml', trendScore: 77, co2Score: 'low' },
      { id: 'cb-3', name: 'Soda (350ml)', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800', description: 'Chilled soda — Coke, Fanta, Sprite or Stoney.', storyLine: 'Chilled and ready. Ask your server for available options.', price: 200, field: 'Bar', freshness: 100, phLevel: '3.5', temp: 'Chilled', offset: '0.35kg', dietary: ['Vegan', 'GF'], ingredients: ['Carbonated Soft Drink'], availability: 'Available Today', prepTime: 1, calories: 140, allergens: ['None'], servingSize: '350ml', trendScore: 50, co2Score: 'medium', customisable: true },
      { id: 'cb-4', name: 'Water Bottle (300ml)', image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=80&w=800', description: 'Ubuntu borehole-sourced water — still and pure.', storyLine: 'Borehole-sourced and purified on-site. Clean, cold and exactly what a long walk across the farm demands.', price: 200, field: 'Borehole', freshness: 100, phLevel: '7.2', temp: 'Chilled', offset: '0.3kg', dietary: ['Vegan', 'GF'], ingredients: ['Pure Water'], availability: 'Available Today', prepTime: 1, calories: 0, allergens: ['None'], servingSize: '300ml', trendScore: 35, co2Score: 'low' },
      { id: 'cb-5', name: 'Delmonte Juice Pack', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=800', description: 'Bottled Delmonte juice in your choice of flavour.', storyLine: 'Bottled Delmonte juice in your choice of flavour. Ready when you need something quick.', price: 700, field: 'Bar', freshness: 100, phLevel: '4.0', temp: 'Chilled', offset: '0.2kg', dietary: ['Vegan', 'GF'], ingredients: ['Delmonte Juice'], availability: 'Available Today', prepTime: 1, calories: 180, allergens: ['None'], servingSize: '200ml', trendScore: 40, co2Score: 'medium', customisable: true },
    ],
  },
  {
    category: 'Smoothies',
    description: 'Blended from the orchard. No powder. No preserve. Just the real thing.',
    items: [
      { id: 'sm-1', name: 'Pineapple Mango Smoothie', image: 'https://images.unsplash.com/photo-1546548970-71785318a17b?q=80&w=800', description: 'Fresh pineapple and mango blended together.', storyLine: 'Orchard pineapple and mango blended immediately. Bright, tropical, and absolutely no concentrate.', price: 450, field: 'Orchard', freshness: 100, phLevel: '4.2', temp: 'Chilled', offset: '0.1kg', dietary: ['Vegan', 'GF'], ingredients: ['Fresh Pineapple', 'Fresh Mango'], availability: 'Available Today', prepTime: 4, calories: 200, allergens: ['None'], servingSize: '400ml', trendScore: 75, co2Score: 'low' },
      { id: 'sm-2', name: 'Vanilla Smoothie', image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=800', description: 'Creamy vanilla-scented smoothie with banana and milk.', storyLine: 'Farm banana, whole dairy milk and a measure of house vanilla — blended thick until it becomes the most satisfying thing you have had all morning.', price: 450, field: 'Dairy Paddock', freshness: 100, phLevel: '6.0', temp: 'Chilled', offset: '0.1kg', dietary: ['Vegetarian', 'GF'], ingredients: ['Banana', 'Whole Milk', 'Vanilla'], availability: 'Available Today', prepTime: 4, calories: 240, allergens: ['Dairy'], servingSize: '400ml', trendScore: 68, co2Score: 'low' },
      { id: 'sm-3', name: 'Mix Fruits Smoothie', image: 'https://images.unsplash.com/photo-1638176066747-d65e8bb4fbb9?q=80&w=800', description: 'A tropical blend of all the orchard fruits in season.', storyLine: 'The full orchard in one glass. Whatever is ripe today goes in. No recipe, no fixed list — just the honest best of what the farm has at this moment.', price: 600, field: 'Orchard', freshness: 100, phLevel: '4.3', temp: 'Chilled', offset: '0.15kg', dietary: ['Vegan', 'GF'], ingredients: ['Assorted Seasonal Fruits'], chefChoice: true, availability: 'Available Today', prepTime: 5, calories: 220, allergens: ['None'], servingSize: '400ml', trendScore: 80, co2Score: 'low' },
    ],
  },
  {
    category: 'Milkshakes',
    description: 'Thick-blend, real ice cream, farm milk. The proper way to do it.',
    items: [
      { id: 'ms-1', name: 'Strawberry Milkshake', image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=800', description: 'Thick strawberry milkshake with real ice cream and farm milk.', storyLine: 'Fresh strawberry ice cream and full-fat dairy milk blended thick. Bright, fruity and deeply satisfying.', price: 700, field: 'Dairy Paddock', freshness: 100, phLevel: '6.0', temp: '-8°C Blended', offset: '0.1kg', dietary: ['Vegetarian'], ingredients: ['Strawberry Ice Cream', 'Full-Fat Dairy Milk'], availability: 'Available Today', prepTime: 6, calories: 470, allergens: ['Dairy'], servingSize: '400ml', trendScore: 79, co2Score: 'low' },
      { id: 'ms-2', name: 'Vanilla Milkshake', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=800', description: 'Classic thick vanilla milkshake with real ice cream.', storyLine: 'Thick-blend vanilla milkshake made with real ice cream and full-fat dairy paddock milk. Cold, indulgent, perfect.', price: 700, field: 'Dairy Paddock', freshness: 100, phLevel: '6.2', temp: '-8°C Blended', offset: '0.1kg', dietary: ['Vegetarian'], ingredients: ['Vanilla Ice Cream', 'Full-Fat Dairy Milk'], chefChoice: true, availability: 'Available Today', prepTime: 6, calories: 480, allergens: ['Dairy'], servingSize: '400ml', trendScore: 74, co2Score: 'low' },
      { id: 'ms-3', name: 'Chocolate Milkshake', image: 'https://images.unsplash.com/photo-1585262900234-06cc7f28d5a2?q=80&w=800', description: 'Rich chocolate milkshake with real cocoa ice cream.', storyLine: 'Rich chocolate ice cream from our in-house batch, blended with full-fat farm milk. Deep, cold and completely indulgent.', price: 700, field: 'Dairy Paddock', freshness: 100, phLevel: '6.0', temp: '-8°C Blended', offset: '0.1kg', dietary: ['Vegetarian'], ingredients: ['Chocolate Ice Cream', 'Full-Fat Dairy Milk', 'Cocoa'], availability: 'Available Today', prepTime: 6, calories: 510, allergens: ['Dairy'], servingSize: '400ml', trendScore: 77, co2Score: 'low' },
    ],
  },
  {
    category: 'Ice Cream',
    description: 'Churned daily. Cold. Simple. The perfect finish.',
    items: [
      { id: 'ic-1', name: 'Strawberry Ice Cream', image: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?q=80&w=800', description: 'Fresh strawberry ice cream, churned in-house.', storyLine: 'Churned daily from fresh strawberries and dairy paddock cream. A scoop of the farm in its sweetest form.', price: 400, field: 'Dairy Paddock', freshness: 100, phLevel: '5.8', temp: '-14°C', offset: '0.1kg', dietary: ['Vegetarian', 'GF'], ingredients: ['Fresh Strawberries', 'Dairy Cream', 'Sugar'], availability: 'Available Today', prepTime: 2, calories: 250, allergens: ['Dairy'], servingSize: '2 scoops', trendScore: 70, co2Score: 'low' },
      { id: 'ic-2', name: 'Vanilla Ice Cream', image: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?q=80&w=800', description: 'Classic vanilla bean ice cream, churned in-house.', storyLine: 'Real vanilla beans from the spice garden steeped into dairy cream and churned until thick and cold. The benchmark of every other flavour.', price: 400, field: 'Dairy Paddock', freshness: 100, phLevel: '6.0', temp: '-14°C', offset: '0.1kg', dietary: ['Vegetarian', 'GF'], ingredients: ['Vanilla Bean', 'Dairy Cream', 'Sugar'], chefChoice: true, availability: 'Available Today', prepTime: 2, calories: 280, allergens: ['Dairy'], servingSize: '2 scoops', trendScore: 66, co2Score: 'low' },
      { id: 'ic-3', name: 'Chocolate Ice Cream', image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?q=80&w=800', description: 'Rich dark chocolate ice cream, churned in-house.', storyLine: 'Single-origin cocoa from the bean roastery churned into dairy cream until the chocolate becomes something you remember.', price: 400, field: 'Bean Roastery', freshness: 100, phLevel: '5.6', temp: '-14°C', offset: '0.1kg', dietary: ['Vegetarian', 'GF'], ingredients: ['Dark Cocoa', 'Dairy Cream', 'Sugar'], availability: 'Available Today', prepTime: 2, calories: 310, allergens: ['Dairy'], servingSize: '2 scoops', trendScore: 72, co2Score: 'low' },
      { id: 'ic-4', name: 'Mix Combo Ice Cream', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=800', description: 'All three flavours — strawberry, vanilla and chocolate — in one bowl.', storyLine: 'For those who cannot choose. All three in a single bowl: strawberry, vanilla and chocolate. Three decisions solved in one order.', price: 1200, field: 'Dairy Paddock', freshness: 100, phLevel: '5.9', temp: '-14°C', offset: '0.3kg', dietary: ['Vegetarian', 'GF'], ingredients: ['Strawberry Ice Cream', 'Vanilla Ice Cream', 'Chocolate Ice Cream'], featured: true, availability: 'Available Today', pairing: 'Pairs perfectly with any meal', prepTime: 3, calories: 840, allergens: ['Dairy'], servingSize: '6 scoops — full combo', trendScore: 85, co2Score: 'low' },
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────
// DIETARY FILTERS & PAIRING MAP (unchanged)
// ─────────────────────────────────────────────────────────────────────
const DIETARY_FILTERS = [
  { label: 'All',          value: 'All'          },
  { label: 'Vegan',        value: 'Vegan'        },
  { label: 'Vegetarian',   value: 'Vegetarian'   },
  { label: 'GF / Keto',    value: 'GF'           },
  { label: 'High Protein', value: 'High Protein' },
  { label: 'Seafood',      value: 'Seafood'      },
]

const PAIRING_MAP: Record<string, string> = {
  'bk-1': 'hb-2',
  'bk-3': 'cb-1',
  'mc-1': 'ac-1',
  'mc-2': 'sa-1',
  'fs-1': 'ac-1',
  'fs-2': 'ac-2',
  'pg-2': 'hb-2',
  'sp-1': 'sa-4',
  'ic-4': 'hb-8',
}

const FLAT_ITEMS = MENU_ITEMS.flatMap(c => c.items)

// ─────────────────────────────────────────────────────────────────────
// FEAST STORE (unchanged)
// ─────────────────────────────────────────────────────────────────────
interface FeastStore {
  staged:      StagedItem[]
  activeOrder: ActiveOrder | null
  addingId:    string | null
  stageItem:    (item: MenuItem, category: string, qty: number) => void
  removeStaged: (id: string) => void
  updateQty:    (id: string, delta: number) => void
  setQty:       (id: string, qty: number) => void
  setNotes:     (id: string, notes: string) => void
  setCookPref:  (id: string, pref: string) => void
  clearStaged:  () => void
  setActiveOrder: (o: ActiveOrder | null) => void
  setAddingId:    (id: string | null) => void
  getStagedItem:  (id: string) => StagedItem | undefined
  stagedCount:    () => number
  stagedTotal:    () => number
}

const useFeastStore = create<FeastStore>((set, get) => ({
  staged: [], activeOrder: null, addingId: null,
  stageItem: (item, category, qty) => {
    set(s => {
      const idx = s.staged.findIndex(p => p.item.id === item.id)
      if (idx >= 0) { const next = [...s.staged]; next[idx] = { ...next[idx], qty: next[idx].qty + qty }; return { staged: next } }
      return { staged: [...s.staged, { item, qty, category }] }
    })
    set({ addingId: item.id })
    setTimeout(() => set({ addingId: null }), 1200)
  },
  removeStaged: (id) => set(s => ({ staged: s.staged.filter(p => p.item.id !== id) })),
  updateQty: (id, delta) => set(s => {
    const idx = s.staged.findIndex(p => p.item.id === id)
    if (idx < 0) return s
    const newQty = s.staged[idx].qty + delta
    if (newQty <= 0) return { staged: s.staged.filter(p => p.item.id !== id) }
    const next = [...s.staged]; next[idx] = { ...next[idx], qty: newQty }; return { staged: next }
  }),
  setQty: (id, qty) => set(s => { if (qty <= 0) return { staged: s.staged.filter(p => p.item.id !== id) }; return { staged: s.staged.map(p => p.item.id === id ? { ...p, qty } : p) } }),
  setNotes:    (id, notes) => set(s => ({ staged: s.staged.map(p => p.item.id === id ? { ...p, notes }             : p) })),
  setCookPref: (id, pref)  => set(s => ({ staged: s.staged.map(p => p.item.id === id ? { ...p, cookingPref: pref } : p) })),
  clearStaged: () => set({ staged: [], addingId: null }),
  setActiveOrder: (o)  => set({ activeOrder: o }),
  setAddingId:    (id) => set({ addingId: id }),
  getStagedItem: (id) => get().staged.find(p => p.item.id === id),
  stagedCount:   ()   => get().staged.reduce((s, p) => s + p.qty, 0),
  stagedTotal:   ()   => get().staged.reduce((s, p) => s + p.item.price * p.qty, 0),
}))

// ─────────────────────────────────────────────────────────────────────
// SYNC HELPER (unchanged)
// ─────────────────────────────────────────────────────────────────────
function useSyncToMainCart() {
  const { addItem } = useCartStore()
  return useCallback((item: MenuItem, category: string, qty: number) => {
    addItem({ id: item.id, cartKey: `restaurant-${item.id}`, name: item.name, price: item.price, tag: item.dietary?.[0] || 'Organic', category, unit: 'portion', qty })
  }, [addItem])
}

// ─────────────────────────────────────────────────────────────────────
// SMALL DISPLAY COMPONENTS (unchanged logic, polished classes)
// ─────────────────────────────────────────────────────────────────────
function DishBadge({ item }: { item: MenuItem }) {
  if (item.signature)  return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[var(--gold)]/15 border border-[var(--gold)]/40 text-[var(--gold)] text-[7px] uppercase tracking-widest font-mono rounded-full">★ Signature</span>
  if (item.chefChoice) return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/5 border border-white/20 text-white/60 text-[7px] uppercase tracking-widest font-mono rounded-full">Chef&apos;s Choice</span>
  if (item.seasonal)   return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[var(--neon)]/10 border border-[var(--neon)]/30 text-[var(--neon)] text-[7px] uppercase tracking-widest font-mono rounded-full">Seasonal</span>
  return null
}

function AvailabilityBadge({ item }: { item: MenuItem }) {
  if (!item.availability) return null
  const isLow      = typeof item.availabilityCount === 'number' && item.availabilityCount <= 3
  const isTomorrow = item.availability === 'Harvest Tomorrow'
  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-[7px] uppercase tracking-widest font-mono border rounded-full ${isLow ? 'bg-red-500/10 border-red-500/30 text-red-400' : isTomorrow ? 'bg-white/5 border-white/10 text-white/30' : 'bg-[var(--neon)]/5 border-[var(--neon)]/20 text-[var(--neon)]/60'}`}>
      {item.availability}
    </span>
  )
}

function TrendBar({ score }: { score?: number }) {
  if (!score || score < 60) return null
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5 items-end">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="w-0.5 rounded-full transition-all duration-500"
            style={{ height: `${5 + i * 2}px`, background: i <= Math.ceil(score / 20) ? 'var(--gold)' : 'rgba(255,255,255,0.08)' }} />
        ))}
      </div>
      <span className="font-mono text-[7px] text-[var(--gold)]/50 uppercase tracking-widest">
        {score >= 90 ? '🔥 Trending' : score >= 75 ? 'Popular' : 'Liked'}
      </span>
    </div>
  )
}

function Co2Badge({ score }: { score?: 'low' | 'medium' | 'high' }) {
  if (!score || score === 'medium') return null
  return (
    <span className={`px-2 py-0.5 text-[6px] uppercase tracking-widest font-mono border rounded-full ${score === 'low' ? 'bg-[var(--neon)]/5 border-[var(--neon)]/20 text-[var(--neon)]/50' : 'bg-orange-500/10 border-orange-500/20 text-orange-400'}`}>
      ◉ {score === 'low' ? 'Low Carbon' : 'Higher Impact'}
    </span>
  )
}

function DishImage({ src, alt, className, onClick }: { src: string; alt: string; className?: string; onClick?: () => void }) {
  const [err, setErr] = useState(false)
  return (
    <Image src={err ? 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800' : src}
      alt={alt} fill loading="lazy" className={className} onError={() => setErr(true)} onClick={onClick} />
  )
}

// ─────────────────────────────────────────────────────────────────────
// FLOATING FEAST ORB (unchanged logic, polished styling)
// ─────────────────────────────────────────────────────────────────────
function FeastOrb() {
  const { staged, stagedCount, stagedTotal } = useFeastStore()
  const { openCart } = useCartStore()
  const [expanded, setExpanded] = useState(false)
  const [pulse, setPulse]       = useState(false)
  const prevCount = useRef(0)
  const count = stagedCount()
  const total = stagedTotal()

  useEffect(() => {
    if (count > prevCount.current) { setPulse(true); setTimeout(() => setPulse(false), 700) }
    prevCount.current = count
  }, [count])

  if (count === 0) return null

  return (
    <div className="fixed bottom-7 right-7 z-[9980] flex flex-col items-end gap-2">
      {expanded && (
        <div className="bg-[#0a0a08]/97 border border-[var(--gold)]/20 rounded-2xl p-4 min-w-[260px] shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
          style={{ animation: 'orbExpand 0.2s ease' }}>
          <p className="font-body text-[8px] tracking-[0.22em] uppercase text-white/28 mb-3">Feast Staged</p>
          {staged.slice(0, 4).map(s => (
            <div key={s.item.id} className="flex justify-between mb-1.5">
              <span className="font-body text-[10px] text-white/55 max-w-[140px] truncate">{s.qty > 1 ? `×${s.qty} ` : ''}{s.item.name}</span>
              <span className="font-body text-[10px] text-[var(--gold)] ml-2">KES {(s.item.price * s.qty).toLocaleString()}</span>
            </div>
          ))}
          {staged.length > 4 && <p className="font-body text-[9px] text-white/20 mb-1.5">+{staged.length - 4} more</p>}
          <div className="border-t border-white/6 pt-3 mt-2 flex justify-between items-center">
            <span className="font-body text-[9px] text-white/30 tracking-[0.12em] uppercase">Total</span>
            <span className="font-display text-lg text-[var(--gold)]">KES {total.toLocaleString()}</span>
          </div>
          <button onClick={() => { openCart(); setExpanded(false) }}
            className="mt-3 w-full py-2.5 bg-[var(--gold)] text-black font-body text-[9px] tracking-[0.16em] uppercase font-bold rounded-xl hover:bg-[var(--gold-light)] transition-colors">
            View Cart & Pay →
          </button>
        </div>
      )}
      <button onMouseEnter={() => setExpanded(true)} onMouseLeave={() => setExpanded(false)} onClick={() => openCart()}
        className="flex items-center gap-2.5 px-5 py-3 rounded-full font-body text-[9px] tracking-[0.12em] uppercase font-bold text-black transition-all duration-300 hover:scale-105"
        style={{ background: 'linear-gradient(135deg, var(--gold) 0%, #b8913a 100%)', boxShadow: pulse ? '0 0 0 8px rgba(212,168,83,0.15), 0 8px 32px rgba(212,168,83,0.45)' : '0 6px 28px rgba(212,168,83,0.32)', transform: pulse ? 'scale(1.05)' : expanded ? 'scale(1.02)' : 'scale(1)', animation: 'orbIn 0.3s ease' }}>
        <span>🛒 {count} {count !== 1 ? 'Items' : 'Item'}</span>
        <span className="w-px h-3.5 bg-black/20" />
        <span className="font-display text-[0.95rem]">KES {total.toLocaleString()}</span>
      </button>
      <style suppressHydrationWarning>{`
        @keyframes orbIn     { from{opacity:0;transform:translateY(8px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes orbExpand { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// SMART PAIRING CARD (unchanged logic)
// ─────────────────────────────────────────────────────────────────────
function SmartPairingCard({ onAdd }: { onAdd: (item: MenuItem, category: string) => void }) {
  const { staged } = useFeastStore()
  const [dismissed, setDismissed] = useState<string[]>([])

  const suggestion = useMemo(() => {
    for (const s of staged) {
      const pairId = PAIRING_MAP[s.item.id]
      if (!pairId || dismissed.includes(pairId) || staged.find(x => x.item.id === pairId)) continue
      const pair = FLAT_ITEMS.find(i => i.id === pairId)
      if (pair) return { trigger: s.item, pair }
    }
    return null
  }, [staged, dismissed])

  if (!suggestion) return null
  const { trigger, pair } = suggestion

  return (
    <div className="fixed bottom-24 left-7 z-[9970] bg-[#0a0a08]/97 border border-[var(--gold)]/18 rounded-2xl p-4 max-w-[280px] shadow-[0_16px_48px_rgba(0,0,0,0.6)]"
      style={{ animation: 'orbIn 0.3s ease' }}>
      <p className="font-body text-[8px] tracking-[0.18em] uppercase text-[var(--gold)] mb-2">◈ Chef Pairing Suggestion</p>
      <p className="font-body text-[10px] text-white/40 mb-3 leading-relaxed">
        Your <span className="text-white/70">{trigger.name}</span> pairs beautifully with:
      </p>
      <div className="flex gap-2.5 items-center mb-3">
        <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
          <Image src={pair.image} alt={pair.name} fill className="object-cover" />
        </div>
        <div>
          <p className="font-body text-[11px] text-[var(--cream)] mb-0.5">{pair.name}</p>
          <p className="font-display text-[0.9rem] text-[var(--gold)]">KES {pair.price.toLocaleString()}</p>
        </div>
      </div>
      <div className="flex gap-1.5">
        <button onClick={() => { onAdd(pair, pair.dietary[0] || 'Organic'); setDismissed(d => [...d, pair.id]) }}
          className="flex-1 py-2 bg-[var(--gold)] text-black font-body text-[8px] tracking-[0.12em] uppercase font-bold rounded-lg hover:bg-[var(--gold-light)] transition-colors">
          Add to Feast
        </button>
        <button onClick={() => setDismissed(d => [...d, pair.id])}
          className="px-3 py-2 bg-transparent border border-white/8 rounded-lg font-body text-[9px] text-white/28 hover:text-white/50 transition-colors">✕</button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// ORDER STATUS BAR (unchanged logic, polished layout)
// ─────────────────────────────────────────────────────────────────────
function OrderStatusBar({ order }: { order: ActiveOrder }) {
  const currentIdx = ORDER_STEPS.findIndex(s => s.key === order.status)
  const [, setTick] = useState(0)
  useEffect(() => { const t = setInterval(() => setTick(p => p + 1), 1000); return () => clearInterval(t) }, [])
  const elapsed = Math.floor((Date.now() - order.placedAt) / 1000)
  const minutes = Math.floor(elapsed / 60)
  const seconds = elapsed % 60

  return (
    <div className="bg-[#0a1a0a] border-b border-[var(--neon)]/20 py-4 sticky top-[72px] z-40 backdrop-blur-md">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 bg-[var(--neon)] rounded-full animate-pulse" />
            <span className="font-mono text-[10px] uppercase text-[var(--neon)] tracking-widest">Feast #{order.id}</span>
            <span className="font-mono text-[9px] text-white/30">· {minutes}m {String(seconds).padStart(2, '0')}s</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[9px] text-white/30 uppercase">{order.items.length} item{order.items.length !== 1 ? 's' : ''} · KES {order.total.toLocaleString()}</span>
            {order.status === 'ready' && (
              <span className="px-3 py-1 bg-[var(--gold)]/20 border border-[var(--gold)]/40 text-[var(--gold)] text-[8px] font-mono uppercase tracking-widest animate-pulse rounded-full">★ Your table is ready</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-0 overflow-x-auto">
          {ORDER_STEPS.map((step, i) => {
            const done = i < currentIdx, active = i === currentIdx
            return (
              <div key={step.key} className="flex items-center flex-shrink-0">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-700 ${done ? 'bg-[var(--neon)] border-[var(--neon)]' : active ? 'bg-transparent border-[var(--neon)] shadow-[0_0_12px_rgba(0,255,65,0.5)]' : 'bg-transparent border-white/10'}`}>
                    {done ? <span className="text-black text-[8px] font-bold">✓</span> : active ? <div className="w-2 h-2 bg-[var(--neon)] rounded-full animate-ping" /> : <div className="w-1.5 h-1.5 bg-white/10 rounded-full" />}
                  </div>
                  <span className={`text-[7px] uppercase tracking-wide whitespace-nowrap transition-colors duration-500 ${active ? 'text-[var(--neon)] font-bold' : done ? 'text-white/40' : 'text-white/15'}`}>{step.label}</span>
                </div>
                {i < ORDER_STEPS.length - 1 && <div className={`w-8 md:w-16 h-px mx-1 transition-all duration-700 flex-shrink-0 ${i < currentIdx ? 'bg-[var(--neon)]' : 'bg-white/10'}`} />}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// LOG MODAL (unchanged logic, polished layout + rounded corners)
// ─────────────────────────────────────────────────────────────────────
function LogModal({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  const { stageItem, updateQty, getStagedItem, stagedCount, addingId } = useFeastStore()
  const { openCart } = useCartStore()
  const syncToCart = useSyncToMainCart()

  const [localQty, setLocalQty]   = useState(1)
  const [zoomed,   setZoomed]     = useState(false)
  const [zoomPos,  setZoomPos]    = useState({ x: 0, y: 0 })
  const [activeTab, setActiveTab] = useState<'story' | 'specs' | 'nutrition' | 'provenance'>('story')
  const [cookPref,  setCookPref]  = useState('')
  const [note,      setNote]      = useState('')

  const stagedItem = getStagedItem(item.id)
  const isStaged   = !!stagedItem
  const fCount     = stagedCount()

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') { if (zoomed) setZoomed(false); else onClose() } }
    window.addEventListener('keydown', fn)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', fn); document.body.style.overflow = '' }
  }, [zoomed, onClose])

  const handleZoomMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomed) return
    const rect = e.currentTarget.getBoundingClientRect()
    setZoomPos({ x: ((e.clientX - rect.left) / rect.width - 0.5) * -40, y: ((e.clientY - rect.top) / rect.height - 0.5) * -40 })
  }, [zoomed])

  const handleFirstAdd = useCallback(() => {
    stageItem(item, item.dietary[0] || 'Organic', localQty)
    syncToCart(item, 'restaurant', localQty)
  }, [stageItem, syncToCart, item, localQty])

  const handleAddMore = useCallback(() => {
    updateQty(item.id, localQty)
    syncToCart(item, 'restaurant', localQty)
  }, [updateQty, syncToCart, item, localQty])

  const tabs = [
    { key: 'story'      as const, label: 'Story'      },
    { key: 'specs'      as const, label: 'Specs'      },
    { key: 'nutrition'  as const, label: 'Nutrition'  },
    { key: 'provenance' as const, label: 'Provenance' },
  ]
  const cookOptions = item.customisable ? ['Wet Fry', 'Dry Fry', 'Grilled', 'Choma', 'Boiled'] : []

  return (
    <>
      <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/95 backdrop-blur-2xl p-0 sm:p-4 md:p-6">
        <div className="absolute inset-0" onClick={onClose} />
        <div className="relative w-full max-w-6xl h-[95dvh] sm:h-[90vh] flex flex-col md:flex-row bg-[#060606] overflow-hidden shadow-[0_0_120px_rgba(0,0,0,0.9)] rounded-t-3xl sm:rounded-2xl border border-white/[0.06]">

          {/* ── Left: image panel ── */}
          <div className="relative md:w-[46%] h-56 sm:h-72 md:h-full flex-shrink-0 bg-black overflow-hidden group rounded-t-3xl sm:rounded-tl-2xl sm:rounded-bl-2xl md:rounded-tr-none">
            <div className="relative w-full h-full cursor-zoom-in overflow-hidden" onClick={() => setZoomed(true)} onMouseMove={handleZoomMove}>
              <DishImage src={item.image} alt={item.name} className="object-cover transition-transform duration-[2s] group-hover:scale-105 grayscale-[20%] group-hover:grayscale-0" />
              <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.1) 2px,rgba(255,255,255,0.1) 4px)' }} />
              {['top-4 left-4 border-t-2 border-l-2','top-4 right-4 border-t-2 border-r-2','bottom-4 left-4 border-b-2 border-l-2','bottom-4 right-4 border-b-2 border-r-2'].map((c, i) => (
                <div key={i} className={`absolute w-7 h-7 ${c} border-[var(--neon)]/30 pointer-events-none`} />
              ))}
              <div className="absolute top-3 right-12 bg-black/60 backdrop-blur-sm px-2 py-1 text-[8px] text-[var(--neon)] font-mono uppercase tracking-widest border border-[var(--neon)]/20 rounded-md">{item.freshness}% FRESH</div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 px-5 py-4 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none">
              <p className="font-display text-2xl text-[var(--gold)]">KES {item.price.toLocaleString()}</p>
              {item.servingSize && <p className="font-mono text-[8px] text-white/30 mt-0.5">{item.servingSize}</p>}
            </div>
          </div>

          {/* ── Right: detail panel ── */}
          <div className="flex-1 flex flex-col overflow-hidden min-h-0">
            {/* Header */}
            <div className="flex items-center justify-between px-5 sm:px-8 py-4 border-b border-white/5 flex-shrink-0">
              <div className="flex flex-wrap gap-2">
                <DishBadge item={item} />
                <AvailabilityBadge item={item} />
                {item.trendScore && item.trendScore >= 75 && (
                  <span className="px-2.5 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[7px] uppercase tracking-widest font-mono rounded-full">
                    {item.trendScore >= 90 ? '🔥 Hot Tonight' : '↑ Trending'}
                  </span>
                )}
              </div>
              {fCount > 0 && (
                <button onClick={() => { onClose(); openCart() }} className="flex items-center gap-2 bg-[var(--gold)] text-black font-bold uppercase tracking-widest px-3 py-2 text-[8px] rounded-xl hover:bg-[var(--gold-light)] transition-colors">
                  <span className="w-4 h-4 rounded-full bg-black text-[var(--gold)] flex items-center justify-center text-[8px] font-black">{fCount}</span>
                  View Feast
                </button>
              )}
            </div>

            {/* Title */}
            <div className="px-5 sm:px-8 pt-5 pb-3 flex-shrink-0">
              <h2 className="font-display text-2xl sm:text-3xl text-white uppercase tracking-tight leading-[0.9] mb-2">{item.name}</h2>
              <div className="flex flex-wrap items-center gap-3 mt-1.5">
                {item.pairing && <p className="font-mono text-[8px] text-[var(--gold)]/50 uppercase tracking-widest">◈ {item.pairing}</p>}
                <TrendBar score={item.trendScore} />
                <Co2Badge score={item.co2Score} />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-0 border-b border-white/5 px-5 sm:px-8 flex-shrink-0 overflow-x-auto">
              {tabs.map(t => (
                <button key={t.key} onClick={() => setActiveTab(t.key)}
                  className={`pb-3 pr-5 text-[9px] uppercase tracking-widest whitespace-nowrap border-b-2 transition-all duration-200 ${activeTab === t.key ? 'border-[var(--gold)] text-[var(--gold)]' : 'border-transparent text-white/25 hover:text-white/50'}`}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-5" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(200,168,75,0.15) transparent' }}>
              {activeTab === 'story' && (
                <div className="space-y-4">
                  <p className="font-body text-sm text-white/50 italic leading-relaxed">&ldquo;{item.storyLine || item.description}&rdquo;</p>
                  <p className="font-body text-xs text-white/30 leading-relaxed">{item.description}</p>
                  <div>
                    <p className="text-[8px] uppercase tracking-widest text-white/20 mb-2.5">Ingredients</p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.ingredients.map(ing => <span key={ing} className="px-2.5 py-1 bg-white/[0.03] border border-white/5 text-[10px] text-white/50 font-body rounded-lg">{ing}</span>)}
                    </div>
                  </div>
                  {item.allergens && item.allergens[0] !== 'None' && (
                    <div>
                      <p className="text-[8px] uppercase tracking-widest text-white/20 mb-2.5">Allergens</p>
                      <div className="flex flex-wrap gap-1.5">{item.allergens.map(a => <span key={a} className="px-2 py-1 bg-red-500/10 border border-red-500/20 text-[9px] text-red-400 uppercase tracking-wider rounded-lg">{a}</span>)}</div>
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'specs' && (
                <div className="grid grid-cols-2 gap-2.5">
                  {([
                    ['Source',      item.field || item.animal || '—'],
                    ['Temperature', item.temp],
                    ['pH Level',    item.phLevel],
                    ['Offset',      `${item.offset} CO₂e`],
                    ...(item.prepTime    ? [['Prep Time',  `${item.prepTime} min`]] : []),
                    ...(item.servingSize ? [['Serving',     item.servingSize]]       : []),
                  ] as [string,string][]).map(([k, v]) => (
                    <div key={k} className="p-3 border border-white/5 bg-white/[0.02] rounded-xl">
                      <p className="text-[7px] uppercase tracking-widest text-white/25 mb-1">{k}</p>
                      <p className="font-mono text-[11px] text-white/80 truncate">{v}</p>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'nutrition' && (
                <div className="space-y-3">
                  {([
                    ['Calories',     item.calories ? `${item.calories} kcal` : '—'],
                    ['Serving Size', item.servingSize || '—'],
                    ['Dietary Tags', item.dietary.join(', ')],
                    ['Allergens',    item.allergens?.join(', ') || 'None'],
                    ['Freshness',    `${item.freshness}%`],
                  ] as [string,string][]).map(([k, v]) => (
                    <div key={k} className="flex justify-between items-start border-b border-white/5 pb-3">
                      <span className="text-[9px] uppercase tracking-widest text-white/25">{k}</span>
                      <span className="font-mono text-[10px] text-white/70 text-right max-w-[55%]">{v}</span>
                    </div>
                  ))}
                  <div className="pt-1">
                    <div className="flex justify-between mb-1.5"><span className="text-[8px] uppercase tracking-widest text-white/20">Freshness</span><span className="font-mono text-[9px] text-[var(--neon)]">{item.freshness}%</span></div>
                    <div className="w-full h-1.5 bg-white/8 rounded-full overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-[var(--neon)] to-emerald-400 transition-all duration-1000" style={{ width: `${item.freshness}%` }} /></div>
                  </div>
                </div>
              )}
              {activeTab === 'provenance' && (
                <div className="space-y-3">
                  {([
                    ['Source Location', item.field],
                    ['Animal Tag',      item.animal || 'Farm Sourced'],
                    ['Harvest Time',    'Dawn — same day'],
                    ['Distance',        '< 2km from kitchen'],
                    ['Logistics',       'Zero-emission, on-farm'],
                    ['Certification',   'Ubuntu Farm Organic Standard'],
                  ] as [string,string][]).map(([k, v]) => (
                    <div key={k} className="flex justify-between items-start border-b border-white/5 pb-3">
                      <span className="text-[9px] uppercase tracking-widest text-white/25">{k}</span>
                      <span className="font-mono text-[10px] text-white/70 text-right max-w-[60%]">{v}</span>
                    </div>
                  ))}
                  <div className="p-4 border border-[var(--neon)]/10 bg-[var(--neon)]/[0.03] rounded-xl">
                    <p className="font-mono text-[8px] text-[var(--neon)]/50 uppercase tracking-widest mb-1">Traceability Chain</p>
                    <p className="font-body text-[10px] text-white/30 italic leading-relaxed">Soil tested weekly · Animal welfare certified · No synthetic inputs · Carbon logged per batch</p>
                  </div>
                </div>
              )}
            </div>

            {/* CTA panel */}
            <div className="px-5 sm:px-8 py-5 border-t border-white/5 bg-black/60 flex-shrink-0 space-y-3">
              {cookOptions.length > 0 && (
                <div>
                  <p className="text-[8px] uppercase tracking-widest text-white/25 mb-2">Cooking Preference</p>
                  <div className="flex gap-2 flex-wrap">
                    {cookOptions.map(opt => (
                      <button key={opt} onClick={() => setCookPref(opt === cookPref ? '' : opt)}
                        className={`px-3 py-1.5 text-[8px] uppercase tracking-wider border transition-all rounded-lg ${cookPref === opt ? 'border-[var(--gold)]/60 text-[var(--gold)] bg-[var(--gold)]/5' : 'border-white/10 text-white/30 hover:border-white/20'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <input type="text" placeholder="Special request or note (optional)" value={note} onChange={e => setNote(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/8 px-4 py-2.5 text-[10px] text-white/50 placeholder:text-white/20 outline-none font-mono focus:border-[var(--gold)]/20 transition-colors rounded-xl" />
              <div className="flex items-center gap-3">
                <span className="text-[8px] uppercase tracking-widest text-white/25">Qty</span>
                <div className="flex items-center border border-white/10 rounded-xl overflow-hidden">
                  <button onClick={() => setLocalQty(q => Math.max(1, q - 1))} className="w-9 h-9 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all">−</button>
                  <span className="w-10 text-center font-mono text-sm text-white/80">{localQty}</span>
                  <button onClick={() => setLocalQty(q => q + 1)} className="w-9 h-9 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all">+</button>
                </div>
                <span className="font-display text-lg text-[var(--gold)] ml-auto">KES {(item.price * localQty).toLocaleString()}</span>
              </div>
              {!isStaged ? (
                <button onClick={handleFirstAdd}
                  className={`w-full py-3.5 font-bold text-[10px] uppercase tracking-[0.25em] rounded-xl transition-all duration-500 ${addingId === item.id ? 'bg-[var(--neon)] text-black scale-[0.98]' : 'bg-[var(--gold)] text-black hover:bg-[var(--gold-light)]'}`}>
                  {addingId === item.id ? '✓ Added to Feast' : `Add ${localQty > 1 ? `×${localQty} ` : ''}to Feast`}
                </button>
              ) : (
                <div className="flex gap-2.5">
                  <div className="flex-1 flex items-center justify-between px-4 py-3 bg-[var(--gold)]/8 border border-[var(--gold)]/30 rounded-xl">
                    <span className="font-mono text-[9px] text-[var(--gold)] uppercase tracking-widest">✓ In Feast ×{stagedItem.qty}</span>
                    <span className="font-display text-base text-[var(--gold)]">KES {(item.price * stagedItem.qty).toLocaleString()}</span>
                  </div>
                  <button onClick={handleAddMore} className="px-4 py-3 border border-[var(--gold)]/40 text-[var(--gold)] text-[9px] uppercase tracking-widest hover:bg-[var(--gold)]/10 transition-all font-mono rounded-xl">
                    +{localQty}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Close button */}
          <button onClick={onClose} className="absolute top-0 right-0 z-10 px-5 py-4 bg-white/[0.03] hover:bg-red-500/10 border-l border-b border-white/8 font-mono text-[9px] text-white/30 hover:text-white transition-all rounded-tr-2xl rounded-bl-lg">
            ✕
          </button>
        </div>
      </div>

      {zoomed && (
        <div className="fixed inset-0 z-[400] bg-black/98 flex items-center justify-center cursor-zoom-out overflow-hidden" onClick={() => setZoomed(false)} onMouseMove={handleZoomMove}>
          <div className="absolute top-6 left-1/2 -translate-x-1/2 font-mono text-[8px] text-white/20 uppercase tracking-widest z-10">Click or Esc to close</div>
          <div className="relative w-full max-w-4xl aspect-[4/3] overflow-hidden rounded-2xl">
            <div className="w-full h-full" style={{ transform: `translate(${zoomPos.x}px, ${zoomPos.y}px) scale(1.4)`, transition: 'transform 0.1s ease-out' }}>
              <Image src={item.image} alt={item.name} fill className="object-cover" sizes="100vw" />
            </div>
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none">
              <div className="bg-black/70 border border-[var(--neon)]/20 px-4 py-2 rounded-xl">
                <p className="font-mono text-[8px] text-[var(--neon)]/60 uppercase tracking-widest">{item.name}</p>
                <p className="font-mono text-[8px] text-white/30">{item.field} · {item.freshness}% fresh</p>
              </div>
              <div className="bg-black/70 border border-white/10 px-4 py-2 rounded-xl">
                <p className="font-display text-xl text-[var(--gold)]">KES {item.price.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────
// MENU CARD — polished layout, consistent spacing, tilt preserved
// ─────────────────────────────────────────────────────────────────────
function MenuCard({ item, category, onOpenLog }: { item: MenuItem; category: string; onOpenLog: (item: MenuItem) => void }) {
  const { stageItem, getStagedItem, addingId } = useFeastStore()
  const { openCart } = useCartStore()
  const syncToCart = useSyncToMainCart()

  const [localQty,  setLocalQty]  = useState(1)
  const [favorited, setFavorited] = useState(false)
  const [hovered,   setHovered]   = useState(false)
  const [tilt,      setTilt]      = useState({ x: 0, y: 0 })

  const stagedItem = getStagedItem(item.id)
  const isStaged   = !!stagedItem
  const stagedQty  = stagedItem?.qty ?? 0

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setTilt({ x: ((e.clientY - rect.top) / rect.height - 0.5) * 3, y: ((e.clientX - rect.left) / rect.width - 0.5) * -3 })
  }, [])

  const handleAddToFeast = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (isStaged) { onOpenLog(item); return }
    stageItem(item, category, localQty)
    syncToCart(item, category, localQty)
  }, [isStaged, stageItem, syncToCart, item, category, localQty, onOpenLog])

  return (
    <div
      className="group flex flex-col h-full overflow-hidden rounded-2xl"
      style={{
        background:   isStaged ? 'rgba(200,168,75,0.04)' : 'rgba(255,255,255,0.02)',
        border:       isStaged ? '1px solid rgba(200,168,75,0.2)' : '1px solid rgba(255,255,255,0.05)',
        transition:   'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        transform:    hovered ? `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-3px)` : 'perspective(600px) rotateX(0) rotateY(0) translateY(0)',
        boxShadow:    isStaged ? '0 0 0 1px rgba(200,168,75,0.1), 0 12px 40px rgba(200,168,75,0.06)' : hovered ? '0 20px 48px rgba(0,0,0,0.5)' : '0 4px 16px rgba(0,0,0,0.2)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }) }}
      onMouseMove={handleMouseMove}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden cursor-pointer rounded-t-2xl" onClick={() => onOpenLog(item)}>
        <DishImage src={item.image} alt={item.name} className="object-cover transition-all duration-[2s] group-hover:scale-[1.08] contrast-[1.05] saturate-[1.05] grayscale-[30%] group-hover:grayscale-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Freshness badge */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 text-[7px] text-[var(--neon)] font-mono uppercase tracking-widest border border-[var(--neon)]/20 rounded-lg">
          {item.freshness}% FRESH
        </div>

        {/* Favourite */}
        <button onClick={e => { e.stopPropagation(); setFavorited(f => !f) }}
          className="absolute top-3 left-3 w-7 h-7 bg-black/50 border border-white/10 rounded-lg flex items-center justify-center hover:border-[var(--gold)]/40 transition-all z-10">
          <span className={`text-[11px] transition-colors ${favorited ? 'text-[var(--gold)]' : 'text-white/20 hover:text-white/50'}`}>{favorited ? '♥' : '♡'}</span>
        </button>

        {/* In-feast overlay */}
        {isStaged && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
            <span className="px-4 py-2 border border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)] font-mono text-[9px] uppercase tracking-widest rounded-full">✓ In Feast ×{stagedQty}</span>
          </div>
        )}

        {/* Chef pick / trending overlays */}
        {item.featured && item.signature && !isStaged && (
          <div className="absolute bottom-10 left-3 px-2 py-1 bg-black/70 backdrop-blur-sm border border-[var(--gold)]/20 text-[var(--gold)] font-mono text-[7px] uppercase tracking-widest rounded-lg">🔥 Chef&apos;s Pick Tonight</div>
        )}
        {item.trendScore && item.trendScore >= 85 && !isStaged && !item.featured && (
          <div className="absolute top-10 right-3 px-2 py-0.5 bg-orange-500/15 border border-orange-500/30 text-orange-300 font-mono text-[7px] uppercase tracking-widest rounded-lg">🔥 Hot</div>
        )}

        {/* Price */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="font-display text-xl text-[var(--cream)]">KES {item.price.toLocaleString()}</div>
          <div className="text-[8px] text-[var(--neon)]/50 tracking-widest uppercase font-mono mt-0.5">[{item.id}]</div>
        </div>

        {/* Hover hint */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <span className="bg-black/60 backdrop-blur-sm border border-white/10 px-4 py-2 font-mono text-[8px] text-white/50 uppercase tracking-widest rounded-full">View Full Log →</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <DishBadge item={item} />
          <AvailabilityBadge item={item} />
        </div>

        {/* Name */}
        <h3 className="font-display text-xl sm:text-2xl text-[var(--cream)] mb-1.5 group-hover:text-[var(--gold)] transition-colors duration-300 uppercase tracking-tight leading-none">{item.name}</h3>

        {/* Story */}
        <p className="font-body text-xs text-white/40 leading-relaxed mb-3 italic line-clamp-2">&ldquo;{item.storyLine || item.description}&rdquo;</p>

        {/* Pairing */}
        {item.pairing && <p className="text-[8px] uppercase tracking-widest text-[var(--gold)]/40 mb-3 font-mono">◈ {item.pairing}</p>}

        {/* Trend + carbon */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <TrendBar score={item.trendScore} />
          <Co2Badge score={item.co2Score} />
        </div>

        {/* Specs grid */}
        <div className="grid grid-cols-2 border border-white/8 mb-4 bg-black/30 rounded-xl overflow-hidden text-center">
          <div className="p-2.5 border-r border-white/8">
            <div className="text-[7px] uppercase text-white/25 mb-0.5">Source</div>
            <div className="text-[10px] text-white/70 font-mono truncate px-1">{item.field || item.animal}</div>
          </div>
          <div className="p-2.5">
            <div className="text-[7px] uppercase text-white/25 mb-0.5">Freshness</div>
            <div className="text-[10px] text-[var(--neon)]">{item.freshness}%</div>
          </div>
          {item.prepTime && (
            <div className="p-2.5 border-r border-t border-white/8">
              <div className="text-[7px] uppercase text-white/25 mb-0.5">Prep</div>
              <div className="text-[10px] text-white/60 font-mono">{item.prepTime}m</div>
            </div>
          )}
          {item.servingSize && (
            <div className="p-2.5 border-t border-white/8">
              <div className="text-[7px] uppercase text-white/25 mb-0.5">Serving</div>
              <div className="text-[10px] text-white/60 font-mono truncate">{item.servingSize}</div>
            </div>
          )}
        </div>

        {/* Qty selector (only when not staged) */}
        {!isStaged && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[8px] uppercase tracking-widest text-white/25">Qty</span>
            <button onClick={e => { e.stopPropagation(); setLocalQty(q => Math.max(1, q - 1)) }}
              className="w-6 h-6 border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all text-xs flex items-center justify-center rounded-md">−</button>
            <span className="font-mono text-sm text-white/70 w-5 text-center">{localQty}</span>
            <button onClick={e => { e.stopPropagation(); setLocalQty(q => q + 1) }}
              className="w-6 h-6 border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all text-xs flex items-center justify-center rounded-md">+</button>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-2 mt-auto">
          <button onClick={() => onOpenLog(item)}
            className="px-4 py-2.5 border border-white/10 text-[9px] uppercase tracking-widest text-white/40 hover:text-white hover:border-white/25 transition-colors rounded-xl flex-shrink-0">
            Log
          </button>
          <button onClick={handleAddToFeast}
            className={`flex-1 py-2.5 text-[9px] uppercase tracking-widest font-bold transition-all duration-400 rounded-xl ${
              addingId === item.id ? 'bg-[var(--neon)] text-black scale-[0.97]'
              : isStaged ? 'bg-[var(--gold)]/15 border border-[var(--gold)]/40 text-[var(--gold)]'
              : 'bg-[var(--gold)] text-black hover:bg-[var(--gold-light)] active:scale-[0.98]'
            }`}>
            {addingId === item.id ? '✓ Added'
              : isStaged ? `✓ In Feast ×${stagedQty}`
              : `Add ${localQty > 1 ? `×${localQty} ` : ''}to Feast`}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// LIVE KITCHEN TICKER (unchanged)
// ─────────────────────────────────────────────────────────────────────
function LiveKitchenTicker() {
  const messages = [
    '🔥 Goat Tumbukiza — slow-cooking since 10am · order before 6pm',
    '✦ Kienyeji eggs collected from the yard this morning',
    '◈ North Apiary honey extracted fresh · on all herbal teas',
    '⬡ Lake Victoria fish arrived at dawn · order the BBQ Marinated',
    '★ Chef recommends: Mighty Traditional Platter with fresh juice',
    '⌖ All produce sourced within 2km of this kitchen',
    '🌿 Cinnamon rolls fresh from the farm oven · 8am daily',
    '◆ Biryani available today — beef, mutton and chicken',
  ]
  return (
    <div className="bg-[var(--neon)]/[0.03] border-b border-[var(--neon)]/10 overflow-hidden py-1.5">
      <div className="flex gap-16 w-max" style={{ animation: 'ukv-scroll 28s linear infinite' }}>
        {[...messages, ...messages].map((m, i) => (
          <span key={i} className="font-body text-[8px] tracking-[0.18em] uppercase text-[var(--neon)]/55 whitespace-nowrap">{m}</span>
        ))}
      </div>
      <style suppressHydrationWarning>{`@keyframes ukv-scroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }`}</style>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// MAIN PAGE — POLISHED LAYOUT
// ─────────────────────────────────────────────────────────────────────
export default function RestaurantPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeDietary,  setActiveDietary]  = useState('All')
  const [searchQuery,    setSearchQuery]     = useState('')
  const [sortBy,         setSortBy]          = useState('default')
  const [logItem,        setLogItem]         = useState<MenuItem | null>(null)
  const [navScrolled,    setNavScrolled]     = useState(false)

  const { staged, stagedCount, stagedTotal, activeOrder, clearStaged, stageItem } = useFeastStore()
  const { openCart, items: cartItems } = useCartStore()
  const syncToCart = useSyncToMainCart()

  // Scroll detection for nav shadow
  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const prevCartLen = useRef(cartItems.length)
  useEffect(() => {
    if (prevCartLen.current > 0 && cartItems.length === 0) clearStaged()
    prevCartLen.current = cartItems.length
  }, [cartItems.length, clearStaged])

  const allCategories = ['All', ...MENU_ITEMS.map(c => c.category)]
  const totalDishes   = MENU_ITEMS.reduce((s, c) => s + c.items.length, 0)

  const filteredMenu = useMemo(() => {
    return MENU_ITEMS.map(group => {
      let items = group.items.filter(item => {
        const catMatch    = activeCategory === 'All' || group.category === activeCategory
        const dietMatch   = activeDietary  === 'All' || item.dietary.some(d => d.toLowerCase().includes(activeDietary.toLowerCase()))
        const searchMatch = !searchQuery   || item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase()) || item.ingredients.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()))
        return catMatch && dietMatch && searchMatch
      })
      if (sortBy === 'price-asc')  items = [...items].sort((a, b) => a.price - b.price)
      if (sortBy === 'price-desc') items = [...items].sort((a, b) => b.price - a.price)
      if (sortBy === 'freshness')  items = [...items].sort((a, b) => b.freshness - a.freshness)
      if (sortBy === 'featured')   items = [...items].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
      if (sortBy === 'trending')   items = [...items].sort((a, b) => (b.trendScore || 0) - (a.trendScore || 0))
      return { ...group, items }
    }).filter(g => g.items.length > 0)
  }, [activeCategory, activeDietary, searchQuery, sortBy])

  const count = stagedCount()
  const total = stagedTotal()

  const handleStageAndSync = useCallback((item: MenuItem, category: string, qty = 1) => {
    stageItem(item, category, qty)
    syncToCart(item, category, qty)
  }, [stageItem, syncToCart])

  const stickyTop = activeOrder ? 'top-[148px]' : 'top-[72px]'

  return (
    <main className="bg-[var(--obsidian)] min-h-screen overflow-x-hidden">
      <Nav />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          HERO — full viewport, nav-aware, cinematic
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative min-h-screen flex items-center justify-start overflow-hidden">

        {/* Background video / poster */}
        <div className="absolute inset-0 z-0">
          <video autoPlay muted loop playsInline
            className="w-full h-full object-cover contrast-[1.08] saturate-[1.1]"
            poster="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop">
            <source src="https://v1.mixkit.co/videos/preview/mixkit-chef-preparing-a-dish-in-a-professional-kitchen-41481-large.mp4" type="video/mp4" />
          </video>
          {/* Warm grain overlay */}
          <div className="absolute inset-0 bg-black/45" />
          {/* Directional gradient — lighter on right so text on left pops */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />
          {/* Bottom fade into page */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--obsidian)] via-transparent to-black/30" />
          {/* Warm gold radial accent */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_60%,rgba(200,168,75,0.06),transparent_55%)]" />
          {/* Scanline texture */}
          <div className="absolute inset-0 pointer-events-none opacity-20"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,65,0.04) 2px,rgba(0,255,65,0.04) 4px)' }} />
        </div>

        {/* Content — left-anchored, max-width constrained */}
        <div className="relative z-10 w-full max-w-8xl mx-auto px-4 sm:px-6 md:px-10 pt-28 pb-20 sm:pt-36 sm:pb-24">
          <div className="max-w-2xl">

            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-px bg-[var(--neon)]" />
              <span className="font-body text-[10px] tracking-[0.45em] uppercase text-[var(--neon)] opacity-80">Entering the Feast</span>
            </div>

            {/* Headline */}
            <h1 className="font-display leading-[0.82] text-[var(--cream)] uppercase mb-5 drop-shadow-2xl"
              style={{ fontSize: 'clamp(3.2rem, 9vw, 7.5rem)' }}>
              Farm to{' '}
              <span className="text-[var(--gold)]" style={{ textShadow: '0 0 60px rgba(200,168,75,0.3)' }}>Fork</span>
            </h1>

            {/* Sub-headline */}
            <h2 className="font-display font-light text-white/70 lowercase tracking-tight mb-4"
              style={{ fontSize: 'clamp(1.1rem, 3vw, 2rem)' }}>
              Ubuntu Eco Lodge.{' '}
              <span className="italic text-white/35">The land on your plate.</span>
            </h2>

            {/* Meta */}
            <p className="font-body text-sm sm:text-base text-white/50 mb-10 leading-relaxed">
              {totalDishes} dishes · farm-sourced · made to order.
            </p>

            {/* CTAs — inline-flex, NOT full-width */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => window.scrollTo({ top: window.innerHeight + 100, behavior: 'smooth' })}
                className="inline-flex items-center gap-2 bg-[var(--gold)] text-black font-body font-semibold text-[10px] tracking-[0.22em] uppercase px-8 py-4 rounded-2xl hover:bg-[var(--gold-light)] active:scale-[0.97] transition-all duration-300 shadow-[0_8px_28px_rgba(200,168,75,0.35)] hover:shadow-[0_12px_36px_rgba(200,168,75,0.5)]">
                Explore the Menu
                <span className="text-[12px]">↓</span>
              </button>

              {count > 0 && (
                <button
                  onClick={openCart}
                  className="inline-flex items-center gap-2.5 border border-[var(--gold)]/40 bg-[var(--gold)]/10 text-[var(--gold)] font-body text-[10px] tracking-[0.18em] uppercase px-6 py-4 rounded-2xl hover:bg-[var(--gold)]/20 transition-all duration-300">
                  <span className="w-5 h-5 rounded-full bg-[var(--gold)] text-black flex items-center justify-center text-[9px] font-black">{count}</span>
                  View Feast
                </button>
              )}
            </div>

            {/* Scroll cue */}
            <div className="mt-14 hidden sm:flex items-center gap-3 opacity-30">
              <div className="w-5 h-8 border border-white/30 rounded-full flex items-start justify-center pt-1.5">
                <div className="w-0.5 h-2 bg-white/60 rounded-full" style={{ animation: 'scrollDot 1.8s ease-in-out infinite' }} />
              </div>
              <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-white/50">Scroll to explore</span>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          LIVE KITCHEN TICKER
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <LiveKitchenTicker />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          ORDER TRACKER
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {activeOrder && <OrderStatusBar order={activeOrder} />}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          STICKY CATEGORY + FILTER BAR
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className={`sticky ${stickyTop} z-30 bg-[var(--obsidian)]/92 backdrop-blur-2xl border-b border-white/5 transition-shadow duration-300 ${navScrolled ? 'shadow-[0_4px_24px_rgba(0,0,0,0.4)]' : ''}`}>

        {/* Category tabs */}
        <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-10 pt-4 pb-0 flex gap-6 sm:gap-8 items-center overflow-x-auto"
          style={{ scrollbarWidth: 'none' }}>
          {allCategories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`font-body text-[10px] sm:text-[11px] tracking-[0.3em] uppercase transition-all duration-200 whitespace-nowrap pb-3.5 border-b-2 flex-shrink-0 ${activeCategory === cat ? 'text-[var(--neon)] border-[var(--neon)]' : 'text-white/30 border-transparent hover:text-white/60 hover:border-white/20'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Search + dietary + sort */}
        <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-10 py-3 flex flex-wrap gap-2 sm:gap-3 items-center justify-between border-t border-white/5">
          {/* Search */}
          <div className="flex items-center gap-2 border border-white/10 bg-white/[0.02] px-3.5 py-2 flex-1 min-w-[160px] max-w-xs rounded-xl">
            <span className="text-white/20 text-sm flex-shrink-0">⌕</span>
            <input type="text" placeholder="Search dishes…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent text-white/70 text-[10px] uppercase tracking-wider placeholder:text-white/20 w-full outline-none font-mono" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-white/30 hover:text-white/60 text-xs flex-shrink-0">✕</button>
            )}
          </div>

          {/* Dietary filters */}
          <div className="flex gap-1.5 flex-wrap">
            {DIETARY_FILTERS.map(f => (
              <button key={f.value} onClick={() => setActiveDietary(f.value)}
                className={`px-2.5 py-1.5 text-[8px] uppercase tracking-widest border transition-all rounded-lg ${activeDietary === f.value ? 'border-[var(--neon)]/40 text-[var(--neon)] bg-[var(--neon)]/5' : 'border-white/10 text-white/30 hover:border-white/20 hover:text-white/50'}`}>
                {f.label}
              </button>
            ))}
          </div>

          {/* Sort + feast button */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="bg-[#0d0d0d] text-white/40 text-[9px] uppercase tracking-widest border border-white/10 px-3 py-2 outline-none cursor-pointer rounded-xl">
              <option value="default">Sort: Default</option>
              <option value="trending">🔥 Trending Tonight</option>
              <option value="featured">Featured</option>
              <option value="price-asc">Price ↑</option>
              <option value="price-desc">Price ↓</option>
              <option value="freshness">Freshness</option>
            </select>
            {count > 0 && (
              <button onClick={openCart}
                className="inline-flex items-center gap-2 bg-[var(--gold)] text-black font-bold uppercase tracking-widest px-4 py-2 text-[8px] rounded-xl hover:bg-[var(--gold-light)] transition-colors flex-shrink-0">
                <span className="w-4 h-4 rounded-full bg-black text-[var(--gold)] flex items-center justify-center text-[8px] font-black">{count}</span>
                View Feast
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          STAGED CHECKOUT BAR
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {count > 0 && (
        <div className="sticky top-[148px] z-20 bg-[#0a0900]/95 backdrop-blur-md border-b border-[var(--gold)]/15 py-2.5">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 bg-[var(--gold)] rounded-full animate-pulse" />
              <span className="font-mono text-[9px] uppercase text-[var(--gold)]/70 tracking-widest">{count} item{count !== 1 ? 's' : ''} in your feast</span>
              <span className="font-mono text-[9px] text-white/30">· KES {total.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <button onClick={() => clearStaged()} className="font-mono text-[8px] uppercase tracking-widest text-white/20 hover:text-red-400 transition-colors px-3 py-1.5 border border-white/8 rounded-lg">Clear</button>
              <button onClick={openCart} className="px-5 py-2 bg-[var(--gold)] text-black font-bold text-[9px] uppercase tracking-widest rounded-xl hover:bg-[var(--gold-light)] transition-all">Place Order →</button>
            </div>
          </div>
        </div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          MENU GRID
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="px-4 sm:px-6 md:px-10 py-16 sm:py-20 bg-[#050505]">
        <div className="max-w-8xl mx-auto">

          {filteredMenu.length === 0 && (
            <div className="py-32 text-center">
              <p className="font-display text-3xl sm:text-4xl text-white/10 mb-4">Nothing found in the harvest</p>
              <button onClick={() => { setActiveCategory('All'); setActiveDietary('All'); setSearchQuery('') }}
                className="text-[10px] uppercase tracking-widest text-[var(--neon)]/50 hover:text-[var(--neon)] transition-colors border-b border-[var(--neon)]/20 pb-0.5">
                Clear all filters →
              </button>
            </div>
          )}

          {filteredMenu.map(group => (
            <div key={group.category} className="mb-20 sm:mb-28">

              {/* Section header */}
              <div className="flex items-center gap-4 sm:gap-6 mb-3">
                <div className="w-8 h-px bg-[var(--gold)]/30" />
                <h2 className="font-display text-base sm:text-lg tracking-[0.5em] uppercase text-white/20">{group.category}</h2>
                <div className="h-px flex-1 bg-gradient-to-r from-white/8 to-transparent" />
                <span className="font-mono text-[8px] text-white/15 uppercase tracking-widest flex-shrink-0">{group.items.length} items</span>
              </div>

              {group.description && (
                <p className="font-body text-xs text-white/20 italic mb-10 sm:mb-12 tracking-wide leading-relaxed max-w-xl">{group.description}</p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-7">
                {group.items.map(item => (
                  <MenuCard key={item.id} item={item} category={group.category} onOpenLog={setLogItem} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          BOTTOM CTA
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="text-center py-24 sm:py-32 border-t border-white/5 px-4 sm:px-6">
        <p className="font-display italic mb-8 text-white/50 max-w-3xl mx-auto leading-relaxed"
          style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)' }}>
          &ldquo;The menu changes with the farm. Moxie always knows what is fresh today.&rdquo;
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button onClick={() => count > 0 ? openCart() : undefined}
            className="inline-flex items-center gap-2 bg-[var(--gold)] text-black font-body font-semibold text-[10px] tracking-[0.25em] uppercase px-10 py-4 rounded-2xl hover:bg-[var(--gold-light)] transition-all duration-300 shadow-[0_8px_28px_rgba(200,168,75,0.3)]">
            {count > 0 ? `Place Order (${count} item${count !== 1 ? 's' : ''})` : 'Reserve a Table'}
          </button>
          <button className="inline-flex items-center gap-2 border border-[var(--neon)]/40 bg-transparent text-[var(--neon)] font-body font-semibold text-[10px] tracking-[0.25em] uppercase px-10 py-4 rounded-2xl hover:bg-[var(--neon)]/5 transition-all duration-300">
            Ask Moxie
          </button>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          MODALS + FLOATING UI
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {logItem && <LogModal item={logItem} onClose={() => setLogItem(null)} />}

      <FeastOrb />
      <SmartPairingCard onAdd={(item, cat) => handleStageAndSync(item, cat, 1)} />

      <Footer />
      <MoxieChat />

      <style suppressHydrationWarning>{`
        @keyframes scrollDot {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50%       { transform: translateY(6px); opacity: 0.2; }
        }
      `}</style>
    </main>
  )
}