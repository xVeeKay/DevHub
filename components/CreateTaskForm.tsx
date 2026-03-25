'use client'

import { useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { Plus, Loader2 } from 'lucide-react'

function TaskInput() {
  const { pending } = useFormStatus()

  return (
    <div className="relative flex items-center">
      {pending ? (
        <Loader2 className="absolute left-2 size-4 text-zinc-400 animate-spin pointer-events-none" />
      ) : (
        <Plus className="absolute left-2 size-4 text-zinc-500 group-focus-within:text-zinc-300 pointer-events-none transition-colors" />
      )}

      <input
        type="text"
        name="title"
        placeholder={pending ? 'Creating...' : 'New task...'}
        autoComplete="off"
        required
        disabled={pending}
        className="
          w-full bg-transparent border border-transparent 
          hover:bg-zinc-800/50 
          focus:bg-zinc-900 focus:border-zinc-700/80 
          focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none
          text-[13px] rounded-md pl-8 pr-3 py-1.5 
          text-zinc-200 placeholder:text-zinc-500 
          transition-all 
          cursor-pointer focus:cursor-text
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      />
    </div>
  )
}

// This is the main component you will export and use in your Server Page
export function CreateTaskForm({
  columnId,
  createTaskAction,
}: {
  columnId: string
  createTaskAction: (formData: FormData) => Promise<void>
}) {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await createTaskAction(formData) // 1. Run your server action
        formRef.current?.reset() // 2. Clear the input immediately after success!
      }}
      className="mt-2 relative group"
    >
      <input type="hidden" name="status" value={columnId} />

      <TaskInput />

      <button type="submit" className="hidden">
        Submit
      </button>
    </form>
  )
}
