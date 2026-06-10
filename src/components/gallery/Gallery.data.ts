// ─────────────────────────────────────────────────────────────────────────────
// Ubuntu Kreative Village — Gallery Data
// Shared between server (page.tsx) and client components
// ─────────────────────────────────────────────────────────────────────────────

export type Exhibit = {
  id: string
  title: string
  artist: string
  medium: string
  pieces: number
  status: 'Current' | 'Upcoming' | 'Archived'
  accent: string
  dates: string
  description: string
  tags: string[]
  atmosphere: {
    bg: string
    glow: string
    particle: string
    motionStyle: string
  }
  image: string
  heroImage: string
  /**
   * Optional video for the immersive exhibit modal.
   * Supply EITHER a direct file URL (.mp4 / .webm) OR a YouTube video ID.
   *   directUrl:  'https://cdn.ubuntuvillage.com/coastal-rhythms.mp4'
   *   youtubeId:  'dQw4w9WgXcQ'
   * Leave both undefined to show the static hero image only.
   */
  video?: {
    directUrl?: string    // .mp4 / .webm / .ogg
    youtubeId?: string    // YouTube video ID (last part of watch?v=XXX)
    poster?: string       // Poster image for direct video (optional)
    label?: string        // Caption shown below player
  }
  galleryImages?: string[]
}

export type Workshop = {
  title: string
  facilitator: string
  date: string
  duration: string
  price: number
  spots: number
  spotsLeft: number
  accent: string
  description: string
  image: string
}

export type CraftMarketItem = {
  category: string
  vendors: number
  days: string
  accent: string
  description: string
  icon: string
}

// ─── Hero video config ────────────────────────────────────────────────────────
// Controls the full-screen hero video at the top of the gallery page.
// Set directUrl to a hosted .mp4 / .webm, OR set youtubeId for a YouTube video.
// Both are optional — if neither is set, the animated LivingBackground is shown.
export const HERO_VIDEO: {
  directUrl?: string
  youtubeId?: string
  poster?: string
  overlayOpacity?: number // 0–1, darkness of the overlay on top of the video
} = {
  // ← Swap these values for your actual video:
  directUrl: undefined,             // e.g. 'https://cdn.ubuntuvillage.com/hero.mp4'
  youtubeId: undefined,             // e.g. 'abc123XYZ'
  poster: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=1600&q=80',
  overlayOpacity: 0.55,
}

export const EXHIBITS: Exhibit[] = [
  {
    id: 'coastal-rhythms',
    title: 'Coastal Rhythms',
    artist: 'Amina Odhiambo',
    medium: 'Mixed media on canvas',
    pieces: 12,
    status: 'Current',
    accent: '#A8D8F0',
    dates: 'April 2026 — June 2026',
    description:
      'A sweeping exploration of the Kenyan coast through texture, colour, and memory. Odhiambo layers ocean blues with earth tones harvested from the very soil of Ubuntu Village, creating works that breathe between land and sea.',
    tags: ['Mixed Media', 'Coastal', 'Kenyan Art'],
    atmosphere: {
      bg: 'radial-gradient(ellipse 80% 60% at 30% 40%, rgba(20,55,80,0.95) 0%, rgba(5,8,12,0.99) 70%)',
      glow: 'rgba(168,216,240,0.12)',
      particle: '#A8D8F0',
      motionStyle: 'fluid',
    },
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=900&q=80',
    heroImage: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=1600&q=80',
    // ← Add a video to this exhibit:
    // video: { youtubeId: 'YOUR_ID', label: 'Exhibition walkthrough · 4 min' },
    // video: { directUrl: 'https://cdn.example.com/coastal.mp4', poster: '...', label: 'Walkthrough' },
    galleryImages: [
      'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80',
      'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80',
    ],
  },
  {
    id: 'roots-rising',
    title: 'Roots & Rising',
    artist: 'Kwame Njoroge',
    medium: 'Sculpture · Reclaimed wood',
    pieces: 8,
    status: 'Upcoming',
    accent: '#D4A853',
    dates: 'July 2026 — September 2026',
    description:
      'Njoroge transforms reclaimed wood from fallen trees across the Ubuntu farm into towering figurative sculptures. Each piece is named after a Kenyan proverb and speaks to the relationship between community and individual growth.',
    tags: ['Sculpture', 'Reclaimed', 'Proverbs'],
    atmosphere: {
      bg: 'radial-gradient(ellipse 80% 60% at 30% 40%, rgba(50,30,8,0.95) 0%, rgba(5,5,3,0.99) 70%)',
      glow: 'rgba(212,168,83,0.12)',
      particle: '#D4A853',
      motionStyle: 'heavy',
    },
    image: 'https://images.unsplash.com/photo-1561839561-b13bcfe95249?w=900&q=80',
    heroImage: 'https://images.unsplash.com/photo-1600431521340-491eca880813?w=1600&q=80',
    // video: { youtubeId: 'YOUR_ID', label: 'Artist studio visit · 6 min' },
    galleryImages: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
      'https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&q=80',
      'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&q=80',
      'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=800&q=80',
    ],
  },
  {
    id: 'harvest-light',
    title: 'Harvest Light',
    artist: 'Zawadi Muthoni',
    medium: 'Photography · Large format print',
    pieces: 18,
    status: 'Archived',
    accent: '#00FF41',
    dates: 'January 2026 — March 2026',
    description:
      'Muthoni spent three months embedded on the Ubuntu farm, photographing the arc of a single harvest season from planting to plate. The resulting 18 large-format prints document the invisible labour that feeds us all.',
    tags: ['Photography', 'Farm', 'Documentary'],
    atmosphere: {
      bg: 'radial-gradient(ellipse 80% 60% at 30% 40%, rgba(8,30,12,0.95) 0%, rgba(3,8,4,0.99) 70%)',
      glow: 'rgba(0,255,65,0.08)',
      particle: '#00FF41',
      motionStyle: 'cinematic',
    },
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&q=80',
    heroImage: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&q=80',
    // video: { youtubeId: 'YOUR_ID', label: 'Documentary short · 12 min' },
    galleryImages: [
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
      'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=800&q=80',
      'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&q=80',
    ],
  },
]

export const WORKSHOPS: Workshop[] = [
  {
    title: 'Natural Dye Workshop',
    facilitator: 'Ubuntu Village Artisans',
    date: 'Every Saturday · 10:00 AM',
    duration: '3 hours',
    price: 2500,
    spots: 8,
    spotsLeft: 3,
    accent: '#D4A853',
    description: 'Learn to extract dyes from farm plants — turmeric, avocado seeds, onion skins — and apply them to natural fabric using traditional Kenyan techniques.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  },
  {
    title: 'Pottery on the Farm',
    facilitator: 'Grace Wanjiku',
    date: 'Every Sunday · 9:00 AM',
    duration: '4 hours',
    price: 3200,
    spots: 6,
    spotsLeft: 2,
    accent: '#F0A8B8',
    description: 'Wheel-thrown pottery using clay sourced from the Ubuntu land. Grace guides you from raw earth to finished vessel. Your piece is kiln-fired and ready for collection the following day.',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80',
  },
  {
    title: 'Beadwork Masterclass',
    facilitator: 'Maasai Artisan Collective',
    date: 'First Friday of month · 2:00 PM',
    duration: '2.5 hours',
    price: 1800,
    spots: 10,
    spotsLeft: 6,
    accent: '#B8A9F0',
    description: 'Traditional Maasai beadwork patterns taught by visiting artisans from the collective. Learn the symbolic language of colour and pattern carried across generations.',
    image: 'https://images.unsplash.com/photo-1573408301185-9519f94815b4?w=600&q=80',
  },
  {
    title: 'Farm Sketching at Dawn',
    facilitator: 'Artist in Residence',
    date: 'Tuesday & Thursday · 6:30 AM',
    duration: '2 hours',
    price: 1200,
    spots: 8,
    spotsLeft: 5,
    accent: '#00FF41',
    description: 'Guided observational drawing in the fields as the farm wakes up. All materials provided. No experience needed — the farm is the teacher.',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80',
  },
]

export const CRAFT_MARKET: CraftMarketItem[] = [
  {
    category: 'Ceramics',
    vendors: 4,
    days: 'Daily',
    accent: '#D4A853',
    description: 'Hand-thrown vessels, ritual bowls, and sculptural forms fired in our on-site kiln.',
    icon: '◎',
  },
  {
    category: 'Textiles & Weaving',
    vendors: 6,
    days: 'Daily',
    accent: '#F0A8B8',
    description: 'Natural fibre weaving, kanga designs, and indigo-dyed cloth from local artisans.',
    icon: '⊞',
  },
  {
    category: 'Jewellery',
    vendors: 5,
    days: 'Daily',
    accent: '#B8A9F0',
    description: 'Brass castings, silver wire work, and beaded collars drawing on Swahili & Maasai traditions.',
    icon: '◈',
  },
  {
    category: 'Farm Produce',
    vendors: 3,
    days: 'Daily',
    accent: '#00FF41',
    description: 'Sun-dried herbs, raw honey, cold-pressed oils, and preserves from the Ubuntu kitchen garden.',
    icon: '✦',
  },
  {
    category: 'Woodcraft',
    vendors: 3,
    days: 'Weekends',
    accent: '#F0D8A8',
    description: 'Carved utensils, figurative pieces, and furniture from reclaimed Kenyan hardwoods.',
    icon: '⌘',
  },
  {
    category: 'Natural Skincare',
    vendors: 2,
    days: 'Daily',
    accent: '#A8F0D8',
    description: 'Shea butter blends, baobab oils, and herbal balms formulated at the Ubuntu wellness lab.',
    icon: '◉',
  },
]

export const GALLERY_STATS = [
  { value: '3', label: 'Active Exhibitions' },
  { value: '38+', label: 'Artists Featured' },
  { value: '23', label: 'Craft Vendors' },
  { value: '4', label: 'Weekly Workshops' },
]