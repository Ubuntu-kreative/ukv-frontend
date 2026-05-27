/**
 * _data/spa-data.ts
 *
 * ALL static data for the Arohamai Spa page.
 * Pure TypeScript — no JSX, no hooks, no imports from React.
 *
 * WHY THIS FILE EXISTS:
 * The original InteractiveSpaShell.tsx had all data inline inside a 'use client'
 * component. This means every ritual array, every image URL, every therapist
 * object was parsed as client JavaScript on every page load — even though none
 * of it is dynamic. Extracting it here means:
 *  - Server components can import it with zero JS cost
 *  - Client components get stable object references (no inline literals)
 *  - Tree-shaking removes unused exports
 *  - This file hot-reloads independently, not as part of the 1400-line shell
 */

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface Ritual {
  id:          string
  name:        string
  duration:    string
  price:       number
  categoryTag: string
  status:      string
  aromaNotes:  string[]
  soundscape:  string
  mood:        string
  heatLevel:   string
  pressure:    string
  image:       string
  description: string
  timeline:    string[]
  addOns:      string[]
  recovery:    { stress: number; sleep: number; energy: number; emotional: number }
}

export interface Therapist {
  id:          string
  name:        string
  energy:      string
  frequency:   string
  experience:  string
  philosophy:  string
  quote:       string
  specialties: string[]
  aura:        string
  image:       string
}

export interface SpaService {
  title:       string
  subtitle:    string
  tag:         string
  ritualId:    string
  accent:      string
  image:       string
  description: string
  cta:         string
}

export interface ThermalItem {
  name:      string
  spec:      string
  ritualId:  string
  description: string
  image:     string
  glow:      string
}

export interface FarmIngredient {
  name:    string
  origin:  string
  benefit: string
  note:    string
  icon:    string
}

// ─── RITUAL ACCENTS ──────────────────────────────────────────────────────────

export const RITUAL_ACCENTS: Record<string, { glow: string; label: string }> = {
  'ubuntu-signature-therapy':   { glow: 'rgba(180,120,40,0.20)',  label: 'African Healing'  },
  'moroccan-bath':              { glow: 'rgba(160,80,160,0.16)',  label: 'Moroccan Ritual'  },
  'sauna-session':              { glow: 'rgba(220,100,40,0.18)',  label: 'Thermal Heat'     },
  'mud-bath':                   { glow: 'rgba(120,80,40,0.20)',   label: 'Earth & Clay'     },
  'aromatherapy-massage':       { glow: 'rgba(200,160,80,0.16)',  label: 'Aroma & Touch'    },
  'deep-tissue-massage':        { glow: 'rgba(60,100,160,0.16)',  label: 'Deep Recovery'    },
  'arohamai-signature-healing': { glow: 'rgba(212,175,55,0.18)',  label: 'Full Sanctuary'   },
  'body-exfoliation':           { glow: 'rgba(160,120,60,0.16)',  label: 'Body Renewal'     },
  'hydrating-facial':           { glow: 'rgba(200,180,80,0.14)',  label: 'Skin & Hair Glow' },
  'half-day-retreat':           { glow: 'rgba(180,140,200,0.16)', label: 'Day Retreat'      },
  'detox-purify-package':       { glow: 'rgba(100,160,100,0.16)', label: 'Detox & Purify'   },
  'stress-relief-package':      { glow: 'rgba(180,140,200,0.16)', label: 'Stress Relief'    },
  'full-day-escape':            { glow: 'rgba(212,175,55,0.20)',  label: 'Full Escape'      },
}

export const DEFAULT_ACCENT = RITUAL_ACCENTS['ubuntu-signature-therapy']

// ─── RITUALS ─────────────────────────────────────────────────────────────────

export const RITUALS: Ritual[] = [
  {
    id: 'mud-bath', name: 'Mud Bath', duration: '45 MIN', price: 3500,
    categoryTag: 'Bath & Heat', status: 'most requested',
    aromaNotes: ['Volcanic Clay', 'Mineral Earth', 'Cedar'], soundscape: 'Earth Frequencies',
    mood: 'Deep pore purification and mineral rebalancing', heatLevel: 'Warm Earth Therapy', pressure: 'None',
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=1200&auto=format&fit=crop',
    description: 'Mineral-rich volcanic clay bath that purifies deep pores, relieves muscle ache, and renews the skin from the outside in.',
    timeline: ['00 MIN — Herbal Welcome', '10 MIN — Mud Bath Immersion', '35 MIN — Warm Rinse & Recovery', '45 MIN — Cooling Towel Finish'],
    addOns: ['Body Exfoliation', 'Herbal Soak', 'Steam Session'],
    recovery: { stress: 82, sleep: 76, energy: 80, emotional: 78 },
  },
  {
    id: 'salt-bath', name: 'Salt Bath', duration: '40 MIN', price: 2500,
    categoryTag: 'Bath & Heat', status: 'daily sessions',
    aromaNotes: ['Sea Salt', 'Eucalyptus', 'Lavender'], soundscape: 'Ocean & Water Frequencies',
    mood: 'Skin detox and mineral restoration', heatLevel: 'Warm Mineral Soak', pressure: 'None',
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=1200&auto=format&fit=crop',
    description: 'Therapeutic salt soak infused with natural minerals and botanicals. Cleanses, softens and restores the skin while relaxing the body.',
    timeline: ['00 MIN — Mineral Bath Preparation', '10 MIN — Salt Immersion', '30 MIN — Active Soak', '40 MIN — Cool Down & Rest'],
    addOns: ['Hydrating Facial', 'Reflexology', 'Aromatherapy Massage'],
    recovery: { stress: 78, sleep: 74, energy: 76, emotional: 75 },
  },
  {
    id: 'smoked-bath', name: 'Smoked Bath', duration: '45 MIN', price: 3000,
    categoryTag: 'Bath & Heat', status: 'village tradition',
    aromaNotes: ['Smoke', 'Herbs', 'Sandalwood'], soundscape: 'Forest Smoke Frequencies',
    mood: 'Ancient African purification ritual', heatLevel: 'Smoky Warm Heat', pressure: 'None',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop',
    description: 'An ancient African bathing tradition using aromatic smoke and herbal infusions. Deeply purifying and grounding for body and spirit.',
    timeline: ['00 MIN — Herbal Fire Preparation', '10 MIN — Smoke Bath Entry', '30 MIN — Smoke & Steam Immersion', '45 MIN — Cooling & Integration'],
    addOns: ['Body Mask', 'Herbal Soak', 'Sauna Session'],
    recovery: { stress: 85, sleep: 80, energy: 82, emotional: 88 },
  },
  {
    id: 'ice-bath', name: 'Ice Bath', duration: '30 MIN', price: 2500,
    categoryTag: 'Bath & Heat', status: 'recovery essential',
    aromaNotes: ['Mint', 'Pine', 'Cool Water'], soundscape: 'Cold Spring Frequencies',
    mood: 'Cardiovascular reset and inflammation reduction', heatLevel: 'Cold Immersion 8–12°C', pressure: 'None',
    image: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=1200&auto=format&fit=crop',
    description: 'Cold water immersion therapy for muscle recovery, reduced inflammation, and cellular revitalisation. Optimal for active lifestyles.',
    timeline: ['00 MIN — Pre-Cool Breathing Protocol', '05 MIN — Gradual Cold Entry', '20 MIN — Cold Immersion', '30 MIN — Warm Recovery'],
    addOns: ['Deep Tissue Massage', 'Bamboo Stick Therapy', 'Sauna Session'],
    recovery: { stress: 80, sleep: 88, energy: 96, emotional: 78 },
  },
  {
    id: 'moroccan-bath', name: 'Moroccan Bath', duration: '75 MIN', price: 4500,
    categoryTag: 'Bath & Heat', status: 'ancient ritual',
    aromaNotes: ['Argan', 'Black Soap', 'Rose Water'], soundscape: 'Desert Wind Frequencies',
    mood: 'Full body renewal and deep cleansing', heatLevel: 'Steam & Warm Marble', pressure: 'Medium',
    image: '/images/Moroccan-Bath.jpeg',
    description: 'Traditional Moroccan hammam with black soap exfoliation, kessa mitt scrub, argan oil ritual, and rose water finish on heated marble.',
    timeline: ['00 MIN — Hammam Steam Opening', '15 MIN — Black Soap Application', '30 MIN — Kessa Mitt Exfoliation', '50 MIN — Argan Oil Ritual', '65 MIN — Rose Water Rinse & Recovery', '75 MIN — Mint Tea Integration'],
    addOns: ['Body Mask', 'Ghassoul Clay Mask', 'Sound Healing'],
    recovery: { stress: 92, sleep: 84, energy: 88, emotional: 90 },
  },
  {
    id: 'sauna-session', name: 'Sauna Session', duration: '60 MIN', price: 2000,
    categoryTag: 'Bath & Heat', status: 'daily sessions',
    aromaNotes: ['Eucalyptus', 'Pine', 'Birch'], soundscape: 'Forest Frequencies',
    mood: 'Cardiovascular reset and cellular detox', heatLevel: 'High Dry Heat 80–100°C', pressure: 'None',
    image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=1200&auto=format&fit=crop',
    description: 'Traditional Finnish dry sauna with birch steam rituals, cold recovery periods and deep cellular detox. Available daily.',
    timeline: ['00 MIN — Birch Steam Opening', '15 MIN — First Sauna Round', '30 MIN — Cold Recovery', '45 MIN — Second Sauna Round', '60 MIN — Herbal Cool Down'],
    addOns: ['Ice Bath', 'Body Exfoliation', 'Steam Session'],
    recovery: { stress: 88, sleep: 90, energy: 94, emotional: 80 },
  },
  {
    id: 'herbal-soak', name: 'Herbal Soak', duration: '50 MIN', price: 3000,
    categoryTag: 'Bath & Heat', status: 'restorative',
    aromaNotes: ['Lemongrass', 'Wild Herbs', 'Lavender'], soundscape: 'Garden & Nature Frequencies',
    mood: 'Botanical healing and deep relaxation', heatLevel: 'Warm Herbal Soak', pressure: 'None',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1200&auto=format&fit=crop',
    description: 'A deeply restorative soak in herb-infused warm water. Locally sourced botanicals ease tension, nourish the skin and calm the mind.',
    timeline: ['00 MIN — Herbal Blend Preparation', '10 MIN — Soak Entry', '40 MIN — Botanical Immersion', '50 MIN — Towel Wrap & Rest'],
    addOns: ['Reflexology', 'Body Mask', 'Hydrating Facial'],
    recovery: { stress: 88, sleep: 86, energy: 80, emotional: 90 },
  },
  {
    id: 'ubuntu-signature-therapy', name: 'Ubuntu Signature Therapy', duration: '90 MIN', price: 7500,
    categoryTag: 'Signature Therapy', status: 'most requested',
    aromaNotes: ['Maasai Oil', 'Wild Sage', 'Baobab'], soundscape: 'Earth Frequencies',
    mood: 'Nervous system grounding and full body reset', heatLevel: 'Warm Oil Therapy', pressure: 'Medium',
    image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=1200&auto=format&fit=crop',
    description: 'Our signature Ubuntu healing ritual. Warm Maasai oil, nervous system reset techniques, grounding pressure and deep tissue work — a ceremony for the whole body.',
    timeline: ['00 MIN — Ubuntu Welcome Ritual', '15 MIN — Warm Oil Application', '45 MIN — Full Body Healing', '75 MIN — Nervous System Integration', '90 MIN — Grounding Close'],
    addOns: ['Herbal Soak', 'Sound Healing', 'Body Mask'],
    recovery: { stress: 96, sleep: 92, energy: 88, emotional: 96 },
  },
  {
    id: 'aromatherapy-massage', name: 'Aromatherapy Massage', duration: '60 MIN', price: 4500,
    categoryTag: 'Massage Therapy', status: 'restorative',
    aromaNotes: ['Lavender', 'Frankincense', 'Ylang Ylang'], soundscape: 'Botanical Frequencies',
    mood: 'Emotional balance and nervous system restoration', heatLevel: 'Warm Oil', pressure: 'Light to Medium',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1200&auto=format&fit=crop',
    description: 'Gentle full body massage with therapeutic essential oils blended for your emotional and physical needs. Deeply calming and restorative.',
    timeline: ['00 MIN — Aroma Consultation', '10 MIN — Oil Blend Preparation', '15 MIN — Full Body Massage', '55 MIN — Integration Rest', '60 MIN — Herbal Close'],
    addOns: ['Herbal Soak', 'Body Mask', 'Hydrating Facial'],
    recovery: { stress: 90, sleep: 88, energy: 80, emotional: 94 },
  },
  {
    id: 'deep-tissue-massage', name: 'Deep Tissue Massage', duration: '60 MIN', price: 5000,
    categoryTag: 'Massage Therapy', status: 'therapeutic',
    aromaNotes: ['Camphor', 'Eucalyptus', 'Peppermint'], soundscape: 'Deep Recovery Frequencies',
    mood: 'Musculoskeletal release and deep recovery', heatLevel: 'Warm Towel + Pressure', pressure: 'Deep',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1200&auto=format&fit=crop',
    description: 'Therapeutic deep pressure massage targeting chronic tension, muscle knots and postural imbalances. Built for bodies that carry the weight of daily life.',
    timeline: ['00 MIN — Postural Assessment', '10 MIN — Warm Up', '20 MIN — Deep Tissue Work', '55 MIN — Stretch & Integration', '60 MIN — Recovery'],
    addOns: ['Ice Bath', 'Bamboo Stick Therapy', 'Body Mask'],
    recovery: { stress: 86, sleep: 90, energy: 92, emotional: 82 },
  },
  {
    id: 'arohamai-signature-healing', name: 'Arohamai Signature Healing Package', duration: '4–5 HRS', price: 22000,
    categoryTag: 'Signature Package', status: 'full sanctuary',
    aromaNotes: ['Frankincense', 'Neroli', 'Baobab', 'Wild Rose'], soundscape: 'Sanctuary Frequencies',
    mood: 'Complete mind-body-spirit healing', heatLevel: 'All Thermal Experiences', pressure: 'Personalised',
    image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=1200&auto=format&fit=crop',
    description: 'Our most complete healing experience. Moroccan bath, Ubuntu Signature Therapy, skin renewal facial, herbal soak, and grounding sound healing.',
    timeline: ['00 MIN — Arrival & Intention Setting', '30 MIN — Moroccan Bath', '105 MIN — Ubuntu Signature Therapy', '195 MIN — Skin Renewal Facial', '255 MIN — Herbal Soak', '285 MIN — Sound Healing & Integration'],
    addOns: ['Private Suite', 'Couples Upgrade', 'Sunset Extension'],
    recovery: { stress: 98, sleep: 96, energy: 94, emotional: 98 },
  },
  {
    id: 'body-exfoliation', name: 'Body Care Treatments', duration: '75 MIN', price: 3000,
    categoryTag: 'Skin Renewal', status: 'natural polish',
    aromaNotes: ['Botanical Mask', 'Shea Butter', 'Salt Exfoliant'], soundscape: 'Silken Renewal Frequencies',
    mood: 'Full body mask and exfoliation treatments using natural botanicals. Polish, nourish and protect your skin with African earth ingredients.',
    heatLevel: 'Warm Skin Therapy', pressure: 'Light',
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?q=80&w=1200&auto=format&fit=crop',
    description: 'Full body mask and exfoliation treatments using natural botanicals. Polish, nourish and protect your skin with African earth ingredients.',
    timeline: ['00 MIN — Botanical Consultation', '15 MIN — Body Mask Application', '35 MIN — Exfoliation Ritual', '55 MIN — Hydrating Finish', '75 MIN — Soft Oil Nourish'],
    addOns: ['Hydrating Facial', 'Herbal Soak', 'Scalp Massage'],
    recovery: { stress: 82, sleep: 78, energy: 84, emotional: 86 },
  },
  {
    id: 'hydrating-facial', name: 'Facial & Hair Wellness', duration: '90 MIN', price: 3500,
    categoryTag: 'Natural Beauty', status: 'radiance ritual',
    aromaNotes: ['Aloe', 'Rosewater', 'Herbal Elixir'], soundscape: 'Gentle Renewal Frequencies',
    mood: 'Hydrating facial, skin renewal facial, herbal facial and hair masking treatment. Healthy beauty through natural, farm-sourced care.',
    heatLevel: 'Warm Renewal', pressure: 'Light',
    image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=1200&auto=format&fit=crop',
    description: 'Hydrating facial, skin renewal facial, herbal facial and hair masking treatment. Healthy beauty through natural, farm-sourced care.',
    timeline: ['00 MIN — Skin & Scalp Analysis', '20 MIN — Herbal Facial Ritual', '45 MIN — Hair Mask Treatment', '70 MIN — Cooling Serum & Massage', '90 MIN — Glow Reveal'],
    addOns: ['Scalp Massage', 'Eye Renewal', 'Nutrient Mist'],
    recovery: { stress: 74, sleep: 76, energy: 84, emotional: 88 },
  },
  {
    id: 'half-day-retreat', name: 'Half Day Retreat', duration: '4 HRS', price: 18000,
    categoryTag: 'Day Experience', status: 'restorative',
    aromaNotes: ['Herbal Tea', 'Warm Oil', 'Garden Citrus'], soundscape: 'Retreat Frequencies',
    mood: 'Herbal tea welcome, bath therapy, signature massage, facial and a healthy wellness meal. Four hours of complete restoration.',
    heatLevel: 'Mixed Ritual Journey', pressure: 'Light to Medium',
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=1200&auto=format&fit=crop',
    description: 'Herbal tea welcome, bath therapy, signature massage, facial and a healthy wellness meal. Four hours of complete restoration.',
    timeline: ['00 MIN — Herbal Tea Welcome', '30 MIN — Bath Therapy', '90 MIN — Signature Massage', '150 MIN — Facial Ritual', '210 MIN — Wellness Meal', '240 MIN — Rest & Departure'],
    addOns: ['Private Lounge', 'Hydrating Facial', 'Herbal Soak'],
    recovery: { stress: 94, sleep: 88, energy: 90, emotional: 92 },
  },
  {
    id: 'stress-relief-package', name: 'Stress Relief & Mental Wellness Package', duration: '3 HRS', price: 14000,
    categoryTag: 'Signature Package', status: 'therapeutic',
    aromaNotes: ['Lavender', 'Chamomile', 'Bergamot'], soundscape: 'Calm Mind Frequencies',
    mood: 'Nervous system reset and mental clarity', heatLevel: 'Sauna + Herbal Soak', pressure: 'Medium',
    image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=1200&auto=format&fit=crop',
    description: 'Sauna, herbal soak, aromatherapy massage and sound healing. Designed to reset the nervous system, quiet the mind and restore inner calm.',
    timeline: ['00 MIN — Wellness Consultation', '30 MIN — Sauna Ritual', '90 MIN — Herbal Soak', '140 MIN — Aromatherapy Massage', '200 MIN — Sound Healing'],
    addOns: ['Hydrating Facial', 'Body Mask', 'Reflexology'],
    recovery: { stress: 96, sleep: 94, energy: 86, emotional: 96 },
  },
  {
    id: 'full-day-escape', name: 'Full Day Arohamai Wellness Escape', duration: '8 HRS', price: 30000,
    categoryTag: 'Day Experience', status: 'full sanctuary',
    aromaNotes: ['Frankincense', 'Neroli', 'Wild Rose', 'African Violet'], soundscape: 'Full Sanctuary Frequencies',
    mood: 'Complete life restoration — body, mind and spirit', heatLevel: 'All Thermal Experiences', pressure: 'Fully Personalised',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop',
    description: 'Full access to spa facilities · Personalized therapy session · Body treatment · Facial or hair ritual · Lunch and refreshments · Relaxation lounge access.',
    timeline: ['00 MIN — Arrival & Consultation', '60 MIN — Bath Therapy', '120 MIN — Personalized Therapy', '210 MIN — Body Treatment', '270 MIN — Lunch & Refreshments', '330 MIN — Facial or Hair Ritual', '390 MIN — Thermal Pools', '480 MIN — Integration & Farewell'],
    addOns: ['Sunset Extension', 'Couples Upgrade', 'Private Lounge'],
    recovery: { stress: 99, sleep: 97, energy: 98, emotional: 99 },
  },
]

// ─── SPA SERVICES ────────────────────────────────────────────────────────────

export const SPA_SERVICES: SpaService[] = [
  { title: 'Bath & Heat Therapies', subtitle: 'From KES 2,000', tag: 'Detox & Restore', ritualId: 'moroccan-bath', accent: 'rgba(160,80,160,0.16)', image: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?q=80&w=1200&auto=format&fit=crop', description: 'Mud bath, salt bath, smoked bath, ice bath, Moroccan hammam, sauna, steam, herbal soak. Eight ways to cleanse, detoxify and restore.', cta: 'Explore Bath Therapies' },
  { title: 'Massage & Body Therapies', subtitle: 'From KES 3,500', tag: 'Therapeutic Healing', ritualId: 'ubuntu-signature-therapy', accent: 'rgba(180,120,40,0.18)', image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=1200&auto=format&fit=crop', description: 'Ubuntu Signature Therapy, aromatherapy, deep tissue, lymphatic drainage, Swedish, shiatsu, bamboo stick, wood therapy and reflexology.', cta: 'Explore Massages' },
  { title: 'Body Care Treatments', subtitle: 'From KES 3,000', tag: 'Skin Renewal', ritualId: 'body-exfoliation', accent: 'rgba(160,120,60,0.16)', image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?q=80&w=1200&auto=format&fit=crop', description: 'Full body mask and exfoliation treatments using natural botanicals. Polish, nourish and protect your skin with African earth ingredients.', cta: 'Explore Body Care' },
  { title: 'Facial & Hair Wellness', subtitle: 'From KES 3,500', tag: 'Natural Beauty', ritualId: 'hydrating-facial', accent: 'rgba(200,180,80,0.14)', image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=1200&auto=format&fit=crop', description: 'Hydrating facial, skin renewal facial, herbal facial and hair masking treatment. Healthy beauty through natural, farm-sourced care.', cta: 'Book a Facial' },
  { title: 'Signature Packages', subtitle: 'From KES 9,000', tag: 'Curated Journey', ritualId: 'arohamai-signature-healing', accent: 'rgba(212,175,55,0.18)', image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=1200&auto=format&fit=crop', description: 'Seven curated wellness journeys — detox, stress relief, full healing, muscle recovery, glow, prenatal care and lymphatic slimming.', cta: 'View All Packages' },
  { title: 'Couples Sanctuary', subtitle: 'From KES 10,000', tag: 'Couples', ritualId: 'stress-relief-package', accent: 'rgba(40,140,60,0.16)', image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=1200&auto=format&fit=crop', description: 'Side-by-side rituals for two. Customise your shared healing journey with matching therapies, herbal soaks and private sanctuary time.', cta: 'Book for Two' },
  { title: 'Half Day Retreat', subtitle: 'KES 18,000', tag: 'Day Experience', ritualId: 'half-day-retreat', accent: 'rgba(180,140,200,0.16)', image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=1200&auto=format&fit=crop', description: 'Herbal tea welcome, bath therapy, signature massage, facial and a healthy wellness meal. Four hours of complete restoration.', cta: 'Reserve Your Retreat' },
  { title: 'Full Day Escape', subtitle: 'KES 30,000', tag: 'Full Sanctuary', ritualId: 'full-day-escape', accent: 'rgba(212,175,55,0.20)', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop', description: 'Complete day access — personalized therapy, body treatment, facial, lunch and full relaxation lounge. The complete Arohamai experience.', cta: 'Book Full Day' },
]

// ─── THERMAL SANCTUARIES ─────────────────────────────────────────────────────

export const THERMALS: ThermalItem[] = [
  { name: 'Moroccan Bath', spec: 'KES 4,500 · 75 MIN', ritualId: 'moroccan-bath', description: 'Black soap, kessa exfoliation, argan oil seal and rose water on warm marble.', image: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?q=80&w=1200&auto=format&fit=crop', glow: 'rgba(160,80,160,0.14)' },
  { name: 'Mud Bath', spec: 'KES 3,500 · 45 MIN', ritualId: 'mud-bath', description: 'Mineral-rich volcanic clay from the Great Rift Valley. Purifies pores, relieves deep muscle tension, renews from the outside in.', image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=1200&auto=format&fit=crop', glow: 'rgba(120,80,40,0.16)' },
  { name: 'Sauna & Steam', spec: 'From KES 2,000', ritualId: 'sauna-session', description: 'Traditional Finnish dry sauna and herbal steam sessions for cardiovascular reset, deep pore cleansing and cellular detox.', image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=1200&auto=format&fit=crop', glow: 'rgba(220,100,40,0.16)' },
  { name: 'Herbal Soak', spec: 'KES 3,000 · 50 MIN', ritualId: 'herbal-soak', description: 'Deeply restorative soak in locally sourced herb-infused warm water. Eases tension, nourishes the skin and calms the mind.', image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1200&auto=format&fit=crop', glow: 'rgba(100,160,80,0.14)' },
]

// ─── FARM INGREDIENTS ────────────────────────────────────────────────────────

export const FARM_INGREDIENTS: FarmIngredient[] = [
  { name: 'Volcanic Mud Clay', origin: 'Great Rift Valley, Kenya', benefit: 'Deep pore purification and mineral rebalancing', note: 'Sourced from geothermal deposits in the Kenyan highlands', icon: '🌋' },
  { name: 'Wild Baobab Oil', origin: 'Coastal Lowlands, Kenya', benefit: 'Cellular regeneration and deep moisture binding', note: 'Cold-pressed from ancient baobab trees by local cooperatives', icon: '🌿' },
  { name: 'Fresh Aloe Vera', origin: 'Ubuntu Village Garden, 200m', benefit: 'Instant cooling, anti-inflammatory restoration', note: 'Cut fresh daily at 6am from our garden', icon: '🌱' },
  { name: 'Lemongrass & Eucalyptus', origin: 'Ubuntu Herb Garden, 200m', benefit: 'Mental clarity, respiratory opening, steam infusion', note: 'Steam-distilled on-site in small batches', icon: '🌾' },
  { name: 'Raw Shea Butter', origin: 'Northern Kenya Cooperatives', benefit: 'Deep skin barrier restoration and elasticity', note: 'Unrefined, ethically sourced from women cooperatives', icon: '🫙' },
  { name: 'Wild Marula & Argan', origin: 'Laikipia Plateau, Kenya', benefit: 'Antioxidant protection and luxurious nourishment', note: 'Sustainably harvested during fruit season', icon: '🍋' },
]

// ─── THERAPISTS ──────────────────────────────────────────────────────────────

export const THERAPISTS: Therapist[] = [
  {
    id: 'amara', name: 'Adline Mkandoe', energy: 'Grounding', frequency: '432 Hz — Earth Frequency',
    experience: '12 Years', philosophy: 'Healing begins when the nervous system remembers stillness.',
    quote: 'The body speaks softly before it screams.',
    specialties: ['Ubuntu Signature Therapy', 'Lymphatic Drainage', 'Herbal Rituals'],
    aura: 'rgba(180,120,40,0.18)',
    image: '/images/Adline-Mkandoe0.jpeg',
  },
  {
    id: 'malik', name: 'Malik Ade', energy: 'Deep Recovery', frequency: '528 Hz — Repair Frequency',
    experience: '9 Years', philosophy: 'Recovery is not luxury. It is survival for the modern mind.',
    quote: 'Muscles relax when the mind finally feels safe.',
    specialties: ['Deep Tissue Massage', 'Bamboo Stick Therapy', 'Wood Therapy'],
    aura: 'rgba(40,120,180,0.18)',
    image: '/images/Malik-Ade.jpeg',
  },
]

// ─── TESTIMONIALS ────────────────────────────────────────────────────────────

export const TESTIMONIALS = [
  { name: 'Nia M.', title: 'Executive Director, Nairobi', quote: 'I arrived burnt out. The Ubuntu Signature Therapy left me feeling like my nervous system had finally exhaled. This is not a treatment — it is a ceremony.', ritual: 'Ubuntu Signature Therapy', duration: '90 MIN' },
  { name: 'Amina & David K.', title: 'Couple, from Mombasa', quote: 'We booked the Arohamai Signature Healing Package. Four hours. We did not speak for the first hour after. That silence said everything.', ritual: 'Arohamai Signature Healing Package', duration: '4–5 HRS' },
  { name: 'Dr. Seren O.', title: 'Surgeon, Nairobi', quote: 'Six Senses. Aman. SHA. I have been to them all. The Arohamai Moroccan Bath at Ubuntu feels like something none of them have yet discovered.', ritual: 'Full Day Arohamai Wellness Escape', duration: '8 HRS' },
]

// ─── WELLNESS BUILDER ────────────────────────────────────────────────────────

export const WELLNESS_GOALS = ['Stress Relief', 'Deep Sleep', 'Energy Restoration', 'Emotional Reset', 'Skin Renewal', 'Muscle Recovery'] as const

export const WELLNESS_RECOMMENDATIONS: Record<string, string> = {
  'Stress Relief':      'stress-relief-package',
  'Deep Sleep':         'herbal-soak',
  'Energy Restoration': 'deep-tissue-massage',
  'Emotional Reset':    'ubuntu-signature-therapy',
  'Skin Renewal':       'arohamai-signature-healing',
  'Muscle Recovery':    'deep-tissue-massage',
}

// ─── SPA STATS ───────────────────────────────────────────────────────────────

export const SPA_STATS = [
  { label: 'Spa Treatments',     value: '30+',                         sub: 'Services & Packages' },
  { label: 'Healing Traditions', value: 'African · Moroccan · Nordic', sub: 'Origins'             },
  { label: 'Therapist Profiles', value: 'Energy-Matched',              sub: 'Personalised'        },
  { label: 'Farm Ingredients',   value: '200m',                        sub: 'Soil to skin'        },
]

// ─── MEMBERSHIP PLANS ────────────────────────────────────────────────────────

export const MEMBERSHIP_PLANS = [
  { name: 'Restore', price: 'KES 8,500', period: '/ month', sessions: '2 Sessions', perks: ['Any 2 treatments up to 60 MIN', 'Priority booking', '10% off retail'], accent: 'rgba(180,120,40,0.18)', featured: false },
  { name: 'Renew', price: 'KES 14,000', period: '/ month', sessions: '4 Sessions', perks: ['Any 4 treatments up to 90 MIN', 'Priority + same-day booking', '15% off retail', '1 complimentary herbal soak'], accent: 'rgba(212,175,55,0.22)', featured: true },
  { name: 'Sanctuary', price: 'KES 22,000', period: '/ month', sessions: 'Unlimited', perks: ['Unlimited sessions up to 60 MIN each', 'Concierge booking', '20% off retail', 'Monthly signature package included'], accent: 'rgba(200,180,80,0.15)', featured: false },
]