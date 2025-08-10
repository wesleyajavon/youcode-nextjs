import { prisma } from '@/lib/prisma';
import { CacheManager, CACHE_CONFIG, withCache } from '@/lib/cache';

// Types pour les réponses
export interface CachedLesson {
  id: string;
  name: string;
  rank: string;
  progress: string;
}

export interface CachedCourse {
  id: string;
  name: string;
  presentation: string;
  image: string;
  state: string;
  totalUsers: number;
}

// Fonction pour récupérer les leçons d'un cours avec cache
export async function getCachedLessonsForCourse(
  courseId: string,
  userId: string,
  page: number = 1,
  limit: number = 5,
  search: string = ''
): Promise<{
  data: CachedLesson[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const cacheKey = CacheManager.generateKey('lessons:course', {
    courseId,
    userId,
    page,
    limit,
    search,
  });

  return withCache(
    cacheKey,
    async () => {
      const skip = (page - 1) * limit;

      const [lessons, total] = await Promise.all([
        prisma.lesson.findMany({
          where: {
            courseId,
            state: { in: ['PUBLIC', 'PUBLISHED'] },
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          select: {
            id: true,
            name: true,
            rank: true,
            users: {
              where: { userId },
              select: { progress: true },
            },
          },
          orderBy: { createdAt: 'asc' },
          skip,
          take: limit,
        }),
        prisma.lesson.count({
          where: {
            courseId,
            state: { in: ['PUBLIC', 'PUBLISHED'] },
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        }),
      ]);

      const transformedLessons = lessons.map(lesson => ({
        id: lesson.id,
        name: lesson.name,
        rank: lesson.rank,
        progress: lesson.users[0]?.progress ?? "NOT_STARTED",
      }));

      return {
        data: transformedLessons,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    },
    CACHE_CONFIG.LESSON_LIST
  );
}

// Fonction pour récupérer un cours avec cache
export async function getCachedCourse(courseId: string): Promise<CachedCourse | null> {
  const cacheKey = CacheManager.generateKey('course', { courseId });

  return withCache(
    cacheKey,
    async () => {
      const course = await prisma.course.findUnique({
        where: { id: courseId },
        select: {
          id: true,
          name: true,
          presentation: true,
          image: true,
          state: true,
          users: {
            select: { id: true },
          },
        },
      });

      if (!course) return null;

      return {
        id: course.id,
        name: course.name,
        presentation: course.presentation,
        image: course.image,
        state: course.state,
        totalUsers: course.users.length,
      };
    },
    CACHE_CONFIG.COURSE_DETAIL
  );
}

// Fonction pour récupérer une leçon avec cache
export async function getCachedLesson(lessonId: string): Promise<any | null> {
  const cacheKey = CacheManager.generateKey('lesson', { lessonId });

  return withCache(
    cacheKey,
    async () => {
      return await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: {
          course: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    },
    CACHE_CONFIG.LESSON_DETAIL
  );
}

// Fonction pour récupérer le progrès d'un utilisateur avec cache
export async function getCachedUserProgress(
  userId: string,
  lessonId: string
): Promise<string> {
  const cacheKey = CacheManager.generateKey('user-progress', { userId, lessonId });

  return withCache(
    cacheKey,
    async () => {
      const progress = await prisma.lessonOnUser.findFirst({
        where: { userId, lessonId },
        select: { progress: true },
      });
      return progress?.progress ?? "NOT_STARTED";
    },
    CACHE_CONFIG.USER_PROGRESS
  );
}

// Fonction pour récupérer les cours d'un utilisateur avec cache
export async function getCachedUserCourses(
  userId: string,
  page: number = 1,
  limit: number = 5,
  search: string = ''
): Promise<{
  data: CachedCourse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const cacheKey = CacheManager.generateKey('user-courses', {
    userId,
    page,
    limit,
    search,
  });

  return withCache(
    cacheKey,
    async () => {
      const skip = (page - 1) * limit;

      const [courses, total] = await Promise.all([
        prisma.course.findMany({
          where: {
            state: 'PUBLISHED',
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          select: {
            id: true,
            name: true,
            image: true,
            presentation: true,
            state: true,
            users: {
              where: { userId },
              select: { id: true },
            },
          },
          orderBy: { createdAt: 'asc' },
          skip,
          take: limit,
        }),
        prisma.course.count({
          where: {
            state: 'PUBLISHED',
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        }),
      ]);

      const transformedCourses = courses.map(course => ({
        id: course.id,
        name: course.name,
        image: course.image,
        presentation: course.presentation,
        state: course.state,
        totalUsers: course.users.length,
      }));

      return {
        data: transformedCourses,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    },
    CACHE_CONFIG.SEARCH_RESULTS
  );
}

// Fonction pour invalider le cache lors des mises à jour
export async function invalidateCacheOnUpdate(
  type: 'course' | 'lesson' | 'progress',
  id: string
): Promise<void> {
  switch (type) {
    case 'course':
      await CacheManager.invalidateCourseCache(id);
      break;
    case 'lesson':
      await CacheManager.invalidateLessonCache(id);
      break;
    case 'progress':
      // Invalider le cache de progrès spécifique
      await CacheManager.deletePattern(`user-progress:*:${id}`);
      break;
  }
}
