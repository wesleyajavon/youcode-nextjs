import { UpstashCacheManager, withUpstashCache, UPSTASH_CACHE_CONFIG } from '../cache-upstash';

// Interface pour les résultats de test
interface UnitTestResult {
  testName: string;
  passed: boolean;
  duration: number;
  details?: any;
  error?: string;
}

// Classe pour les tests unitaires
export class CacheUnitTester {
  private results: UnitTestResult[] = [];

  // Test 1: Génération de clés
  async testKeyGeneration(): Promise<UnitTestResult> {
    const testName = 'Key Generation';
    const startTime = Date.now();
    
    try {
      // Test avec paramètres identiques mais ordre différent
      const params1 = { userId: '123', page: 1, limit: 10 };
      const params2 = { userId: '123', limit: 10, page: 1 };
      
      const key1 = UpstashCacheManager.generateKey('test', params1);
      const key2 = UpstashCacheManager.generateKey('test', params2);
      
      const passed = key1 === key2;
      const duration = Date.now() - startTime;
      
      return {
        testName,
        passed,
        duration,
        details: { key1, key2, match: passed }
      };
    } catch (error) {
      return {
        testName,
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Test 2: Opérations GET/SET
  async testGetSetOperations(): Promise<UnitTestResult> {
    const testName = 'GET/SET Operations';
    const startTime = Date.now();
    
    try {
      const testKey = 'unit:test:getset';
      const testData = { 
        message: 'Unit test data', 
        timestamp: Date.now(),
        nested: { value: 42 }
      };
      
      // Test SET
      await UpstashCacheManager.set(testKey, testData, 60);
      
      // Test GET
      const retrieved = await UpstashCacheManager.get(testKey);
      
      // Test EXISTS
      const exists = await UpstashCacheManager.exists(testKey);
      
      const passed = JSON.stringify(retrieved) === JSON.stringify(testData) && exists;
      const duration = Date.now() - startTime;
      
      // Cleanup
      await UpstashCacheManager.delete(testKey);
      
      return {
        testName,
        passed,
        duration,
        details: { 
          original: testData, 
          retrieved, 
          exists,
          match: JSON.stringify(retrieved) === JSON.stringify(testData)
        }
      };
    } catch (error) {
      return {
        testName,
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Test 3: Cache wrapper function
  async testCacheWrapper(): Promise<UnitTestResult> {
    const testName = 'Cache Wrapper Function';
    const startTime = Date.now();
    
    try {
      let callCount = 0;
      const expensiveFunction = async () => {
        callCount++;
        await new Promise(resolve => setTimeout(resolve, 50));
        return { data: 'Expensive result', callCount, timestamp: Date.now() };
      };
      
      const cacheKey = 'unit:test:wrapper';
      
      // Premier appel (MISS)
      const result1 = await withUpstashCache(cacheKey, expensiveFunction, 60);
      
      // Deuxième appel (HIT)
      const result2 = await withUpstashCache(cacheKey, expensiveFunction, 60);
      
      const passed = result1.callCount === 1 && result2.callCount === 1;
      const duration = Date.now() - startTime;
      
      // Cleanup
      await UpstashCacheManager.delete(cacheKey);
      
      return {
        testName,
        passed,
        duration,
        details: { 
          firstCall: result1, 
          secondCall: result2,
          cacheHit: result1.callCount === result2.callCount
        }
      };
    } catch (error) {
      return {
        testName,
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Test 4: Expiration du cache
  async testCacheExpiration(): Promise<UnitTestResult> {
    const testName = 'Cache Expiration';
    const startTime = Date.now();
    
    try {
      const testKey = 'unit:test:expiration';
      const testData = { message: 'Expiring data' };
      
      // Setter avec expiration courte (1 seconde)
      await UpstashCacheManager.set(testKey, testData, 1);
      
      // Vérifier immédiatement
      const immediate = await UpstashCacheManager.get(testKey);
      if (!immediate) throw new Error('Data not set properly');
      
      // Attendre l'expiration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Vérifier l'expiration
      const expired = await UpstashCacheManager.get(testKey);
      
      const passed = expired === null;
      const duration = Date.now() - startTime;
      
      return {
        testName,
        passed,
        duration,
        details: { 
          immediate: !!immediate, 
          expired: expired === null,
          waitTime: '2 seconds'
        }
      };
    } catch (error) {
      return {
        testName,
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Test 5: Invalidation du cache
  async testCacheInvalidation(): Promise<UnitTestResult> {
    const testName = 'Cache Invalidation';
    const startTime = Date.now();
    
    try {
      const testKey = 'unit:test:invalidation';
      const testData = { message: 'Data to invalidate' };
      
      // Setter des données
      await UpstashCacheManager.set(testKey, testData, 60);
      
      // Vérifier l'existence
      const existsBefore = await UpstashCacheManager.exists(testKey);
      if (!existsBefore) throw new Error('Data not set properly');
      
      // Supprimer
      await UpstashCacheManager.delete(testKey);
      
      // Vérifier la suppression
      const existsAfter = await UpstashCacheManager.exists(testKey);
      
      const passed = !existsAfter;
      const duration = Date.now() - startTime;
      
      return {
        testName,
        passed,
        duration,
        details: { 
          existsBefore, 
          existsAfter,
          deleted: !existsAfter
        }
      };
    } catch (error) {
      return {
        testName,
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Test 6: Performance avec cache
  async testCachePerformance(): Promise<UnitTestResult> {
    const testName = 'Cache Performance';
    const startTime = Date.now();
    
    try {
      const cacheKey = 'unit:test:performance';
      const expensiveOperation = async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return { data: 'Performance test', timestamp: Date.now() };
      };
      
      // Mesurer sans cache
      const startWithoutCache = Date.now();
      await expensiveOperation();
      const durationWithoutCache = Date.now() - startWithoutCache;
      
      // Mesurer avec cache (premier appel)
      const startWithCache1 = Date.now();
      await withUpstashCache(cacheKey, expensiveOperation, 60);
      const durationWithCache1 = Date.now() - startWithCache1;
      
      // Mesurer avec cache (deuxième appel - HIT)
      const startWithCache2 = Date.now();
      await withUpstashCache(cacheKey, expensiveOperation, 60);
      const durationWithCache2 = Date.now() - startWithCache2;
      
      const improvement = Math.round(((durationWithoutCache - durationWithCache2) / durationWithoutCache) * 100);
      const passed = durationWithCache2 < durationWithoutCache;
      const duration = Date.now() - startTime;
      
      // Cleanup
      await UpstashCacheManager.delete(cacheKey);
      
      return {
        testName,
        passed,
        duration,
        details: { 
          withoutCache: durationWithoutCache,
          withCacheFirst: durationWithCache1,
          withCacheSecond: durationWithCache2,
          improvement: `${improvement}%`
        }
      };
    } catch (error) {
      return {
        testName,
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Exécuter tous les tests
  async runAllTests(): Promise<void> {
    console.log('🧪 Running Cache Unit Tests...\n');
    
    const tests = [
      this.testKeyGeneration.bind(this),
      this.testGetSetOperations.bind(this),
      this.testCacheWrapper.bind(this),
      this.testCacheExpiration.bind(this),
      this.testCacheInvalidation.bind(this),
      this.testCachePerformance.bind(this),
    ];
    
    for (const test of tests) {
      try {
        const result = await test();
        this.results.push(result);
        
        const status = result.passed ? '✅ PASS' : '❌ FAIL';
        console.log(`${status} ${result.testName} (${result.duration}ms)`);
        
        if (result.error) {
          console.log(`   Error: ${result.error}`);
        }
        
        if (result.details) {
          console.log(`   Details:`, result.details);
        }
      } catch (error) {
        const failedResult: UnitTestResult = {
          testName: 'Unknown Test',
          passed: false,
          duration: 0,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
        this.results.push(failedResult);
        console.log(`❌ Test failed: ${error}`);
      }
    }
    
    this.printSummary();
  }

  // Afficher le résumé
  printSummary(): void {
    const total = this.results.length;
    const passed = this.results.filter(r => r.passed).length;
    const failed = total - passed;
    const avgDuration = this.results.reduce((sum, r) => sum + r.duration, 0) / total;
    
    console.log('\n📋 Unit Test Summary:');
    console.log(`  Total Tests: ${total}`);
    console.log(`  Passed: ${passed}`);
    console.log(`  Failed: ${failed}`);
    console.log(`  Success Rate: ${Math.round((passed / total) * 100)}%`);
    console.log(`  Average Duration: ${Math.round(avgDuration)}ms`);
    
    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results
        .filter(r => !r.passed)
        .forEach(r => console.log(`  - ${r.testName}: ${r.error}`));
    }
  }

  // Obtenir les résultats
  getResults(): UnitTestResult[] {
    return this.results;
  }
}

// Fonction pour exécuter les tests unitaires
export async function runCacheUnitTests(): Promise<UnitTestResult[]> {
  const tester = new CacheUnitTester();
  await tester.runAllTests();
  return tester.getResults();
}

// Fonction pour tester une fonction spécifique avec cache
export async function testFunctionWithCache<T>(
  name: string,
  fn: () => Promise<T>,
  cacheKey: string,
  expectedResult?: T
): Promise<UnitTestResult> {
  const testName = `Function Test: ${name}`;
  const startTime = Date.now();
  
  try {
    // Premier appel (MISS)
    const result1 = await withUpstashCache(cacheKey, fn, 60);
    
    // Deuxième appel (HIT)
    const result2 = await withUpstashCache(cacheKey, fn, 60);
    
    const passed = expectedResult ? JSON.stringify(result1) === JSON.stringify(expectedResult) : true;
    const duration = Date.now() - startTime;
    
    // Cleanup
    await UpstashCacheManager.delete(cacheKey);
    
    return {
      testName,
      passed,
      duration,
      details: { 
        firstResult: result1, 
        secondResult: result2,
        cacheHit: JSON.stringify(result1) === JSON.stringify(result2)
      }
    };
  } catch (error) {
    return {
      testName,
      passed: false,
      duration: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
