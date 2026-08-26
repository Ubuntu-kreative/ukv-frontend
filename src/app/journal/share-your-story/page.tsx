/**
 * src/app/journal/share-your-story/page.tsx
 *
 * Guest story submission form
 * Allows guests to submit their ubuntu experience
 */

'use client'

import React, { useState } from 'react'
import Link from 'next/link'

interface SubmissionFormData {
  name: string
  email: string
  country: string
  visitType: 'retreat' | 'wellness' | 'accommodation' | 'events' | 'community'
  story: string
  allowPublish: boolean
}

export default function ShareYourStoryPage() {
  const [formData, setFormData] = useState<SubmissionFormData>({
    name: '',
    email: '',
    country: '',
    visitType: 'retreat',
    story: '',
    allowPublish: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const response = await fetch('/api/guest-stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to submit story')
      }

      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        country: '',
        visitType: 'retreat',
        story: '',
        allowPublish: true,
      })

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000)
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="w-full bg-white">
      {/* Hero */}
      <section className="px-4 sm:px-6 md:px-8 lg:px-12 py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">Share Your Ubuntu Story</h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Your experience matters. Share how Ubuntu transformed you, what you learned, and what ubuntu means
            to you. Your story helps others discover the healing and connection that's possible here.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="px-4 sm:px-6 md:px-8 lg:px-12 py-12 md:py-20">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            {/* Country */}
            <div>
              <label htmlFor="country" className="block text-sm font-semibold text-gray-900 mb-2">
                Country/Region
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Where are you from?"
              />
            </div>

            {/* Visit Type */}
            <div>
              <label htmlFor="visitType" className="block text-sm font-semibold text-gray-900 mb-2">
                What Did You Experience? *
              </label>
              <select
                id="visitType"
                name="visitType"
                value={formData.visitType}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="retreat">Creative/Wellness Retreat</option>
                <option value="wellness">Wellness & Spa Services</option>
                <option value="accommodation">Accommodation Stay</option>
                <option value="events">Events & Gatherings</option>
                <option value="community">Community Connection</option>
              </select>
            </div>

            {/* Story */}
            <div>
              <label htmlFor="story" className="block text-sm font-semibold text-gray-900 mb-2">
                Your Story *
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Share what ubuntu meant to you, how it transformed you, your favorite memory, or what you learned
                here. Be authentic. Be vulnerable. Your truth helps others.
              </p>
              <textarea
                id="story"
                name="story"
                value={formData.story}
                onChange={handleChange}
                required
                rows={12}
                maxLength={2000}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-sans resize-none"
                placeholder="Write your story here..."
              />
              <p className="text-xs text-gray-500 mt-2">
                {formData.story.length} / 2000 characters
              </p>
            </div>

            {/* Privacy */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="allowPublish"
                  checked={formData.allowPublish}
                  onChange={handleChange}
                  className="mt-1"
                />
                <span className="text-sm text-gray-700">
                  <p className="font-semibold mb-1">I'm okay with my story being published</p>
                  <p className="text-gray-600">
                    Your story will be moderated and could be featured on our Voices of Ubuntu page to inspire
                    others. We'll use your first name only. If you prefer to keep your story private, we'll still
                    treasure it as community feedback.
                  </p>
                </span>
              </label>
            </div>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <p className="text-emerald-900 font-semibold mb-2">✓ Story Submitted Successfully</p>
                <p className="text-emerald-800">
                  Thank you for sharing your Ubuntu story. We'll review it and be in touch within 3-5 business
                  days. Your vulnerability and authenticity inspire our community.
                </p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-red-900 font-semibold mb-2">Error Submitting Story</p>
                <p className="text-red-800">{errorMessage}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || submitStatus === 'success'}
              className="w-full px-8 py-4 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Submitting...' : submitStatus === 'success' ? 'Submitted! ✓' : 'Share My Story'}
            </button>

            {/* Privacy Notice */}
            <p className="text-xs text-gray-500 text-center">
              We respect your privacy. Your email will only be used to contact you about your submission.
            </p>
          </form>

          {/* Inspiration */}
          <div className="mt-16 pt-16 border-t border-gray-200">
            <h2 className="text-2xl font-serif text-gray-900 mb-6">Inspiration</h2>
            <p className="text-gray-600 mb-4">Not sure what to write? Here are some prompts:</p>
            <ul className="space-y-3 text-gray-600">
              <li className="flex gap-3">
                <span className="text-emerald-600 font-bold">•</span>
                <span>How did you feel when you first arrived at Ubuntu?</span>
              </li>
              <li className="flex gap-3">
                <span className="text-emerald-600 font-bold">•</span>
                <span>What's the most meaningful moment from your stay?</span>
              </li>
              <li className="flex gap-3">
                <span className="text-emerald-600 font-bold">•</span>
                <span>How has your life changed since visiting Ubuntu?</span>
              </li>
              <li className="flex gap-3">
                <span className="text-emerald-600 font-bold">•</span>
                <span>What does ubuntu (I am because we are) mean to you now?</span>
              </li>
              <li className="flex gap-3">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Would you return? Why or why not?</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  )
}
