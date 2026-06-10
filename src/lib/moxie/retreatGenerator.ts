import type { RetreatItinerary, VisitPurpose, RetreatTheme, ItineraryDay } from '@/types/moxie'

// ─── Theme Mapper ───────────────────────────────────────────────────────────

const purposeToTheme: Record<VisitPurpose, RetreatTheme> = {
  rest: 'restoration',
  healing: 'restoration',
  romance: 'romance',
  creativity: 'creativity',
  silence: 'creativity',
  reconnection: 'romance',
  celebration: 'adventure',
}

// ─── Itinerary Templates ────────────────────────────────────────────────────

const itineraryTemplates: Record<RetreatTheme, ItineraryDay[]> = {
  restoration: [
    {
      day: 1,
      title: 'Arrival & Unwinding',
      activities: [
        { time: '15:00', title: 'Arrival & Cottage Welcome', description: 'Settle into your sanctuary. Herbal welcome tea awaits.', location: 'Your Cottage' },
        { time: '17:00', title: 'Introductory Spa Soak', description: 'A 60-minute hydrotherapy immersion to release travel tension.', location: 'Arohamai Spa' },
        { time: '19:30', title: 'Farm Dinner', description: 'A slow, nourishing harvest meal to ground your arrival.', location: 'Dining Pavilion' },
        { time: '21:00', title: 'Fire Circle', description: 'Optional quiet gathering around the ancestral fire.', location: 'Central Fire Pit' },
      ],
    },
    {
      day: 2,
      title: 'Deep Restoration',
      activities: [
        { time: '06:00', title: 'Sunrise Tea Ritual', description: 'Begin in stillness with wildcrafted lemongrass tea.', location: 'Eastern Garden' },
        { time: '08:30', title: 'Farm Breakfast', description: 'Nourishment from the land, eaten slowly.', location: 'Dining Pavilion' },
        { time: '11:00', title: 'Herbal Harvest Walk', description: 'Guided exploration of the medicinal gardens.', location: 'The Living Farm' },
        { time: '13:00', title: 'Silence Hour', description: 'Complete stillness under the neem canopy.', location: 'Neem Grove' },
        { time: '16:00', title: 'Herbal Body Wrap', description: 'Indigenous earth clay and plant medicine treatment.', location: 'Arohamai Spa' },
        { time: '19:00', title: 'Restorative Dinner', description: 'Healing broths and seasonal vegetables from the farm.', location: 'Dining Pavilion' },
      ],
    },
    {
      day: 3,
      title: 'Return & Integration',
      activities: [
        { time: '07:00', title: 'Forest Bathing Walk', description: 'A slow dawn immersion in the indigenous forest.', location: 'Ubuntu Forest Trail' },
        { time: '09:00', title: 'Sound Healing Session', description: 'Crystal bowl ceremony for nervous system restoration.', location: 'Bamboo Space' },
        { time: '12:00', title: 'Farewell Farm Lunch', description: 'A final nourishing meal from the land.', location: 'Dining Pavilion' },
        { time: '14:00', title: 'Reflection & Departure', description: 'Leave renewed. Your retreat summary awaits in your email.', location: 'Village Gate' },
      ],
    },
  ],
  creativity: [
    {
      day: 1,
      title: 'Arrival & Orientation',
      activities: [
        { time: '14:00', title: 'Rooftop Arrival', description: 'Settle into Neem Penthouse. Open the sky.', location: 'Neem Penthouse' },
        { time: '17:00', title: 'Golden Hour Writing', description: 'First session. Nothing required. Just observe.', location: 'Rooftop Terrace' },
        { time: '19:30', title: 'Farm Dinner', description: 'Share the table with other creative guests.', location: 'Dining Pavilion' },
      ],
    },
    {
      day: 2,
      title: 'Deep Work',
      activities: [
        { time: '06:00', title: 'Sunrise Tea Ritual', description: 'The quietest hour belongs to you.', location: 'Eastern Garden' },
        { time: '09:00', title: 'Creative Deep Work Block', description: 'Uninterrupted work in your cottage. No schedule.', location: 'Neem Penthouse' },
        { time: '13:00', title: 'Walking Lunch', description: 'Farm food delivered to you, eaten at your pace.', location: 'Your Cottage' },
        { time: '16:00', title: 'Farm Walk Reset', description: 'Leave the desk. Move through the land.', location: 'Ubuntu Farm' },
        { time: '21:00', title: 'Moonlight Cinema', description: 'Rest the thinking mind with film beneath the stars.', location: 'Amphitheatre' },
      ],
    },
    {
      day: 3,
      title: 'Output & Release',
      activities: [
        { time: '06:00', title: 'Rooftop Sunrise Session', description: 'Your final morning of open sky.', location: 'Neem Penthouse' },
        { time: '10:00', title: 'Creative Review', description: 'Reflect on what emerged. What will you carry forward?', location: 'Your Cottage' },
        { time: '13:00', title: 'Farewell Lunch', description: 'A slow meal to close the creative chapter.', location: 'Dining Pavilion' },
      ],
    },
  ],
  romance: [
    {
      day: 1,
      title: 'Arrival for Two',
      activities: [
        { time: '15:00', title: 'Valley Suite Welcome', description: 'Champagne and fresh flowers await in Buffalo Thorn.', location: 'Buffalo Thorn' },
        { time: '17:30', title: 'Sunset Walk', description: 'A private walk to the valley overlook at golden hour.', location: 'Valley Trail' },
        { time: '20:00', title: 'Private Candlelit Dinner', description: 'An intimate table for two on the clifftop terrace.', location: 'Clifftop Terrace' },
      ],
    },
    {
      day: 2,
      title: 'Slow Day Together',
      activities: [
        { time: '08:00', title: 'In-Suite Breakfast', description: 'Morning food delivered to your private terrace.', location: 'Buffalo Thorn' },
        { time: '11:00', title: 'Couples Spa Ritual', description: 'A shared hydrotherapy and massage experience.', location: 'Arohamai Spa' },
        { time: '16:00', title: 'Farm Walk', description: 'A quiet wander through the living land together.', location: 'Ubuntu Farm' },
        { time: '19:30', title: 'Fire Dinner', description: 'Fireside dining for two beneath the highland sky.', location: 'Private Fire Terrace' },
      ],
    },
    {
      day: 3,
      title: 'Last Morning',
      activities: [
        { time: '06:30', title: 'Sunrise Valley Watch', description: 'Watch dawn break over the valley from your private terrace.', location: 'Buffalo Thorn' },
        { time: '09:00', title: 'Slow Breakfast', description: 'A long, unhurried morning meal together.', location: 'Dining Pavilion' },
        { time: '12:00', title: 'Fond Farewell', description: 'Your memories here will return with you.', location: 'Village Gate' },
      ],
    },
  ],
  adventure: [
    {
      day: 1,
      title: 'Arrive & Explore',
      activities: [
        { time: '13:00', title: 'Arrival & Orientation', description: 'Village tour and ecological briefing.', location: 'Village Welcome Centre' },
        { time: '16:00', title: 'Highland Hike', description: 'A guided walk through the surrounding conservation area.', location: 'Ubuntu Highlands' },
        { time: '19:00', title: 'Fire Circle Feast', description: 'Communal harvest celebration around the fire.', location: 'Central Fire Pit' },
      ],
    },
    {
      day: 2,
      title: 'Full Immersion',
      activities: [
        { time: '06:00', title: 'Dawn Walk', description: 'Early morning bird and nature observation.', location: 'Forest Trail' },
        { time: '09:00', title: 'Farm Work Experience', description: 'Participate in daily farm life for one morning.', location: 'Ubuntu Farm' },
        { time: '16:00', title: 'Spa Recovery', description: 'Deep tissue restoration after a full day of movement.', location: 'Arohamai Spa' },
      ],
    },
    {
      day: 3,
      title: 'Reflection & Celebration',
      activities: [
        { time: '08:00', title: 'Final Farm Breakfast', description: 'A full harvest table to close the journey.', location: 'Dining Pavilion' },
        { time: '10:00', title: 'Ecological Archive Visit', description: 'Learn the story of how Ubuntu came to be.', location: 'Village Archive' },
        { time: '13:00', title: 'Departure', description: 'Leave Ubuntu changed.', location: 'Village Gate' },
      ],
    },
  ],
  detox: [
    {
      day: 1,
      title: 'Surrender the Device',
      activities: [
        { time: '15:00', title: 'Digital Surrender Ceremony', description: 'Leave your devices at the welcome desk. Begin.', location: 'Village Welcome' },
        { time: '17:00', title: 'Land Orientation Walk', description: 'First contact with the land, in full presence.', location: 'Ubuntu Farm' },
        { time: '20:00', title: 'Fire Circle', description: 'Your first evening without screens.', location: 'Central Fire Pit' },
      ],
    },
    {
      day: 2,
      title: 'Living Without the Feed',
      activities: [
        { time: '06:00', title: 'Sunrise Tea', description: 'Watch the light return. Nothing to check.', location: 'Eastern Garden' },
        { time: '09:00', title: 'Slow Farm Morning', description: 'Help harvest, plant, or simply walk.', location: 'Ubuntu Farm' },
        { time: '16:00', title: 'Sound Healing', description: 'Recalibrate your nervous system.', location: 'Bamboo Space' },
        { time: '21:00', title: 'Stargazing', description: 'The sky is deeper without a screen glow.', location: 'Village Clearing' },
      ],
    },
    {
      day: 3,
      title: 'Return to Self',
      activities: [
        { time: '07:00', title: 'Silent Breakfast', description: 'Eat in complete silence. Taste everything.', location: 'Dining Pavilion' },
        { time: '10:00', title: 'Journaling Session', description: 'Write by hand. No prompts. Just you.', location: 'Your Cottage' },
        { time: '14:00', title: 'Mindful Departure', description: 'Devices returned. But something has shifted.', location: 'Village Gate' },
      ],
    },
  ],
}

// ─── Generator ──────────────────────────────────────────────────────────────

export function generateRetreat(
  purpose: VisitPurpose,
  nights: number = 3
): RetreatItinerary {
  const theme = purposeToTheme[purpose]
  const days = itineraryTemplates[theme].slice(0, nights)

  const titles: Record<RetreatTheme, string> = {
    restoration: 'Your Restoration Journey',
    creativity: 'Your Creative Retreat',
    romance: 'Your Romantic Escape',
    adventure: 'Your Ubuntu Adventure',
    detox: 'Your Digital Detox Journey',
  }

  const subtitles: Record<RetreatTheme, string> = {
    restoration: 'A curated path back to yourself through the village.',
    creativity: 'Days of open sky, deep work, and creative immersion.',
    romance: 'Slow mornings and golden evenings for two.',
    adventure: 'Immersive ecological exploration of Ubuntu.',
    detox: 'Return to the present. Rediscover the real.',
  }

  return {
    title: titles[theme],
    subtitle: subtitles[theme],
    duration: nights,
    days,
    theme,
    wellness: ['Arohamai Spa', 'Sound Healing', 'Farm Nutrition'],
    dining: ['Farm Harvest Breakfast', 'Private Valley Dinner'],
  }
}