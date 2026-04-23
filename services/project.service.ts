import {prisma} from "@/lib/db"
import { redis } from "@/lib/redis"

export const getProjectWithTasks=async (projectId:string)=>{
    const cacheKey=`project:${projectId}:full`
    const cached=await redis.get(cacheKey)
    if(cached){
        console.log("Redis hit")
        return JSON.parse(cached)
    }
    console.log("Redis Miss")
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
              },
            },
            comments: {
              take: 1,
              orderBy: { createdAt: 'desc' },
              include: {
                user: {
                  select: { name: true },
                },
              },
            },
            _count: {
              select: { comments: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        members: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })
    if(!project) return null
    await redis.set(cacheKey,JSON.stringify(project),"EX",60)
    return project
}