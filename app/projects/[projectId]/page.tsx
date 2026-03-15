import { prisma } from '@/lib/db'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { MessageSquareDashed, Circle, PanelRight,PlusIcon,CircleCheckBig } from 'lucide-react'
import { ButtonGroup } from '@/components/ui/button-group'
import { InputGroup, InputGroupInput } from '@/components/ui/input-group'
import Link from 'next/link'
import { TaskActivity } from '@/components/task-activity'

// Import Shadcn Sheet components for mobile responsiveness
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

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
            select: {
              comments: true,
            },
          },
        },
      },
    },
  })

  if (!project) {
    return <div>Project not found</div>
  }
  const statusStyles = {
    TODO: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
    INPROGRESS:
      'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
    DONE: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
  } as const
  async function createTask(formData: FormData) {
    'use server'
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      throw new Error('Unauthorized')
    }
    const title = formData.get('title') as string
    if (!title) return

    await prisma.task.create({
      data: {
        title,
        projectId: projectId,
        assignedTo: session.user.id,
      },
    })

    revalidatePath(`/projects/${projectId}`)
  }

  return (
    <div className="flex w-full h-full bg-background">
      {/* MAIN TASK AREA */}
      <div className="flex flex-col flex-1 min-w-0 h-full">
        {/* Header - Now includes a mobile trigger button */}
        <div className="flex-none flex items-center justify-between h-14 px-4 sm:px-6 border-b border-border bg-background/95 backdrop-blur z-10">
          <h2 className="text-lg font-medium tracking-tight text-foreground truncate mr-4">
            {project.title}
          </h2>

          {/* MOBILE SHEET TRIGGER (Visible only on screens smaller than lg) */}
          <div className="lg:hidden flex items-center">
            <Sheet>
              <SheetTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-8 w-8">
                <PanelRight className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Toggle Activity</span>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full sm:w-[400px] p-0 flex flex-col bg-background sm:bg-muted/10"
              >
                <SheetHeader className="h-14 flex items-center justify-center border-b border-border/50 px-4">
                  <SheetTitle className="text-sm font-medium text-foreground/80 mt-0">
                    Activity
                  </SheetTitle>
                </SheetHeader>
                <TaskActivity taskId={taskId} projectId={projectId} />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Scrollable Tasks List */}
        <div className="flex-1 overflow-y-auto">
          {project.tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4 text-center">
              <CircleCheckBig className="h-8 w-8 mb-4 opacity-20" />
              <p className="text-sm">No tasks yet. Create one below.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {/* Wrap the task row in a Link to update the URL parameter */}
              {project.tasks.map((task) => (
                <Link
                  key={task.id}
                  href={`/projects/${projectId}?taskId=${task.id}`}
                  className={`block group px-4 sm:px-6 py-3 border-b border-border/40 hover:bg-muted/40 transition-colors cursor-pointer ${
                    taskId === task.id
                      ? 'bg-muted/30 border-l-2 border-l-primary'
                      : '' // Highlights the active task
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    {/* Left side: Icon and Title */}
                    <div className="flex items-center gap-3 truncate mr-4">
                      <CircleCheckBig className="h-4 w-4 flex-shrink-0 text-muted-foreground/40 group-hover:text-foreground/70 transition-colors" />
                      <span className="text-sm font-medium text-foreground/90 truncate">
                        {task.title}
                      </span>
                    </div>

                    {/* Right side: Grouped Badges */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <Badge
                        variant="outline"
                        className="bg-muted/50 hover:bg-muted text-[10px] sm:text-xs font-normal"
                      >
                        {task._count.comments} Comments
                      </Badge>
                      <Badge
                        className={`text-[10px] sm:text-xs font-normal ${
                          statusStyles[
                            (task as any).status as keyof typeof statusStyles
                          ] || statusStyles.TODO // Added fallback to prevent undefined style errors
                        }`}
                      >
                        {(task as any).status || 'TODO'}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Create Form */}
        <div className="p-3 sm:p-4 bg-background border-t border-border mt-auto">
          <form action={createTask} className="flex w-full">
            {/* The outer ButtonGroup creates the unified pill shape */}
            <ButtonGroup className="[--radius:9999rem] w-full flex shadow-sm">
              <ButtonGroup>
                {/* Changed to type="submit" so clicking it creates the task */}
                <Button
                  type="submit"
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span className="sr-only">Create Task</span>
                </Button>
              </ButtonGroup>

              <ButtonGroup className="flex-1">
                <InputGroup className="w-full">
                  <InputGroupInput
                    type="text"
                    name="title"
                    placeholder="Create a new task..."
                    required
                    autoComplete="off"
                    className="bg-background border-transparent focus-visible:ring-0"
                  />
                </InputGroup>
              </ButtonGroup>
            </ButtonGroup>
          </form>
        </div>
      </div>

      {/* DESKTOP COMMENTS PANEL (Visible only on lg screens and up) */}
      {/* DESKTOP COMMENTS PANEL (Visible only on lg screens and up) */}
      <div className="w-80 flex-shrink-0 flex-col bg-muted/10 hidden lg:flex h-full border-l border-border">
        <div className="flex-none flex items-center h-14 px-5 border-b border-border">
          <h3 className="text-sm font-medium text-foreground/80">Comments</h3>
        </div>

        <TaskActivity taskId={taskId} projectId={projectId} />
      </div>
    </div>
  )
}
