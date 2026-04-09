'use client'

import { useEffect, useState } from 'react'
import { socket } from '@/lib/socket'
import { useSession } from 'next-auth/react'
import { KanbanBoard } from '@/components/KanbanBoard'

type Props = {
  projectId: string
  initialColumns: any[]
  members?: {
    id: string
    name: string | null
  }[]
}

export function WorkspaceRealtime({
  projectId,
  initialColumns,
  members = [],
}: Props) {
  const { data: session } = useSession()
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])

  // ✅ CONNECT SOCKET
  useEffect(() => {
    if (!session?.user?.id) return

    socket.connect()

    socket.emit('join-project', {
      projectId,
      userId: session.user.id,
    })

    socket.on('presence:update', (users: string[]) => {
      setOnlineUsers(users)
    })

    return () => {
      socket.off('presence:update')
      socket.disconnect()
    }
  }, [projectId, session])

  return (
    <div className="flex flex-col h-full">
      {/* ===== PRESENCE BAR ===== */}
      <div className="px-8 py-4 flex items-center justify-between border-b border-zinc-900 bg-zinc-950">
        {/* Left: Presence only */}
        <div className="flex items-center gap-5">
          <div className="flex -space-x-2.5">
            {members.map((member) => {
              const isOnline = onlineUsers.includes(member.id)
              return (
                <div key={member.id} className="relative group">
                  {/* The Avatar */}
                  <div
                    className={`
                size-9 rounded-full border-2 border-zinc-950 flex items-center justify-center 
                text-[10px] font-semibold transition-all duration-300
                ${isOnline ? 'bg-zinc-100 text-zinc-950 scale-105 z-10' : 'bg-zinc-900 text-zinc-600 opacity-50 grayscale'}
              `}
                    title={member.name ?? undefined} // Null-safe title
                  >
                    {member.name?.charAt(0) ?? '?'} {/* Null-safe initial */}
                  </div>

                  {/* The Solid (Non-Blinking) Status Indicator */}
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 z-20 flex h-3 w-3 translate-x-1/4 translate-y-1/4 items-center justify-center rounded-full bg-zinc-950 border-2 border-zinc-950">
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  )}
                </div>
              )
            })}
          </div>
          <div className="h-3.5 w-px bg-zinc-800" /> {/* Divider */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900/50 rounded-full border border-zinc-800/60">
            <span className="size-1.5 bg-emerald-500 rounded-full" />{' '}
            {/* Static small dot */}
            <span className="text-[11px] text-zinc-400 font-medium tracking-tight">
              {onlineUsers.length} Online
            </span>
          </div>
        </div>

        {/* Right: Status only */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            <span className="text-[11px] font-medium text-zinc-400 tracking-tight uppercase">
              Live Sync
            </span>
          </div>
        </div>
      </div>
      {/* ===== YOUR EXISTING BOARD ===== */}
      <KanbanBoard initialColumns={initialColumns} projectId={projectId} />
    </div>
  )
}
