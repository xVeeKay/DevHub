import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MessageSquareDashed, Send } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export async function TaskActivity({
  taskId,
  projectId,
}: {
  taskId?: string
  projectId: string
}) {
  // 1. EMPTY STATE
  if (!taskId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center h-full">
        <div className="h-10 w-10 rounded-full bg-muted/60 flex items-center justify-center mb-4">
          <MessageSquareDashed className="h-4 w-4 text-muted-foreground" />
        </div>
        <h4 className="text-sm font-medium mb-1">No task selected</h4>
        <p className="text-xs text-muted-foreground max-w-[200px]">
          Select a task from the list to view its comments and activity history.
        </p>
      </div>
    )
  }

  // 2. FETCH SELECTED TASK & COMMENTS
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      comments: {
        include: { user: true }, // Assumes your Comment model relates to a User
        orderBy: { createdAt: 'asc' }, // Oldest first, like Linear/Notion
      },
    },
  })

  if (!task)
    return (
      <div className="p-4 text-sm text-muted-foreground">Task not found.</div>
    )

  // 3. SERVER ACTION TO ADD COMMENT
  async function addComment(formData: FormData) {
    'use server'
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) throw new Error('Unauthorized')

    const content = formData.get('content') as string
    if (!content || content.trim() === '') return

    await prisma.comment.create({
      data: {
        content,
        taskId: taskId as string,
        userId: session.user.id,
      },
    })

    revalidatePath(`/projects/${projectId}`)
  }

  // Formatter for time (e.g., "2h ago" or "Jan 12")
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date)
  }

  // 4. RENDER ACTIVITY PANEL
  return (
    <div className="flex flex-col h-full w-full bg-transparent overflow-hidden">
      {/* Comments List Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {task.comments.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center mt-10">
            No comments yet. Start the conversation!
          </p>
        ) : (
          task.comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="h-7 w-7 border border-border/50 shadow-sm">
                <AvatarImage src={(comment.user as any).image} />
                <AvatarFallback className="text-[10px] bg-muted">
                  {(comment.user as any).name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground/90">
                    {(comment.user as any).name || 'Unknown User'}
                  </span>
                  <span className="text-[10px] text-muted-foreground/60">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Form at the bottom */}
      <div className="p-4 border-t border-border/50 bg-background/95 backdrop-blur z-10">
        <form action={addComment} className="flex gap-2 relative">
          <Input
            name="content"
            placeholder="Write a comment..."
            autoComplete="off"
            className="pr-10 bg-muted/20 border-border/50 rounded-full focus-visible:ring-1 focus-visible:ring-border transition-all"
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="absolute right-1 top-1 h-7 w-7 text-muted-foreground hover:text-foreground"
          >
            <Send className="h-3.5 w-3.5" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  )
}
