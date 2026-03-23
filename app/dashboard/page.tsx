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
  LayoutDashboard,
  User,
} from 'lucide-react'
import { ShootingStars } from '@/components/ui/shooting-stars'
import { timeAgo } from "@/lib/utils";  
import CreateProjectDialog from '@/components/create-project-dialog'


export default async function DashboardPage() {
  const session= await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error('Unauthorized')
  const projects=await prisma.project.findMany({
    where:{
      ownerId:session.user.id
    },
    include:{
      tasks:true
    },
    orderBy:{
      updatedAt:"desc"
    },
  })
  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-hidden">
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Subtle radial gradient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,rgba(0,0,0,0)_80%)]" />

        {/* Static Twinkling Stars Pattern */}
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

        {/* Shooting Stars Layers */}
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

      {/* Main UI Wrapper (z-10 ensures it stays above the stars) */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Navigation */}
        {/* Floating Glass Header with Subtle Glow */}
        <div className="sticky top-4 z-40 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <header className="flex h-12 items-center justify-between rounded-full border border-border/30 bg-background/40 px-4 sm:px-5 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.5),0_0_15px_rgba(255,255,255,0.04)] transition-all duration-300">
            {/* Brand / Logo */}
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

            {/* Actions / Profile */}
            <div className="flex items-center gap-3">
              <a href='/profile'><button className="flex h-8 w-8 items-center justify-center rounded-full border border-border/20 bg-foreground/10 text-muted-foreground transition-all duration-300 hover:border-primary/30 hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_10px_hsl(var(--primary)/0.2)]">
                <User className="size-4" />
              </button></a>
            </div>
          </header>
        </div>

        {/* Main Content */}
        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-1">
          {/* Welcome Section */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Welcome back, {session.user.name}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Select a project to continue working or create a new one.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="h-10 w-full rounded-md border border-border/50 bg-background/40 backdrop-blur-sm pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring sm:w-64 transition-all"
                />
              </div>
              <CreateProjectDialog
                trigger={
                  <button className="hidden h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:flex shadow-[0_0_15px_rgba(158,0,255,0.3)]">
                    <Plus className="size-4" />
                    New Project
                  </button>
                }
              />
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {/* Create New Project Card */}
            <CreateProjectDialog
              trigger={
                <button className="group flex h-[160px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border/60 bg-muted/20 backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-muted/40 hover:shadow-[0_0_20px_rgba(158,0,255,0.15)]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/80 backdrop-blur transition-transform group-hover:scale-110 shadow-sm border border-border/50">
                    <Plus className="size-5 text-foreground" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">
                    Create New Project
                  </span>
                </button>
              }
            />

            {/* Existing Projects */}
            {projects.map((project) => (
              <Link href={`/projects/${project.id}`} key={project.id}>
                <div className="group flex h-[160px] flex-col justify-between rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm p-5 transition-all hover:border-primary/40 hover:bg-card/60 hover:shadow-[0_0_15px_rgba(46,185,223,0.1)]">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/80 border border-border/50 shadow-sm backdrop-blur font-medium text-foreground">
                        <FolderKanban />
                      </div>
                      <div>
                        <h3 className="font-medium text-card-foreground line-clamp-1">
                          {project.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                          <FolderKanban className="size-3" />
                          {project.tasks?.length || 0} total tasks
                        </p>
                      </div>
                    </div>

                    <div className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="size-4" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground border-t border-border/40 pt-3 mt-4">
                    <Clock className="size-3" />
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
