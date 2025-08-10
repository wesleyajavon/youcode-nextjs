import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UpstashCacheManager, UPSTASH_CACHE_CONFIG, withUpstashCache } from "@/lib/cache-upstash";
import { getRequiredAuthSession } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ courseId: string, lessonId: string }> }
) {
  try {
    const session = await getRequiredAuthSession();
    
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { courseId, lessonId } = await params;
    
    // Générer une clé de cache unique basée sur la leçon
    const cacheKey = UpstashCacheManager.generateKey('admin:lesson:details', {
      courseId,
      lessonId,
    });

    // Utiliser le cache pour récupérer les données
    const result = await withUpstashCache(
      cacheKey,
      async () => {
        const lesson = await prisma.lesson.findUnique({
          where: {
            id: lessonId,
            courseId: courseId, // Vérifier que la leçon appartient au cours
          },
          select: {
            id: true,
            name: true,
            state: true,
            content: true,
            courseId: true,
            rank: true,
            createdAt: true,
          },
        });

        if (!lesson) {
          throw new Error('Lesson not found');
        }

        return { lesson };
      },
      UPSTASH_CACHE_CONFIG.LESSON_DETAIL // 30 minutes pour les détails de leçon
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('[ADMIN_LESSON_DETAILS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ courseId: string, lessonId: string }> }
) {
  try {
    const { courseId, lessonId } = await params;
    
    // ✅ Invalider le cache avant la suppression
    await UpstashCacheManager.invalidateLessonCache(lessonId);
    await UpstashCacheManager.invalidateCourseCache(courseId);
    
    await prisma.lesson.delete({
      where: { id: lessonId },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete lesson" }, { status: 500 });
  }
}

