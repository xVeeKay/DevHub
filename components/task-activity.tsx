import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Activity, ArrowUp, MessageSquareDashed } from 'lucide-react'

export async function TaskActivity({
  taskId,
  projectId,
}: {
  taskId?: string
  projectId: string
}) {
  // 1. EMPTY STATE (Ultra-minimal)
  if (!taskId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center h-full bg-zinc-950">
        <div className="h-12 w-12 rounded-xl bg-zinc-900/50 border border-zinc-800/50 flex items-center justify-center mb-4 shadow-sm">
          <Activity className="h-5 w-5 text-zinc-500" />
        </div>
        <h4 className="text-[14px] font-medium text-zinc-200 mb-1">
          No task selected
        </h4>
        <p className="text-[13px] text-zinc-500 max-w-[220px] leading-relaxed">
          Select a task from the board to view its activity and comments.
        </p>
      </div>
    )
  }

  // 2. FETCH SELECTED TASK & COMMENTS
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      comments: {
        include: { user: true },
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (!task)
    return (
      <div className="p-6 text-[13px] text-zinc-500 bg-zinc-950 h-full">
        Task not found.
      </div>
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

  // Formatter for time matching modern SaaS (e.g., "Mar 15, 3:20 PM")
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
    <div className="flex flex-col h-full w-full bg-zinc-950 relative">
      {/* Comments List Area (Timeline Style) */}
      {/* pb-24 ensures the last comment isn't hidden behind the floating input */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 pb-24">
        {task.comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center mt-10">
            <MessageSquareDashed className="size-5 text-zinc-600 mb-3" />
            <p className="text-[13px] text-zinc-500">
              No activity yet. Start the conversation.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {task.comments.map((comment) => (
              <div key={comment.id} className="group flex gap-3.5">
                {/* Minimalist Avatar */}
                <div className="flex-shrink-0 mt-0.5">
                  <div className="size-6 rounded-full bg-zinc-800 border border-zinc-700/60 flex items-center justify-center overflow-hidden shadow-sm">
                    {(comment.user as any).image ? (
                      <img
                        src={(comment.user as any).image}
                        alt="User"
                        className="size-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] font-bold text-zinc-400 uppercase">
                        {(comment.user as any).name?.charAt(0) || 'U'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Comment Content */}
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className="text-[13px] font-medium text-zinc-200 truncate">
                      {(comment.user as any).name || 'Unknown User'}
                    </span>
                    <span className="text-[11px] font-medium text-zinc-500 shrink-0">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-[13px] text-zinc-300 leading-relaxed whitespace-pre-wrap break-words">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Input Form */}
      {/* The gradient background creates a seamless fade over the scrolling comments */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pt-10 bg-gradient-to-t from-zinc-950 via-zinc-950 to-transparent pointer-events-none">
        <div className="pointer-events-auto">
          <form
            action={addComment}
            className="relative flex items-end gap-2 bg-zinc-900 border border-zinc-800/80 focus-within:border-zinc-700 focus-within:bg-zinc-900/90 rounded-xl p-1.5 shadow-lg transition-all"
          >
            <input
              id="new-comment-input"
              name="content"
              placeholder="Leave a comment..."
              autoComplete="off"
              className="flex-1 bg-transparent text-[13px] text-zinc-200 placeholder:text-zinc-500 px-3 py-1.5 outline-none focus:ring-0"
              required
            />
            {/* Using a sleek ArrowUp instead of the classic paper plane for a more "developer tool" vibe */}
            <button
              type="submit"
              className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors shrink-0"
            >
              <ArrowUp className="size-4" />
              <span className="sr-only">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
