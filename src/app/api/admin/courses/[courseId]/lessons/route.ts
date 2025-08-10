import { getRequiredAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { UpstashCacheManager, UPSTASH_CACHE_CONFIG, withUpstashCache } from '@/lib/cache-upstash';

export async function GET(req: Request) {
  const session = await getRequiredAuthSession();

  if (!session || session.user.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const url = new URL(req.url);
  const searchParams = url.searchParams;

  // Récupère courseId depuis l'URL
  const match = url.pathname.match(/\/api\/admin\/courses\/([^/]+)\/lessons/);
  const courseId = match?.[1];

  if (!courseId) {
    return new NextResponse('Missing courseId', { status: 400 });
  }

  // Query Params
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '5');
  const search = searchParams.get('search') || '';

  const skip = (page - 1) * limit;

  try {
    // Générer une clé de cache unique basée sur le cours et les paramètres
    const cacheKey = UpstashCacheManager.generateKey('admin:lessons:course', {
      courseId,
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
              courseId,
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
            select: {
              id: true,
              name: true,
              rank: true,
              content: true,
              state: true,
              createdAt: true,
            },
            orderBy: { createdAt: 'asc' },
            skip,
            take: limit,
          }),
          prisma.lesson.count({
            where: {
              courseId,
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
      UPSTASH_CACHE_CONFIG.LESSON_LIST // 5 minutes pour les listes de leçons
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('[ADMIN_LESSONS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}