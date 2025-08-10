#!/usr/bin/env node

/**
 * Script de test pour le cache Redis
 * Usage: node scripts/test-cache.js [option]
 * 
 * Options:
 * - basic: Test de cache basique
 * - performance: Test de performance
 * - stats: Afficher les statistiques
 * - clear: Nettoyer le cache
 * - all: Tous les tests
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function testCache(action = 'all') {
  console.log(`🚀 Testing Cache Redis - Action: ${action}`);
  console.log(`📍 Base URL: ${BASE_URL}\n`);

  const endpoints = {
    basic: '/api/test/cache?action=basic',
    performance: '/api/test/cache?action=performance',
    stats: '/api/test/cache?action=stats',
    clear: '/api/test/cache?action=clear',
    all: '/api/test/cache?action=all',
  };

  const endpoint = endpoints[action] || endpoints.all;

  try {
    console.log(`📡 Calling: ${BASE_URL}${endpoint}`);
    const startTime = Date.now();
    
    const response = await fetch(`${BASE_URL}${endpoint}`);
    const data = await response.json();
    
    const duration = Date.now() - startTime;
    
    console.log(`✅ Response received in ${duration}ms`);
    console.log(`📊 Status: ${response.status}`);
    console.log(`📋 Data:`, JSON.stringify(data, null, 2));
    
    return { success: true, data, duration };
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testApiRoute(route) {
  console.log(`🔍 Testing API Route: ${route}`);
  
  try {
    const startTime = Date.now();
    const response = await fetch(`${BASE_URL}${route}`);
    const data = await response.json();
    const duration = Date.now() - startTime;
    
    console.log(`✅ Route ${route}:`);
    console.log(`  Status: ${response.status}`);
    console.log(`  Duration: ${duration}ms`);
    console.log(`  Data Keys: ${Object.keys(data).join(', ')}`);
    
    // Deuxième appel pour tester le cache
    const startTime2 = Date.now();
    const response2 = await fetch(`${BASE_URL}${route}`);
    const data2 = await response2.json();
    const duration2 = Date.now() - startTime2;
    
    console.log(`  Second call duration: ${duration2}ms`);
    if (duration > 0) {
      const improvement = Math.round(((duration - duration2) / duration) * 100);
      console.log(`  Cache improvement: ${improvement}%`);
    }
    
    return { success: true, duration, duration2 };
  } catch (error) {
    console.log(`❌ Error testing route ${route}: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runInteractiveTests() {
  console.log('🎯 Interactive Cache Testing\n');
  
  const tests = [
    { name: 'Basic Cache Test', action: 'basic' },
    { name: 'Performance Test', action: 'performance' },
    { name: 'Cache Statistics', action: 'stats' },
    { name: 'Clear Cache', action: 'clear' },
    { name: 'All Tests', action: 'all' },
  ];
  
  for (const test of tests) {
    console.log(`\n--- ${test.name} ---`);
    await testCache(test.action);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Pause entre les tests
  }
}

async function runApiRouteTests() {
  console.log('\n🎯 API Route Testing\n');
  
  const routes = [
    '/api/user/courses/test-course-id/lessons',
    '/api/admin/courses',
    '/api/public/lessons',
  ];
  
  for (const route of routes) {
    await testApiRoute(route);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Pause entre les tests
  }
}

async function main() {
  const action = process.argv[2];
  
  if (!action || action === 'help') {
    console.log(`
🎯 Cache Redis Testing Script

Usage: node scripts/test-cache.js [option]

Options:
  basic       - Test de cache basique
  performance - Test de performance
  stats       - Afficher les statistiques
  clear       - Nettoyer le cache
  all         - Tous les tests (défaut)
  interactive - Tests interactifs
  api         - Tests des routes API
  help        - Afficher cette aide

Examples:
  node scripts/test-cache.js basic
  node scripts/test-cache.js performance
  node scripts/test-cache.js interactive
  node scripts/test-cache.js api
`);
    return;
  }
  
  switch (action) {
    case 'interactive':
      await runInteractiveTests();
      break;
    case 'api':
      await runApiRouteTests();
      break;
    default:
      await testCache(action);
  }
  
  console.log('\n✨ Testing completed!');
}

// Gestion des erreurs non capturées
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Exécuter le script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testCache, testApiRoute };
