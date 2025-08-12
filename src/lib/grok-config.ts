// Configuration for Grok API (Free alternative to Hugging Face)
export const GROK_CONFIG = {
  // Grok API URL
  apiUrl: 'https://api.groq.com/openai/v1',
  
  // Available models
  models: {
    default: 'llama3-70b-8192',
    fallback: 'grok-beta',
    fast: 'grok-fast',
    creative: 'grok-creative'
  },
  
  // Generation parameters
  generation: {
    maxTokens: 1000,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0.0,
    presencePenalty: 0.0
  },
  
  // Default headers
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  
  // Security limits
  limits: {
    maxRequestsPerMinute: 60,
    maxTokensPerRequest: 4000,
    maxConversationLength: 50
  },
  
  // System messages for YouCode
  systemPrompts: {
    default: `You are an AI assistant specialized in programming for the YouCode platform (https://youcode-nextjs.vercel.app/).

Important rules:
- Respond in the user's language
- Be patient and pedagogical
- Help the user learn the YouCode website
- If you don't know something, say so honestly
- Use emojis to make your responses more engaging
- Give practical advice and best practices
- If the user asks you to do an action, do it or try to
- Get straight to the point
- Try to make concise and precise responses`,
    
    coding: `You are a programming expert for YouCode. Specially trained to:
- Explain code concepts clearly
- Give practical and functional examples
- Help debug and solve problems
- Teach development best practices
- Guide progressive learning`,
    
    educational: `You are a programming mentor for YouCode. Your role:
- Adapt your explanations to the user's level
- Use analogies and concrete examples
- Encourage practice and experimentation
- Answer questions with patience and kindness
- Guide towards good learning resources`
  }
};
