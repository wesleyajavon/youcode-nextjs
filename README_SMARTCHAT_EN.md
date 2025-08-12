# SmartChat YouCode AI - Usage Guide

## 🚀 Quick Start

### **1. Install dependencies**

```bash
# Install dependencies
npm install

# Or with pnpm
pnpm install
```

### **2. Environment configuration**

Create a `.env.local` file:

```env
# Redis (Upstash)
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# Groq API (optional - fallback available)
GROK_API_KEY=your_grok_api_key

# Base URL for testing
BASE_URL=http://localhost:3000
```

### **3. Start development server**

```bash
npm run dev
```

SmartChat will be available at `http://localhost:3000`

## 🧪 System Testing

### **Rate limiting tests**

```bash
# Complete rate limiting test
npm run test:smartchat-rate-limits

# SmartChat cache test
npm run test:smartchat-cache
```

### **Manual testing with curl**

```bash
# Test context API
curl -X POST http://localhost:3000/api/ai/context \
  -H "Content-Type: application/json" \
  -H "X-User-ID: test-user-123" \
  -d '{"url":"https://youcode.com/courses/javascript-basics"}'

# Test assistant API
curl -X POST http://localhost:3000/api/ai/assistant \
  -H "Content-Type: application/json" \
  -H "X-User-ID: test-user-123" \
  -d '{"messages":[{"role":"user","content":"What is JavaScript?"}]}'
```

## 📱 Using SmartChat

### **1. User interface**

SmartChat appears as a floating button at the bottom right of the screen. Click it to open.

### **2. Available features**

- **💬 AI Chat** : Ask programming questions
- **🎯 Contextual suggestions** : Based on your current course/lesson
- **📊 Limit indicators** : See your remaining quotas
- **💾 Smart cache** : Cached responses for better performance

### **3. Usage limits**

| Service | Limit | Window | Description |
|---------|--------|---------|-------------|
| **Context** | 30 | 1 minute | Context extraction |
| **AI Assistant** | 10 | 1 minute | Response generation |
| **Daily** | 500 | 1 day | Total AI requests |

## 🔧 Integration in your code

### **1. Using SmartChat component**

```tsx
import { SmartChat } from '@/components/ai/SmartChat';

function MyPage() {
  return (
    <div>
      <h1>My page</h1>
      {/* SmartChat will be displayed automatically */}
      <SmartChat position="bottom-right" />
    </div>
  );
}
```

### **2. Direct API calls**

```typescript
// Context extraction
const contextResponse = await fetch('/api/ai/context', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-User-ID': 'user-123' // Important for rate limiting
  },
  body: JSON.stringify({
    url: 'https://youcode.com/courses/javascript-basics'
  })
});

// AI Assistant
const aiResponse = await fetch('/api/ai/assistant', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-User-ID': 'user-123'
  },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'Explain JavaScript closures' }
    ],
    courseContext: 'JavaScript Basics',
    lessonContext: 'Functions and Scope',
    userLevel: 'beginner'
  })
});
```

### **3. Handling rate limiting errors**

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

## 🎨 Customization

### **1. SmartChat position**

```tsx
// Available positions
<SmartChat position="bottom-right" />  // Default
<SmartChat position="bottom-left" />
<SmartChat position="top-right" />
<SmartChat position="top-left" />
```

### **2. Limit display**

```tsx
import { RateLimitInfo } from '@/components/ai/RateLimitInfo';

// Simple display
<RateLimitInfo />

// With daily details
<RateLimitInfo showDetails={true} />

// Custom style
<RateLimitInfo className="text-blue-600 bg-gray-100 p-2 rounded" />
```

### **3. Theme and colors**

SmartChat uses Tailwind CSS and can be customized via CSS classes:

```tsx
// Color customization
<SmartChat className="custom-smartchat-theme" />
```

## 📊 Monitoring and debugging

### **1. Response headers**

Each API response includes rate limiting information:

```http
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 8
X-RateLimit-Reset: 1703123456789
Retry-After: 45
```

### **2. Debug logs**

Enable console logs to see:
- 🔍 Context extraction
- ✅ Cache hits/misses
- ⚠️ Rate limit violations
- 🚨 System errors

### **3. Monitoring component**

The `RateLimitInfo` component displays in real-time:
- Remaining limits
- Reset time
- Visual warnings

## 🚨 Troubleshooting

### **Common issues**

#### **1. "Rate limit exceeded"**

**Cause** : You have exceeded your limits
**Solution** : Wait for reset or reduce frequency

#### **2. SmartChat not displaying**

**Cause** : Component not imported or missing CSS
**Solution** : Check import and Tailwind dependencies

#### **3. Redis cache errors**

**Cause** : Incorrect Redis configuration
**Solution** : Check your Upstash environment variables

### **Advanced debugging**

```typescript
// Enable debug in APIs
console.log('Rate limit identifier:', identifier);
console.log('Cache status:', cachedResponse ? 'hit' : 'miss');
console.log('Response headers:', response.headers);
```

## 📚 Additional resources

- **Complete documentation** : `SMARTCHAT_RATE_LIMITING_GUIDE_EN.md`
- **Automated tests** : `scripts/test-smartchat-rate-limits.js`
- **Cache configuration** : `src/lib/cache.ts`
- **Rate limiting configuration** : `src/lib/rate-limit.ts`

## 🤝 Support

For any questions or issues:
1. Check the complete documentation
2. Verify console logs
3. Test with provided scripts
4. Check Redis configuration

---

**Version** : 1.0.0  
**Last updated** : December 2024  
**Maintained by** : YouCode Team
