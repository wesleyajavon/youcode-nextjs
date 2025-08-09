import { prisma } from "@/lib/prisma";

export async function getCoursesNumberAsUser(userId: string): Promise<number> {
    const count = await prisma.courseOnUser.count({
        where: {
            userId: userId,
        }
    });
    return count;
}

export async function getCourseOnUser(userId: string, courseId: string) {
    try {
        return await prisma.courseOnUser.findFirst({
            where: {
                userId: userId,
                courseId: courseId,
            },
        });
    } catch (error) {
        console.error("Error in getCourseOnUser:", error);
        return null;
    }
}