import { prisma } from "@/lib/prisma";

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