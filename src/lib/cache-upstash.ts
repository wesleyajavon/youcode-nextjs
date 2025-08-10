import { redis } from './redis';

// Configuration du cache adaptée pour Upstash Redis
export const UPSTASH_CACHE_CONFIG = {
  // Durées d'expiration en secondes
  LESSON_LIST: 300, // 5 minutes
  LESSON_DETAIL: 1800, // 30 minutes
  COURSE_DETAIL: 3600, // 1 heure
  USER_PROGRESS: 600, // 10 minutes
  SEARCH_RESULTS: 300, // 5 minutes
} as const;

// Classe de cache simplifiée pour Upstash Redis
export class UpstashCacheManager {
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
      if (!cached) return null;
      
      // Upstash Redis retourne déjà le JSON parsé
      return cached as T;
    } catch (error) {
      console.error('Upstash cache get error:', error);
      return null;
    }
  }

  // Stocker une valeur dans le cache
  static async set(key: string, value: any, expiration?: number): Promise<void> {
    try {
      // Upstash Redis gère automatiquement la sérialisation JSON
      await redis.set(key, value, {
        ex: expiration || UPSTASH_CACHE_CONFIG.LESSON_LIST,
      });
    } catch (error) {
      console.error('Upstash cache set error:', error);
    }
  }

  // Supprimer une clé du cache
  static async delete(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      console.error('Upstash cache delete error:', error);
    }
  }

  // Supprimer plusieurs clés
  static async deleteMultiple(keys: string[]): Promise<void> {
    try {
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.error('Upstash cache delete multiple error:', error);
    }
  }

  // Obtenir toutes les clés avec un pattern (limité pour Upstash)
  static async getKeys(pattern: string): Promise<string[]> {
    try {
      // Upstash Redis a des limitations sur .keys()
      // On utilise une approche plus simple
      const keys = await redis.keys(pattern);
      return keys;
    } catch (error) {
      console.error('Upstash cache get keys error:', error);
      return [];
    }
  }

  // Invalider le cache pour un cours spécifique
  static async invalidateCourseCache(courseId: string): Promise<void> {
    try {
      const patterns = [
        `lessons:course:${courseId}:*`,
        `course:${courseId}:*`,
        `user-progress:course:${courseId}:*`,
        `user:courses:*`, // ✅ Invalider toutes les listes de cours utilisateur
        `admin:courses:*`, // ✅ Invalider toutes les listes de cours admin
        `admin:course:details:*`, // ✅ Invalider les détails de cours admin
        `user:course:details:*`, // ✅ Invalider les détails de cours utilisateur
        `admin:course:participants:*`, // ✅ Invalider les listes de participants admin
        `user:course:participants:*`, // ✅ Invalider les listes de participants utilisateur
      ];
      
      for (const pattern of patterns) {
        const keys = await this.getKeys(pattern);
        if (keys.length > 0) {
          await this.deleteMultiple(keys);
        }
      }
    } catch (error) {
      console.error('Upstash cache invalidate course error:', error);
    }
  }

  // Invalider le cache pour une leçon spécifique
  static async invalidateLessonCache(lessonId: string): Promise<void> {
    try {
      const patterns = [
        `lesson:${lessonId}:*`,
        `user-progress:lesson:${lessonId}:*`,
        `admin:lessons:course:*`, // ✅ Invalider toutes les listes de leçons admin
        `admin:lesson:details:*`, // ✅ Invalider les détails de leçons admin
      ];
      
      for (const pattern of patterns) {
        const keys = await this.getKeys(pattern);
        if (keys.length > 0) {
          await this.deleteMultiple(keys);
        }
      }
    } catch (error) {
      console.error('Upstash cache invalidate lesson error:', error);
    }
  }

  // Vérifier si une clé existe
  static async exists(key: string): Promise<boolean> {
    try {
      const value = await redis.get(key);
      return value !== null;
    } catch (error) {
      console.error('Upstash cache exists error:', error);
      return false;
    }
  }

  // Obtenir la taille estimée du cache
  static async getCacheSize(): Promise<number> {
    try {
      const keys = await redis.keys('*');
      return keys.length;
    } catch (error) {
      console.error('Upstash cache size error:', error);
      return 0;
    }
  }

  // Nettoyer le cache (supprimer toutes les clés)
  static async clearAll(): Promise<void> {
    try {
      const keys = await redis.keys('*');
      if (keys.length > 0) {
        await this.deleteMultiple(keys);
      }
    } catch (error) {
      console.error('Upstash cache clear all error:', error);
    }
  }
}

// Fonction helper pour wrapper une fonction avec cache (version Upstash)
export async function withUpstashCache<T>(
  key: string,
  fn: () => Promise<T>,
  expiration?: number
): Promise<T> {
  // Essayer de récupérer du cache
  const cached = await UpstashCacheManager.get<T>(key);
  if (cached !== null) {
    console.log(`Upstash Cache HIT for key: ${key}`);
    return cached;
  }

  // Si pas en cache, exécuter la fonction
  console.log(`Upstash Cache MISS for key: ${key}`);
  const result = await fn();
  
  // Stocker le résultat en cache
  await UpstashCacheManager.set(key, result, expiration);
  
  return result;
}

// Fonction pour obtenir des statistiques basiques du cache
export async function getUpstashCacheStats(): Promise<{
  totalKeys: number;
  sampleKeys: string[];
}> {
  try {
    const keys = await UpstashCacheManager.getKeys('*');
    const sampleKeys = keys.slice(0, 10); // Limiter à 10 clés pour l'affichage
    
    return {
      totalKeys: keys.length,
      sampleKeys,
    };
  } catch (error) {
    console.error('Error getting Upstash cache stats:', error);
    return {
      totalKeys: 0,
      sampleKeys: [],
    };
  }
}

// Fonction pour logger les statistiques du cache
export async function logUpstashCacheStats(): Promise<void> {
  const stats = await getUpstashCacheStats();
  
  console.log('=== Upstash Redis Cache Stats ===');
  console.log(`Total Keys: ${stats.totalKeys}`);
  console.log('Sample Keys:');
  stats.sampleKeys.forEach((key, index) => {
    console.log(`  ${index + 1}. ${key}`);
  });
  console.log('================================');
}
