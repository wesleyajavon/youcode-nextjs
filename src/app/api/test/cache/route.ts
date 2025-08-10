import { NextRequest, NextResponse } from 'next/server';
import { UpstashCacheManager, withUpstashCache, UPSTASH_CACHE_CONFIG } from '@/lib/cache-upstash';
import { getUpstashCacheStats } from '@/lib/cache-upstash';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action') || 'test';
  
  try {
    switch (action) {
      case 'stats':
        return await getCacheStats();
      case 'clear':
        return await clearCache();
      case 'performance':
        return await testPerformance();
      case 'basic':
        return await testBasicCache();
      default:
        return await runAllTests();
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

// Obtenir les statistiques du cache
async function getCacheStats() {
  const stats = await getUpstashCacheStats();
  
  return NextResponse.json({
    success: true,
    action: 'stats',
    data: stats,
    timestamp: new Date().toISOString(),
  });
}

// Nettoyer le cache
async function clearCache() {
  await UpstashCacheManager.clearAll();
  
  return NextResponse.json({
    success: true,
    action: 'clear',
    message: 'Cache cleared successfully',
    timestamp: new Date().toISOString(),
  });
}

// Test de performance
async function testPerformance() {
  const results = [];
  
  // Test sans cache
  const startTime1 = Date.now();
  const expensiveOperation = async () => {
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulation
    return { data: 'Expensive data', timestamp: Date.now() };
  };
  
  // Premier appel (sans cache)
  const result1 = await expensiveOperation();
  const duration1 = Date.now() - startTime1;
  
  // Test avec cache
  const startTime2 = Date.now();
  const result2 = await withUpstashCache('test:performance', expensiveOperation, 60);
  const duration2 = Date.now() - startTime2;
  
  // Deuxième appel (avec cache)
  const startTime3 = Date.now();
  const result3 = await withUpstashCache('test:performance', expensiveOperation, 60);
  const duration3 = Date.now() - startTime3;
  
  return NextResponse.json({
    success: true,
    action: 'performance',
    data: {
      withoutCache: {
        duration: duration1,
        result: result1,
      },
      withCacheFirst: {
        duration: duration2,
        result: result2,
      },
      withCacheSecond: {
        duration: duration3,
        result: result3,
        improvement: Math.round(((duration1 - duration3) / duration1) * 100),
      },
    },
    timestamp: new Date().toISOString(),
  });
}

// Test de cache basique
async function testBasicCache() {
  const testKey = 'test:basic';
  const testData = {
    message: 'Hello from cache!',
    timestamp: Date.now(),
    random: Math.random(),
  };
  
  // Setter des données
  await UpstashCacheManager.set(testKey, testData, 60);
  
  // Récupérer les données
  const retrieved = await UpstashCacheManager.get(testKey);
  
  // Vérifier l'existence
  const exists = await UpstashCacheManager.exists(testKey);
  
  return NextResponse.json({
    success: true,
    action: 'basic',
    data: {
      original: testData,
      retrieved,
      exists,
      match: JSON.stringify(testData) === JSON.stringify(retrieved),
    },
    timestamp: new Date().toISOString(),
  });
}

// Exécuter tous les tests
async function runAllTests() {
  const results = [];
  
  // Test 1: Cache basique
  try {
    const basicResult = await testBasicCache();
    const basicData = await basicResult.json();
    results.push({
      test: 'Basic Cache',
      success: basicData.success,
      data: basicData.data,
    });
  } catch (error) {
    results.push({
      test: 'Basic Cache',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
  
  // Test 2: Performance
  try {
    const perfResult = await testPerformance();
    const perfData = await perfResult.json();
    results.push({
      test: 'Performance',
      success: perfData.success,
      data: perfData.data,
    });
  } catch (error) {
    results.push({
      test: 'Performance',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
  
  // Test 3: Statistiques
  try {
    const stats = await getUpstashCacheStats();
    results.push({
      test: 'Statistics',
      success: true,
      data: stats,
    });
  } catch (error) {
    results.push({
      test: 'Statistics',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
  
  return NextResponse.json({
    success: true,
    action: 'all',
    results,
    summary: {
      total: results.length,
      passed: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
    },
    timestamp: new Date().toISOString(),
  });
}
