import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { CacheManager, withSmartChatCache } from '@/lib/cache';
import { 
  ratelimitSmartChatContext, 
  ratelimitSmartChatGlobal, 
  getRateLimitIdentifier 
} from '@/lib/rate-limit';

// Validation schema for the request
const contextRequestSchema = z.object({
  url: z.string().url(),
});

export async function POST(request: NextRequest) {
  try {
    // Get rate limit identifier
    const identifier = getRateLimitIdentifier(request);
    
    // Check global rate limits first
    const globalLimit = await ratelimitSmartChatGlobal.limit('global');
    if (!globalLimit.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Global rate limit exceeded',
          details: 'Too many requests across all users. Please try again later.',
          retryAfter: globalLimit.reset - Date.now()
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '1000',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': globalLimit.reset.toString(),
            'Retry-After': Math.ceil((globalLimit.reset - Date.now()) / 1000).toString()
          }
        }
      );
    }

    // Check user-specific context rate limits
    const contextLimit = await ratelimitSmartChatContext.limit(identifier);
    if (!contextLimit.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Rate limit exceeded',
          details: 'Too many context requests. Please wait before making more requests.',
          retryAfter: contextLimit.reset - Date.now()
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '30',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': contextLimit.reset.toString(),
            'Retry-After': Math.ceil((contextLimit.reset - Date.now()) / 1000).toString()
          }
        }
      );
    }

    const body = await request.json();
    const { url } = contextRequestSchema.parse(body);

    console.log('🔍 Extracting context from URL:', url);

    // Try to get context from cache first
    const cachedContext = await CacheManager.getSmartChatContext(url);
    if (cachedContext) {
      console.log('✅ Context retrieved from cache');
      return NextResponse.json({
        success: true,
        context: cachedContext,
        cached: true,
        rateLimit: {
          remaining: contextLimit.remaining,
          resetTime: contextLimit.reset
        }
      }, {
        headers: {
          'X-RateLimit-Limit': '30',
          'X-RateLimit-Remaining': contextLimit.remaining.toString(),
          'X-RateLimit-Reset': contextLimit.reset.toString()
        }
      });
    }

    // If not in cache, extract context from URL
    const context = await extractContextFromURL(url);
    
    // Cache the extracted context
    await CacheManager.setSmartChatContext(url, context);
    
    console.log('🎯 Context extracted and cached:', context);

    return NextResponse.json({
      success: true,
      context,
      cached: false,
      rateLimit: {
        remaining: contextLimit.remaining,
        resetTime: contextLimit.reset
      }
    }, {
      headers: {
        'X-RateLimit-Limit': '30',
        'X-RateLimit-Remaining': contextLimit.remaining.toString(),
        'X-RateLimit-Reset': contextLimit.reset.toString()
      }
    });

  } catch (error) {
    console.error('❌ Error in context API:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid URL provided' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Extract context from URL with caching
async function extractContextFromURL(url: string) {
  // Regex to extract course ID and lesson ID
  const courseMatch = url.match(/\/courses\/([a-zA-Z0-9]+)/);
  const lessonMatch = url.match(/\/lessons\/([a-zA-Z0-9]+)/);

  const courseId = courseMatch ? courseMatch[1] : null;
  const lessonId = lessonMatch ? lessonMatch[1] : null;

  console.log('📚 Course ID found:', courseId);
  console.log('📖 Lesson ID found:', lessonId);

  let courseContext = '';
  let lessonContext = '';

  // Get course information if available
  if (courseId) {
    try {
      const course = await prisma.course.findUnique({
        where: { id: courseId },
        select: {
          name: true,
          presentation: true,
        },
      });

      if (course) {
        courseContext = course.name;
        console.log('✅ Course found:', course.name);
      } else {
        console.log('⚠️ Course not found for ID:', courseId);
      }
    } catch (error) {
      console.error('❌ Error retrieving course:', error);
    }
  }

  // Get lesson information if available
  if (lessonId) {
    try {
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        select: {
          name: true,
          content: true,
        },
      });

      if (lesson) {
        lessonContext = lesson.name;
        console.log('✅ Lesson found:', lesson.name);
      } else {
        console.log('⚠️ Lesson not found for ID:', lessonId);
      }
    } catch (error) {
      console.error('❌ Error retrieving lesson:', error);
    }
  }

  return {
    courseContext,
    lessonContext,
    courseId: courseId || null,
    lessonId: lessonId || null,
    url,
  };
}

// GET method to test the API
export async function GET() {
  return NextResponse.json({
    message: 'YouCode AI Context API - Operational',
    status: 'active',
    features: [
      'Redis caching enabled',
      'Upstash rate limiting enabled',
      'Context extraction from URLs',
      'Course and lesson context',
      'Automatic cache invalidation'
    ],
    rateLimits: {
      context: {
        perMinute: 30,
        window: '1m'
      },
      global: {
        perMinute: 1000,
        window: '1m'
      }
    },
    usage: 'POST with { "url": "your_youcode_url" }',
    example: {
      url: 'http://localhost:3000/user/courses/cme0frc370015a2lkfm0m5fr2/lessons/cme0frduf004da2lkio658dk7',
      expectedContext: {
        courseContext: 'Course Title',
        lessonContext: 'Lesson Title',
        courseId: 'cme0frc370015a2lkfm0m5fr2',
        lessonId: 'cme0frduf004da2lkio658dk7'
      }
    }
  });
}
