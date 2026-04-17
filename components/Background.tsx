'use client'

import { useEffect, useRef } from 'react'
import Hls from 'hls.js'

export const Background = () => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    const src =
      'https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8'

    if (!video) return

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src
    } else if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(src)
      hls.attachMedia(video)
    }

    video.muted = true
    video.play().catch(() => {})
  }, [])

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* LIGHT BASE DIM (very subtle) */}
      <div className="absolute inset-0 bg-black/30" />

      {/* TOP FOCUS GRADIENT (main magic) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent" />

      {/* VERY SUBTLE BOTTOM FADE */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/50 to-transparent" />
    </div>
  )
}
