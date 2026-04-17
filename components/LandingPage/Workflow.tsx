'use client'

import { FolderPlus, Users, CheckSquare, BarChart } from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const steps = [
  {
    title: 'Create Project',
    desc: 'Start a new workspace and structure your development workflow in seconds.',
    icon: FolderPlus,
  },
  {
    title: 'Invite Team',
    desc: 'Collaborate with your team in real-time with shared access and roles.',
    icon: Users,
  },
  {
    title: 'Manage Tasks',
    desc: 'Assign tasks, track issues, and keep everything organized in one place.',
    icon: CheckSquare,
  },
  {
    title: 'Track Progress',
    desc: 'Monitor activity, insights, and project status with powerful dashboards.',
    icon: BarChart,
  },
]

export function Workflow() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-12 md:py-16 text-white relative">
      {/* background blend */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-zinc-900/40 to-transparent" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
            How DevHub works
          </h2>
          <p className="mt-4 text-zinc-400 text-sm sm:text-base">
            A simple and efficient workflow designed to help your team build,
            collaborate, and ship faster.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative mt-12 md:mt-16">
          {/* animated vertical line */}
          <motion.div
            initial={{ height: 0 }}
            animate={isInView ? { height: '100%' } : {}}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="absolute left-3 sm:left-4 md:left-1/2 top-0 w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent md:-translate-x-1/2"
          />

          <div className="flex flex-col gap-10 sm:gap-12">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isLeft = index % 2 === 0

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className={`
                    relative flex items-start md:items-center
                    ${isLeft ? 'md:justify-start' : 'md:justify-end'}
                  `}
                >
                  {/* glowing dot */}
                  <div className="absolute left-3 sm:left-4 md:left-1/2 z-10 md:-translate-x-1/2">
                    <div className="relative flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-white" />
                      <div className="absolute w-6 h-6 rounded-full bg-white/20 blur-md" />
                    </div>
                  </div>

                  {/* Card */}
                  <div
                    className={`
                      ml-10 sm:ml-12 md:ml-0
                      w-full md:w-[45%]
                      rounded-xl border border-white/10
                      bg-white/5 backdrop-blur-xl
                      p-4 sm:p-5 md:p-6
                      transition-all duration-300
                      hover:bg-white/10 hover:shadow-lg hover:shadow-white/10

                      ${isLeft ? 'md:mr-auto md:pr-10' : 'md:ml-auto md:pl-10'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/10 border border-white/10 group-hover:bg-white/20 transition">
                        <Icon className="w-4 h-4 text-white" />
                      </div>

                      <h3 className="text-base sm:text-lg font-semibold">
                        {step.title}
                      </h3>
                    </div>

                    <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
