// app/events/eventsData.ts  — SERVER-SAFE  (no hooks, no 'use client')

export interface UKVEvent {
  id: string
  title: string
  subtitle: string
  cinematic: string
  category: string
  date: string
  time: string
  duration: string
  capacity: number
  spotsLeft: number
  price: number
  accent: string
  status: 'Reservation Open' | 'Enquire'
  description: string
  includes: string[]
  image: string
  gallery?: string[]
  philosophy?: string
  spaces?: { name: string; description: string }[]
  journey?: string[]
  testimonial?: { quote: string; author: string; location: string }
}

export interface EventType {
  id: string
  icon: string
  name: string
  sub: string
  price: number
  tag: string
  image: string
  philosophy?: string
  gallery?: string[]
  spaces?: { name: string; description: string }[]
  journey?: string[]
  testimonial?: { quote: string; author: string; location: string }
  includes?: string[]
}

export const CATEGORY_COLORS: Record<string, string> = {
  'Dining Experience': 'var(--gold)',
  'Farm Experience':   'var(--neon)',
  'Weddings':          '#F0A8B8',
  'Corporate':         '#B8A9F0',
  'Community':         '#A8D8F0',
  'Education':         '#A8F0D8',
}

export const EVENTS: UKVEvent[] = [
  {
    id: 'harvest-dinner-may',
    title: 'Harvest Dinner',
    subtitle: 'A five-course farm-to-table evening',
    cinematic: 'Five courses. Open fire. One long table beneath the Rift Valley sky.',
    category: 'Dining Experience',
    date: 'Last Saturday of each month',
    time: '6:30 PM',
    duration: '4 hours',
    capacity: 24,
    spotsLeft: 8,
    price: 12500,
    accent: 'var(--gold)',
    status: 'Reservation Open',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80',
      'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=900&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&q=80',
      'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=900&q=80',
    ],
    philosophy:
      'Food is memory. Each dish arrives not just plated but provenance-narrated — the animal ID, the field row, the farmer who tended it. This is not restaurant dining. This is communion with the land.',
    spaces: [
      { name: 'The Long Table', description: 'A single 10-metre table beneath acacia boughs, set for 24 under open sky.' },
      { name: 'The Kitchen Garden', description: 'Where guests move between courses, sampling herbs and meeting the harvest crew.' },
      { name: 'The Cellar Terrace', description: 'Post-dinner, wine and fire. Stories under the stars.' },
    ],
    journey: [
      'Golden hour farm walk',
      'Welcome drink at The Cellar Terrace',
      'Five-course dinner at The Long Table',
      'Moxie provenance stories between courses',
      'Fire and wine to close',
    ],
    testimonial: {
      quote: 'The dinner changed how I think about food. I now know the name of the cow.',
      author: 'Wanjiku N.',
      location: 'Nairobi',
    },
    description:
      'Once a month, our chef designs a five-course menu built entirely from what was harvested that week. Guests gather around a single long table beneath the stars, and Moxie introduces each dish with its full provenance story.',
    includes: [
      'Five-course tasting menu',
      'Farm-sourced wine pairing',
      'Meet the farmer session',
      'Moxie provenance narration',
      'Farm tour at golden hour',
    ],
  },
  {
    id: 'sunrise-farm-walk',
    title: 'Sunrise Farm Walk',
    subtitle: 'Guided walk through all fields and boma units',
    cinematic: 'The farm at dawn. Dew. Soil readings. Truth.',
    category: 'Farm Experience',
    date: 'Every Tuesday & Saturday',
    time: '6:00 AM',
    duration: '2 hours',
    capacity: 12,
    spotsLeft: 5,
    price: 2800,
    accent: 'var(--neon)',
    status: 'Reservation Open',
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=900&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80',
    ],
    philosophy:
      'The farm at dawn holds truths the afternoon never will. Dew-heavy rows, the first readings on the soil sensors, the crew already at work. To walk it is to understand where your food actually comes from.',
    spaces: [
      { name: 'The Six Fields', description: 'Three hectares of rotating crop rows — each mapped to the millimetre.' },
      { name: 'The Boma Units', description: 'Where the animals sleep, eat, and are monitored. Intimate and honest.' },
      { name: 'The Breakfast Terrace', description: 'Where the walk ends — farm eggs, bread from yesterday\'s grain, strong coffee.' },
    ],
    journey: [
      'Meet at the main gate at 6:00 AM',
      'Field walk with farm manager',
      'Boma visit and animal feeding',
      'FarmERP live dashboard demo',
      'Farm breakfast on the terrace',
    ],
    testimonial: {
      quote: "I've been to farms before. I've never felt a farm before.",
      author: 'Kamau T.',
      location: 'Nakuru',
    },
    description:
      'The farm at dawn is unlike any other time of day. Walk through all six fields with our farm manager, visit the boma units, check the morning soil readings, and watch the harvest crew begin their work. Ends with a farm breakfast.',
    includes: [
      'Guided walk through all 6 fields',
      'Boma unit visit',
      'Live FarmERP dashboard demo',
      'Farm breakfast included',
      'Small group (max 12)',
    ],
  },
  {
    id: 'ubuntu-wedding',
    title: 'Ubuntu Weddings',
    subtitle: 'Intimate farm ceremonies for up to 80 guests',
    cinematic: 'Drums. Acacias. A ceremony the land remembers.',
    category: 'Weddings',
    date: 'By arrangement',
    time: 'Full day',
    duration: 'Full day',
    capacity: 80,
    spotsLeft: 99,
    price: 0,
    accent: '#F0A8B8',
    status: 'Enquire',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=900&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80',
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=900&q=80',
    ],
    philosophy:
      'A wedding here is not an event. It is a ceremony rooted in land, ancestry, and the African idea that no person is complete without community. The living farm, the open sky, the drumming procession — they are not amenities. They are the ceremony.',
    spaces: [
      { name: 'The Acacia Court', description: 'Ceremonies beneath the canopy of our 60-year-old acacia tree. Dappled light, ancestral shade.' },
      { name: 'The Open Field', description: 'For larger gatherings. The horizon is the backdrop. The Rift Valley light, the setting.' },
      { name: 'The Glass Pavilion', description: 'Climate-controlled, panoramic. For receptions that run into the night.' },
      { name: 'Moonfire Circle', description: 'Post-ceremony fire gathering. Storytellers. Drummers. The village comes alive.' },
    ],
    journey: [
      'Morning bridal spa at Arohamai',
      'Drumming procession to ceremony',
      'Ceremony beneath the acacias',
      'Farm-to-fork reception feast',
      'Moonfire circle and dancing',
      'Sunrise breakfast for staying guests',
    ],
    testimonial: {
      quote: 'Ubuntu felt less like a venue and more like entering another world. Our guests still talk about it three years later.',
      author: 'Achieng & Odhiambo',
      location: 'Nairobi',
    },
    description:
      "Ubuntu Kreative Village is one of Kenya's most distinctive wedding venues. The living farm, the art gallery, the Arohamai Spa, and the farm-to-fork kitchen all come together to create a ceremony that is entirely, unmistakably yours.",
    includes: [
      'Exclusive venue hire',
      'Farm-to-fork catering',
      'Arohamai Spa access for bridal party',
      'Accommodation for up to 24 guests',
      'Dedicated Ubuntu wedding coordinator',
      'Moxie as your digital wedding host',
    ],
  },
  {
    id: 'day-conference',
    title: 'Day Conference',
    subtitle: 'Full-service conference packages from KES 3,500 per person',
    cinematic: 'Focused minds. Open air. The farm holds the space.',
    category: 'Corporate',
    date: 'Monday – Saturday, by arrangement',
    time: '8:00 AM',
    duration: 'Full day or half day',
    capacity: 60,
    spotsLeft: 99,
    price: 3500,
    accent: '#B8A9F0',
    status: 'Reservation Open',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&q=80',
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=900&q=80',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&q=80',
      'https://images.unsplash.com/photo-1560439514-4e9645039924?w=900&q=80',
    ],
    philosophy:
      'Most conference rooms are designed for compliance. Ours is designed for clarity. The farm light, the open air and the soil underfoot do something to the quality of thinking that no urban venue can replicate.',
    spaces: [
      { name: 'The Strategy Loft', description: 'Open-plan workshop space with writable walls, HD projection, and uninterrupted farm panoramas.' },
      { name: 'The Breakout Terrace', description: 'Covered outdoor space for syndicate sessions, coffee breaks, and informal discussion.' },
      { name: 'The Fire Deck', description: 'Evening facilitation space. No screens. No slides. The fire does the rest.' },
    ],
    journey: [
      'Arrival and registration from 8:00 AM',
      'Morning tea service',
      'Conference session one',
      'Farm-to-table buffet lunch',
      'Afternoon tea and farm activity break',
      'Conference session two',
      'Close and debrief',
    ],
    testimonial: {
      quote: "We solved two years of deadlock in three days here. The farm does something to your thinking.",
      author: 'CEO, Fintech',
      location: 'Nairobi',
    },
    description:
      'A full-service conference facility set inside a working farm. Choose from day packages starting at KES 3,500 per person — all include projector, flipchart, stationeries and drinking water. Buffet menus from a 1-course lunch to a full BBQ dinner. Residential half-board packages available for multi-day programmes.',
    includes: [
      'HD projector & HDMI cable',
      'Flipchart & markers',
      'Stationeries for all delegates',
      'Unlimited drinking water',
      'High-speed Wi-Fi',
      'Tea & coffee service (package dependent)',
      'Buffet lunch (package dependent)',
      'Team building activities (package dependent)',
    ],
  },
  {
    id: 'corporate-retreat',
    title: 'Corporate Retreats',
    subtitle: 'Residential leadership programmes on the working farm',
    cinematic: 'Strategy sessions at sunrise. Fire circles after dark. Clarity.',
    category: 'Corporate',
    date: 'By arrangement',
    time: 'Multi-day',
    duration: '2–4 days',
    capacity: 30,
    spotsLeft: 99,
    price: 10500,
    accent: '#B8A9F0',
    status: 'Enquire',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&q=80',
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=900&q=80',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&q=80',
    ],
    philosophy:
      'The farm is a living system of interdependence. So is your team. Ubuntu retreats place leadership questions against the reality of the soil, the weather, and the harvest — where the abstractions fall away and what remains is clarity.',
    spaces: [
      { name: 'The Strategy Loft', description: 'Open-plan, light-filled workshop space with writable walls and farm views.' },
      { name: 'The Fire Deck', description: 'Evening facilitation around the open fire. No screens. No slides. Just thinking.' },
      { name: 'The Field', description: 'Team activities take place in the working farm. The stakes are real. The lessons too.' },
    ],
    journey: [
      'Arrival and farm orientation',
      'Morning strategy sessions',
      'Field-based team challenge',
      'Arohamai Spa reset',
      'Evening fire facilitation',
      'Farm-to-fork communal dinner',
      'Sunrise reflection walk',
    ],
    testimonial: {
      quote: "Our leadership team made three major decisions on this retreat that we'd been stuck on for two years. The farm does something to you.",
      author: 'CEO, Fintech company',
      location: 'Nairobi',
    },
    description:
      'Remove your team from the office and place them inside a living, working farm system. The residential half-board package (KES 10,500 per person) combines overnight accommodation with dinner, breakfast, and full conference facilities — a serene, nature-inspired environment for focused multi-day engagement.',
    includes: [
      'Overnight accommodation (half board)',
      'Dinner and breakfast included',
      'Full conference facilities',
      'HD projector, HDMI & flipchart',
      'Farm team-building activities',
      'Arohamai Spa access',
      'Farm-to-fork all meals',
      'Facilitator available on request',
    ],
  },
  {
    id: 'new-moon-fire',
    title: 'New Moon Fire Circle',
    subtitle: 'Community gathering under the African sky',
    cinematic: 'Drums. Firelight. Storytelling beneath a moonless sky.',
    category: 'Community',
    date: 'Each new moon',
    time: '7:00 PM',
    duration: '3 hours',
    capacity: 40,
    spotsLeft: 18,
    price: 1500,
    accent: '#A8D8F0',
    status: 'Reservation Open',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=900&q=80',
      'https://images.unsplash.com/photo-1543968996-ee822b8176ba?w=900&q=80',
      'https://images.unsplash.com/photo-1445375011782-2384686778a0?w=900&q=80',
    ],
    philosophy:
      'The new moon marks emptiness before fullness. We gather not to perform but to listen. To storytellers, to elders, to the fire itself. This is how Ubuntu has always understood community — as something you practice, not something you attend.',
    spaces: [
      { name: 'The Moonfire Circle', description: "A permanent stone fire pit at the farm's heart. Stars overhead, nothing between you and the sky." },
      { name: 'The Story Ring', description: 'Seating arranged in concentric rings. The fire is the centre. The storyteller, the spine.' },
    ],
    journey: [
      'Arrival at dusk',
      'Farm-made food and drink',
      'Storytelling opens the circle',
      'Live music from community musicians',
      'Elder teaching',
      'Fire closes at 10:00 PM',
    ],
    testimonial: {
      quote: "I drove 3 hours. I'd do it again this month.",
      author: 'Njeri M.',
      location: 'Meru',
    },
    description:
      'On each new moon, the Ubuntu community gathers around a fire in the open field. Storytellers, musicians, and elders from surrounding communities are invited to share.',
    includes: [
      'Open fire gathering',
      'Live storytelling and music',
      'Farm food and drink',
      'Open to all — guests and public',
      'Guided by community elders',
    ],
  },
  {
    id: 'school-farm-day',
    title: 'School Farm Days',
    subtitle: 'Educational farm visits for schools and groups',
    cinematic: 'Soil. Seeds. The moment a child understands where food begins.',
    category: 'Education',
    date: 'Monday–Friday by arrangement',
    time: '9:00 AM',
    duration: '5 hours',
    capacity: 40,
    spotsLeft: 99,
    price: 800,
    accent: '#A8F0D8',
    status: 'Reservation Open',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=900&q=80',
      'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=900&q=80',
      'https://images.unsplash.com/photo-1588072432836-e10032774350?w=900&q=80',
    ],
    philosophy:
      "Most children never learn where food comes from. They should. Ubuntu School Days are not a trip — they are an intervention. One morning on this farm changes the relationship a child has with the earth for the rest of their life.",
    spaces: [
      { name: 'The Learning Field', description: 'Students plant, observe, and harvest. Hands in actual soil.' },
      { name: 'The Farm Kitchen', description: 'A full cooking session using what was picked that morning.' },
      { name: 'The Tech Barn', description: 'Moxie AI demonstration — how technology and farming work together.' },
    ],
    journey: [
      'Arrival and farm orientation',
      'Guided tour of all six fields',
      'Hands-on planting activity',
      'Cooking session with farm produce',
      'Moxie AI demonstration',
      'Farm lunch — food they helped make',
    ],
    testimonial: {
      quote: "My daughter has refused to waste food since. That's worth everything.",
      author: 'Parent, Nakuru Primary',
      location: 'Nakuru',
    },
    description:
      'A full day on the Ubuntu farm for school groups. Students learn about sustainable agriculture, animal welfare, food systems, and African ecology.',
    includes: [
      'Full guided farm tour',
      'Hands-on planting activity',
      'Cooking session with farm produce',
      'Moxie AI demonstration',
      'Farm lunch included',
      'Per student pricing',
    ],
  },
]

// ─── Conference Pricing ───────────────────────────────────────────────────────

export interface ConferenceRate {
  id: string
  label: string
  description: string
  price: number
  tag?: string
}

export interface BuffetMenu {
  id: string
  label: string
  courses: string
  price: number
  highlight?: boolean
}

export interface CancellationTier {
  weeks: string
  penalty: string
  pct: number
}

export const CONFERENCE_RATES: ConferenceRate[] = [
  {
    id: 'team-build',
    label: 'Team Building + Tea & Lunch',
    description: 'Team building activities with morning tea and a full farm-to-table lunch',
    price: 4500,
    tag: 'Most Popular',
  },
  {
    id: 'btlt',
    label: 'BTLT — Full Day',
    description: 'Breakfast, morning tea, lunch and afternoon tea',
    price: 5500,
  },
  {
    id: 'tlt',
    label: 'TLT — Tea, Lunch, Tea',
    description: 'Morning tea, buffet lunch and afternoon tea service',
    price: 4500,
  },
  {
    id: 'tl',
    label: 'TL — Tea & Lunch',
    description: 'Morning tea and a two-course farm lunch',
    price: 3500,
  },
  {
    id: 'venue-only',
    label: 'Conference Space Only',
    description: 'Exclusive use of conference facilities — no catering included',
    price: 10000,
    tag: 'Venue Only',
  },
  {
    id: 'residential',
    label: 'Residential Half Board',
    description: 'Overnight accommodation with dinner and breakfast. Designed for retreats and multi-day conferences — combines deep productivity with farm comfort.',
    price: 10500,
    tag: 'Multi-Day',
  },
]

export const BUFFET_MENUS: BuffetMenu[] = [
  {
    id: 'buffet-3',
    label: '3 Course Buffet',
    courses: 'Soup · 2 Salads · 3 Carbs · 2 Veggies · 2 Desserts · Soda & Water · Tea / Coffee / Chocolate',
    price: 4500,
    highlight: true,
  },
  {
    id: 'buffet-2',
    label: '2 Course Buffet',
    courses: 'Soup · 2 Salads · 2 Proteins · 2 Carbs · 1 Veggie · 1 Dessert · Water · Tea / Coffee / Chocolate',
    price: 3500,
  },
  {
    id: 'buffet-1',
    label: '1 Course Buffet',
    courses: 'Soup · 1 Salad · 1 Protein · 2 Carbs · 1 Veggie · 1 Dessert · Water · Tea / Coffee / Chocolate',
    price: 2500,
  },
  {
    id: 'bbq-dinner',
    label: 'Barbeque Dinner',
    courses: 'Full farm barbeque spread — served at dusk',
    price: 4000,
  },
  {
    id: 'breakfast',
    label: 'Breakfast',
    courses: 'Full hot breakfast service',
    price: 1500,
  },
  {
    id: 'packed-lunch',
    label: 'Packed Lunch',
    courses: 'Farm-made packed lunch for field or travel days',
    price: 1000,
  },
  {
    id: 'packed-breakfast',
    label: 'Packed Breakfast',
    courses: '2 boiled eggs · Ham · Sandwich · Juice · Fruit · Water',
    price: 1000,
  },
]

export const CANCELLATION_POLICY: CancellationTier[] = [
  { weeks: 'Within 48 hrs of booking', penalty: 'No charge', pct: 0 },
  { weeks: '1 week prior',             penalty: 'No charge',  pct: 0 },
  { weeks: '2 weeks prior',            penalty: '25% of reservation', pct: 25 },
  { weeks: '3 weeks prior',            penalty: '30% of reservation', pct: 30 },
  { weeks: '4 weeks prior',            penalty: '50% of reservation', pct: 50 },
  { weeks: '6 weeks prior',            penalty: '80% of reservation', pct: 80 },
  { weeks: '8+ weeks prior',           penalty: '100% of reservation', pct: 100 },
]

export const CONFERENCE_INCLUDES = [
  'Flipchart & markers',
  'HD projector & HDMI cable',
  'Stationeries for all delegates',
  'Unlimited drinking water',
  'High-speed Wi-Fi',
  'Nature-inspired environment for focused engagement',
]

export const EVENT_TYPES: EventType[] = [
  {
    id: 'ev-corp',
    icon: '🏢',
    name: 'Corporate',
    sub: 'Retreats · Offsites · Leadership',
    price: 320000,
    tag: 'Corporate Event',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80',
    philosophy:
      'Remove your team from the office and place them inside a living, working farm system. Ubuntu retreats are built on the understanding that clarity comes from context — and that the farm is the most honest context there is.',
    gallery: [
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&q=80',
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=900&q=80',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&q=80',
    ],
    spaces: [
      { name: 'The Strategy Loft', description: 'Open-plan workshop space with writable walls and farm panoramas.' },
      { name: 'The Fire Deck', description: 'Evening facilitation space. No screens. Just fire and honest thinking.' },
      { name: 'The Working Farm', description: 'Team activities in the real environment. Interdependence made literal.' },
    ],
    journey: ['Arrival & orientation', 'Morning strategy sessions', 'Field-based team challenge', 'Spa reset midday', 'Fire facilitation at dusk', 'Communal farm dinner'],
    includes: ['Workshop and strategy spaces', 'Farm team-building activities', 'Arohamai Spa access', 'All accommodation on-site', 'Farm-to-fork all meals', 'Facilitator on request'],
    testimonial: { quote: "We solved two years of deadlock in three days here. The farm does something to your thinking.", author: 'CEO, Fintech', location: 'Nairobi' },
  },
  {
    id: 'ev-wed',
    icon: '🌿',
    name: 'Weddings',
    sub: 'Ceremonies · Receptions · Honeymoons',
    price: 480000,
    tag: 'Private Wedding',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80',
    philosophy:
      'A wedding here is not a venue hire. It is a covenant with the land. The farm, the fire, the feast — each element is drawn from the living Ubuntu ecology, not a caterers\'s catalogue.',
    gallery: [
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=900&q=80',
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=900&q=80',
    ],
    spaces: [
      { name: 'The Acacia Court', description: 'Ceremony beneath 60-year-old acacias. Dappled light, ancestral shade.' },
      { name: 'The Glass Pavilion', description: 'Climate-controlled, panoramic. For receptions that run into the night.' },
      { name: 'Moonfire Circle', description: 'Post-ceremony fire gathering. Storytellers. Drummers.' },
    ],
    journey: ['Morning bridal spa at Arohamai', 'Drumming procession', 'Acacia ceremony', 'Farm-to-fork reception', 'Moonfire circle and dancing', 'Sunrise breakfast'],
    includes: ['Exclusive venue hire', 'Farm-to-fork catering', 'Arohamai Spa access', 'Accommodation for up to 24', 'Dedicated wedding coordinator', 'Moxie as digital wedding host'],
    testimonial: { quote: 'Our guests still talk about it three years later.', author: 'Achieng & Odhiambo', location: 'Nairobi' },
  },
  {
    id: 'ev-art',
    icon: '🎨',
    name: 'Creative Residencies',
    sub: 'Artists · Writers · Makers',
    price: 85000,
    tag: 'Creative Residency',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80',
    philosophy:
      "The farm is creative space. Something about the rhythm of the land — the seasons, the soil, the animals — resets the artist's attention. Ubuntu creative residencies are deliberately unstructured. The farm tells you what to make.",
    gallery: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=900&q=80',
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=900&q=80',
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=900&q=80',
    ],
    spaces: [
      { name: 'The Art Barn', description: 'A converted barn with north light and complete silence. For making.' },
      { name: 'The Gallery', description: 'For showing. Rotating exhibitions of resident work.' },
      { name: 'The Field Studio', description: 'Working outdoors. The farm as medium.' },
    ],
    journey: ['Arrival and space orientation', 'Morning farm walk for inspiration', 'Unstructured studio time', 'Communal lunch', 'Critique or collaboration session', 'Evening farm dinner'],
    includes: ['Studio space access', 'Gallery exhibition slot', 'Farm accommodation', 'All meals on-site', 'Farm access at all hours', 'Artist cohort curation'],
    testimonial: { quote: 'I made more honest work in one week here than in a year in my studio.', author: 'Waweru A.', location: 'Nairobi' },
  },
  {
    id: 'ev-cult',
    icon: '🥁',
    name: 'Community',
    sub: 'Cultural Events · Rituals · Gatherings',
    price: 55000,
    tag: 'Community Gathering',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80',
    philosophy:
      'Ubuntu has always meant the same thing: I am because we are. Community gatherings here are not performances of culture — they are culture, practiced. With elders, storytellers, fire, and the land itself as witness.',
    gallery: [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=900&q=80',
      'https://images.unsplash.com/photo-1543968996-ee822b8176ba?w=900&q=80',
      'https://images.unsplash.com/photo-1445375011782-2384686778a0?w=900&q=80',
    ],
    spaces: [
      { name: 'The Moonfire Circle', description: "Stone fire pit at the farm's heart. Open sky." },
      { name: 'The Story Ring', description: 'Concentric seating around the fire. The storyteller at the centre.' },
      { name: 'The Open Field', description: 'For larger gatherings — cultural festivals, community markets, music events.' },
    ],
    journey: ['Arrival at dusk', 'Farm food and welcome drinks', 'Storytelling opens the circle', 'Music and community performance', 'Elder teaching', 'Fire closes at 10:00 PM'],
    includes: ['Moonfire Circle exclusive use', 'Community facilitator', 'Farm-made food and drink', 'Elder or storyteller curation', 'Open to guests and public', 'Sound system on request'],
    testimonial: { quote: 'I came as a stranger. I left as part of something.', author: 'Njeri M.', location: 'Meru' },
  },
]