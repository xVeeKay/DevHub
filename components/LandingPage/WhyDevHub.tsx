'use client'

import Image from 'next/image'

export function WhyDevHub() {
  return (
    <section className="relative py-20 md:py-28 text-white">
      {/* background blend */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-zinc-900/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* LEFT → TEXT */}
          <div className="max-w-xl">
            {/* label */}
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-5">
              Why DevHub
            </p>

            {/* heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-[1.1] tracking-tight">
              Built from real developer problems —
              <span className="text-zinc-400"> not assumptions.</span>
            </h2>

            {/* short + sharp paragraph */}
            <p className="mt-5 text-zinc-400 text-sm sm:text-base leading-relaxed">
              DevHub started as a learning project, but quickly revealed a real
              gap — development workflows are scattered, messy, and inefficient.
            </p>

            {/* clean bullet points */}
            <div className="mt-7 space-y-4">
              {points.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/70" />
                  <p className="text-sm text-zinc-400">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT → IMAGE */}
          <div className="relative w-full">
            <div
              className="
              relative rounded-xl md:rounded-2xl overflow-hidden
              border border-white/10 bg-white/5 backdrop-blur-xl
              shadow-[0_20px_80px_rgba(0,0,0,0.6)]
            "
            >
              {/* glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-white/10 via-transparent to-white/10 opacity-40 blur-2xl" />

              {/* image */}
              <Image
                src="/devhub-preview (2).png"
                alt="DevHub workspace preview"
                width={1400}
                height={900}
                className="
                  relative w-full h-auto object-cover
                  scale-[1.02]
                "
                priority
              />

              {/* bottom fade */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const points = [
  'Designed around actual dev workflows, not templates.',
  'Focused on clarity and speed — no unnecessary features.',
  'Built while learning and evolving with real usage.',
  'Solves real collaboration friction developers face daily.',
]
