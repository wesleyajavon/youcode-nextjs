// app/api/admin/courses/route.ts

import { getRequiredAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { UpstashCacheManager, UPSTASH_CACHE_CONFIG, withUpstashCache } from '@/lib/cache-upstash';

export async function GET(req: Request) {
  const session = await getRequiredAuthSession()

  if (!session || session.user.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const adminId = session.user.id;

  // ✅ Query Params
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '5')
  const search = searchParams.get('search') || ''

  const skip = (page - 1) * limit

  try {
    // Générer une clé de cache unique basée sur l'admin et les paramètres
    const cacheKey = UpstashCacheManager.generateKey('admin:courses', {
      adminId,
      page,
      limit,
      search,
    });

    // Utiliser le cache pour récupérer les données
    const result = await withUpstashCache(
      cacheKey,
      async () => {
        const [courses, total] = await Promise.all([
          prisma.course.findMany({
            where: {
              creatorId: adminId,
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
              creatorId: adminId,
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
          }),
        ]);

        return {
          data: courses,
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
    console.error('[ADMIN_COURSES_GET]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
