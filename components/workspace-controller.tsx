'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'

export function useTaskPanel() {
  const router = useRouter()
  const params = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const openTask = (taskId: string) => {
    const newParams = new URLSearchParams(params.toString())
    newParams.set('taskId', taskId)

    startTransition(() => {
      router.replace(`?${newParams.toString()}`, {
        scroll: false,
      })
    })
  }

  const closeTask = () => {
    const newParams = new URLSearchParams(params.toString())
    newParams.delete('taskId')

    startTransition(() => {
      router.replace(`?${newParams.toString()}`, {
        scroll: false,
      })
    })
  }

  return { openTask, closeTask, isPending }
}
