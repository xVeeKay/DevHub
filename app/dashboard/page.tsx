import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Plus,
  FolderKanban,
  Search,
  MoreVertical,
  Clock,
  User,
} from 'lucide-react'
import { ShootingStars } from '@/components/ui/shooting-stars'
import { timeAgo } from '@/lib/utils'
import CreateProjectDialog from '@/components/create-project-dialog'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error('Unauthorized')

  const projects = await prisma.project.findMany({
    where: {
      ownerId: session.user.id,
    },
    include: {
      tasks: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-hidden">
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,rgba(0,0,0,0)_80%)]" />
        <div
          className="absolute inset-0 opacity-50 animate-pulse"
          style={{
            backgroundImage: `
              radial-gradient(2px 2px at 20px 30px, #eee, rgba(0,0,0,0)),
              radial-gradient(2px 2px at 40px 70px, #fff, rgba(0,0,0,0)),
              radial-gradient(2px 2px at 50px 160px, #ddd, rgba(0,0,0,0)),
              radial-gradient(2px 2px at 90px 40px, #fff, rgba(0,0,0,0)),
              radial-gradient(2px 2px at 130px 80px, #fff, rgba(0,0,0,0)),
              radial-gradient(2px 2px at 160px 120px, #ddd, rgba(0,0,0,0))
            `,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px',
            animationDuration: '5s',
          }}
        />
        <ShootingStars
          starColor="#9E00FF"
          trailColor="#2EB9DF"
          minSpeed={15}
          maxSpeed={35}
          minDelay={1000}
          maxDelay={3000}
        />
        <ShootingStars
          starColor="#FF0099"
          trailColor="#FFB800"
          minSpeed={10}
          maxSpeed={25}
          minDelay={2000}
          maxDelay={4000}
        />
        <ShootingStars
          starColor="#00FF9E"
          trailColor="#00B8FF"
          minSpeed={20}
          maxSpeed={40}
          minDelay={1500}
          maxDelay={3500}
        />
      </div>
      {/* --- END BACKGROUND EFFECTS --- */}

      {/* Main UI Wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Navigation */}
        <div className="sticky top-4 z-40 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <header className="flex h-12 items-center justify-between rounded-full border border-border/30 bg-background/40 px-4 sm:px-5 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.5),0_0_15px_rgba(255,255,255,0.04)] transition-all duration-300">
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <div className="flex aspect-square size-7 items-center justify-center rounded-full bg-foreground/10 border border-border/20 transition-all duration-300 group-hover:bg-primary/20 group-hover:border-primary/30 group-hover:scale-105">
                <Image
                  className="bg-transparent"
                  src={'/logo(transparent).png'}
                  alt="DevHub Logo"
                  width={30}
                  height={30}
                />
              </div>
              <span className="text-base font-semibold tracking-wide text-foreground">
                DevHub
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/profile">
                <button className="flex h-8 w-8 items-center justify-center rounded-full border border-border/20 bg-foreground/10 text-muted-foreground transition-all duration-300 hover:border-primary/30 hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_10px_hsl(var(--primary)/0.2)]">
                  <User className="size-4" />
                </button>
              </Link>
            </div>
          </header>
        </div>

        {/* Main Content */}
        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-1">
          {/* Welcome Section & Search */}
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-10">
            <div className="space-y-1.5">
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Welcome back, {session.user.name?.split(' ')[0] || 'Developer'}
              </h1>
              <p className="text-sm text-muted-foreground">
                Select a project to continue working or create a new one.
              </p>
            </div>

            {/* Modern, Responsive Search Bar */}
            <div className="w-full md:w-auto shrink-0">
              <div className="relative group w-full md:w-[320px]">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary z-10 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="h-10 w-full rounded-xl border border-border/50 bg-background/50 backdrop-blur-md pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-all hover:border-border hover:bg-background/80 focus:border-primary/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {/* Create New Project Card */}
            <CreateProjectDialog
              trigger={
                <button className="group flex h-[160px] flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-border/60 bg-muted/10 backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-muted/30 hover:shadow-[0_0_20px_rgba(158,0,255,0.1)] w-full">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background border border-border/50 shadow-sm transition-transform duration-300 group-hover:scale-110">
                    <Plus className="size-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    Create New Project
                  </span>
                </button>
              }
            />

            {/* Existing Projects */}
            {projects.map((project) => (
              <Link
                href={`/projects/${project.id}`}
                key={project.id}
                className="block w-full"
              >
                {/* UPDATED: hover:shadow now uses rgba(158,0,255,0.15) 
                   to match your primary purple accent.
                */}
                <div className="group flex h-[160px] flex-col justify-between rounded-xl border border-border/40 bg-card/40 backdrop-blur-md p-5 transition-all duration-300 hover:border-primary/30 hover:bg-card/70 hover:shadow-[0_8px_30px_rgba(158,0,255,0.15)] hover:-translate-y-1">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-muted/50 border border-border/40 shadow-sm backdrop-blur text-foreground transition-colors group-hover:bg-muted/80">
                        <FolderKanban className="size-5" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium text-foreground line-clamp-1">
                          {project.title}
                        </h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <FolderKanban className="size-3.5" />
                          {project.tasks?.length || 0} tasks
                        </p>
                      </div>
                    </div>

                    <div className="rounded-md p-1.5 text-muted-foreground hover:bg-muted/80 hover:text-foreground opacity-0 group-hover:opacity-100 transition-all">
                      <MoreVertical className="size-4" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground border-t border-border/30 pt-4 mt-2">
                    <Clock className="size-3.5" />
                    Updated {timeAgo(project.updatedAt)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
