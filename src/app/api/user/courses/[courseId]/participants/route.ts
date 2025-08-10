import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequiredAuthSession } from "@/lib/auth";
import { UpstashCacheManager, UPSTASH_CACHE_CONFIG, withUpstashCache } from "@/lib/cache-upstash";

export async function GET(req: Request) {
  const session = await getRequiredAuthSession();

  if (!session || session.user.role !== 'USER') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '5');
  const search = searchParams.get('search') || '';
  const skip = (page - 1) * limit;

    // Récupère courseId depuis l'URL (et non les query params)
  const match = url.pathname.match(/\/api\/user\/courses\/([^/]+)\/participants/);
  const courseId = match?.[1];

  try {
    // Générer une clé de cache unique basée sur le cours et les paramètres
    const cacheKey = UpstashCacheManager.generateKey('user:course:participants', {
      courseId,
      page,
      limit,
      search,
    });

    // Utiliser le cache pour récupérer les données
    const result = await withUpstashCache(
      cacheKey,
      async () => {
        // Total des utilisateurs filtrés pour ce cours
        const total = await prisma.courseOnUser.count({
          where: {
            courseId,
            user: {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        });

        // Utilisateurs paginés et filtrés pour ce cours
        const users = await prisma.courseOnUser.findMany({
          where: {
            courseId,
            user: {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          skip,
          take: limit,
          orderBy: {
            user: { name: 'asc' },
          },
        });

        return {
          users,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        };
      },
      UPSTASH_CACHE_CONFIG.SEARCH_RESULTS // 5 minutes pour les listes de participants
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('[USER_COURSE_USERS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}