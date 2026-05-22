// Ubuntu Kreative Village — Arohamai Spa Sanctuary
// PRODUCTION v5 — Services updated to exact AROHOMAI SPA AT UBUNTU ECO LODGE menu
// All architecture, design, cart, hero, modals, audio preserved exactly from v4

'use client'

import {
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react'

import Image from 'next/image'
import Link from 'next/link'

import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
} from 'framer-motion'

import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import MoxieChat from '@/components/MoxieChat'

import { useCartStore } from '@/context/cartStore'

import toast from 'react-hot-toast'

// ─────────────────────────────────────────────────────────────
// JSON-LD SEO
// ─────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HealthAndBeautyBusiness',
  name: 'Arohamai Spa at Ubuntu Eco Lodge',
  description:
    'Holistic wellness from skin to body. Affordable luxury inspired by healing, nature, and restoration. Mud baths, Moroccan hammam, sauna, massage therapies, facials and signature wellness packages.',
  telephone: '+254700000000',
  priceRange: '$$',
  image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=2070',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Nairobi',
    addressCountry: 'KE',
  },
}

// ─────────────────────────────────────────────────────────────
// RITUAL ACCENT PALETTES
// ─────────────────────────────────────────────────────────────

const ritualAccents: Record<string, { glow: string; label: string }> = {
  'ubuntu-signature-therapy':    { glow: 'rgba(180,120,40,0.20)',  label: 'African Healing'    },
  'moroccan-bath':               { glow: 'rgba(160,80,160,0.16)',  label: 'Moroccan Ritual'    },
  'sauna-session':               { glow: 'rgba(220,100,40,0.18)',  label: 'Thermal Heat'       },
  'mud-bath':                    { glow: 'rgba(120,80,40,0.20)',   label: 'Earth & Clay'       },
  'aromatherapy-massage':        { glow: 'rgba(200,160,80,0.16)',  label: 'Aroma & Touch'      },
  'deep-tissue-massage':         { glow: 'rgba(60,100,160,0.16)',  label: 'Deep Recovery'      },
  'arohamai-signature-healing':  { glow: 'rgba(212,175,55,0.18)', label: 'Full Sanctuary'     },
  'detox-purify-package':        { glow: 'rgba(100,160,100,0.16)', label: 'Devox & Purify'     },
  'stress-relief-package':       { glow: 'rgba(180,140,200,0.16)', label: 'Stress Relief'      },
  'full-day-escape':             { glow: 'rgba(212,175,55,0.20)', label: 'Full Escape'        },
}

// ─────────────────────────────────────────────────────────────
// THERAPISTS
// ─────────────────────────────────────────────────────────────

const therapists = [
  {
    id: 'amara',
    name: 'Amara Njeri',
    energy: 'Grounding',
    frequency: '432 Hz — Earth Frequency',
    experience: '12 Years',
    philosophy: 'Healing begins when the nervous system remembers stillness.',
    quote: 'The body speaks softly before it screams.',
    specialties: ['Ubuntu Signature Therapy', 'Lymphatic Drainage', 'Herbal Rituals'],
    aura: 'rgba(180,120,40,0.18)',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'malik',
    name: 'Malik Ade',
    energy: 'Deep Recovery',
    frequency: '528 Hz — Repair Frequency',
    experience: '9 Years',
    philosophy: 'Recovery is not luxury. It is survival for the modern mind.',
    quote: 'Muscles relax when the mind finally feels safe.',
    specialties: ['Deep Tissue Massage', 'Bamboo Stick Therapy', 'Wood Therapy'],
    aura: 'rgba(40,120,180,0.18)',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop',
  },
]

// ─────────────────────────────────────────────────────────────
// ALL RITUALS — exact AROHOMAI SPA services + prices
// ─────────────────────────────────────────────────────────────

const rituals = [
  // ── BATH & HEAT ────────────────────────────────────────────
  {
    id: 'mud-bath',
    name: 'Mud Bath',
    duration: '45 MIN',
    price: 3500,
    categoryTag: 'Bath & Heat',
    status: 'most requested',
    aromaNotes: ['Volcanic Clay', 'Mineral Earth', 'Cedar'],
    soundscape: 'Earth Frequencies',
    mood: 'Deep pore purification and mineral rebalancing',
    heatLevel: 'Warm Earth Therapy',
    pressure: 'None',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop',
    description: 'Mineral-rich volcanic clay bath that purifies deep pores, relieves muscle ache, and renews the skin from the outside in.',
    timeline: [
      '00 MIN — Herbal Welcome',
      '10 MIN — Mud Bath Immersion',
      '35 MIN — Warm Rinse & Recovery',
      '45 MIN — Cooling Towel Finish',
    ],
    addOns: ['Body Exfoliation', 'Herbal Soak', 'Steam Session'],
    recovery: { stress: 82, sleep: 76, energy: 80, emotional: 78 },
  },
  {
    id: 'salt-bath',
    name: 'Salt Bath',
    duration: '40 MIN',
    price: 2500,
    categoryTag: 'Bath & Heat',
    status: 'daily sessions',
    aromaNotes: ['Sea Salt', 'Eucalyptus', 'Lavender'],
    soundscape: 'Ocean & Water Frequencies',
    mood: 'Skin detox and mineral restoration',
    heatLevel: 'Warm Mineral Soak',
    pressure: 'None',
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=2070&auto=format&fit=crop',
    description: 'Therapeutic salt soak infused with natural minerals and botanicals. Cleanses, softens and restores the skin while relaxing the body.',
    timeline: [
      '00 MIN — Mineral Bath Preparation',
      '10 MIN — Salt Immersion',
      '30 MIN — Active Soak',
      '40 MIN — Cool Down & Rest',
    ],
    addOns: ['Hydrating Facial', 'Reflexology', 'Aromatherapy Massage'],
    recovery: { stress: 78, sleep: 74, energy: 76, emotional: 75 },
  },
  {
    id: 'smoked-bath',
    name: 'Smoked Bath',
    duration: '45 MIN',
    price: 3000,
    categoryTag: 'Bath & Heat',
    status: 'village tradition',
    aromaNotes: ['Smoke', 'Herbs', 'Sandalwood'],
    soundscape: 'Forest Smoke Frequencies',
    mood: 'Ancient African purification ritual',
    heatLevel: 'Smoky Warm Heat',
    pressure: 'None',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070&auto=format&fit=crop',
    description: 'An ancient African bathing tradition using aromatic smoke and herbal infusions. Deeply purifying and grounding for body and spirit.',
    timeline: [
      '00 MIN — Herbal Fire Preparation',
      '10 MIN — Smoke Bath Entry',
      '30 MIN — Smoke & Steam Immersion',
      '45 MIN — Cooling & Integration',
    ],
    addOns: ['Body Mask', 'Herbal Soak', 'Sauna Session'],
    recovery: { stress: 85, sleep: 80, energy: 82, emotional: 88 },
  },
  {
    id: 'ice-bath',
    name: 'Ice Bath',
    duration: '30 MIN',
    price: 2500,
    categoryTag: 'Bath & Heat',
    status: 'recovery essential',
    aromaNotes: ['Mint', 'Pine', 'Cool Water'],
    soundscape: 'Cold Spring Frequencies',
    mood: 'Cardiovascular reset and inflammation reduction',
    heatLevel: 'Cold Immersion 8–12°C',
    pressure: 'None',
    image: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=2070&auto=format&fit=crop',
    description: 'Cold water immersion therapy for muscle recovery, reduced inflammation, and cellular revitalisation. Optimal for active lifestyles.',
    timeline: [
      '00 MIN — Pre-Cool Breathing Protocol',
      '05 MIN — Gradual Cold Entry',
      '20 MIN — Cold Immersion',
      '30 MIN — Warm Recovery',
    ],
    addOns: ['Deep Tissue Massage', 'Bamboo Stick Therapy', 'Sauna Session'],
    recovery: { stress: 80, sleep: 88, energy: 96, emotional: 78 },
  },
  {
    id: 'moroccan-bath',
    name: 'Moroccan Bath',
    duration: '75 MIN',
    price: 4500,
    categoryTag: 'Bath & Heat',
    status: 'ancient ritual',
    aromaNotes: ['Argan', 'Black Soap', 'Rose Water'],
    soundscape: 'Desert Wind Frequencies',
    mood: 'Full body renewal and deep cleansing',
    heatLevel: 'Steam & Warm Marble',
    pressure: 'Medium',
    image: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?q=80&w=2070&auto=format&fit=crop',
    description: 'Traditional Moroccan hammam with black soap exfoliation, kessa mitt scrub, argan oil ritual, and rose water finish on heated marble.',
    timeline: [
      '00 MIN — Hammam Steam Opening',
      '15 MIN — Black Soap Application',
      '30 MIN — Kessa Mitt Exfoliation',
      '50 MIN — Argan Oil Ritual',
      '65 MIN — Rose Water Rinse & Recovery',
      '75 MIN — Mint Tea Integration',
    ],
    addOns: ['Body Mask', 'Ghassoul Clay Mask', 'Sound Healing'],
    recovery: { stress: 92, sleep: 84, energy: 88, emotional: 90 },
  },
  {
    id: 'sauna-session',
    name: 'Sauna Session',
    duration: '60 MIN',
    price: 2000,
    categoryTag: 'Bath & Heat',
    status: 'daily sessions',
    aromaNotes: ['Eucalyptus', 'Pine', 'Birch'],
    soundscape: 'Forest Frequencies',
    mood: 'Cardiovascular reset and cellular detox',
    heatLevel: 'High Dry Heat 80–100°C',
    pressure: 'None',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop',
    description: 'Traditional Finnish dry sauna with birch steam rituals, cold recovery periods and deep cellular detox. Available daily.',
    timeline: [
      '00 MIN — Birch Steam Opening',
      '15 MIN — First Sauna Round',
      '30 MIN — Cold Recovery',
      '45 MIN — Second Sauna Round',
      '60 MIN — Herbal Cool Down',
    ],
    addOns: ['Ice Bath', 'Body Exfoliation', 'Steam Session'],
    recovery: { stress: 88, sleep: 90, energy: 94, emotional: 80 },
  },
  {
    id: 'steam-session',
    name: 'Steam Session',
    duration: '45 MIN',
    price: 2000,
    categoryTag: 'Bath & Heat',
    status: 'morning ritual',
    aromaNotes: ['Mint', 'Lemongrass', 'Eucalyptus'],
    soundscape: 'Morning Rain Frequencies',
    mood: 'Respiratory opening and mental clarity',
    heatLevel: 'Steam Heat',
    pressure: 'Light',
    image: 'https://images.unsplash.com/photo-1559599746-8823b38544c6?q=80&w=2070&auto=format&fit=crop',
    description: 'Herbal steam therapy for deep respiratory cleansing, pore opening and mental reset. A cornerstone of the Arohamai daily ritual.',
    timeline: [
      '00 MIN — Herbal Infusion Preparation',
      '10 MIN — Steam Entry',
      '30 MIN — Active Steam Session',
      '45 MIN — Recovery & Stillness',
    ],
    addOns: ['Salt Bath', 'Body Mask', 'Sauna Session'],
    recovery: { stress: 84, sleep: 78, energy: 86, emotional: 82 },
  },
  {
    id: 'herbal-soak',
    name: 'Herbal Soak',
    duration: '50 MIN',
    price: 3000,
    categoryTag: 'Bath & Heat',
    status: 'restorative',
    aromaNotes: ['Lemongrass', 'Wild Herbs', 'Lavender'],
    soundscape: 'Garden & Nature Frequencies',
    mood: 'Botanical healing and deep relaxation',
    heatLevel: 'Warm Herbal Soak',
    pressure: 'None',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=2070&auto=format&fit=crop',
    description: 'A deeply restorative soak in herb-infused warm water. Locally sourced botanicals ease tension, nourish the skin and calm the mind.',
    timeline: [
      '00 MIN — Herbal Blend Preparation',
      '10 MIN — Soak Entry',
      '40 MIN — Botanical Immersion',
      '50 MIN — Towel Wrap & Rest',
    ],
    addOns: ['Reflexology', 'Body Mask', 'Hydrating Facial'],
    recovery: { stress: 88, sleep: 86, energy: 80, emotional: 90 },
  },
  // ── BODY CARE ──────────────────────────────────────────────
  {
    id: 'body-mask',
    name: 'Body Mask',
    duration: '50 MIN',
    price: 3500,
    categoryTag: 'Body Care',
    status: 'skin renewal',
    aromaNotes: ['Clay', 'Aloe', 'Shea'],
    soundscape: 'Earth Frequencies',
    mood: 'Skin nourishment and deep hydration',
    heatLevel: 'Warm Application',
    pressure: 'Light',
    image: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?q=80&w=2070&auto=format&fit=crop',
    description: 'Rich botanical mask applied to the full body. Draws out impurities, deeply nourishes, and leaves the skin visibly soft and renewed.',
    timeline: [
      '00 MIN — Skin Assessment',
      '10 MIN — Mask Application',
      '30 MIN — Active Penetration Period',
      '45 MIN — Warm Rinse',
      '50 MIN — Moisturiser Seal',
    ],
    addOns: ['Body Exfoliation', 'Herbal Soak', 'Hydrating Facial'],
    recovery: { stress: 74, sleep: 72, energy: 80, emotional: 82 },
  },
  {
    id: 'body-exfoliation',
    name: 'Body Exfoliation',
    duration: '45 MIN',
    price: 3000,
    categoryTag: 'Body Care',
    status: 'glow essential',
    aromaNotes: ['Sea Salt', 'Baobab', 'Coconut'],
    soundscape: 'Soft Water Frequencies',
    mood: 'Skin renewal and radiant luminosity',
    heatLevel: 'Warm Exfoliation',
    pressure: 'Firm',
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?q=80&w=2070&auto=format&fit=crop',
    description: 'Full body scrub using natural exfoliants to remove dead skin cells, improve circulation and prepare the skin for deep treatment absorption.',
    timeline: [
      '00 MIN — Pre-Exfoliation Prep',
      '10 MIN — Full Body Scrub',
      '35 MIN — Warm Rinse',
      '45 MIN — Cooling Aloe Finish',
    ],
    addOns: ['Body Mask', 'Moroccan Bath', 'Mud Bath'],
    recovery: { stress: 72, sleep: 70, energy: 85, emotional: 78 },
  },
  // ── MASSAGE & BODY THERAPIES ───────────────────────────────
  {
    id: 'ubuntu-signature-therapy',
    name: 'Ubuntu Signature Therapy',
    duration: '90 MIN',
    price: 7500,
    categoryTag: 'Signature Therapy',
    status: 'most requested',
    aromaNotes: ['Maasai Oil', 'Wild Sage', 'Baobab'],
    soundscape: 'Earth Frequencies',
    mood: 'Nervous system grounding and full body reset',
    heatLevel: 'Warm Oil Therapy',
    pressure: 'Medium',
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=2070&auto=format&fit=crop',
    description: 'The Arohamai signature treatment. A full body therapy using traditional African massage techniques, Maasai warm oils, and grounding stone therapy for complete mind-body restoration.',
    timeline: [
      '00 MIN — Herbal Welcome Steam',
      '15 MIN — Maasai Oil Application',
      '40 MIN — Ubuntu Massage Technique',
      '65 MIN — Stone Grounding Therapy',
      '85 MIN — Herbal Tea Integration',
      '90 MIN — Stillness & Rest',
    ],
    addOns: ['Herbal Soak', 'Body Mask', 'Skin Renewal Facial'],
    recovery: { stress: 98, sleep: 86, energy: 88, emotional: 94 },
  },
  {
    id: 'aromatherapy-massage',
    name: 'Aromatherapy Massage',
    duration: '60 MIN',
    price: 5000,
    categoryTag: 'Massage Therapy',
    status: 'classic ritual',
    aromaNotes: ['Lavender', 'Rose', 'Lemongrass'],
    soundscape: 'Garden & Floral Frequencies',
    mood: 'Relaxation, emotional wellness and stress release',
    heatLevel: 'Warm Aromatic Oils',
    pressure: 'Light to Medium',
    image: 'https://images.unsplash.com/photo-1612198790700-e0862f0624d3?q=80&w=2070&auto=format&fit=crop',
    description: 'Gentle massage using locally sourced aromatic oils chosen to restore balance, calm the nervous system and promote deep relaxation.',
    timeline: [
      '00 MIN — Aroma Profile Selection',
      '10 MIN — Oil Warming & Preparation',
      '20 MIN — Upper Body Therapy',
      '45 MIN — Lower Body & Feet',
      '60 MIN — Integration & Rest',
    ],
    addOns: ['Salt Bath', 'Reflexology', 'Hydrating Facial'],
    recovery: { stress: 92, sleep: 84, energy: 80, emotional: 90 },
  },
  {
    id: 'deep-tissue-massage',
    name: 'Deep Tissue Massage',
    duration: '60 MIN',
    price: 6000,
    categoryTag: 'Massage Therapy',
    status: 'recovery essential',
    aromaNotes: ['Peppermint', 'Eucalyptus', 'Camphor'],
    soundscape: 'Deep Earth Frequencies',
    mood: 'Muscle recovery and deep tension release',
    heatLevel: 'Warm Therapeutic Pressure',
    pressure: 'Deep',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop',
    description: 'Focused deep tissue work targeting chronic muscle tension, knots and restriction. Ideal for active individuals, athletes and those carrying physical stress.',
    timeline: [
      '00 MIN — Posture & Tension Assessment',
      '10 MIN — Warm Oil Application',
      '20 MIN — Deep Tissue Work — Focus Areas',
      '50 MIN — Full Body Integration',
      '60 MIN — Cooling Recovery',
    ],
    addOns: ['Ice Bath', 'Bamboo Stick Therapy', 'Sauna Session'],
    recovery: { stress: 88, sleep: 88, energy: 92, emotional: 80 },
  },
  {
    id: 'lymphatic-drainage',
    name: 'Lymphatic Drainage Therapy',
    duration: '60 MIN',
    price: 6500,
    categoryTag: 'Massage Therapy',
    status: 'circulation specialist',
    aromaNotes: ['Grapefruit', 'Juniper', 'Cypress'],
    soundscape: 'Water Flow Frequencies',
    mood: 'Detox, circulation support and body contouring',
    heatLevel: 'Gentle Therapeutic Touch',
    pressure: 'Light Rhythmic',
    image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=2070&auto=format&fit=crop',
    description: 'Specialised rhythmic therapy that stimulates the lymphatic system to remove toxins, reduce inflammation, support immunity and encourage fluid drainage.',
    timeline: [
      '00 MIN — Lymphatic Assessment',
      '10 MIN — Gentle Neck & Collar Opening',
      '25 MIN — Abdominal Lymphatic Work',
      '45 MIN — Limb Drainage Sequence',
      '60 MIN — Integration & Rest',
    ],
    addOns: ['Wood Therapy', 'Body Exfoliation', 'Sauna Session'],
    recovery: { stress: 84, sleep: 82, energy: 90, emotional: 86 },
  },
  {
    id: 'swedish-massage',
    name: 'Swedish Massage',
    duration: '60 MIN',
    price: 5000,
    categoryTag: 'Massage Therapy',
    status: 'everyday restoration',
    aromaNotes: ['Almond Oil', 'Lavender', 'Chamomile'],
    soundscape: 'Soft Spring Frequencies',
    mood: 'Full body relaxation and circulation boost',
    heatLevel: 'Warm Classic Oils',
    pressure: 'Light to Medium',
    image: 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?q=80&w=2070&auto=format&fit=crop',
    description: 'The classic full-body massage using long gliding strokes, kneading and circular movements to improve circulation, ease tension and restore wellbeing.',
    timeline: [
      '00 MIN — Full Body Warm Oil Application',
      '15 MIN — Long Stroke Effleurage',
      '35 MIN — Kneading & Circulation Work',
      '55 MIN — Final Integration Strokes',
      '60 MIN — Rest & Recovery',
    ],
    addOns: ['Salt Bath', 'Herbal Facial', 'Herbal Soak'],
    recovery: { stress: 86, sleep: 82, energy: 80, emotional: 84 },
  },
  {
    id: 'balancing-therapy',
    name: 'Balancing Therapy',
    duration: '60 MIN',
    price: 5500,
    categoryTag: 'Massage Therapy',
    status: 'holistic harmony',
    aromaNotes: ['Vetiver', 'Frankincense', 'Sandalwood'],
    soundscape: 'Tuning & Harmony Frequencies',
    mood: 'Energy balance and system harmonisation',
    heatLevel: 'Warm Balancing Oils',
    pressure: 'Medium',
    image: 'https://images.unsplash.com/photo-1611073615830-9f80b3dc3dcf?q=80&w=2070&auto=format&fit=crop',
    description: 'An integrative therapy combining multiple bodywork modalities to restore energetic balance, ease the nervous system and harmonise the body\'s natural rhythms.',
    timeline: [
      '00 MIN — Energy Reading & Intention Setting',
      '10 MIN — Grounding Work',
      '30 MIN — Balancing Bodywork Sequence',
      '50 MIN — Closing Integration',
      '60 MIN — Rest & Stillness',
    ],
    addOns: ['Herbal Soak', 'Steam Session', 'Reflexology'],
    recovery: { stress: 90, sleep: 84, energy: 86, emotional: 92 },
  },
  {
    id: 'shiatsu-therapy',
    name: 'Shiatsu Therapy',
    duration: '60 MIN',
    price: 6000,
    categoryTag: 'Massage Therapy',
    status: 'eastern tradition',
    aromaNotes: ['Ginger', 'Black Pepper', 'Sesame Oil'],
    soundscape: 'Zen & Stillness Frequencies',
    mood: 'Meridian balance and vital energy restoration',
    heatLevel: 'Targeted Pressure Points',
    pressure: 'Deep Point',
    image: 'https://images.unsplash.com/photo-1596178060810-72c4a0613fc1?q=80&w=2070&auto=format&fit=crop',
    description: 'Traditional Japanese shiatsu using precise finger pressure on meridian lines and acupressure points. Restores vital energy flow and addresses physical imbalances.',
    timeline: [
      '00 MIN — Meridian Assessment',
      '10 MIN — Energy Channel Opening',
      '30 MIN — Targeted Point Therapy',
      '50 MIN — Full Body Integration',
      '60 MIN — Qi Flow Rest',
    ],
    addOns: ['Herbal Soak', 'Balancing Therapy', 'Reflexology'],
    recovery: { stress: 88, sleep: 86, energy: 88, emotional: 88 },
  },
  {
    id: 'bamboo-stick-therapy',
    name: 'Bamboo Stick Therapy',
    duration: '60 MIN',
    price: 6500,
    categoryTag: 'Massage Therapy',
    status: 'natural healing',
    aromaNotes: ['Bamboo', 'Lemongrass', 'Green Tea'],
    soundscape: 'Bamboo Forest Frequencies',
    mood: 'Deep muscle penetration and cellular renewal',
    heatLevel: 'Warm Bamboo Sticks',
    pressure: 'Deep Rolling',
    image: 'https://images.unsplash.com/photo-1591343395082-e120087004b4?q=80&w=2070&auto=format&fit=crop',
    description: 'Heated bamboo sticks are rolled and pressed along the muscles for deep tissue release, improved circulation and a uniquely grounding sensory experience.',
    timeline: [
      '00 MIN — Bamboo Preparation & Heating',
      '10 MIN — Light Stroke Introduction',
      '20 MIN — Deep Roll Sequence',
      '45 MIN — Full Body Bamboo Therapy',
      '60 MIN — Oil Seal & Recovery',
    ],
    addOns: ['Ice Bath', 'Deep Tissue Massage', 'Sauna Session'],
    recovery: { stress: 86, sleep: 84, energy: 90, emotional: 84 },
  },
  {
    id: 'wood-therapy',
    name: 'Wood Therapy',
    duration: '60 MIN',
    price: 6500,
    categoryTag: 'Massage Therapy',
    status: 'body sculpting',
    aromaNotes: ['Cedar', 'Sandalwood', 'Juniper'],
    soundscape: 'Forest & Wood Frequencies',
    mood: 'Body contouring, detox and circulation support',
    heatLevel: 'Room Temperature Tools',
    pressure: 'Firm Sculpting',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=2070&auto=format&fit=crop',
    description: 'Colombian wood therapy using shaped wooden tools to deeply contour, drain, and stimulate fat tissue and lymphatic drainage. Effective body sculpting without surgery.',
    timeline: [
      '00 MIN — Body Assessment',
      '10 MIN — Dry Brush Opening',
      '20 MIN — Wood Tool Application',
      '45 MIN — Sculpting & Draining Sequence',
      '60 MIN — Recovery Wrapping',
    ],
    addOns: ['Lymphatic Drainage', 'Body Exfoliation', 'Sauna Session'],
    recovery: { stress: 80, sleep: 76, energy: 88, emotional: 80 },
  },
  {
    id: 'reflexology',
    name: 'Reflexology (Hands & Feet)',
    duration: '45 MIN',
    price: 3500,
    categoryTag: 'Massage Therapy',
    status: 'whole body reflex',
    aromaNotes: ['Peppermint', 'Tea Tree', 'Lavender'],
    soundscape: 'Grounding Earth Frequencies',
    mood: 'Organ stimulation and nervous system reset',
    heatLevel: 'Warm Foot Soak',
    pressure: 'Medium Point',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=2070&auto=format&fit=crop',
    description: 'Targeted pressure therapy on the hands and feet to stimulate reflex points connected to all organs and systems of the body. Profoundly calming and restorative.',
    timeline: [
      '00 MIN — Warm Soak & Preparation',
      '10 MIN — Foot Reflex Map Assessment',
      '20 MIN — Full Foot Reflexology',
      '35 MIN — Hand Reflexology',
      '45 MIN — Integration & Rest',
    ],
    addOns: ['Salt Bath', 'Herbal Soak', 'Aromatherapy Massage'],
    recovery: { stress: 88, sleep: 86, energy: 82, emotional: 86 },
  },
  {
    id: 'mama-to-be-therapy',
    name: 'Mama-to-Be Therapy',
    duration: '60 MIN',
    price: 5500,
    categoryTag: 'Massage Therapy',
    status: 'prenatal care',
    aromaNotes: ['Neroli', 'Chamomile', 'Rose'],
    soundscape: 'Gentle Nurturing Frequencies',
    mood: 'Prenatal relaxation and nurturing care',
    heatLevel: 'Gentle Warm Oils',
    pressure: 'Extra Gentle', // FIXED syntax literal error here (wrapped in quotes)
    image: 'https://images.unsplash.com/photo-1531983412531-1f49a365ffed?q=80&w=2070&auto=format&fit=crop',
    description: 'A deeply gentle and nurturing therapy designed specifically for expecting mothers. Relieves back pain, leg swelling, tension and anxiety while nourishing both mother and baby.',
    timeline: [
      '00 MIN — Comfort Positioning',
      '10 MIN — Gentle Oil Application',
      '20 MIN — Side-Lying Back Relief',
      '40 MIN — Leg & Foot Therapy',
      '60 MIN — Breathing & Rest',
    ],
    addOns: ['Herbal Soak', 'Reflexology', 'Herbal Facial'],
    recovery: { stress: 90, sleep: 88, energy: 78, emotional: 96 },
  },
  // ── FACIAL & HAIR WELLNESS ─────────────────────────────────
  {
    id: 'hydrating-facial',
    name: 'Hydrating Facial',
    duration: '50 MIN',
    price: 4000,
    categoryTag: 'Facial',
    status: 'skin essential',
    aromaNotes: ['Aloe Vera', 'Hyaluronic', 'Rose Water'],
    soundscape: 'Water & Dew Frequencies',
    mood: 'Skin luminosity and deep hydration',
    heatLevel: 'Warm Steam & Cool Mist',
    pressure: 'Gentle',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop',
    description: 'Deeply moisturising facial using plant-based hydrators from our garden. Aloe vera, rose water and natural humectants restore skin barrier and leave a dewy glow.',
    timeline: [
      '00 MIN — Cleansing & Preparation',
      '10 MIN — Exfoliation',
      '20 MIN — Steam Opening',
      '30 MIN — Hydration Mask & Infusion',
      '50 MIN — Cold Roller Finish',
    ],
    addOns: ['Eye Lift Treatment', 'Lip Treatment', 'Herbal Soak'],
    recovery: { stress: 78, sleep: 74, energy: 82, emotional: 80 },
  },
]

type Ritual = typeof rituals[number]

export default function SpaPage() {
  const [selectedRitual, setSelectedRitual] = useState<Ritual | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [ambientAudio, setAmbientAudio] = useState<boolean>(false)
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null)

  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, 150])
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])

  const textOp = useTransform(scrollY, [0, 200], [1, 0])
  const textY = useTransform(scrollY, [0, 200], ['0px', '-40px'])

  const categories = ['All', 'Bath & Heat', 'Body Care', 'Massage Therapy', 'Signature Therapy', 'Facial']

  const filteredRituals = rituals.filter(
    (r) => activeCategory === 'All' || r.categoryTag === activeCategory
  )

  const openRitualById = useCallback((id: string) => {
    const ritual = rituals.find((r) => r.id === id)
    if (ritual) setSelectedRitual(ritual)
  }, [])

  const toggleAmbientSound = () => {
    if (!audioRef) {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav')
      audio.loop = true
      audio.volume = 0.15
      audio.play().catch(() => {})
      setAudioRef(audio)
      setAmbientAudio(true)
      toast.success('432Hz Ambient Soundscape Activated', {
        style: { background: '#0a100a', color: '#e6dfd5', border: '1px solid rgba(212,175,55,0.15)' },
      })
    } else {
      if (ambientAudio) {
        audioRef.pause()
        setAmbientAudio(false)
      } else {
        audioRef.play().catch(() => {})
        setAmbientAudio(true)
      }
    }
  }

  return (
    <main className="bg-[#050705] text-[#e6dfd5] min-h-screen selection:bg-gold/30 overflow-x-hidden font-body relative">
      <Nav />

      {/* ── PHASE 1: IMMERSION HERO ── */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden border-b border-white/5">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070"
            alt="Arohamai Sanctuary Background"
            fill
            priority
            className="object-cover opacity-30 contrast-125 scale-105 filter blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050705] via-transparent to-black/50" />
        </motion.div>

        <motion.div 
          style={{ opacity: textOp, y: textY, zIndex: 10 } as any} 
          className="relative text-center px-6 max-w-4xl"
        >
          <span className="text-gold tracking-[0.4em] uppercase text-xs mb-4 inline-block font-mono bg-black/40 px-4 py-1 rounded-full border border-white/5 backdrop-blur-md">
            Arohamai Sanctuary At Ubuntu Eco Lodge
          </span>
          <h1 className="font-display text-6xl md:text-8xl font-light tracking-tight text-cream leading-none mb-6">
            RESTORE YOUR <br />
            <span className="italic font-serif text-gold font-normal">STILLNESS</span>
          </h1>
          <p className="text-white/40 font-light max-w-xl mx-auto text-base md:text-lg leading-relaxed mb-8">
            African holistic healing meets affordable luxury parameters. Tailored frequencies, organic mineral mud baths, and natural therapies.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                const el = document.getElementById('collection-grid')
                el?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="bg-gold hover:bg-gold-light text-[#050705] font-medium tracking-wide uppercase text-xs px-8 py-4 rounded-sm transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Explore Sanctuary Rituals
            </button>
            <button
              onClick={toggleAmbientSound}
              className={`border ${ambientAudio ? 'border-gold text-gold' : 'border-white/10 text-white/60'} hover:border-gold/40 px-6 py-4 rounded-sm uppercase text-xs tracking-wider transition-all duration-300 flex items-center gap-3 backdrop-blur-sm bg-black/10`}
            >
              <span className={`w-2 h-2 rounded-full ${ambientAudio ? 'bg-gold animate-ping' : 'bg-white/20'}`} />
              {ambientAudio ? 'Soundscape Active (432Hz)' : 'Activate Sanctuary Audio'}
            </button>
          </div>
        </motion.div>
      </section>

      {/* ── PHASE 2: GRID AND FILTERS ── */}
      <section id="collection-grid" className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-white/5 pb-8">
          <div>
            <p className="text-gold uppercase tracking-[0.35em] text-[10px] mb-3">Full Treatment Collection</p>
            <h2 className="font-display text-4xl md:text-5xl leading-none">
              EVERY <span className="italic text-gold">RITUAL</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs uppercase tracking-wider rounded-full transition-all border ${
                  activeCategory === cat
                    ? 'bg-gold text-black border-gold'
                    : 'bg-white/5 text-white/60 border-transparent hover:border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRituals.map((ritual) => (
            <RitualCard key={ritual.id} ritual={ritual} onOpen={setSelectedRitual} />
          ))}
        </div>
      </section>

      <WellnessJourneyBuilder onSelectRitual={openRitualById} />
      <TherapistSection />
      <TestimonialsSection />
      <MembershipSection />
      <FinalCTA />

      <AnimatePresence>
        {selectedRitual && (
          <RitualDetailModal ritual={selectedRitual} onClose={() => setSelectedRitual(null)} />
        )}
      </AnimatePresence>

      <MoxieChat className="glass-panel" />
      <Footer />
    </main>
  )
}

// ─────────────────────────────────────────────────────────────
// SUBCOMPONENTS
// ─────────────────────────────────────────────────────────────

function RitualCard({ ritual, onOpen }: { ritual: Ritual; onOpen: (r: Ritual) => void }) {
  const accent = ritualAccents[ritual.id] || { glow: 'rgba(255,255,255,0.05)', label: 'Sanctuary Care' }
  return (
    <motion.div
      layoutId={`card-${ritual.id}`}
      onClick={() => onOpen(ritual)}
      className="group relative bg-[#0a0f0a] border border-white/5 rounded-sm overflow-hidden cursor-pointer hover:border-gold/30 transition-all duration-500 flex flex-col justify-between h-[420px]"
      style={{ '--glow-color': accent.glow } as any}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0f0a]/80 to-[#0a0f0a] z-10" />
      <div className="relative h-48 overflow-hidden w-full">
        <Image
          src={ritual.image}
          alt={ritual.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-80"
        />
        <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-sm text-[9px] uppercase tracking-widest text-gold">
          {accent.label}
        </div>
      </div>
      <div className="p-6 relative z-20 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-4 mb-2">
            <h3 className="font-display text-xl text-cream tracking-wide group-hover:text-gold transition-colors">
              {ritual.name}
            </h3>
            <span className="font-mono text-xs text-gold/80 bg-gold/5 border border-gold/10 px-2 py-0.5 rounded-sm">
              KES {ritual.price.toLocaleString()}
            </span>
          </div>
          <p className="text-white/40 text-xs font-light line-clamp-2 leading-relaxed mb-4">
            {ritual.description}
          </p>
        </div>
        <div>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {ritual.aromaNotes.slice(0, 2).map((note, idx) => (
              <span key={idx} className="text-[10px] text-white/30 bg-white/5 border border-white/5 px-2 py-0.5 rounded-full font-mono">
                {note}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between text-[11px] text-white/40 border-t border-white/5 pt-3 font-mono">
            <span>{ritual.duration}</span>
            <span className="text-gold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              View Ritual →
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function WellnessJourneyBuilder({ onSelectRitual }: { onSelectRitual: (id: string) => void }) {
  const [focus, setFocus] = useState<string>('stress')
  const matchedRituals = useTransformToRituals(focus)

  return (
    <section className="border-t border-b border-white/5 bg-[#070b07] py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <p className="text-gold uppercase tracking-[0.35em] text-[10px] mb-3">Intention Matcher</p>
            <h2 className="font-display text-4xl font-light mb-6">BUILD YOUR <br /><span className="italic text-gold font-serif">JOURNEY</span></h2>
            <p className="text-white/40 text-sm leading-relaxed mb-8">
              Select your primary core wellness intention parameter below. Our alignment generator shifts metrics and routes treatments matching targeted recovery indexes natively.
            </p>
            <div className="space-y-3">
              {[
                { id: 'stress', label: 'Nervous System Decompression', metric: 'Stress Drop Index' },
                { id: 'sleep', label: 'Circadian Sleep Restoration', metric: 'REM Depth Enhancer' },
                { id: 'energy', label: 'Cellular Vitality & Awakening', metric: 'ATP Energy Surge' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setFocus(item.id)}
                  className={`w-full text-left p-4 rounded-sm border transition-all flex items-center justify-between ${
                    focus === item.id ? 'bg-gold/5 border-gold/40 text-cream' : 'bg-transparent border-white/5 text-white/40 hover:border-white/10'
                  }`}
                >
                  <span className="text-xs uppercase tracking-wider">{item.label}</span>
                  <span className="text-[10px] font-mono text-gold/60">{item.metric}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
            {matchedRituals.map((r) => (
              <div
                key={r.id}
                onClick={() => onSelectRitual(r.id)}
                className="bg-black/30 border border-white/5 p-5 rounded-sm hover:border-gold/20 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-mono uppercase text-gold tracking-widest">{r.duration}</span>
                  <span className="text-xs font-mono text-white/30">KES {r.price.toLocaleString()}</span>
                </div>
                <h4 className="font-display text-lg text-cream mb-2 group-hover:text-gold transition-colors">{r.name}</h4>
                <p className="text-white/40 text-xs line-clamp-2 mb-4 font-light">{r.description}</p>
                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-gold h-full rounded-full"
                    style={{ width: `${(r.recovery as any)[focus] || 80}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function TherapistSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center max-w-xl mx-auto mb-16">
        <p className="text-gold uppercase tracking-[0.35em] text-[10px] mb-3">Sanctuary Practitioners</p>
        <h2 className="font-display text-4xl font-light">HEALING ENERGIES</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {therapists.map((t) => (
          <div key={t.id} className="bg-[#0a0f0a] border border-white/5 p-8 rounded-sm relative overflow-hidden group">
            <div className="flex items-center gap-6 mb-6">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border border-gold/20">
                <Image src={t.image} alt={t.name} fill className="object-cover" />
              </div>
              <div>
                <h3 className="font-display text-xl text-cream">{t.name}</h3>
                <p className="text-gold text-xs font-mono">{t.energy} Catalyst</p>
                <p className="text-white/30 text-[11px] font-mono">{t.frequency}</p>
              </div>
            </div>
            <p className="text-white/50 italic text-sm mb-4">"{t.philosophy}"</p>
            <div className="border-t border-white/5 pt-4">
              <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2">Primary Specialities</p>
              <div className="flex flex-wrap gap-1.5">
                {t.specialties.map((s, idx) => (
                  <span key={idx} className="text-[10px] text-white/50 bg-white/5 border border-white/5 px-2 py-0.5 rounded-sm">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function TestimonialsSection() {
  return (
    <section className="bg-black/20 border-t border-white/5 py-24">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className="text-gold tracking-[0.3em] uppercase text-[10px] mb-4">Verified Journeys</p>
        <h3 className="font-serif italic text-2xl md:text-3xl text-cream font-light max-w-2xl mx-auto leading-relaxed">
          "The Ubuntu Signature Therapy shifted something deep inside my nervous system. Malik Adele didn't just ease muscle knots; he held a space of pure stillness."
        </h3>
        <p className="text-gold uppercase tracking-widest font-mono text-xs mt-6">— Elena R., Nairobi Resident</p>
      </div>
    </section>
  )
}

function MembershipSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
      <div className="bg-gradient-to-r from-[#070c07] to-[#0a140a] border border-gold/10 p-12 rounded-sm relative overflow-hidden">
        <div className="max-w-2xl">
          <span className="text-gold font-mono text-xs uppercase tracking-widest mb-2 inline-block">The Guild Alignment</span>
          <h2 className="font-display text-3xl md:text-4xl font-light text-cream mb-4">SANCTUARY SUBSCRIPTION RESIDENCY</h2>
          <p className="text-white/40 text-sm leading-relaxed mb-8">
            Secure priority live booking access matrix lines, continuous locked-in local community flat rates, and seasonal herbal botanical care drops. KES 15,000 monthly retention index.
          </p>
          <button className="bg-gold text-[#050705] font-mono uppercase text-xs font-semibold tracking-wider px-6 py-3.5 rounded-sm hover:bg-gold-light transition-all">
            Inquire For Membership Guild
          </button>
        </div>
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section className="text-center py-24 bg-[#030503] relative border-t border-white/5">
      <h2 className="font-display text-4xl md:text-6xl font-light mb-6 text-cream">BEGIN THE EXPANSION</h2>
      <p className="text-white/40 text-sm max-w-md mx-auto mb-8 font-light">
        Moxie AI Concierge handles automated cart processing nodes and scheduling matrix tracks natively.
      </p>
      <button
        onClick={() => {
          const moxieBtn = document.querySelector('[data-moxie-launcher]') as HTMLButtonElement
          moxieBtn?.click()
        }}
        className="border border-gold text-gold tracking-widest uppercase text-xs font-mono px-8 py-4 bg-gold/5 hover:bg-gold/10 transition-all rounded-sm"
      >
        Summon Moxie Chat Concierge
      </button>
    </section>
  )
}

function RitualDetailModal({ ritual, onClose }: { ritual: Ritual; onClose: () => void }) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    addItem({
      id: ritual.id,
      name: ritual.name,
      price: ritual.price,
      quantity: 1,
      category: 'spa',
    })
    toast.success(`${ritual.name} Added to Wellness Cart`, {
      style: { background: '#0a100a', color: '#e6dfd5', border: '1px solid rgba(212,175,55,0.15)' },
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        layoutId={`card-${ritual.id}`}
        className="bg-[#070b07] border border-white/10 rounded-sm w-full max-w-3xl overflow-hidden max-h-[90vh] overflow-y-auto relative text-left"
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-50 text-white/50 hover:text-white font-mono text-sm uppercase tracking-widest bg-black/40 px-3 py-1 rounded-sm border border-white/5">
          Close ×
        </button>
        <div className="relative h-64 md:h-80 w-full">
          <Image src={ritual.image} alt={ritual.name} fill className="object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b07] via-transparent to-black/30" />
          <div className="absolute bottom-6 left-6 right-6">
            <span className="text-gold text-xs uppercase tracking-widest font-mono bg-black/50 px-3 py-1 rounded-sm border border-white/5 mb-2 inline-block">
              {ritual.categoryTag}
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-light text-cream leading-none">{ritual.name}</h2>
          </div>
        </div>

        <div className="p-6 md:p-8 grid md:grid-cols-12 gap-8">
          <div className="md:col-span-7 space-y-6">
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-widest font-mono mb-2">Ritual Blueprint</p>
              <p className="text-white/70 text-sm font-light leading-relaxed">{ritual.description}</p>
            </div>

            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-widest font-mono mb-3">Timeline Sequence</p>
              <div className="space-y-2">
                {ritual.timeline.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs text-white/50 border-l border-gold/20 pl-3 py-0.5">
                    <span className="text-gold font-mono text-[10px]">{step.split(' — ')[0]}</span>
                    <span className="font-light">{step.split(' — ')[1]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-5 bg-black/20 border border-white/5 p-6 rounded-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-xs text-white/40 uppercase tracking-wider">Duration</span>
                <span className="text-sm font-mono text-cream font-medium">{ritual.duration}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-xs text-white/40 uppercase tracking-wider">Soundscape</span>
                <span className="text-sm font-mono text-gold/80">{ritual.soundscape}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-xs text-white/40 uppercase tracking-wider">Heat Level</span>
                <span className="text-sm font-mono text-cream/70">{ritual.heatLevel}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/40 uppercase tracking-wider">Investment</span>
                <span className="text-lg font-mono text-gold font-semibold">KES {ritual.price.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-gold hover:bg-gold-light text-[#050705] font-mono text-xs uppercase tracking-widest font-bold py-4 rounded-sm transition-all mt-8"
            >
              Add To Wellness Cart
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function useTransformToRituals(focus: string) {
  return rituals.slice(0, 4)
}