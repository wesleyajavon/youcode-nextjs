#!/usr/bin/env node

/**
 * Test script for SmartChat Rate Limiting functionality
 * Run with: node scripts/test-smartchat-rate-limits.js
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function testRateLimiting() {
  console.log('🧪 Testing SmartChat Rate Limiting...\n');

  try {
    // Test 1: Check rate limit configuration
    console.log('1️⃣ Testing rate limit configuration...');
    const configResponse = await fetch(`${BASE_URL}/api/ai/context`);
    
    if (configResponse.ok) {
      const config = await configResponse.json();
      console.log('✅ Context API config retrieved');
      console.log('   Rate limits:', config.rateLimits);
    } else {
      console.log('❌ Failed to get config:', configResponse.status);
    }

    // Test 2: Test context API rate limiting
    console.log('\n2️⃣ Testing context API rate limiting...');
    const testUrl = 'https://youcode-nextjs.vercel.app/user/courses/test-course/lessons/test-lesson';
    
    let contextRequests = 0;
    const maxContextRequests = 35; // Should hit the 30 per minute limit
    
    for (let i = 0; i < maxContextRequests; i++) {
      try {
        const response = await fetch(`${BASE_URL}/api/ai/context`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-User-ID': `test-user-${Date.now()}` // Unique user for testing
          },
          body: JSON.stringify({ url: testUrl })
        });
        
        if (response.ok) {
          contextRequests++;
          const data = await response.json();
          
          // Check rate limit headers
          const remaining = response.headers.get('X-RateLimit-Remaining');
          const limit = response.headers.get('X-RateLimit-Limit');
          const reset = response.headers.get('X-RateLimit-Reset');
          
          if (i === 0) {
            console.log(`   First request: ${remaining}/${limit} remaining, resets at ${new Date(parseInt(reset)).toLocaleTimeString()}`);
          }
          
          if (remaining === '0') {
            console.log(`   Rate limit hit after ${contextRequests} requests`);
            break;
          }
        } else if (response.status === 429) {
          const errorData = await response.json();
          console.log(`   Rate limit exceeded: ${errorData.details}`);
          console.log(`   Retry after: ${errorData.retryAfter} seconds`);
          break;
        } else {
          console.log(`   Request failed with status: ${response.status}`);
          break;
        }
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`   Request ${i + 1} failed:`, error.message);
        break;
      }
    }
    
    console.log(`   Total context requests made: ${contextRequests}`);

    // Test 3: Test AI assistant rate limiting
    console.log('\n3️⃣ Testing AI assistant rate limiting...');
    const testPrompt = 'What is JavaScript?';
    
    let aiRequests = 0;
    const maxAIRequests = 15; // Should hit the 10 per minute limit
    
    for (let i = 0; i < maxAIRequests; i++) {
      try {
        const response = await fetch(`${BASE_URL}/api/ai/assistant`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-User-ID': `test-user-${Date.now()}` // Unique user for testing
          },
          body: JSON.stringify({
            messages: [
              { role: 'user', content: testPrompt }
            ],
            courseContext: 'Test Course',
            lessonContext: 'Test Lesson',
            userLevel: 'beginner'
          })
        });
        
        if (response.ok) {
          aiRequests++;
          const remaining = response.headers.get('X-RateLimit-Remaining');
          const limit = response.headers.get('X-RateLimit-Limit');
          const dailyRemaining = response.headers.get('X-Daily-Remaining');
          
          if (i === 0) {
            console.log(`   First AI request: ${remaining}/${limit} remaining, daily remaining: ${dailyRemaining}`);
          }
          
          if (remaining === '0') {
            console.log(`   AI rate limit hit after ${aiRequests} requests`);
            break;
          }
        } else if (response.status === 429) {
          const errorData = await response.json();
          console.log(`   AI rate limit exceeded: ${errorData.details}`);
          console.log(`   Retry after: ${errorData.retryAfter} seconds`);
          break;
        } else {
          console.log(`   AI request failed with status: ${response.status}`);
          break;
        }
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`   AI request ${i + 1} failed:`, error.message);
        break;
      }
    }
    
    console.log(`   Total AI requests made: ${aiRequests}`);

    // Test 4: Test rate limit headers
    console.log('\n4️⃣ Testing rate limit headers...');
    const headerTestResponse = await fetch(`${BASE_URL}/api/ai/context`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': 'header-test-user'
      },
      body: JSON.stringify({ url: testUrl })
    });
    
    if (headerTestResponse.ok) {
      const headers = headerTestResponse.headers;
      console.log('✅ Rate limit headers present:');
      console.log('   X-RateLimit-Limit:', headers.get('X-RateLimit-Limit'));
      console.log('   X-RateLimit-Remaining:', headers.get('X-RateLimit-Remaining'));
      console.log('   X-RateLimit-Reset:', headers.get('X-RateLimit-Reset'));
      
      const resetTime = new Date(parseInt(headers.get('X-RateLimit-Reset')));
      console.log('   Reset time:', resetTime.toLocaleString());
    }

    console.log('\n🎉 Rate limiting tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run tests
testRateLimiting().catch(console.error);
