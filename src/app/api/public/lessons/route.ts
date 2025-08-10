import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { UpstashCacheManager, UPSTASH_CACHE_CONFIG, withUpstashCache } from '@/lib/cache-upstash';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;

  // Query Params
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '5');
  const search = searchParams.get('search') || '';

  const skip = (page - 1) * limit;

  try {
    // Générer une clé de cache unique basée sur les paramètres
    const cacheKey = UpstashCacheManager.generateKey('public:lessons', {
      page,
      limit,
      search,
    });

    // Utiliser le cache pour récupérer les données
    const result = await withUpstashCache(
      cacheKey,
      async () => {
        const [lessons, total] = await Promise.all([
          prisma.lesson.findMany({
            where: {
              state: 'PUBLIC',
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
            select: {
              id: true,
              name: true,
              state: true,
              content: true,
            },
            orderBy: { createdAt: 'asc' },
            skip,
            take: limit,
          }),
          prisma.lesson.count({
            where: {
              state: 'PUBLIC',
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
          }),
        ]);

        return {
          data: lessons,
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
    console.error('[PUBLIC_LESSONS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}