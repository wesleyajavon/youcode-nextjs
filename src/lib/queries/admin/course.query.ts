import { prisma } from '@/lib/prisma';
import type { User } from '@prisma/client';


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

export async function getCourseInfo(courseId: string) {
    const course = await prisma.course.findUnique({
        where: { id: courseId },
        select: {
            id: true,
            name: true,
            image: true,
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
    // fetch all courses created by the user
    const courses = await prisma.course.findMany({
        where: { creatorId: userId },
        select: { id: true },
    });

    const courseIds = courses.map(course => course.id);

    if (courseIds.length === 0) return 0;

    // Count the total number of users enrolled in these courses
    const usersCount = await prisma.courseOnUser.count({
        where: {
            courseId: { in: courseIds },
        },
    });

    return usersCount;
}

export async function getCourseNameAndUsersCount(userId: string): Promise<number> {
    // fetch all courses created by the user
    const courses = await prisma.course.findMany({
        where: { creatorId: userId },
        select: { id: true, name: true, },
    });

    const courseIds = courses.map(course => course.id);

    if (courseIds.length === 0) return 0;

    // Count the total number of users enrolled in these courses
    const usersCount = await prisma.courseOnUser.count({
        where: {
            courseId: { in: courseIds },
        },
    });

    return usersCount;
}


// This function retrieves the number of users enrolled in each course created by the user.
// It returns an array of objects with course names and user counts.
// The data is used to display a chart showing the number of users per course.
export async function getCoursesWithUserCountByCreator(creatorId: string): Promise<{ name: string, count: number }[]> {
    // fetch all courses created by the user
    const courses = await prisma.course.findMany({
        where: { creatorId },
        select: { id: true, name: true },
    });

    // For each course, count the number of enrolled users
    const results = await Promise.all(
        courses.map(async (course) => {
            const userCount = await prisma.courseOnUser.count({
                where: { courseId: course.id },
            });
            return {
                name: course.name,
                count: userCount,
            };
        })
    );

    return results;
}