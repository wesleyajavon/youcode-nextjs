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

    return course
}

export async function getCourseName(courseId: string) {
    const course = await prisma.course.findUnique({
        where: { id: courseId },
        select: {
            name: true,
        }
    });

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

export async function getCoursesNumber(userId: string): Promise<number> {
    const count = await prisma.course.count({
        where: {
            creatorId: userId,
        },
    });
    return count;
}

export async function getUsersCountForUserCourses(userId: string): Promise<number> {
    // Récupère tous les cours créés par l'utilisateur
    const courses = await prisma.course.findMany({
        where: { creatorId: userId },
        select: { id: true },
    });

    const courseIds = courses.map(course => course.id);

    if (courseIds.length === 0) return 0;

    // Compte le nombre total d'utilisateurs inscrits à ces cours
    const usersCount = await prisma.courseOnUser.count({
        where: {
            courseId: { in: courseIds },
        },
    });

    return usersCount;
}