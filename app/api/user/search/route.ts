import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req:Request){
    try {
      const session = await getServerSession(authOptions)
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      const { searchParams } = new URL(req.url)
      const q = searchParams.get('q')?.trim()
      if (!q) {
        return NextResponse.json([])
      }
      const users = await prisma.user.findMany({
        where: {
          AND: [
            {
              id: {
                not: session.user.id,
              },
            },
            {
              OR: [
                {
                  name: {
                    contains: q,
                    mode: 'insensitive',
                  },
                },
                {
                  email: {
                    contains: q,
                    mode: 'insensitive',
                  },
                },
              ],
            },
          ],
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
        take: 6,
      })
      return NextResponse.json(users)
    } catch (error) {
      console.error('User search error:', error)

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
}