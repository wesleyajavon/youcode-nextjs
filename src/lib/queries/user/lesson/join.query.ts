"use server";
import { prisma } from "@/lib/prisma";

export async function joinLessonAction(lessonId: string, userId: string) {

    try {
        await prisma.lessonOnUser.create({
            data: {
                userId: userId,
                lessonId: lessonId,
                progress: "IN_PROGRESS", // Default progress when joining
            },
        });
        const lesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
            select: { name: true },
        });
        return { success: true, lessonName: lesson?.name };
    } catch {
        return { success: false };
    }
}

export async function leaveLessonAction(lessonId: string, userId: string) {

    try {
        await prisma.lessonOnUser.delete({
            where: {
                userId_lessonId: {
                    userId: userId,
                    lessonId: lessonId,
                },
            },
        });
        const lesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
            select: { name: true },
        });
        return { success: true, lessonName: lesson?.name };
    } catch {
        return { success: false };
    }
}