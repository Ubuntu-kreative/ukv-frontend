// Route-aware welcome copy and quick prompts for Moxie (real pages only)

export interface PageContext {
  welcome: string
  subtitle: string
  suggestions: string[]
}

const PAGE_CONTEXT: Record<string, PageContext> = {
  '/': {
    welcome: 'Welcome to the village. I am Moxie — your concierge for stays, dining, spa, farm, and gatherings.',
    subtitle: 'Ubuntu Kreative Village · Concierge',
    suggestions: [
      'Plan a weekend stay',
      'What is on the menu tonight?',
      'Recommend a spa ritual',
      'Upcoming farm experiences',
    ],
  },
  '/restaurant': {
    welcome: 'You are in our dining room. I can guide the menu, provenance stories, and table reservations.',
    subtitle: 'Signature & Village Kitchen',
    suggestions: [
      'Show signature mains',
      'Vegetarian options',
      'Reserve a table tonight',
      'Add a dish to my journey',
    ],
  },
  '/cottages': {
    welcome: 'These are our riverside stays. I can compare cottages, board plans, and help you reserve.',
    subtitle: 'Accommodation concierge',
    suggestions: [
      'Compare cottage options',
      'Explain board plans',
      'Best room for two guests',
      'Add a stay to my journey',
    ],
  },
  '/spa': {
    welcome: 'Arohamai Spa awaits. I can explain rituals, durations, and guide your wellness booking.',
    subtitle: 'Wellness concierge',
    suggestions: [
      'Recommend a ritual',
      'Couples experience',
      'Book spa for tomorrow',
      'What is included?',
    ],
  },
  '/farm': {
    welcome: 'The farm is alive this morning. I can explain walks, school days, and harvest experiences.',
    subtitle: 'Farm experience guide',
    suggestions: [
      'Sunrise farm walk',
      'What animals are here?',
      'Book a farm experience',
      'Family-friendly activities',
    ],
  },
  '/events': {
    welcome: 'Gatherings at Ubuntu — harvest dinners, fire circles, weddings, and retreats.',
    subtitle: 'Events & experiences',
    suggestions: [
      'Harvest dinner dates',
      'New Moon Fire Circle',
      'Corporate retreat enquiry',
      'Add an experience to cart',
    ],
  },
  '/gallery': {
    welcome: 'Moments from the village. Ask me about any space you see — I know where each story lives on site.',
    subtitle: 'Visual discovery',
    suggestions: [
      'Tell me about the lodge',
      'Farm life gallery',
      'Book what I am viewing',
      'Plan a visit',
    ],
  },
  '/contact': {
    welcome: 'I can complete your enquiry here — or refine what is already in your journey cart.',
    subtitle: 'Reservations & contact',
    suggestions: [
      'Review my journey cart',
      'Confirm my booking details',
      'Village contact options',
      'M-Pesa payment help',
    ],
  },
  '/about': {
    welcome: 'Ubuntu is a living eco-sanctuary. Ask me about our philosophy, land, and how to visit.',
    subtitle: 'The village story',
    suggestions: [
      'What makes Ubuntu unique?',
      'How do I book a stay?',
      'Sustainability practices',
      'Plan my first visit',
    ],
  },
}

export function getPageContext(pathname: string): PageContext {
  const base = pathname.split('?')[0]
  if (PAGE_CONTEXT[base]) return PAGE_CONTEXT[base]

  for (const key of Object.keys(PAGE_CONTEXT)) {
    if (key !== '/' && base.startsWith(key)) return PAGE_CONTEXT[key]
  }

  return PAGE_CONTEXT['/']
}
