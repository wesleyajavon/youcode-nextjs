import { prisma } from '@/lib/prisma';
import type { Course, User } from '@prisma/client';


export async function getCourse(courseId: string) {
    const course = await prisma.course.findUnique({
        where: { id: courseId },
        select: {
            id: true,
            name: true,
            presentation: true,
            image: true,
            createdAt: true,
            state: true,
            users: {
                include: {
                    user: true // "user" doit être la relation vers le modèle User dans la table de jointure
                }
            },
            lessons: true,
        }
    });

    if (!course) return null;

    return course
}


export async function getUsersFromCourse(courseId: string): Promise<User[]> {
    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
            users: {
                include: { user: true } // "user" doit être la relation vers le modèle User dans la table de jointure
            }
        },
    });

    // On extrait les vrais utilisateurs depuis la table de jointure
    return course?.users.map((u: any) => u.user) ?? [];
}