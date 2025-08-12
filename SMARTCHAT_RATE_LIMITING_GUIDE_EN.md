# SmartChat Rate Limiting System Documentation

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Configuration](#configuration)
4. [Implementation](#implementation)
5. [Usage](#usage)
6. [Testing](#testing)
7. [Monitoring](#monitoring)
8. [Troubleshooting](#troubleshooting)
9. [API Reference](#api-reference)

## 🎯 Overview

The SmartChat rate limiting system protects the YouCode AI API against abuse, overload, and ensures fair usage among all users. It uses **Upstash Redis** with the `@upstash/ratelimit` library for efficient limit management.

### **Main objectives:**
- 🛡️ **Spam protection** : Limits requests per user
- ⚡ **Load management** : Prevents system overload
- 🎯 **Fair usage** : Gives everyone equal access
- 🚀 **Stability** : Protects against infinite loops and abuse

## 🏗️ Architecture

### **System components:**

```
src/lib/rate-limit.ts          # Rate limiter configuration
src/app/api/ai/context/route.ts    # Context API with rate limiting
src/app/api/ai/assistant/route.ts  # Assistant API with rate limiting
src/components/ai/RateLimitInfo.tsx # Limit display component
```

### **Rate limiting flow:**

```
Request → User identification → Limit verification → Processing/Rejection
                ↓
        Headers, JWT, or IP
                ↓
        Upstash rate limiters
                ↓
        Response with X-RateLimit headers
```

## ⚙️ Configuration

### **Configured rate limiters:**

```typescript
// Context API - Context extraction
export const ratelimitSmartChatContext = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "1m"), // 30 req/min
});

// AI Assistant - Response generation
export const ratelimitSmartChatAI = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1m"), // 10 req/min
});

// Daily limit - Usage control
export const ratelimitSmartChatDaily = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(500, "1d"), // 500 req/day
});

// Global protection - All users
export const ratelimitSmartChatGlobal = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1000, "1m"), // 1000 req/min
});
```

### **Default limits:**

| Service | Limit | Window | Description |
|---------|--------|---------|-------------|
| **Context** | 30 | 1 minute | URL context extraction |
| **AI Assistant** | 10 | 1 minute | AI response generation |
| **AI Daily** | 500 | 1 day | Daily limit per user |
| **Global** | 1000 | 1 minute | All requests combined |

## 🔧 Implementation

### **1. User identification**

```typescript
export function getRateLimitIdentifier(request: Request): string {
  // 1. Custom X-User-ID header
  const userId = request.headers.get('x-user-id');
  if (userId) return `user:${userId}`;
  
  // 2. JWT token from Authorization
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    return `jwt:${token.substring(0, 8)}`;
  }
  
  // 3. IP address fallback
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = realIp || forwardedFor?.split(',')[0] || 'unknown';
  
  return `ip:${ip}`;
}
```

### **2. Limit verification**

```typescript
// Check global limits first
const globalLimit = await ratelimitSmartChatGlobal.limit('global');
if (!globalLimit.success) {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Global rate limit exceeded',
      details: 'Too many requests across all users. Please try again later.',
      retryAfter: globalLimit.reset - Date.now()
    },
    { status: 429 }
  );
}

// Then check user-specific limits
const userLimit = await ratelimitSmartChatAI.limit(identifier);
if (!userLimit.success) {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Rate limit exceeded',
      details: 'Too many requests. Please wait before making more.',
      retryAfter: userLimit.reset - Date.now()
    },
    { status: 429 }
  );
}
```

### **3. Response headers**

```typescript
// Standard rate limiting headers
headers: {
  'X-RateLimit-Limit': '10',
  'X-RateLimit-Remaining': userLimit.remaining.toString(),
  'X-RateLimit-Reset': userLimit.reset.toString(),
  'Retry-After': Math.ceil((userLimit.reset - Date.now()) / 1000).toString()
}
```

## 📱 Usage

### **1. In React components**

```tsx
import { RateLimitInfo } from '@/components/ai/RateLimitInfo';

function SmartChat() {
  return (
    <div>
      {/* Display current limits */}
      <RateLimitInfo 
        className="text-gray-600" 
        showDetails={false} 
      />
    </div>
  );
}
```

### **2. In API calls**

```typescript
// Add user identifier
const response = await fetch('/api/ai/assistant', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-User-ID': 'user-123' // Unique identifier
  },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'Hello AI!' }]
  })
});

// Check rate limiting headers
const remaining = response.headers.get('X-RateLimit-Remaining');
const resetTime = response.headers.get('X-RateLimit-Reset');

if (remaining === '0') {
  console.log('Rate limit reached, retry after:', new Date(parseInt(resetTime)));
}
```

### **3. Handling 429 errors**

```typescript
if (response.status === 429) {
  const errorData = await response.json();
  
  // Display error message
  console.error('Rate limit exceeded:', errorData.details);
  
  // Wait for recommended time
  const retryAfter = errorData.retryAfter;
  setTimeout(() => {
    // Retry request
    retryRequest();
  }, retryAfter);
}
```

## 🧪 Testing

### **Automated test script**

```bash
# Complete rate limiting test
npm run test:smartchat-rate-limits

# SmartChat cache test
npm run test:smartchat-cache
```

### **Manual tests**

```bash
# Test context limits (30/min)
for i in {1..35}; do
  curl -X POST http://localhost:3000/api/ai/context \
    -H "Content-Type: application/json" \
    -H "X-User-ID: test-user-$i" \
    -d '{"url":"https://example.com/course/123"}'
  sleep 0.1
done

# Test AI limits (10/min)
for i in {1..15}; do
  curl -X POST http://localhost:3000/api/ai/assistant \
    -H "Content-Type: application/json" \
    -H "X-User-ID: test-user-$i" \
    -d '{"messages":[{"role":"user","content":"Hello"}]}'
  sleep 0.1
done
```

### **Header verification**

```bash
# Check rate limiting headers
curl -v -X POST http://localhost:3000/api/ai/context \
  -H "Content-Type: application/json" \
  -H "X-User-ID: test-user" \
  -d '{"url":"https://example.com/course/123"}'

# Expected response with headers:
# X-RateLimit-Limit: 30
# X-RateLimit-Remaining: 29
# X-RateLimit-Reset: 1703123456789
```

## 📊 Monitoring

### **1. RateLimitInfo component**

The `RateLimitInfo` component displays in real-time:
- **Context limits** : Remaining requests and reset time
- **AI limits** : Remaining requests and reset time
- **Warnings** : Visual indicators when limits are close

### **2. Monitoring headers**

Each API response includes:
- `X-RateLimit-Limit` : Current limit
- `X-RateLimit-Remaining` : Remaining requests
- `X-RateLimit-Reset` : Reset timestamp
- `Retry-After` : Recommended wait time (seconds)

### **3. Debug logs**

```typescript
// Automatic logs in APIs
console.log('🔍 Extracting context from URL:', url);
console.log('✅ Context retrieved from cache');
console.log('⚠️ Rate limit hit after X requests');
```

## 🔍 Troubleshooting

### **Common issues**

#### **1. 429 "Rate limit exceeded" error**

**Cause** : User has exceeded their limits
**Solution** : Wait for reset or reduce request frequency

```typescript
// Check headers to know the delay
const retryAfter = response.headers.get('Retry-After');
console.log(`Retry in ${retryAfter} seconds`);
```

#### **2. User identification fails**

**Cause** : Missing or malformed headers
**Solution** : Verify presence of `X-User-ID` or `Authorization`

```typescript
// Add identification header
headers: {
  'X-User-ID': 'unique-user-id'
}
```

#### **3. Limits too strict**

**Cause** : Configuration too restrictive for usage
**Solution** : Adjust limits in `src/lib/rate-limit.ts`

```typescript
// Increase limits if necessary
export const ratelimitSmartChatAI = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "1m"), // 20 instead of 10
});
```

### **Advanced debugging**

```typescript
// Enable debug in APIs
console.log('Rate limit identifier:', identifier);
console.log('Global limit result:', globalLimit);
console.log('User limit result:', userLimit);
console.log('Response headers:', response.headers);
```

## 📚 API Reference

### **Rate Limiters**

```typescript
// Import rate limiters
import { 
  ratelimitSmartChatContext,
  ratelimitSmartChatAI,
  ratelimitSmartChatDaily,
  ratelimitSmartChatGlobal,
  getRateLimitIdentifier
} from '@/lib/rate-limit';

// Usage
const identifier = getRateLimitIdentifier(request);
const result = await ratelimitSmartChatAI.limit(identifier);

if (result.success) {
  // Request allowed
  console.log('Remaining requests:', result.remaining);
  console.log('Reset at:', new Date(result.reset));
} else {
  // Limit reached
  console.log('Limit reached, retry after:', new Date(result.reset));
}
```

### **Configuration**

```typescript
export const RATE_LIMIT_CONFIG = {
  SMARTCHAT: {
    CONTEXT: {
      REQUESTS_PER_MINUTE: 30,
      WINDOW: "1m"
    },
    AI: {
      REQUESTS_PER_MINUTE: 10,
      REQUESTS_PER_DAY: 500,
      WINDOW: "1m",
      DAILY_WINDOW: "1d"
    },
    GENERAL: {
      REQUESTS_PER_MINUTE: 20,
      WINDOW: "1m"
    },
    GLOBAL: {
      REQUESTS_PER_MINUTE: 1000,
      WINDOW: "1m"
    }
  }
};
```

### **RateLimitInfo component**

```tsx
interface RateLimitInfoProps {
  className?: string;        // Custom CSS classes
  showDetails?: boolean;     // Show daily details
}

// Usage
<RateLimitInfo 
  className="text-blue-600" 
  showDetails={true} 
/>
```

## 🚀 Best Practices

### **1. User identification**
- ✅ Use `X-User-ID` for clear identification
- ✅ Implement JWT authentication for security
- ✅ IP fallback only as last resort

### **2. Error handling**
- ✅ Always check 429 status
- ✅ Respect `Retry-After` header
- ✅ Inform user about limits

### **3. Monitoring**
- ✅ Display remaining limits in UI
- ✅ Log rate limiting violations
- ✅ Monitor global usage

### **4. Performance**
- ✅ Check global limits first
- ✅ Use Redis cache efficiently
- ✅ Optimize identification queries

## 📝 Important notes

- **Groq API free** : No cost limits, only usage limits
- **Upstash Redis** : Required for rate limiting functionality
- **Sliding Window** : Algorithm used for precise limit management
- **Responsive** : System automatically adapts to mobile devices

---

**Last updated** : December 2024  
**Version** : 1.0.0  
**Maintained by** : YouCode Team
