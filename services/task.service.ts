import { prisma } from '@/lib/db'
import { redis } from '@/lib/redis'

export const createTaskService = async ({
  title,
  status,
  projectId,
  userId,
}: {
  title: string
  status: string
  projectId: string
  userId: string
}) => {
  const task = await prisma.task.create({
    data: {
      title,
      status,
      projectId,
      assignedTo: userId,
    },
  })

  // 🔥 cache invalidation here (correct place)
  await redis.del(`project:${projectId}:full`)

  return task
}
