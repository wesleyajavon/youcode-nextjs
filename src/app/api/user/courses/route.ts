import { getRequiredAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    const session = await getRequiredAuthSession()

    if (!session || session.user.role !== 'USER') {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '5')
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    try {
        // Récupère les cours paginés

        const [courses, total] = await Promise.all([
            prisma.course.findMany({
                where: {
                    state: 'PUBLISHED',
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
                    state: 'PUBLISHED',
                    name: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
            }),
        ]);

        // Récupère tous les courseId où l'utilisateur est inscrit
        const userId = session.user.id;
        const joinedCourses = await prisma.courseOnUser.findMany({
            where: { userId },
            select: { courseId: true },
        });
        const joinedCourseIds = new Set(joinedCourses.map(c => c.courseId));

        // Ajoute une propriété alreadyJoined pour chaque cours
        const coursesWithJoined = courses.map(course => ({
            image: course.image,
            id: course.id,
            name: course.name,
            presentation: course.presentation,
            alreadyJoined: joinedCourseIds.has(course.id),
        }));

        return NextResponse.json({
            data: coursesWithJoined,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        })
    } catch (error) {
        console.error('[USER_COURSES_GET]', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}