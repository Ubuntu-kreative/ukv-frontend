// src/app/api/moxie/route.ts
// ─────────────────────────────────────────────────────────────────────
// Ubuntu Kreative Village — Moxie AI Concierge API Route
//
// Architecture:
//   1. Receives conversation history + session context
//   2. Fetches relevant menu/property data to inject as context
//   3. Calls GPT-4o with enriched system prompt + tool definitions
//   4. Returns structured response: text + optional tool_call action
//
// Tool calls (handled client-side after response):
//   - add_to_cart: Moxie wants to add an item to the cart
//   - open_cart: Moxie wants to open the cart panel
//   - create_reservation: Moxie has collected enough info to create a booking
//
// Memory:
//   Edge-safe in-memory store (resets on cold start — acceptable for MVP).
//   Replace with Supabase/Redis for production persistence.
// ─────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server'
import { buildSystemPrompt }         from '@/lib/moxie/systemPrompt'
import { getMenuSummaryForAI }       from '@/lib/moxie/menu'
import tools from '@/lib/moxie/tools'

// ── Runtime ──────────────────────────────────────────────────────────
export const runtime = 'edge'

// ── In-memory session memory (edge-safe) ────────────────────────────
// Stores key facts per session: dietary prefs, names, room preferences.
// Resets on cold start — replace with Supabase for persistence.
const sessionMemory = new Map<string, string>()

function getMemory(sessionId: string): string {
  return sessionMemory.get(sessionId) || ''
}

function updateMemory(sessionId: string, conversation: Message[]): void {
  // Extract key facts from the last few messages
  const recentText = conversation.slice(-6).map(m => m.content).join(' ').toLowerCase()

  const facts: string[] = []

  // Dietary preferences
  if (/vegetarian|vegan|no meat/i.test(recentText)) facts.push('Guest is vegetarian/vegan')
  if (/halal/i.test(recentText))                    facts.push('Guest requires halal food')
  if (/gluten/i.test(recentText))                   facts.push('Guest has gluten sensitivity')
  if (/allerg/i.test(recentText))                   facts.push('Guest mentioned allergies — check carefully')

  // Occasion
  if (/anniversary|honeymoon/i.test(recentText))    facts.push('Guest is celebrating anniversary/honeymoon — prioritise romantic touches')
  if (/birthday/i.test(recentText))                 facts.push('Guest has a birthday — suggest celebration options')
  if (/corporate|team|work/i.test(recentText))      facts.push('Guest is on a corporate/team visit')
  if (/family|children|kids/i.test(recentText))     facts.push('Guest has family/children')

  // Preferences
  if (/spa|treatment|massage/i.test(recentText))    facts.push('Guest is interested in spa')
  if (/farm|animals|walk/i.test(recentText))        facts.push('Guest is interested in farm experiences')
  if (/penthouse|rooftop/i.test(recentText))        facts.push('Guest prefers higher-end rooms')
  if (/budget|cheap|affordable/i.test(recentText))  facts.push('Guest is price-conscious')

  if (facts.length > 0) {
    const existing = getMemory(sessionId)
    const combined = [...new Set([...existing.split('\n'), ...facts].filter(Boolean))]
    sessionMemory.set(sessionId, combined.slice(-8).join('\n')) // keep last 8 facts
  }
}

// ── Types ─────────────────────────────────────────────────────────────
interface Message {
  role:    'user' | 'assistant' | 'system'
  content: string
}

interface RequestBody {
  messages:  Message[]
  sessionId: string
  pathname:  string
}

// ── Tool Definitions ──────────────────────────────────────────────────
const MOXIE_TOOLS = [
  {
    type: 'function',
    function: {
      name: 'get_menu',
      description: 'Fetch current Ubuntu menu items. Call when guest asks about food, drinks, or specific dishes.',
      parameters: {
        type: 'object',
        properties: {
          section: {
            type:        'string',
            enum:        ['signature', 'village-kitchen'],
            description: 'Which menu section to fetch',
          },
          dietary: {
            type:        'string',
            description: 'Filter by dietary requirement e.g. vegetarian, vegan, gluten-free',
          },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'add_to_cart',
      description: 'Add an item to the guest cart. Call when guest explicitly asks to order or add something.',
      parameters: {
        type: 'object',
        properties: {
          itemId:   { type: 'string', description: 'Menu item ID from get_menu results' },
          itemName: { type: 'string', description: 'Human-readable item name' },
          price:    { type: 'number', description: 'Item price in KES' },
          qty:      { type: 'number', description: 'Quantity' },
          category: { type: 'string', description: 'Category: restaurant, spa, event, etc.' },
          tag:      { type: 'string', description: 'Display tag' },
          unit:     { type: 'string', description: 'Price unit e.g. / person' },
        },
        required: ['itemName', 'price', 'qty', 'category'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'create_reservation',
      description: 'Create a restaurant/spa/event reservation when all required details have been collected.',
      parameters: {
        type: 'object',
        properties: {
          type:      { type: 'string', enum: ['restaurant', 'spa', 'event', 'farm'] },
          time:      { type: 'string', description: 'Time of booking e.g. 7:30 PM' },
          date:      { type: 'string', description: 'Date if applicable' },
          guests:    { type: 'number', description: 'Number of guests' },
          guestName: { type: 'string', description: 'Guest name' },
          phone:     { type: 'string', description: 'Guest phone number' },
          notes:     { type: 'string', description: 'Special requests or notes' },
          eventName: { type: 'string', description: 'For events: name of the event' },
          ritual:    { type: 'string', description: 'For spa: ritual name' },
          price:     { type: 'number', description: 'Total price if known' },
        },
        required: ['type', 'guests'],
      },
    },
  },
]

// ── Anthropic API (fallback) ──────────────────────────────────────────
// Uses OpenAI-compatible format. Swap API key + model for Claude if preferred.

async function callLLM(
  messages: Message[],
  systemPrompt: string,
  tools: typeof MOXIE_TOOLS,
): Promise<{ text: string; toolCall?: { name: string; args: Record<string, unknown> } }> {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

  // ── Try OpenAI first ──
  if (OPENAI_API_KEY) {
    const body = {
      model:       'gpt-4o',
      max_tokens:  600,
      temperature: 0.7,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.slice(-12), // last 12 messages for context
      ],
      tools,
      tool_choice: 'auto',
    }

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) throw new Error(`OpenAI ${res.status}`)

    const data = await res.json()
    const choice = data.choices?.[0]

    if (choice?.message?.tool_calls?.[0]) {
      const tc = choice.message.tool_calls[0]
      return {
        text:     choice.message?.content || '',
        toolCall: {
          name: tc.function.name,
          args: JSON.parse(tc.function.arguments || '{}'),
        },
      }
    }

    return { text: choice?.message?.content || '' }
  }

  // ── Try Anthropic ──
  if (ANTHROPIC_API_KEY) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method:  'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-20250514',
        max_tokens: 600,
        system:     systemPrompt,
        messages:   messages.slice(-12),
      }),
    })

    if (!res.ok) throw new Error(`Anthropic ${res.status}`)
    const data = await res.json()
    return { text: data.content?.[0]?.text || '' }
  }

  // ── Fallback ──
  return {
    text: "The village is quiet right now — please reach us at hello@ubuntuecolodge.com and we'll respond promptly 🌿",
  }
}

// ── Route Handler ─────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { messages, sessionId, pathname }: RequestBody = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 })
    }

    // ── Detect intent from last user message ──
    const lastUser = messages.filter(m => m.role === 'user').at(-1)?.content?.toLowerCase() || ''

    const wantsMenu = /\b(menu|food|eat|dish|drink|tonight|dining|breakfast|lunch|dinner|what('s| is) (on|there)|cook)\b/.test(lastUser)
    const wantsSig  = /signature|tomahawk|wagyu|oxtail|perch/.test(lastUser)
    const wantsVeg  = /vegetarian|vegan|plant/i.test(lastUser)

    // ── Build context injection ──
    let menuContext = ''
    if (wantsMenu) {
      if (wantsSig) {
        menuContext = '\n\nCURRENT SIGNATURE MENU:\n' + getMenuSummaryForAI({ section: 'signature' })
      } else if (pathname.includes('restaurant') || wantsMenu) {
        const section = wantsSig ? 'signature' : undefined
        const dietary = wantsVeg ? 'vegetarian' : undefined
        menuContext = '\n\nCURRENT MENU:\n' + getMenuSummaryForAI({ section, dietary })
      }
    }

    // ── Fetch guest memory ──
    const memory    = getMemory(sessionId)
    const currentHr = new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })

    // ── Build enriched system prompt ──
    const systemPrompt = buildSystemPrompt({
      pathname,
      guestMemory: memory || undefined,
      currentTime: currentHr,
    }) + menuContext

    // ── Call LLM ──
    const { text, toolCall } = await callLLM(
      messages as Message[],
      systemPrompt,
      MOXIE_TOOLS,
    )

    // If the model requested a tool call, attempt to execute it server-side
    let toolResult: any = null
    if (toolCall && toolCall.name) {
      try {
        if (toolCall.name === 'get_menu') {
          const section = (toolCall.args as any)?.section
          toolResult = { items: getMenuSummaryForAI({ section }) }
        } else if (toolCall.name === 'add_to_cart') {
          const args = toolCall.args as any
          const res = await tools.tool_add_menu_to_cart({ query: args.itemName || args.itemId, qty: args.qty || 1 })
          toolResult = res
        } else if (toolCall.name === 'create_reservation') {
          const args = toolCall.args as any
          const res = await tools.tool_create_reservation({
            name: args.guestName || args.name,
            phone: args.phone,
            time: args.time,
            date: args.date,
            guests: args.guests,
            notes: args.notes,
            type: args.type,
          })
          toolResult = res
        }
      } catch (err) {
        console.error('[Moxie API] tool execution error', err)
        toolResult = { ok: false, error: 'Tool execution failed' }
      }
    }

    // ── Update session memory from conversation ──
    updateMemory(sessionId, messages as Message[])

    // ── Build response ──
    const responseText = text || getFallbackResponse(lastUser)

    return NextResponse.json({
      content:  responseText,
      toolCall: toolCall || null,
      toolResult: toolResult || null,
      sessionId,
    })

  } catch (err) {
    console.error('[Moxie API] Error:', err)
    return NextResponse.json({
      content: "Something stirred unexpectedly in the village. Please try again, or reach us at hello@ubuntuecolodge.com 🌿",
    })
  }
}

// ── Fallback responses (when no API key is set) ───────────────────────
function getFallbackResponse(lastUser: string): string {
  const low = lastUser.toLowerCase()

  if (/cottage|room|stay|sleep/i.test(low)) {
    return "We have 15 accommodations — from the intimate Pokomo Cottages (from KES 5,000 / person) to rooftop penthouses (from KES 9,000). Which would you like to explore? 🌿"
  }
  if (/menu|food|eat|dine/i.test(low)) {
    return "The Signature Restaurant is live tonight — fire-grilled meats, farm-caught fish, and harvest plates from our fields. The Village Kitchen runs all day. What are you in the mood for? 🌙"
  }
  if (/spa|treatment|massage|ritual/i.test(low)) {
    return "The Arohamai Spa has three ritual slots open today — a forest immersion, red clay wrap, and couples sound healing. Which calls to you?"
  }
  if (/farm|animal|walk|chicken/i.test(low)) {
    return "The farm is alive right now — 24 animals, six crop fields, and a Sunrise Walk on Tuesday and Saturday at 6 AM (KES 2,800 / person). Shall I add a walk to your stay?"
  }
  if (/event|wedding|fire|circle|harvest dinner/i.test(low)) {
    return "This month's Harvest Dinner is the last Saturday (KES 12,500 / person, 8 spots remaining). The New Moon Fire Circle is a standing experience each month at KES 1,500. Which interests you?"
  }
  if (/price|cost|rate|how much/i.test(low)) {
    return "Cottages start from KES 5,000 per person. Farmhouse rooms from KES 7,500. Penthouses from KES 9,000. All include access to the pool, gym, and farm. What kind of stay are you planning?"
  }
  if (/book|reserve|table|reservation/i.test(low)) {
    return "I can help arrange that. What time would you like, and for how many guests? 🌙"
  }

  return "I'm here for the village 🌿 Ask me about dining, accommodation, the spa, farm experiences, or events — or say 'book a table' to make a reservation."
}