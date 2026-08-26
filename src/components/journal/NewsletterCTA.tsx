/**
 * src/components/journal/NewsletterCTA.tsx
 *
 * Newsletter signup section
 */

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Check } from 'lucide-react'

export default function NewsletterCTA() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: Implement actual newsletter subscription
      // This would call your newsletter API endpoint
      await new Promise(resolve => setTimeout(resolve, 500))
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    } catch (error) {
      console.error('Subscription error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.section
      className="py-20 px-6 md:px-12 bg-gradient-to-r from-emerald-50 to-blue-50 border-y border-gray-200"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="max-w-3xl mx-auto text-center">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-2">Join us</p>
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">Join the Ubuntu Circle</h2>
          <p className="text-gray-600 text-lg">
            Receive curated stories, travel inspiration, events, and exclusive offers directly to your inbox.
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubscribe}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="flex-1 relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all disabled:opacity-50"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading || subscribed}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              subscribed
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg'
            }`}
          >
            {subscribed ? (
              <>
                <Check size={20} />
                Subscribed!
              </>
            ) : loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Subscribing...
              </>
            ) : (
              'Subscribe'
            )}
          </motion.button>
        </motion.form>

        {/* Trust indicator */}
        <p className="text-sm text-gray-500 mt-4">No spam. Unsubscribe anytime.</p>
      </div>
    </motion.section>
  )
}
