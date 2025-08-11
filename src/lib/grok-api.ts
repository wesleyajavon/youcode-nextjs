// Module API Grok pour l'Assistant IA YouCode
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
   * Initialise la conversation avec le message système
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
   * Génère une réponse via l'API Grok
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
      console.warn('⚠️ GROK_API_KEY non configurée, utilisation des réponses simulées');
      return this.generateSimulatedResponse(userMessage, context);
    }

    try {
      // Adapter le message système selon le contexte
      this.adaptSystemPrompt(context);
      
      // Ajouter le message utilisateur à l'historique
      this.conversationHistory.push({
        role: 'user',
        content: userMessage
      });

      // Appeler l'API Grok
      const response = await this.callGrokAPI();
      
      if (response) {
        // Ajouter la réponse à l'historique
        this.conversationHistory.push({
          role: 'assistant',
          content: response
        });

        // Limiter la taille de l'historique
        this.trimConversationHistory();
        
        return response;
      }

      // Fallback vers les réponses simulées
      return this.generateSimulatedResponse(userMessage, context);

    } catch (error) {
      console.error('❌ Erreur lors de l\'appel à Grok:', error);
      return this.generateSimulatedResponse(userMessage, context);
    }
  }

  /**
   * Appelle l'API Grok
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

      console.log('🌐 Appel API Grok...');
      
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
        console.error(`❌ Erreur Grok: ${response.status} - ${errorData.error.message}`);
        return null;
      }

      const data: GrokResponse = await response.json();
      
      console.log('✅ Réponse Grok reçue');

      if (data.choices && data.choices.length > 0) {
        const rawResponse = data.choices[0].message.content;
        return this.cleanGrokResponse(rawResponse);
      }

      return null;

    } catch (error) {
      console.error('❌ Erreur lors de l\'appel à Grok:', error);
      return null;
    }
  }

  /**
   * Adapte le message système selon le contexte
   */
  private adaptSystemPrompt(context?: {
    courseName?: string;
    lessonName?: string;
    userLevel?: string;
    topic?: string;
  }): void {
    let systemPrompt = GROK_CONFIG.systemPrompts.default;

    if (context?.courseName) {
      systemPrompt += `\n\nContexte actuel: Cours "${context.courseName}"`;
    }

    if (context?.lessonName) {
      systemPrompt += `\nLeçon actuelle: "${context.lessonName}"`;
    }

    if (context?.userLevel) {
      systemPrompt += `\nNiveau de l'utilisateur: ${context.userLevel}`;
    }

    if (context?.topic) {
      systemPrompt += `\nSujet abordé: ${context.topic}`;
    }

    // Mettre à jour le premier message système
    if (this.conversationHistory.length > 0) {
      this.conversationHistory[0].content = systemPrompt;
    }
  }

  /**
   * Limite la taille de l'historique de conversation
   */
  private trimConversationHistory(): void {
    const maxMessages = GROK_CONFIG.limits.maxConversationLength;
    
    if (this.conversationHistory.length > maxMessages) {
      // Garder le message système et les derniers messages
      const systemMessage = this.conversationHistory[0];
      const recentMessages = this.conversationHistory.slice(-maxMessages + 1);
      this.conversationHistory = [systemMessage, ...recentMessages];
    }
  }

  /**
   * Nettoie spécifiquement les réponses Grok
   */
  private cleanGrokResponse(response: string): string {
    let cleaned = response;
    
    // Supprimer les salutations excessives
    cleaned = cleaned.replace(/^Bonjour\s*!?\s*😊?\s*/i, '');
    cleaned = cleaned.replace(/^Salut\s*!?\s*/i, '');
    cleaned = cleaned.replace(/^Hello\s*!?\s*/i, '');
    
    // Supprimer les phrases d'introduction verbeuses
    cleaned = cleaned.replace(/^Je suis ravi de te guider.*?programmation\s*!?\s*🚀?\s*/i, '');
    cleaned = cleaned.replace(/^Je suis là pour t'aider.*?programmation\s*!?\s*/i, '');
    
    // Supprimer les questions rhétoriques excessives
    cleaned = cleaned.replace(/^Avant de commencer.*?🤔\s*/i, '');
    cleaned = cleaned.replace(/^Qu'est-ce que tu veux apprendre.*?🤔\s*/i, '');
    
    // Supprimer les listes numérotées excessives (approche compatible)
    cleaned = cleaned.replace(/^\d+\.\s*\*\*[^*]+\*\*.*$/gm, '');
    
    // Supprimer les notes entre parenthèses
    cleaned = cleaned.replace(/\s*\([^)]*\)/g, '');
    
    // Supprimer les emojis excessifs (garder seulement 1-2)
    cleaned = cleaned.replace(/([🚀💻📚🎯✨🔐📱⚛️🎨🐍🌐]){2,}/g, '$1');
    
    // Supprimer les sauts de ligne multiples
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
    
    // Supprimer les espaces en début et fin
    cleaned = cleaned.trim();
    
    // Si la réponse est trop courte après nettoyage, la restaurer partiellement
    if (cleaned.length < 20) {
      // Garder seulement la première phrase utile
      const sentences = response.split(/[.!?]/);
      const firstUsefulSentence = sentences.find(s => 
        s.trim().length > 10 && 
        !s.includes('Bonjour') && 
        !s.includes('Salut') && 
        !s.includes('Hello')
      );
      
      if (firstUsefulSentence) {
        cleaned = firstUsefulSentence.trim() + '.';
      }
    }
    
    return cleaned;
  }

  /**
   * Génère une réponse simulée intelligente (fallback)
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
    
    // Réponses contextuelles intelligentes
    if (lowerPrompt.includes('javascript') || lowerPrompt.includes('js')) {
      return "JavaScript est un excellent langage pour débuter ! C'est le langage du web moderne. Sur YouCode, nous avons des cours JavaScript qui vous feront passer de débutant à développeur web confirmé. Voulez-vous commencer par les bases ? 🌐";
    }
    
    if (lowerPrompt.includes('python')) {
      return "Python est parfait pour les débutants ! C'est un langage puissant et lisible, idéal pour l'apprentissage automatique, la science des données et le développement web. Nous avons des cours Python progressifs sur YouCode. 🐍";
    }
    
    if (lowerPrompt.includes('react') || lowerPrompt.includes('vue') || lowerPrompt.includes('angular')) {
      return "Les frameworks frontend modernes comme React, Vue et Angular sont excellents pour créer des applications web interactives ! Nous avons des cours dédiés à ces technologies sur YouCode. Quel framework vous intéresse ? ⚛️";
    }
    
    if (lowerPrompt.includes('connexion') || lowerPrompt.includes('connecter')) {
      return "Pour vous connecter à YouCode, utilisez le bouton de connexion en haut à droite. Vous pouvez créer un compte gratuitement ou vous connecter avec Google. Une fois connecté, vous aurez accès à tous les cours et fonctionnalités ! 🔐";
    }
    
    if (lowerPrompt.includes('cours') || lowerPrompt.includes('course')) {
      if (lowerPrompt.includes('javascript') || lowerPrompt.includes('js')) {
        return "Pour les cours JavaScript sur YouCode, nous avons plusieurs options selon votre niveau. Nous proposons des cours débutant, intermédiaire et avancé. Voulez-vous que je vous guide vers le cours qui vous convient le mieux ? 🌐";
      }
      return "Les cours sur YouCode sont organisés par niveau et par technologie. Vous pouvez parcourir le catalogue, rejoindre des cours qui correspondent à vos besoins, et suivre votre progression. 📚";
    }
    
    if (lowerPrompt.includes('bonjour') || lowerPrompt.includes('hello') || lowerPrompt.includes('salut')) {
      return "Bonjour ! Je suis votre assistant IA YouCode. Je suis là pour vous aider avec vos questions de programmation et vous guider dans votre apprentissage. Comment puis-je vous être utile aujourd'hui ? 🚀";
    }
    
    // Réponse par défaut contextuelle
    if (context?.courseName) {
      return `Excellente question sur le cours "${context.courseName}" ! Je suis votre assistant IA YouCode, spécialisé en programmation. Je peux vous aider avec ce cours spécifique ou toute autre question de programmation. Que souhaitez-vous savoir ? 💻`;
    }
    
    return "Excellente question ! Je suis votre assistant IA YouCode, spécialisé dans l'apprentissage de la programmation. Je peux vous aider avec les cours, les leçons, les concepts de code, ou toute autre question sur la plateforme. 🚀";
  }

  /**
   * Vérifie si l'API est accessible
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
      console.error('Erreur de santé Grok:', error);
      return false;
    }
  }

  /**
   * Efface l'historique de conversation
   */
  clearConversation(): void {
    this.initializeConversation();
  }

  /**
   * Obtient l'historique de conversation
   */
  getConversationHistory(): GrokMessage[] {
    return [...this.conversationHistory];
  }
}

// Instance singleton
export const grokAPI = new GrokAPI();
