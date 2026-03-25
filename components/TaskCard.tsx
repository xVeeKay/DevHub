'use client'

import { useTaskPanel } from './workspace-controller'

export function TaskCard({ task, children }: any) {
  const { openTask } = useTaskPanel()

  return (
    <button
      onClick={() => openTask(task.id)}
      className="
        group block w-full text-left
        rounded-xl border border-zinc-800
        bg-zinc-900 p-4
        hover:bg-zinc-800/70
        transition
      "
    >
      {children}
    </button>
  )
}
