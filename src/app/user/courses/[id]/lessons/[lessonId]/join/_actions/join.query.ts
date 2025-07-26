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
        return { success: true };
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
        return { success: true };
    } catch {
        return { success: false };
    }
}