import { prisma } from "@/lib/prisma";

export async function getLessons(courseId: string) {
    const lessons = await prisma.lesson.findMany({
        where: { courseId: courseId },
    });

    if (!lessons) return null;

    return lessons
}