'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  Github,
  ArrowRight,
  Layers,
  Zap,
  Users,
  ShieldCheck,
  MessageSquare,
  Database,
  Code2,
  Globe,
  Lock,
  Menu,
  X,
  Play,
} from 'lucide-react'

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-md border-b border-border' : 'bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl tracking-tighter"
          >
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <Layers size={20} />
            </div>
            DevHub
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
            <Link
              href="#features"
              className="hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#workflow"
              className="hover:text-foreground transition-colors"
            >
              Workflow
            </Link>
            <Link
              href="#tech"
              className="hover:text-foreground transition-colors"
            >
              Tech Stack
            </Link>
            <Link
              href="https://github.com/xVeeKay"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              GitHub <Github size={14} />
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/signin"
            className="hidden sm:block text-sm font-medium text-zinc-400 hover:text-foreground transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="bg-primary hover:opacity-90 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-lg shadow-primary/20"
          >
            Get Started
          </Link>
          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-background border-b border-border p-6 flex flex-col gap-4 animate-in slide-in-from-top-5">
          <Link href="#features" onClick={() => setMobileMenuOpen(false)}>
            Features
          </Link>
          <Link href="#workflow" onClick={() => setMobileMenuOpen(false)}>
            Workflow
          </Link>
          <Link href="#tech" onClick={() => setMobileMenuOpen(false)}>
            Tech Stack
          </Link>
          <hr className="border-border" />
          <Link href="/login">Log in</Link>
        </div>
      )}
    </nav>
  )
}

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 blur-[120px] -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6 tracking-wide uppercase">
            🚀 Personal Project Spotlight
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-zinc-500">
            The workspace for <br /> modern developers.
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Collaborative developer workspace with Kanban boards, real-time
            updates, and project management. Built for speed and focus.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link
              href="/register"
              className="w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 group transition-all hover:scale-105 shadow-xl shadow-primary/20"
            >
              Get Started for free{' '}
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <Link
              href="#demo"
              className="w-full sm:w-auto bg-card border border-border text-foreground px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-zinc-900 transition-all"
            >
              View Demo <Play size={16} />
            </Link>
          </div>
        </motion.div>

        {/* Product Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mx-auto max-w-5xl group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-[2rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000" />
          <div className="relative rounded-2xl border border-border bg-card overflow-hidden shadow-2xl md:rotate-x-12 perspective-1000 transition-transform duration-700 hover:rotate-0">
            <video
              autoPlay
              muted
              loop
              className="w-full h-auto rounded-xl"
              poster="/video-fallback.png"
            >
              <source src="/demo-loop.mp4" type="video/mp4" />
            </video>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

const FeatureCard = ({ icon: Icon, title, description }: any) => (
  <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 group">
    <div className="size-12 rounded-xl bg-zinc-900 border border-border flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold mb-3 text-foreground">{title}</h3>
    <p className="text-zinc-400 leading-relaxed text-sm">{description}</p>
  </div>
)

const Step = ({ number, title, desc }: any) => (
  <div className="flex flex-col items-center text-center max-w-xs">
    <div className="size-10 rounded-full bg-primary text-white flex items-center justify-center font-bold mb-4 shadow-lg shadow-primary/30">
      {number}
    </div>
    <h4 className="text-lg font-bold mb-2">{title}</h4>
    <p className="text-sm text-zinc-500">{desc}</p>
  </div>
)

// --- Main Page ---

export default function DevHubLanding() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 selection:text-primary">
      <Navbar />

      <main>
        <Hero />

        {/* 3. Trust / Value Section */}
        <section className="py-20 border-y border-border bg-zinc-950/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { icon: Zap, label: 'Modern Stack', sub: 'Next.js & Prisma' },
                {
                  icon: Globe,
                  label: 'Real-time Sync',
                  sub: 'Powered by Socket.io',
                },
                {
                  icon: ShieldCheck,
                  label: 'Secure Auth',
                  sub: 'NextAuth Protection',
                },
                {
                  icon: Users,
                  label: 'Team Centric',
                  sub: 'Built for Collaboration',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 md:justify-center"
                >
                  <item.icon className="text-primary size-6" />
                  <div>
                    <p className="font-bold text-sm">{item.label}</p>
                    <p className="text-xs text-zinc-500">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Features Section */}
        <section id="features" className="py-24 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
              Everything you need to ship.
            </h2>
            <p className="text-zinc-400">
              Honest tools for efficient project management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={Layers}
              title="Kanban Project Boards"
              description="Organize tasks visually with drag-and-drop columns. Keep track of what's to-do, in progress, and done."
            />
            <FeatureCard
              icon={Zap}
              title="Real-time Updates"
              description="Changes reflect instantly across all team members using WebSockets. No more refreshing pages."
            />
            <FeatureCard
              icon={MessageSquare}
              title="Activity Tracking"
              description="Keep the conversation centered. Comment on tasks and view detailed history of project changes."
            />
            <FeatureCard
              icon={Lock}
              title="Role-based Access"
              description="Manage who can edit or view projects with granular roles for admins, owners, and members."
            />
            <FeatureCard
              icon={ShieldCheck}
              title="Flexible Auth"
              description="Login your way with secure Google OAuth integration or standard credentials."
            />
            <FeatureCard
              icon={Code2}
              title="Developer First"
              description="A clean, minimalist UI inspired by Linear that stays out of your way and focuses on code."
            />
          </div>
        </section>

        {/* 5. Workflow Section */}
        <section id="workflow" className="py-24 bg-zinc-950/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl font-bold mb-4 italic tracking-tight italic">
                Ship in minutes, not hours.
              </h2>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <Step
                number="1"
                title="Create Project"
                desc="Define your goal and set up your workspace in seconds."
              />
              <div className="hidden md:block h-px w-20 bg-zinc-800" />
              <Step
                number="2"
                title="Invite Team"
                desc="Add collaborators via email with specific roles."
              />
              <div className="hidden md:block h-px w-20 bg-zinc-800" />
              <Step
                number="3"
                title="Manage Tasks"
                desc="Break down work into actionable items on your board."
              />
              <div className="hidden md:block h-px w-20 bg-zinc-800" />
              <Step
                number="4"
                title="Track Progress"
                desc="Monitor speed and completion through live updates."
              />
            </div>
          </div>
        </section>

        {/* 6. Live Workspace Preview Section */}
        <section id="demo" className="py-24 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-primary/5 blur-[120px] -z-10" />
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Immersive Productivity.
              </h2>
              <p className="text-zinc-400 max-w-xl mx-auto">
                Experience a UI that adapts to your speed. No bloat, just the
                features that help you close tickets.
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-black/40 backdrop-blur-sm p-4 shadow-2xl">
              <video
                autoPlay
                muted
                loop
                className="w-full rounded-2xl shadow-inner"
              >
                <source src="/workspace-demo.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </section>

        {/* 7. Tech Stack Section */}
        <section
          id="tech"
          className="py-24 max-w-7xl mx-auto px-6 border-t border-border"
        >
          <h2 className="text-center text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 mb-12">
            The Power Behind DevHub
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
            {[
              'Next.js',
              'Prisma',
              'PostgreSQL',
              'NextAuth',
              'Socket.io',
              'Tailwind',
              'shadcn/ui',
            ].map((tech) => (
              <div
                key={tech}
                className="bg-card border border-border p-4 rounded-xl text-center text-sm font-semibold hover:border-primary/40 transition-colors"
              >
                {tech}
              </div>
            ))}
          </div>
        </section>

        {/* 8. Why DevHub Section */}
        <section className="py-24 bg-zinc-950">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-6 italic tracking-tight italic">
              Why I built this.
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed mb-8">
              DevHub wasn't built as a fake startup idea. It was born out of a
              desire to understand how real-time collaborative tools work under
              the hood. I wanted a project manager that felt as fast as my
              terminal—minimal, functional, and built on a rock-solid tech
              stack.
            </p>
            <p className="text-zinc-500 text-sm">
              Authentic software built for developers, by a developer.
            </p>
          </div>
        </section>

        {/* 9. CTA Section */}
        <section className="py-32 relative">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-primary/5 to-transparent -z-10" />
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tighter">
              Start managing projects smarter.
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto bg-primary text-white px-10 py-5 rounded-full font-bold shadow-2xl shadow-primary/20 hover:scale-105 transition-transform"
              >
                Try DevHub for Free
              </Link>
              <Link
                href="https://github.com/xVeeKay"
                className="w-full sm:w-auto bg-transparent border border-border text-foreground px-10 py-5 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-white/5 transition-all"
              >
                <Github size={20} /> View Source Code
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 10. Footer */}
      <footer className="py-12 border-t border-border bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-lg tracking-tighter"
            >
              <div className="size-6 bg-primary rounded-md flex items-center justify-center text-white">
                <Layers size={14} />
              </div>
              DevHub
            </Link>
            <p className="text-zinc-500 text-xs">
              A modern workspace for collaborative development.
            </p>
          </div>

          <div className="flex gap-10 text-xs font-semibold text-zinc-500 uppercase tracking-widest">
            <Link
              href="#features"
              className="hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="#workflow"
              className="hover:text-primary transition-colors"
            >
              Workflow
            </Link>
            <Link
              href="https://github.com/xVeeKay"
              className="hover:text-primary transition-colors"
            >
              GitHub
            </Link>
          </div>

          <div className="text-xs text-zinc-600">
            Built with ❤️ by{' '}
            <span className="text-foreground font-medium">Vishal Kumar</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
