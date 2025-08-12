// Configuration pour l'Assistant IA YouCode
export const AI_CONFIG = {
  // Modèle OpenAI à utiliser
  model: 'gpt-4o',
  
  // Paramètres de génération
  generation: {
    maxTokens: 1000,
    temperature: 0.7,
    topP: 0.9,
  },
  
  // Messages d'accueil personnalisés
  welcomeMessages: {
    default: "Bonjour ! Je suis ton assistant IA spécialisé en programmation pour la plateforme YouCode. Je peux t'aider avec tes questions de programmation ! 🚀",
    withCourse: "Bonjour ! Je suis ton assistant IA spécialisé en programmation pour la plateforme YouCode. Je peux t'aider avec le cours \"{courseName}\". Pose-moi tes questions ! 🚀",
  },
  
  // Instructions système
  systemPrompt: {
    default: `Tu es un assistant IA spécialisé en programmation pour la plateforme YouCode.

Règles importantes:
- Réponds toujours en français
- Sois patient et pédagogue
- Donne des exemples concrets de code
- Explique les concepts étape par étape
- Encourage l'apprentissage pratique
- Si tu ne sais pas quelque chose, dis-le honnêtement
- Utilise des emojis pour rendre tes réponses plus engageantes
- Donne des conseils pratiques et des bonnes pratiques`,
    
    withCourse: `Tu es un assistant IA spécialisé en programmation pour la plateforme YouCode.
Contexte du cours actuel: {courseContext}

Règles importantes:
- Réponds toujours en français
- Sois patient et pédagogue
- Donne des exemples concrets de code
- Explique les concepts étape par étape
- Encourage l'apprentissage pratique
- Si tu ne sais pas quelque chose, dis-le honnêtement
- Utilise des emojis pour rendre tes réponses plus engageantes
- Donne des conseils pratiques et des bonnes pratiques
- Adapte tes réponses au contexte du cours en cours`,
  },
  
  // Limites de sécurité
  safety: {
    maxMessagesPerSession: 50,
    maxTokensPerMessage: 2000,
    rateLimitPerMinute: 10,
  },
  
  // Fonctionnalités disponibles
  features: {
    codeGeneration: true,
    codeExplanation: true,
    debuggingHelp: true,
    bestPractices: true,
    learningPath: true,
  }
};
