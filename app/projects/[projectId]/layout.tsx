import React from 'react'
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  Search,
  User,
  FolderOpen,
  ChevronsUpDown,
} from 'lucide-react'
import { NumberTicker } from "@/components/ui/number-ticker"
import { prisma } from '@/lib/db'
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from 'next/link'

// Define the navigation items for the projects module


export default async function ProjectsLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ projectId: string }>
}) {
  const activeProjectId = (await params).projectId
  const session = await getServerSession(authOptions)
  const projectNavItems = await prisma.project.findMany({
    where: {
      ownerId: session?.user?.id,
    },
  })
  const project=await prisma.project.findUnique({
    where:{
      id:activeProjectId
    },
    include:{
      tasks:true
    }
  })
  // Add this right before your return statement
  const totalTasks = project?.tasks?.length || 0
  const todoTasks = project?.tasks?.filter((t: any) => t.status === 'TODO' || !t.status).length || 0
  const inProgressTasks = project?.tasks?.filter((t: any) => t.status === 'INPROGRESS').length || 0
  const doneTasks = project?.tasks?.filter((t: any) => t.status === 'DONE').length || 0
  return (
    <SidebarProvider>
      <Sidebar variant="sidebar" collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {projectNavItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      render={
                        <Link
                          href={`/projects/${item.id}`}
                          // Added border-l-2 to base classes, and rounded-none so it sits flush to the edge
                          className={`flex items-center gap-2 px-4 sm:px-6 py-3 border-b border-border/40 transition-colors rounded-none border-l-2 w-full ${
                            activeProjectId === item.id
                              ? 'bg-muted/30 border-l-primary text-foreground' // Red border for active
                              : 'border-transparent text-muted-foreground hover:bg-muted/40 hover:text-foreground' // Invisible border for inactive (stops jumping)
                          }`}
                        >
                          {activeProjectId === item.id ? (
                            <FolderOpen className="h-4 w-4 shrink-0 text-foreground" />
                          ) : (
                            <FolderKanban className="h-4 w-4 shrink-0 text-muted-foreground" />
                          )}
                          <span className="truncate">{item.title}</span>
                        </Link>
                      }
                      tooltip={item.title}
                    >
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarGroup>
            <SidebarMenuButton className="w-full justify-between gap-3 h-12">
              <div className="flex items-center gap-2 overflow-hidden">
                <User className="h-5 w-5 shrink-0 rounded-md" />
                <div className="flex flex-col items-start overflow-hidden">
                  <span className="text-sm font-medium truncate">
                    {session?.user?.name}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    User
                  </span>
                </div>
              </div>
              <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
            </SidebarMenuButton>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col min-w-0 bg-background text-foreground transition-all duration-300 ease-in-out">
        {/* Top Header / Nav */}
        <header className="flex h-14 items-center gap-4 border-b border-border px-4 lg:h-[60px] lg:px-6 flex-none bg-background/95 backdrop-blur z-10">
          <SidebarTrigger className="h-5 w-5" />

          {/* Left Side: Breadcrumbs */}
          <div className="flex-1 overflow-hidden">
            <Breadcrumb>
              <BreadcrumbList className="flex-nowrap whitespace-nowrap">
                <BreadcrumbItem className="hidden sm:inline-flex">
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden sm:inline-flex" />
                <BreadcrumbItem className="hidden sm:inline-flex">
                  <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden sm:inline-flex" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="truncate">
                    {project?.title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Right Side: Subtle Stats (Hidden on extra small screens to prevent crowding) */}
          <div className="hidden md:flex items-center gap-4 text-xs">
            {/* Total */}
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted/30 border border-border/50">
              <span className="text-muted-foreground font-medium">
                Total Tasks
              </span>
              <span className="text-foreground font-semibold">
                <NumberTicker value={totalTasks} />
              </span>
            </div>

            {/* Separator */}
            <div className="h-4 w-px bg-border/60"></div>

            {/* Status Breakdown */}
            <div className="flex items-center gap-3.5">
              <div className="flex items-center gap-1.5" title="To Do">
                <div className="h-1.5 w-1.5 rounded-full bg-red-500/80"></div>
                <span className="text-foreground font-medium">
                  <NumberTicker value={todoTasks} />
                </span>
              </div>

              <div className="flex items-center gap-1.5" title="In Progress">
                <div className="h-1.5 w-1.5 rounded-full bg-orange-500/80"></div>
                <span className="text-foreground font-medium">
                  <NumberTicker value={inProgressTasks} />
                </span>
              </div>

              <div className="flex items-center gap-1.5" title="Done">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500/80"></div>
                <span className="text-foreground font-medium"><NumberTicker value={doneTasks} /></span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 w-full h-full overflow-hidden">{children}</main>
      </main>
    </SidebarProvider>
  )
}
