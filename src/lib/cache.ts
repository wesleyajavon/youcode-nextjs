import { redis } from './redis';

// Types pour les clés de cache
export type CacheKey = string;
export type CacheValue = any;

// Configuration du cache
export const CACHE_CONFIG = {
  // Durées d'expiration en secondes
  LESSON_LIST: 300, // 5 minutes
  LESSON_DETAIL: 1800, // 30 minutes
  COURSE_DETAIL: 3600, // 1 heure
  USER_PROGRESS: 600, // 10 minutes
  SEARCH_RESULTS: 300, // 5 minutes
} as const;

// Fonctions utilitaires pour le cache
export class CacheManager {
  // Générer une clé de cache unique
  static generateKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join(':');
    return `${prefix}:${sortedParams}`;
  }

  // Récupérer une valeur du cache
  static async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await redis.get(key);
      return cached ? JSON.parse(cached as string) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  // Stocker une valeur dans le cache
  static async set(key: string, value: any, expiration?: number): Promise<void> {
    try {
      await redis.set(key, JSON.stringify(value), {
        ex: expiration || CACHE_CONFIG.LESSON_LIST,
      });
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  // Supprimer une clé du cache
  static async delete(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  // Supprimer toutes les clés avec un pattern
  static async deletePattern(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.error('Cache delete pattern error:', error);
    }
  }

  // Invalider le cache pour un cours spécifique
  static async invalidateCourseCache(courseId: string): Promise<void> {
    const patterns = [
      `lessons:course:${courseId}:*`,
      `course:${courseId}:*`,
      `user-progress:course:${courseId}:*`,
    ];
    
    await Promise.all(
      patterns.map(pattern => this.deletePattern(pattern))
    );
  }

  // Invalider le cache pour une leçon spécifique
  static async invalidateLessonCache(lessonId: string): Promise<void> {
    const patterns = [
      `lesson:${lessonId}:*`,
      `user-progress:lesson:${lessonId}:*`,
    ];
    
    await Promise.all(
      patterns.map(pattern => this.deletePattern(pattern))
    );
  }
}

// Fonction helper pour wrapper une fonction avec cache
export async function withCache<T>(
  key: string,
  fn: () => Promise<T>,
  expiration?: number
): Promise<T> {
  // Essayer de récupérer du cache
  const cached = await CacheManager.get<T>(key);
  if (cached !== null) {
    console.log(`Cache HIT for key: ${key}`);
    return cached;
  }

  // Si pas en cache, exécuter la fonction
  console.log(`Cache MISS for key: ${key}`);
  const result = await fn();
  
  // Stocker le résultat en cache
  await CacheManager.set(key, result, expiration);
  
  return result;
}
