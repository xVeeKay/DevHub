'use client'

import { Github } from 'lucide-react'
import Image from 'next/image'

export const Footer = () => {
  return (
    <footer className="relative border-t border-white/10 mt-20">
      {/* subtle background blend */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-zinc-900/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* TOP SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* LEFT */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Image
                src="/logo(transparent).png"
                alt="DevHub"
                width={28}
                height={28}
              />
              <span className="text-white font-semibold text-lg">DevHub</span>
            </div>

            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
              Built to simplify developer workflows — from project creation to
              team collaboration.
            </p>
          </div>

          {/* CENTER (EMPTY FOR BALANCE) */}
          <div className="hidden md:block" />

          {/* RIGHT */}
          <div className="flex md:justify-end">
            <a
              href="https://github.com/xVeeKay"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm text-zinc-300"
            >
              <Github className="w-4 h-4" />
              View on GitHub
            </a>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="my-6 h-px bg-white/10" />

        {/* BOTTOM */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <p>© 2026 DevHub</p>
          <p>Built for learning & placement readiness</p>
        </div>
      </div>
    </footer>
  )
}
