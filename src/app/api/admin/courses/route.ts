// app/api/admin/courses/route.ts

import { getRequiredAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'


export async function GET(req: Request) {
  const session = await getRequiredAuthSession()

  if (!session || session.user.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { searchParams } = new URL(req.url)

  // ✅ Query Params
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '5')
  const search = searchParams.get('search') || ''

  const skip = (page - 1) * limit

  try {
    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where: {
          creatorId: session.user.id,
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        select: {
            id: true,
            name: true,
            image: true,
            presentation: true,
        },
        orderBy: { createdAt: 'asc' },
        skip,
        take: limit,
      }),
      prisma.course.count({
        where: {
          creatorId: session.user.id,
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      }),
    ])

    return NextResponse.json({
      data: courses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('[ADMIN_COURSES_GET]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
