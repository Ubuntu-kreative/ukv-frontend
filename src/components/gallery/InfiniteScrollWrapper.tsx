'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { motion } from 'framer-motion'

interface InfiniteScrollWrapperProps {
  children: React.ReactNode
  onLoadMore: () => void
  isLoading?: boolean
  hasMore?: boolean
  threshold?: number
}

/**
 * Infinite scroll/load more wrapper
 * - Intersection Observer for detecting when to load more
 * - Loading spinner
 * - "Load More" button fallback
 */
export function InfiniteScrollWrapper({
  children,
  onLoadMore,
  isLoading = false,
  hasMore = true,
  threshold = 0.5,
}: InfiniteScrollWrapperProps) {
  const sentryRef = useRef<HTMLDivElement>(null)
  const [showLoadMoreButton, setShowLoadMoreButton] = useState(false)

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!sentryRef.current || !hasMore) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading && hasMore) {
          onLoadMore()
        }
      },
      { threshold }
    )

    observer.observe(sentryRef.current)

    return () => {
      if (sentryRef.current) {
        observer.unobserve(sentryRef.current)
      }
    }
  }, [onLoadMore, isLoading, hasMore, threshold])

  return (
    <div>
      {children}

      {/* Infinite scroll sentinel */}
      {hasMore && (
        <motion.div
          ref={sentryRef}
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '40px 20px',
            minHeight: '60px',
          }}
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{
                width: 32,
                height: 32,
                border: '2px solid rgba(255,255,255,0.2)',
                borderTop: '2px solid rgba(255,255,255,0.8)',
                borderRadius: '50%',
              }}
            />
          ) : (
            <button
              onClick={() => onLoadMore()}
              style={{
                padding: '12px 32px',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.05)',
                color: 'rgba(255,255,255,0.8)',
                borderRadius: 8,
                fontSize: '14px',
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement
                el.style.borderColor = 'rgba(255,255,255,0.4)'
                el.style.background = 'rgba(255,255,255,0.1)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement
                el.style.borderColor = 'rgba(255,255,255,0.2)'
                el.style.background = 'rgba(255,255,255,0.05)'
              }}
            >
              Load More Photos
            </button>
          )}
        </motion.div>
      )}

      {/* End of gallery message */}
      {!hasMore && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: 'rgba(255,255,255,0.3)',
          }}
        >
          <p style={{
            fontSize: '1rem',
            marginBottom: 8,
          }}>
            You've reached the end of the gallery.
          </p>
          <p style={{
            fontSize: '0.9rem',
            opacity: 0.7,
          }}>
            Thank you for exploring Ubuntu Kreative Village.
          </p>
        </motion.div>
      )}
    </div>
  )
}
