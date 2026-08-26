/**
 * src/app/api/guest-stories/route.ts
 * 
 * Handle guest story submissions
 * Stores submissions safely for moderation review
 */

import { NextRequest, NextResponse } from 'next/server'

interface GuestStorySubmission {
  name: string
  email: string
  country?: string
  visitType: 'retreat' | 'wellness' | 'accommodation' | 'events' | 'community'
  story: string
  allowPublish: boolean
}

export async function POST(request: NextRequest) {
  try {
    const body: GuestStorySubmission = await request.json()

    // Validation
    if (!body.name || !body.email || !body.story) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (body.story.length < 50) {
      return NextResponse.json(
        { message: 'Story must be at least 50 characters' },
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

    // TODO: In production, this would:
    // 1. Store to database (Supabase, MongoDB, etc.)
    // 2. Send confirmation email to guest
    // 3. Send notification to admin for moderation
    // 4. Integrate with CMS for easy moderation

    // For now, log the submission
    console.log('📝 Guest Story Submission:', {
      name: body.name,
      email: body.email,
      country: body.country || 'Not provided',
      visitType: body.visitType,
      storyLength: body.story.length,
      allowPublish: body.allowPublish,
      timestamp: new Date().toISOString(),
    })

    // Send success response
    return NextResponse.json(
      {
        message: 'Story submitted successfully',
        id: `guest-story-${Date.now()}`,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Guest story submission error:', error)
    return NextResponse.json(
      { message: 'Failed to process submission' },
      { status: 500 }
    )
  }
}
