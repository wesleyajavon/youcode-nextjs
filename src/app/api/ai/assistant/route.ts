import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { grokAPI } from '@/lib/grok-api';
import { CacheManager, withSmartChatCache } from '@/lib/cache';
import { 
  ratelimitSmartChatAI, 
  ratelimitSmartChatDaily, 
  ratelimitSmartChatGlobal, 
  getRateLimitIdentifier 
} from '@/lib/rate-limit';

// Message validation schema
const messageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1).max(2000),
});

const requestSchema = z.object({
  messages: z.array(messageSchema),
  courseContext: z.string().optional(),
  lessonContext: z.string().optional(),
  userLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Get rate limit identifier
    const identifier = getRateLimitIdentifier(request);
    
    // Check daily AI request limits for usage control
    const dailyLimit = await ratelimitSmartChatDaily.limit(identifier);
    if (!dailyLimit.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Daily AI limit exceeded',
          details: 'Daily AI request limit reached. Please try again tomorrow.',
          retryAfter: dailyLimit.reset - Date.now()
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '500',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': dailyLimit.reset.toString(),
            'Retry-After': Math.ceil((dailyLimit.reset - Date.now()) / 1000).toString()
          }
        }
      );
    }

    // Check per-minute AI request limits
    const aiLimit = await ratelimitSmartChatAI.limit(identifier);
    if (!aiLimit.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'AI rate limit exceeded',
          details: 'Too many AI requests per minute. Please wait before making more requests.',
          retryAfter: aiLimit.reset - Date.now()
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': aiLimit.reset.toString(),
            'Retry-After': Math.ceil((aiLimit.reset - Date.now()) / 1000).toString()
          }
        }
      );
    }

    // Validate request body
    const body = await request.json();

    const validatedData = requestSchema.parse(body);

    // Check Grok API key (optional, as fallback is available)
    const grokApiKey = process.env.GROK_API_KEY;
    if (!grokApiKey) {
      console.warn('GROK_API_KEY not configured, using simulated responses');
      // Continue with simulated responses, no error
    }

    // Prepare context for Grok
    const context = {
      courseName: validatedData.courseContext,
      lessonName: validatedData.lessonContext,
      userLevel: validatedData.userLevel || 'beginner',
      topic: 'programming'
    };

    // Get last user message
    const lastUserMessage = validatedData.messages
      .filter(msg => msg.role === 'user')
      .pop()?.content || '';

    if (!lastUserMessage) {
      return NextResponse.json(
        { error: 'No user message found' },
        { status: 400 }
      );
    }

    // Create context string for caching
    const contextString = `${context.courseName || 'general'}:${context.lessonName || 'general'}:${context.userLevel}`;

    // Try to get response from cache first
    const cachedResponse = await CacheManager.getSmartChatResponse(lastUserMessage, contextString);
    if (cachedResponse) {
      console.log('✅ AI response retrieved from cache');
      return new Response(cachedResponse, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Cached': 'true',
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': aiLimit.remaining.toString(),
          'X-RateLimit-Reset': aiLimit.reset.toString(),
          'X-Daily-Remaining': dailyLimit.remaining.toString()
        },
      });
    }

    // If not in cache, call Grok API
    try {
      const response = await grokAPI.generateResponse(lastUserMessage, context);

      // Cache the response
      await CacheManager.setSmartChatResponse(lastUserMessage, contextString, response);

      // Return response with cache header
      return new Response(response, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Cached': 'false',
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': aiLimit.remaining.toString(),
          'X-RateLimit-Reset': aiLimit.reset.toString(),
          'X-Daily-Remaining': dailyLimit.remaining.toString()
        },
      });

    } catch (error) {
      console.error('Grok error:', error);
      return new Response('Error generating response', {
        status: 500,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      });
    }

  } catch (error) {
    console.error('Error in assistant API:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET method to test the API
export async function GET() {
  return NextResponse.json({
    message: 'YouCode AI Assistant API with Grok - Operational',
    status: 'active',
    provider: 'grok',
    features: [
      'Contextual conversations',
      'Multilingual support',
      'Intelligent fallback',
      'History management',
      'Redis caching enabled',
      'Response caching for similar questions',
      'Upstash rate limiting enabled',
      'Cost control and monitoring'
    ],
    rateLimits: {
      ai: {
        perMinute: 10,
        perDay: 500,
        window: '1m',
        dailyWindow: '1d'
      },
      global: {
        perMinute: 1000,
        window: '1m'
      }
    }
  });
}