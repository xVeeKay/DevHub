'use client'

import { useTaskPanel } from './workspace-controller'

export function TaskCard({ task, children }: any) {
  const { openTask } = useTaskPanel()

  return (
    <div
      onClick={() => openTask(task.id)}
      // Added keyboard support since we removed the native <button>
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          openTask(task.id)
        }
      }}
      role="button"
      tabIndex={0}
      className="
        group block w-full text-left
        rounded-xl border border-zinc-800
        bg-zinc-900 p-4
        hover:bg-zinc-800/70
        transition
        cursor-grab active:cursor-grabbing
      "
    >
      {children}
    </div>
  )
}
