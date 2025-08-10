import { UpstashCacheManager, withUpstashCache, UPSTASH_CACHE_CONFIG } from '../cache-upstash';
import { prisma } from '../prisma';

// Exemple 1: Cache simple pour une leçon
export async function getCachedLessonExample(lessonId: string) {
  const cacheKey = UpstashCacheManager.generateKey('lesson', { lessonId });
  
  return withUpstashCache(
    cacheKey,
    async () => {
      return await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: {
          course: {
            select: { id: true, name: true }
          }
        }
      });
    },
    UPSTASH_CACHE_CONFIG.LESSON_DETAIL
  );
}

// Exemple 2: Cache pour une liste de cours avec pagination
export async function getCachedCoursesExample(
  userId: string,
  page: number = 1,
  limit: number = 10,
  search: string = ''
) {
  const cacheKey = UpstashCacheManager.generateKey('courses:user', {
    userId,
    page,
    limit,
    search
  });

  return withUpstashCache(
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

      return {
        data: courses,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    },
    UPSTASH_CACHE_CONFIG.SEARCH_RESULTS
  );
}

// Exemple 3: Cache pour le progrès utilisateur
export async function getCachedUserProgressExample(userId: string, lessonId: string) {
  const cacheKey = UpstashCacheManager.generateKey('user-progress', { userId, lessonId });
  
  return withUpstashCache(
    cacheKey,
    async () => {
      const progress = await prisma.lessonOnUser.findFirst({
        where: { userId, lessonId },
        select: { progress: true },
      });
      return progress?.progress ?? "NOT_STARTED";
    },
    UPSTASH_CACHE_CONFIG.USER_PROGRESS
  );
}

// Exemple 4: Cache avec invalidation
export async function updateLessonWithCacheInvalidation(
  lessonId: string,
  updateData: any
) {
  // 1. Mettre à jour la leçon
  const updatedLesson = await prisma.lesson.update({
    where: { id: lessonId },
    data: updateData,
  });

  // 2. Invalider le cache de la leçon
  await UpstashCacheManager.invalidateLessonCache(lessonId);
  
  // 3. Invalider aussi le cache du cours parent
  if (updatedLesson.courseId) {
    await UpstashCacheManager.invalidateCourseCache(updatedLesson.courseId);
  }

  return updatedLesson;
}

// Exemple 5: Cache conditionnel basé sur les paramètres
export async function getCachedDataWithConditionalCache(
  userId: string,
  forceRefresh: boolean = false
) {
  const cacheKey = UpstashCacheManager.generateKey('conditional-data', { userId });
  
  // Si forceRefresh est true, on supprime le cache existant
  if (forceRefresh) {
    await UpstashCacheManager.delete(cacheKey);
  }

  return withUpstashCache(
    cacheKey,
    async () => {
      // Simulation d'une requête coûteuse
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        userId,
        data: `Données pour l'utilisateur ${userId}`,
        timestamp: new Date().toISOString(),
      };
    },
    UPSTASH_CACHE_CONFIG.USER_PROGRESS
  );
}

// Exemple 6: Cache avec gestion d'erreur
export async function getCachedDataWithErrorHandling(key: string) {
  try {
    const cacheKey = UpstashCacheManager.generateKey('error-handling', { key });
    
    return await withUpstashCache(
      cacheKey,
      async () => {
        // Simulation d'une requête qui peut échouer
        const random = Math.random();
        if (random < 0.1) {
          throw new Error('Erreur simulée');
        }
        
        return {
          key,
          data: `Données pour la clé ${key}`,
          success: true,
        };
      },
      300 // 5 minutes
    );
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    
    // Fallback: essayer de récupérer du cache même en cas d'erreur
    const cacheKey = UpstashCacheManager.generateKey('error-handling', { key });
    const cached = await UpstashCacheManager.get(cacheKey);
    
    if (cached) {
      console.log('Utilisation des données en cache comme fallback');
      return cached;
    }
    
    // Si pas de cache, retourner une valeur par défaut
    return {
      key,
      data: 'Données par défaut',
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}

// Exemple 7: Cache avec métadonnées
export async function getCachedDataWithMetadata(userId: string) {
  const cacheKey = UpstashCacheManager.generateKey('metadata-example', { userId });
  
  return withUpstashCache(
    cacheKey,
    async () => {
      const startTime = Date.now();
      
      // Requête simulée
      const data = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true },
      });
      
      const endTime = Date.now();
      
      return {
        data,
        metadata: {
          generatedAt: new Date().toISOString(),
          processingTime: endTime - startTime,
          cacheKey,
          source: 'database',
        },
      };
    },
    UPSTASH_CACHE_CONFIG.USER_PROGRESS
  );
}

// Exemple 8: Nettoyage du cache
export async function cleanupCacheExample() {
  console.log('Nettoyage du cache...');
  
  // Obtenir la taille du cache avant nettoyage
  const beforeSize = await UpstashCacheManager.getCacheSize();
  console.log(`Taille du cache avant nettoyage: ${beforeSize} clés`);
  
  // Supprimer toutes les clés
  await UpstashCacheManager.clearAll();
  
  // Vérifier la taille après nettoyage
  const afterSize = await UpstashCacheManager.getCacheSize();
  console.log(`Taille du cache après nettoyage: ${afterSize} clés`);
  
  return {
    beforeSize,
    afterSize,
    cleaned: beforeSize - afterSize,
  };
}
