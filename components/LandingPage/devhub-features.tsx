'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Code2, Users, ShieldCheck, Zap } from 'lucide-react'
import { ReactNode } from 'react'

export function Features() {
  return (
    <section className="py-12 md:py-16 bg-transparent text-white">
      {/* subtle gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-zinc-900/40 to-transparent" />

      <div className="mx-auto max-w-6xl px-6">
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white">
            Built for modern developers
          </h2>
          <p className="mt-4 text-zinc-400">
            DevHub is designed to simplify collaboration, speed up workflows,
            and give developers full control over their projects.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<Code2 />}
            title="Modern Stack"
            desc="Built with Next.js, TypeScript, and Tailwind for performance and scalability."
          />

          <FeatureCard
            icon={<Users />}
            title="Real-time Collaboration"
            desc="Work with your team live — updates, tasks, and changes sync instantly."
          />

          <FeatureCard
            icon={<ShieldCheck />}
            title="Secure Authentication"
            desc="Production-ready auth with session handling and role-based access."
          />

          <FeatureCard
            icon={<Zap />}
            title="Developer Workflow"
            desc="Fast UI, minimal friction, and tools designed for shipping quickly."
          />
        </div>
      </div>
    </section>
  )
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: ReactNode
  title: string
  desc: string
}) {
  return (
    <Card className="group bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
      <CardHeader className="pb-3 text-center">
        <CardDecorator>{icon}</CardDecorator>

        <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
      </CardHeader>

      <CardContent className="text-center">
        <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
      </CardContent>
    </Card>
  )
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div className="relative mx-auto size-24 md:size-28">
    {/* grid background */}
    <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:20px_20px]" />

    {/* glowing center */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex size-12 items-center justify-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-md text-white group-hover:scale-110 transition">
        {children}
      </div>
    </div>
  </div>
)
