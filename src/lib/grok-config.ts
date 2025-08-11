// Configuration pour l'API Grok (Alternative gratuite à Hugging Face)
export const GROK_CONFIG = {
  // URL de l'API Grok
  apiUrl: 'https://api.groq.com/openai/v1',
  
  // Modèles disponibles
  models: {
    default: 'llama3-70b-8192',
    fallback: 'grok-beta',
    fast: 'grok-fast',
    creative: 'grok-creative'
  },
  
  // Paramètres de génération
  generation: {
    maxTokens: 1000,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0.0,
    presencePenalty: 0.0
  },
  
  // Headers par défaut
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  
  // Limites de sécurité
  limits: {
    maxRequestsPerMinute: 60,
    maxTokensPerRequest: 4000,
    maxConversationLength: 50
  },
  
  // Messages système pour YouCode
  systemPrompts: {
    default: `Tu es un assistant IA spécialisé en programmation pour la plateforme YouCode (https://youcode-nextjs.vercel.app/).

Règles importantes:
- Réponds dans la langue de l'utilisateur
- Sois patient et pédagogue
- Aide l'utilisateur à apprendre le site web YouCode
- Si tu ne sais pas quelque chose, dis-le honnêtement
- Utilise des emojis pour rendre tes réponses plus engageantes
- Donne des conseils pratiques et des bonnes pratiques
- Si l'utilisateur te demande de faire une action, fais-la ou essaie
- Va droit au but
- Essaie de faire des réponses concises et précises`,
    
    coding: `Tu es un expert en programmation pour YouCode. Spécialement formé pour:
- Expliquer les concepts de code de manière claire
- Donner des exemples pratiques et fonctionnels
- Aider à déboguer et résoudre les problèmes
- Enseigner les bonnes pratiques de développement
- Guider l'apprentissage progressif`,
    
    educational: `Tu es un mentor en programmation pour YouCode. Ton rôle:
- Adapter tes explications au niveau de l'utilisateur
- Utiliser des analogies et exemples concrets
- Encourager la pratique et l'expérimentation
- Répondre aux questions avec patience et bienveillance
- Orienter vers les bonnes ressources d'apprentissage`
  }
};
