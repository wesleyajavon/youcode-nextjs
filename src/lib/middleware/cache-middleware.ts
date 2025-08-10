import { NextRequest, NextResponse } from 'next/server';
import { CacheManager, CACHE_CONFIG } from '@/lib/cache';

// Types pour le middleware
export interface CacheMiddlewareOptions {
  prefix: string;
  expiration?: number;
  keyGenerator?: (req: NextRequest) => string;
  shouldCache?: (req: NextRequest) => boolean;
}

// Middleware de cache pour les routes API
export function withCacheMiddleware(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: CacheMiddlewareOptions
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    // Vérifier si on doit mettre en cache
    if (options.shouldCache && !options.shouldCache(req)) {
      return handler(req);
    }

    // Générer la clé de cache
    const cacheKey = options.keyGenerator 
      ? options.keyGenerator(req)
      : CacheManager.generateKey(options.prefix, {
          url: req.url,
          method: req.method,
          // Ajouter les paramètres de requête
          ...Object.fromEntries(req.nextUrl.searchParams),
        });

    try {
      // Essayer de récupérer du cache
      const cached = await CacheManager.get<NextResponse>(cacheKey);
      if (cached) {
        console.log(`Cache HIT for API route: ${cacheKey}`);
        return cached;
      }

      // Si pas en cache, exécuter le handler
      console.log(`Cache MISS for API route: ${cacheKey}`);
      const response = await handler(req);

      // Mettre en cache seulement les réponses réussies
      if (response.ok) {
        await CacheManager.set(cacheKey, response, options.expiration || CACHE_CONFIG.LESSON_LIST);
      }

      return response;
    } catch (error) {
      console.error('Cache middleware error:', error);
      // En cas d'erreur de cache, exécuter le handler normalement
      return handler(req);
    }
  };
}

// Fonction helper pour créer des clés de cache basées sur l'URL
export function createUrlBasedCacheKey(prefix: string, req: NextRequest): string {
  const url = new URL(req.url);
  const pathSegments = url.pathname.split('/').filter(Boolean);
  
  return CacheManager.generateKey(prefix, {
    path: pathSegments.join(':'),
    search: url.search,
    method: req.method,
  });
}

// Fonction helper pour créer des clés de cache basées sur les paramètres
export function createParamBasedCacheKey(prefix: string, req: NextRequest): string {
  const url = new URL(req.url);
  const params: Record<string, any> = {};
  
  // Extraire les paramètres de l'URL
  url.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  // Extraire les paramètres de route (ex: [courseId], [lessonId])
  const pathSegments = url.pathname.split('/');
  const courseIdMatch = url.pathname.match(/\/courses\/([^/]+)/);
  const lessonIdMatch = url.pathname.match(/\/lessons\/([^/]+)/);
  
  if (courseIdMatch) params.courseId = courseIdMatch[1];
  if (lessonIdMatch) params.lessonId = lessonIdMatch[1];
  
  return CacheManager.generateKey(prefix, params);
}

// Configuration prédéfinie pour différents types de routes
export const CACHE_CONFIGS = {
  lessons: {
    prefix: 'api:lessons',
    expiration: CACHE_CONFIG.LESSON_LIST,
    keyGenerator: (req: NextRequest) => createParamBasedCacheKey('api:lessons', req),
    shouldCache: (req: NextRequest) => req.method === 'GET',
  },
  courses: {
    prefix: 'api:courses',
    expiration: CACHE_CONFIG.COURSE_DETAIL,
    keyGenerator: (req: NextRequest) => createParamBasedCacheKey('api:courses', req),
    shouldCache: (req: NextRequest) => req.method === 'GET',
  },
  userProgress: {
    prefix: 'api:progress',
    expiration: CACHE_CONFIG.USER_PROGRESS,
    keyGenerator: (req: NextRequest) => createParamBasedCacheKey('api:progress', req),
    shouldCache: (req: NextRequest) => req.method === 'GET',
  },
} as const;
