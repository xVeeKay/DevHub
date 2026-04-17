'use client'

import { ArrowRightIcon, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CTA() {
  return (
    <section className="relative py-16 md:py-24 text-white">
      {/* FULL WIDTH STRIPE BACKGROUND */}
      <div
        className="absolute inset-0 -z-20 
    bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),
        linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)]
    bg-[size:40px_40px]
    opacity-20
  "
      />

      <div className="mx-auto max-w-5xl px-6">
        <div
          className="
      relative
      rounded-3xl
      border border-white/10
      bg-white/[0.03]
      backdrop-blur-xl
      px-6 py-10 md:px-12 md:py-14
    "
        >
          {/* subtle glow */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_60%)]" />

          {/* corner accents (cleaned up) */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-white/20 rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-white/20 rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-white/20 rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-white/20 rounded-br-xl" />
          </div>

          {/* CONTENT */}
          <div className="max-w-2xl mx-auto">
            {/* badge */}
            <div className="mb-4 flex justify-center">
              <span className="flex items-center gap-2 px-3 py-1 text-xs text-zinc-400 border border-white/10 rounded-full bg-white/5">
                <Sparkles className="w-3 h-3" />
                DevHub is ready
              </span>
            </div>

            {/* heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
              Build faster with your team
            </h2>

            {/* subtext */}
            <p className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed">
              Stop juggling tools. DevHub brings your projects, tasks, and
              collaboration into one clean workflow.
            </p>

            {/* buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              {/* Primary */}
              <a href="/signin">
                <Button className="px-6 py-2.5 rounded-full text-sm flex items-center gap-2">
                  Start Building
                  <ArrowRightIcon className="w-4 h-4" />
                </Button>
              </a>

              {/* Secondary */}
              <a href="#demo">
                <Button
                  variant="outline"
                  className="px-6 py-2.5 rounded-full text-sm border-white/20 bg-white/5 hover:bg-white/10"
                >
                  View Live Demo
                </Button>
              </a>
            </div>

            {/* micro trust line */}
            <p className="mt-4 text-xs text-zinc-500">
              No setup. No complexity. Just your workflow, simplified.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}