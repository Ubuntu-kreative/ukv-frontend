// src/lib/openai.ts
// ─────────────────────────────────────────────────────────────────────
// Ubuntu Kreative Village — OpenAI client (Production v3)
//
// FIXED CORES: Corrects function factory nesting mismatch preventing 
//              Vercel AI SDK streamText from executing.
// ─────────────────────────────────────────────────────────────────────

import { createOpenAI } from '@ai-sdk/openai'

// ── Safe client factory ───────────────────────────────────────────────
function getApiKey(): string {
  const key = process.env.OPENAI_API_KEY
  if (!key) {
    throw new Error(
      '[Moxie] OPENAI_API_KEY is not set. ' +
      'Add it to your Vercel project environment variables.'
    )
  }
  return key
}

// ── Lazy client wrapper ──────────────────────────────────────────────
let _client: ReturnType<typeof createOpenAI> | null = null

function getClient() {
  if (!_client) {
    _client = createOpenAI({ apiKey: getApiKey() })
  }
  return _client
}

// ── Production Stable Model Tags ─────────────────────────────────────
export const MOXIE_MODEL = 'gpt-4o'           // Primary model
export const MOXIE_MODEL_MINI = 'gpt-4o-mini' // Lower cost fallback

/**
 * Public function factory used directly by your route.ts handler.
 * Usage in route.ts: model: openai(MOXIE_MODEL)
 */
export function openai(modelName: string) {
  const clientInstance = getClient()
  // Correctly returns the executable Vercel AI SDK Language Model instance
  return clientInstance(modelName)
}

export default openai