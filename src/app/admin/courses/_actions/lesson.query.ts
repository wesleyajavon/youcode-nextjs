import { prisma } from "@/lib/prisma";
import {redis} from "@/lib/redis";


export async function getLessons(courseId: string) {
    const lessons = await prisma.lesson.findMany({
        where: { courseId: courseId },
    });

    if (!lessons) return null;

    return lessons
}

export async function getLessonsNumber(userId: string): Promise<number> {
    const count = await prisma.lesson.count({
        where: {
            course: {
                creatorId: userId,
            },
        },
    });
    return count;
}

export async function getLessonContent(lessonId: string): Promise<string | null> {
    const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        select: { content: true },
    });

    return lesson?.content ?? null;
}


export async function getLessonContentWithRedis(lessonId: string) {
  const cacheKey = `lesson-content:${lessonId}`;
  let content: string | null = await redis.get(cacheKey);

  if (!content) {
    const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        select: { content: true },
    });
    content = lesson?.content ?? null;
    await redis.set(cacheKey, content, {
        // Set expiration time to 1 hour
        ex: 3600,
    });
  }

  return content;
}

export async function getLesson(lessonId: string) {
    const lesson = await prisma.lesson.findFirst({
        where: { id: lessonId },
        include: {
            course: {
                select: {
                    id: true,
                    name: true,
                },
            },
            users: {
                select: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
        },
    });

    if (!lesson) return null;

    return lesson
}

export async function getLessonInfo (lessonId: string) {
    const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        select: {
            id: true,
            name: true,
            state: true,
            content: true,
            courseId: true,
        },
    });

    if (!lesson) return null;

    return lesson;
}

export async function getLessonUsersProgress(lessonId: string): Promise<{ userName: string, progress: number }[]> {
    // Récupère la leçon pour obtenir l'id du cours associé
    const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        select: { courseId: true },
    });

    if (!lesson || !lesson.courseId) return [];

    // Récupère tous les utilisateurs inscrits au cours
    const courseUsers = await prisma.courseOnUser.findMany({
        where: { courseId: lesson.courseId },
        select: {
            user: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });

    // Pour chaque utilisateur, récupère sa progression sur la leçon
    const results = await Promise.all(courseUsers.map(async ({ user }) => {
        const lessonProgress = await prisma.lessonOnUser.findUnique({
            where: {
                userId_lessonId: {
                    userId: user.id,
                    lessonId,
                },
            },
            select: { progress: true },
        });

        const progressMap: Record<string, number> = {
            NOT_STARTED: 0,
            IN_PROGRESS: 50,
            COMPLETED: 100,
        };

        return {
            userName: user.name ?? "",
            progress: progressMap[lessonProgress?.progress ?? "NOT_STARTED"],
        };
    }));

    return results;
}