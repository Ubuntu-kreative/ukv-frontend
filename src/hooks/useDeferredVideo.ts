import { useEffect, type RefObject } from 'react'

export function useDeferredVideo(
  videoRef: RefObject<HTMLVideoElement | null>,
  src: string,
) {
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const loadVideo = () => {
      video.src = src
      video.load()
      video.play().catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'NotAllowedError') return
        console.error(`Deferred video failed to play (${src}):`, error)
      })
    }

    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(loadVideo, { timeout: 3000 })
      return () => window.cancelIdleCallback(id)
    }

    const id = setTimeout(loadVideo, 1500)
    return () => clearTimeout(id)
  }, [src, videoRef])
}
