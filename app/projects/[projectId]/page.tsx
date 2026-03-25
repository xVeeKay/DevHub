import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import { TaskCard } from '@/components/TaskCard'
import {
  MessageSquare,
  CircleDashed,
  CircleDot,
  CheckCircle2,
  Plus,
  X,
  AlignLeft,
  User2,
  Filter,
  SlidersHorizontal,
  Loader2,
} from 'lucide-react'
import { Suspense } from 'react'
import { TaskActivity } from '@/components/task-activity'
import { CreateTaskForm } from '@/components/CreateTaskForm'

export default async function ProjectWorkspace({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>
  searchParams: Promise<{ taskId?: string }>
}) {
  const { projectId } = await params
  const { taskId } = await searchParams
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      tasks: {
        include: {
          _count: {
            select: { comments: true },
          },
        },
        orderBy: { createdAt: 'desc' }, // Shows newest tasks first
      },
    },
  })

  if (!project) {
    return <div className="p-8 text-zinc-400">Project not found</div>
  }

  // 1. Group Tasks by Status for the Kanban layout
  // Note: Adjust the status strings if your database uses lowercase or different casing
  const todos = project.tasks.filter(
    (t: any) => !t.status || t.status === 'TODO'
  )
  const inProgress = project.tasks.filter((t: any) => t.status === 'INPROGRESS')
  const done = project.tasks.filter((t: any) => t.status === 'DONE')

  // 2. Server Action to handle task creation directly into the correct column
  async function createTask(formData: FormData) {
    'use server'
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) throw new Error('Unauthorized')

    const title = formData.get('title') as string
    const status = (formData.get('status') as string) || 'TODO'

    if (!title.trim()) return

    await prisma.task.create({
      data: {
        title,
        status, // Automatically slots it into the correct pillar
        projectId: projectId,
        assignedTo: session.user.id,
      },
    })

    revalidatePath(`/projects/${projectId}`)
  }

  // Helper configuration for our 3 pillars
  const columns = [
    {
      id: 'TODO',
      title: 'Todo',
      tasks: todos,
      icon: <CircleDashed className="size-4 text-zinc-500" />,
      dotColor: 'bg-zinc-500',
    },
    {
      id: 'INPROGRESS',
      title: 'In Progress',
      tasks: inProgress,
      icon: <CircleDot className="size-4 text-amber-500" />,
      dotColor: 'bg-amber-500',
    },
    {
      id: 'DONE',
      title: 'Done',
      tasks: done,
      icon: <CheckCircle2 className="size-4 text-indigo-500" />,
      dotColor: 'bg-indigo-500',
    },
  ]

  return (
    // bg-zinc-950 is the signature deep dark slate used in premium SaaS
    <div className="relative flex w-full h-full bg-zinc-950 text-zinc-200 overflow-hidden font-sans">
      {/* --- MAIN KANBAN AREA --- */}
      <div className="flex flex-col min-w-0 flex-1 min-w-0 h-full">
        {/* Header */}
        {/* --- BORDERLESS MODERN HEADER --- */}
        <div className="flex-none flex items-center justify-between pt-8 pb-6 px-6 lg:px-8 bg-zinc-950 z-10">
          {/* Left: Title and Subdued Badge */}
          <div className="flex items-center gap-3 sm:gap-4">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-100">
              {project.title}
            </h2>

            {/* Much softer badge: no border, muted background */}
            <div className="flex items-center px-2.5 py-1 rounded-md bg-zinc-900 text-zinc-400 text-xs font-medium">
              {project.tasks.length}{' '}
              {project.tasks.length === 1 ? 'task' : 'tasks'}
            </div>
          </div>
        </div>

        {/* Board Container */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="flex h-full p-6 gap-6 min-w-max">
            {/* Map over our 3 Kanban Pillars */}
            {columns.map((col) => (
              <div
                key={col.id}
                className="w-[320px] flex flex-col flex-shrink-0 h-full"
              >
                {/* Pillar Header */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    {col.icon}
                    <h3 className="text-[13px] font-medium text-zinc-300">
                      {col.title}
                    </h3>
                    <span className="text-xs text-zinc-500 font-medium ml-1">
                      {col.tasks.length}
                    </span>
                  </div>
                </div>

                {/* Pillar Tasks Scroll Area */}
                <div className="flex-1 overflow-y-auto no-scrollbar pb-4 space-y-2.5">
                  {col.tasks.map((task: any) => (
                    // Clicking a task updates the URL, which slides out the panel
                    <TaskCard key={task.id} task={task}>
                      {/* Task Title Row */}
                      <div className="flex items-start gap-2.5 mb-3">
                        <div className="mt-0.5">{col.icon}</div>
                        <span className="text-[13px] leading-tight font-medium text-zinc-200 group-hover:text-white transition-colors line-clamp-2">
                          {task.title}
                        </span>
                      </div>

                      {/* Task Footer Metrics (Comments, Assignee) */}
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1.5 text-zinc-500 group-hover:text-zinc-400 transition-colors">
                            <MessageSquare className="size-3.5" />
                            <span className="text-[11px] font-medium">
                              {task._count.comments}
                            </span>
                          </span>
                          <span className="flex items-center gap-1.5 text-zinc-500 group-hover:text-zinc-400 transition-colors">
                            <AlignLeft className="size-3.5" />
                          </span>
                        </div>
                        {/* Fake Avatar for aesthetic, replace with actual user image if available */}
                        <div className="flex items-center justify-center size-5 rounded-full bg-zinc-800 border border-zinc-700 text-[9px] font-bold text-zinc-400">
                          <User2 className="size-3" />
                        </div>
                      </div>
                    </TaskCard>
                  ))}

                  {/* Inline Create Task Form for this specific Pillar */}
                  <CreateTaskForm
                    columnId={col.id}
                    createTaskAction={createTask}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* --- RESPONSIVE ACTIVITY PANEL --- */}

      <div
        className={`
          fixed inset-0 bg-black/60 backdrop-blur-sm z-40 sm:hidden transition-opacity duration-300
          ${taskId ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      >
        {/* Invisible link overlay: Clicking the dark background on mobile closes the panel */}
        <Link href={`/projects/${projectId}`} className="block w-full h-full" />
      </div>

      {/* 2. The Panel Container */}
      <div
        className={`
          fixed sm:absolute z-50 flex flex-col
          transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          
          /* MOBILE: Bottom Sheet layout */
          bottom-0 left-0 right-0 top-16 
          
          /* DESKTOP/TABLET: Floating right card */
          sm:top-20 sm:bottom-6 sm:left-auto sm:right-6 sm:w-[350px]
          
          /* Animations */
          ${
            taskId
              ? 'translate-y-0 sm:translate-x-0 opacity-100 pointer-events-auto'
              : 'translate-y-24 sm:translate-y-0 sm:translate-x-8 opacity-0 pointer-events-none'
          }
        `}
      >
        {taskId && (
          <div className="flex flex-col h-full bg-zinc-950 sm:bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/10">
            {/* Mobile "Pull Handle" */}
            <div className="w-full flex justify-center pt-3 pb-1 sm:hidden bg-zinc-900/50">
              <div className="w-12 h-1.5 bg-zinc-700 rounded-full" />
            </div>

            {/* Panel Header */}
            <div className="flex-none flex items-center justify-between h-14 px-5 border-b border-zinc-800/60 bg-zinc-900/50 sm:bg-transparent">
              <h3 className="text-[14px] font-medium text-zinc-200">
                Activity
              </h3>
              <Link
                href={`/projects/${projectId}`}
                className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
              >
                <X className="size-4" />
              </Link>
            </div>

            {/* Task Activity Content wrapped in Suspense */}
            <div className="flex-1 overflow-y-auto no-scrollbar relative">
              <Suspense
                key={taskId}
                fallback={
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="size-6 text-zinc-500 animate-spin" />
                    <span className="text-xs text-zinc-500 font-medium">
                      Loading activity...
                    </span>
                  </div>
                }
              >
                <TaskActivity taskId={taskId} projectId={projectId} />
              </Suspense>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
