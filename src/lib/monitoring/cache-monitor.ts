import { redis } from '../redis';
import { CacheManager } from '../cache';

// Types pour les métriques
export interface CacheMetrics {
  hits: number;
  misses: number;
  hitRate: number;
  totalKeys: number;
  memoryUsage: string;
  averageResponseTime: number;
}

export interface CacheKeyInfo {
  key: string;
  size: number;
  ttl: number;
  lastAccessed: number;
}

// Classe pour surveiller le cache
export class CacheMonitor {
  private static instance: CacheMonitor;
  private metrics: Map<string, { hits: number; misses: number; responseTimes: number[] }> = new Map();

  static getInstance(): CacheMonitor {
    if (!CacheMonitor.instance) {
      CacheMonitor.instance = new CacheMonitor();
    }
    return CacheMonitor.instance;
  }

  // Enregistrer un hit de cache
  recordHit(key: string, responseTime: number = 0): void {
    const keyMetrics = this.metrics.get(key) || { hits: 0, misses: 0, responseTimes: [] };
    keyMetrics.hits++;
    keyMetrics.responseTimes.push(responseTime);
    this.metrics.set(key, keyMetrics);
  }

  // Enregistrer un miss de cache
  recordMiss(key: string, responseTime: number = 0): void {
    const keyMetrics = this.metrics.get(key) || { hits: 0, misses: 0, responseTimes: [] };
    keyMetrics.misses++;
    keyMetrics.responseTimes.push(responseTime);
    this.metrics.set(key, keyMetrics);
  }

  // Obtenir les métriques globales
  async getGlobalMetrics(): Promise<CacheMetrics> {
    let totalHits = 0;
    let totalMisses = 0;
    let totalResponseTimes: number[] = [];

    this.metrics.forEach((metrics) => {
      totalHits += metrics.hits;
      totalMisses += metrics.misses;
      totalResponseTimes.push(...metrics.responseTimes);
    });

    const totalRequests = totalHits + totalMisses;
    const hitRate = totalRequests > 0 ? (totalHits / totalRequests) * 100 : 0;
    const averageResponseTime = totalResponseTimes.length > 0 
      ? totalResponseTimes.reduce((a, b) => a + b, 0) / totalResponseTimes.length 
      : 0;

    // Obtenir les informations Redis (adapté pour Upstash)
    const totalKeys = await this.getTotalKeys();
    const memoryUsage = await this.getMemoryUsage();

    return {
      hits: totalHits,
      misses: totalMisses,
      hitRate: Math.round(hitRate * 100) / 100,
      totalKeys,
      memoryUsage,
      averageResponseTime: Math.round(averageResponseTime * 100) / 100,
    };
  }

  // Obtenir le nombre total de clés (adapté pour Upstash)
  private async getTotalKeys(): Promise<number> {
    try {
      // Upstash Redis ne supporte pas .keys('*') directement
      // On utilise une approche différente pour estimer le nombre de clés
      const sampleKeys = await redis.keys('*');
      return sampleKeys.length;
    } catch (error) {
      console.error('Error getting total keys:', error);
      // Fallback: compter les clés dans nos métriques
      return this.metrics.size;
    }
  }

  // Obtenir l'utilisation mémoire (adapté pour Upstash)
  private async getMemoryUsage(): Promise<string> {
    try {
      // Upstash Redis ne supporte pas .info()
      // On utilise une approche alternative pour estimer l'utilisation mémoire
      const sampleKeys = await redis.keys('*');
      let totalSize = 0;
      
      // Échantillonner quelques clés pour estimer la taille moyenne
      const sampleSize = Math.min(10, sampleKeys.length);
      for (let i = 0; i < sampleSize; i++) {
        const key = sampleKeys[i];
        const value = await redis.get(key);
        if (value) {
          totalSize += JSON.stringify(value).length;
        }
      }
      
      const averageSize = sampleSize > 0 ? totalSize / sampleSize : 0;
      const estimatedTotalSize = averageSize * sampleKeys.length;
      
      // Convertir en format lisible
      if (estimatedTotalSize < 1024) {
        return `${Math.round(estimatedTotalSize)} B`;
      } else if (estimatedTotalSize < 1024 * 1024) {
        return `${Math.round(estimatedTotalSize / 1024)} KB`;
      } else {
        return `${Math.round(estimatedTotalSize / (1024 * 1024))} MB`;
      }
    } catch (error) {
      console.error('Error getting memory usage:', error);
      return 'Unknown';
    }
  }

  // Obtenir les informations sur les clés les plus utilisées
  async getTopKeys(limit: number = 10): Promise<CacheKeyInfo[]> {
    const keyInfos: CacheKeyInfo[] = [];

    for (const [key, metrics] of this.metrics.entries()) {
      const totalAccess = metrics.hits + metrics.misses;
      if (totalAccess > 0) {
        try {
          // Upstash Redis ne supporte pas .ttl() directement
          // On utilise une approche alternative
          const ttl = await this.getKeyTTL(key);
          const size = await this.getKeySize(key);
          
          keyInfos.push({
            key,
            size,
            ttl,
            lastAccessed: Date.now(), // Simplifié, en production on devrait tracker ça
          });
        } catch (error) {
          console.error(`Error getting info for key ${key}:`, error);
        }
      }
    }

    // Trier par nombre d'accès (hits + misses)
    return keyInfos
      .sort((a, b) => {
        const aMetrics = this.metrics.get(a.key);
        const bMetrics = this.metrics.get(b.key);
        const aTotal = (aMetrics?.hits || 0) + (aMetrics?.misses || 0);
        const bTotal = (bMetrics?.hits || 0) + (bMetrics?.misses || 0);
        return bTotal - aTotal;
      })
      .slice(0, limit);
  }

  // Obtenir la TTL d'une clé (adapté pour Upstash)
  private async getKeyTTL(key: string): Promise<number> {
    try {
      // Upstash Redis ne supporte pas .ttl() directement
      // On retourne une valeur par défaut ou on utilise une approche alternative
      const value = await redis.get(key);
      if (value === null) {
        return -1; // Clé n'existe pas
      }
      
      // Pour Upstash, on peut utiliser une approche basée sur les métadonnées
      // ou retourner une valeur par défaut
      return 3600; // 1 heure par défaut
    } catch (error) {
      return -1;
    }
  }

  // Obtenir la taille d'une clé
  private async getKeySize(key: string): Promise<number> {
    try {
      const value = await redis.get(key);
      return value ? JSON.stringify(value).length : 0;
    } catch (error) {
      return 0;
    }
  }

  // Nettoyer les anciennes métriques
  cleanupOldMetrics(maxAge: number = 24 * 60 * 60 * 1000): void {
    const now = Date.now();
    for (const [key, metrics] of this.metrics.entries()) {
      // Supprimer les métriques plus anciennes que maxAge
      // (simplifié, en production on devrait tracker les timestamps)
      if (metrics.hits + metrics.misses === 0) {
        this.metrics.delete(key);
      }
    }
  }

  // Réinitialiser les métriques
  resetMetrics(): void {
    this.metrics.clear();
  }

  // Exporter les métriques pour les logs
  exportMetrics(): string {
    const metrics = Array.from(this.metrics.entries()).map(([key, metrics]) => ({
      key,
      hits: metrics.hits,
      misses: metrics.misses,
      hitRate: metrics.hits + metrics.misses > 0 
        ? Math.round((metrics.hits / (metrics.hits + metrics.misses)) * 100 * 100) / 100 
        : 0,
    }));

    return JSON.stringify(metrics, null, 2);
  }

  // Méthode spécifique pour Upstash Redis - obtenir des statistiques basiques
  async getUpstashStats(): Promise<{
    totalKeys: number;
    estimatedMemory: string;
    cacheHitRate: number;
  }> {
    try {
      const keys = await redis.keys('*');
      const totalKeys = keys.length;
      
      // Estimer la mémoire utilisée
      let totalSize = 0;
      const sampleSize = Math.min(5, keys.length);
      
      for (let i = 0; i < sampleSize; i++) {
        const value = await redis.get(keys[i]);
        if (value) {
          totalSize += JSON.stringify(value).length;
        }
      }
      
      const averageSize = sampleSize > 0 ? totalSize / sampleSize : 0;
      const estimatedMemory = averageSize * totalKeys;
      
      // Calculer le hit rate
      const globalMetrics = await this.getGlobalMetrics();
      
      return {
        totalKeys,
        estimatedMemory: this.formatBytes(estimatedMemory),
        cacheHitRate: globalMetrics.hitRate,
      };
    } catch (error) {
      console.error('Error getting Upstash stats:', error);
      return {
        totalKeys: 0,
        estimatedMemory: '0 B',
        cacheHitRate: 0,
      };
    }
  }

  // Helper pour formater les bytes
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }
}

// Fonction helper pour wrapper une fonction avec monitoring
export async function withCacheMonitoring<T>(
  key: string,
  fn: () => Promise<T>,
  cacheFn: (key: string, fn: () => Promise<T>) => Promise<T>
): Promise<T> {
  const monitor = CacheMonitor.getInstance();
  const startTime = performance.now();

  try {
    const result = await cacheFn(key, fn);
    const responseTime = performance.now() - startTime;
    monitor.recordHit(key, responseTime);
    return result;
  } catch (error) {
    const responseTime = performance.now() - startTime;
    monitor.recordMiss(key, responseTime);
    throw error;
  }
}

// Fonction pour afficher les métriques dans les logs (adaptée pour Upstash)
export async function logCacheMetrics(): Promise<void> {
  const monitor = CacheMonitor.getInstance();
  const metrics = await monitor.getGlobalMetrics();
  const topKeys = await monitor.getTopKeys(5);
  const upstashStats = await monitor.getUpstashStats();

  console.log('=== Cache Metrics (Upstash Redis) ===');
  console.log(`Hit Rate: ${metrics.hitRate}%`);
  console.log(`Total Requests: ${metrics.hits + metrics.misses}`);
  console.log(`Cache Hits: ${metrics.hits}`);
  console.log(`Cache Misses: ${metrics.misses}`);
  console.log(`Total Keys: ${upstashStats.totalKeys}`);
  console.log(`Estimated Memory: ${upstashStats.estimatedMemory}`);
  console.log(`Average Response Time: ${metrics.averageResponseTime}ms`);
  console.log('=== Top Keys ===');
  topKeys.forEach((keyInfo, index) => {
    console.log(`${index + 1}. ${keyInfo.key} (TTL: ${keyInfo.ttl}s, Size: ${keyInfo.size} bytes)`);
  });
  console.log('====================================');
}
