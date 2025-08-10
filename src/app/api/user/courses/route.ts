import { getRequiredAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { UpstashCacheManager, UPSTASH_CACHE_CONFIG, withUpstashCache } from '@/lib/cache-upstash';

export async function GET(req: Request) {
    const session = await getRequiredAuthSession()

    if (!session || session.user.role !== 'USER') {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const userId = session.user.id;

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '5')
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    try {
        // Générer une clé de cache unique basée sur les paramètres et l'utilisateur
        const cacheKey = UpstashCacheManager.generateKey('user:courses', {
            userId,
            page,
            limit,
            search,
        });

        // Utiliser le cache pour récupérer les données
        const result = await withUpstashCache(
            cacheKey,
            async () => {
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

                return {
                    data: coursesWithJoined,
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                };
            },
            UPSTASH_CACHE_CONFIG.SEARCH_RESULTS // 5 minutes pour les résultats de recherche
        );

        return NextResponse.json(result);
    } catch (error) {
        console.error('[USER_COURSES_GET]', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}