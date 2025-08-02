"use server"


import { prisma } from "@/lib/prisma";
import { Progress } from "@prisma/client";

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

export async function updateLessonProgress(userId: string, lessonId: string, progress: Progress): Promise<{ success: boolean, fallback: string }> {
    try {
        const lessonOnUser = await prisma.lessonOnUser.update({
            where: {
                userId_lessonId: {
                    userId: userId,
                    lessonId: lessonId,
                },
            },
            data: {
                progress: progress,
            },
        });
        const lesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
            select: { courseId: true },
        });
        console.log("Updated Lesson On User:", lessonOnUser);

        const redirectUrl = `/user/courses/${lesson?.courseId}/lessons/${lessonId}`;
        return { success: true, fallback: redirectUrl };
    } catch (error) {
        console.error("Failed to update lesson progress:", error);
        return { success: false, fallback: '' };
    }
}

export async function getLessonOnUser(userId: string, lessonId: string) {
    return await prisma.lessonOnUser.findFirst({
        where: {
            userId: userId,
            lessonId: lessonId,
        },
    });
}