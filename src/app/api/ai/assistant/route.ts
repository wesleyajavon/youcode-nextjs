import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { grokAPI } from '@/lib/grok-api';
import { CacheManager, withSmartChatCache } from '@/lib/cache';

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
    // Note: Rate limiting will be implemented later with Redis
    // For now, we accept all requests

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
      'Response caching for similar questions'
    ]
  });
}