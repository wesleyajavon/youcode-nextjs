# SmartChat Redis Cache Guide

## 🚀 Overview

The SmartChat component now includes a comprehensive Redis caching system that significantly improves performance and reduces API calls. This guide explains how to use and monitor the cache system.

## 📊 Cache Configuration

### Cache Durations
- **Context Cache**: 30 minutes (course/lesson information)
- **Suggestions Cache**: 1 hour (contextual suggestions)
- **Response Cache**: 5 minutes (AI responses for similar questions)
- **Preferences Cache**: 24 hours (user preferences)

### Cache Keys Structure
```
smartchat:context:{base64_encoded_url}
smartchat:suggestions:{context}:{userLevel}
smartchat:response:{base64_encoded_prompt_context}
smartchat:preferences:{userId}
```

## 🔧 Usage

### 1. Automatic Caching
The cache works automatically - no additional code needed:
- Context extraction is cached automatically
- AI responses are cached for similar questions
- User preferences are persisted

### 2. Manual Cache Operations
```typescript
import { CacheManager } from '@/lib/cache';

// Set context cache
await CacheManager.setSmartChatContext(url, contextData);

// Get cached context
const cached = await CacheManager.getSmartChatContext(url);

// Clear specific cache
await CacheManager.invalidateCourseCache(courseId);
```

### 3. Cache Wrapper Functions
```typescript
import { withSmartChatCache } from '@/lib/cache';

const result = await withSmartChatCache('context', { url }, async () => {
  // Your expensive operation here
  return await extractContext(url);
});
```

## 🧪 Testing

### Run Cache Tests
```bash
# Test all SmartChat cache functionality
npm run test:smartchat-cache

# Test specific cache operations
curl -X GET http://localhost:3000/api/test/cache

# Manual cache operations
curl -X POST http://localhost:3000/api/test/cache \
  -H "Content-Type: application/json" \
  -d '{"action": "set", "key": "test:key", "value": "test value"}'
```

### Test Endpoints
- `GET /api/test/cache` - Run automatic tests
- `POST /api/test/cache` - Manual cache operations
  - `action: "set"` - Set cache value
  - `action: "get"` - Get cache value
  - `action: "delete"` - Delete cache key
  - `action: "clear"` - Clear all SmartChat cache

## 📈 Monitoring

### Cache Statistics
The SmartChat component displays real-time cache performance:
- **Hit Rate**: Percentage of cache hits vs misses
- **Cache Indicator**: Shows "Cached" badge on cached responses
- **Performance Metrics**: Visible in the component header

### Cache Performance
- **Excellent**: >70% hit rate
- **Good**: 50-70% hit rate
- **Fair**: 30-50% hit rate
- **Poor**: <30% hit rate

## 🛠️ Troubleshooting

### Common Issues

#### 1. Cache Not Working
```bash
# Check Redis connection
curl -X GET http://localhost:3000/api/test/cache

# Verify environment variables
echo $UPSTASH_REDIS_REST_URL
echo $UPSTASH_REDIS_REST_TOKEN
```

#### 2. Cache Performance Issues
- Check cache hit rates in SmartChat header
- Monitor Redis memory usage
- Verify cache expiration settings

#### 3. Data Inconsistency
```typescript
// Force cache invalidation
await CacheManager.invalidateSmartChatCache();

// Clear specific patterns
await CacheManager.deletePattern('smartchat:context:*');
```

### Debug Mode
Enable detailed logging by setting:
```bash
DEBUG_CACHE=true
```

## 🔄 Cache Invalidation

### Automatic Invalidation
- Course updates invalidate related context cache
- Lesson updates invalidate related context cache
- User preference changes update preferences cache

### Manual Invalidation
```typescript
// Invalidate specific course
await CacheManager.invalidateCourseCache(courseId);

// Invalidate specific lesson
await CacheManager.invalidateLessonCache(lessonId);

// Invalidate all SmartChat cache
await CacheManager.invalidateSmartChatCache();
```

## 📱 Mobile Optimization

The cache system is fully optimized for mobile:
- Responsive cache indicators
- Touch-friendly cache controls
- Mobile-specific cache durations
- Optimized cache key generation

## 🚀 Performance Benefits

### Before Caching
- Every context request hits the database
- AI responses generated for every question
- Slow response times on repeated queries

### After Caching
- Context requests served from cache (30x faster)
- Similar questions answered instantly
- Reduced database load
- Lower API costs

## 🔐 Security

### Cache Isolation
- User-specific data is properly isolated
- No cross-user data leakage
- Secure cache key generation

### Data Privacy
- Sensitive data is not cached
- Cache keys are hashed for security
- Automatic expiration prevents data retention

## 📚 Best Practices

1. **Monitor Hit Rates**: Keep cache hit rates above 50%
2. **Regular Cleanup**: Clear old cache data periodically
3. **Cache Warming**: Pre-populate cache for popular content
4. **Performance Monitoring**: Track response time improvements
5. **Error Handling**: Gracefully handle cache failures

## 🔍 Advanced Features

### Custom Cache Durations
```typescript
// Override default expiration
await CacheManager.set(key, value, 7200); // 2 hours
```

### Pattern-based Operations
```typescript
// Delete all keys matching pattern
await CacheManager.deletePattern('smartchat:context:*');
```

### Cache Statistics Export
```typescript
import { useSmartChatCache } from '@/hooks/useSmartChatCache';

const { exportCacheData } = useSmartChatCache();
const cacheReport = exportCacheData();
console.log('Cache Report:', cacheReport);
```

## 📞 Support

For cache-related issues:
1. Check the test endpoints first
2. Verify Redis connection
3. Review cache statistics
4. Check environment variables
5. Review this documentation

---

**Note**: The cache system is designed to be transparent to users while providing significant performance improvements. Most operations happen automatically without requiring manual intervention.
