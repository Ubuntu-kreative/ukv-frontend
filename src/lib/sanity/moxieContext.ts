import { createClient } from 'next-sanity'

export async function getUbuntuCMSContext(): Promise<string> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    console.warn('[Moxie Context] Missing Sanity project configuration variables.')
    return 'CMS data currently unavailable.'
  }

  // ← Moved inside function so it only runs at request time, not build time
  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
  })

  try {
    const query = `{
      "menu": *[_type == "restaurantMenu" && isAvailable == true]{title, category, price, description, isVegetarian, isVegan},
      "spa": *[_type == "spaTreatment" && isActive == true]{title, duration, price, description},
      "cottages": *[_type == "cottage" && isAvailable == true]{name, treeInspiration, pricePerNight, features, description},
      "events": *[_type == "villageEvent" && isPublic == true]{title, date, description}
    }`
    const data = await client.fetch(query)
    let contextBlock = '=== LIVE UBUNTU VILLAGE RECOGNIZED CMS DATA ===\n\n'
    contextBlock += '--- ACCOMMODATIONS & COTTAGES ---\n'
    if (data.cottages?.length) {
      data.cottages.forEach((c: any) => {
        contextBlock += `- ${c.name} (${c.treeInspiration || 'Classic'} Type): ${c.pricePerNight}/night. Amenities: ${c.features?.join(', ') || 'None listed'}. Description: ${c.description || ''}\n`
      })
    } else { contextBlock += 'No cottages registered or available right now.\n' }
    contextBlock += '\n--- RESTAURANT MENU & DAILY SPECIALS ---\n'
    if (data.menu?.length) {
      data.menu.forEach((m: any) => {
        const tags = [m.isVegetarian ? 'Veg' : null, m.isVegan ? 'Vegan' : null].filter(Boolean).join(', ')
        contextBlock += `- [${m.category.toUpperCase()}] ${m.title} (${m.price}): ${m.description || ''} ${tags ? `[Tags: ${tags}]` : ''}\n`
      })
    } else { contextBlock += 'The kitchen menu is updating right now. Ask kitchen for active details.\n' }
    contextBlock += '\n--- AROHAMAI SPA TREATMENTS ---\n'
    if (data.spa?.length) {
      data.spa.forEach((s: any) => {
        contextBlock += `- ${s.title} (${s.duration} - ${s.price}): ${s.description || ''}\n`
      })
    } else { contextBlock += 'Spa schedules are open but rituals must be queried at front desk.\n' }
    contextBlock += '\n--- UPCOMING EVENTS & CIRCLES ---\n'
    if (data.events?.length) {
      data.events.forEach((e: any) => {
        contextBlock += `- ${e.title} on ${e.date}: ${e.description || ''}\n`
      })
    } else { contextBlock += 'No public group events planned today. Customized private gatherings bookable.\n' }
    return contextBlock
  } catch (error) {
    console.error('[Moxie Context Fetch Error]:', error)
    return 'Error loading village configuration data securely.'
  }
}