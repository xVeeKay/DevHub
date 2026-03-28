import React from 'react'
import Image from 'next/image'
import { redirect } from 'next/navigation'
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
  SidebarHeader,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  FolderKanban,
  Settings,
  FolderOpen,
  ChevronsUpDown,
  User,
  LayoutDashboard,
} from 'lucide-react'
import { NumberTicker } from '@/components/ui/number-ticker'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'

// NOTE: Consider renaming this import and extracting the component from page.tsx to components/CreateProjectDialog.tsx
import CreateProjectDialog from '@/components/create-project-dialog'
import { LogoutButton } from '@/components/logout-button'

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
    where: { ownerId: session?.user?.id },
  })

  const project = await prisma.project.findUnique({
    where: { id: activeProjectId },
    include: { tasks: true },
  })

  const totalTasks = project?.tasks?.length || 0
  const todoTasks =
    project?.tasks?.filter((t: any) => t.status === 'TODO' || !t.status)
      .length || 0
  const inProgressTasks =
    project?.tasks?.filter((t: any) => t.status === 'INPROGRESS').length || 0
  const doneTasks =
    project?.tasks?.filter((t: any) => t.status === 'DONE').length || 0

  async function handleSubmit(formData: FormData) {
    'use server'
    const title = formData.get('title') as string

    if (!title || !title.trim()) {
      throw new Error('Title is required')
    }

    const newProjectId = 'generated-uuid-123'
    redirect(`/projects/${newProjectId}`)
  }

  return (
    <SidebarProvider>
      <Sidebar variant="sidebar" collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/dashboard" className="block w-full">
                <SidebarMenuButton size="lg">
                  <span className="flex aspect-square size-8 items-center justify-center rounded-lg text-white">
                    <Image
                      className="bg-transparent"
                      src={'/logo(transparent).png'}
                      alt="DevHub Logo"
                      width={30}
                      height={30}
                    />
                  </span>
                  <span className="grid flex-1 text-left text-lg leading-tight">
                    <span className="truncate font-semibold text-white">
                      DevHub
                    </span>
                  </span>
                  <ChevronsUpDown className="ml-auto size-4 text-zinc-500" />
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup className="pt-4 pb-0">
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="w-full flex items-center justify-center p-2">
                  <CreateProjectDialog />
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Your Projects</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {projectNavItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    {/* FIXED: We pass the empty Link to `render`, and place the children purely inside the SidebarMenuButton to avoid duplicate React Nodes. */}
                    <SidebarMenuButton
                      tooltip={item.title}
                      render={
                        <Link
                          id={`sidebar-link-${item.id}`}
                          href={`/projects/${item.id}`}
                          className={`flex items-center gap-2 px-4 sm:px-6 py-3 border-b border-border/40 transition-colors rounded-lg border-l-2 w-full ${
                            activeProjectId === item.id
                              ? 'bg-muted/30 border-l-primary text-foreground'
                              : 'border-transparent text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                          }`}
                        />
                      }
                    >
                      {activeProjectId === item.id ? (
                        <FolderOpen className="h-4 w-4 shrink-0 text-foreground" />
                      ) : (
                        <FolderKanban className="h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                      <span className="truncate">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* ... (Rest of your layout remains exactly the same) */}

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <SidebarMenuButton
                      size="lg"
                      className="w-full flex items-center justify-between gap-2 p-2 hover:bg-zinc-800/50 data-[state=open]:bg-zinc-800/50 transition-colors rounded-lg outline-none group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0"
                    >
                      <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700/60 text-zinc-400 group-data-[collapsible=icon]:size-8">
                        <User className="size-4" />
                      </div>
                      <div className="flex flex-col items-start overflow-hidden flex-1 group-data-[collapsible=icon]:hidden">
                        <span className="text-[13px] font-medium leading-none text-zinc-200 truncate w-full">
                          {session?.user?.name || 'Developer'}
                        </span>
                        <span className="text-[11px] text-zinc-500 truncate w-full mt-1">
                          {session?.user?.email || 'Pro Plan'}
                        </span>
                      </div>
                      <ChevronsUpDown className="size-4 shrink-0 text-zinc-500 group-data-[collapsible=icon]:hidden" />
                    </SidebarMenuButton>
                  }
                />

                <DropdownMenuContent
                  className="w-64 rounded-xl bg-zinc-950/95 backdrop-blur-md border-zinc-800 shadow-2xl p-1"
                  side="top"
                  align="start"
                  sideOffset={8}
                >
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-3 px-2 py-2.5 text-left text-sm">
                        <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700/60 text-zinc-400">
                          <User className="size-5" />
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold text-zinc-200">
                            {session?.user?.name || 'Developer'}
                          </span>
                          <span className="truncate text-xs text-zinc-500">
                            {session?.user?.email || 'user@example.com'}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-zinc-800/60 mx-1" />
                  <DropdownMenuGroup>
                    <Link href="/dashboard" className="w-full">
                      <DropdownMenuItem className="flex items-center gap-2 px-2 py-2 cursor-pointer text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/60 focus:bg-zinc-800/60 rounded-lg transition-colors">
                        <LayoutDashboard className="size-4 text-zinc-400" />
                        <span>Dashboard</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/profile" className="w-full">
                      <DropdownMenuItem className="flex items-center gap-2 px-2 py-2 cursor-pointer text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/60 focus:bg-zinc-800/60 rounded-lg transition-colors">
                        <User className="size-4 text-zinc-400" />
                        <span>Account</span>
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-zinc-800/60 mx-1" />
                  <LogoutButton />
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <div className="flex flex-1 flex-col min-w-0 bg-background text-foreground transition-all duration-300 ease-in-out">
        <header className="flex h-14 items-center gap-4 border-b border-border px-4 lg:h-[60px] lg:px-6 flex-none bg-background/95 backdrop-blur z-10">
          <SidebarTrigger className="h-5 w-5" />
          <div className="flex-1 overflow-hidden">
            <Breadcrumb>
              <BreadcrumbList className="flex-nowrap whitespace-nowrap">
                <BreadcrumbItem className="hidden sm:inline-flex">
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden sm:inline-flex" />
                <BreadcrumbItem className="hidden sm:inline-flex">
                  <BreadcrumbLink href={`/projects/${activeProjectId}`}>
                    Projects
                  </BreadcrumbLink>
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

          <div className="hidden md:flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted/30 border border-border/50">
              <span className="text-muted-foreground font-medium">
                Total Tasks
              </span>
              <span className="text-foreground font-semibold">
                <NumberTicker value={totalTasks} />
              </span>
            </div>
            <div className="h-4 w-px bg-border/60"></div>
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
                <span className="text-foreground font-medium">
                  <NumberTicker value={doneTasks} />
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 w-full h-full overflow-hidden">{children}</main>
      </div>
    </SidebarProvider>
  )
}
