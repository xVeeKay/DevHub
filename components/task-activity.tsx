import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Activity, ArrowUp, MessageSquareDashed } from 'lucide-react'
import { TaskActivityClient } from './TaskActivityClient'

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

  return (
    <TaskActivityClient
      taskId={taskId}
      projectId={projectId}
      initialComments={task.comments}
    />
  )
}
