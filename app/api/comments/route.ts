import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ✅ read FormData (NOT JSON)
    const formData = await req.formData()

    const content = formData.get('content') as string
    const taskId = formData.get('taskId') as string

    if (!content || !taskId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        taskId,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
    return NextResponse.json(comment)
  } catch (error) {
    console.error(error)

    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
