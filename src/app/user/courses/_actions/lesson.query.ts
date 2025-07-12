import { prisma } from "@/lib/prisma";

export async function getLessonsNumberAsUser(userId: string): Promise<number> {
    const count = await prisma.lessonOnUser.count({
        where: {
            userId: userId,
        },
    });
    return count;
}

export async function getLessonProgress(userId: string, lessonId: string): Promise<String> {
    const lessonOnUser = await prisma.lessonOnUser.findFirst({
        where: {
            userId: userId,
            lessonId: lessonId,
        },
        select: {
            progress: true,
        },
    });

    if (!lessonOnUser) {
        return "Not started";
    }

    switch (lessonOnUser.progress) {
        case "NOT_STARTED":
            return "Not started";
        case "IN_PROGRESS":
            return "In progress";
        case "COMPLETED":
            return "Completed";
        default:
            return "Not started";
    }


}
