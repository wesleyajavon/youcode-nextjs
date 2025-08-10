import { UpstashCacheManager, withUpstashCache, UPSTASH_CACHE_CONFIG } from '../cache-upstash';
import { logUpstashCacheStats } from '../cache-upstash';

// Types pour les tests
interface TestResult {
  testName: string;
  success: boolean;
  duration: number;
  cacheHit: boolean;
  error?: string;
}

interface PerformanceTest {
  operation: string;
  duration: number;
  cacheHit: boolean;
}

// Classe pour tester le cache
export class CacheTester {
  private results: TestResult[] = [];
  private performanceTests: PerformanceTest[] = [];

  // Test 1: Cache basique - GET/SET
  async testBasicCache(): Promise<TestResult> {
    const testName = 'Basic Cache GET/SET';
    const startTime = Date.now();
    
    try {
      const testKey = 'test:basic';
      const testData = { message: 'Hello Cache!', timestamp: Date.now() };
      
      // Test SET
      await UpstashCacheManager.set(testKey, testData, 60);
      
      // Test GET
      const retrieved = await UpstashCacheManager.get(testKey);
      
      const success = JSON.stringify(retrieved) === JSON.stringify(testData);
      const duration = Date.now() - startTime;
      
      const result: TestResult = {
        testName,
        success,
        duration,
        cacheHit: false, // Pas de cache hit car on vient de setter
      };
      
      this.results.push(result);
      return result;
    } catch (error) {
      const result: TestResult = {
        testName,
        success: false,
        duration: Date.now() - startTime,
        cacheHit: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      this.results.push(result);
      return result;
    }
  }

  // Test 2: Cache avec withUpstashCache
  async testWithCacheWrapper(): Promise<TestResult> {
    const testName = 'Cache Wrapper Function';
    const startTime = Date.now();
    
    try {
      let callCount = 0;
      
      const expensiveFunction = async () => {
        callCount++;
        // Simulation d'une opération coûteuse
        await new Promise(resolve => setTimeout(resolve, 100));
        return { data: 'Expensive data', callCount, timestamp: Date.now() };
      };
      
      const cacheKey = 'test:expensive';
      
      // Premier appel - devrait être un MISS
      const result1 = await withUpstashCache(cacheKey, expensiveFunction, 60);
      
      // Deuxième appel - devrait être un HIT
      const result2 = await withUpstashCache(cacheKey, expensiveFunction, 60);
      
      const success = result1.callCount === 1 && result2.callCount === 1; // Même callCount = cache hit
      const duration = Date.now() - startTime;
      
      const result: TestResult = {
        testName,
        success,
        duration,
        cacheHit: true,
      };
      
      this.results.push(result);
      return result;
    } catch (error) {
      const result: TestResult = {
        testName,
        success: false,
        duration: Date.now() - startTime,
        cacheHit: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      this.results.push(result);
      return result;
    }
  }

  // Test 3: Performance - Comparaison avec/sans cache
  async testPerformance(): Promise<TestResult> {
    const testName = 'Performance Comparison';
    const startTime = Date.now();
    
    try {
      const cacheKey = 'test:performance';
      let totalWithoutCache = 0;
      let totalWithCache = 0;
      
      // Simulation d'une fonction coûteuse
      const expensiveOperation = async () => {
        await new Promise(resolve => setTimeout(resolve, 200)); // 200ms simulation
        return { data: 'Performance test data' };
      };
      
      // Test sans cache (3 appels)
      for (let i = 0; i < 3; i++) {
        const start = Date.now();
        await expensiveOperation();
        totalWithoutCache += Date.now() - start;
      }
      
      // Test avec cache (3 appels)
      for (let i = 0; i < 3; i++) {
        const start = Date.now();
        await withUpstashCache(cacheKey, expensiveOperation, 60);
        totalWithCache += Date.now() - start;
      }
      
      const success = totalWithCache < totalWithoutCache; // Cache devrait être plus rapide
      const duration = Date.now() - startTime;
      
      console.log(`Performance Test Results:`);
      console.log(`  Without cache: ${totalWithoutCache}ms`);
      console.log(`  With cache: ${totalWithCache}ms`);
      console.log(`  Improvement: ${Math.round(((totalWithoutCache - totalWithCache) / totalWithoutCache) * 100)}%`);
      
      const result: TestResult = {
        testName,
        success,
        duration,
        cacheHit: true,
      };
      
      this.results.push(result);
      return result;
    } catch (error) {
      const result: TestResult = {
        testName,
        success: false,
        duration: Date.now() - startTime,
        cacheHit: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      this.results.push(result);
      return result;
    }
  }

  // Test 4: Invalidation du cache
  async testCacheInvalidation(): Promise<TestResult> {
    const testName = 'Cache Invalidation';
    const startTime = Date.now();
    
    try {
      const testKey = 'test:invalidation';
      const testData = { message: 'Original data' };
      
      // Setter des données
      await UpstashCacheManager.set(testKey, testData, 60);
      
      // Vérifier qu'elles existent
      const exists = await UpstashCacheManager.exists(testKey);
      if (!exists) throw new Error('Data not set properly');
      
      // Supprimer le cache
      await UpstashCacheManager.delete(testKey);
      
      // Vérifier qu'elles n'existent plus
      const stillExists = await UpstashCacheManager.exists(testKey);
      
      const success = !stillExists;
      const duration = Date.now() - startTime;
      
      const result: TestResult = {
        testName,
        success,
        duration,
        cacheHit: false,
      };
      
      this.results.push(result);
      return result;
    } catch (error) {
      const result: TestResult = {
        testName,
        success: false,
        duration: Date.now() - startTime,
        cacheHit: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      this.results.push(result);
      return result;
    }
  }

  // Test 5: Génération de clés
  async testKeyGeneration(): Promise<TestResult> {
    const testName = 'Key Generation';
    const startTime = Date.now();
    
    try {
      const params1 = { userId: '123', page: 1, limit: 10 };
      const params2 = { userId: '123', limit: 10, page: 1 }; // Même données, ordre différent
      
      const key1 = UpstashCacheManager.generateKey('test', params1);
      const key2 = UpstashCacheManager.generateKey('test', params2);
      
      const success = key1 === key2; // Les clés doivent être identiques
      const duration = Date.now() - startTime;
      
      console.log(`Key Generation Test:`);
      console.log(`  Key 1: ${key1}`);
      console.log(`  Key 2: ${key2}`);
      console.log(`  Match: ${success}`);
      
      const result: TestResult = {
        testName,
        success,
        duration,
        cacheHit: false,
      };
      
      this.results.push(result);
      return result;
    } catch (error) {
      const result: TestResult = {
        testName,
        success: false,
        duration: Date.now() - startTime,
        cacheHit: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      this.results.push(result);
      return result;
    }
  }

  // Test 6: Expiration du cache
  async testCacheExpiration(): Promise<TestResult> {
    const testName = 'Cache Expiration';
    const startTime = Date.now();
    
    try {
      const testKey = 'test:expiration';
      const testData = { message: 'Expiring data' };
      
      // Setter avec expiration courte (2 secondes)
      await UpstashCacheManager.set(testKey, testData, 2);
      
      // Vérifier qu'elles existent immédiatement
      const immediate = await UpstashCacheManager.get(testKey);
      if (!immediate) throw new Error('Data not set properly');
      
      // Attendre l'expiration
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Vérifier qu'elles ont expiré
      const expired = await UpstashCacheManager.get(testKey);
      
      const success = expired === null;
      const duration = Date.now() - startTime;
      
      const result: TestResult = {
        testName,
        success,
        duration,
        cacheHit: false,
      };
      
      this.results.push(result);
      return result;
    } catch (error) {
      const result: TestResult = {
        testName,
        success: false,
        duration: Date.now() - startTime,
        cacheHit: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      this.results.push(result);
      return result;
    }
  }

  // Exécuter tous les tests
  async runAllTests(): Promise<void> {
    console.log('🚀 Starting Cache Tests...\n');
    
    const tests = [
      this.testBasicCache.bind(this),
      this.testWithCacheWrapper.bind(this),
      this.testPerformance.bind(this),
      this.testCacheInvalidation.bind(this),
      this.testKeyGeneration.bind(this),
      this.testCacheExpiration.bind(this),
    ];
    
    for (const test of tests) {
      try {
        const result = await test();
        console.log(`✅ ${result.testName}: ${result.success ? 'PASSED' : 'FAILED'} (${result.duration}ms)`);
        if (result.error) {
          console.log(`   Error: ${result.error}`);
        }
      } catch (error) {
        console.log(`❌ Test failed with error: ${error}`);
      }
    }
    
    // Afficher les statistiques du cache
    console.log('\n📊 Cache Statistics:');
    await logUpstashCacheStats();
    
    // Afficher le résumé
    this.printSummary();
  }

  // Afficher le résumé des tests
  printSummary(): void {
    const total = this.results.length;
    const passed = this.results.filter(r => r.success).length;
    const failed = total - passed;
    const avgDuration = this.results.reduce((sum, r) => sum + r.duration, 0) / total;
    
    console.log('\n📋 Test Summary:');
    console.log(`  Total Tests: ${total}`);
    console.log(`  Passed: ${passed}`);
    console.log(`  Failed: ${failed}`);
    console.log(`  Success Rate: ${Math.round((passed / total) * 100)}%`);
    console.log(`  Average Duration: ${Math.round(avgDuration)}ms`);
    
    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results
        .filter(r => !r.success)
        .forEach(r => console.log(`  - ${r.testName}: ${r.error}`));
    }
  }

  // Nettoyer le cache après les tests
  async cleanup(): Promise<void> {
    console.log('\n🧹 Cleaning up test data...');
    await UpstashCacheManager.clearAll();
    console.log('✅ Cleanup completed');
  }
}

// Fonction pour exécuter les tests
export async function runCacheTests(): Promise<void> {
  const tester = new CacheTester();
  
  try {
    await tester.runAllTests();
  } finally {
    await tester.cleanup();
  }
}

// Fonction pour tester une route API spécifique
export async function testApiRoute(route: string): Promise<void> {
  console.log(`🔍 Testing API Route: ${route}`);
  
  const startTime = Date.now();
  
  try {
    const response = await fetch(route);
    const data = await response.json();
    
    const duration = Date.now() - startTime;
    
    console.log(`✅ Route ${route}:`);
    console.log(`  Status: ${response.status}`);
    console.log(`  Duration: ${duration}ms`);
    console.log(`  Data Keys: ${Object.keys(data).join(', ')}`);
    
    // Deuxième appel pour tester le cache
    const startTime2 = Date.now();
    const response2 = await fetch(route);
    const data2 = await response2.json();
    const duration2 = Date.now() - startTime2;
    
    console.log(`  Second call duration: ${duration2}ms`);
    console.log(`  Cache improvement: ${Math.round(((duration - duration2) / duration) * 100)}%`);
    
  } catch (error) {
    console.log(`❌ Error testing route ${route}: ${error}`);
  }
}
