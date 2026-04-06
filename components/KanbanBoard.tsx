'use client'

import { useState, useTransition, useEffect } from 'react'
import { socket } from '@/lib/socket'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd'
import { TaskCard } from '@/components/TaskCard'
import { CreateTaskForm } from '@/components/CreateTaskForm'
import { MessageSquare, AlignLeft, User2 } from 'lucide-react'
import {
  updateTaskStatus,
  createTask,
} from '@/app/projects/[projectId]/actions'

export function KanbanBoard({
  initialColumns,
  projectId,
}: {
  initialColumns: any[]
  projectId: string
}) {
  const [columns, setColumns] = useState(initialColumns)
  const [isPending, startTransition] = useTransition()
  const [isMounted, setIsMounted] = useState(false)

  // NEW: State to track if we are actively dragging
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    socket.connect()

    socket.on('connect', () => {
      console.log('✅ Connected:', socket.id)
    })

    socket.on('connect_error', (err) => {
      console.log('❌ Connection error:', err.message)
    })

    return () => {
      socket.off('connect')
      socket.off('connect_error')
    }
  }, [])

  useEffect(()=>{
    socket.emit("join-project",projectId)
  },[projectId])

  useEffect(() => {
    // TASK CREATED EVENT
    const handleTaskCreated = (task: any) => {
      setColumns((prevColumns) =>
        prevColumns.map((col) =>
          String(col.id) === String(task.status)
            ? { ...col, tasks: [...col.tasks, task] }
            : col
        )
      )
    }

    // TASK MOVED EVENT
    const handleTaskUpdated = ({
      taskId,
      newStatus,
    }: {
      taskId: string
      newStatus: string
    }) => {
      setColumns((prevColumns) => {
        let movedTask: any = null

        // remove from old column
        const updated = prevColumns.map((col) => {
          const filtered = col.tasks.filter((t: any) => {
            if (String(t.id) === taskId) {
              movedTask = { ...t, status: newStatus }
              return false
            }
            return true
          })
          return { ...col, tasks: filtered }
        })

        // insert into new column
        return updated.map((col) =>
          String(col.id) === newStatus && movedTask
            ? { ...col, tasks: [...col.tasks, movedTask] }
            : col
        )
      })
    }

    socket.on('task-created', handleTaskCreated)
    socket.on('task-updated', handleTaskUpdated)

    return () => {
      socket.off('task-created', handleTaskCreated)
      socket.off('task-updated', handleTaskUpdated)
    }
  }, [])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    setColumns(initialColumns)
  }, [initialColumns])

  // NEW: Fire when drag begins
  const onDragStart = () => {
    setIsDragging(true)
  }

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    // 1. Dropped outside any valid list
    if (!destination) {
      setTimeout(() => setIsDragging(false), 50)
      return
    }

    // 2. Dropped in the exact same spot
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      setTimeout(() => setIsDragging(false), 50)
      return
    }

    const sourceColIndex = columns.findIndex(
      (col) => String(col.id) === source.droppableId
    )
    const destColIndex = columns.findIndex(
      (col) => String(col.id) === destination.droppableId
    )

    if (sourceColIndex === -1 || destColIndex === -1) {
      setTimeout(() => setIsDragging(false), 50)
      return
    }

    const sourceCol = columns[sourceColIndex]
    const destCol = columns[destColIndex]
    const newColumns = [...columns]

    const draggedTask = sourceCol.tasks.find(
      (t: any) => String(t.id) === draggableId
    )

    if (!draggedTask) {
      setTimeout(() => setIsDragging(false), 50)
      return
    }

    // 4. Optimistic UI Update
    if (source.droppableId === destination.droppableId) {
      const newTasks = Array.from(sourceCol.tasks)
      newTasks.splice(source.index, 1)
      newTasks.splice(destination.index, 0, draggedTask)
      newColumns[sourceColIndex] = { ...sourceCol, tasks: newTasks }
    } else {
      const sourceTasks = Array.from(sourceCol.tasks)
      sourceTasks.splice(source.index, 1)
      const destTasks = Array.from(destCol.tasks)
      destTasks.splice(destination.index, 0, draggedTask)
      draggedTask.status = destination.droppableId

      newColumns[sourceColIndex] = { ...sourceCol, tasks: sourceTasks }
      newColumns[destColIndex] = { ...destCol, tasks: destTasks }
    }

    setColumns(newColumns)

    // 5. Server Action to update Database
    if (source.droppableId !== destination.droppableId) {
      startTransition(() => {
        updateTaskStatus(draggedTask.id, destination.droppableId, projectId)
        socket.emit("task-updated",{
          taskId:draggedTask.id,
          newStatus:destination.droppableId,
          projectId,
        })
      })
    }

    // NEW: Turn off dragging flag AFTER a tiny delay.
    // This allows the browser's "click" event to fire while isDragging is still true,
    // allowing us to catch and block it.
    setTimeout(() => {
      setIsDragging(false)
    }, 50)
  }

  if (!isMounted) return null

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden">
      {/* NEW: Pass onDragStart to Context */}
      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="flex h-full p-6 gap-6 min-w-max">
          {columns.map((col) => (
            <div
              key={String(col.id)}
              className="w-[320px] flex flex-col flex-shrink-0 h-full"
            >
              <Droppable droppableId={String(col.id)}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 flex flex-col rounded-2xl border ${col.theme.border} ${col.theme.bg} p-3 transition-colors duration-200 ${
                      snapshot.isDraggingOver
                        ? 'bg-opacity-20'
                        : 'bg-opacity-10'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-4 px-1">
                      <div
                        className={`px-2.5 py-1 rounded-full text-[13px] font-semibold flex items-center gap-2 ${col.theme.pillBg} ${col.theme.text}`}
                      >
                        <div className="size-2 rounded-full bg-current opacity-60" />
                        {col.title}
                        <span className="opacity-70 ml-1 font-medium">
                          {col.tasks.length}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 min-h-[150px]">
                      {col.tasks.map((task: any, index: number) => (
                        <Draggable
                          key={String(task.id)}
                          draggableId={String(task.id)}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`transition-shadow ${
                                snapshot.isDragging
                                  ? 'shadow-2xl shadow-black/50 ring-1 ring-white/10 rounded-xl z-50'
                                  : ''
                              }`}
                              style={provided.draggableProps.style}
                            >
                              {/* NEW: Intercept the click capture phase */}
                              <div
                                className="pointer-events-auto"
                                onClickCapture={(e) => {
                                  if (isDragging) {
                                    e.preventDefault()
                                    e.stopPropagation()
                                  }
                                }}
                              >
                                <TaskCard task={task}>
                                  <div className="flex items-start gap-2.5 mb-3">
                                    <span className="text-[14px] leading-snug font-medium text-zinc-200 group-hover:text-white transition-colors">
                                      {task.title}
                                    </span>
                                  </div>

                                  <div className="flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-3">
                                      <span className="flex items-center gap-1.5 text-zinc-500 group-hover:text-zinc-400 transition-colors">
                                        <MessageSquare className="size-3.5" />
                                        <span className="text-[11px] font-medium">
                                          {task._count?.comments || 0}
                                        </span>
                                      </span>
                                      <span className="flex items-center gap-1.5 text-zinc-500 group-hover:text-zinc-400 transition-colors">
                                        <AlignLeft className="size-3.5" />
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-center size-6 rounded-full bg-zinc-800 border border-zinc-700 text-[10px] font-bold text-zinc-400">
                                      <User2 className="size-3.5" />
                                    </div>
                                  </div>
                                </TaskCard>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                      <div className="pt-2">
                        <CreateTaskForm
                          columnId={String(col.id)}
                          createTaskAction={async (formData: FormData) => {
                            const title = formData.get('title') as string
                            if (!title.trim()) return

                            // 1. Optimistic Update: Instantly inject a temporary task into the UI
                            const tempTask = {
                              id: `temp-${Date.now()}`,
                              title,
                              status: col.id,
                              _count: { comments: 0 },
                            }

                            setColumns((prevColumns) =>
                              prevColumns.map((c) =>
                                String(c.id) === String(col.id)
                                  ? { ...c, tasks: [...c.tasks, tempTask] }
                                  : c
                              )
                            )

                            // 2. Save to database in the background
                            const newTask=await createTask(projectId, title, col.id)
                            socket.emit("task-created",{
                              task:newTask,
                              projectId
                            })  
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}
