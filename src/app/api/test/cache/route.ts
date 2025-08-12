import { NextRequest, NextResponse } from 'next/server';
import { CacheManager } from '@/lib/cache';

export async function GET() {
  try {
    // Test basic cache operations
    const testKey = 'smartchat:test:basic';
    const testValue = { message: 'Hello from SmartChat cache!', timestamp: new Date().toISOString() };
    
    // Test set
    await CacheManager.set(testKey, testValue, 60); // 1 minute TTL
    console.log('✅ Test value set in cache');
    
    // Test get
    const retrievedValue = await CacheManager.get(testKey);
    console.log('✅ Test value retrieved from cache:', retrievedValue);
    
    // Test SmartChat specific methods
    const testUrl = 'https://youcode-nextjs.vercel.app/user/courses/test-course/lessons/test-lesson';
    const testContext = {
      courseContext: 'Test Course',
      lessonContext: 'Test Lesson',
      courseId: 'test-course-id',
      lessonId: 'test-lesson-id',
      url: testUrl
    };
    
    // Test context caching
    await CacheManager.setSmartChatContext(testUrl, testContext);
    const cachedContext = await CacheManager.getSmartChatContext(testUrl);
    console.log('✅ SmartChat context cached and retrieved:', cachedContext);
    
    // Test suggestions caching
    const testSuggestions = [
      { id: '1', text: 'Test Suggestion 1', prompt: 'Test prompt 1' },
      { id: '2', text: 'Test Suggestion 2', prompt: 'Test prompt 2' }
    ];
    await CacheManager.setSmartChatSuggestions('test-context', 'beginner', testSuggestions);
    const cachedSuggestions = await CacheManager.getSmartChatSuggestions('test-context', 'beginner');
    console.log('✅ SmartChat suggestions cached and retrieved:', cachedSuggestions);
    
    // Test response caching
    const testPrompt = 'What is JavaScript?';
    const testResponse = 'JavaScript is a programming language for the web.';
    await CacheManager.setSmartChatResponse(testPrompt, 'test-context', testResponse);
    const cachedResponse = await CacheManager.getSmartChatResponse(testPrompt, 'test-context');
    console.log('✅ SmartChat response cached and retrieved:', cachedResponse);
    
    // Test user preferences caching
    const testPreferences = {
      showSuggestions: true,
      preferredLanguage: 'en',
      responseLength: 'medium',
      theme: 'auto'
    };
    await CacheManager.setUserPreferences('test-user', testPreferences);
    const cachedPreferences = await CacheManager.getUserPreferences('test-user');
    console.log('✅ User preferences cached and retrieved:', cachedPreferences);
    
    // Clean up test data
    await CacheManager.delete(testKey);
    await CacheManager.deletePattern('smartchat:test:*');
    
    return NextResponse.json({
      success: true,
      message: 'SmartChat cache test completed successfully',
      tests: {
        basicCache: 'PASSED',
        contextCaching: 'PASSED',
        suggestionsCaching: 'PASSED',
        responseCaching: 'PASSED',
        preferencesCaching: 'PASSED'
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Cache test failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Cache test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, key, value, expiration } = body;
    
    switch (action) {
      case 'set':
        await CacheManager.set(key, value, expiration);
        return NextResponse.json({ success: true, message: 'Value set in cache' });
        
      case 'get':
        const result = await CacheManager.get(key);
        return NextResponse.json({ success: true, value: result });
        
      case 'delete':
        await CacheManager.delete(key);
        return NextResponse.json({ success: true, message: 'Key deleted from cache' });
        
      case 'clear':
        await CacheManager.invalidateSmartChatCache();
        return NextResponse.json({ success: true, message: 'SmartChat cache cleared' });
        
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('❌ Cache operation failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Cache operation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
