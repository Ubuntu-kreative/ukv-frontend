'use client'
// ─────────────────────────────────────────────────────────────────────────────
// VideoPlayer — unified player for YouTube embeds + direct video files
// Used inside ImmersiveExhibit and the hero section.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Types ─────────────────────────────────────────────────────────────────

export type VideoSource = {
  directUrl?: string   // .mp4 / .webm / .ogg
  youtubeId?: string   // YouTube video ID only (not full URL)
  poster?: string      // Poster / thumbnail for direct video
  label?: string       // Optional caption
}

type Props = VideoSource & {
  accent?: string
  /** Aspect ratio of the player container. Default 16/9. */
  aspectRatio?: string
  /** If true, autoplay muted (for hero backgrounds). Default false. */
  autoplay?: boolean
  /** If true, loop (for hero backgrounds). Default false. */
  loop?: boolean
  /** If true, show muted controls (for hero backgrounds). Default false. */
  ambientMode?: boolean
  className?: string
}

// ─── YouTube embed ──────────────────────────────────────────────────────────

function YouTubePlayer({
  youtubeId,
  accent,
  autoplay,
  loop,
  ambientMode,
}: {
  youtubeId: string
  accent: string
  autoplay?: boolean
  loop?: boolean
  ambientMode?: boolean
}) {
  const [started, setStarted] = useState(autoplay || ambientMode || false)
  const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`

  const params = new URLSearchParams({
    autoplay: started ? '1' : '0',
    mute: ambientMode ? '1' : '0',
    loop: loop ? '1' : '0',
    playlist: loop ? youtubeId : '',
    controls: ambientMode ? '0' : '1',
    modestbranding: '1',
    rel: '0',
    showinfo: '0',
    color: 'white',
  })

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {started ? (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?${params.toString()}`}
          title="Exhibit video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
        />
      ) : (
        // Thumbnail + play button overlay
        <div
          onClick={() => setStarted(true)}
          style={{
            width: '100%', height: '100%',
            cursor: 'pointer', position: 'relative', overflow: 'hidden',
          }}
        >
          <img
            src={thumbnailUrl}
            alt="Video thumbnail"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={(e) => {
              // Fallback to lower-quality thumbnail if maxres isn't available
              ;(e.target as HTMLImageElement).src =
                `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
            }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.38)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: 68, height: 68, borderRadius: '50%',
                background: `${accent}ee`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 0 40px ${accent}55`,
              }}
            >
              {/* Play triangle */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#050805">
                <path d="M8 5v14l11-7z" />
              </svg>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Direct video player ────────────────────────────────────────────────────

function DirectVideoPlayer({
  directUrl,
  poster,
  accent,
  autoplay,
  loop,
  ambientMode,
}: {
  directUrl: string
  poster?: string
  accent: string
  autoplay?: boolean
  loop?: boolean
  ambientMode?: boolean
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(autoplay || ambientMode || false)
  const [muted, setMuted] = useState(ambientMode || false)
  const [showControls, setShowControls] = useState(false)

  function togglePlay() {
    const v = videoRef.current
    if (!v) return
    if (v.paused) { v.play(); setPlaying(true) }
    else { v.pause(); setPlaying(false) }
  }

  function toggleMute() {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  return (
    <div
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={directUrl}
        poster={poster}
        autoPlay={autoplay || ambientMode}
        muted={ambientMode || muted}
        loop={loop}
        playsInline
        controls={false}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      {/* Custom controls overlay — hidden in ambient mode */}
      {!ambientMode && (
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)',
                display: 'flex', alignItems: 'flex-end',
                padding: '16px 18px',
                gap: 12,
              }}
            >
              {/* Play/pause */}
              <button
                onClick={togglePlay}
                style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: `${accent}cc`,
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {playing ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#050805">
                    <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#050805">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              {/* Mute toggle */}
              <button
                onClick={toggleMute}
                style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.12)',
                  border: `1px solid ${accent}33`,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {muted ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={accent}>
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                    <line x1="1" y1="1" x2="23" y2="23" stroke={accent} strokeWidth="2"/>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={accent}>
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </svg>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Big play button when paused and not ambient */}
      {!ambientMode && !playing && (
        <div
          onClick={togglePlay}
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: 68, height: 68, borderRadius: '50%',
              background: `${accent}ee`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 40px ${accent}55`,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#050805">
              <path d="M8 5v14l11-7z" />
            </svg>
          </motion.div>
        </div>
      )}
    </div>
  )
}

// ─── Main export ─────────────────────────────────────────────────────────────

export function VideoPlayer({
  directUrl,
  youtubeId,
  poster,
  label,
  accent = '#D4A853',
  aspectRatio = '16 / 9',
  autoplay = false,
  loop = false,
  ambientMode = false,
}: Props) {
  const hasVideo = !!(directUrl || youtubeId)
  if (!hasVideo) return null

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          width: '100%',
          aspectRatio,
          borderRadius: ambientMode ? 0 : 12,
          overflow: 'hidden',
          position: 'relative',
          background: '#050805',
          border: ambientMode ? 'none' : `1px solid ${accent}22`,
          boxShadow: ambientMode ? 'none' : `0 0 60px ${accent}18`,
        }}
      >
        {youtubeId ? (
          <YouTubePlayer
            youtubeId={youtubeId}
            accent={accent}
            autoplay={autoplay}
            loop={loop}
            ambientMode={ambientMode}
          />
        ) : directUrl ? (
          <DirectVideoPlayer
            directUrl={directUrl}
            poster={poster}
            accent={accent}
            autoplay={autoplay}
            loop={loop}
            ambientMode={ambientMode}
          />
        ) : null}
      </div>

      {label && !ambientMode && (
        <p style={{
          marginTop: 10,
          fontFamily: 'var(--font-body)',
          fontSize: '9px',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.28)',
          textAlign: 'center',
        }}>
          {label}
        </p>
      )}
    </div>
  )
}