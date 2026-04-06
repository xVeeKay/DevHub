'use client'

import { useEffect, useState, useRef } from 'react'
import { socket } from '@/lib/socket'
import { Activity, ArrowUp, MessageSquareDashed } from 'lucide-react'

export function TaskActivityClient({
  taskId,
  projectId,
  initialComments,
}: {
  taskId?: string
  projectId: string
  initialComments: any[]
}) {
  const [comments, setComments] = useState(initialComments)
  const inputRef = useRef<HTMLInputElement>(null)

  // ✅ Join project room
  useEffect(() => {
    if (!projectId) return
    socket.emit('join-project', projectId)
  }, [projectId])

  // ✅ Listen realtime comments
  useEffect(() => {
    const handleCommentAdded = (comment: any) => {
      if (comment.taskId !== taskId) return

      setComments((prev) => [...prev, comment])
    }

    socket.on('comment-added', handleCommentAdded)

    return () => {
      socket.off('comment-added', handleCommentAdded)
    }
  }, [taskId])

  // ✅ Submit comment
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // ⭐ SAVE FORM BEFORE await
    const form = e.currentTarget

    const formData = new FormData(form)

    const res = await fetch('/api/comments', {
      method: 'POST',
      body: formData,
    })

    if (!res.ok) return

    const newComment = await res.json()

    // realtime emit
    socket.emit('comment-added', {
      projectId,
      comment: newComment,
    })

    inputRef.current?.focus()

    // ✅ SAFE now
    form.reset()
  }

  // formatter (same as before)
  const formatDate = (date: string | Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(new Date(date))
  }

  // EMPTY STATE
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

  return (
    <div className="flex flex-col h-full w-full bg-zinc-950 relative">
      {/* COMMENTS LIST */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 pb-24">
        {comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center mt-10">
            <MessageSquareDashed className="size-5 text-zinc-600 mb-3" />
            <p className="text-[13px] text-zinc-500">
              No activity yet. Start the conversation.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {comments.map((comment: any) => (
              <div key={comment.id} className="group flex gap-3.5">
                {/* Avatar */}
                <div className="flex-shrink-0 mt-0.5">
                  <div className="size-6 rounded-full bg-zinc-800 border border-zinc-700/60 flex items-center justify-center overflow-hidden shadow-sm">
                    {comment.user?.image ? (
                      <img
                        src={comment.user.image}
                        alt="User"
                        className="size-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] font-bold text-zinc-400 uppercase">
                        {comment.user?.name?.charAt(0) || 'U'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className="text-[13px] font-medium text-zinc-200 truncate">
                      {comment.user?.name || 'Unknown User'}
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

      {/* INPUT */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pt-10 bg-gradient-to-t from-zinc-950 via-zinc-950 to-transparent pointer-events-none">
        <div className="pointer-events-auto">
          <form
            onSubmit={handleSubmit}
            className="relative flex items-end gap-2 bg-zinc-900 border border-zinc-800/80 focus-within:border-zinc-700 focus-within:bg-zinc-900/90 rounded-xl p-1.5 shadow-lg transition-all"
          >
            <input type="hidden" name="taskId" value={taskId} />
            <input type="hidden" name="projectId" value={projectId} />
            <input
              ref={inputRef}
              name="content"
              placeholder="Leave a comment..."
              autoComplete="off"
              className="flex-1 bg-transparent text-[13px] text-zinc-200 placeholder:text-zinc-500 px-3 py-1.5 outline-none"
              required
            />

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
