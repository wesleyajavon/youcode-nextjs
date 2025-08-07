import { prisma } from "@/lib/prisma";

export async function getCoursesNumberAsUser(userId: string): Promise<number> {
    const count = await prisma.courseOnUser.count({
        where: {
            userId: userId,
        }
    });
    return count;
}

