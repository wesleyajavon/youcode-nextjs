// Grok API module for YouCode AI Assistant
import { GROK_CONFIG } from './grok-config';

export interface GrokMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GrokRequest {
  model: string;
  messages: GrokMessage[];
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stream?: boolean;
}

export interface GrokResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface GrokError {
  error: {
    message: string;
    type: string;
    code: string;
  };
}

export class GrokAPI {
  private apiKey: string | undefined;
  private conversationHistory: GrokMessage[] = [];

  constructor() {
    this.apiKey = process.env.GROK_API_KEY;
    this.initializeConversation();
  }

  /**
   * Initialize conversation with system message
   */
  private initializeConversation(): void {
    this.conversationHistory = [
      {
        role: 'system',
        content: GROK_CONFIG.systemPrompts.default
      }
    ];
  }

  /**
   * Generate response via Grok API
   */
  async generateResponse(
    userMessage: string,
    context?: {
      courseName?: string;
      lessonName?: string;
      userLevel?: 'beginner' | 'intermediate' | 'advanced';
      topic?: string;
    }
  ): Promise<string> {
    if (!this.apiKey) {
      console.warn('⚠️ GROK_API_KEY not configured, using simulated responses');
      return this.generateSimulatedResponse(userMessage, context);
    }

    try {
      // Adapt system message based on context
      this.adaptSystemPrompt(context);
      
      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: userMessage
      });

      // Call Grok API
      const response = await this.callGrokAPI();
      
      if (response) {
        // Add response to history
        this.conversationHistory.push({
          role: 'assistant',
          content: response
        });

        // Limit conversation history size
        this.trimConversationHistory();
        
        return response;
      }

      // Fallback to simulated responses
      return this.generateSimulatedResponse(userMessage, context);

    } catch (error) {
      console.error('❌ Error calling Grok:', error);
      return this.generateSimulatedResponse(userMessage, context);
    }
  }

  /**
   * Call Grok API
   */
  private async callGrokAPI(): Promise<string | null> {
    try {
      const requestBody: GrokRequest = {
        model: GROK_CONFIG.models.default,
        messages: this.conversationHistory,
        max_tokens: GROK_CONFIG.generation.maxTokens,
        temperature: GROK_CONFIG.generation.temperature,
        top_p: GROK_CONFIG.generation.topP,
        frequency_penalty: GROK_CONFIG.generation.frequencyPenalty,
        presence_penalty: GROK_CONFIG.generation.presencePenalty,
        stream: false
      };

      console.log('🌐 Calling Grok API...');
      
      const response = await fetch(`${GROK_CONFIG.apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          ...GROK_CONFIG.headers,
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData: GrokError = await response.json();
        console.error(`❌ Grok error: ${response.status} - ${errorData.error.message}`);
        return null;
      }

      const data: GrokResponse = await response.json();
      
      console.log('✅ Grok response received');

      if (data.choices && data.choices.length > 0) {
        const rawResponse = data.choices[0].message.content;
        return this.cleanGrokResponse(rawResponse);
      }

      return null;

    } catch (error) {
      console.error('❌ Error calling Grok:', error);
      return null;
    }
  }

  /**
   * Adapt system message based on context
   */
  private adaptSystemPrompt(context?: {
    courseName?: string;
    lessonName?: string;
    userLevel?: string;
    topic?: string;
  }): void {
    let systemPrompt = GROK_CONFIG.systemPrompts.default;

    if (context?.courseName) {
      systemPrompt += `\n\nCurrent context: Course "${context.courseName}"`;
    }

    if (context?.lessonName) {
      systemPrompt += `\nCurrent lesson: "${context.lessonName}"`;
    }

    if (context?.userLevel) {
      systemPrompt += `\nUser level: ${context.userLevel}`;
    }

    if (context?.topic) {
      systemPrompt += `\nTopic covered: ${context.topic}`;
    }

    // Update first system message
    if (this.conversationHistory.length > 0) {
      this.conversationHistory[0].content = systemPrompt;
    }
  }

  /**
   * Limit conversation history size
   */
  private trimConversationHistory(): void {
    const maxMessages = GROK_CONFIG.limits.maxConversationLength;
    
    if (this.conversationHistory.length > maxMessages) {
      // Keep system message and recent messages
      const systemMessage = this.conversationHistory[0];
      const recentMessages = this.conversationHistory.slice(-maxMessages + 1);
      this.conversationHistory = [systemMessage, ...recentMessages];
    }
  }

  /**
   * Clean Grok responses specifically
   */
  private cleanGrokResponse(response: string): string {
    let cleaned = response;
    
    // Remove excessive greetings
    cleaned = cleaned.replace(/^Hello\s*!?\s*😊?\s*/i, '');
    cleaned = cleaned.replace(/^Hi\s*!?\s*/i, '');
    cleaned = cleaned.replace(/^Hey\s*!?\s*/i, '');
    
    // Remove verbose introduction phrases
    cleaned = cleaned.replace(/^I'm happy to guide you.*?programming\s*!?\s*🚀?\s*/i, '');
    cleaned = cleaned.replace(/^I'm here to help you.*?programming\s*!?\s*/i, '');
    
    // Remove excessive rhetorical questions
    cleaned = cleaned.replace(/^Before we start.*?🤔\s*/i, '');
    cleaned = cleaned.replace(/^What do you want to learn.*?🤔\s*/i, '');
    
    // Remove excessive numbered lists (compatible approach)
    cleaned = cleaned.replace(/^\d+\.\s*\*\*[^*]+\*\*.*$/gm, '');
    
    // Remove notes in parentheses
    cleaned = cleaned.replace(/\s*\([^)]*\)/g, '');
    
    // Remove excessive emojis (keep only 1-2)
    cleaned = cleaned.replace(/([🚀💻📚🎯✨🔐📱⚛️🎨🐍🌐]){2,}/g, '$1');
    
    // Remove multiple line breaks
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
    
    // Remove leading and trailing spaces
    cleaned = cleaned.trim();
    
    // If response is too short after cleaning, restore it partially
    if (cleaned.length < 20) {
      // Keep only first useful sentence
      const sentences = response.split(/[.!?]/);
      const firstUsefulSentence = sentences.find(s => 
        s.trim().length > 10 && 
        !s.includes('Hello') && 
        !s.includes('Hi') && 
        !s.includes('Hey')
      );
      
      if (firstUsefulSentence) {
        cleaned = firstUsefulSentence.trim() + '.';
      }
    }
    
    return cleaned;
  }

  /**
   * Generate intelligent simulated response (fallback)
   */
  private generateSimulatedResponse(
    prompt: string, 
    context?: {
      courseName?: string;
      lessonName?: string;
      userLevel?: string;
      topic?: string;
    }
  ): string {
    const lowerPrompt = prompt.toLowerCase();
    
    // Intelligent contextual responses
    if (lowerPrompt.includes('javascript') || lowerPrompt.includes('js')) {
      return "JavaScript is an excellent language to start with! It's the language of the modern web. On YouCode, we have JavaScript courses that will take you from beginner to confirmed web developer. Would you like to start with the basics? 🌐";
    }
    
    if (lowerPrompt.includes('python')) {
      return "Python is perfect for beginners! It's a powerful and readable language, ideal for machine learning, data science, and web development. We have progressive Python courses on YouCode. 🐍";
    }
    
    if (lowerPrompt.includes('react') || lowerPrompt.includes('vue') || lowerPrompt.includes('angular')) {
      return "Modern frontend frameworks like React, Vue and Angular are excellent for creating interactive web applications! We have dedicated courses for these technologies on YouCode. Which framework interests you? ⚛️";
    }
    
    if (lowerPrompt.includes('login') || lowerPrompt.includes('sign in')) {
      return "To sign in to YouCode, use the login button at the top right. You can create a free account or sign in with Google. Once logged in, you'll have access to all courses and features! 🔐";
    }
    
    if (lowerPrompt.includes('course')) {
      if (lowerPrompt.includes('javascript') || lowerPrompt.includes('js')) {
        return "For JavaScript courses on YouCode, we have several options depending on your level. We offer beginner, intermediate and advanced courses. Would you like me to guide you to the course that best suits you? 🌐";
      }
      return "Courses on YouCode are organized by level and technology. You can browse the catalog, join courses that match your needs, and track your progress. 📚";
    }
    
    if (lowerPrompt.includes('hello') || lowerPrompt.includes('hi') || lowerPrompt.includes('hey')) {
      return "Hello! I'm your YouCode AI assistant. I'm here to help you with your programming questions and guide you in your learning. How can I be useful to you today? 🚀";
    }
    
    // Default contextual response
    if (context?.courseName) {
      return `Great question about the course "${context.courseName}"! I'm your YouCode AI assistant, specialized in programming. I can help you with this specific course or any other programming question. What would you like to know? 💻`;
    }
    
    return "Great question! I'm your YouCode AI assistant, specialized in programming learning. I can help you with courses, lessons, code concepts, or any other question about the platform. 🚀";
  }

  /**
   * Check if API is accessible
   */
  async healthCheck(): Promise<boolean> {
    try {
      if (!this.apiKey) return false;
      
      const response = await fetch(`${GROK_CONFIG.apiUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });
      return response.ok;
    } catch (error) {
      console.error('Grok health check error:', error);
      return false;
    }
  }

  /**
   * Clear conversation history
   */
  clearConversation(): void {
    this.initializeConversation();
  }

  /**
   * Get conversation history
   */
  getConversationHistory(): GrokMessage[] {
    return [...this.conversationHistory];
  }
}

// Singleton instance
export const grokAPI = new GrokAPI();
