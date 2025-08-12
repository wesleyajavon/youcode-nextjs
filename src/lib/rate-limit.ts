import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

// Existing rate limiters
export const ratelimitlesson = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1h"), // 5 requests per hour
});

export const ratelimitpresentation = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1h"), // 10 requests per hour
});

// SmartChat rate limiters
export const ratelimitSmartChatContext = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "1m"), // 30 context requests per minute
});

export const ratelimitSmartChatAI = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1m"), // 10 AI requests per minute
});

export const ratelimitSmartChatGeneral = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "1m"), // 20 general requests per minute
});

// Daily limits for usage control (not cost)
export const ratelimitSmartChatDaily = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(500, "1d"), // 500 AI requests per day
});

// Global rate limiter for system protection
export const ratelimitSmartChatGlobal = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1000, "1m"), // 1000 total requests per minute
});

// Helper function to extract user identifier from request
export function getRateLimitIdentifier(request: Request): string {
  // Try to get user ID from headers
  const userId = request.headers.get('x-user-id');
  if (userId) return `user:${userId}`;
  
  // Try to get from authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    return `jwt:${token.substring(0, 8)}`;
  }
  
  // Fallback to IP-based identification
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = realIp || forwardedFor?.split(',')[0] || 'unknown';
  
  return `ip:${ip}`;
}

// Rate limiting configuration
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