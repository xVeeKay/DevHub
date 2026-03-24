import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import React, { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, FolderKanban, Clock, User, Loader2 } from 'lucide-react'
import { ShootingStars } from '@/components/ui/shooting-stars'
import { timeAgo } from '@/lib/utils'
import CreateProjectDialog from '@/components/create-project-dialog'
import SearchBar from '@/components/SearchBar'
import { ProjectActions } from '@/components/ProjectActions'
import { AuroraText } from '@/components/ui/aurora-text'

// 1. We extract the data fetching into its own component.
// This allows the main page to load instantly and use Suspense for the grid.
async function ProjectList({
  userId,
  query,
}: {
  userId: string
  query: string
}) {
  const projects = await prisma.project.findMany({
    where: {
      ownerId: userId,
      title: {
        contains: query,
        mode: 'insensitive',
      },
    },
    include: {
      tasks: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })

  if (projects.length === 0) {
    return (
      <div className="col-span-full flex h-[160px] flex-col items-center justify-center rounded-xl border border-dashed border-border/40 bg-card/10 text-muted-foreground">
        <p className="text-sm">No projects found.</p>
      </div>
    )
  }

  return (
    <>
      {projects.map((project) => (
        <Link
          href={`/projects/${project.id}`}
          key={project.id}
          className="block w-full"
        >
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

              <ProjectActions projectId={project.id} />
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground border-t border-border/30 pt-4 mt-2">
              <Clock className="size-3.5" />
              Updated {timeAgo(project.updatedAt)}
            </div>
          </div>
        </Link>
      ))}
    </>
  )
}

// 2. The Main Page Layout
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error('Unauthorized')

  const params = await searchParams
  const query = params?.q ?? ''

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
        {/* FLOATING HEADER: Stripped the border/box, now it floats organically */}
        <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2.5 group cursor-pointer">
            <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-foreground/5 border border-border/20 backdrop-blur-sm transition-all duration-300 group-hover:bg-primary/20 group-hover:border-primary/30 group-hover:scale-105">
              <Image
                className="bg-transparent"
                src={'/logo(transparent).png'}
                alt="DevHub Logo"
                width={20}
                height={20}
              />
            </div>
            <span className="text-base font-semibold tracking-wide text-foreground">
              DevHub
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/profile">
              <button className="flex h-9 w-9 items-center justify-center rounded-full border border-border/20 bg-foreground/5 backdrop-blur-sm text-muted-foreground transition-all duration-300 hover:border-primary/30 hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_15px_hsl(var(--primary)/0.2)]">
                <User className="size-4" />
              </button>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-1">
          {/* Welcome Section & Search */}
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-10">
            <div className="space-y-1.5">
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Welcome back, <AuroraText> {session.user.name?.split(' ')[0] || 'Developer'} </AuroraText>
              </h1>
              <p className="text-sm text-muted-foreground">
                Select a project to continue working or create a new one.
              </p>
            </div>
            <SearchBar />
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {/* Create New Project Card - Always visible instantly */}
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

            {/* Suspense Boundary: Shows spinner while fetching or searching */}
            <Suspense
              key={query} // The key ensures Suspense re-triggers when the search query changes
              fallback={
                <div className="col-span-full sm:col-span-1 lg:col-span-2 xl:col-span-3 flex h-[160px] items-center justify-center rounded-xl border border-border/10 bg-card/5 backdrop-blur-sm">
                  <Loader2 className="size-6 animate-spin text-primary/70" />
                </div>
              }
            >
              <ProjectList userId={session.user.id} query={query} />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  )
}
