'use client'

import AutoScroll from 'embla-carousel-auto-scroll'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'

const techStack = [
  {
    name: 'Next.js',
    image: 'https://cdn.simpleicons.org/nextdotjs/white',
  },
  {
    name: 'React',
    image: 'https://cdn.simpleicons.org/react',
  },
  {
    name: 'Tailwind',
    image: 'https://cdn.simpleicons.org/tailwindcss',
  },
  {
    name: 'PostgreSQL',
    image: 'https://cdn.simpleicons.org/postgresql',
  },
  {
    name: 'Prisma',
    image: 'https://cdn.simpleicons.org/prisma',
  },
  {
    name: 'NextAuth',
    image: 'https://authjs.dev/img/logo-sm.png',
  },
  {
    name: 'Vercel',
    image: 'https://cdn.simpleicons.org/vercel/white',
  },
]

export function TechStack() {
  return (
    <section className="py-12 sm:py-16 md:py-20 text-white">
      {/* Heading */}
      <div className="mx-auto max-w-6xl px-6 text-center">
        {/* FIXED HEADING */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white">
          Powered by modern tech
        </h2>

        <p className="mt-4 text-zinc-400 max-w-xl mx-auto">
          Built using industry-standard tools to ensure performance,
          scalability, and developer experience.
        </p>
      </div>

      {/* Carousel */}
      <div className="mt-8 sm:mt-10 md:mt-14 relative">
        <Carousel
          opts={{ loop: true }}
          plugins={[
            AutoScroll({
              playOnInit: true,
              speed: 1.2,
              stopOnInteraction: false,
            }),
          ]}
        >
          <CarouselContent>
            {techStack.map((tech, i) => (
              <CarouselItem
                key={i}
                className="
                  basis-1/3 
                  sm:basis-1/4 
                  md:basis-1/5 
                  lg:basis-1/6 
                  flex justify-center
                "
              >
                <div className="flex flex-col items-center gap-2 opacity-70 hover:opacity-100 transition">
                  <img
                    src={tech.image}
                    alt={tech.name}
                    className="h-6 sm:h-8 md:h-10 object-contain"
                  />
                  <span className="text-[10px] sm:text-xs text-zinc-400">
                    {tech.name}
                  </span>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Gradient edges (matches your page now) */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-16 bg-gradient-to-r from-black/80 to-transparent"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-16 bg-gradient-to-l from-black/80 to-transparent"></div>
      </div>
    </section>
  )
}
