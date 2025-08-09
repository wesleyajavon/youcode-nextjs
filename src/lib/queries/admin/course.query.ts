import { prisma } from '@/lib/prisma';

export async function getCourse(courseId: string) {
    try {
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
                        user: true
                    }
                },
                lessons: true,
            }
        });
        return course;
    } catch (error) {
        console.error('Error in getCourse:', error);
        return null;
    }
}

export async function getCourseInfo(courseId: string) {
    try {
        const course = await prisma.course.findUnique({
            where: { id: courseId },
            select: {
                id: true,
                name: true,
                image: true,
            }
        });
        return course;
    } catch (error) {
        console.error('Error in getCourseInfo:', error);
        return null;
    }
}

export async function getCoursesNumber(userId: string) {
    try {
        const count = await prisma.course.count({
            where: { creatorId: userId },
        });
        return count;
    } catch (error) {
        console.error('Error in getCoursesNumber:', error);
        return 0;
    }
}

export async function getUsersCountForUserCourses(userId: string) {
    try {
        const courses = await prisma.course.findMany({
            where: { creatorId: userId },
            select: { id: true },
        });

        const courseIds = courses.map(course => course.id);
        if (courseIds.length === 0) return 0;

        const usersCount = await prisma.courseOnUser.count({
            where: { courseId: { in: courseIds } },
        });

        return usersCount;
    } catch (error) {
        console.error('Error in getUsersCountForUserCourses:', error);
        return 0;
    }
}

export async function getCoursesWithUserCountByCreator(creatorId: string) {
    try {
        const courses = await prisma.course.findMany({
            where: { creatorId },
            select: { id: true, name: true },
        });

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
    } catch (error) {
        console.error('Error in getCoursesWithUserCountByCreator:', error);
        return [];
    }
}
