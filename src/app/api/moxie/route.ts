// src/app/api/moxie/route.ts

import { streamText } from 'ai'
import { openai, MOXIE_MODEL } from '@/lib/openai'
import { SYSTEM_PROMPT } from '@/lib/moxie/systemPrompt'
import { getUbuntuCMSContext } from '@/lib/sanity/moxieContext'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}

export async function GET() {
  return Response.json({ success: true, message: 'Moxie API Ready' }, { headers: CORS })
}

export async function POST(req: Request) {
  try {
    let jsonPayload: any
    try {
      jsonPayload = await req.json()
    } catch {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400, headers: CORS })
    }

    const messages = jsonPayload.messages || []
    const pathname = jsonPayload.pathname || jsonPayload.body?.pathname || '/'
    const sessionId = jsonPayload.sessionId || jsonPayload.body?.sessionId || undefined

    if (!Array.isArray(messages)) {
      return Response.json({ error: '`messages` must be an array' }, { status: 400, headers: CORS })
    }

    const liveCmsContext = await getUbuntuCMSContext()

    const contextNote = `\n\n` +
      `${liveCmsContext}\n\n` +
      `Current page context: Guest is currently browsing "${pathname}". ` +
      `Tailor your response smoothly to what they are looking at.` +
      (sessionId ? ` User Session ID: ${sessionId}.` : '')

    const systemWithContext = SYSTEM_PROMPT + contextNote

    // ── EXECUTE STREAM ────────────────────────────────────────────────
    const result = await streamText({
      model:       openai(MOXIE_MODEL),
      system:      systemWithContext,
      messages:    messages as Parameters<typeof streamText>[0]['messages'],
      temperature: 0.72,
      maxTokens:   800,
    })

    // Safely extract the standard format response wrapper
    const streamResponse = result.toDataStreamResponse()

    // Append necessary CORS headers safely
    const headers = new Headers(streamResponse.headers)
    Object.entries(CORS).forEach(([k, v]) => headers.set(k, v))

    return new Response(streamResponse.body, {
      status:  streamResponse.status,
      headers,
    })

  } catch (err) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred'
    console.error('[Moxie API Error]', message)

    return Response.json(
      {
        error: 'Moxie is temporarily offline checking farm updates.',
        detail: process.env.NODE_ENV !== 'production' ? message : undefined,
      },
      { status: 500, headers: CORS }
    )
  }
} // ◄── Everything closes perfectly here now!