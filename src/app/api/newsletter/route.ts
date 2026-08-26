/**
 * src/app/api/newsletter/route.ts
 * 
 * Handle newsletter email subscriptions
 * Validates emails and prepares for integration with email marketing platform
 */

import { NextRequest, NextResponse } from 'next/server'

interface NewsletterSubscription {
  email: string
  name?: string
  interests?: string[]
}

// Simple in-memory store for demo (replace with database in production)
const subscribers = new Set<string>()

export async function POST(request: NextRequest) {
  try {
    const body: NewsletterSubscription = await request.json()

    // Validation
    if (!body.email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { message: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Check for duplicates
    if (subscribers.has(body.email)) {
      return NextResponse.json(
        { message: 'Email already subscribed' },
        { status: 409 }
      )
    }

    // TODO: In production, this would:
    // 1. Store to database with subscription date, interests, source
    // 2. Integrate with email marketing platform (Mailchimp, SendGrid, Brevo, etc.)
    // 3. Send double-opt-in confirmation email
    // 4. Add spam protection (honeypot, rate limiting)
    // 5. Log for analytics

    // Add to store
    subscribers.add(body.email)

    // Log subscription
    console.log('📧 Newsletter Subscription:', {
      email: body.email,
      name: body.name || 'Not provided',
      interests: body.interests || [],
      timestamp: new Date().toISOString(),
      totalSubscribers: subscribers.size,
    })

    // Send success response
    return NextResponse.json(
      {
        message: 'Successfully subscribed to Ubuntu Journal newsletter',
        email: body.email,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { message: 'Failed to process subscription' },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Health check endpoint
  return NextResponse.json({
    status: 'ok',
    subscribers: subscribers.size,
  })
}
