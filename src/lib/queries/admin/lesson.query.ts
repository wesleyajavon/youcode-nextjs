import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";


export async function getLessonsNumber(userId: string){
  try {
    const count = await prisma.lesson.count({
      where: {
        course: {
          creatorId: userId,
        },
      },
    });
    return count;
  } catch (error) {
    console.error("Error in getLessonsNumber:", error);
    return 0;
  }
}

// export async function getLessonContent(
//   lessonId: string
// ): Promise<string | null> {
//   try {
//     const lesson = await prisma.lesson.findUnique({
//       where: { id: lessonId },
//       select: { content: true },
//     });
//     return lesson?.content ?? null;
//   } catch (error) {
//     console.error("Error in getLessonContent:", error);
//     return null;
//   }
// }

export async function getLessonContentWithRedis(lessonId: string) {
  
  try {
    const cacheKey = `lesson-content:${lessonId}`;
    let content: string | null = await redis.get(cacheKey);

    if (!content) {
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        select: { content: true },
      });
      content = lesson?.content ?? null;
      await redis.set(cacheKey, content, {
        ex: 3600, // 1 hour expiration
      });
    }
    return content;
  } catch (error) {
    console.error("Error in getLessonContentWithRedis:", error);
    return null;
  }
}

export async function getLesson(lessonId: string) {

      // await new Promise(resolve => setTimeout(resolve, 5000)); // Simulate delay for suspense

  try {
    const lesson = await prisma.lesson.findFirst({
      where: { id: lessonId },
      include: {
        course: {
          select: {
            id: true,
            name: true,
          },
        },
        users: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    if (!lesson) return null;
    return lesson;
  } catch (error) {
    console.error("Error in getLesson:", error);
    return null;
  }
}

export async function getLessonInfo(lessonId: string) {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        id: true,
        name: true,
        state: true,
        courseId: true,
      },
    });
    if (!lesson) return null;
    return lesson;
  } catch (error) {
    console.error("Error in getLessonInfo:", error);
    return null;
  }
}

export async function getLessonUsersProgress(
  lessonId: string
): Promise<{ userName: string; progress: number }[]> {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { courseId: true },
    });
    if (!lesson || !lesson.courseId) return [];

    const courseUsers = await prisma.courseOnUser.findMany({
      where: { courseId: lesson.courseId },
      select: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const results = await Promise.all(
      courseUsers.map(async ({ user }) => {
        const lessonProgress = await prisma.lessonOnUser.findUnique({
          where: {
            userId_lessonId: {
              userId: user.id,
              lessonId,
            },
          },
          select: { progress: true },
        });

        const progressMap: Record<string, number> = {
          NOT_STARTED: 0,
          IN_PROGRESS: 50,
          COMPLETED: 100,
        };

        return {
          userName: user.name ?? "",
          progress: progressMap[lessonProgress?.progress ?? "NOT_STARTED"],
        };
      })
    );

    return results;
  } catch (error) {
    console.error("Error in getLessonUsersProgress:", error);
    return [];
  }
}
