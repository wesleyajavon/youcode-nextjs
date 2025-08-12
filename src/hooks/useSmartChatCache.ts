import { useState, useEffect, useCallback } from 'react';

interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
}

interface UserPreferences {
  showSuggestions: boolean;
  preferredLanguage: string;
  responseLength: 'short' | 'medium' | 'long';
  theme: 'light' | 'dark' | 'auto';
}

export function useSmartChatCache() {
  const [cacheStats, setCacheStats] = useState<CacheStats>({
    hits: 0,
    misses: 0,
    hitRate: 0
  });

  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    showSuggestions: true,
    preferredLanguage: 'en',
    responseLength: 'medium',
    theme: 'auto'
  });

  // Update hit rate when hits or misses change
  useEffect(() => {
    const total = cacheStats.hits + cacheStats.misses;
    const hitRate = total > 0 ? (cacheStats.hits / total) * 100 : 0;
    setCacheStats(prev => ({ ...prev, hitRate }));
  }, [cacheStats.hits, cacheStats.misses]);

  // Load user preferences from localStorage on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('smartchat-preferences');
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setUserPreferences(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading SmartChat preferences:', error);
      }
    }
  }, []);

  // Save user preferences to localStorage
  const saveUserPreferences = useCallback((newPreferences: Partial<UserPreferences>) => {
    const updated = { ...userPreferences, ...newPreferences };
    setUserPreferences(updated);
    localStorage.setItem('smartchat-preferences', JSON.stringify(updated));
  }, [userPreferences]);

  // Record cache hit
  const recordCacheHit = useCallback(() => {
    setCacheStats(prev => ({ ...prev, hits: prev.hits + 1 }));
  }, []);

  // Record cache miss
  const recordCacheMiss = useCallback(() => {
    setCacheStats(prev => ({ ...prev, misses: prev.misses + 1 }));
  }, []);

  // Reset cache stats
  const resetCacheStats = useCallback(() => {
    setCacheStats({ hits: 0, misses: 0, hitRate: 0 });
  }, []);

  // Get cache performance summary
  const getCacheSummary = useCallback(() => {
    const total = cacheStats.hits + cacheStats.misses;
    return {
      total,
      hits: cacheStats.hits,
      misses: cacheStats.misses,
      hitRate: cacheStats.hitRate,
      efficiency: cacheStats.hitRate > 70 ? 'excellent' : 
                 cacheStats.hitRate > 50 ? 'good' : 
                 cacheStats.hitRate > 30 ? 'fair' : 'poor'
    };
  }, [cacheStats]);

  // Export cache data for debugging
  const exportCacheData = useCallback(() => {
    return {
      timestamp: new Date().toISOString(),
      cacheStats,
      userPreferences,
      summary: getCacheSummary()
    };
  }, [cacheStats, userPreferences, getCacheSummary]);

  return {
    // Cache stats
    cacheStats,
    recordCacheHit,
    recordCacheMiss,
    resetCacheStats,
    getCacheSummary,
    
    // User preferences
    userPreferences,
    saveUserPreferences,
    
    // Utilities
    exportCacheData
  };
}
