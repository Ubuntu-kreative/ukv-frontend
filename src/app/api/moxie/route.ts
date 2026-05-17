import { streamText } from 'ai'
import { openai } from '@/lib/openai'
import { SYSTEM_PROMPT } from '@/lib/moxie/systemPrompt'

export async function GET() {
  return Response.json({
    success: true,
    message: 'Moxie API is alive',
  })
}

export async function POST(req: Request) {
  const { messages, pathname, sessionId } = await req.json()

  const result = streamText({
    model: openai('gpt-4.1'),

    system: SYSTEM_PROMPT,

    messages,

    temperature: 0.7,
  })

  return result.toDataStreamResponse()
}