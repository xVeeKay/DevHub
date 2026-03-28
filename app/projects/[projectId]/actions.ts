'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function updateTaskStatus(
  taskId: string,
  newStatus: string,
  projectId: string
) {
  await prisma.task.update({
    where: { id: taskId },
    data: { status: newStatus },
  })
  revalidatePath(`/projects/${projectId}`)
}

export async function createTask(
  projectId: string,
  title: string,
  status: string
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error('Unauthorized')

  await prisma.task.create({
    data: {
      title,
      status,
      projectId,
      assignedTo: session.user.id,
    },
  })
  revalidatePath(`/projects/${projectId}`)
}
