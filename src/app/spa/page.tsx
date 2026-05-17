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
  'detox-purify-package':        { glow: 'rgba(100,160,100,0.16)', label: 'Detox & Purify'     },
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
// Images selected to authentically represent each treatment
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
    pressure: 'Extra Gentle',
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
      '30 MIN — Hydration Mask',
      '45 MIN — Facial Massage',
      '50 MIN — SPF & Finish',
    ],
    addOns: ['Body Mask', 'Herbal Soak', 'Aromatherapy Massage'],
    recovery: { stress: 76, sleep: 72, energy: 84, emotional: 86 },
  },
  {
    id: 'skin-renewal-facial',
    name: 'Skin Renewal Facial',
    duration: '60 MIN',
    price: 5000,
    categoryTag: 'Facial',
    status: 'age reversal',
    aromaNotes: ['Vitamin C', 'Papaya', 'Turmeric'],
    soundscape: 'Soft Morning Frequencies',
    mood: 'Skin renewal, brightening and anti-aging',
    heatLevel: 'Warm Enzyme Treatment',
    pressure: 'Medium Sculpt',
    image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070&auto=format&fit=crop',
    description: 'Advanced skin renewal treatment using natural enzyme exfoliants, vitamin-rich botanicals and facial massage techniques to restore luminosity and youthful clarity.',
    timeline: [
      '00 MIN — Deep Cleanse',
      '10 MIN — Enzyme Exfoliation',
      '25 MIN — Renewal Mask',
      '40 MIN — LED or Gua Sha Lift',
      '55 MIN — Serum & Protection',
      '60 MIN — Facial Sculpt Finish',
    ],
    addOns: ['Body Exfoliation', 'Herbal Soak', 'Body Mask'],
    recovery: { stress: 78, sleep: 74, energy: 86, emotional: 90 },
  },
  {
    id: 'herbal-facial',
    name: 'Herbal Facial',
    duration: '50 MIN',
    price: 4500,
    categoryTag: 'Facial',
    status: 'garden fresh',
    aromaNotes: ['Chamomile', 'Green Tea', 'Wild Herbs'],
    soundscape: 'Herb Garden Frequencies',
    mood: 'Calming, soothing and botanical healing',
    heatLevel: 'Warm Herbal Steam',
    pressure: 'Gentle',
    image: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?q=80&w=2070&auto=format&fit=crop',
    description: 'A farm-to-face herbal facial using fresh botanicals harvested from the Ubuntu garden. Anti-inflammatory herbs calm, heal and restore sensitive or stressed skin.',
    timeline: [
      '00 MIN — Botanical Cleansing',
      '10 MIN — Herbal Steam',
      '20 MIN — Fresh Herb Mask Application',
      '40 MIN — Facial Massage',
      '50 MIN — Herbal Glow Finish',
    ],
    addOns: ['Hydrating Facial', 'Herbal Soak', 'Ubuntu Signature Therapy'],
    recovery: { stress: 80, sleep: 76, energy: 82, emotional: 88 },
  },
  {
    id: 'hair-masking-treatment',
    name: 'Hair Masking Treatment',
    duration: '45 MIN',
    price: 3500,
    categoryTag: 'Hair Wellness',
    status: 'scalp revival',
    aromaNotes: ['Baobab', 'Argan', 'Wild Herbs'],
    soundscape: 'Garden & Nature Frequencies',
    mood: 'Hair restoration and scalp nourishment',
    heatLevel: 'Warm Towel Wrap',
    pressure: 'Scalp Massage',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=2070&auto=format&fit=crop',
    description: 'Deep conditioning hair treatment using African botanicals including baobab oil and argan. Restores moisture, improves scalp health and brings back shine and strength.',
    timeline: [
      '00 MIN — Scalp Assessment',
      '10 MIN — Botanical Mask Application',
      '20 MIN — Scalp Massage',
      '35 MIN — Warm Towel Wrap',
      '45 MIN — Rinse & Finish',
    ],
    addOns: ['Herbal Facial', 'Hydrating Facial', 'Aromatherapy Massage'],
    recovery: { stress: 72, sleep: 70, energy: 78, emotional: 80 },
  },
  // ── SIGNATURE PACKAGES ─────────────────────────────────────
  {
    id: 'detox-purify-package',
    name: 'Detox & Purify Package',
    duration: '3–4 HRS',
    price: 9500,
    categoryTag: 'Signature Package',
    status: 'deep cleanse',
    aromaNotes: ['Clay', 'Mineral Salts', 'Eucalyptus'],
    soundscape: 'Earth Detox Frequencies',
    mood: 'Deep cleansing, detoxification and skin renewal',
    heatLevel: 'Full Thermal Journey',
    pressure: 'Varied',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070&auto=format&fit=crop',
    description: 'Moroccan Bath or Mud Bath · Body Exfoliation · Sauna or Steam · Herbal Soak. Ideal for deep cleansing, detoxification and skin renewal.',
    timeline: [
      '00 MIN — Welcome Herbal Tea',
      '20 MIN — Moroccan Bath or Mud Bath',
      '60 MIN — Body Exfoliation',
      '90 MIN — Sauna or Steam Session',
      '130 MIN — Herbal Soak',
      '180 MIN — Rest & Integration',
    ],
    addOns: ['Body Mask', 'Reflexology', 'Hydrating Facial'],
    recovery: { stress: 92, sleep: 86, energy: 88, emotional: 84 },
  },
  {
    id: 'stress-relief-package',
    name: 'Stress Relief Package',
    duration: '3–4 HRS',
    price: 10000,
    categoryTag: 'Signature Package',
    status: 'emotional reset',
    aromaNotes: ['Lavender', 'Neroli', 'Rose'],
    soundscape: 'Calm & Restoration Frequencies',
    mood: 'Relaxation, emotional wellness and stress release',
    heatLevel: 'Warm Aromatic Journey',
    pressure: 'Light to Medium',
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=2070&auto=format&fit=crop',
    description: 'Aromatherapy Massage · Salt Bath · Reflexology · Hydrating Facial. Ideal for relaxation, emotional wellness and stress release.',
    timeline: [
      '00 MIN — Welcome & Intention Setting',
      '20 MIN — Aromatherapy Massage',
      '80 MIN — Salt Bath',
      '120 MIN — Reflexology',
      '165 MIN — Hydrating Facial',
      '215 MIN — Tea & Rest',
    ],
    addOns: ['Steam Session', 'Herbal Soak', 'Hair Masking Treatment'],
    recovery: { stress: 96, sleep: 88, energy: 84, emotional: 94 },
  },
  {
    id: 'arohamai-signature-healing',
    name: 'Arohamai Signature Healing Package',
    duration: '4–5 HRS',
    price: 14000,
    categoryTag: 'Signature Package',
    status: 'premium healing',
    aromaNotes: ['Maasai Oil', 'Wild Sage', 'Baobab', 'Rose'],
    soundscape: 'Full Sanctuary Frequencies',
    mood: 'Premium full-body healing and rejuvenation',
    heatLevel: 'Full Custom Thermal Journey',
    pressure: 'Full Custom',
    image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=2070&auto=format&fit=crop',
    description: 'Ubuntu Signature Therapy · Herbal Soak · Body Mask · Skin Renewal Facial. Our flagship experience for premium full-body healing and rejuvenation.',
    timeline: [
      '00 MIN — Sanctuary Arrival & Herbal Tea',
      '30 MIN — Ubuntu Signature Therapy',
      '120 MIN — Herbal Soak',
      '170 MIN — Body Mask',
      '220 MIN — Skin Renewal Facial',
      '280 MIN — Rest & Integration Lounge',
    ],
    addOns: ['Sauna Session', 'Hair Masking Treatment', 'Reflexology'],
    recovery: { stress: 99, sleep: 94, energy: 94, emotional: 98 },
  },
  {
    id: 'muscle-recovery-package',
    name: 'Muscle Recovery Package',
    duration: '3–4 HRS',
    price: 11500,
    categoryTag: 'Signature Package',
    status: 'athlete approved',
    aromaNotes: ['Peppermint', 'Camphor', 'Eucalyptus'],
    soundscape: 'Recovery & Strength Frequencies',
    mood: 'Muscle recovery, soreness and active lifestyles',
    heatLevel: 'Contrast Therapy (Hot & Cold)',
    pressure: 'Deep',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop',
    description: 'Ice Bath · Deep Tissue Massage · Bamboo Stick Therapy · Sauna or Steam. Ideal for muscle recovery, soreness and active lifestyles.',
    timeline: [
      '00 MIN — Pre-Treatment Assessment',
      '20 MIN — Ice Bath',
      '50 MIN — Deep Tissue Massage',
      '110 MIN — Bamboo Stick Therapy',
      '170 MIN — Sauna or Steam',
      '230 MIN — Recovery Rest',
    ],
    addOns: ['Wood Therapy', 'Lymphatic Drainage', 'Body Exfoliation'],
    recovery: { stress: 88, sleep: 90, energy: 96, emotional: 82 },
  },
  {
    id: 'glow-beauty-package',
    name: 'Glow & Beauty Package',
    duration: '3–4 HRS',
    price: 10500,
    categoryTag: 'Signature Package',
    status: 'radiance ritual',
    aromaNotes: ['Vitamin C', 'Rosewater', 'Argan'],
    soundscape: 'Luminosity Frequencies',
    mood: 'Radiant skin, self-care and beauty wellness',
    heatLevel: 'Warm Pampering Treatments',
    pressure: 'Varied Gentle',
    image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070&auto=format&fit=crop',
    description: 'Body Exfoliation · Body Mask · Hydrating Facial · Hair Masking Treatment. Ideal for radiant skin, self-care and beauty wellness.',
    timeline: [
      '00 MIN — Beauty Consultation',
      '20 MIN — Body Exfoliation',
      '65 MIN — Body Mask',
      '115 MIN — Hydrating Facial',
      '165 MIN — Hair Masking Treatment',
      '210 MIN — Glow Finish & Rest',
    ],
    addOns: ['Aromatherapy Massage', 'Skin Renewal Facial', 'Salt Bath'],
    recovery: { stress: 78, sleep: 76, energy: 86, emotional: 90 },
  },
  {
    id: 'mothers-wellness-package',
    name: "Mother's Wellness Package",
    duration: '3 HRS',
    price: 9000,
    categoryTag: 'Signature Package',
    status: 'prenatal care',
    aromaNotes: ['Neroli', 'Chamomile', 'Lavender'],
    soundscape: 'Nurturing & Gentle Frequencies',
    mood: 'Prenatal relaxation and nurturing care',
    heatLevel: 'Gentle Warm Treatments',
    pressure: 'Extra Gentle',
    image: 'https://images.unsplash.com/photo-1531983412531-1f49a365ffed?q=80&w=2070&auto=format&fit=crop',
    description: "Mama-to-Be Therapy · Herbal Soak · Reflexology · Herbal Facial. Ideal for prenatal relaxation and nurturing care for expectant mothers.",
    timeline: [
      '00 MIN — Nurturing Welcome',
      '15 MIN — Mama-to-Be Therapy',
      '75 MIN — Herbal Soak',
      '125 MIN — Reflexology',
      '170 MIN — Herbal Facial',
      '220 MIN — Rest & Bonding',
    ],
    addOns: ['Hydrating Facial', 'Salt Bath', 'Hair Masking Treatment'],
    recovery: { stress: 92, sleep: 90, energy: 80, emotional: 98 },
  },
  {
    id: 'lymphatic-slimming-package',
    name: 'Lymphatic Slimming Package',
    duration: '3–4 HRS',
    price: 12000,
    categoryTag: 'Signature Package',
    status: 'body contouring',
    aromaNotes: ['Grapefruit', 'Juniper', 'Cedar'],
    soundscape: 'Flow & Circulation Frequencies',
    mood: 'Detox, body contouring and circulation support',
    heatLevel: 'Sauna & Warm Therapy',
    pressure: 'Rhythmic to Deep',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=2070&auto=format&fit=crop',
    description: 'Lymphatic Drainage Therapy · Wood Therapy · Body Exfoliation · Sauna Session. Ideal for detox, body contouring and circulation support.',
    timeline: [
      '00 MIN — Body Assessment & Consultation',
      '20 MIN — Lymphatic Drainage Therapy',
      '80 MIN — Wood Therapy',
      '140 MIN — Body Exfoliation',
      '185 MIN — Sauna Session',
      '245 MIN — Recovery & Cooling',
    ],
    addOns: ['Mud Bath', 'Ice Bath', 'Balancing Therapy'],
    recovery: { stress: 84, sleep: 80, energy: 90, emotional: 82 },
  },
  // ── DAY EXPERIENCES ────────────────────────────────────────
  {
    id: 'half-day-retreat',
    name: 'Half Day Rejuvenation Retreat',
    duration: '4 HRS',
    price: 18000,
    categoryTag: 'Day Experience',
    status: 'exclusive access',
    aromaNotes: ['Rose', 'Oud', 'Wild Herbs'],
    soundscape: 'Full Sanctuary Frequencies',
    mood: 'Complete system restoration and rejuvenation',
    heatLevel: 'Full Thermal Journey',
    pressure: 'Full Custom',
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=2070&auto=format&fit=crop',
    description: 'Welcome herbal tea · Bath therapy · Signature massage · Facial treatment · Healthy wellness meal. The complete Arohamai half-day experience.',
    timeline: [
      '00 MIN — Welcome Herbal Tea',
      '20 MIN — Bath Therapy (choice)',
      '80 MIN — Signature Massage',
      '170 MIN — Facial Treatment',
      '230 MIN — Healthy Wellness Meal',
      '240 MIN — Relaxation Lounge',
    ],
    addOns: ['Private Suite', 'Body Mask', 'Hair Masking Treatment'],
    recovery: { stress: 96, sleep: 92, energy: 94, emotional: 96 },
  },
  {
    id: 'full-day-escape',
    name: 'Full Day Arohamai Wellness Escape',
    duration: '8 HRS',
    price: 30000,
    categoryTag: 'Day Experience',
    status: 'full sanctuary',
    aromaNotes: ['Frankincense', 'Neroli', 'Wild Rose', 'African Violet'],
    soundscape: 'Full Sanctuary Frequencies',
    mood: 'Complete life restoration — body, mind and spirit',
    heatLevel: 'All Thermal Experiences',
    pressure: 'Fully Personalised',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070&auto=format&fit=crop',
    description: 'Full access to spa facilities · Personalized therapy session · Body treatment · Facial or hair ritual · Lunch and refreshments · Relaxation lounge access.',
    timeline: [
      '00 MIN — Private Sanctuary Arrival & Consultation',
      '60 MIN — Bath Therapy (choice)',
      '120 MIN — Personalized Therapy Session',
      '210 MIN — Body Treatment',
      '270 MIN — Lunch & Refreshments',
      '330 MIN — Facial or Hair Ritual',
      '390 MIN — Thermal Pools & Relaxation Lounge',
      '480 MIN — Integration & Farewell',
    ],
    addOns: ['Sunset Extension', 'Couples Upgrade', 'Private Lounge'],
    recovery: { stress: 99, sleep: 97, energy: 98, emotional: 99 },
  },
]

type Ritual = typeof rituals[0]

// ─────────────────────────────────────────────────────────────
// SPA SERVICES GATEWAY — updated to reflect AROHOMAI offerings
// Images carefully selected to represent each service authentically
// ─────────────────────────────────────────────────────────────

const spaServices = [
  {
    title: 'Bath & Heat Therapies',
    subtitle: 'From KES 2,000',
    tag: 'Detox & Restore',
    ritualId: 'moroccan-bath',
    accent: 'rgba(160,80,160,0.16)',
    image: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?q=80&w=2070&auto=format&fit=crop',
    description: 'Mud bath, salt bath, smoked bath, ice bath, Moroccan hammam, sauna, steam, herbal soak. Eight ways to cleanse, detoxify and restore.',
    cta: 'Explore Bath Therapies',
  },
  {
    title: 'Massage & Body Therapies',
    subtitle: 'From KES 3,500',
    tag: 'Therapeutic Healing',
    ritualId: 'ubuntu-signature-therapy',
    accent: 'rgba(180,120,40,0.18)',
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=2070&auto=format&fit=crop',
    description: 'Ubuntu Signature Therapy, aromatherapy, deep tissue, lymphatic drainage, Swedish, shiatsu, bamboo stick, wood therapy, reflexology and prenatal care.',
    cta: 'Explore Massages',
  },
  {
    title: 'Body Care Treatments',
    subtitle: 'From KES 3,000',
    tag: 'Skin Renewal',
    ritualId: 'body-exfoliation',
    accent: 'rgba(160,120,60,0.16)',
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?q=80&w=2070&auto=format&fit=crop',
    description: 'Full body mask and exfoliation treatments using natural botanicals. Polish, nourish and protect your skin with African earth ingredients.',
    cta: 'Explore Body Care',
  },
  {
    title: 'Facial & Hair Wellness',
    subtitle: 'From KES 3,500',
    tag: 'Natural Beauty',
    ritualId: 'hydrating-facial',
    accent: 'rgba(200,180,80,0.14)',
    image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070&auto=format&fit=crop',
    description: 'Hydrating facial, skin renewal facial, herbal facial and hair masking treatment. Healthy beauty through natural, farm-sourced care.',
    cta: 'Book a Facial',
  },
  {
    title: 'Signature Packages',
    subtitle: 'From KES 9,000',
    tag: 'Curated Journey',
    ritualId: 'arohamai-signature-healing',
    accent: 'rgba(212,175,55,0.18)',
    image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=2070&auto=format&fit=crop',
    description: 'Seven curated wellness journeys — detox, stress relief, full healing, muscle recovery, glow, prenatal care and lymphatic slimming.',
    cta: 'View All Packages',
  },
  {
    title: 'Couples Sanctuary',
    subtitle: 'From KES 10,000',
    tag: 'Couples',
    ritualId: 'stress-relief-package',
    accent: 'rgba(40,140,60,0.16)',
    image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=2070&auto=format&fit=crop',
    description: 'Side-by-side rituals for two. Customise your shared healing journey with matching therapies, herbal soaks and private sanctuary time.',
    cta: 'Book for Two',
  },
  {
    title: 'Half Day Retreat',
    subtitle: 'KES 18,000',
    tag: 'Day Experience',
    ritualId: 'half-day-retreat',
    accent: 'rgba(180,140,200,0.16)',
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=2070&auto=format&fit=crop',
    description: 'Herbal tea welcome, bath therapy, signature massage, facial and a healthy wellness meal. Four hours of complete restoration.',
    cta: 'Reserve Your Retreat',
  },
  {
    title: 'Full Day Escape',
    subtitle: 'KES 30,000',
    tag: 'Full Sanctuary',
    ritualId: 'full-day-escape',
    accent: 'rgba(212,175,55,0.20)',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070&auto=format&fit=crop',
    description: 'Complete day access — personalized therapy, body treatment, facial, lunch and full relaxation lounge. The complete Arohamai experience.',
    cta: 'Book Full Day',
  },
]

// ─────────────────────────────────────────────────────────────
// FARM INGREDIENTS — updated to match Arohamai botanicals
// ─────────────────────────────────────────────────────────────

const farmIngredients = [
  { name: 'Volcanic Mud Clay', origin: 'Great Rift Valley, Kenya', benefit: 'Deep pore purification and mineral rebalancing', note: 'Sourced from geothermal deposits in the Kenyan highlands', icon: '🌋' },
  { name: 'Wild Baobab Oil', origin: 'Coastal Lowlands, Kenya', benefit: 'Cellular regeneration and deep moisture binding', note: 'Cold-pressed from ancient baobab trees by local cooperatives', icon: '🌿' },
  { name: 'Fresh Aloe Vera', origin: 'Ubuntu Village Garden, 200m', benefit: 'Instant cooling, anti-inflammatory restoration', note: 'Cut fresh daily at 6am from our garden', icon: '🌱' },
  { name: 'Lemongrass & Eucalyptus', origin: 'Ubuntu Herb Garden, 200m', benefit: 'Mental clarity, respiratory opening, steam infusion', note: 'Steam-distilled on-site in small batches', icon: '🌾' },
  { name: 'Raw Shea Butter', origin: 'Northern Kenya Cooperatives', benefit: 'Deep skin barrier restoration and elasticity', note: 'Unrefined, ethically sourced from women cooperatives', icon: '🫙' },
  { name: 'Wild Marula & Argan', origin: 'Laikipia Plateau, Kenya', benefit: 'Antioxidant protection and luxurious nourishment', note: 'Sustainably harvested during fruit season', icon: '🍋' },
]

// ─────────────────────────────────────────────────────────────
// TESTIMONIALS — updated to match Arohamai services
// ─────────────────────────────────────────────────────────────

const testimonials = [
  {
    name: 'Nia M.',
    title: 'Executive Director, Nairobi',
    quote: 'I arrived burnt out. The Ubuntu Signature Therapy left me feeling like my nervous system had finally exhaled. This is not a treatment — it is a ceremony.',
    ritual: 'Ubuntu Signature Therapy',
    duration: '90 MIN',
  },
  {
    name: 'Amina & David K.',
    title: 'Couple, from Mombasa',
    quote: 'We booked the Arohamai Signature Healing Package. Four hours. We did not speak for the first hour after. That silence said everything.',
    ritual: 'Arohamai Signature Healing Package',
    duration: '4–5 HRS',
  },
  {
    name: 'Dr. Seren O.',
    title: 'Surgeon, Nairobi',
    quote: 'Six Senses. Aman. SHA. I have been to them all. The Arohamai Moroccan Bath at Ubuntu feels like something none of them have yet discovered.',
    ritual: 'Full Day Arohamai Wellness Escape',
    duration: '8 HRS',
  },
]

// ─────────────────────────────────────────────────────────────
// WELLNESS BUILDER — updated to match Arohamai treatments
// ─────────────────────────────────────────────────────────────

const wellnessGoals = ['Stress Relief', 'Deep Sleep', 'Energy Restoration', 'Emotional Reset', 'Skin Renewal', 'Muscle Recovery']
const wellnessRecommendations: Record<string, string> = {
  'Stress Relief':       'stress-relief-package',
  'Deep Sleep':          'herbal-soak',
  'Energy Restoration':  'muscle-recovery-package',
  'Emotional Reset':     'ubuntu-signature-therapy',
  'Skin Renewal':        'glow-beauty-package',
  'Muscle Recovery':     'muscle-recovery-package',
}

// ─────────────────────────────────────────────────────────────
// ALL REMAINING COMPONENTS PRESERVED EXACTLY FROM v4
// ─────────────────────────────────────────────────────────────

function FloatingParticles({ count = 14 }: { count?: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ y: ['0%', '-130%'], opacity: [0, 0.45, 0] }}
          transition={{ duration: 14 + i * 0.7, repeat: Infinity, ease: 'linear', delay: i * 0.6 }}
          className="absolute bottom-0 w-px h-px rounded-full bg-gold/25"
          style={{ left: `${i * (100 / count)}%` }}
        />
      ))}
    </div>
  )
}

function MagneticButton({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 180, damping: 20 })
  const springY = useSpring(y, { stiffness: 180, damping: 20 })

  return (
    <motion.button
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        x.set((e.clientX - rect.left - rect.width / 2) * 0.10)
        y.set((e.clientY - rect.top - rect.height / 2) * 0.10)
      }}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      style={{ x: springX, y: springY }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  )
}

function RecoveryMeter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between mb-1.5 text-[9px] uppercase tracking-[0.25em] text-white/35">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1 bg-white/5 overflow-hidden rounded-full">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          transition={{ duration: 1.6, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="h-full bg-gradient-to-r from-gold/40 to-gold rounded-full"
        />
      </div>
    </div>
  )
}

function CinematicHero({ onExplore }: { onExplore: () => void }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const bgY    = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const textOp = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const textY  = useTransform(scrollYProgress, [0, 0.5], ['0%', '6%'])

  return (
    <section ref={ref} className="relative w-full min-h-screen flex flex-col overflow-hidden">
      <motion.div style={{ y: bgY }} className="absolute inset-0 scale-[1.1]">
        <Image
          src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=2070&auto=format&fit=crop"
          alt="Arohamai Spa at Ubuntu Eco Lodge"
          fill
          priority
          className="object-cover"
        />
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 1 }}
        >
          <source src="/videos/spa-cinematic.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/55"                style={{ zIndex: 2 }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-transparent to-[#050505]" style={{ zIndex: 3 }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_40%,rgba(212,175,55,0.08),transparent)]" style={{ zIndex: 4 }} />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
          style={{
            zIndex: 5,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />
      </motion.div>

      <FloatingParticles count={14} />

      <motion.div
        style={{ opacity: textOp, y: textY, zIndex: 10 } as React.CSSProperties}
        className="relative flex-1 flex items-center justify-center px-6 pt-[120px] pb-16"
      >
        <div className="max-w-6xl w-full mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.8, delay: 0.5 }}
              className="inline-block px-6 py-2.5 mb-10 border border-gold/20 bg-black/35 backdrop-blur-xl text-gold uppercase tracking-[0.35em] text-[10px] rounded-full"
            >
              Arohamai Spa · Ubuntu Eco Lodge · Holistic Wellness
            </motion.span>

            <h1 className="font-display text-[clamp(3rem,8.5vw,8.5rem)] leading-[0.84] tracking-tight mb-8">
              ENTER THE
              <br />
              <span className="italic text-gold">HEALING SANCTUARY</span>
            </h1>

            <p className="max-w-2xl mx-auto text-base md:text-lg text-white/42 leading-relaxed mb-12 italic font-light">
              Holistic wellness from skin to body. Affordable luxury inspired by healing,
              nature, and restoration — mud baths, Moroccan hammam, massage therapies,
              facials, and signature healing packages.
            </p>

            <div className="flex flex-wrap justify-center gap-5">
              <MagneticButton
                className="btn-gold !px-10 !py-4 !text-[10px]"
                onClick={onExplore}
              >
                EXPLORE SERVICES
              </MagneticButton>
              <Link
                href="/contact"
                className="border border-gold/25 bg-black/20 backdrop-blur-xl px-9 py-4 uppercase tracking-[0.25em] text-[10px] text-gold hover:bg-gold/10 transition-all duration-700 rounded-full"
              >
                BOOK YOUR RITUAL
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="relative flex flex-col items-center gap-2 pb-10 self-center"
        style={{ zIndex: 10 }}
      >
        <span className="text-[8px] uppercase tracking-[0.4em] text-white/18">Descend</span>
        <div className="w-px h-9 bg-gradient-to-b from-gold/25 to-transparent" />
      </motion.div>
    </section>
  )
}

function SpaStatsBar() {
  const stats = [
    { label: 'Spa Treatments',      value: '30+',                           sub: 'Services & Packages'   },
    { label: 'Healing Traditions',  value: 'African · Moroccan · Nordic',   sub: 'Origins'               },
    { label: 'Therapist Profiles',  value: 'Energy-Matched',                sub: 'Personalised'          },
    { label: 'Farm Ingredients',    value: '200m',                          sub: 'Soil to skin'          },
  ]

  return (
    <section className="w-full bg-[#080808] border-b border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
        {stats.map(({ label, value, sub }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.7 }}
            viewport={{ once: true }}
            className="px-6 py-8"
          >
            <p className="text-[8px] uppercase tracking-[0.35em] text-white/22 mb-2">{label}</p>
            <p className="font-display text-lg md:text-xl text-gold leading-tight mb-1">{value}</p>
            <p className="text-[8px] uppercase tracking-[0.25em] text-white/18">{sub}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function SpaServicesGrid({ onOpenRitual }: { onOpenRitual: (id: string) => void }) {
  return (
    <section id="services" className="py-28 px-6 md:px-10 bg-[#050505]">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-20">
          <p className="text-gold uppercase tracking-[0.35em] text-[10px] mb-5">Arohamai Spa · Full Service Suite</p>
          <h2 className="font-display text-5xl md:text-6xl leading-none mb-6">
            THE FULL
            <span className="italic text-gold"> SANCTUARY</span>
          </h2>
          <p className="text-white/38 text-lg leading-relaxed">
            Every space inside Arohamai Spa is designed to be entered, experienced,
            and remembered. Choose where your restoration begins.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-7">
          {spaServices.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              onClick={() => onOpenRitual(service.ritualId)}
              className="group relative overflow-hidden rounded-[2rem] border border-white/5 hover:border-gold/18 bg-[#0a0a0a] transition-all duration-700 cursor-pointer"
            >
              <div className="relative h-[380px] overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover grayscale-[0.15] group-hover:scale-[1.045] group-hover:grayscale-0 transition-all duration-[2000ms]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/25 to-transparent" />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[1400ms]"
                  style={{ background: `radial-gradient(circle at 50% 65%, ${service.accent}, transparent 70%)` }}
                />
                <div className="absolute top-5 left-5 z-10">
                  <span className="px-3 py-1.5 text-[8px] uppercase tracking-[0.3em] border border-gold/22 bg-black/50 backdrop-blur-xl text-gold rounded-full">
                    {service.tag}
                  </span>
                </div>
                <div className="absolute top-5 right-5 z-10">
                  <span className="px-3 py-1.5 text-[8px] uppercase tracking-[0.22em] border border-white/10 bg-black/40 backdrop-blur-xl text-white/48 rounded-full">
                    {service.subtitle}
                  </span>
                </div>
              </div>
              <div className="p-7">
                <h3 className="font-display text-3xl md:text-4xl leading-none mb-3">{service.title}</h3>
                <p className="text-white/42 text-sm leading-relaxed mb-6">{service.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-[0.28em] text-gold border border-gold/20 px-5 py-2.5 rounded-full hover:bg-gold/8 transition-all duration-400">
                    {service.cta} →
                  </span>
                  <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/25 text-xs group-hover:border-gold/28 group-hover:text-gold transition-all duration-500">
                    ↗
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ThermalSanctuariesSection({ onOpenRitual }: { onOpenRitual: (id: string) => void }) {
  const thermals = [
    {
      name: 'Moroccan Bath',
      spec: 'KES 4,500 · 75 MIN',
      ritualId: 'moroccan-bath',
      description: 'Black soap, kessa exfoliation, argan oil seal and rose water on warm marble. North African tradition, Kenya setting.',
      image: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?q=80&w=2070&auto=format&fit=crop',
      glow: 'rgba(160,80,160,0.14)',
    },
    {
      name: 'Mud Bath',
      spec: 'KES 3,500 · 45 MIN',
      ritualId: 'mud-bath',
      description: 'Mineral-rich volcanic clay from the Great Rift Valley. Purifies pores, relieves deep muscle tension, renews from the outside in.',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop',
      glow: 'rgba(120,80,40,0.16)',
    },
    {
      name: 'Sauna & Steam',
      spec: 'From KES 2,000',
      ritualId: 'sauna-session',
      description: 'Traditional Finnish dry sauna and herbal steam sessions for cardiovascular reset, deep pore cleansing and cellular detox.',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop',
      glow: 'rgba(220,100,40,0.16)',
    },
    {
      name: 'Herbal Soak',
      spec: 'KES 3,000 · 50 MIN',
      ritualId: 'herbal-soak',
      description: 'Deeply restorative soak in locally sourced herb-infused warm water. Eases tension, nourishes the skin and calms the mind.',
      image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=2070&auto=format&fit=crop',
      glow: 'rgba(100,160,80,0.14)',
    },
  ]

  return (
    <section className="py-28 px-6 md:px-10 bg-[#080808] border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-20">
          <p className="text-gold uppercase tracking-[0.35em] text-[10px] mb-5">Bath & Heat Therapies</p>
          <h2 className="font-display text-5xl md:text-6xl leading-none mb-6">
            CLEANSE. DETOX.
            <span className="italic text-gold"> RESTORE.</span>
          </h2>
          <p className="text-white/38 text-lg leading-relaxed">
            Eight distinct bath and heat experiences. Each operates at a different temperature,
            tradition and intensity. All lead to the same destination: renewal.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-7">
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-7">
            {thermals.slice(0, 2).map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.10, duration: 0.85 }}
                viewport={{ once: true }}
                onClick={() => onOpenRitual(t.ritualId)}
                className="group relative overflow-hidden rounded-[2.5rem] border border-white/5 hover:border-gold/18 cursor-pointer transition-all duration-700"
              >
                <div className="relative h-[480px]">
                  <Image src={t.image} alt={t.name} fill className="object-cover group-hover:scale-[1.04] transition-all duration-[2000ms]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[1200ms]"
                    style={{ background: `radial-gradient(circle at center, ${t.glow}, transparent 70%)` }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                    <p className="text-[8px] uppercase tracking-[0.35em] text-gold/60 mb-2">{t.spec}</p>
                    <h3 className="font-display text-4xl leading-none mb-3">{t.name}</h3>
                    <p className="text-white/42 text-sm leading-relaxed mb-5">{t.description}</p>
                    <span className="text-[9px] uppercase tracking-[0.28em] text-gold border border-gold/22 px-5 py-2.5 rounded-full hover:bg-gold/8 transition-all inline-block">
                      Book Now →
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col gap-7">
            {thermals.slice(2).map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, x: 18 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.10, duration: 0.85 }}
                viewport={{ once: true }}
                onClick={() => onOpenRitual(t.ritualId)}
                className="group relative overflow-hidden rounded-[2.5rem] border border-white/5 hover:border-gold/18 cursor-pointer transition-all duration-700 flex-1"
              >
                <div className="relative h-[220px]">
                  <Image src={t.image} alt={t.name} fill className="object-cover group-hover:scale-[1.04] transition-all duration-[2000ms]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[1200ms]"
                    style={{ background: `radial-gradient(circle at center, ${t.glow}, transparent 70%)` }}
                  />
                </div>
                <div className="p-6 bg-[#0a0a0a]">
                  <p className="text-[8px] uppercase tracking-[0.35em] text-gold/55 mb-1.5">{t.spec}</p>
                  <h3 className="font-display text-2xl md:text-3xl leading-none mb-2">{t.name}</h3>
                  <p className="text-white/38 text-sm leading-relaxed line-clamp-3">{t.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function FarmToRitualSection() {
  return (
    <section className="py-28 px-6 md:px-10 bg-[#050505] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mb-18">
          <p className="text-gold uppercase tracking-[0.35em] text-[10px] mb-5">From Earth to Skin</p>
          <h2 className="font-display text-5xl md:text-6xl leading-none mb-6">
            200 METRES
            <span className="italic text-gold"> FROM SOIL TO SKIN</span>
          </h2>
          <p className="text-white/38 text-lg leading-relaxed max-w-2xl">
            Every ingredient in your Arohamai ritual is grown, harvested, or sourced within 200 metres
            of the treatment room — or directly from our trusted network of Kenyan farmers,
            cooperatives, and ancient rift valley soil.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {farmIngredients.map((ingredient, i) => (
            <motion.div
              key={ingredient.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="group border border-white/5 hover:border-gold/18 bg-[#0a0a0a] rounded-[2rem] p-7 transition-all duration-700"
            >
              <div className="text-3xl mb-4">{ingredient.icon}</div>
              <h3 className="font-display text-2xl mb-1.5 leading-none">{ingredient.name}</h3>
              <p className="text-[8px] uppercase tracking-[0.3em] text-gold mb-3">{ingredient.origin}</p>
              <p className="text-white/48 text-sm leading-relaxed mb-4">{ingredient.benefit}</p>
              <div className="pt-4 border-t border-white/5">
                <p className="text-[8px] tracking-[0.18em] text-white/18 italic">{ingredient.note}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="text-white/12 text-base italic max-w-xl mx-auto leading-relaxed">
            "We do not source from warehouses. We source from the earth that surrounds you."
          </p>
        </div>
      </div>
    </section>
  )
}

function QuickAddButton({ ritual }: { ritual: Ritual }) {
  const { addItem, openCart } = useCartStore()

  const addToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItem({
      id: ritual.id,
      name: ritual.name,
      category: 'spa',
      tag: ritual.categoryTag,
      price: ritual.price,
      unit: '/ session',
    })
    toast.success(`${ritual.name} added to Wellness Cart`)
  }

  return (
    <div className="flex gap-3 w-full">
      <button
        onClick={addToCart}
        className="flex-1 border border-gold/20 bg-gold/8 hover:bg-gold/18 text-gold py-3 text-[9px] uppercase tracking-[0.28em] transition-all duration-500 rounded-xl"
      >
        Add to Cart
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); openCart() }}
        className="px-5 border border-white/10 hover:border-gold/28 text-[9px] uppercase tracking-[0.22em] transition-all duration-500 rounded-xl"
      >
        Cart
      </button>
    </div>
  )
}

function RitualCard({ ritual, onOpen }: { ritual: Ritual; onOpen: (r: Ritual) => void }) {
  const accent = ritualAccents[ritual.id] ?? ritualAccents['ubuntu-signature-therapy']

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onOpen(ritual)}
      className="group relative overflow-hidden border border-white/5 bg-[#0a0a0a] hover:border-gold/18 transition-all duration-700 rounded-[2rem] cursor-pointer"
    >
      <div className="relative h-[600px] overflow-hidden">
        <Image
          src={ritual.image}
          alt={ritual.name}
          fill
          className="object-cover grayscale-[0.20] group-hover:scale-[1.055] group-hover:grayscale-0 transition-all duration-[2000ms]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/18 to-transparent" />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[1500ms]"
          style={{ background: `radial-gradient(circle at center, ${accent.glow}, transparent 70%)` }}
        />

        <div className="absolute top-5 left-5 flex gap-2 flex-wrap z-10">
          <span className="px-3 py-1.5 text-[8px] uppercase tracking-[0.28em] border border-gold/20 bg-black/42 backdrop-blur-xl text-gold rounded-full">
            {ritual.categoryTag}
          </span>
          <span className="px-3 py-1.5 text-[8px] uppercase tracking-[0.28em] border border-white/10 bg-black/38 backdrop-blur-xl text-white/52 rounded-full">
            {ritual.status}
          </span>
        </div>
        <div className="absolute top-5 right-5 z-10">
          <span className="text-[7px] uppercase tracking-[0.25em] text-gold/32">{accent.label}</span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-7 z-10">
          <p className="text-[9px] uppercase tracking-[0.38em] text-gold mb-3">Arohamai Spa</p>
          <h3 className="font-display text-4xl leading-none mb-3">{ritual.name}</h3>
          <p className="text-white/38 text-sm leading-relaxed mb-5 line-clamp-2 italic">"{ritual.description}"</p>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div>
              <p className="text-[7px] uppercase tracking-[0.3em] text-white/22 mb-1">Mood</p>
              <p className="font-mono text-[10px] text-gold/72">{ritual.mood}</p>
            </div>
            <div>
              <p className="text-[7px] uppercase tracking-[0.3em] text-white/22 mb-1">Soundscape</p>
              <p className="font-mono text-[10px] text-white/48">{ritual.soundscape}</p>
            </div>
          </div>

          <div className="mb-5">
            <QuickAddButton ritual={ritual} />
          </div>

          <div className="flex justify-between items-end">
            <div>
              <p className="font-display text-3xl text-gold">KES {ritual.price.toLocaleString()}</p>
              <p className="text-[7px] uppercase tracking-[0.22em] text-white/18">{ritual.duration}</p>
            </div>
            <button className="px-6 py-3 border border-white/10 text-[9px] uppercase tracking-[0.22em] hover:border-gold hover:text-gold transition-all duration-500 rounded-full bg-black/18">
              Enter →
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function RitualModal({ ritual, onClose }: { ritual: Ritual; onClose: () => void }) {
  const accent = ritualAccents[ritual.id] ?? ritualAccents['ubuntu-signature-therapy']
  const { addItem } = useCartStore()

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  const addToCart = () => {
    addItem({
      id: ritual.id,
      name: ritual.name,
      category: 'spa',
      tag: ritual.categoryTag,
      price: ritual.price,
      unit: '/ session',
    })
    toast.success(`${ritual.name} added to Wellness Cart`)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 6 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row rounded-[2.5rem] overflow-hidden border border-white/8 bg-[#080808] shadow-2xl"
        style={{ maxHeight: 'calc(100svh - 48px)' }}
      >
        <div className="relative lg:w-[42%] min-h-[260px] lg:min-h-0 flex-shrink-0 overflow-hidden">
          <Image src={ritual.image} alt={ritual.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/18 via-transparent to-black/55 lg:bg-gradient-to-r lg:from-transparent lg:to-[#080808]" />
          <div
            className="absolute inset-0 opacity-65"
            style={{ background: `radial-gradient(circle at 50% 50%, ${accent.glow}, transparent 70%)` }}
          />
          <FloatingParticles count={8} />
          <div className="absolute top-6 left-6 flex flex-wrap gap-2 z-10">
            <span className="px-3 py-1.5 text-[8px] uppercase tracking-[0.28em] border border-gold/25 bg-black/52 backdrop-blur-xl text-gold rounded-full">
              {ritual.categoryTag}
            </span>
            <span className="px-3 py-1.5 text-[8px] uppercase tracking-[0.28em] border border-white/10 bg-black/42 backdrop-blur-xl text-white/52 rounded-full">
              {ritual.status}
            </span>
          </div>
          <div className="absolute bottom-6 left-6 z-10">
            <p className="text-[8px] uppercase tracking-[0.32em] text-gold/45">{accent.label}</p>
          </div>
        </div>

        <div className="lg:w-[58%] overflow-y-auto p-7 md:p-10 flex flex-col gap-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[9px] uppercase tracking-[0.38em] text-gold mb-2">Arohamai Spa</p>
              <h2 className="font-display text-4xl md:text-5xl leading-none">{ritual.name}</h2>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:border-white/25 transition-all flex-shrink-0 mt-1 ml-4"
            >
              ✕
            </button>
          </div>

          <p className="text-white/42 leading-relaxed italic text-sm">"{ritual.description}"</p>

          <div className="grid grid-cols-3 gap-3">
            {[['Duration', ritual.duration], ['Heat', ritual.heatLevel], ['Pressure', ritual.pressure]].map(([l, v]) => (
              <div key={l} className="border border-white/5 rounded-2xl p-3.5">
                <p className="text-[7px] uppercase tracking-[0.3em] text-white/22 mb-1.5">{l}</p>
                <p className="text-gold text-[10px] font-mono leading-tight">{v}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-[8px] uppercase tracking-[0.3em] text-white/25 mb-3">Aroma Profile</p>
            <div className="flex flex-wrap gap-2">
              {ritual.aromaNotes.map((note) => (
                <span key={note} className="px-4 py-1.5 border border-gold/20 text-gold text-[8px] uppercase tracking-[0.22em] rounded-full">
                  {note}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[8px] uppercase tracking-[0.3em] text-white/25 mb-4">Ritual Timeline</p>
            <div className="space-y-2">
              {ritual.timeline.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex gap-3 items-start"
                >
                  <div className="w-1 h-1 rounded-full bg-gold/38 mt-1.5 flex-shrink-0" />
                  <p className="text-white/42 text-xs font-mono">{step}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[8px] uppercase tracking-[0.3em] text-white/25 mb-4">Recovery Intelligence</p>
            <div className="space-y-3">
              <RecoveryMeter label="Stress Recovery"    value={ritual.recovery.stress}    />
              <RecoveryMeter label="Sleep Quality"      value={ritual.recovery.sleep}     />
              <RecoveryMeter label="Energy Restoration" value={ritual.recovery.energy}    />
              <RecoveryMeter label="Emotional Reset"    value={ritual.recovery.emotional} />
            </div>
          </div>

          <div>
            <p className="text-[8px] uppercase tracking-[0.3em] text-white/25 mb-3">Enhancements</p>
            <div className="flex flex-wrap gap-2">
              {ritual.addOns.map((addon) => (
                <span
                  key={addon}
                  className="px-3.5 py-1.5 border border-white/8 text-white/38 text-[8px] uppercase tracking-[0.18em] rounded-full hover:border-gold/22 hover:text-gold transition-all duration-300 cursor-pointer"
                >
                  + {addon}
                </span>
              ))}
            </div>
          </div>

          <div className="border border-white/5 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-8 h-8 rounded-full border border-gold/18 flex items-center justify-center text-gold text-xs flex-shrink-0">♪</div>
            <div>
              <p className="text-[7px] uppercase tracking-[0.3em] text-white/22 mb-1">Soundscape</p>
              <p className="text-white/55 text-xs">{ritual.soundscape}</p>
            </div>
          </div>

          <div className="border-t border-white/5 pt-6">
            <div className="mb-5">
              <p className="text-[8px] uppercase tracking-[0.22em] text-white/18 mb-1">Investment</p>
              <p className="font-display text-4xl text-gold">KES {ritual.price.toLocaleString()}</p>
              <p className="text-[7px] uppercase tracking-[0.18em] text-white/18">{ritual.duration} · Per Session</p>
            </div>
            <div className="flex gap-3">
              <MagneticButton className="flex-1 btn-gold !py-4 !text-[10px]" onClick={addToCart}>
                ADD TO WELLNESS CART
              </MagneticButton>
              <Link
                href="/contact"
                className="px-7 py-4 border border-white/10 hover:border-gold/28 text-[9px] uppercase tracking-[0.22em] transition-all duration-500 rounded-full text-center whitespace-nowrap"
              >
                BOOK NOW
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function TherapistSection() {
  const [active, setActive] = useState(therapists[0])

  return (
    <section className="py-28 px-6 md:px-10 bg-[#080808] border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-18">
          <p className="text-gold uppercase tracking-[0.35em] text-[10px] mb-5">Healing Practitioners</p>
          <h2 className="font-display text-5xl md:text-6xl leading-none mb-6">
            THERAPIST
            <span className="italic text-gold"> ENERGY PROFILES</span>
          </h2>
          <p className="text-white/38 text-lg leading-relaxed">
            Every practitioner at Arohamai is matched to you by energy frequency,
            healing philosophy and therapeutic specialty — not just availability.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-9 items-start">
          <div className="space-y-4">
            {therapists.map((t) => (
              <motion.div
                key={t.id}
                onClick={() => setActive(t)}
                whileHover={{ x: 5 }}
                className={`cursor-pointer border rounded-[2rem] p-7 transition-all duration-500 ${
                  active.id === t.id
                    ? 'border-gold/28 bg-gold/5'
                    : 'border-white/5 bg-[#0a0a0a] hover:border-white/10'
                }`}
              >
                <div className="flex gap-5 items-start">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border border-white/10">
                    <Image src={t.image} alt={t.name} fill className="object-cover" />
                    <div className="absolute inset-0 rounded-full" style={{ boxShadow: `0 0 16px ${t.aura}` }} />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl leading-none mb-1">{t.name}</h3>
                    <p className="text-[8px] uppercase tracking-[0.3em] text-gold mb-2">{t.energy} · {t.experience}</p>
                    <p className="text-white/38 text-sm leading-relaxed">{t.quote}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -14 }}
              transition={{ duration: 0.45 }}
              className="border border-white/5 rounded-[2.5rem] overflow-hidden bg-[#0a0a0a]"
            >
              <div className="relative h-[320px]">
                <Image src={active.image} alt={active.name} fill className="object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                <div
                  className="absolute inset-0"
                  style={{ background: `radial-gradient(circle at center, ${active.aura}, transparent 70%)` }}
                />
              </div>
              <div className="p-9">
                <p className="text-[8px] uppercase tracking-[0.3em] text-gold mb-2">{active.frequency}</p>
                <h3 className="font-display text-3xl mb-4 leading-none">{active.name}</h3>
                <p className="text-white/48 leading-relaxed mb-7 italic text-sm">"{active.philosophy}"</p>
                <div className="mb-7">
                  <p className="text-[8px] uppercase tracking-[0.3em] text-white/22 mb-3">Specialties</p>
                  <div className="flex flex-wrap gap-2">
                    {active.specialties.map((s) => (
                      <span key={s} className="px-4 py-1.5 border border-gold/20 text-gold text-[8px] uppercase tracking-[0.22em] rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <Link href="/contact" className="btn-gold w-full text-center block !py-4">
                  REQUEST {active.name.split(' ')[0].toUpperCase()}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

function WellnessJourneyBuilder({ onSelectRitual }: { onSelectRitual: (id: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null)
  const recommended = selected ? rituals.find((r) => r.id === wellnessRecommendations[selected]) : null

  return (
    <section className="py-28 px-6 md:px-10 bg-[#050505]">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-14">
          <p className="text-gold uppercase tracking-[0.35em] text-[10px] mb-5">Wellness Intelligence</p>
          <h2 className="font-display text-5xl md:text-6xl leading-none mb-6">
            BUILD YOUR
            <span className="italic text-gold"> HEALING JOURNEY</span>
          </h2>
          <p className="text-white/38 text-lg leading-relaxed">
            Tell us your intention. Moxie will curate the right Arohamai ritual, therapist,
            aroma profile and soundscape for exactly where you are right now.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {wellnessGoals.map((goal) => (
            <motion.button
              key={goal}
              onClick={() => setSelected(goal === selected ? null : goal)}
              whileHover={{ y: -3 }}
              className={`border rounded-[1.5rem] p-5 text-left transition-all duration-500 ${
                selected === goal
                  ? 'border-gold/38 bg-gold/6 text-gold'
                  : 'border-white/5 bg-[#0a0a0a] text-white/48 hover:border-white/10'
              }`}
            >
              <p className="text-[7px] uppercase tracking-[0.3em] text-gold/48 mb-2">Intention</p>
              <p className="font-display text-xl leading-none">{goal}</p>
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {recommended && (
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="border border-gold/18 bg-gold/4 rounded-[2.5rem] p-9 md:p-12"
            >
              <p className="text-[9px] uppercase tracking-[0.35em] text-gold mb-5">
                Moxie Wellness Intelligence — Recommended Ritual
              </p>
              <div className="grid md:grid-cols-2 gap-9 items-center">
                <div>
                  <h3 className="font-display text-4xl md:text-5xl mb-4 leading-none">{recommended.name}</h3>
                  <p className="text-white/48 leading-relaxed mb-6 italic text-sm">"{recommended.description}"</p>
                  <div className="grid grid-cols-2 gap-4 mb-7">
                    <div>
                      <p className="text-[7px] uppercase tracking-[0.3em] text-white/22 mb-1.5">Duration</p>
                      <p className="text-gold text-sm">{recommended.duration}</p>
                    </div>
                    <div>
                      <p className="text-[7px] uppercase tracking-[0.3em] text-white/22 mb-1.5">Investment</p>
                      <p className="text-gold text-sm">KES {recommended.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onSelectRitual(recommended.id)}
                    className="btn-gold !px-9 !py-3.5"
                  >
                    VIEW FULL RITUAL →
                  </button>
                </div>
                <div className="space-y-4">
                  <RecoveryMeter label="Stress Recovery"    value={recommended.recovery.stress}    />
                  <RecoveryMeter label="Sleep Quality"      value={recommended.recovery.sleep}     />
                  <RecoveryMeter label="Energy Restoration" value={recommended.recovery.energy}    />
                  <RecoveryMeter label="Emotional Reset"    value={recommended.recovery.emotional} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  const [active, setActive] = useState(0)

  return (
    <section className="py-28 px-6 md:px-10 bg-[#080808] border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-18">
          <p className="text-gold uppercase tracking-[0.35em] text-[10px] mb-5">Transformation Stories</p>
          <h2 className="font-display text-5xl md:text-6xl leading-none">
            WHAT HAPPENS
            <span className="italic text-gold"> INSIDE</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-10">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.09, duration: 0.8 }}
              viewport={{ once: true }}
              onClick={() => setActive(i)}
              className={`cursor-pointer border rounded-[2rem] p-7 transition-all duration-700 ${
                active === i ? 'border-gold/22 bg-gold/4' : 'border-white/5 bg-[#0a0a0a] hover:border-white/10'
              }`}
            >
              <p className="text-[8px] uppercase tracking-[0.28em] text-gold mb-4">{t.ritual} · {t.duration}</p>
              <p className="text-white/58 leading-relaxed text-sm italic mb-6">"{t.quote}"</p>
              <div className="border-t border-white/5 pt-4">
                <p className="font-display text-xl">{t.name}</p>
                <p className="text-[8px] uppercase tracking-[0.22em] text-white/22">{t.title}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-white/10 text-sm italic">"The healing begins the moment you decide to slow down."</p>
        </div>
      </div>
    </section>
  )
}

function MembershipSection() {
  return (
    <section className="py-28 px-6 border-y border-white/5 bg-[#080808]">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <p className="text-gold uppercase tracking-[0.35em] text-[10px] mb-5">Wellness Membership</p>
          <h2 className="font-display text-5xl leading-none mb-6">
            RESTORATION
            <span className="italic text-gold"> MEMBERSHIPS</span>
          </h2>
          <p className="text-white/38 text-lg leading-relaxed mb-10">
            Designed for creators, executives, travellers, athletes,
            and high-performance individuals needing consistent nervous system restoration.
          </p>
          <div className="space-y-4">
            {[
              'Monthly wellness journeys',
              'Priority therapist scheduling',
              'Exclusive sunrise rituals',
              'Private recovery lounge access',
              'AI wellness recommendations',
              'Personalised ritual memory',
            ].map((item) => (
              <div key={item} className="flex items-center gap-4 text-white/48">
                <div className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="border border-gold/10 rounded-[3rem] bg-gradient-to-br from-gold/5 to-transparent p-10">
          <p className="text-[9px] uppercase tracking-[0.35em] text-white/20 mb-5">Executive Reset Plan</p>
          <h3 className="font-display text-4xl mb-5 leading-none">The Recovery Circle</h3>
          <p className="text-white/38 leading-relaxed mb-10">
            Unlimited access to curated wellness rituals, bath and heat therapies,
            massage sessions, tea ceremonies and private sanctuary access.
          </p>
          <MagneticButton className="btn-gold w-full !py-5">
            JOIN THE SANCTUARY
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// AMBIENT WELLNESS LAYER — v4 fixed, preserved exactly
// ─────────────────────────────────────────────────────────────

function createAmbientTone(ctx: AudioContext): void {
  const master = ctx.createGain()
  master.gain.setValueAtTime(0, ctx.currentTime)
  master.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 2.5)
  master.connect(ctx.destination)

  const freqs  = [108, 144, 216]
  const levels = [0.60, 0.25, 0.15]

  freqs.forEach((freq, i) => {
    const osc  = ctx.createOscillator()
    const gain = ctx.createGain()
    const lpf  = ctx.createBiquadFilter()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, ctx.currentTime)

    const lfo     = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    lfo.type = 'sine'
    lfo.frequency.setValueAtTime(0.06 + i * 0.025, ctx.currentTime)
    lfoGain.gain.setValueAtTime(0.4 + i * 0.1, ctx.currentTime)
    lfo.connect(lfoGain)
    lfoGain.connect(osc.frequency)
    lfo.start()

    lpf.type = 'lowpass'
    lpf.frequency.setValueAtTime(800 - i * 120, ctx.currentTime)
    lpf.Q.setValueAtTime(0.8, ctx.currentTime)

    gain.gain.setValueAtTime(levels[i], ctx.currentTime)

    osc.connect(lpf)
    lpf.connect(gain)
    gain.connect(master)
    osc.start()
  })

  const bufferSize  = ctx.sampleRate * 4
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data        = noiseBuffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.008
  }
  const noise       = ctx.createBufferSource()
  noise.buffer      = noiseBuffer
  noise.loop        = true
  const noiseFilter = ctx.createBiquadFilter()
  noiseFilter.type  = 'bandpass'
  noiseFilter.frequency.setValueAtTime(180, ctx.currentTime)
  noiseFilter.Q.setValueAtTime(0.4, ctx.currentTime)
  noise.connect(noiseFilter)
  noiseFilter.connect(master)
  noise.start()
}

function AmbientWellnessLayer() {
  const [enabled, setEnabled]   = useState(false)
  const [status, setStatus]     = useState<'idle' | 'loading' | 'playing' | 'error'>('idle')
  const audioRef                = useRef<HTMLAudioElement | null>(null)
  const audioCtxRef             = useRef<AudioContext | null>(null)
  const usingFallbackRef        = useRef(false)

  useEffect(() => {
    const audio        = new Audio()
    audio.loop         = true
    audio.volume       = 0.38
    audio.preload      = 'none'
    audio.addEventListener('playing', () => setStatus('playing'))
    audio.addEventListener('error', () => { usingFallbackRef.current = true })
    audioRef.current = audio
    return () => { audio.pause(); audio.src = '' }
  }, [])

  useEffect(() => {
    return () => { audioCtxRef.current?.close().catch(() => {}); audioCtxRef.current = null }
  }, [])

  function stopAudio() {
    if (usingFallbackRef.current && audioCtxRef.current) {
      setTimeout(() => { audioCtxRef.current?.close().catch(() => {}); audioCtxRef.current = null }, 600)
    } else {
      audioRef.current?.pause()
    }
    setEnabled(false)
    setStatus('idle')
  }

  function startFallback() {
    try {
      const ctx = new AudioContext()
      audioCtxRef.current = ctx
      createAmbientTone(ctx)
      setEnabled(true)
      setStatus('playing')
    } catch {
      setEnabled(false)
      setStatus('error')
    }
  }

  function toggle() {
    if (enabled) { stopAudio(); return }
    setStatus('loading')
    if (usingFallbackRef.current) { startFallback(); return }
    if (audioRef.current) {
      audioRef.current.src = '/audio/forest-ambience.mp3'
      const promise = audioRef.current.play()
      if (promise !== undefined) {
        promise.then(() => { setEnabled(true) }).catch(() => { usingFallbackRef.current = true; audioRef.current?.pause(); startFallback() })
      } else {
        setEnabled(true)
        setStatus('playing')
      }
    } else {
      startFallback()
    }
  }

  const labels: Record<typeof status, string> = {
    idle:    '○ Sanctuary Audio',
    loading: '◌ Loading…',
    playing: '◉ Ambient On',
    error:   '○ Audio Unavailable',
  }

  return (
    <motion.button
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 3.5 }}
      onClick={toggle}
      disabled={status === 'loading' || status === 'error'}
      aria-label={enabled ? 'Turn off ambient sound' : 'Turn on ambient sound'}
      className={[
        'fixed left-6 bottom-8 z-50',
        'px-5 py-3',
        'border border-gold/20 bg-black/55 backdrop-blur-2xl rounded-full',
        'text-[9px] uppercase tracking-[0.28em] text-gold',
        'hover:bg-gold/8 transition-all duration-500',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        enabled ? 'shadow-[0_0_0_1px_rgba(212,175,55,0.15),0_0_16px_rgba(212,175,55,0.08)]' : '',
      ].join(' ')}
    >
      <motion.span
        key={status}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2 }}
        className="block"
      >
        {labels[status]}
      </motion.span>
      {enabled && (
        <motion.span
          className="absolute inset-0 rounded-full border border-gold/20 pointer-events-none"
          animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </motion.button>
  )
}

function WellnessAssistant() {
  const [visible, setVisible] = useState(true)
  if (!visible) return null
  return (
    <div className="fixed bottom-8 right-8 z-40 hidden lg:block">
      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 5, duration: 0.8 }}
        className="w-[310px] rounded-[2rem] border border-gold/14 bg-black/75 backdrop-blur-3xl p-6 shadow-[0_0_36px_rgba(212,175,55,0.06)]"
      >
        <div className="flex justify-between items-start mb-3">
          <p className="text-gold uppercase tracking-[0.28em] text-[8px]">Moxie Wellness AI</p>
          <button onClick={() => setVisible(false)} className="text-white/18 hover:text-white/50 text-xs transition-colors leading-none">✕</button>
        </div>
        <h4 className="font-display text-xl mb-2.5 leading-none">Intelligence Activated</h4>
        <p className="text-white/32 text-xs leading-relaxed mb-4">
          Based on your wellbeing signals, Moxie recommends the Ubuntu Signature Therapy
          with grounding earth frequencies and Maasai warm oil ritual.
        </p>
        <a href="#services" className="btn-gold w-full !py-3 !text-[8px] text-center block">
          VIEW RECOMMENDED RITUAL
        </a>
      </motion.div>
    </div>
  )
}

function FinalCTA() {
  return (
    <section className="relative py-40 px-6 overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.055),transparent_65%)]" />
      <FloatingParticles count={12} />
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <p className="text-gold uppercase tracking-[0.35em] text-[10px] mb-5">Restoration Awaits</p>
        <h2 className="font-display text-5xl md:text-8xl leading-[0.88] mb-10">
          YOUR BODY HAS BEEN
          <span className="italic text-gold"> ASKING FOR THIS</span>
        </h2>
        <p className="max-w-xl mx-auto text-base text-white/32 leading-relaxed mb-12 italic">
          "Healing is not a luxury. It is your right."
        </p>
        <MagneticButton className="btn-gold !px-14 !py-6 !text-[10px]">
          <Link href="/contact">BEGIN YOUR RESTORATION</Link>
        </MagneticButton>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN PAGE — preserved exactly from v4
// ─────────────────────────────────────────────────────────────

export default function SpaPage() {
  const [selectedRitual, setSelectedRitual] = useState<Ritual | null>(null)

  const openRitualById = useCallback((id: string) => {
    const ritual = rituals.find((r) => r.id === id)
    if (ritual) setSelectedRitual(ritual)
  }, [])

  const scrollToServices = useCallback(() => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <main className="bg-[#050505] text-white min-h-screen overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Nav />

      {/* ── PHASE 1: ARRIVAL ── */}
      <CinematicHero onExplore={scrollToServices} />
      <SpaStatsBar />

      {/* ── PHASE 2: DISCOVERY ── */}
      <SpaServicesGrid onOpenRitual={openRitualById} />
      <ThermalSanctuariesSection onOpenRitual={openRitualById} />
      <FarmToRitualSection />

      {/* ── PHASE 3: ALL RITUALS ── */}
      <section id="rituals" className="py-28 px-6 md:px-10 bg-[#050505] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-18">
            <p className="text-gold uppercase tracking-[0.35em] text-[10px] mb-5">Full Treatment Collection</p>
            <h2 className="font-display text-5xl md:text-6xl leading-none mb-5">
              EVERY
              <span className="italic text-gold"> RITUAL</span>
            </h2>
            <p className="text-white/35 leading-relaxed text-lg max-w-2xl">
              From a KES 2,000 steam session to a KES 30,000 full-day escape —
              every body, every budget, every intention is welcome at Arohamai.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-7">
            {rituals.map((ritual) => (
              <RitualCard key={ritual.id} ritual={ritual} onOpen={setSelectedRitual} />
            ))}
          </div>
        </div>
      </section>

      {/* ── WELLNESS JOURNEY BUILDER ── */}
      <WellnessJourneyBuilder onSelectRitual={openRitualById} />

      {/* ── PHASE 4: DEEP TRUST ── */}
      <TherapistSection />
      <TestimonialsSection />

      {/* ── PHASE 5: COMMITMENT ── */}
      <MembershipSection />
      <FinalCTA />

      {/* ── MODALS ── */}
      <AnimatePresence>
        {selectedRitual && (
          <RitualModal ritual={selectedRitual} onClose={() => setSelectedRitual(null)} />
        )}
      </AnimatePresence>

      {/* ── IMMERSIVE SYSTEMS ── */}
      <AmbientWellnessLayer />
      <WellnessAssistant />

      <Footer />
      <MoxieChat />
    </main>
  )
}