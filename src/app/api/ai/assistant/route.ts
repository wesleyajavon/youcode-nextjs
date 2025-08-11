import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { grokAPI } from '@/lib/grok-api';

// Schéma de validation pour les messages
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
    // Note: La limitation de taux sera implémentée plus tard avec Redis
    // Pour l'instant, on accepte toutes les requêtes

    // Validation du corps de la requête
    const body = await request.json();

    const validatedData = requestSchema.parse(body);

    // Vérification de la clé API Grok (optionnelle, car fallback disponible)
    const grokApiKey = process.env.GROK_API_KEY;
    if (!grokApiKey) {
      console.warn('GROK_API_KEY non configurée, utilisation des réponses simulées');
      // On continue avec les réponses simulées, pas d'erreur
    }

    // Préparation du contexte pour Grok
    const context = {
      courseName: validatedData.courseContext,
      lessonName: validatedData.lessonContext,
      userLevel: validatedData.userLevel || 'beginner',
      topic: 'programming'
    };

    // console.log(context);

    // Récupération du dernier message utilisateur
    const lastUserMessage = validatedData.messages
      .filter(msg => msg.role === 'user')
      .pop()?.content || '';

    if (!lastUserMessage) {
      return NextResponse.json(
        { error: 'Aucun message utilisateur trouvé' },
        { status: 400 }
      );
    }

    // Appel à l'API Grok
    try {
      const response = await grokAPI.generateResponse(lastUserMessage, context);

      // Option 1: Retourner directement le texte brut pour le streaming
      return new Response(response, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      });

    } catch (error) {
      console.error('Erreur Grok:', error);
      return new Response('Erreur lors de la génération de la réponse', {
        status: 500,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      });
    }

  } catch (error) {
    console.error('Erreur dans l\'API assistant:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données de requête invalides' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// Méthode GET pour tester l'API
export async function GET() {
  return NextResponse.json({
    message: 'API Assistant IA YouCode avec Grok - Opérationnelle',
    status: 'active',
    provider: 'grok',
    features: [
      'Conversations contextuelles',
      'Support multilingue',
      'Fallback intelligent',
      'Gestion d\'historique'
    ]
  });
}