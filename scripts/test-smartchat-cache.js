#!/usr/bin/env node

/**
 * Test script for SmartChat Redis cache functionality
 * Run with: node scripts/test-smartchat-cache.js
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function testCache() {
  console.log('🧪 Testing SmartChat Redis Cache...\n');

  try {
    // Test 1: Basic cache functionality
    console.log('1️⃣ Testing basic cache operations...');
    const testResponse = await fetch(`${BASE_URL}/api/test/cache`, {
      method: 'GET'
    });
    
    if (testResponse.ok) {
      const result = await testResponse.json();
      console.log('✅ Basic cache test:', result.message);
      console.log('   Tests passed:', Object.values(result.tests).filter(t => t === 'PASSED').length, '/', Object.keys(result.tests).length);
    } else {
      console.log('❌ Basic cache test failed:', testResponse.status);
    }

    // Test 2: Context API with cache
    console.log('\n2️⃣ Testing context API caching...');
    const testUrl = 'https://youcode-nextjs.vercel.app/user/courses/test-course/lessons/test-lesson';
    
    // First request (should miss cache)
    const contextResponse1 = await fetch(`${BASE_URL}/api/ai/context`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: testUrl })
    });
    
    if (contextResponse1.ok) {
      const context1 = await contextResponse1.json();
      console.log('   First request cached:', context1.cached);
      
      // Second request (should hit cache)
      const contextResponse2 = await fetch(`${BASE_URL}/api/ai/context`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: testUrl })
      });
      
      if (contextResponse2.ok) {
        const context2 = await contextResponse2.json();
        console.log('   Second request cached:', context2.cached);
        console.log('   Cache working:', context1.cached === false && context2.cached === true ? '✅' : '❌');
      }
    }

    // Test 3: Manual cache operations
    console.log('\n3️⃣ Testing manual cache operations...');
    const manualResponse = await fetch(`${BASE_URL}/api/test/cache`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'set',
        key: 'test:manual',
        value: { message: 'Manual test', timestamp: Date.now() },
        expiration: 60
      })
    });
    
    if (manualResponse.ok) {
      const manualResult = await manualResponse.json();
      console.log('   Set operation:', manualResult.success ? '✅' : '❌');
      
      // Test get
      const getResponse = await fetch(`${BASE_URL}/api/test/cache`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'get',
          key: 'test:manual'
        })
      });
      
      if (getResponse.ok) {
        const getResult = await getResponse.json();
        console.log('   Get operation:', getResult.success ? '✅' : '❌');
        console.log('   Retrieved value:', getResult.value?.message || 'null');
      }
      
      // Clean up
      await fetch(`${BASE_URL}/api/test/cache`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          key: 'test:manual'
        })
      });
    }

    console.log('\n🎉 Cache testing completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run tests
testCache().catch(console.error);
