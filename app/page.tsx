'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Github } from 'lucide-react'
import { Background } from '@/components/Background'
import Image from 'next/image'
import { Features } from '@/components/LandingPage/devhub-features'
import { TechStack } from '@/components/LandingPage/TechStack'
import { Workflow } from '@/components/LandingPage/Workflow'
import { WhyDevHub } from '@/components/LandingPage/WhyDevHub'
import { CTA } from '@/components/LandingPage/CTA'
import { Footer } from '@/components/LandingPage/Footer'

// ---------- NAVBAR ----------
const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 w-full z-50 px-4 sm:px-6 py-3">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/logo(transparent).png"
            alt="DevHub Logo"
            width={28}
            height={28}
          />
          <span className="text-sm sm:text-lg font-semibold text-white">
            DevHub
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href="https://github.com/xVeeKay"
            target="_blank"
            className="p-2 rounded-full hover:bg-white/10 transition"
          >
            <Github className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-300" />
          </a>

          <a href="/signin" className="hidden sm:block">
            <button className="text-sm text-zinc-300 hover:text-white">
              Sign in
            </button>
          </a>

          <a href="/register">
            <button className="px-4 py-2 rounded-full bg-white text-black text-xs sm:text-sm">
              Register
            </button>
          </a>
        </div>
      </nav>
    </div>
  )
}

// ---------- HERO ----------
const Hero = () => {
  return (
    <div className="flex flex-col items-center text-center px-4 pt-24 md:pt-32 pb-10">
      <div className="mb-4 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-zinc-400">
        Built for developers
      </div>

      <h1 className="text-3xl sm:text-4xl md:text-6xl font-semibold max-w-3xl text-white">
        Build together. Ship faster.
      </h1>

      <p className="mt-4 max-w-xl text-zinc-300 text-sm md:text-base">
        DevHub helps you manage projects, collaborate in real-time,
        and simplify your workflow.
      </p>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <a href='/signin'>
          <button className="px-6 py-2.5 rounded-full bg-white text-black text-sm">
          Get Started
        </button>
        </a>

        <button className="px-6 py-2.5 rounded-full border border-white/10 bg-white/5 text-white text-sm">
          View Demo
        </button>
      </div>
    </div>
  )
}

// ---------- SCROLL ----------
const ContainerScroll = ({
  titleComponent,
  children,
}: any) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref })

  const rotate = useTransform(scrollYProgress, [0, 1], [12, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1.03, 1])

  return (
    <div
      ref={ref}
      className="min-h-[45rem] md:min-h-[60rem] flex flex-col items-center"
    >
      {titleComponent}

      <motion.div
        style={{ rotateX: rotate, scale }}
        className="w-full max-w-6xl mx-auto mt-6 h-[18rem] sm:h-[24rem] md:h-[32rem] border border-white/10 bg-[#111] rounded-2xl overflow-hidden"
      >
        {children}
      </motion.div>
    </div>
  )
}

// ---------- PREVIEW ----------
const Preview = () => (
  <img
    src="/devhub-preview.png"
    className="w-full h-full object-cover"
  />
)

// ---------- MAIN ----------
export default function Page() {
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <Navbar />

      {/* HERO WITH VIDEO */}
      <div className="relative">
        <Background /> {/* ✅ ONLY HERE */}
        <div className="relative z-10">
          <ContainerScroll titleComponent={<Hero />}>
            <Preview />
          </ContainerScroll>
        </div>
      </div>

      {/* REST WITHOUT VIDEO */}
      <div className="relative z-10 bg-black">
        <Features />
        <TechStack />
        <Workflow />
        <WhyDevHub/>
        <CTA/>
        <Footer/>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </div>
  )
}