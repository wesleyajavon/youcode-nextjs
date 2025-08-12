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
  
  // SmartChat cache configurations
  SMARTCHAT_CONTEXT: 1800, // 30 minutes - course/lesson context
  SMARTCHAT_SUGGESTIONS: 3600, // 1 hour - contextual suggestions
  SMARTCHAT_RESPONSES: 300, // 5 minutes - AI responses for similar questions
  SMARTCHAT_USER_PREFERENCES: 86400, // 24 hours - user preferences
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
      
      if (cached === null || cached === undefined) {
        return null;
      }
      
      // Handle different data types returned by Redis
      if (typeof cached === 'string') {
        try {
          return JSON.parse(cached);
        } catch (parseError) {
          // If it's not valid JSON, return the raw string
          return cached as T;
        }
      }
      
      // If it's already an object/array, return it directly
      if (typeof cached === 'object') {
        return cached as T;
      }
      
      // For other types (number, boolean), return as is
      return cached as T;
      
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  // Stocker une valeur dans le cache
  static async set(key: string, value: any, expiration?: number): Promise<void> {
    try {
      // Always serialize to JSON for consistency
      const serializedValue = JSON.stringify(value);
      await redis.set(key, serializedValue, {
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
      `smartchat:context:course:${courseId}:*`,
      `smartchat:suggestions:course:${courseId}:*`,
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
      `smartchat:context:lesson:${lessonId}:*`,
    ];
    
    await Promise.all(
      patterns.map(pattern => this.deletePattern(pattern))
    );
  }

  // SmartChat specific cache methods
  static async getSmartChatContext(url: string): Promise<any | null> {
    const key = `smartchat:context:${Buffer.from(url).toString('base64')}`;
    return this.get(key);
  }

  static async setSmartChatContext(url: string, context: any): Promise<void> {
    const key = `smartchat:context:${Buffer.from(url).toString('base64')}`;
    await this.set(key, context, CACHE_CONFIG.SMARTCHAT_CONTEXT);
  }

  static async getSmartChatSuggestions(context: string, userLevel: string): Promise<any[] | null> {
    const key = `smartchat:suggestions:${context}:${userLevel}`;
    return this.get(key);
  }

  static async setSmartChatSuggestions(context: string, userLevel: string, suggestions: any[]): Promise<void> {
    const key = `smartchat:suggestions:${context}:${userLevel}`;
    await this.set(key, suggestions, CACHE_CONFIG.SMARTCHAT_SUGGESTIONS);
  }

  static async getSmartChatResponse(prompt: string, context: string): Promise<string | null> {
    // Create a hash of the prompt and context for consistent caching
    const hash = Buffer.from(`${prompt}:${context}`).toString('base64');
    const key = `smartchat:response:${hash}`;
    return this.get(key);
  }

  static async setSmartChatResponse(prompt: string, context: string, response: string): Promise<void> {
    const hash = Buffer.from(`${prompt}:${context}`).toString('base64');
    const key = `smartchat:response:${hash}`;
    await this.set(key, response, CACHE_CONFIG.SMARTCHAT_RESPONSES);
  }

  static async getUserPreferences(userId: string): Promise<any | null> {
    const key = `smartchat:preferences:${userId}`;
    return this.get(key);
  }

  static async setUserPreferences(userId: string, preferences: any): Promise<void> {
    const key = `smartchat:preferences:${userId}`;
    await this.set(key, preferences, CACHE_CONFIG.SMARTCHAT_USER_PREFERENCES);
  }

  // Invalidate all SmartChat related cache
  static async invalidateSmartChatCache(): Promise<void> {
    const patterns = [
      'smartchat:context:*',
      'smartchat:suggestions:*',
      'smartchat:response:*',
      'smartchat:preferences:*',
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

// SmartChat specific cache wrapper
export async function withSmartChatCache<T>(
  cacheType: 'context' | 'suggestions' | 'response' | 'preferences',
  params: Record<string, any>,
  fn: () => Promise<T>,
  expiration?: number
): Promise<T> {
  let key: string;
  
  switch (cacheType) {
    case 'context':
      key = `smartchat:context:${Buffer.from(params.url).toString('base64')}`;
      break;
    case 'suggestions':
      key = `smartchat:suggestions:${params.context}:${params.userLevel}`;
      break;
    case 'response':
      const hash = Buffer.from(`${params.prompt}:${params.context}`).toString('base64');
      key = `smartchat:response:${hash}`;
      break;
    case 'preferences':
      key = `smartchat:preferences:${params.userId}`;
      break;
    default:
      key = `smartchat:${cacheType}:${JSON.stringify(params)}`;
  }
  
  return withCache(key, fn, expiration);
}
