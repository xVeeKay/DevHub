'use client'

import { useTaskPanel } from './workspace-controller'
import { MessageSquare, CornerDownRight, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export function TaskCard({ task }: { task: any }) {
  const { openTask } = useTaskPanel()
  const latestComment = task.comments?.[0]

  return (
    <div
      onClick={() => openTask(task.id)}
      onKeyDown={(e) =>
        (e.key === 'Enter' || e.key === ' ') && openTask(task.id)
      }
      role="button"
      tabIndex={0}
      className="
        group w-full text-left
        bg-[#0c0c0c] border border-zinc-800/60 
        rounded-lg p-3
        hover:border-zinc-700 hover:bg-[#111111]
        transition-all duration-150
        cursor-grab active:cursor-grabbing
        flex flex-col gap-2
      "
    >
      {/* Top Row: Title & Time */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[13px] font-medium text-zinc-200 leading-tight group-hover:text-white transition-colors">
          {task.title}
        </h3>
        <div className="flex items-center gap-1 shrink-0 text-[10px] text-zinc-600 font-medium">
          <Clock className="size-3" />
          <span>
            {task.createdAt
              ? formatDistanceToNow(new Date(task.createdAt), {
                  addSuffix: false,
                })
              : 'Just now'}
          </span>
        </div>
      </div>

      {/* Middle: Latest Comment Thread */}
      <div className="flex flex-col gap-1.5">
        {latestComment && (
          <div className="flex items-center gap-2 text-zinc-500">
            <CornerDownRight className="size-3 shrink-0 text-zinc-800" />
            <p className="text-[11px] truncate leading-none">
              <span className="text-zinc-400 font-medium">
                {latestComment.user?.name.split(' ')[0]}:
              </span>{' '}
              {latestComment.content}
            </p>
          </div>
        )}

        {/* Bottom Row: Metadata & Created By Label */}
        <div className="flex items-center justify-between mt-0.5">
          {/* Comment Count Section */}
          <div className="flex items-center gap-1 text-[10px] font-medium text-zinc-600">
            <MessageSquare className="size-3" />
            <span>{task._count?.comments || 0}</span>
          </div>

          {/* "Created By" Design - Minimalist Label Style */}
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">
              BY
            </span>
            <span
              className="
              text-[10px] font-semibold text-zinc-500 
              bg-zinc-900/40 border border-zinc-800/50 
              px-2 py-0.5 rounded-md
              group-hover:text-zinc-300 group-hover:border-zinc-700
              transition-all
            "
            >
              {task.assignee?.name || 'SYSTEM'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
