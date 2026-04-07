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
      <div className="px-8 py-6">
  <div className="flex items-center justify-between bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-3 backdrop-blur-sm">
    
    {/* LEFT SIDE: Avatars & Title */}
    <div className="flex items-center gap-6">
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-1.5">
          Active Now
        </span>
        <div className="flex items-center gap-2">
          {members.map((member) => {
            const isOnline = onlineUsers.includes(member.id);
            return (
              <div key={member.id} className="relative group">
                <div className={`
                  size-9 rounded-xl border flex items-center justify-center transition-all duration-500
                  ${isOnline 
                    ? 'bg-zinc-800 border-indigo-500/50 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.15)] scale-105' 
                    : 'bg-zinc-900 border-zinc-800 text-zinc-600 opacity-50'
                  }
                `}>
                  <span className="text-xs font-bold uppercase">{member.name?.charAt(0)}</span>
                  {isOnline && (
                    <span className="absolute -top-1 -right-1 size-2.5 bg-indigo-500 rounded-full ring-4 ring-zinc-900 animate-pulse" />
                  )}
                </div>
                {/* Tooltip */}
                <div className="absolute top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-800 text-[10px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none border border-zinc-700">
                  {member.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>

    {/* MIDDLE SECTION: Minimal Stats (Fills the gap) */}
    <div className="hidden md:flex items-center gap-8">
      <div className="flex flex-col items-center">
        <span className="text-[10px] text-zinc-500 uppercase font-medium">Total Tasks</span>
        <span className="text-sm font-semibold text-zinc-200">{initialColumns.reduce((acc, col) => acc + col.tasks.length, 0)}</span>
      </div>
      <div className="h-8 w-px bg-zinc-800" />
      <div className="flex flex-col items-center">
        <span className="text-[10px] text-zinc-500 uppercase font-medium">Collaboration</span>
        <span className="text-sm font-semibold text-zinc-200">{Math.round((onlineUsers.length / members.length) * 100)}%</span>
      </div>
    </div>

    {/* RIGHT SIDE: Synchronized Status */}
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
        <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
          Synchronized
        </span>
      </div>
      <span className="text-[10px] text-zinc-600 mr-1 font-medium">Last updated: Just now</span>
    </div>

  </div>
</div>

      {/* ===== YOUR EXISTING BOARD ===== */}
      <KanbanBoard initialColumns={initialColumns} projectId={projectId} />
    </div>
  )
}
